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
export const prefix = (lang) => (lang === "en" ? "/en" : "");

export const CITIES = cfg.cities;
export const citiesText = (lang) => (lang === "ar" ? CITIES.map((c) => c.ar).join(" و") : CITIES.map((c) => c.en).join(" & "));
export const toArDigits = (s) => String(s).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]).replace(/\./g, "٫");
export const feeText = (lang) => (lang === "ar" ? `${toArDigits(cfg.feePercent)}٪` : `${cfg.feePercent}%`);

// "Licensed" line — includes the FAL number only once it's configured
export const licenseLine = (lang) =>
  cfg.falLicense
    ? lang === "ar" ? `رخصة فال رقم ${cfg.falLicense}` : `FAL License No. ${cfg.falLicense}`
    : lang === "ar" ? "وسيط عقاري مرخّص من الهيئة العامة للعقار" : "REGA-licensed real estate broker";

export const waLink = (text) => `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(text)}`;
export const telLink = () => `tel:${cfg.phone}`;
export const phoneDisplay = () => cfg.phone.replace(/^\+966(\d{2})(\d{3})(\d{4})$/, "+966 $1 $2 $3");

// ---------------------------------------------------------------------------
// UI strings
// ---------------------------------------------------------------------------
export const I18N = {
  ar: {
    nav: [
      ["/services/", "الخدمات"],
      ...CITIES.map((c) => [`/${c.slug}/`, c.ar]),
      ["/guides/", "أدلة المستثمر"],
      ["/tools/roi-calculator/", "حاسبة العائد"],
      ["/about/", "من أنا"],
    ],
    cta: "استشارة مجانية",
    whatsapp: "واتساب",
    call: "اتصال",
    menu: "القائمة",
    langSwitch: "EN",
    langName: "English",
    home: "الرئيسية",
    rights: "جميع الحقوق محفوظة",
    privacy: "سياسة الخصوصية",
    contact: "تواصل معي",
    waIntro: "السلام عليكم أستاذ عبدالعزيز، وصلت من موقعك وأبغى أستشيرك بخصوص استثمار عقاري.",
    footerTag: "أمثّل المستثمر في شراء العقار — لا البائع. أبحث، أحلّل، أفاوض، وأتابع حتى الإفراغ.",
    footerLinks: "الموقع",
    skip: "تخطَّ إلى المحتوى",
  },
  en: {
    nav: [
      ["/services/", "Services"],
      ...CITIES.map((c) => [`/${c.slug}/`, c.en]),
      ["/tools/roi-calculator/", "ROI Calculator"],
      ["/about/", "About"],
    ],
    cta: "Free consultation",
    whatsapp: "WhatsApp",
    call: "Call",
    menu: "Menu",
    langSwitch: "ع",
    langName: "العربية",
    home: "Home",
    rights: "All rights reserved",
    privacy: "Privacy",
    contact: "Contact",
    waIntro: "Hello Abdulaziz, I found your website and would like to discuss a property investment.",
    footerTag: "I represent the investor — never the seller. I search, analyze, negotiate and follow through to title transfer.",
    footerLinks: "Site",
    skip: "Skip to content",
  },
};

