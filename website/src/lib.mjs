import cfg from "../config.mjs";

export { cfg };

// ---------------------------------------------------------------------------
// URL helpers. `siteUrl` may include a sub-path (GitHub Pages project sites),
// so every internal link goes through url() to get the right prefix.
// ---------------------------------------------------------------------------
const siteUrl = cfg.customDomain ? `https://${cfg.customDomain}` : cfg.siteUrl.replace(/\/$/, "");
export const SITE = siteUrl;
export const BASE = new URL(siteUrl + "/").pathname.replace(/\/$/, "");
export const url = (p = "/") => BASE + p;
export const abs = (p = "/") => siteUrl + p;

export const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const T = (lang, obj) => (obj && typeof obj === "object" ? obj[lang] ?? obj.ar : obj ?? "");

export const waLink = (text) => `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(text)}`;
export const telLink = () => `tel:${cfg.phone}`;

export const prefix = (lang) => (lang === "en" ? "/en" : "");

// ---------------------------------------------------------------------------
// UI strings
// ---------------------------------------------------------------------------
export const I18N = {
  ar: {
    nav: [
      ["/services/", "الخدمات"],
      ["/how-it-works/", "آلية العمل"],
      ["/areas/", "الأحياء"],
      ["/guides/", "أدلة المستثمر"],
      ["/tools/roi-calculator/", "حاسبة العائد"],
      ["/about/", "من أنا"],
    ],
    cta: "احجز استشارة مجانية",
    whatsapp: "واتساب",
    call: "اتصال",
    menu: "القائمة",
    langSwitch: "English",
    home: "الرئيسية",
    fal: "رخصة فال رقم",
    cr: "سجل تجاري",
    rights: "جميع الحقوق محفوظة",
    privacy: "سياسة الخصوصية",
    contact: "تواصل معي",
    waIntro: "السلام عليكم، وصلت من موقعك وأبغى أستشيرك بخصوص استثمار عقاري.",
    footerAbout:
      "أمثّل المستثمر في شراء العقار — لا البائع. أبحث، أحلّل، أفاوض، وأتابع حتى الإفراغ، لتشتري بسعر صحيح وعائد مدروس.",
    footerLinks: "روابط",
    footerAreas: "الأحياء",
    footerGuides: "أدلة",
    skip: "تخطَّ إلى المحتوى",
    updated: "آخر تحديث",
    readTime: "دقائق قراءة",
  },
  en: {
    nav: [
      ["/services/", "Services"],
      ["/how-it-works/", "How it works"],
      ["/areas/", "Areas"],
      ["/tools/roi-calculator/", "ROI Calculator"],
      ["/about/", "About"],
    ],
    cta: "Book a free consultation",
    whatsapp: "WhatsApp",
    call: "Call",
    menu: "Menu",
    langSwitch: "العربية",
    home: "Home",
    fal: "FAL License No.",
    cr: "CR No.",
    rights: "All rights reserved",
    privacy: "Privacy policy",
    contact: "Contact",
    waIntro: "Hello, I found your website and would like to discuss a property investment.",
    footerAbout:
      "I represent the investor — never the seller. I search, analyze, negotiate and follow through to title transfer so you buy at the right price with a return you understand.",
    footerLinks: "Links",
    footerAreas: "Areas",
    footerGuides: "Guides",
    skip: "Skip to content",
    updated: "Last updated",
    readTime: "min read",
  },
};

