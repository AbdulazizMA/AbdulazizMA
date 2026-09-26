'use strict';

// Transport-neutral API: the same code serves the Node HTTP server (app.js)
// and the in-browser demo build (scripts/build-demo.js).
const { indexListing, textSearch } = require('./db');
const { CATEGORIES, CITIES, validateAttrs } = require('./catalog');
const { hashPassword, verifyPassword, normalizePhone, isValidSaudiId, detectRisk, escrowFee, randomHex } = require('./trust');
const { priceInsight } = require('./pricing');

const SESSION_TTL = 30 * 24 * 3600 * 1000;
const DAY = 24 * 3600 * 1000;
const PAGE_SIZE = 24;
const MAX_IMAGE = 2 * 1024 * 1024;
const MAX_IMAGES = 10;

class HttpError extends Error {
  constructor(status, code) {
    super(code);
    this.status = status;
    this.code = code;
  }
}
const fail = (status, code) => { throw new HttpError(status, code); };

// storeImage(id, binaryString, mime) persists an upload; imageUrl(id) returns where the client can load it.
function createApi({ db, storeImage, imageUrl }) {
  const q = (sql) => db.prepare(sql);
  const tx = (fn) => {
    db.exec('BEGIN');
    try { const r = fn(); db.exec('COMMIT'); return r; } catch (e) { db.exec('ROLLBACK'); throw e; }
  };

  // ---------- rate limiting (in-memory; swap for Redis when running multiple instances) ----------
  const buckets = new Map();
  function rateLimit(key, limit, windowMs) {
    const now = Date.now();
    let b = buckets.get(key);
    if (!b || b.reset < now) { b = { count: 0, reset: now + windowMs }; buckets.set(key, b); }
    if (++b.count > limit) fail(429, 'rate_limited');
    if (buckets.size > 50000) for (const [k, v] of buckets) if (v.reset < now) buckets.delete(k);
  }

  // ---------- serialization ----------
  function sellerSummary(userId) {
    const u = q('SELECT id, name, city, verified, is_dealer, created_at FROM users WHERE id = ?').get(userId);
    const r = q('SELECT COUNT(*) AS n, AVG(rating) AS avg FROM reviews WHERE seller_id = ?').get(userId);
    const sales = q("SELECT COUNT(*) AS n FROM orders WHERE seller_id = ? AND status = 'completed'").get(userId).n;
    return {
      id: u.id, name: u.name, city: u.city, verified: !!u.verified, is_dealer: !!u.is_dealer,
      member_since: u.created_at, rating: r.avg ? Math.round(r.avg * 10) / 10 : null, review_count: r.n, completed_sales: sales,
    };
  }

  function images(listingId) {
    return q('SELECT id FROM uploads WHERE listing_id = ? ORDER BY position').all(listingId).map((r) => imageUrl(r.id));
  }

  function serializeListing(l, { full = false, viewer = null } = {}) {
    const out = {
      id: l.id, category: l.category, title: l.title, price: l.price, city: l.city, status: l.status,
      attrs: JSON.parse(l.attrs), featured: l.featured_until > Date.now(), created_at: l.created_at,
      images: images(l.id), seller: sellerSummary(l.user_id),
    };
    if (full) {
      out.description = l.description;
      out.views = l.views;
      out.price_insight = priceInsight(db, l);
      out.favorited = viewer ? !!q('SELECT 1 FROM favorites WHERE user_id = ? AND listing_id = ?').get(viewer.id, l.id) : false;
      out.is_owner = viewer ? viewer.id === l.user_id : false;
    }
    return out;
  }

  function getListing(id) {
    return q('SELECT * FROM listings WHERE id = ?').get(Number(id)) || fail(404, 'not_found');
  }

  // ---------- search ----------
  function searchListings(params) {
    const where = ["l.status = 'active'"];
    const args = [];
    let from = 'listings l';
    if (params.q) {
      const m = textSearch(db, params.q);
      if (m) { from += m.join; where.push(m.where); args.push(...m.args); }
    }
    if (params.category) {
      if (!CATEGORIES[params.category]) fail(400, 'invalid_category');
      where.push('l.category = ?'); args.push(params.category);
      for (const [key, def] of Object.entries(CATEGORIES[params.category].attrs)) {
        const col = `json_extract(l.attrs, '$.${key}')`;
        if (def.type === 'int') {
          const lo = params[`attr.${key}_min`], hi = params[`attr.${key}_max`];
          if (lo) { where.push(`${col} >= ?`); args.push(Number(lo)); }
          if (hi) { where.push(`${col} <= ?`); args.push(Number(hi)); }
        } else if (params[`attr.${key}`]) {
          where.push(def.type === 'text' ? `lower(${col}) = lower(?)` : `${col} = ?`);
          args.push(String(params[`attr.${key}`]));
        }
      }
    }
    if (params.city) { where.push('l.city = ?'); args.push(params.city); }
    if (params.min) { where.push('l.price >= ?'); args.push(Number(params.min)); }
    if (params.max) { where.push('l.price <= ?'); args.push(Number(params.max)); }
    if (params.verified === '1') { where.push('l.user_id IN (SELECT id FROM users WHERE verified = 1)'); }
    if (params.user) { where.push('l.user_id = ?'); args.push(Number(params.user)); }
    if (params.after_id) { where.push('l.id > ?'); args.push(Number(params.after_id)); }

    const order = {
      price_asc: 'l.price IS NULL, l.price ASC',
      price_desc: 'l.price DESC',
      new: 'l.created_at DESC',
    }[params.sort] || 'l.created_at DESC';
    const page = Math.max(1, Number(params.page) || 1);
    const whereSql = where.join(' AND ');
    const total = q(`SELECT COUNT(*) AS n FROM ${from} WHERE ${whereSql}`).get(...args).n;
    const rows = q(`SELECT l.* FROM ${from} WHERE ${whereSql}
                    ORDER BY (l.featured_until > ?) DESC, ${order}, l.id DESC LIMIT ? OFFSET ?`)
      .all(...args, Date.now(), PAGE_SIZE, (page - 1) * PAGE_SIZE);
    return { total, page, page_size: PAGE_SIZE, items: rows.map((l) => serializeListing(l)) };
  }

  // ---------- input helpers ----------
  const str = (v, min, max, code) => {
    const s = typeof v === 'string' ? v.trim() : '';
    if (s.length < min || s.length > max) fail(400, code);
    return s;
  };
  const price = (v) => {
    if (v === null || v === undefined || v === '') return null;
    const n = Number(v);
    if (!Number.isInteger(n) || n < 0 || n > 1e9) fail(400, 'invalid_price');
    return n;
  };

  // ---------- routes ----------
  const routes = [];
  const route = (method, pattern, handler, opts = {}) => {
    const keys = [];
    const re = new RegExp('^' + pattern.replace(/:(\w+)/g, (_, k) => { keys.push(k); return '([^/]+)'; }) + '$');
    routes.push({ method, re, keys, handler, auth: opts.auth });
  };

  route('GET', '/api/meta', () => ({ categories: CATEGORIES, cities: CITIES }));

  route('POST', '/api/auth/register', ({ body, ip, setCookie }) => {
    rateLimit(`auth:${ip}`, 20, 10 * 60 * 1000);
    const name = str(body.name, 2, 40, 'invalid_name');
    const phone = normalizePhone(body.phone) || fail(400, 'invalid_phone');
    const password = typeof body.password === 'string' && body.password.length >= 8 && body.password.length <= 200 ? body.password : fail(400, 'weak_password');
    const city = CITIES[body.city] ? body.city : null;
    if (q('SELECT 1 FROM users WHERE phone = ?').get(phone)) fail(409, 'phone_taken');
    // Production: verify phone ownership with an SMS OTP before creating the account.
    const { lastInsertRowid: id } = q('INSERT INTO users (name, phone, password_hash, city, created_at) VALUES (?, ?, ?, ?, ?)')
      .run(name, phone, hashPassword(password), city, Date.now());
    startSession(setCookie, Number(id));
    return { user: me(Number(id)) };
  });

  route('POST', '/api/auth/login', ({ body, ip, setCookie }) => {
    rateLimit(`auth:${ip}`, 20, 10 * 60 * 1000);
    const phone = normalizePhone(body.phone);
    const u = phone && q('SELECT id, password_hash FROM users WHERE phone = ?').get(phone);
    if (!u || !verifyPassword(String(body.password || ''), u.password_hash)) fail(401, 'bad_credentials');
    startSession(setCookie, u.id);
    return { user: me(u.id) };
  });

  route('POST', '/api/auth/logout', ({ token, setCookie }) => {
    if (token) q('DELETE FROM sessions WHERE token = ?').run(token);
    setCookie('', 0);
    return { ok: true };
  });

  function startSession(setCookie, userId) {
    const token = randomHex(32);
    q('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)').run(token, userId, Date.now() + SESSION_TTL);
    setCookie(token, SESSION_TTL / 1000);
  }

  function me(id) {
    const u = q('SELECT id, name, city, verified, is_dealer, created_at FROM users WHERE id = ?').get(id);
    return { ...u, verified: !!u.verified, is_dealer: !!u.is_dealer };
  }

  route('GET', '/api/me', ({ user }) => ({
    user: user ? me(user.id) : null,
    unread: user ? q(`SELECT COUNT(*) AS n FROM messages m JOIN conversations c ON c.id = m.conversation_id
                      WHERE (c.buyer_id = ? OR c.seller_id = ?) AND m.sender_id != ? AND m.read_at IS NULL`).get(user.id, user.id, user.id).n : 0,
  }));

  route('POST', '/api/me/verify', ({ user, body }) => {
    // Mock Nafath flow. We never store the ID number itself — only the verified flag.
    if (!isValidSaudiId(body.national_id)) fail(400, 'invalid_national_id');
    q('UPDATE users SET verified = 1 WHERE id = ?').run(user.id);
    return { user: me(user.id) };
  }, { auth: true });

  route('GET', '/api/me/listings', ({ user }) => ({
    items: q("SELECT * FROM listings WHERE user_id = ? AND status != 'removed' ORDER BY created_at DESC").all(user.id).map((l) => serializeListing(l)),
  }), { auth: true });

  route('GET', '/api/me/favorites', ({ user }) => ({
    items: q(`SELECT l.* FROM favorites f JOIN listings l ON l.id = f.listing_id
              WHERE f.user_id = ? AND l.status IN ('active','sold') ORDER BY f.created_at DESC`).all(user.id).map((l) => serializeListing(l)),
  }), { auth: true });

  // ----- listings -----
  route('GET', '/api/listings', ({ query }) => searchListings(query));

  route('GET', '/api/listings/:id', ({ params, user }) => {
    const l = getListing(params.id);
    const isOwner = user && user.id === l.user_id;
    if (!['active', 'sold'].includes(l.status) && !isOwner) fail(404, 'not_found');
    if (!isOwner) q('UPDATE listings SET views = views + 1 WHERE id = ?').run(l.id);
    return serializeListing({ ...l, views: l.views + (isOwner ? 0 : 1) }, { full: true, viewer: user });
  });

  route('POST', '/api/listings', ({ user, body }) => {
    rateLimit(`post:${user.id}`, 30, DAY);
    const category = CATEGORIES[body.category] ? body.category : fail(400, 'invalid_category');
    const city = CITIES[body.city] ? body.city : fail(400, 'invalid_city');
    const { attrs, error } = validateAttrs(category, body.attrs);
    if (error) fail(400, error);
    const title = str(body.title, 4, 90, 'invalid_title');
    const description = str(body.description, 10, 4000, 'invalid_description');
    const p = price(body.price);
    const imageIds = Array.isArray(body.images) ? body.images.slice(0, MAX_IMAGES) : [];
    const now = Date.now();
    const id = tx(() => {
      const { lastInsertRowid } = q(`INSERT INTO listings (user_id, category, title, description, price, city, attrs, created_at, updated_at)
                                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(user.id, category, title, description, p, city, JSON.stringify(attrs), now, now);
      const lid = Number(lastInsertRowid);
      imageIds.forEach((imgId, i) => {
        q('UPDATE uploads SET listing_id = ?, position = ? WHERE id = ? AND user_id = ? AND listing_id IS NULL').run(lid, i, String(imgId), user.id);
      });
      indexListing(db, { id: lid, title, description, attrs });
      return lid;
    });
    return serializeListing(getListing(id), { full: true, viewer: user });
  }, { auth: true });

  route('PATCH', '/api/listings/:id', ({ user, params, body }) => {
    const l = getListing(params.id);
    if (l.user_id !== user.id) fail(403, 'forbidden');
    if (l.status === 'hidden' || l.status === 'removed') fail(409, 'listing_locked');
    const next = {
      title: body.title !== undefined ? str(body.title, 4, 90, 'invalid_title') : l.title,
      description: body.description !== undefined ? str(body.description, 10, 4000, 'invalid_description') : l.description,
      price: body.price !== undefined ? price(body.price) : l.price,
      status: body.status !== undefined ? (['active', 'sold', 'removed'].includes(body.status) ? body.status : fail(400, 'invalid_status')) : l.status,
    };
    q('UPDATE listings SET title = ?, description = ?, price = ?, status = ?, updated_at = ? WHERE id = ?')
      .run(next.title, next.description, next.price, next.status, Date.now(), l.id);
    indexListing(db, { ...l, ...next });
    return serializeListing(getListing(l.id), { full: true, viewer: user });
  }, { auth: true });

  // Paid boost. Payment is mocked; production would charge via a local gateway (Mada/Apple Pay/STC Pay).
  route('POST', '/api/listings/:id/feature', ({ user, params }) => {
    const l = getListing(params.id);
    if (l.user_id !== user.id) fail(403, 'forbidden');
    if (l.status !== 'active') fail(409, 'not_active');
    const until = Math.max(l.featured_until, Date.now()) + 7 * DAY;
    q('UPDATE listings SET featured_until = ? WHERE id = ?').run(until, l.id);
    return { featured_until: until, charged: 25 };
  }, { auth: true });

  route('GET', '/api/listings/:id/phone', ({ user, params }) => {
    rateLimit(`phone:${user.id}`, 50, DAY); // stops scrapers harvesting numbers
    const l = getListing(params.id);
    if (l.status !== 'active') fail(404, 'not_found');
    return { phone: '+' + q('SELECT phone FROM users WHERE id = ?').get(l.user_id).phone };
  }, { auth: true });

  route('POST', '/api/listings/:id/favorite', ({ user, params }) => {
    const l = getListing(params.id);
    const exists = q('SELECT 1 FROM favorites WHERE user_id = ? AND listing_id = ?').get(user.id, l.id);
    if (exists) q('DELETE FROM favorites WHERE user_id = ? AND listing_id = ?').run(user.id, l.id);
    else q('INSERT INTO favorites (user_id, listing_id, created_at) VALUES (?, ?, ?)').run(user.id, l.id, Date.now());
    return { favorited: !exists };
  }, { auth: true });

  route('POST', '/api/listings/:id/report', ({ user, params, body }) => {
    const l = getListing(params.id);
    if (l.user_id === user.id) fail(400, 'own_listing');
    const reason = ['scam', 'prohibited', 'wrong_category', 'duplicate', 'other'].includes(body.reason) ? body.reason : fail(400, 'invalid_reason');
    q('INSERT OR IGNORE INTO reports (reporter_id, listing_id, reason, created_at) VALUES (?, ?, ?, ?)').run(user.id, l.id, reason, Date.now());
    // Auto-hide pending moderation. Verified sellers get a higher threshold since they're accountable.
    const n = q('SELECT COUNT(*) AS n FROM reports WHERE listing_id = ?').get(l.id).n;
    const threshold = q('SELECT verified FROM users WHERE id = ?').get(l.user_id).verified ? 5 : 3;
    if (n >= threshold && l.status === 'active') q("UPDATE listings SET status = 'hidden' WHERE id = ?").run(l.id);
    return { ok: true };
  }, { auth: true });

  // ----- uploads -----
  route('POST', '/api/uploads', ({ user, body }) => {
    rateLimit(`upload:${user.id}`, 200, DAY);
    const m = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/.exec(String(body.data || ''));
    if (!m) fail(400, 'invalid_image');
    let bin;
    try { bin = atob(m[2]); } catch { fail(400, 'invalid_image'); }
    if (bin.length > MAX_IMAGE) fail(413, 'image_too_large');
    const magic = Array.from(bin.slice(0, 12), (c) => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
    const ok = magic.startsWith('ffd8ff') || magic.startsWith('89504e47') || (magic.startsWith('52494646') && magic.endsWith('57454250'));
    if (!ok) fail(400, 'invalid_image');
    const id = randomHex(12);
    storeImage(id, bin, `image/${m[1]}`);
    q('INSERT INTO uploads (id, user_id, created_at) VALUES (?, ?, ?)').run(id, user.id, Date.now());
    return { id, url: imageUrl(id) };
  }, { auth: true });

  // ----- messaging & offers -----
  function conversationFor(user, id) {
    const c = q('SELECT * FROM conversations WHERE id = ?').get(Number(id)) || fail(404, 'not_found');
    if (c.buyer_id !== user.id && c.seller_id !== user.id) fail(404, 'not_found');
    return c;
  }

  function postMessage(user, c, body) {
    rateLimit(`msg:${user.id}`, 120, 60 * 60 * 1000);
    const offer = body.offer_amount !== undefined && body.offer_amount !== null && body.offer_amount !== '' ? price(body.offer_amount) : null;
    if (offer !== null && user.id !== c.buyer_id) fail(400, 'only_buyer_can_offer');
    if (offer !== null && !offer) fail(400, 'invalid_price');
    const text = offer !== null && !body.body ? '' : str(body.body, 1, 2000, 'invalid_message');
    const now = Date.now();
    tx(() => {
      if (offer !== null) {
        q("UPDATE messages SET offer_status = 'rejected' WHERE conversation_id = ? AND offer_status = 'pending'").run(c.id);
      }
      q(`INSERT INTO messages (conversation_id, sender_id, body, offer_amount, offer_status, risk_flag, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`).run(c.id, user.id, text, offer, offer !== null ? 'pending' : null, detectRisk(text), now);
      q('UPDATE conversations SET updated_at = ? WHERE id = ?').run(now, c.id);
    });
  }

  function conversationView(user, c) {
    const l = q('SELECT * FROM listings WHERE id = ?').get(c.listing_id);
    const otherId = user.id === c.buyer_id ? c.seller_id : c.buyer_id;
    return {
      id: c.id, updated_at: c.updated_at, role: user.id === c.buyer_id ? 'buyer' : 'seller',
      listing: { id: l.id, title: l.title, price: l.price, status: l.status, image: images(l.id)[0] || null },
      other: sellerSummary(otherId),
    };
  }

  route('POST', '/api/listings/:id/conversations', ({ user, params, body }) => {
    const l = getListing(params.id);
    if (l.status !== 'active') fail(409, 'not_active');
    if (l.user_id === user.id) fail(400, 'own_listing');
    q('INSERT OR IGNORE INTO conversations (listing_id, buyer_id, seller_id, updated_at) VALUES (?, ?, ?, ?)').run(l.id, user.id, l.user_id, Date.now());
    const c = q('SELECT * FROM conversations WHERE listing_id = ? AND buyer_id = ?').get(l.id, user.id);
    postMessage(user, c, body);
    return { id: c.id };
  }, { auth: true });

  route('GET', '/api/conversations', ({ user }) => ({
    items: q('SELECT * FROM conversations WHERE buyer_id = ? OR seller_id = ? ORDER BY updated_at DESC LIMIT 200').all(user.id, user.id).map((c) => ({
      ...conversationView(user, c),
      last: q('SELECT body, offer_amount, sender_id, created_at FROM messages WHERE conversation_id = ? ORDER BY id DESC LIMIT 1').get(c.id),
      unread: q('SELECT COUNT(*) AS n FROM messages WHERE conversation_id = ? AND sender_id != ? AND read_at IS NULL').get(c.id, user.id).n,
    })),
  }), { auth: true });

  route('GET', '/api/conversations/:id', ({ user, params }) => {
    const c = conversationFor(user, params.id);
    q('UPDATE messages SET read_at = ? WHERE conversation_id = ? AND sender_id != ? AND read_at IS NULL').run(Date.now(), c.id, user.id);
    return {
      ...conversationView(user, c),
      messages: q('SELECT id, sender_id, body, offer_amount, offer_status, risk_flag, created_at FROM messages WHERE conversation_id = ? ORDER BY id').all(c.id)
        .map((m) => ({ ...m, mine: m.sender_id === user.id })),
    };
  }, { auth: true });

  route('POST', '/api/conversations/:id/messages', ({ user, params, body }) => {
    const c = conversationFor(user, params.id);
    postMessage(user, c, body);
    return { ok: true };
  }, { auth: true });

  route('POST', '/api/messages/:id/offer', ({ user, params, body }) => {
    const m = q('SELECT * FROM messages WHERE id = ?').get(Number(params.id)) || fail(404, 'not_found');
    const c = conversationFor(user, m.conversation_id);
    if (c.seller_id !== user.id) fail(403, 'forbidden');
    if (m.offer_status !== 'pending') fail(409, 'offer_closed');
    const status = body.action === 'accept' ? 'accepted' : body.action === 'reject' ? 'rejected' : fail(400, 'invalid_action');
    q('UPDATE messages SET offer_status = ? WHERE id = ?').run(status, m.id);
    return { offer_status: status };
  }, { auth: true });

  // ----- escrow orders (Souqna Guarantee) -----
  const ORDER_TRANSITIONS = {
    ship: { from: ['funded'], to: 'shipped', by: 'seller' },
    confirm: { from: ['funded', 'shipped'], to: 'completed', by: 'buyer' },
    dispute: { from: ['funded', 'shipped'], to: 'disputed', by: 'buyer' },
    cancel: { from: ['funded'], to: 'refunded', by: 'buyer' },
  };

  function orderView(o) {
    const l = q('SELECT id, title FROM listings WHERE id = ?').get(o.listing_id);
    return { ...o, listing: { ...l, image: images(l.id)[0] || null }, reviewed: !!q('SELECT 1 FROM reviews WHERE order_id = ?').get(o.id) };
  }

  route('POST', '/api/listings/:id/orders', ({ user, params }) => {
    const l = getListing(params.id);
    if (l.status !== 'active') fail(409, 'not_active');
    if (l.user_id === user.id) fail(400, 'own_listing');
    // Price is the accepted offer in this buyer's conversation if there is one, else the listed price.
    const accepted = q(`SELECT m.offer_amount FROM messages m JOIN conversations c ON c.id = m.conversation_id
                        WHERE c.listing_id = ? AND c.buyer_id = ? AND m.offer_status = 'accepted' ORDER BY m.id DESC LIMIT 1`).get(l.id, user.id);
    const amount = accepted ? accepted.offer_amount : l.price;
    if (!amount) fail(409, 'no_price');
    if (q("SELECT 1 FROM orders WHERE listing_id = ? AND status IN ('funded','shipped','disputed')").get(l.id)) fail(409, 'already_reserved');
    const now = Date.now();
    // Production: capture payment through the gateway here and only insert on success.
    const { lastInsertRowid } = q(`INSERT INTO orders (listing_id, buyer_id, seller_id, amount, fee, status, created_at, updated_at)
                                   VALUES (?, ?, ?, ?, ?, 'funded', ?, ?)`).run(l.id, user.id, l.user_id, amount, escrowFee(amount), now, now);
    return orderView(q('SELECT * FROM orders WHERE id = ?').get(Number(lastInsertRowid)));
  }, { auth: true });

  route('GET', '/api/me/orders', ({ user }) => ({
    items: q('SELECT * FROM orders WHERE buyer_id = ? OR seller_id = ? ORDER BY updated_at DESC').all(user.id, user.id)
      .map((o) => ({ ...orderView(o), role: o.buyer_id === user.id ? 'buyer' : 'seller' })),
  }), { auth: true });

  // Only buyers with a completed escrow order can review → reviews can't be faked.
  route('POST', '/api/orders/:id/review', ({ user, params, body }) => {
    const o = q('SELECT * FROM orders WHERE id = ?').get(Number(params.id)) || fail(404, 'not_found');
    if (o.buyer_id !== user.id) fail(403, 'forbidden');
    if (o.status !== 'completed') fail(409, 'order_not_completed');
    const rating = Number(body.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) fail(400, 'invalid_rating');
    const comment = typeof body.comment === 'string' ? body.comment.trim().slice(0, 500) : '';
    try {
      q('INSERT INTO reviews (order_id, reviewer_id, seller_id, rating, comment, created_at) VALUES (?, ?, ?, ?, ?, ?)')
        .run(o.id, user.id, o.seller_id, rating, comment, Date.now());
    } catch { fail(409, 'already_reviewed'); }
    return { ok: true };
  }, { auth: true });

  route('POST', '/api/orders/:id/:action', ({ user, params }) => {
    const o = q('SELECT * FROM orders WHERE id = ?').get(Number(params.id)) || fail(404, 'not_found');
    if (o.buyer_id !== user.id && o.seller_id !== user.id) fail(404, 'not_found');
    const t = ORDER_TRANSITIONS[params.action] || fail(400, 'invalid_action');
    if ((t.by === 'buyer' ? o.buyer_id : o.seller_id) !== user.id) fail(403, 'forbidden');
    if (!t.from.includes(o.status)) fail(409, 'invalid_transition');
    tx(() => {
      q('UPDATE orders SET status = ?, updated_at = ? WHERE id = ?').run(t.to, Date.now(), o.id);
      if (t.to === 'completed') q("UPDATE listings SET status = 'sold', updated_at = ? WHERE id = ?").run(Date.now(), o.listing_id);
    });
    return orderView(q('SELECT * FROM orders WHERE id = ?').get(o.id));
  }, { auth: true });

  // ----- public profiles -----
  route('GET', '/api/users/:id', ({ params }) => {
    const u = q('SELECT id FROM users WHERE id = ?').get(Number(params.id)) || fail(404, 'not_found');
    return {
      user: sellerSummary(u.id),
      reviews: q(`SELECT r.rating, r.comment, r.created_at, u.name AS reviewer FROM reviews r JOIN users u ON u.id = r.reviewer_id
                  WHERE r.seller_id = ? ORDER BY r.created_at DESC LIMIT 50`).all(u.id),
      listings: searchListings({ user: String(u.id) }).items,
    };
  });

  // ----- saved searches (alerts) -----
  const SAVED_KEYS = /^(q|category|city|min|max|verified|attr\.[a-z_]+)$/;
  function cleanQuery(input) {
    const out = {};
    for (const [k, v] of Object.entries(input || {})) if (SAVED_KEYS.test(k) && v !== '' && v != null) out[k] = String(v).slice(0, 100);
    return out;
  }
  const maxListingId = () => q('SELECT COALESCE(MAX(id), 0) AS m FROM listings').get().m;

  route('POST', '/api/saved-searches', ({ user, body }) => {
    const query = cleanQuery(body.query);
    if (!Object.keys(query).length) fail(400, 'empty_query');
    if (q('SELECT COUNT(*) AS n FROM saved_searches WHERE user_id = ?').get(user.id).n >= 20) fail(409, 'too_many_saved_searches');
    const { lastInsertRowid } = q('INSERT INTO saved_searches (user_id, query, last_seen_id, created_at) VALUES (?, ?, ?, ?)')
      .run(user.id, JSON.stringify(query), maxListingId(), Date.now());
    return { id: Number(lastInsertRowid), query };
  }, { auth: true });

  route('GET', '/api/saved-searches', ({ user }) => ({
    items: q('SELECT * FROM saved_searches WHERE user_id = ? ORDER BY id DESC').all(user.id).map((s) => ({
      id: s.id, query: JSON.parse(s.query), new_count: searchListings({ ...JSON.parse(s.query), after_id: String(s.last_seen_id) }).total,
    })),
  }), { auth: true });

  route('POST', '/api/saved-searches/:id/seen', ({ user, params }) => {
    q('UPDATE saved_searches SET last_seen_id = ? WHERE id = ? AND user_id = ?').run(maxListingId(), Number(params.id), user.id);
    return { ok: true };
  }, { auth: true });

  route('DELETE', '/api/saved-searches/:id', ({ user, params }) => {
    q('DELETE FROM saved_searches WHERE id = ? AND user_id = ?').run(Number(params.id), user.id);
    return { ok: true };
  }, { auth: true });

  function currentUser(token) {
    if (!token) return null;
    const s = q('SELECT user_id, expires_at FROM sessions WHERE token = ?').get(token);
    return s && s.expires_at > Date.now() ? { id: s.user_id } : null;
  }

  // Returns { status, body, cookie } where cookie is { token, maxAge } when the session changed.
  function dispatch({ method, pathname, query = {}, body = {}, token = null, ip = 'local' }) {
    let cookie = null;
    const setCookie = (value, maxAge) => { cookie = { token: value, maxAge }; };
    try {
      for (const r of routes) {
        if (r.method !== method) continue;
        const m = r.re.exec(pathname);
        if (!m) continue;
        const params = Object.fromEntries(r.keys.map((k, i) => [k, m[i + 1]]));
        const user = currentUser(token);
        if (r.auth && !user) fail(401, 'auth_required');
        const result = r.handler({ params, body: body && typeof body === 'object' ? body : {}, query, user, token, ip, setCookie });
        return { status: 200, body: result, cookie };
      }
      fail(404, 'not_found');
    } catch (e) {
      if (e instanceof HttpError) return { status: e.status, body: { error: e.code }, cookie };
      console.error(e);
      return { status: 500, body: { error: 'internal' }, cookie };
    }
  }

  return { dispatch };
}

module.exports = { createApi, HttpError };
