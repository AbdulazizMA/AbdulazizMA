'use strict';

// node:crypto is unavailable in the in-browser demo build; that build falls back to a non-secret hash
// (its data never leaves the visitor's own browser). The Node server always uses scrypt.
const nodeCrypto = (() => { try { return require('node:crypto'); } catch { return null; } })();

function randomHex(bytes) {
  const buf = new Uint8Array(bytes);
  globalThis.crypto.getRandomValues(buf);
  return Array.from(buf, (b) => b.toString(16).padStart(2, '0')).join('');
}

function demoHash(password, salt) {
  let h = 2166136261;
  for (const ch of `${salt}:${password}`) h = Math.imul(h ^ ch.codePointAt(0), 16777619) >>> 0;
  return h.toString(16);
}

function hashPassword(password) {
  const salt = randomHex(16);
  if (!nodeCrypto) return `demo$${salt}$${demoHash(password, salt)}`;
  const hash = nodeCrypto.scryptSync(password, Buffer.from(salt, 'hex'), 64);
  return `scrypt$${salt}$${hash.toString('hex')}`;
}

function verifyPassword(password, stored) {
  const [scheme, saltHex, hashHex] = String(stored).split('$');
  if (!saltHex || !hashHex) return false;
  if (!nodeCrypto) return scheme === 'demo' && demoHash(password, saltHex) === hashHex;
  if (scheme !== 'scrypt') return false;
  const expected = Buffer.from(hashHex, 'hex');
  const actual = nodeCrypto.scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length);
  return nodeCrypto.timingSafeEqual(expected, actual);
}

// Saudi mobile numbers: 05XXXXXXXX, 5XXXXXXXX, +9665XXXXXXXX, 009665XXXXXXXX → 9665XXXXXXXX
function normalizePhone(input) {
  const digits = String(input || '').replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))).replace(/\D/g, '');
  const m = digits.match(/^(?:00966|966|0)?(5\d{8})$/);
  return m ? `966${m[1]}` : null;
}

// Mock of a Nafath/Absher identity check: Saudi national IDs start with 1, residents' iqamas with 2,
// and both use a Luhn-style check digit. A real integration would call the Nafath API instead.
function isValidSaudiId(id) {
  const s = String(id || '');
  if (!/^[12]\d{9}$/.test(s)) return false;
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    let d = Number(s[i]);
    if (i % 2 === 0) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

// Common classifieds scams in the region: asking for a bank transfer / deposit before viewing,
// moving the chat off-platform, or sharing an IBAN. We don't block — we warn the recipient.
const RISK_PATTERNS = [
  { flag: 'iban', re: /\bSA\d{2}\s?(?:\d{4}\s?){4}\d{0,4}\b/i },
  { flag: 'off_platform', re: /(واتس|واتساب|whats\s?app|telegram|تيليجرام|تلجرام)/i },
  { flag: 'prepayment', re: /(عربون|حوّل|حول المبلغ|تحويل قبل|deposit|transfer first|send money)/i },
  { flag: 'phone', re: /(?:\+?966|0)5\d{8}/ },
];

function detectRisk(text) {
  const t = String(text || '');
  const hit = RISK_PATTERNS.find((p) => p.re.test(t));
  return hit ? hit.flag : null;
}

// Escrow fee: 1% paid by the buyer, min 5 SAR, capped at 250 SAR. Listing is always free.
function escrowFee(amount) {
  return Math.min(250, Math.max(5, Math.round(amount * 0.01)));
}

module.exports = { randomHex, hashPassword, verifyPassword, normalizePhone, isValidSaudiId, detectRisk, escrowFee };