// ---------------------------------------------------------------------------
// Visual primitives
// ---------------------------------------------------------------------------
export const icon = (name) => {
  const s = 'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"';
  const p = {
    whatsapp:
      '<path d="M20.5 3.5A11.8 11.8 0 0 0 1.9 17.7L.3 23.7l6.2-1.6A11.8 11.8 0 0 0 24 12a11.7 11.7 0 0 0-3.5-8.5ZM12 21.6a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.6Zm5.4-7.3c-.3-.2-1.8-.9-2-1s-.5-.1-.7.1l-1 1.2c-.2.2-.4.2-.7.1a8 8 0 0 1-4-3.5c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-1-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.4 3.4 0 0 0-1 2.5 5.9 5.9 0 0 0 1.2 3.1 13.5 13.5 0 0 0 5.2 4.6c1.9.8 2.7.9 3.6.7a3.1 3.1 0 0 0 2-1.4 2.5 2.5 0 0 0 .2-1.4c-.1-.2-.3-.3-.6-.4Z" fill="currentColor"/>',
    phone: `<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" ${s}/>`,
    check: `<path d="m5 12.5 4.5 4.5L19 7.5" ${s} stroke-width="2.2"/>`,
    x: `<path d="M7 7l10 10M17 7 7 17" ${s} stroke-width="2"/>`,
    arrow: `<path d="M5 12h14m-6-6 6 6-6 6" ${s} stroke-width="1.9"/>`,
    shield: `<path d="M12 2.8 4.5 5.6v5.9c0 4.7 3.2 8.4 7.5 9.7 4.3-1.3 7.5-5 7.5-9.7V5.6L12 2.8Z" ${s}/><path d="m8.8 12 2.3 2.3 4.2-4.6" ${s}/>`,
    chart: `<path d="M4 20V11m5.5 9V5m5.5 15v-7M20 20v-11M2.5 20.5h19" ${s}/>`,
    search: `<circle cx="11" cy="11" r="6.5" ${s}/><path d="m16 16 4.5 4.5" ${s}/>`,
    handshake: `<path d="M3 11.5 7.5 7l4 2 3-2 6.5 5M7 15l2.5 2.5c.6.6 1.5.6 2 0L20 9M3 11.5l4 4" ${s}/>`,
    key: `<circle cx="8" cy="15" r="4" ${s}/><path d="m11 12 9-9m-3 3 3 3m-6 0 2 2" ${s}/>`,
    doc: `<path d="M6 2.5h8l4 4v15H6v-19ZM14 2.5v4h4M9 12h6M9 16h6" ${s}/>`,
    building: `<path d="M4 21V5l8-2.5V21m0-12h8v12M2 21h20M7 8h2m-2 4h2m-2 4h2m6-4h2m-2 4h2" ${s}/>`,
    land: `<path d="M3 18 8.5 8 12 14l2.5-4L21 18H3Z" ${s}/><circle cx="16.5" cy="5.5" r="1.8" ${s}/>`,
    calc: `<rect x="5" y="2.5" width="14" height="19" rx="2" ${s}/><path d="M8.5 6.5h7M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5h.01M8.5 18h.01M12 18h.01M15.5 18h.01" ${s} stroke-width="2.4"/>`,
    clock: `<circle cx="12" cy="12" r="9" ${s}/><path d="M12 7v5l3 2" ${s}/>`,
    pin: `<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" ${s}/><circle cx="12" cy="9.5" r="2.5" ${s}/>`,
    spark: `<path d="M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" ${s}/>`,
  }[name];
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" width="24" height="24">${p}</svg>`;
};

// Logo: an arch doorway (Najdi/Hijazi architecture) inside a square
export const mark = (size = 40) =>
  `<svg class="mark" viewBox="0 0 40 40" width="${size}" height="${size}" aria-hidden="true"><rect width="40" height="40" rx="9" fill="#0f1c18"/><rect x="3.5" y="3.5" width="33" height="33" rx="6.5" fill="none" stroke="#b8904a" stroke-opacity=".45"/><path d="M12 31V19.5Q12 11.5 20 8q8 3.5 8 11.5V31" fill="none" stroke="#d9bc82" stroke-width="2.4" stroke-linejoin="round"/><path d="M16.5 31v-8.5q0-3 3.5-4.5 3.5 1.5 3.5 4.5V31M9 31h22" fill="none" stroke="#fffdf8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// Line-art skylines for the two cities
export const skyline = (slug) => {
  const a = 'fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"';
  if (slug === "riyadh")
    return `<svg class="skyline" viewBox="0 0 400 130" aria-hidden="true" preserveAspectRatio="xMidYMax meet"><g ${a}>
<path d="M0 126h400"/>
<path d="M14 126V92h22v34M44 126V78h18v48M70 126V98h16v28"/>
<path d="M96 126 118 12l22 114"/><circle cx="118" cy="60" r="7.5"/><path d="M118 12V2"/>
<path d="M150 126V86h20v40M178 126V70h14v56M198 126V94h18v32"/>
<path d="M226 126 234 44l3-38q13 30 26 0l3 38 8 82"/><path d="M240 18h20"/><path d="M231 70h38M229 96h42" stroke-opacity=".4"/>
<path d="M286 126V82h20v44M314 126V64h16v62M338 126V90h22v36M368 126V76h18v50"/>
</g></svg>`;
  return `<svg class="skyline" viewBox="0 0 400 130" aria-hidden="true" preserveAspectRatio="xMidYMax meet"><g ${a}>