// ---------------------------------------------------------------------------
// Reusable components
// ---------------------------------------------------------------------------
export const icon = (name) => {
  const p = {
    whatsapp:
      '<path d="M20.5 3.5A11.8 11.8 0 0 0 1.9 17.7L.3 23.7l6.2-1.6A11.8 11.8 0 0 0 24 12a11.7 11.7 0 0 0-3.5-8.5ZM12 21.6a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.6Zm5.4-7.3c-.3-.2-1.8-.9-2-1s-.5-.1-.7.1l-1 1.2c-.2.2-.4.2-.7.1a8 8 0 0 1-4-3.5c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-1-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.4 3.4 0 0 0-1 2.5 5.9 5.9 0 0 0 1.2 3.1 13.5 13.5 0 0 0 5.2 4.6c1.9.8 2.7.9 3.6.7a3.1 3.1 0 0 0 2-1.4 2.5 2.5 0 0 0 .2-1.4c-.1-.2-.3-.3-.6-.4Z" fill="currentColor"/>',
    phone:
      '<path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.3 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.3.2 2.5.6 3.6a1 1 0 0 1-.3 1l-2.2 2.2Z" fill="currentColor"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
    x: '<path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    shield: '<path d="M12 2.5 4 5.5v6c0 5 3.4 8.9 8 10 4.6-1.1 8-5 8-10v-6l-8-3Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="m8.5 12 2.5 2.5 4.5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    chart: '<path d="M4 20V10m6 10V4m6 16v-7m4 7H2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    search: '<circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 4.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    handshake: '<path d="M3 11.5 7.5 7l4 2 3-2 6.5 5M7 15l2.5 2.5c.6.6 1.5.6 2 0L20 9M3 11.5l4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    key: '<circle cx="8" cy="15" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m11 12 9-9m-3 3 3 3m-6 0 2 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    map: '<path d="M9 4 3 6.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5L9 4Zm0 0v13.5m6-11v13.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
    doc: '<path d="M6 2.5h8l4 4v15H6v-19Z M14 2.5v4h4M9 12h6M9 16h6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
    building: '<path d="M4 21V5l8-2.5V21m0-12h8v12M2 21h20M7 8h2m-2 4h2m-2 4h2m6-4h2m-2 4h2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    land: '<path d="M3 18 8.5 8 12 14l2.5-4L21 18H3Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="16.5" cy="5.5" r="1.8" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    calc: '<rect x="5" y="2.5" width="14" height="19" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 6.5h7M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5h.01M8.5 18h.01M12 18h.01M15.5 18h.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
    clock: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  }[name];
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" width="24" height="24">${p}</svg>`;
};

export const btn = (href, label, cls = "btn-primary", attrs = "") =>
  `<a class="btn ${cls}" href="${esc(href)}" ${attrs}>${label}</a>`;

export const waBtn = (lang, text, label, cls = "btn-wa") =>
  btn(waLink(text || I18N[lang].waIntro), `${icon("whatsapp")}<span>${label || I18N[lang].whatsapp}</span>`, cls, 'target="_blank" rel="noopener" data-track="whatsapp"');

export const faqBlock = (items) =>
  `<div class="faq">${items
    .map((f) => `<details><summary><h3>${f.q}</h3></summary><div class="faq-a">${f.a}</div></details>`)
    .join("")}</div>`;

export const faqSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({
    "@type": "Question",
    name: f.q.replace(/<[^>]+>/g, ""),
    acceptedAnswer: { "@type": "Answer", text: f.a.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() },
  })),
});

export const ctaBand = (lang, title, text) => `
<section class="cta-band">
  <div class="wrap cta-inner">
    <div>
      <h2>${title || (lang === "ar" ? "عندك ميزانية وهدف؟ خلّنا نحوّلها لصفقة مدروسة." : "Have a budget and a goal? Let's turn it into a well-analyzed deal.")}</h2>
      <p>${text || (lang === "ar" ? "مكالمة ٢٠ دقيقة مجانية — نحدد فيها استراتيجيتك، ونطاق الأحياء، والعائد الواقعي المتوقع. بدون أي التزام." : "A free 20-minute call to define your strategy, target areas and a realistic expected return. No obligation.")}</p>
    </div>
    <div class="cta-actions">
      ${waBtn(lang, null, lang === "ar" ? "تواصل عبر واتساب" : "Chat on WhatsApp")}
      ${btn(url(prefix(lang) + "/contact/"), lang === "ar" ? "أرسل طلبك الاستثماري" : "Send your investment brief", "btn-ghost-light")}
    </div>
  </div>
</section>`;

export const monogram = () =>
  `<svg class="logo-mark" viewBox="0 0 40 40" aria-hidden="true" width="36" height="36"><rect width="40" height="40" rx="10" fill="var(--brand)"/><path d="M9 29V17.5L20 9l11 8.5V29" fill="none" stroke="var(--gold)" stroke-width="2.6" stroke-linejoin="round"/><path d="M15 29v-7h10v7" fill="none" stroke="#fff" stroke-width="2.6" stroke-linejoin="round"/></svg>`;

// ---------------------------------------------------------------------------
// Structured data: the business entity (used on every page via @id)
// ---------------------------------------------------------------------------
export const agentId = abs("/#agent");

