# Realtor website — how it works

A fast, bilingual (Arabic-first + English) static website for a licensed buyer's agent who serves property investors in Saudi Arabia. There's no framework and no dependencies. Hosting is free on GitHub Pages.

**Read [`GROWTH-PLAYBOOK.md`](GROWTH-PLAYBOOK.md) next.** The website is only 30% of showing up on Google. The playbook covers the other 70%.

## 1. Put in your details (10 minutes)

Open **`config.mjs`** and replace every line marked `TODO`:

| Field | Why it matters |
|---|---|
| `name`, `brand` | Shown everywhere and used in Google's business data |
| `falLicense` | **Required by REGA** on brokerage advertising, and your #1 trust signal. Until it's set, the site says "licensed" without a number |
| `feePercent` | Your fee (2.5%). Shown on the home page, city pages, process page and FAQ |
| `phone`, `whatsapp`, `email` | Every button goes to these. Email stays hidden while empty |
| `cities` | Riyadh and Jeddah. Each city gets a hub page (`/riyadh/`, `/jeddah/`) plus district pages from `src/pages/cities-data.mjs` |
| `bio`, `photo` | Optional. Without a photo, the About page uses a typographic "ID card" design |
| `stats`, `testimonials` | **Only real ones.** They stay hidden until you add them |
| `googleSiteVerification` | From Google Search Console (see playbook) |

After changing your name or brand, regenerate the social-share image and icons:

```bash
cd website
node tools/render-images.mjs   # needs Playwright/Chromium installed
```

## 2. Build & preview

```bash
cd website
node build.mjs            # outputs to website/dist, fails on any broken internal link
npx serve dist            # preview locally
```

## 3. Deploy (free)

1. Merge this branch into `main`.
2. On GitHub, open **Settings → Pages → Source** and choose **GitHub Actions**.
3. Every push to `main` then rebuilds and deploys automatically (`.github/workflows/deploy-website.yml`).

The site goes live at `https://abdulazizma.github.io/AbdulazizMA/`.

### Use your own domain (strongly recommended)

A domain like `abdulaziz-realestate.sa` or `.com` costs about 50–150 SAR a year and is worth it for trust and branding.

1. Buy the domain. Use a SaudiNIC-accredited registrar for `.sa`, or any registrar for `.com`.
2. In `config.mjs`, set `customDomain: "yourdomain.sa"`.
3. At your registrar, add the DNS records GitHub shows under **Settings → Pages → Custom domain**, then tick **Enforce HTTPS**.

## 4. Add content (this is how you climb Google)

- **New article:** add an object to `GUIDES` in `src/pages/guides.mjs`. It gets its own page, schema, sitemap entry and "read also" links automatically.
- **New district:** add an object to the `RIYADH` or `JEDDAH` array in `src/pages/cities-data.mjs`.
- **Rules:** one question per article, answered better than anyone else, with your real field experience. Never copy text from other sites.

## Structure

```
website/
  config.mjs              ← your details (edit this)
  build.mjs               ← generator: pages, sitemap.xml, robots.txt, link check
  src/lib.mjs             ← layout, SEO head, schema.org, components
  src/pages/              ← page content (Arabic + English)
  src/assets/             ← CSS, JS (calculator, hero widget, lead form), fonts, icons, og.png
  tools/                  ← image renderer + browser QA script
```

## What's built in for SEO

- Arabic-first pages (`lang="ar-SA"`, RTL) with English translations linked through `hreflang`, plus a sitemap with alternates
- schema.org data: `RealEstateAgent` (with FAL credential), `FAQPage`, `Article`, `BreadcrumbList`, `Service`, `WebApplication`
- A canonical URL, Open Graph and Twitter card on every page, plus local geo meta tags
- No JavaScript framework and a single small CSS file. Fonts are self-hosted (IBM Plex Sans Arabic for body text, Noto Kufi Arabic for headings), so there are no third-party requests. It scores near-perfect on Core Web Vitals
- Mobile sticky call and WhatsApp bar, since most Saudi leads arrive by WhatsApp
- Lead form that sends a structured "investment brief" straight to your WhatsApp. An email copy is optional through the free Formspree service: put its endpoint in `formEndpoint`
- GA4 click tracking for `generate_lead` events when `ga4Id` is set