<path d="M0 120q10-5 20 0t20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0" stroke-opacity=".6"/>
<path d="M0 127q10-4 20 0t20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0" stroke-opacity=".3"/>
<path d="M52 116q-3-50 2-100 5 50 2 100"/><path d="M54 18q-9 8-12 20M54 18q9 8 12 20" stroke-opacity=".5"/>
<path d="M104 114V84h24v30M110 90h4v8h-4zM118 90h4v8h-4zM110 102h12" />
<path d="M138 114V70h18v44M164 114V92h20v22M192 114V60h16v54"/>
<path d="M226 114 244 22l4-20 4 20 18 92"/><path d="M248 2v112M236 60h24M231 88h34" stroke-opacity=".4"/>
<path d="M284 114V76h18v38M310 114V88h24v26M316 94h4v8h-4zM324 94h4v8h-4zM344 114V68h16v46M368 114V90h22v24"/>
</g></svg>`;
};

export const btn = (href, label, cls = "btn-primary", attrs = "") =>
  `<a class="btn ${cls}" href="${esc(href)}" ${attrs}>${label}</a>`;

export const waBtn = (lang, text, label, cls = "btn-wa") =>
  btn(waLink(text || I18N[lang].waIntro), `${icon("whatsapp")}<span>${label || I18N[lang].whatsapp}</span>`, cls, 'target="_blank" rel="noopener" data-track="whatsapp"');

export const arrowLink = (href, label, cls = "") => `<a class="arrow-link ${cls}" href="${esc(href)}"><span>${label}</span>${icon("arrow")}</a>`;

export const faqBlock = (items) =>
  `<div class="faq">${items
    .map((f) => `<details><summary><h3>${f.q}</h3><span class="faq-i" aria-hidden="true"></span></summary><div class="faq-a">${f.a}</div></details>`)
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

export const kicker = (text, light = false) => `<p class="kicker${light ? " kicker-light" : ""}">${text}</p>`;

export const ctaBand = (lang, title, text) => `
<section class="cta-final">
  <div class="wrap cta-inner" data-reveal>
    <div>
      ${kicker(lang === "ar" ? "الخطوة الأولى مجانية" : "The first step is free", true)}
      <h2>${title || (lang === "ar" ? "عندك ميزانية وهدف؟<br>خلّنا نحوّلها لصفقة مدروسة." : "Have a budget and a goal?<br>Let's turn it into a well-analyzed deal.")}</h2>
      <p>${text || (lang === "ar" ? "مكالمة ٢٠ دقيقة نحدد فيها استراتيجيتك، المدينة والأحياء المناسبة، والعائد الواقعي المتوقع — بدون أي التزام." : "A 20-minute call to define your strategy, the right city and districts, and a realistic return — no obligation.")}</p>
    </div>
    <div class="cta-actions">
      ${waBtn(lang, null, lang === "ar" ? "تواصل عبر واتساب" : "Chat on WhatsApp", "btn-wa btn-lg")}
      <a class="cta-phone" href="${telLink()}" data-track="call">${icon("phone")}<span dir="ltr">${phoneDisplay()}</span></a>
    </div>
  </div>
</section>`;

// ---------------------------------------------------------------------------
// Structured data
// ---------------------------------------------------------------------------
export const agentId = abs("/#agent");

export function agentSchema(lang = "ar") {
  const sameAs = [cfg.googleBusinessProfileUrl, ...Object.values(cfg.social)].filter(Boolean);
  const base = CITIES[0];
  const s = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": agentId,
    name: T(lang, cfg.brand),
    alternateName: [cfg.brand.ar, cfg.brand.en].filter((x) => x !== T(lang, cfg.brand)),
    description:
      lang === "ar"
        ? `وسيط عقاري مرخّص في ${citiesText("ar")} يمثّل المستثمرين المحليين في شراء العقارات: عمائر، أراضٍ، فلل، ومشاريع على الخارطة — بحث، تحليل عائد، تفاوض، ومتابعة حتى الإفراغ.`
        : `Licensed buyer's agent in ${citiesText("en")} representing local investors: income buildings, land, villas and off-plan — sourcing, yield analysis, negotiation and closing.`,
    url: abs("/"),
    logo: abs("/assets/icon-512.png"),
    image: abs("/assets/og.png"),
    telephone: cfg.phone,
    ...(cfg.email ? { email: cfg.email } : {}),
    priceRange: "$$",
    areaServed: CITIES.map((c) => ({ "@type": "City", name: T(lang, c) })),
    address: { "@type": "PostalAddress", addressLocality: T(lang, base), addressRegion: T(lang, base.region), addressCountry: "SA" },
    geo: { "@type": "GeoCoordinates", latitude: base.geo.lat, longitude: base.geo.lng },
    openingHours: cfg.hours,
    knowsLanguage: ["ar", "en"],
    founder: { "@type": "Person", name: T(lang, cfg.name), jobTitle: T(lang, cfg.role) },
    ...(cfg.falLicense
      ? {
          hasCredential: {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "license",
            name: lang === "ar" ? `رخصة فال للوساطة العقارية رقم ${cfg.falLicense}` : `FAL real estate brokerage license ${cfg.falLicense}`,
            recognizedBy: { "@type": "GovernmentOrganization", name: lang === "ar" ? "الهيئة العامة للعقار" : "Real Estate General Authority (REGA)" },
          },
        }
      : {}),
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

// Inner-page hero with breadcrumbs, used by every page except home
export const pageHero = (lang, { crumbs, kicker: k, title, lead, actions = "", aside = "" }) => `
<section class="page-hero${aside ? " has-aside" : ""}">
  <div class="wrap">
    ${crumbs ? `<nav class="crumbs" aria-label="${lang === "ar" ? "مسار التنقل" : "Breadcrumb"}"><ol>${crumbs
      .map((c, i) => (i === crumbs.length - 1 ? `<li aria-current="page">${esc(c.name)}</li>` : `<li><a href="${url(c.path)}">${esc(c.name)}</a></li>`))
      .join("")}</ol></nav>` : ""}
    <div class="page-hero-grid">
      <div>
        ${k ? kicker(k) : ""}
        <h1>${title}</h1>
        ${lead ? `<p class="lead">${lead}</p>` : ""}
        ${actions ? `<div class="hero-actions">${actions}</div>` : ""}
      </div>
      ${aside}
    </div>
  </div>
</section>`;

// ---------------------------------------------------------------------------
// Page shell
// ---------------------------------------------------------------------------
export function layout(page, alternates, extras) {
  const { lang, path, title, description } = page;
  const t = I18N[lang];
  const p = prefix(lang);
  const dir = lang === "ar" ? "rtl" : "ltr";
  const canonical = abs(path);
  const fullTitle = `${title} | ${T(lang, cfg.brand)}`;
  const base = CITIES[0];

  const altLinks =
    Object.entries(alternates).map(([l, ap]) => `<link rel="alternate" hreflang="${l}" href="${abs(ap)}">`).join("\n") +
    (Object.keys(alternates).length > 1 ? `\n<link rel="alternate" hreflang="x-default" href="${abs(alternates.ar)}">` : "");

  const otherLang = lang === "ar" ? "en" : "ar";
  const switchHref = alternates[otherLang] ? url(alternates[otherLang]) : url(otherLang === "en" ? "/en/" : "/");

  const crumbs = page.crumbs ? [{ name: t.home, path: p + "/" }, ...page.crumbs] : null;
  const schemas = [...(page.schema || []), ...(crumbs ? [breadcrumbSchema(crumbs)] : [])];
  const body = typeof page.body === "function" ? page.body(crumbs) : page.body;

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
    .join("");

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
<meta name="robots" content="${page.noindex ? "noindex, follow" : "index, follow, max-image-preview:large"}">
<meta name="theme-color" content="#0f1c18">
<meta name="author" content="${esc(T(lang, cfg.name))}">
<meta name="geo.region" content="${page.city ? page.city.regionCode : base.regionCode}">
<meta name="geo.placename" content="${esc(T(lang, page.city || base))}">
<meta property="og:type" content="${page.ogType || "website"}">
<meta property="og:site_name" content="${esc(T(lang, cfg.brand))}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${abs("/assets/og.png")}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${lang === "ar" ? "ar_SA" : "en_US"}">
<meta name="twitter:card" content="summary_large_image">
${cfg.googleSiteVerification ? `<meta name="google-site-verification" content="${esc(cfg.googleSiteVerification)}">` : ""}
${cfg.bingSiteVerification ? `<meta name="msvalidate.01" content="${esc(cfg.bingSiteVerification)}">` : ""}
<link rel="icon" href="${url("/assets/favicon.svg")}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${url("/assets/icon-180.png")}">
<link rel="manifest" href="${url("/site.webmanifest")}">
<link rel="preload" href="${url("/assets/fonts/IBMPlexSansArabic-arabic-400.woff2")}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${url("/assets/fonts/NotoKufiArabic-arabic-600.woff2")}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${url("/assets/styles.css")}?v=${extras.version}">
<script>document.documentElement.classList.add("js")</script>
${schemas.map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join("\n")}
${analytics}
</head>
<body class="${page.bodyClass || ""}">
<a class="skip" href="#main">${t.skip}</a>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="logo" href="${url(p + "/")}">${mark(38)}<span><strong>${esc(T(lang, cfg.name))}</strong><small>${esc(T(lang, cfg.role))}</small></span></a>
    <nav id="site-nav" class="site-nav" aria-label="${t.menu}">
      <ul>${nav}</ul>
      <div class="nav-extra">
        <a class="lang" href="${switchHref}" hreflang="${otherLang}" lang="${otherLang}" title="${t.langName}">${t.langName}</a>
        ${btn(url(p + "/contact/"), t.cta, "btn-brass btn-sm")}
      </div>
    </nav>
    <button class="menu-toggle" aria-expanded="false" aria-controls="site-nav"><span></span><span></span><span class="sr">${t.menu}</span></button>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-top">
      <div class="footer-brand">
        <a class="logo" href="${url(p + "/")}">${mark(46)}<span><strong>${esc(T(lang, cfg.name))}</strong><small>${esc(T(lang, cfg.role))}</small></span></a>
        <p>${t.footerTag}</p>
        <p class="license">${icon("shield")} ${licenseLine(lang)}${cfg.crNumber ? ` · ${lang === "ar" ? "سجل تجاري" : "CR"} ${esc(cfg.crNumber)}` : ""}</p>
      </div>
      <div class="footer-cols">
        <div>
          <h2>${t.footerLinks}</h2>
          <ul>${t.nav.map(([h, l]) => `<li><a href="${url(p + h)}">${l}</a></li>`).join("")}<li><a href="${url(p + "/how-it-works/")}">${lang === "ar" ? "آلية العمل والأتعاب" : "Process & fees"}</a></li><li><a href="${url(p + "/faq/")}">${lang === "ar" ? "الأسئلة الشائعة" : "FAQ"}</a></li></ul>
        </div>
        ${extras.districts
          .map(
            (c) => `<div><h2>${esc(c.name)}</h2><ul>${c.items.map((d) => `<li><a href="${url(d.path)}">${esc(d.name)}</a></li>`).join("")}</ul></div>`
          )
          .join("")}
        <div>
          <h2>${t.contact}</h2>
          <ul>
            <li><a href="${telLink()}" dir="ltr">${phoneDisplay()}</a></li>
            <li><a href="${waLink(t.waIntro)}" target="_blank" rel="noopener" data-track="whatsapp">${t.whatsapp}</a></li>
            ${cfg.email ? `<li><a href="mailto:${esc(cfg.email)}">${esc(cfg.email)}</a></li>` : ""}
            <li>${citiesText(lang)}</li>
          </ul>
          ${social ? `<p class="social">${social}</p>` : ""}
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${new Date().getFullYear()} ${esc(T(lang, cfg.brand))} — ${t.rights}</span>
      <a href="${url(p + "/privacy/")}">${t.privacy}</a>
    </div>
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