export function agentSchema(lang = "ar") {
  const sameAs = [cfg.googleBusinessProfileUrl, ...Object.values(cfg.social)].filter(Boolean);
  const s = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": agentId,
    name: T(lang, cfg.brand),
    alternateName: [cfg.brand.ar, cfg.brand.en, cfg.name.ar, cfg.name.en].filter((x) => x && x !== T(lang, cfg.brand)),
    description:
      lang === "ar"
        ? `وسيط عقاري مرخّص في ${cfg.city.ar} يمثّل المستثمرين المحليين في شراء العقارات: فلل، أراضٍ، عمائر، ومشاريع على الخارطة — بحث، تحليل عائد، تفاوض، ومتابعة حتى الإفراغ.`
        : `Licensed buyer's agent in ${cfg.city.en} representing local investors: villas, land, income buildings and off-plan — sourcing, yield analysis, negotiation and closing.`,
    url: abs("/"),
    logo: abs("/assets/icon-512.png"),
    image: abs("/assets/og.png"),
    telephone: cfg.phone,
    email: cfg.email,
    priceRange: "$$",
    areaServed: { "@type": "City", name: T(lang, cfg.city) },
    address: {
      "@type": "PostalAddress",
      addressLocality: T(lang, cfg.city),
      addressRegion: T(lang, cfg.region),
      addressCountry: "SA",
      ...(cfg.address.street ? { streetAddress: cfg.address.street } : {}),
      ...(cfg.address.postalCode ? { postalCode: cfg.address.postalCode } : {}),
    },
    geo: { "@type": "GeoCoordinates", latitude: cfg.geo.lat, longitude: cfg.geo.lng },
    openingHours: cfg.hours,
    knowsLanguage: ["ar", "en"],
    founder: { "@type": "Person", name: T(lang, cfg.name), jobTitle: T(lang, cfg.role) },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "license",
      name: lang === "ar" ? `رخصة فال للوساطة العقارية رقم ${cfg.falLicense}` : `FAL real estate brokerage license ${cfg.falLicense}`,
      recognizedBy: { "@type": "GovernmentOrganization", name: lang === "ar" ? "الهيئة العامة للعقار" : "Real Estate General Authority (REGA)" },
    },
    ...(sameAs.length ? { sameAs } : {}),
  };
  if (cfg.testimonials.length) {
    s.review = cfg.testimonials.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      reviewBody: T(lang, r.quote),
      reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5 },
    }));
  }
  return s;
}

export function breadcrumbSchema(crumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: abs(c.path) })),
  };
}

export const breadcrumbs = (lang, crumbs) =>
  `<nav class="crumbs" aria-label="${lang === "ar" ? "مسار التنقل" : "Breadcrumb"}"><ol>${crumbs
    .map((c, i) =>
      i === crumbs.length - 1 ? `<li aria-current="page">${esc(c.name)}</li>` : `<li><a href="${url(c.path)}">${esc(c.name)}</a></li>`
    )
    .join("")}</ol></nav>`;

