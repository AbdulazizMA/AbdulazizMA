'use strict';

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createApp } = require('../server/app');
const { normalizePhone, isValidSaudiId, detectRisk, escrowFee } = require('../server/trust');
const { normalizeArabic } = require('../server/db');

let base, server, tmp;

before(async () => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'souqna-'));
  ({ server } = createApp({ dbFile: ':memory:', uploadDir: tmp }));
  await new Promise((r) => server.listen(0, r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => { server.close(); fs.rmSync(tmp, { recursive: true, force: true }); });

function client() {
  let cookie = '';
  return async (method, url, body) => {
    const res = await fetch(base + url, {
      method,
      headers: { 'content-type': 'application/json', cookie },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const set = res.headers.get('set-cookie');
    if (set) cookie = set.split(';')[0];
    return { status: res.status, body: await res.json() };
  };
}

const camry = (price, year = 2021) => ({
  category: 'cars', city: 'riyadh', title: `كامري ${year} نظيفة`, description: 'سيارة نظيفة جداً بدون حوادث', price,
  attrs: { make: 'Toyota', model: 'Camry', year, mileage: 50000 },
});

test('unit: phone, national ID, risk, fee, arabic normalization', () => {
  assert.equal(normalizePhone('0551234567'), '966551234567');
  assert.equal(normalizePhone('+966 55 123 4567'), '966551234567');
  assert.equal(normalizePhone('٠٥٥١٢٣٤٥٦٧'), '966551234567');
  assert.equal(normalizePhone('0112345678'), null);
  assert.equal(isValidSaudiId('1000000008'), true);
  assert.equal(isValidSaudiId('1000000009'), false);
  assert.equal(detectRisk('حول العربون على SA0380000000608010167519'), 'iban');
  assert.equal(detectRisk('كلمني واتساب'), 'off_platform');
  assert.equal(detectRisk('هل السعر قابل للتفاوض؟'), null);
  assert.equal(escrowFee(100), 5);
  assert.equal(escrowFee(84000), 250);
  assert.equal(normalizeArabic('سيارةٌ أحمد'), 'سياره احمد');
});

test('full marketplace flow: list, search, chat, offer, escrow, review', async () => {
  const seller = client();
  const buyer = client();

  let r = await seller('POST', '/api/auth/register', { name: 'بائع', phone: '0500000001', password: 'password123', city: 'riyadh' });
  assert.equal(r.status, 200);
  r = await buyer('POST', '/api/auth/register', { name: 'مشتري', phone: '0500000002', password: 'password123' });
  assert.equal(r.status, 200);
  assert.equal((await buyer('POST', '/api/auth/register', { name: 'x', phone: '0500000002', password: 'password123' })).status, 400);
  assert.equal((await client()('POST', '/api/auth/register', { name: 'dup', phone: '0500000002', password: 'password123' })).status, 409);

  // Validation of structured attributes
  r = await seller('POST', '/api/listings', { ...camry(80000), attrs: { make: 'Toyota' } });
  assert.deepEqual(r.body, { error: 'missing_attr:model' });

  // Comparable listings for the price insight
  for (const p of [70000, 80000, 90000]) assert.equal((await seller('POST', '/api/listings', camry(p))).status, 200);
  r = await seller('POST', '/api/listings', camry(65000, 2022));
  const listing = r.body;
  assert.equal(listing.price_insight.verdict, 'good');
  assert.equal(listing.price_insight.sample, 3);

  // Arabic-normalized search: "سياره" (ه) should match "سيارة" description
  r = await buyer('GET', '/api/listings?q=' + encodeURIComponent('سياره نظيفه'));
  assert.equal(r.body.total, 4);
  r = await buyer('GET', '/api/listings?category=cars&attr.year_min=2022');
  assert.equal(r.body.total, 1);
  r = await buyer('GET', '/api/listings?sort=price_asc');
  assert.equal(r.body.items[0].price, 65000);

  // Phone is not exposed in listing payloads, only via authenticated reveal
  assert.ok(!JSON.stringify(listing).includes('500000001'));
  assert.equal((await client()('GET', `/api/listings/${listing.id}/phone`)).status, 401);
  assert.equal((await buyer('GET', `/api/listings/${listing.id}/phone`)).body.phone, '+966500000001');

  // Chat with an offer; scam-pattern warning
  r = await buyer('POST', `/api/listings/${listing.id}/conversations`, { body: 'السلام عليكم، أقدر أدفع 60 ألف', offer_amount: 60000 });
  const convId = r.body.id;
  await seller('POST', `/api/conversations/${convId}/messages`, { body: 'حول العربون على SA0380000000608010167519' });
  r = await buyer('GET', `/api/conversations/${convId}`);
  assert.equal(r.body.messages[1].risk_flag, 'iban');
  const offerMsg = r.body.messages[0];
  assert.equal(offerMsg.offer_status, 'pending');
  assert.equal((await buyer('POST', `/api/messages/${offerMsg.id}/offer`, { action: 'accept' })).status, 403);
  assert.equal((await seller('POST', `/api/messages/${offerMsg.id}/offer`, { action: 'accept' })).body.offer_status, 'accepted');
  assert.equal((await seller('GET', '/api/me')).body.unread, 1);
  await seller('GET', `/api/conversations/${convId}`);
  assert.equal((await seller('GET', '/api/me')).body.unread, 0);

  // Escrow order uses accepted offer amount
  r = await buyer('POST', `/api/listings/${listing.id}/orders`);
  assert.equal(r.body.amount, 60000);
  assert.equal(r.body.status, 'funded');
  const orderId = r.body.id;
  assert.equal((await client()('POST', `/api/listings/${listing.id}/orders`)).status, 401);
  assert.equal((await buyer('POST', `/api/orders/${orderId}/ship`)).status, 403);
  assert.equal((await buyer('POST', `/api/orders/${orderId}/review`, { rating: 5 })).status, 409);
  assert.equal((await seller('POST', `/api/orders/${orderId}/ship`)).body.status, 'shipped');
  assert.equal((await buyer('POST', `/api/orders/${orderId}/cancel`)).status, 409);
  assert.equal((await buyer('POST', `/api/orders/${orderId}/confirm`)).body.status, 'completed');
  assert.equal((await buyer('GET', `/api/listings/${listing.id}`)).body.status, 'sold');

  // Review only after completion, once
  assert.equal((await buyer('POST', `/api/orders/${orderId}/review`, { rating: 5, comment: 'ممتاز' })).status, 200);
  assert.equal((await buyer('POST', `/api/orders/${orderId}/review`, { rating: 5 })).status, 409);
  r = await buyer('GET', `/api/users/${listing.seller.id}`);
  assert.equal(r.body.user.rating, 5);
  assert.equal(r.body.user.completed_sales, 1);
});

test('reports auto-hide, saved searches, verification, CSRF guard', async () => {
  const seller = client();
  await seller('POST', '/api/auth/register', { name: 'بائع٢', phone: '0510000000', password: 'password123' });
  const l = (await seller('POST', '/api/listings', { category: 'other', city: 'jeddah', title: 'عرض مشبوه', description: 'حول المبلغ قبل المعاينة' })).body;

  const watcher = client();
  await watcher('POST', '/api/auth/register', { name: 'متابع', phone: '0520000000', password: 'password123' });
  const ss = await watcher('POST', '/api/saved-searches', { query: { category: 'electronics', bogus: 'x' } });
  assert.deepEqual(ss.body.query, { category: 'electronics' });
  await seller('POST', '/api/listings', { category: 'electronics', city: 'jeddah', title: 'ايفون 15', description: 'ايفون نظيف جداً', price: 3000, attrs: { brand: 'Apple' } });
  assert.equal((await watcher('GET', '/api/saved-searches')).body.items[0].new_count, 1);
  await watcher('POST', `/api/saved-searches/${ss.body.id}/seen`, {});
  assert.equal((await watcher('GET', '/api/saved-searches')).body.items[0].new_count, 0);

  for (let i = 0; i < 3; i++) {
    const c = client();
    await c('POST', '/api/auth/register', { name: 'مبلغ', phone: `053000000${i}`, password: 'password123' });
    await c('POST', `/api/listings/${l.id}/report`, { reason: 'scam' });
  }
  assert.equal((await watcher('GET', `/api/listings/${l.id}`)).status, 404);
  assert.equal((await seller('GET', `/api/listings/${l.id}`)).body.status, 'hidden');

  assert.equal((await seller('POST', '/api/me/verify', { national_id: '1234567890' })).status, 400);
  assert.equal((await seller('POST', '/api/me/verify', { national_id: '1000000008' })).body.user.verified, true);

  const res = await fetch(`${base}/api/auth/logout`, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' } });
  assert.equal(res.status, 415);
});
