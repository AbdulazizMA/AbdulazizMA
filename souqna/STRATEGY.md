# Souqna (سوقنا) — Strategy to take share from Haraj

## 1. The honest starting point

Haraj has been the default Saudi classifieds site for about twenty years. Its moat is **liquidity**, not technology. Buyers go there because the sellers are there, and sellers go there because the buyers are. Better features alone won't move anyone. The plan has to (a) win liquidity in one narrow slice at a time, and (b) offer something Haraj structurally can't or won't copy quickly.

## 2. Where Haraj is weak (our wedge)

| Haraj pain point | What users feel | Souqna answer (built in this MVP) |
|---|---|---|
| Scams: deposits sent before viewing, fake sellers | Fear, lost money | **Nafath-verified sellers** (✓ badge), **scam-pattern warnings in chat** (IBAN, "send a deposit", "move to WhatsApp"), community reports that auto-hide ads |
| No buyer protection | "If it goes wrong, it's my problem" | **Souqna Guarantee escrow**: money is held until the buyer confirms receipt. Disputes and refunds are a built-in state machine |
| Haggling in public comments, phone spam | Noise, harassment | **In-app chat with structured offers** (make / accept / reject). Phone numbers are masked and revealed only on demand, with rate limits against scrapers |
| "Is this price fair?" | Hours of manual comparison | **Fair-price check** on every car, property and livestock ad, based on comparable listings |
| Free text only, weak search | Can't filter by year, mileage or rooms | **Structured attributes per category** + Arabic-normalized full-text search (ة/ه, أ/ا, ى/ي, Arabic digits) + real filters |
| Reviews anyone can post | Ratings mean little | **Reviews only from completed escrow orders**, so they can't be faked |
| Honor-system 1% commission | Friction and guilt for sellers | **Posting is free, with no sale commission.** Revenue comes from optional value-add services |

## 3. Go-to-market: win one slice, then expand

**Phase 0: prove it (months 0–3)**
- **Vertical:** used cars. It's the biggest category, where scam fear and price-fairness pain are highest and the value of escrow is most obvious.
- **City:** Riyadh first, then Jeddah and Dammam.
- **Supply seeding:** sign up 150–300 used-car dealers and showrooms in person. Give them a free dealer tier, bulk upload, and a verified dealer badge. Dealers bring dozens of listings each.
- **Demand:** Snapchat, TikTok and X ads aimed at the fear of being scammed ("اشترِ بضمان — فلوسك محفوظة لين تستلم"). Partner with car-inspection centers (فحص) to offer a discounted inspection with guaranteed purchases.
- **Target:** 5,000 active car listings in Riyadh, with 30% of buyer conversations started inside the app.

**Phase 1: deepen the trust moat (months 3–9)**
- Integrate real **Nafath** (requires a licensed Saudi entity) and a **licensed escrow/payments partner**: Mada, Apple Pay and STC Pay through a SAMA-licensed provider.
- Add car history checks (Najm accident records where available), inspection booking, and financing leads from banks. Financing leads become a revenue line.
- Launch a native app (the current web app is already installable as a PWA).

**Phase 2: go horizontal (months 9–18)**
- Livestock (a Haraj stronghold: price insights plus escrow for high-value camels), real estate rentals (Ejar contract integration), and electronics (escrow with courier delivery via SPL, Aramex or SMSA).
- Expand to all 16 seeded cities, then the GCC.

## 4. Business model (no sale commission)

1. **Featured / bump listings** (already built: 25 SAR for 7 days).
2. **Dealer subscriptions**: bulk tools, analytics, lead CRM, storefront.
3. **Escrow fee**: 1% paid by the buyer, minimum 5 SAR, capped at 250 SAR. It's optional and priced as insurance.
4. **Lead generation**: car financing, insurance, inspections, moving services.
5. **Ads** only after liquidity exists. Never at the expense of trust.

## 5. Metrics that matter

- **Liquidity:** % of listings that get a conversation within 48h, and % sold within 30 days (per category and city).
- **Trust:** scam reports per 1,000 conversations, share of GMV going through escrow, % of verified sellers.
- **Growth:** weekly active buyers, new listings per week, and dealer retention.

## 6. Regulatory checklist (Saudi Arabia)

- Commercial Registration + e-commerce registration with the Ministry of Commerce (E-Commerce Law).
- **PDPL** (Personal Data Protection Law): keep data in-Kingdom, minimize what we collect. We already never store national ID numbers, only a verified flag.
- Escrow and payments only through a **SAMA-licensed** payment/escrow provider. We must not hold customer funds ourselves.
- Nafath integration through the official program for licensed entities.
- Category rules: the real estate ad license (REGA / Fal license number for brokers), animal-trade rules, and prohibited-items policy.

## 7. What this MVP is and isn't

**Built and tested:** accounts, structured listings with photos, Arabic-aware search and filters, fair-price insights, favorites, saved-search alerts, chat with offers and scam warnings, escrow order flow, review system tied to completed orders, reporting with auto-hide, mock identity verification, paid-feature boosting, a bilingual (AR/EN) RTL mobile-first UI, and security basics (scrypt passwords, HttpOnly cookies, CSP, CSRF guard, rate limits).

**Production gaps (next engineering steps):**
1. SMS OTP phone verification at sign-up (Unifonic, Taqnyat or Msegat).
2. Real Nafath and payment/escrow integrations (currently mocked).
3. Move from SQLite to Postgres, from local disk to object storage + CDN, and from in-memory rate limits to Redis. Add a search engine (OpenSearch/Meilisearch) once past ~1M listings.
4. Push notifications for chat and saved-search alerts; WebSocket chat.
5. Moderation dashboard, image moderation, and duplicate-listing detection.
6. Native apps (React Native / Flutter) that reuse the same API.
