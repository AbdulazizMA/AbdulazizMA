# Makkah apartments website

A fast English + Arabic website that shows your apartment photos and sends guests to **Airbnb / Booking.com** to book.

- `site/config.json` – **the only file you normally edit** (name, WhatsApp, location, Airbnb links, photos list, reviews).
- `site/build.js` – generates the website. Run `node site/build.js` after every change.
- `docs/` – the finished website (this is what gets published). Photos go in `docs/images/`.

## What's on the site

- English page (`/`) and Arabic page (`/ar/`), linked for Google with `hreflang`.
- Big cover photo, photo gallery with a full-screen viewer (swipe on phones).
- Apartment details, amenities, location with map and distances.
- "Book now" buttons (top of the page, hero, and the bar at the bottom on phones) open your Airbnb listing directly.
- A "large family / group" section, since all your apartments are identical and groups can book several side by side.
- FAQ, WhatsApp/phone/email contact, a booking bar that stays at the bottom on phones, and your tourism license number.
- SEO: page titles and descriptions for Umrah/Hajj searches, Google structured data (LodgingBusiness + FAQ), sitemap with images, robots.txt, social-share previews.

## What I still need from you

1. **Airbnb link for each apartment** (and Booking.com links if you have them).
2. **Photos**, either the originals from your phone (best quality) or permission to use the Airbnb ones. Rename them to match the `gallery` list in `config.json`.
3. WhatsApp number, email, and your **Ministry of Tourism license number**.
4. The building's Google Maps pin, the neighborhood, and real travel times to the Haram.
5. Guests, bedrooms, beds, bathrooms and size (m²), plus a one-line description of the layout.
6. Which amenities you really have (remove the others).
7. A few real guest reviews copied from Airbnb (optional). Never invent any.
8. A brand name if you want one other than "Makkah Family Apartments".

## Publishing (free, with GitHub Pages)

1. On GitHub, open this repository → **Settings → Pages**.
2. Under "Build and deployment", choose **Deploy from a branch**, branch `main`, folder **`/docs`**, then Save.
3. The site goes live at `https://abdulazizma.github.io/AbdulazizMA/` within a few minutes.

**Strongly recommended: your own domain** (about 40–60 SAR a year). Choose something like `makkahfamilyapartments.com`. A matching `.sa` domain also works but has extra registration requirements. Then:
1. Put the domain in `customDomain` in `config.json` and run `node site/build.js`.
2. At your domain registrar, point the domain to GitHub Pages ([instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)).
3. In Settings → Pages, enter the domain and tick **Enforce HTTPS**.

## How to rank high on Google: the plan

The website is built the way Google likes (fast, works well on phones, bilingual, structured data). Most of the ranking, though, comes from what happens **outside** the site. Be realistic: for very broad searches like "hotels Makkah", Airbnb, Booking.com and the big hotels will stay on top. We target the searches you *can* win:

- `furnished apartments in <your neighborhood> Makkah`
- `شقق مفروشة في <الحي> مكة`
- `family apartment Makkah Umrah`
- `شقق عائلية للعمرة مكة`
- `شقق يومي مكة قريبة من الحرم` (only if you really are close to the Haram)

### Week 1: must do
1. **Google Business Profile** (the most important step for local searches and Google Maps). Create a profile at business.google.com as a "Holiday apartment rental" or "Serviced accommodation" at your building's address. Add the same photos, WhatsApp number and a link to the website. Verify it.
2. **Google Search Console**: add the site at search.google.com/search-console, put the verification code into `googleSiteVerification`, rebuild, then submit `sitemap.xml`.
3. **Bing Webmaster Tools**: import from Search Console with one click.
4. (Optional) **Google Analytics**: put the ID in `googleAnalyticsId` to see visitors and how many click "Book on Airbnb".

### Every month
5. **Reviews on Google**: after each stay, send guests a short WhatsApp message with your Google review link. A steady flow of reviews is the biggest ranking factor on Google Maps.
6. **Links to your site**: add the website link to your Airbnb host profile (where Airbnb allows it), your Instagram, TikTok and Snapchat bios, and WhatsApp Business profile. Get listed in Saudi and Umrah directories, and ask Umrah travel agents and groups you work with to link to you.
7. **Social media**: short videos (a walk-through of the apartment, the route to the Haram) on TikTok, Instagram Reels and YouTube Shorts, each one linking to the website. Umrah travellers search these platforms heavily.
8. **Fresh photos**: update them before Ramadan and the Hajj season.

### Later: more pages to reach more searches
Once the basics are live, I can add:
- More languages: **Urdu, Indonesian, Malay, Turkish, French**. Many Umrah visitors search in these, and there is much less competition in those languages.
- Guide pages such as "How to get from Jeddah airport to our apartment", "Umrah checklist for families" and "Ramadan in Makkah: what to expect". These bring in visitors searching for information before they book.

## Adding photos

1. Use landscape photos about 1600px wide, as JPG or WebP, under ~400 KB each (compress them at squoosh.app if needed).
2. Name them exactly as in `config.json → gallery` (e.g. `living-room.jpg`) and put them in `docs/images/`. The first photo in the list is the big cover photo.
3. Run `node site/build.js`. The build lists anything still missing.

## Reviews format

```json
"rating": { "value": "4.9", "count": "120", "source": "Airbnb" },
"reviews": [
  { "name": "Ahmed", "date": "March 2026", "source": "Airbnb",
    "text": { "en": "Very clean and exactly like the photos.", "ar": "نظيفة جداً ومطابقة للصور." } }
]
```
