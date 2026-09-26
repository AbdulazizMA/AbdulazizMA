'use strict';

// "Fair price" insight: compares a listing to similar ones (active or sold in the last 180 days).
// This is a trust feature Haraj doesn't have — buyers see if a price is reasonable at a glance.

function quantile(sorted, q) {
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return Math.round(sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo));
}

function priceInsight(db, listing) {
  if (!listing.price) return null;
  const attrs = JSON.parse(listing.attrs);
  const since = Date.now() - 180 * 24 * 3600 * 1000;
  let sql = `SELECT price FROM listings
             WHERE category = ? AND id != ? AND price > 0 AND status IN ('active','sold') AND created_at > ?`;
  const params = [listing.category, listing.id, since];

  if (listing.category === 'cars') {
    sql += ` AND json_extract(attrs,'$.make') = ? AND lower(json_extract(attrs,'$.model')) = lower(?)
             AND json_extract(attrs,'$.year') BETWEEN ? AND ?`;
    params.push(attrs.make, attrs.model, attrs.year - 1, attrs.year + 1);
  } else if (listing.category === 'real_estate') {
    sql += ` AND json_extract(attrs,'$.type') = ? AND json_extract(attrs,'$.purpose') = ? AND city = ?`;
    params.push(attrs.type, attrs.purpose, listing.city);
  } else if (listing.category === 'animals') {
    sql += ` AND json_extract(attrs,'$.kind') = ?`;
    params.push(attrs.kind);
  } else {
    return null; // too heterogeneous for a meaningful comparison
  }

  const prices = db.prepare(sql).all(...params).map((r) => r.price).sort((a, b) => a - b);
  if (prices.length < 3) return null;

  const p25 = quantile(prices, 0.25);
  const median = quantile(prices, 0.5);
  const p75 = quantile(prices, 0.75);
  let verdict = 'fair';
  if (listing.price < p25) verdict = 'good';
  else if (listing.price > p75) verdict = 'high';
  return { sample: prices.length, p25, median, p75, verdict };
}

module.exports = { priceInsight };
