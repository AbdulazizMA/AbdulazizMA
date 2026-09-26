'use strict';

let DatabaseSync;
try {
  ({ DatabaseSync } = require('node:sqlite'));
} catch {
  console.error(`\nSouqna needs Node.js 22.5 or newer (you have ${process.version}).\nDownload the LTS version from https://nodejs.org and try again.\n`);
  process.exit(1);
}

const SCHEMA = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  city TEXT,
  verified INTEGER NOT NULL DEFAULT 0,
  is_dealer INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS listings (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER,
  city TEXT NOT NULL,
  attrs TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active',  -- active | sold | removed | hidden
  featured_until INTEGER NOT NULL DEFAULT 0,
  views INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_listings_browse ON listings(status, category, city, created_at);
CREATE INDEX IF NOT EXISTS idx_listings_user ON listings(user_id);

CREATE VIRTUAL TABLE IF NOT EXISTS listings_fts USING fts5(text, tokenize = 'unicode61 remove_diacritics 2');

CREATE TABLE IF NOT EXISTS uploads (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS favorites (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, listing_id)
);

CREATE TABLE IF NOT EXISTS conversations (
  id INTEGER PRIMARY KEY,
  listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  buyer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  updated_at INTEGER NOT NULL,
  UNIQUE (listing_id, buyer_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY,
  conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  offer_amount INTEGER,
  offer_status TEXT,           -- pending | accepted | rejected (only when offer_amount is set)
  risk_flag TEXT,              -- set when the message looks like a common scam pattern
  created_at INTEGER NOT NULL,
  read_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id, id);

CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY,
  order_id INTEGER NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  reviewer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS reports (
  reporter_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (reporter_id, listing_id)
);

-- Escrow ("Souqna Guarantee"): buyer funds are held until the buyer confirms receipt.
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY,
  listing_id INTEGER NOT NULL REFERENCES listings(id),
  buyer_id INTEGER NOT NULL REFERENCES users(id),
  seller_id INTEGER NOT NULL REFERENCES users(id),
  amount INTEGER NOT NULL,
  fee INTEGER NOT NULL,
  status TEXT NOT NULL,        -- funded | shipped | completed | disputed | refunded | cancelled
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS saved_searches (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  last_seen_id INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);
`;

function openDb(file) {
  const db = new DatabaseSync(file);
  db.exec(SCHEMA);
  return db;
}

// Arabic-aware normalization so "سياره" finds "سيارة", "احمد" finds "أحمد", etc.
function normalizeArabic(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[ً-ٰٟـ]/g, '') // tashkeel + tatweel
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
}

function indexListing(db, listing) {
  const attrs = typeof listing.attrs === 'string' ? JSON.parse(listing.attrs) : listing.attrs;
  const text = normalizeArabic([listing.title, listing.description, ...Object.values(attrs || {})].join(' '));
  db.prepare('DELETE FROM listings_fts WHERE rowid = ?').run(listing.id);
  db.prepare('INSERT INTO listings_fts (rowid, text) VALUES (?, ?)').run(listing.id, text);
}

// Turns free text into a safe FTS5 prefix query: each token quoted, AND-ed.
function ftsQuery(q) {
  const tokens = normalizeArabic(q).match(/[\p{L}\p{N}]+/gu) || [];
  return tokens.slice(0, 8).map((t) => `"${t}"*`).join(' ');
}

module.exports = { openDb, normalizeArabic, indexListing, ftsQuery };
