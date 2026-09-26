'use strict';

(() => {
  // ---------- state ----------
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
  };
  const state = { lang: store.get('lang') || 'ar', meta: null, me: null, unread: 0 };
  const $ = (sel) => document.querySelector(sel);
  const view = $('#view');

  const t = (key, vars) => {
    let s = (I18N[state.lang] && I18N[state.lang][key]) || I18N.ar[key] || key;
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, v);
    return s;
  };
  const label = (obj) => (obj ? obj[state.lang] || obj.ar : '');
  const opt = (v) => (OPTION_LABELS[state.lang] && OPTION_LABELS[state.lang][v]) || v;
  const money = (n) => (n == null ? t('no_price') : `${Number(n).toLocaleString(state.lang === 'ar' ? 'ar-SA' : 'en-US')} ${t('sar')}`);
  const ago = (ts) => {
    const rtf = new Intl.RelativeTimeFormat(state.lang, { numeric: 'auto' });
    const s = (ts - Date.now()) / 1000;
    for (const [u, n] of [['year', 31536000], ['month', 2592000], ['day', 86400], ['hour', 3600], ['minute', 60]]) {
      if (Math.abs(s) >= n) return rtf.format(Math.round(s / n), u);
    }
    return rtf.format(0, 'minute');
  };

  // Safe DOM builder: text is always set via textContent, never innerHTML.
  function h(tag, attrs, ...children) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (k === 'class') el.className = v;
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const c of children.flat(Infinity)) {
      if (c == null || c === false) continue;
      el.append(c instanceof Node ? c : document.createTextNode(String(c)));
    }
    return el;
  }

  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => { el.hidden = true; }, 3000);
  }

  // In-page confirmation step (native browser dialogs are blocked in some embedded viewers).
  function ask(title, detail) {
    return new Promise((resolve) => {
      const done = (v) => { overlay.remove(); resolve(v); };
      const overlay = h('div', { class: 'overlay', onclick: (e) => { if (e.target === overlay) done(false); } },
        h('div', { class: 'dialog panel', role: 'dialog', 'aria-modal': 'true' },
          h('h2', {}, title), detail ? h('p', { class: 'meta' }, detail) : null,
          h('div', { class: 'actions' },
            h('button', { class: 'btn btn-safe', onclick: () => done(true) }, t('confirm_yes')),
            h('button', { class: 'btn', onclick: () => done(false) }, t('confirm_no')))));
      document.body.append(overlay);
      overlay.querySelector('.btn-safe').focus();
    });
  }

  async function api(method, url, body) {
    // The in-browser demo build supplies window.souqnaFetch; the real app talks to the server.
    const res = await (window.souqnaFetch || fetch)(url, {
      method,
      headers: body !== undefined || method !== 'GET' ? { 'content-type': 'application/json' } : {},
      body: body !== undefined ? JSON.stringify(body) : method !== 'GET' ? '{}' : undefined,
      credentials: 'same-origin',
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (res.status === 401 && data.error === 'auth_required') { location.hash = '#/login'; throw new Error(t('need_login')); }
      const code = String(data.error || 'generic').split(':')[0];
      throw new Error(I18N[state.lang][`err_${code}`] || `${t('err_generic')} (${data.error})`);
    }
    return data;
  }
  const guard = (fn) => async (...args) => { try { await fn(...args); } catch (e) { toast(e.message); } };

  // ---------- chrome ----------
  function applyLang() {
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
    $('#search-input').placeholder = t('search_placeholder');
  }

  function renderNav() {
    const badge = state.unread ? h('span', { class: 'badge' }, state.unread) : null;
    const links = state.me
      ? [h('a', { href: '#/post', class: 'btn btn-primary' }, '+ ', t('post')), h('a', { href: '#/inbox' }, t('inbox'), badge), h('a', { href: '#/account' }, t('account'))]
      : [h('a', { href: '#/post', class: 'btn btn-primary' }, '+ ', t('post')), h('a', { href: '#/login' }, t('login'))];
    const langBtn = h('button', { class: 'link', onclick: () => { state.lang = state.lang === 'ar' ? 'en' : 'ar'; store.set('lang', state.lang); applyLang(); renderNav(); route(); } }, t('lang'));
    $('#nav').replaceChildren(...links, langBtn);
    $('#tabbar').replaceChildren(
      h('a', { href: '#/' }, '🏠', h('small', {}, t('home'))),
      h('a', { href: '#/post' }, '➕', h('small', {}, t('post'))),
      h('a', { href: '#/inbox' }, '💬', badge && badge.cloneNode(true), h('small', {}, t('inbox'))),
      h('a', { href: state.me ? '#/account' : '#/login' }, '👤', h('small', {}, state.me ? t('account') : t('login'))),
    );
  }

  async function refreshMe() {
    const r = await api('GET', '/api/me');
    state.me = r.user;
    state.unread = r.unread;
    renderNav();
  }

  // ---------- components ----------
  const sellerBadges = (s) => [
    s.verified ? h('span', { class: 'chip chip-ok', title: 'Nafath' }, '✓ ', t('verified')) : null,
    s.is_dealer ? h('span', { class: 'chip' }, t('dealer')) : null,
  ];

  function card(l) {
    const img = l.images[0]
      ? h('img', { src: l.images[0], alt: '', loading: 'lazy' })
      : h('div', { class: 'noimg' }, state.meta.categories[l.category]?.icon || '📦');
    return h('a', { href: `#/listing/${l.id}`, class: 'card' + (l.featured ? ' featured' : '') },
      h('div', { class: 'thumb' }, img, l.featured ? h('span', { class: 'ribbon' }, t('featured')) : null,
        l.status === 'sold' ? h('span', { class: 'ribbon sold' }, t('status_sold')) : null),
      h('div', { class: 'card-body' },
        h('div', { class: 'card-title' }, l.title),
        h('div', { class: 'price' }, money(l.price)),
        h('div', { class: 'meta' }, label(state.meta.cities[l.city]), ' · ', ago(l.created_at)),
        h('div', { class: 'meta' }, l.seller.name, ' ', ...sellerBadges(l.seller))),
    );
  }

  const grid = (items) => (items.length ? h('div', { class: 'grid' }, items.map(card)) : h('p', { class: 'empty' }, t('no_results')));

  // ---------- pages ----------
  async function pageHome() {
    const [latest] = await Promise.all([api('GET', '/api/listings')]);
    const cats = Object.entries(state.meta.categories).map(([k, c]) =>
      h('a', { href: `#/search?category=${k}`, class: 'cat' }, h('span', { class: 'cat-icon' }, c.icon), label(c)));
    view.replaceChildren(
      h('section', { class: 'hero' },
        h('h1', {}, t('hero_title')),
        h('p', {}, t('hero_sub')),
        h('div', { class: 'trust-row' },
          h('span', {}, '✓ ', t('trust_verified')), h('span', {}, '🛡️ ', t('trust_escrow')),
          h('span', {}, '📊 ', t('trust_price')), h('span', {}, '🆓 ', t('trust_free')))),
      h('h2', {}, t('categories')),
      h('div', { class: 'cats' }, cats),
      h('h2', {}, t('latest')),
      grid(latest.items),
    );
  }

  async function pageSearch(params) {
    const qs = new URLSearchParams(params);
    const data = await api('GET', `/api/listings?${qs}`);
    const category = params.category;
    const attrDefs = category ? state.meta.categories[category].attrs : {};
    $('#search-input').value = params.q || '';

    const field = (name, lbl, input) => h('label', { class: 'field' }, h('span', {}, lbl), input);
    const select = (name, options, value, allLabel) => h('select', { name },
      h('option', { value: '' }, allLabel || t('all')),
      options.map(([v, l]) => h('option', { value: v, selected: v === value }, l)));

    const attrFields = Object.entries(attrDefs).map(([key, d]) => {
      if (d.type === 'int') {
        return field(key, label(d), h('div', { class: 'range' },
          h('input', { name: `attr.${key}_min`, type: 'number', placeholder: t('min'), value: params[`attr.${key}_min`] || '' }),
          h('input', { name: `attr.${key}_max`, type: 'number', placeholder: t('max'), value: params[`attr.${key}_max`] || '' })));
      }
      if (d.type === 'enum') return field(key, label(d), select(`attr.${key}`, d.options.map((o) => [o, opt(o)]), params[`attr.${key}`]));
      return field(key, label(d), h('input', { name: `attr.${key}`, value: params[`attr.${key}`] || '' }));
    });

    const form = h('form', { class: 'filters', onsubmit: (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const next = new URLSearchParams();
      if (params.q) next.set('q', params.q);
      for (const [k, v] of fd) if (v) next.set(k, v);
      location.hash = `#/search?${next}`;
    } },
      field('category', t('category'), select('category', Object.entries(state.meta.categories).map(([k, c]) => [k, label(c)]), category)),
      field('city', t('city'), select('city', Object.entries(state.meta.cities).map(([k, c]) => [k, label(c)]), params.city, t('all_cities'))),
      field('price', t('price'), h('div', { class: 'range' },
        h('input', { name: 'min', type: 'number', placeholder: t('min'), value: params.min || '' }),
        h('input', { name: 'max', type: 'number', placeholder: t('max'), value: params.max || '' }))),
      attrFields,
      field('sort', t('sort'), select('sort', [['new', t('sort_new')], ['price_asc', t('sort_price_asc')], ['price_desc', t('sort_price_desc')]], params.sort || 'new', t('sort_new'))),
      h('label', { class: 'check' }, h('input', { type: 'checkbox', name: 'verified', value: '1', checked: params.verified === '1' }), t('verified_only')),
      h('button', { class: 'btn btn-primary', type: 'submit' }, t('apply')),
      h('button', { class: 'btn', type: 'button', onclick: guard(async () => {
        const query = { ...params };
        delete query.sort; delete query.page;
        await api('POST', '/api/saved-searches', { query });
        toast(t('saved'));
      }) }, t('save_search')),
    );
    // Re-render when category changes so category-specific filters appear.
    form.querySelector('[name=category]').addEventListener('change', (e) => {
      const next = new URLSearchParams();
      if (params.q) next.set('q', params.q);
      if (e.target.value) next.set('category', e.target.value);
      if (params.city) next.set('city', params.city);
      location.hash = `#/search?${next}`;
    });

    const pages = Math.ceil(data.total / data.page_size);
    const pager = pages > 1 ? h('div', { class: 'pager' }, Array.from({ length: Math.min(pages, 20) }, (_, i) => {
      const p = new URLSearchParams(params); p.set('page', i + 1);
      return h('a', { href: `#/search?${p}`, class: data.page === i + 1 ? 'active' : '' }, i + 1);
    })) : null;

    view.replaceChildren(h('div', { class: 'search-layout' },
      h('aside', {}, form),
      h('section', {}, h('p', { class: 'meta' }, `${data.total} ${t('results')}`), grid(data.items), pager)));
  }

  async function pageListing(id) {
    const l = await api('GET', `/api/listings/${id}`);
    const cat = state.meta.categories[l.category];
    const mainImg = h('img', { src: l.images[0] || '', alt: '', class: 'main-img' });
    const gallery = l.images.length
      ? h('div', { class: 'gallery' }, mainImg, l.images.length > 1 ? h('div', { class: 'thumbs' },
        l.images.map((src) => h('img', { src, alt: '', onclick: () => { mainImg.src = src; } }))) : null)
      : h('div', { class: 'gallery noimg big' }, cat.icon);

    const specs = Object.entries(l.attrs).map(([k, v]) => h('div', { class: 'spec' },
      h('span', {}, label(cat.attrs[k])), h('b', {}, typeof v === 'number' && k !== 'year' ? v.toLocaleString() : opt(v))));

    let insight = null;
    if (l.price_insight) {
      const pi = l.price_insight;
      const lo = Math.min(pi.p25 * 0.8, l.price), hi = Math.max(pi.p75 * 1.2, l.price);
      const pos = (v) => `${((v - lo) / (hi - lo)) * 100}%`;
      const bar = h('div', { class: 'pi-bar' }, h('div', { class: 'pi-band' }), h('div', { class: 'pi-dot' }));
      bar.querySelector('.pi-band').style.insetInlineStart = pos(pi.p25);
      bar.querySelector('.pi-band').style.width = `calc(${pos(pi.p75)} - ${pos(pi.p25)})`;
      bar.querySelector('.pi-dot').style.insetInlineStart = pos(l.price);
      insight = h('div', { class: `panel insight ${pi.verdict}` },
        h('div', { class: 'insight-head' }, h('b', {}, t('insight_title')), h('span', { class: 'verdict' }, t(`insight_${pi.verdict}`))),
        bar, h('small', {}, t('insight_based', { n: pi.sample, median: money(pi.median) })));
    }

    const s = l.seller;
    const actions = [];
    if (l.is_owner) {
      actions.push(h('a', { class: 'btn', href: '#/account' }, t('my_listings')));
    } else if (l.status === 'active') {
      actions.push(
        h('button', { class: 'btn btn-primary', onclick: guard(async () => {
          if (!state.me) { location.hash = '#/login'; return; }
          const r = await api('POST', `/api/listings/${l.id}/conversations`, { body: state.lang === 'ar' ? `السلام عليكم، هل "${l.title}" متوفر؟` : `Hi, is "${l.title}" still available?` });
          location.hash = `#/chat/${r.id}`;
        }) }, '💬 ', t('chat')),
        l.price ? h('button', { class: 'btn btn-safe', onclick: guard(async () => {
          if (!state.me) { location.hash = '#/login'; return; }
          if (!(await ask(t('confirm_buy', { amount: l.price.toLocaleString() }), t('escrow_explain')))) return;
          await api('POST', `/api/listings/${l.id}/orders`);
          location.hash = '#/account/orders';
        }) }, '🛡️ ', t('buy_safe')) : null,
        h('button', { class: 'btn', onclick: guard(async (e) => {
          const r = await api('GET', `/api/listings/${l.id}/phone`);
          e.target.replaceWith(h('a', { class: 'btn', href: `tel:${r.phone}`, dir: 'ltr' }, '📞 ', r.phone));
        }) }, '📞 ', t('show_phone')),
      );
    }
    const favBtn = h('button', { class: 'btn btn-ghost', onclick: guard(async () => {
      const r = await api('POST', `/api/listings/${l.id}/favorite`);
      favBtn.textContent = r.favorited ? `♥ ${t('unfavorite')}` : `♡ ${t('favorite')}`;
    }) }, l.favorited ? `♥ ${t('unfavorite')}` : `♡ ${t('favorite')}`);

    const reportForm = h('details', { class: 'report' }, h('summary', {}, '⚑ ', t('report')),
      h('form', { onsubmit: guard(async (e) => {
        e.preventDefault();
        await api('POST', `/api/listings/${l.id}/report`, { reason: e.target.reason.value });
        toast(t('reported'));
        reportForm.open = false;
      }) }, h('select', { name: 'reason' }, ['scam', 'prohibited', 'wrong_category', 'duplicate', 'other'].map((r) => h('option', { value: r }, r))),
      h('button', { class: 'btn', type: 'submit' }, t('report'))));

    view.replaceChildren(h('div', { class: 'listing' },
      h('div', { class: 'listing-main' },
        gallery,
        h('h1', {}, l.title),
        h('div', { class: 'price big' }, money(l.price), l.status !== 'active' ? h('span', { class: 'chip' }, t(`status_${l.status}`)) : null),
        h('p', { class: 'meta' }, cat.icon, ' ', label(cat), ' · ', label(state.meta.cities[l.city]), ' · ', ago(l.created_at), ' · ', l.views, ' ', t('views')),
        specs.length ? h('div', { class: 'specs' }, specs) : null,
        h('p', { class: 'desc' }, l.description)),
      h('aside', { class: 'listing-side' },
        insight,
        h('div', { class: 'panel' },
          h('a', { href: `#/user/${s.id}`, class: 'seller' }, h('div', { class: 'avatar' }, s.name[0]),
            h('div', {}, h('b', {}, s.name), h('div', {}, ...sellerBadges(s)),
              h('small', { class: 'meta' }, s.rating ? `★ ${s.rating} (${s.review_count} ${t('reviews')}) · ` : '', `${s.completed_sales} ${t('sales')}`))),
          h('div', { class: 'actions' }, actions, favBtn)),
        h('div', { class: 'panel tip' }, '🛡️ ', t('safety_tips')),
        l.is_owner ? null : reportForm)));
  }

  async function pagePost() {
    if (!state.me) { location.hash = '#/login'; return; }
    const uploaded = [];
    const thumbs = h('div', { class: 'upload-thumbs' });
    const attrBox = h('div', { class: 'attr-box' });

    function renderAttrs(category) {
      const defs = category ? state.meta.categories[category].attrs : {};
      attrBox.replaceChildren(...Object.entries(defs).map(([key, d]) => {
        const input = d.type === 'enum'
          ? h('select', { name: `attr.${key}`, required: d.required }, h('option', { value: '' }, t('choose')), d.options.map((o) => h('option', { value: o }, opt(o))))
          : h('input', { name: `attr.${key}`, type: d.type === 'int' ? 'number' : 'text', min: d.min, max: d.max, required: d.required });
        return h('label', { class: 'field' }, h('span', {}, label(d), d.required ? ' *' : ''), input);
      }));
    }

    // Resize client-side to keep uploads small and fast on mobile networks.
    async function resize(file) {
      const bmp = await createImageBitmap(file);
      const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(bmp.width * scale);
      canvas.height = Math.round(bmp.height * scale);
      canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.82);
    }

    const fileInput = h('input', { type: 'file', accept: 'image/*', multiple: true, onchange: guard(async (e) => {
      for (const file of [...e.target.files].slice(0, 10 - uploaded.length)) {
        const r = await api('POST', '/api/uploads', { data: await resize(file) });
        uploaded.push(r.id);
        thumbs.append(h('img', { src: r.url, alt: '' }));
      }
      e.target.value = '';
    }) });

    const form = h('form', { class: 'form panel', onsubmit: guard(async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const attrs = {};
      for (const [k, v] of fd) if (k.startsWith('attr.') && v) attrs[k.slice(5)] = v;
      const l = await api('POST', '/api/listings', {
        category: fd.get('category'), city: fd.get('city'), title: fd.get('title'), description: fd.get('description'),
        price: fd.get('price') || null, attrs, images: uploaded,
      });
      location.hash = `#/listing/${l.id}`;
    }) },
      h('h1', {}, t('post')),
      h('label', { class: 'field' }, h('span', {}, t('category'), ' *'),
        h('select', { name: 'category', required: true, onchange: (e) => renderAttrs(e.target.value) },
          h('option', { value: '' }, t('choose')),
          Object.entries(state.meta.categories).map(([k, c]) => h('option', { value: k }, `${c.icon} ${label(c)}`)))),
      attrBox,
      h('label', { class: 'field' }, h('span', {}, t('title'), ' *'), h('input', { name: 'title', required: true, minlength: 4, maxlength: 90 })),
      h('label', { class: 'field' }, h('span', {}, t('description'), ' *'), h('textarea', { name: 'description', required: true, minlength: 10, maxlength: 4000, rows: 5 })),
      h('label', { class: 'field' }, h('span', {}, t('price'), ` (${t('sar')})`), h('input', { name: 'price', type: 'number', min: 0, placeholder: t('no_price') })),
      h('label', { class: 'field' }, h('span', {}, t('city'), ' *'),
        h('select', { name: 'city', required: true },
          h('option', { value: '' }, t('choose')),
          Object.entries(state.meta.cities).map(([k, c]) => h('option', { value: k, selected: k === state.me.city }, label(c))))),
      h('label', { class: 'field' }, h('span', {}, t('photos')), h('small', { class: 'meta' }, t('add_photos')), fileInput),
      thumbs,
      h('button', { class: 'btn btn-primary', type: 'submit' }, t('publish')));
    view.replaceChildren(form);
  }

  function pageAuth(mode) {
    const isReg = mode === 'register';
    const form = h('form', { class: 'form panel narrow', onsubmit: guard(async (e) => {
      e.preventDefault();
      const fd = Object.fromEntries(new FormData(form));
      await api('POST', `/api/auth/${isReg ? 'register' : 'login'}`, fd);
      await refreshMe();
      location.hash = '#/';
    }) },
      h('h1', {}, isReg ? t('register') : t('login')),
      isReg ? h('label', { class: 'field' }, h('span', {}, t('name')), h('input', { name: 'name', required: true, autocomplete: 'name' })) : null,
      h('label', { class: 'field' }, h('span', {}, t('phone')), h('input', { name: 'phone', required: true, type: 'tel', dir: 'ltr', placeholder: '05xxxxxxxx', autocomplete: 'tel' })),
      h('label', { class: 'field' }, h('span', {}, t('password')), h('input', { name: 'password', required: true, type: 'password', minlength: isReg ? 8 : 1, autocomplete: isReg ? 'new-password' : 'current-password' })),
      isReg ? h('label', { class: 'field' }, h('span', {}, t('city')),
        h('select', { name: 'city' }, h('option', { value: '' }, t('choose')), Object.entries(state.meta.cities).map(([k, c]) => h('option', { value: k }, label(c))))) : null,
      h('button', { class: 'btn btn-primary', type: 'submit' }, isReg ? t('register') : t('login')),
      h('p', { class: 'meta' }, isReg ? t('have_account') : t('no_account'), ' ', h('a', { href: isReg ? '#/login' : '#/register' }, isReg ? t('login') : t('register'))));
    view.replaceChildren(form);
  }

  async function pageAccount(tab = 'listings') {
    if (!state.me) { location.hash = '#/login'; return; }
    const tabs = ['listings', 'favorites', 'orders', 'alerts'];
    const tabLabel = { listings: t('my_listings'), favorites: t('favorites'), orders: t('orders'), alerts: t('saved_searches') };
    let body;

    if (tab === 'listings') {
      const { items } = await api('GET', '/api/me/listings');
      body = items.length ? h('div', { class: 'rows' }, items.map((l) => h('div', { class: 'row panel' },
        h('a', { href: `#/listing/${l.id}` }, h('b', {}, l.title)),
        h('span', { class: 'meta' }, money(l.price), ' · ', t(`status_${l.status}`), l.featured ? ` · ${t('featured')}` : ''),
        h('div', { class: 'actions' },
          l.status === 'active' ? [
            h('button', { class: 'btn', onclick: guard(async () => { await api('PATCH', `/api/listings/${l.id}`, { status: 'sold' }); route(); }) }, t('mark_sold')),
            l.featured ? null : h('button', { class: 'btn', onclick: guard(async () => { await api('POST', `/api/listings/${l.id}/feature`); route(); }) }, t('feature')),
          ] : null,
          l.status !== 'hidden' ? h('button', { class: 'btn btn-ghost', onclick: guard(async () => { await api('PATCH', `/api/listings/${l.id}`, { status: 'removed' }); route(); }) }, t('remove')) : null)))) : h('p', { class: 'empty' }, t('empty'));
    } else if (tab === 'favorites') {
      body = grid((await api('GET', '/api/me/favorites')).items);
    } else if (tab === 'orders') {
      const { items } = await api('GET', '/api/me/orders');
      const btns = { buyer: { funded: ['confirm', 'cancel', 'dispute'], shipped: ['confirm', 'dispute'] }, seller: { funded: ['ship'] } };
      body = items.length ? h('div', { class: 'rows' }, items.map((o) => h('div', { class: 'row panel' },
        h('a', { href: `#/listing/${o.listing.id}` }, h('b', {}, o.listing.title)),
        h('span', { class: 'meta' }, o.role === 'buyer' ? t('as_buyer') : t('as_seller'), ' · ', money(o.amount), ' · ', h('b', {}, t(`order_${o.status}`))),
        h('div', { class: 'actions' },
          ((btns[o.role] || {})[o.status] || []).map((a) => h('button', { class: a === 'confirm' ? 'btn btn-safe' : 'btn', onclick: guard(async () => { await api('POST', `/api/orders/${o.id}/${a}`); route(); }) }, t(a))),
          o.role === 'buyer' && o.status === 'completed' && !o.reviewed ? h('form', { class: 'inline', onsubmit: guard(async (e) => {
            e.preventDefault();
            await api('POST', `/api/orders/${o.id}/review`, { rating: Number(e.target.rating.value), comment: e.target.comment.value });
            route();
          }) }, h('select', { name: 'rating' }, [5, 4, 3, 2, 1].map((n) => h('option', { value: n }, '★'.repeat(n)))),
          h('input', { name: 'comment', maxlength: 500 }), h('button', { class: 'btn', type: 'submit' }, t('rate'))) : null)))) : h('p', { class: 'empty' }, t('empty'));
    } else {
      const { items } = await api('GET', '/api/saved-searches');
      body = items.length ? h('div', { class: 'rows' }, items.map((s) => {
        const qs = new URLSearchParams(s.query);
        const desc = [s.query.q, s.query.category && label(state.meta.categories[s.query.category]), s.query.city && label(state.meta.cities[s.query.city])].filter(Boolean).join(' · ');
        return h('div', { class: 'row panel' },
          h('a', { href: `#/search?${qs}`, onclick: () => api('POST', `/api/saved-searches/${s.id}/seen`) }, h('b', {}, desc || qs.toString())),
          s.new_count ? h('span', { class: 'badge' }, t('new_count', { n: s.new_count })) : null,
          h('button', { class: 'btn btn-ghost', onclick: guard(async () => { await api('DELETE', `/api/saved-searches/${s.id}`); route(); }) }, t('remove')));
      })) : h('p', { class: 'empty' }, t('empty'));
    }

    const verifyBox = state.me.verified ? null : h('form', { class: 'panel verify', onsubmit: guard(async (e) => {
      e.preventDefault();
      await api('POST', '/api/me/verify', { national_id: e.target.national_id.value });
      await refreshMe();
      route();
    }) }, h('b', {}, '✓ ', t('verify')), h('p', { class: 'meta' }, t('verify_explain')),
    h('div', { class: 'inline' }, h('input', { name: 'national_id', inputmode: 'numeric', dir: 'ltr', placeholder: t('national_id'), required: true }), h('button', { class: 'btn btn-primary', type: 'submit' }, t('verify_btn'))));

    view.replaceChildren(
      h('div', { class: 'account-head' },
        h('h1', {}, state.me.name, ' ', state.me.verified ? h('span', { class: 'chip chip-ok' }, '✓ ', t('verified')) : null),
        h('button', { class: 'btn btn-ghost', onclick: guard(async () => { await api('POST', '/api/auth/logout'); await refreshMe(); location.hash = '#/'; }) }, t('logout'))),
      verifyBox,
      h('div', { class: 'tabs' }, tabs.map((k) => h('a', { href: `#/account/${k}`, class: k === tab ? 'active' : '' }, tabLabel[k]))),
      body);
  }

  async function pageInbox() {
    if (!state.me) { location.hash = '#/login'; return; }
    const { items } = await api('GET', '/api/conversations');
    view.replaceChildren(h('h1', {}, t('inbox')), items.length ? h('div', { class: 'rows' }, items.map((c) =>
      h('a', { href: `#/chat/${c.id}`, class: 'row panel convo' + (c.unread ? ' unread' : '') },
        c.listing.image ? h('img', { src: c.listing.image, alt: '' }) : h('div', { class: 'noimg small' }, '📦'),
        h('div', {}, h('b', {}, c.other.name), ' ', ...sellerBadges(c.other),
          h('div', { class: 'meta' }, c.listing.title),
          h('div', { class: 'meta' }, c.last ? (c.last.offer_amount ? `${t('offer')}: ${money(c.last.offer_amount)}` : c.last.body) : '')),
        c.unread ? h('span', { class: 'badge' }, c.unread) : null))) : h('p', { class: 'empty' }, t('no_messages')));
  }

  async function pageChat(id) {
    const c = await api('GET', `/api/conversations/${id}`);
    refreshMe();
    const msgs = c.messages.map((m) => h('div', { class: 'msg' + (m.mine ? ' mine' : '') },
      m.risk_flag && !m.mine ? h('div', { class: 'risk' }, t('risk_warning')) : null,
      m.offer_amount ? h('div', { class: 'offer' }, h('b', {}, t('offer'), ': ', money(m.offer_amount)), ' — ', t(`offer_${m.offer_status}`),
        c.role === 'seller' && m.offer_status === 'pending' ? h('div', { class: 'actions' },
          h('button', { class: 'btn btn-safe', onclick: guard(async () => { await api('POST', `/api/messages/${m.id}/offer`, { action: 'accept' }); route(); }) }, t('accept')),
          h('button', { class: 'btn', onclick: guard(async () => { await api('POST', `/api/messages/${m.id}/offer`, { action: 'reject' }); route(); }) }, t('reject'))) : null,
        c.role === 'buyer' && m.offer_status === 'accepted' && c.listing.status === 'active' ? h('button', { class: 'btn btn-safe', onclick: guard(async () => {
          if (!(await ask(t('confirm_buy', { amount: m.offer_amount.toLocaleString() }), t('escrow_explain')))) return;
          await api('POST', `/api/listings/${c.listing.id}/orders`);
          location.hash = '#/account/orders';
        }) }, '🛡️ ', t('buy_safe')) : null) : null,
      m.body ? h('div', { class: 'bubble' }, m.body) : null,
      h('small', { class: 'meta' }, ago(m.created_at))));

    const send = guard(async (payload) => { await api('POST', `/api/conversations/${c.id}/messages`, payload); route(); });
    const composer = h('form', { class: 'composer', onsubmit: (e) => { e.preventDefault(); const v = e.target.body.value.trim(); if (v) send({ body: v }); } },
      h('input', { name: 'body', placeholder: t('message'), autocomplete: 'off', maxlength: 2000 }),
      h('button', { class: 'btn btn-primary', type: 'submit' }, t('send')));
    const offerForm = c.role === 'buyer' && c.listing.status === 'active' ? h('form', { class: 'composer offer-form', onsubmit: (e) => {
      e.preventDefault(); const v = Number(e.target.amount.value); if (v > 0) send({ offer_amount: v });
    } }, h('input', { name: 'amount', type: 'number', min: 1, placeholder: `${t('make_offer')} (${t('sar')})` }), h('button', { class: 'btn', type: 'submit' }, t('offer'))) : null;

    const log = h('div', { class: 'chat-log' }, msgs);
    view.replaceChildren(h('div', { class: 'chat' },
      h('a', { href: `#/listing/${c.listing.id}`, class: 'chat-head panel' },
        c.listing.image ? h('img', { src: c.listing.image, alt: '' }) : null,
        h('div', {}, h('b', {}, c.listing.title), h('div', { class: 'meta' }, money(c.listing.price), ' · ', c.other.name, ' ', ...sellerBadges(c.other)))),
      h('div', { class: 'panel tip' }, '🛡️ ', t('safety_tips')),
      log, offerForm, composer));
    log.scrollTop = log.scrollHeight;
  }

  async function pageUser(id) {
    const { user: u, reviews, listings } = await api('GET', `/api/users/${id}`);
    view.replaceChildren(
      h('div', { class: 'panel profile' }, h('div', { class: 'avatar big' }, u.name[0]),
        h('div', {}, h('h1', {}, u.name), h('div', {}, ...sellerBadges(u)),
          h('p', { class: 'meta' }, u.rating ? `★ ${u.rating} (${u.review_count} ${t('reviews')}) · ` : '', `${u.completed_sales} ${t('sales')} · ${t('member_since')} ${new Date(u.member_since).getFullYear()}`))),
      h('h2', {}, t('reviews')),
      reviews.length ? h('div', { class: 'rows' }, reviews.map((r) => h('div', { class: 'row panel' }, h('b', {}, '★'.repeat(r.rating)), ' ', r.reviewer, h('p', {}, r.comment)))) : h('p', { class: 'empty' }, t('no_reviews')),
      h('h2', {}, t('latest')),
      grid(listings));
  }

  // ---------- router ----------
  async function route() {
    const hash = location.hash.slice(1) || '/';
    const [pathPart, queryPart] = hash.split('?');
    const parts = pathPart.split('/').filter(Boolean);
    const params = Object.fromEntries(new URLSearchParams(queryPart || ''));
    window.scrollTo(0, 0);
    try {
      switch (parts[0]) {
        case undefined: return await pageHome();
        case 'search': return await pageSearch(params);
        case 'listing': return await pageListing(parts[1]);
        case 'post': return await pagePost();
        case 'login': return pageAuth('login');
        case 'register': return pageAuth('register');
        case 'account': return await pageAccount(parts[1]);
        case 'inbox': return await pageInbox();
        case 'chat': return await pageChat(parts[1]);
        case 'user': return await pageUser(parts[1]);
        default: return await pageHome();
      }
    } catch (e) {
      view.replaceChildren(h('p', { class: 'empty' }, e.message));
    }
  }

  $('#search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = $('#search-input').value.trim();
    location.hash = `#/search?${new URLSearchParams(q ? { q } : {})}`;
  });
  window.addEventListener('hashchange', route);
  // Lets the demo build re-render after switching the signed-in account.
  window.souqnaRefresh = async () => { await refreshMe(); await route(); };

  (async () => {
    applyLang();
    state.meta = await api('GET', '/api/meta');
    await refreshMe();
    route();
    setInterval(() => { if (state.me && !document.hidden) refreshMe().catch(() => {}); }, 30000);
  })();
})();
