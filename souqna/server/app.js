'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { openDb } = require('./db');
const { createApi } = require('./api');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const MAX_BODY = 3 * 1024 * 1024;

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
};

const CSP = [
  "default-src 'self'", "img-src 'self' data: blob:", "style-src 'self' https://fonts.googleapis.com",
  'font-src https://fonts.gstatic.com', "script-src 'self'", "object-src 'none'", "base-uri 'none'",
].join('; ');

function createApp({ dbFile = ':memory:', uploadDir } = {}) {
  const db = openDb(dbFile);
  uploadDir = uploadDir || path.join(__dirname, '..', 'data', 'uploads');
  fs.mkdirSync(uploadDir, { recursive: true });

  const api = createApi({
    db,
    storeImage: (id, bin) => fs.writeFileSync(path.join(uploadDir, `${id}.jpg`), Buffer.from(bin, 'latin1')),
    imageUrl: (id) => `/uploads/${id}.jpg`,
  });

  function readBody(req) {
    return new Promise((resolve) => {
      const chunks = [];
      let size = 0;
      req.on('data', (c) => {
        size += c.length;
        if (size > MAX_BODY) { resolve({ error: 413 }); req.destroy(); return; }
        chunks.push(c);
      });
      req.on('end', () => {
        if (!size) return resolve({ body: {} });
        try { resolve({ body: JSON.parse(Buffer.concat(chunks).toString('utf8')) }); } catch { resolve({ error: 400 }); }
      });
      req.on('error', () => resolve({ error: 400 }));
    });
  }

  function serveFile(res, file) {
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found'); }
      res.writeHead(200, {
        'Content-Type': MIME[path.extname(file)] || 'application/octet-stream',
        'Cache-Control': file.startsWith(uploadDir) ? 'public, max-age=31536000, immutable' : 'no-cache',
      });
      res.end(data);
    });
  }

  function send(res, status, obj, cookie) {
    const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
    if (cookie) headers['Set-Cookie'] = `sid=${cookie.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${cookie.maxAge}`;
    res.writeHead(status, headers);
    res.end(JSON.stringify(obj));
  }

  async function handle(req, res) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'same-origin');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Content-Security-Policy', CSP);
    const url = new URL(req.url, 'http://localhost');
    let pathname;
    try { pathname = decodeURIComponent(url.pathname); } catch { return send(res, 400, { error: 'bad_path' }); }

    if (!pathname.startsWith('/api/')) {
      if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error: 'method_not_allowed' });
      const up = /^\/uploads\/([a-f0-9]{24})\.jpg$/.exec(pathname);
      if (up) return serveFile(res, path.join(uploadDir, `${up[1]}.jpg`));
      const file = path.normalize(path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname));
      if (!file.startsWith(PUBLIC_DIR + path.sep)) return send(res, 404, { error: 'not_found' });
      return serveFile(res, fs.existsSync(file) ? file : path.join(PUBLIC_DIR, 'index.html'));
    }

    // CSRF defence: state-changing API calls must be JSON (a cross-site form can't send that without CORS preflight).
    if (req.method !== 'GET' && !String(req.headers['content-type'] || '').startsWith('application/json')) {
      return send(res, 415, { error: 'json_required' });
    }
    let body = {};
    if (req.method !== 'GET') {
      const r = await readBody(req);
      if (r.error) return send(res, r.error, { error: r.error === 413 ? 'body_too_large' : 'invalid_json' });
      body = r.body;
    }
    const token = (/(?:^|;\s*)sid=([A-Za-z0-9_-]+)/.exec(req.headers.cookie || '') || [])[1] || null;
    const out = api.dispatch({
      method: req.method, pathname, query: Object.fromEntries(url.searchParams), body, token, ip: req.socket.remoteAddress,
    });
    return send(res, out.status, out.body, out.cookie);
  }

  const server = http.createServer((req, res) => {
    handle(req, res).catch((e) => { console.error(e); if (!res.headersSent) send(res, 500, { error: 'internal' }); });
  });
  return { server, db };
}

module.exports = { createApp };