// ---------------------------------------------------------------------------
// Page shell
// ---------------------------------------------------------------------------
export function layout(page, alternates, extras) {
  const { lang, path, title, description } = page;
  const t = I18N[lang];
  const p = prefix(lang);
  const dir = lang === "ar" ? "rtl" : "ltr";
  const canonical = abs(path);
  const ogImage = abs("/assets/og.png");
  const fullTitle = page.rawTitle ? title : `${title} | ${T(lang, cfg.brand)}`;

  const altLinks = Object.entries(alternates)
    .map(([l, ap]) => `<link rel="alternate" hreflang="${l}" href="${abs(ap)}">`)
    .join("\n") + (alternates.ar ? `\n<link rel="alternate" hreflang="x-default" href="${abs(alternates.ar)}">` : "");

  const otherLang = lang === "ar" ? "en" : "ar";
  const switchHref = alternates[otherLang] ? url(alternates[otherLang]) : url(otherLang === "en" ? "/en/" : "/");

  const crumbs = page.crumbs ? [{ name: t.home, path: p + "/" }, ...page.crumbs] : null;
  const schemas = [
    ...(page.schema || []),
    ...(crumbs ? [breadcrumbSchema(crumbs)] : []),
  ];

  const nav = t.nav
    .map(([href, label]) => {
      const full = p + href;
      const active = path.startsWith(full) ? ' aria-current="page"' : "";
      return `<li><a href="${url(full)}"${active}>${label}</a></li>`;
    })
    .join("");

  const social = Object.entries(cfg.social)
    .filter(([, v]) => v)
    .map(([k, v]) => `<a href="${esc(v)}" rel="me noopener" target="_blank">${k === "x" ? "X" : k[0].toUpperCase() + k.slice(1)}</a>`)
    .join(" · ");

  const analytics = cfg.ga4Id
    ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${cfg.ga4Id}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${cfg.ga4Id}');</script>`
    : "";

  return `<!doctype html>
<html lang="${lang === "ar" ? "ar-SA" : "en"}" dir="${dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
${altLinks}
${page.noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
<meta name="theme-color" content="#0d3b2e">
<meta name="author" content="${esc(T(lang, cfg.name))}">
<meta name="geo.region" content="SA-01">
<meta name="geo.placename" content="${esc(T(lang, cfg.city))}">
<meta name="geo.position" content="${cfg.geo.lat};${cfg.geo.lng}">
<meta property="og:type" content="${page.ogType || "website"}">
<meta property="og:site_name" content="${esc(T(lang, cfg.brand))}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${lang === "ar" ? "ar_SA" : "en_US"}">
<meta name="twitter:card" content="summary_large_image">
${cfg.googleSiteVerification ? `<meta name="google-site-verification" content="${esc(cfg.googleSiteVerification)}">` : ""}
${cfg.bingSiteVerification ? `<meta name="msvalidate.01" content="${esc(cfg.bingSiteVerification)}">` : ""}
<link rel="icon" href="${url("/assets/favicon.svg")}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${url("/assets/icon-180.png")}">
<link rel="manifest" href="${url("/site.webmanifest")}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="${url("/assets/styles.css")}?v=${extras.version}">
${schemas.map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join("\n")}
${analytics}
</head>
<body>
<a class="skip" href="#main">${t.skip}</a>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="logo" href="${url(p + "/")}" aria-label="${esc(T(lang, cfg.brand))}">${monogram()}<span><strong>${esc(T(lang, cfg.brand))}</strong><small>${t.fal} ${esc(cfg.falLicense)}</small></span></a>
    <button class="menu-toggle" aria-expanded="false" aria-controls="site-nav"><span></span><span></span><span></span><span class="sr">${t.menu}</span></button>
    <nav id="site-nav" class="site-nav" aria-label="${t.menu}">
      <ul>${nav}</ul>
      <a class="lang" href="${switchHref}" hreflang="${otherLang}" lang="${otherLang}">${t.langSwitch}</a>
      ${btn(url(p + "/contact/"), t.cta, "btn-primary btn-sm")}
    </nav>
  </div>
</header>
<main id="main">
${crumbs ? `<div class="wrap">${breadcrumbs(lang, crumbs)}</div>` : ""}
${page.body}
</main>
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div>
      <a class="logo logo-light" href="${url(p + "/")}">${monogram()}<span><strong>${esc(T(lang, cfg.brand))}</strong></span></a>
      <p>${t.footerAbout}</p>
      <p class="license">${icon("shield")} ${t.fal} <strong>${esc(cfg.falLicense)}</strong>${cfg.crNumber ? ` · ${t.cr} ${esc(cfg.crNumber)}` : ""}</p>
    </div>
    <div>
      <h2>${t.footerLinks}</h2>
      <ul>${t.nav.map(([h, l]) => `<li><a href="${url(p + h)}">${l}</a></li>`).join("")}<li><a href="${url(p + "/faq/")}">${lang === "ar" ? "الأسئلة الشائعة" : "FAQ"}</a></li><li><a href="${url(p + "/contact/")}">${t.contact}</a></li></ul>
    </div>
    <div>
      <h2>${t.footerAreas}</h2>
      <ul>${extras.areas.map((a) => `<li><a href="${url(a.path)}">${esc(a.name)}</a></li>`).join("")}</ul>
    </div>
    <div>
      <h2>${t.contact}</h2>
      <ul class="contact-list">
        <li><a href="${telLink()}" dir="ltr">${esc(cfg.phone)}</a></li>
        <li><a href="${waLink(t.waIntro)}" target="_blank" rel="noopener" data-track="whatsapp">${t.whatsapp}</a></li>
        <li><a href="mailto:${esc(cfg.email)}">${esc(cfg.email)}</a></li>
        <li>${esc(T(lang, cfg.city))}، ${lang === "ar" ? "المملكة العربية السعودية" : "Saudi Arabia"}</li>
      </ul>
      ${social ? `<p class="social">${social}</p>` : ""}
    </div>
  </div>
  <div class="wrap footer-bottom">
    <span>© ${new Date().getFullYear()} ${esc(T(lang, cfg.brand))} — ${t.rights}</span>
    <a href="${url(p + "/privacy/")}">${t.privacy}</a>
  </div>
</footer>
<div class="mobile-bar">
  <a href="${telLink()}" class="mb-call" data-track="call">${icon("phone")}<span>${t.call}</span></a>
  <a href="${waLink(t.waIntro)}" class="mb-wa" target="_blank" rel="noopener" data-track="whatsapp">${icon("whatsapp")}<span>${t.whatsapp}</span></a>
</div>
<script src="${url("/assets/main.js")}?v=${extras.version}" defer></script>
</body>
</html>`;
}
