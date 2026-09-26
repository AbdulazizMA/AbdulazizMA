# سوقنا — Souqna

A trust-first classifieds marketplace for Saudi Arabia, built to compete with Haraj.
See [STRATEGY.md](STRATEGY.md) for the plan to win market share.

**Key differences from Haraj:** Nafath-verified sellers · escrow "Souqna Guarantee" · fair-price check on every ad ·
in-app chat with structured offers and scam-pattern warnings · reviews only from real completed orders ·
structured filters with Arabic-aware search · free posting, no sale commission.

## Live demo

**https://claude.ai/artifact/DT9xdqkYS9vE97JMFk4HKp** — the full app running inside your browser (use the
"Try as buyer / seller" buttons to walk through chat → offer → escrow → review). Each visitor gets a private copy
seeded with demo ads. Rebuild it with `npm install && npm run build:demo` (writes `dist/souqna-demo.html`), which
bundles the same `server/api.js` with SQLite compiled to JavaScript (sql.js).

## Run it

Requires Node.js ≥ 22.5 (uses the built-in `node:sqlite`). The server has no dependencies to install.

```bash
cd souqna
npm run seed     # optional demo data (log in with 0500000001 / password123)
npm start        # http://localhost:3000
npm test
```

Environment: `PORT` (default 3000) and `DATA_DIR` (default `./data`, which holds the SQLite DB and uploads).

## Layout

```
server/
  api.js       all API endpoints, transport-neutral (used by the server and the browser demo)
  app.js       Node HTTP server: static files, uploads, cookies, CSRF guard
  db.js        schema, Arabic normalization, full-text index
  catalog.js   categories (with structured attribute schemas) and cities
  trust.js     password hashing, phone/ID validation, scam detection, escrow fee
  pricing.js   fair-price insight from comparable listings
  seed.js      demo data
public/        bilingual RTL single-page app (vanilla JS, no build step)
scripts/       build-demo.js — single-file in-browser demo build
test/          API + unit tests (node:test)
```

## API overview

| Area | Endpoints |
|---|---|
| Auth | `POST /api/auth/register`, `/login`, `/logout` · `GET /api/me` · `POST /api/me/verify` |
| Listings | `GET /api/listings?q&category&city&min&max&sort&verified&attr.<key>[_min/_max]` · `GET/PATCH /api/listings/:id` · `POST /api/listings` · `POST /api/listings/:id/{favorite,report,feature}` · `GET /api/listings/:id/phone` |
| Media | `POST /api/uploads` (JPEG/PNG/WebP data URL, ≤2 MB) |
| Chat & offers | `POST /api/listings/:id/conversations` · `GET /api/conversations[/:id]` · `POST /api/conversations/:id/messages` · `POST /api/messages/:id/offer` |
| Escrow | `POST /api/listings/:id/orders` · `GET /api/me/orders` · `POST /api/orders/:id/{ship,confirm,dispute,cancel,review}` |
| Alerts | `GET/POST /api/saved-searches` · `POST /api/saved-searches/:id/seen` · `DELETE /api/saved-searches/:id` |
| Profiles | `GET /api/users/:id` |

Identity verification and payments are **mocked**. See STRATEGY.md §7 for the production integrations.
