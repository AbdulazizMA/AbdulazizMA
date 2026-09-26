'use strict';

// Builds dist/souqna-demo.html: a single self-contained page that runs the real Souqna API
// (server/api.js + the same SQL schema) inside the browser on SQLite compiled to JavaScript (sql.js).
// Each visitor gets a private copy of the marketplace, seeded with demo data and saved in IndexedDB.
//
//   npm install && npm run build:demo

const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const MODULES = ['catalog', 'db', 'trust', 'pricing', 'api', 'seed'];

// Keep inline scripts from terminating early.
const safe = (js) => js.replace(/<\/script/gi, '<\\/script');

const bundle = `(() => {
  const defs = {
${MODULES.map((m) => `    './${m}': function (module, exports, require) {\n${read(`server/${m}.js`)}\n    },`).join('\n')}
  };
  const cache = {};
  function require(name) {
    if (!defs[name]) throw new Error('Module not available in the browser: ' + name);
    if (!cache[name]) {
      const module = { exports: {} };
      cache[name] = module;
      defs[name](module, module.exports, require);
    }
    return cache[name].exports;
  }
  window.SouqnaServer = { require };
})();`;

const runtime = `(() => {
  const { require } = window.SouqnaServer;
  const { initSchema } = require('./db');
  const { createApi } = require('./api');
  const { seedDemo } = require('./seed');

  const IDB_NAME = 'souqna-demo', IDB_STORE = 'db', IDB_KEY = 'main';
  const idb = () => new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  async function loadBytes() {
    try {
      const d = await idb();
      return await new Promise((resolve) => {
        const r = d.transaction(IDB_STORE).objectStore(IDB_STORE).get(IDB_KEY);
        r.onsuccess = () => resolve(r.result || null);
        r.onerror = () => resolve(null);
      });
    } catch { return null; }
  }
  async function saveBytes(bytes) {
    try {
      const d = await idb();
      d.transaction(IDB_STORE, 'readwrite').objectStore(IDB_STORE).put(bytes, IDB_KEY);
    } catch { /* storage unavailable: the demo still works for this visit */ }
  }

  // node:sqlite-style facade over sql.js so server/api.js runs unchanged.
  function adapt(raw) {
    const norm = (args) => args.map((a) => (a === undefined ? null : typeof a === 'boolean' ? Number(a) : a));
    return {
      raw,
      exec: (sql) => { raw.exec(sql); },
      prepare: (sql) => ({
        run: (...args) => {
          raw.run(sql, norm(args));
          const changes = raw.getRowsModified();
          const lastInsertRowid = raw.exec('SELECT last_insert_rowid()')[0].values[0][0];
          return { changes, lastInsertRowid };
        },
        get: (...args) => {
          const st = raw.prepare(sql);
          try { st.bind(norm(args)); return st.step() ? st.getAsObject() : undefined; } finally { st.free(); }
        },
        all: (...args) => {
          const st = raw.prepare(sql);
          try { st.bind(norm(args)); const rows = []; while (st.step()) rows.push(st.getAsObject()); return rows; } finally { st.free(); }
        },
      }),
    };
  }

  let api, db, saveTimer;
  const blobUrls = new Map();

  function boot(SQL, bytes) {
    db = adapt(bytes ? new SQL.Database(bytes) : new SQL.Database());
    initSchema(db);
    db.exec('CREATE TABLE IF NOT EXISTS demo_images (id TEXT PRIMARY KEY, mime TEXT NOT NULL, data BLOB NOT NULL)');
    if (seedDemo(db)) persist();
    api = createApi({
      db,
      storeImage: (id, bin, mime) => {
        const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
        db.prepare('INSERT INTO demo_images (id, mime, data) VALUES (?, ?, ?)').run(id, mime, bytes);
      },
      imageUrl: (id) => {
        if (!blobUrls.has(id)) {
          const row = db.prepare('SELECT mime, data FROM demo_images WHERE id = ?').get(id);
          blobUrls.set(id, row ? URL.createObjectURL(new Blob([row.data], { type: row.mime })) : '');
        }
        return blobUrls.get(id);
      },
    });
  }

  function persist() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => saveBytes(db.raw.export()), 400);
  }

  const ready = (async () => {
    const SQL = await initSqlJs();
    window.__souqnaSQL = SQL;
    boot(SQL, await loadBytes());
  })();

  const TOKEN_KEY = 'souqna-demo-sid';
  let memToken = null;
  const getToken = () => { try { return localStorage.getItem(TOKEN_KEY); } catch { return memToken; } };
  const setToken = (v) => { memToken = v; try { v ? localStorage.setItem(TOKEN_KEY, v) : localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ } };

  window.souqnaFetch = async (input, opts = {}) => {
    await ready;
    const url = new URL(input, 'https://souqna.demo');
    const method = (opts.method || 'GET').toUpperCase();
    let body = {};
    if (opts.body) { try { body = JSON.parse(opts.body); } catch { body = {}; } }
    const out = api.dispatch({
      method, pathname: url.pathname, query: Object.fromEntries(url.searchParams), body, token: getToken(), ip: 'demo',
    });
    if (out.cookie) setToken(out.cookie.token || null);
    persist();
    return new Response(JSON.stringify(out.body), { status: out.status, headers: { 'content-type': 'application/json' } });
  };

  // Demo bar: one-tap sign-in as a seeded buyer or seller, and a reset.
  async function signIn(phone) {
    await window.souqnaFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ phone, password: 'password123' }) });
    await window.souqnaRefresh();
  }
  document.getElementById('demo-buyer').addEventListener('click', () => signIn('0500000005'));
  document.getElementById('demo-seller').addEventListener('click', async () => { await signIn('0500000001'); location.hash = '#/account'; });
  document.getElementById('demo-reset').addEventListener('click', async () => {
    await ready;
    setToken(null);
    blobUrls.clear();
    boot(window.__souqnaSQL, null);
    await saveBytes(db.raw.export());
    location.hash = '#/';
    await window.souqnaRefresh();
  });
})();`;

const indexHtml = read('public/index.html');
const bodyMarkup = indexHtml.slice(indexHtml.indexOf('<body>') + 6, indexHtml.indexOf('  <script src="/i18n.js">'));
const sqlJs = fs.readFileSync(require.resolve('sql.js/dist/sql-asm.js'), 'utf8');

const html = `<title>Souqna Marketplace</title>
<meta name="description" content="سوقنا: سوق إعلانات مبوبة موثوق في السعودية. بائعون موثقون، دفع مضمون، وتقييم عادل للأسعار.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700&display=swap">
<style>
${read('public/styles.css')}
</style>
<div class="demo-bar" role="note">
  <span><b>نسخة تجريبية · Demo</b><span class="long"> — تعمل بالكامل داخل متصفحك · runs entirely in your browser</span></span>
  <button id="demo-buyer" class="btn" type="button">جرّب كمشتري · Try as buyer</button>
  <button id="demo-seller" class="btn" type="button">جرّب كبائع · Try as seller</button>
  <button id="demo-reset" class="btn btn-ghost" type="button">إعادة ضبط · Reset</button>
</div>
${bodyMarkup.trim()}
<script>
${safe(sqlJs)}
</script>
<script>
${safe(read('public/i18n.js'))}
</script>
<script>
${safe(bundle)}
</script>
<script>
${safe(runtime)}
</script>
<script>
${safe(read('public/app.js'))}
</script>
`;

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
const out = path.join(root, 'dist', 'souqna-demo.html');
fs.writeFileSync(out, html);
console.log(`Wrote ${path.relative(process.cwd(), out)} (${(html.length / 1024 / 1024).toFixed(2)} MB)`);
