#!/usr/bin/env node
// Builds the website into ../docs from config.json. Run: node site/build.js
// No dependencies — just Node.js.
'use strict';

const fs = require('fs');
const path = require('path');

const SRC = __dirname;
const OUT = process.env.SITE_OUT || path.join(SRC, '..', 'docs');
const cfg = JSON.parse(fs.readFileSync(process.env.SITE_CONFIG || path.join(SRC, 'config.json'), 'utf8'));

// ---------- helpers ----------
const isTodo = (s) => typeof s === 'string' && s.includes('TODO');
const val = (x, lang) => {
  const s = x && typeof x === 'object' ? x[lang] : x;
  if (s === undefined || s === null) return '';
  return isTodo(String(s)) ? '' : String(s).trim();
};
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function findTodos(obj, trail = '') {
  const out = [];
  if (typeof obj === 'string') { if (isTodo(obj)) out.push(trail); }
  else if (Array.isArray(obj)) obj.forEach((o, i) => out.push(...findTodos(o, `${trail}[${i}]`)));
  else if (obj && typeof obj === 'object')
    for (const [k, o] of Object.entries(obj)) if (!k.startsWith('_')) out.push(...findTodos(o, trail ? `${trail}.${k}` : k));
  return out;
}

const siteUrl = (cfg.customDomain ? `https://${cfg.customDomain}` : cfg.siteUrl).replace(/\/+$/, '');
const pageUrl = (lang) => `${siteUrl}/${lang === 'ar' ? 'ar/' : ''}`;
const imgExists = (file) => fs.existsSync(path.join(OUT, 'images', file));
const photos = cfg.gallery.map((g) => ({ ...g, exists: imgExists(g.file) }));
const cover = photos.find((p) => p.exists);
const apt = cfg.apartment;
const units = cfg.units.map((u) => ({ ...u, airbnb: val(u.airbnb), booking: val(u.booking) }));
const firstAirbnb = (units.find((u) => u.airbnb) || {}).airbnb || '';
const wa = val(cfg.contact.whatsapp).replace(/\D/g, '');
const lat = parseFloat(val(cfg.location.lat));
const lng = parseFloat(val(cfg.location.lng));
const hasGeo = Number.isFinite(lat) && Number.isFinite(lng);
const year = new Date().getFullYear();

// ---------- icons (24px stroke icons) ----------
const ICONS = {
  wifi: 'M5 12.55a11 11 0 0 1 14 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01',
  ac: 'M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93 4.93 19.07',
  kitchen: 'M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7',
  washer: 'M4 2h16v20H4zM16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 5h.01M11 5h.01',
  tv: 'M2 7h20v13H2zM17 2l-5 5-5-5',
  key: 'M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4',
  bed: 'M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9',
  parking: 'M3 3h18v18H3zM9 17V7h4a3 3 0 0 1 0 6H9',
  elevator: 'M4 2h16v20H4zM9 9l3-3 3 3M9 15l3 3 3-3',
  coffee: 'M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4zM6 2v2M10 2v2M14 2v2',
  prayer: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z',
  clean: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z',
  pin: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  bath: 'M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5M2 12h20M7 19v2M17 19v2',
  size: 'M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7',
  chat: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4',
  copy: 'M8 8h12v12H8zM4 16V4h12',
  calendar: 'M3 4h18v18H3zM16 2v4M8 2v4M3 10h18',
  mail: 'M4 4h16v16H4zM22 6l-10 7L2 6',
  phone: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z',
  image: 'M3 3h18v18H3zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 21',
  arrow: 'M5 12h14M12 5l7 7-7 7',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z',
};
const icon = (name, cls = 'ic') =>
  `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[name] || ICONS.clean}"/></svg>`;

// ---------- copy ----------
const T = {
  en: {
    dir: 'ltr', locale: 'en_US', other: 'ar', otherLabel: 'العربية',
    title: (b) => `Furnished Apartments in Makkah for Umrah & Hajj | ${b}`,
    desc: 'Clean, fully furnished family apartments in Makkah for your Umrah or Hajj stay. Identical units – ideal for families and groups. See all photos and book securely on Airbnb.',
    nav: { gallery: 'Photos', apartment: 'The apartment', location: 'Location', faq: 'FAQ', contact: 'Contact' },
    bookNow: 'Book now',
    menu: 'Menu',
    eyebrow: 'Furnished apartments · Makkah Al-Mukarramah',
    h1: 'Your home in Makkah for Umrah & Hajj',
    heroSub: 'Spotless, fully furnished apartments for families and groups. Every unit has the same design, furniture and layout – so what you see is exactly what you get.',
    ctaAirbnb: 'Check availability on Airbnb',
    ctaPhotos: 'See all photos',
    guests: 'guests', bedrooms: 'bedrooms', bathrooms: 'bathrooms', sqm: 'm²',
    photoSoon: 'Photo coming soon',
    whyTitle: 'Why guests choose us',
    why: [
      ['shield', 'Book with confidence', 'Every booking and payment is handled securely by Airbnb or Booking.com – with their guest protection.'],
      ['copy', 'Identical apartments', 'All our units share the same design, furniture and layout. The photos show exactly what you will get.'],
      ['users', 'Made for families & groups', 'Travelling together? Book several identical apartments in the same building.'],
      ['clean', 'Professionally cleaned', 'Each apartment is cleaned and prepared with fresh linen before every stay.'],
    ],
    galleryTitle: 'Photo gallery',
    galleryLead: 'These photos represent every apartment – all units are furnished and laid out the same way.',
    aptTitle: 'The apartment',
    specs: { guests: 'Guests', bedrooms: 'Bedrooms', beds: 'Beds', bathrooms: 'Bathrooms', size: 'Size', checkIn: 'Check-in', checkOut: 'Check-out' },
    amenitiesTitle: 'What every apartment offers',
    locTitle: 'Location',
    locLead: (hood) => `Our apartments are in ${hood ? hood + ', ' : ''}Makkah – convenient for reaching Al-Masjid Al-Haram and everything you need during your stay.`,
    openMaps: 'Open in Google Maps',
    mapTitle: 'Map showing the apartments’ location in Makkah',
    groupTitle: 'Travelling with a large family or group?',
    groupText: 'Because every apartment is identical, you can book two, three or more units side by side in the same building. Message us on WhatsApp and we will help you coordinate.',
    groupCta: 'Message us on WhatsApp',
    reviewsTitle: 'What our guests say',
    ratingOn: (v, c, s) => `${v} rating from ${c} reviews on ${s}`,
    faqTitle: 'Frequently asked questions',
    contactTitle: 'Contact us',
    contactLead: 'Questions before you book? We usually reply quickly on WhatsApp.',
    waMsg: 'Assalamu alaikum, I am interested in booking an apartment in Makkah.',
    license: 'Ministry of Tourism license no.',
    footerNote: 'Bookings and payments are processed by Airbnb and Booking.com. We never ask for payment outside these platforms.',
    rights: 'All rights reserved.',
    lbClose: 'Close', lbPrev: 'Previous photo', lbNext: 'Next photo',
    breadcrumbHome: 'Home',
  },
  ar: {
    dir: 'rtl', locale: 'ar_SA', other: 'en', otherLabel: 'English',
    title: (b) => `شقق مفروشة في مكة المكرمة للعمرة والحج | ${b}`,
    desc: 'شقق عائلية مفروشة ونظيفة في مكة المكرمة لإقامتك في العمرة أو الحج. شقق متطابقة التصميم مناسبة للعائلات والمجموعات. شاهد جميع الصور واحجز بأمان عبر Airbnb.',
    nav: { gallery: 'الصور', apartment: 'الشقة', location: 'الموقع', faq: 'الأسئلة الشائعة', contact: 'تواصل معنا' },
    bookNow: 'احجز الآن',
    menu: 'القائمة',
    eyebrow: 'شقق مفروشة · مكة المكرمة',
    h1: 'بيتك في مكة المكرمة للعمرة والحج',
    heroSub: 'شقق مفروشة بالكامل ونظيفة جداً للعائلات والمجموعات. جميع الشقق بنفس التصميم والأثاث والتقسيم، فما تراه في الصور هو بالضبط ما ستحصل عليه.',
    ctaAirbnb: 'تحقق من التوفر على Airbnb',
    ctaPhotos: 'شاهد جميع الصور',
    guests: 'ضيوف', bedrooms: 'غرف نوم', bathrooms: 'دورات مياه', sqm: 'م²',
    photoSoon: 'الصورة قريباً',
    whyTitle: 'لماذا يختارنا ضيوفنا',
    why: [
      ['shield', 'احجز بثقة', 'تتم جميع الحجوزات والمدفوعات بأمان عبر Airbnb أو Booking.com مع حماية الضيوف الخاصة بهم.'],
      ['copy', 'شقق متطابقة', 'جميع شققنا بنفس التصميم والأثاث والتقسيم، والصور تعرض تماماً ما ستحصل عليه.'],
      ['users', 'مناسبة للعائلات والمجموعات', 'مسافرون معاً؟ احجز عدة شقق متطابقة في نفس العمارة.'],
      ['clean', 'تنظيف احترافي', 'تُنظف كل شقة وتُجهز بمفارش نظيفة قبل كل إقامة.'],
    ],
    galleryTitle: 'معرض الصور',
    galleryLead: 'هذه الصور تمثل جميع الشقق، فكلها مؤثثة ومقسمة بنفس الطريقة.',
    aptTitle: 'الشقة',
    specs: { guests: 'عدد الضيوف', bedrooms: 'غرف النوم', beds: 'الأسرّة', bathrooms: 'دورات المياه', size: 'المساحة', checkIn: 'تسجيل الدخول', checkOut: 'تسجيل الخروج' },
    amenitiesTitle: 'ما توفره كل شقة',
    locTitle: 'الموقع',
    locLead: (hood) => `تقع شققنا في ${hood ? hood + '، ' : ''}مكة المكرمة، في موقع يسهّل الوصول إلى المسجد الحرام وكل ما تحتاجه خلال إقامتك.`,
    openMaps: 'افتح في خرائط Google',
    mapTitle: 'خريطة توضح موقع الشقق في مكة المكرمة',
    groupTitle: 'مسافر مع عائلة كبيرة أو مجموعة؟',
    groupText: 'لأن جميع الشقق متطابقة، يمكنك حجز شقتين أو ثلاث أو أكثر في نفس العمارة. راسلنا على واتساب وسنساعدك في التنسيق.',
    groupCta: 'راسلنا على واتساب',
    reviewsTitle: 'آراء ضيوفنا',
    ratingOn: (v, c, s) => `تقييم ${v} من ${c} مراجعة على ${s}`,
    faqTitle: 'الأسئلة الشائعة',
    contactTitle: 'تواصل معنا',
    contactLead: 'لديك سؤال قبل الحجز؟ نرد عادةً بسرعة على واتساب.',
    waMsg: 'السلام عليكم، أرغب في حجز شقة في مكة المكرمة.',
    license: 'رقم ترخيص وزارة السياحة',
    footerNote: 'تتم الحجوزات والمدفوعات عبر Airbnb و Booking.com. لا نطلب أي دفع خارج هذه المنصات.',
    rights: 'جميع الحقوق محفوظة.',
    lbClose: 'إغلاق', lbPrev: 'الصورة السابقة', lbNext: 'الصورة التالية',
    breadcrumbHome: 'الرئيسية',
  },
};

function faqs(lang) {
  const dist = cfg.location.distances[0];
  const distVal = dist && val(dist.value, lang);
  const ci = val(apt.checkIn, lang), co = val(apt.checkOut, lang);
  const lic = val(cfg.tourismLicense);
  if (lang === 'ar') return [
    ['كيف أحجز؟', 'اضغط «احجز الآن» لتنتقل إلى صفحتنا على Airbnb، واختر تواريخك وشاهد السعر والتوفر مباشرة. يتم الحجز والدفع بالكامل عبر Airbnb وتصلك رسالة التأكيد فوراً.'],
    ['هل جميع الشقق متشابهة؟', 'نعم. جميع شققنا بنفس التصميم والأثاث والتقسيم، والصور في هذا الموقع تمثل كل شقة.'],
    ['هل يمكنني حجز أكثر من شقة لعائلتي أو مجموعتي؟', 'نعم. احجز كل شقة على حدة عبر Airbnb أو Booking.com، ثم راسلنا على واتساب لنساعدك في التنسيق بين الشقق.'],
    ['كم تبعد الشقق عن المسجد الحرام؟', distVal ? `المسافة إلى المسجد الحرام تقريباً: ${distVal}. تجد تفاصيل أكثر في قسم الموقع.` : 'تجد المسافات إلى المسجد الحرام والأماكن القريبة في قسم الموقع.'],
    ['ما هي أوقات تسجيل الدخول والخروج؟', ci || co ? `تسجيل الدخول: ${ci || '—'}. تسجيل الخروج: ${co || '—'}.` : 'تظهر أوقات الدخول والخروج في صفحة الحجز على Airbnb.'],
    ['هل الشقق مناسبة للعائلات؟', 'نعم. صُممت الشقق للعائلات والمجموعات، وتحتوي على مطبخ مجهز وغرف نوم منفصلة وصالة للجلوس.'],
    ['كيف أصل من مطار جدة أو محطة القطار؟', 'يمكنك استخدام سيارة أجرة أو تطبيقات النقل مثل Uber و Careem من مطار الملك عبدالعزيز بجدة، أو ركوب قطار الحرمين إلى محطة مكة ثم أخذ سيارة أجرة إلى الشقة. أرسل لنا تفاصيل وصولك وسنرسل لك الموقع الدقيق.'],
    ['كيف أدفع؟', 'يتم الدفع فقط عبر Airbnb أو Booking.com. لا نطلب أبداً تحويل الأموال خارج هذه المنصات.'],
    ...(lic ? [['هل الشقق مرخصة؟', `نعم، الشقق مرخصة من وزارة السياحة السعودية برقم ترخيص ${lic}.`]] : []),
  ];
  return [
    ['How do I book?', 'Tap “Book now” to open our Airbnb listing, choose your dates and see the live price and availability. Booking and payment happen entirely on Airbnb and you receive your confirmation instantly.'],
    ['Are all the apartments the same?', 'Yes. All our apartments have the same design, furniture and layout, so the photos on this website represent every unit.'],
    ['Can I book more than one apartment for my family or group?', 'Yes. Book each apartment on Airbnb or Booking.com, then message us on WhatsApp and we will help you coordinate the units.'],
    ['How far are the apartments from Al-Masjid Al-Haram?', distVal ? `Approximately ${distVal} to Al-Masjid Al-Haram. See the location section for more distances.` : 'See the location section for distances to Al-Masjid Al-Haram and nearby places.'],
    ['What are the check-in and check-out times?', ci || co ? `Check-in: ${ci || '—'}. Check-out: ${co || '—'}.` : 'Check-in and check-out times are shown on the Airbnb listing.'],
    ['Are the apartments suitable for families?', 'Yes. They are designed for families and groups, with a fully equipped kitchen, separate bedrooms and a living area.'],
    ['How do I get there from Jeddah airport or the train station?', 'From King Abdulaziz International Airport in Jeddah you can take a taxi or a ride-hailing app such as Uber or Careem, or ride the Haramain High-Speed Railway to Makkah station and take a taxi from there. Send us your arrival details and we will share the exact location.'],
    ['How do I pay?', 'Payment is made only through Airbnb or Booking.com. We will never ask you to transfer money outside these platforms.'],
    ...(lic ? [['Are the apartments licensed?', `Yes. The apartments are licensed by the Saudi Ministry of Tourism, license no. ${lic}.`]] : []),
  ];
}

// ---------- page ----------
function page(lang) {
  const t = T[lang];
  const B = lang === 'ar' ? '../' : ''; // relative path back to site root
  const brand = val(cfg.brand, lang);
  const title = t.title(brand);
  const url = pageUrl(lang);
  const otherUrl = lang === 'ar' ? '../' : 'ar/';
  const hood = val(cfg.location.neighborhood, lang);
  const waLink = wa ? `https://wa.me/${wa}?text=${encodeURIComponent(t.waMsg)}` : '';
  const mapsLink = val(cfg.location.mapsLink) || (hasGeo ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}` : '');
  const list = faqs(lang);
  const bookHref = firstAirbnb || '#contact';
  const bookAttrs = firstAirbnb ? ' target="_blank" rel="noopener" data-track="book_airbnb"' : '';

  const g = val(apt.guests), br = val(apt.bedrooms), ba = val(apt.bathrooms), sz = val(apt.sizeSqm), beds = val(apt.beds);
  const distances = cfg.location.distances.filter((d) => val(d.value, lang));

  const photoEl = (p, i, cls = '') => p.exists
    ? `<img src="${B}images/${esc(p.file)}" alt="${esc(p[lang])}" ${i === 0 && cls === 'hero-img' ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" class="${cls}">`
    : `<div class="ph ${cls}" role="img" aria-label="${esc(p[lang])}">${icon('image')}<span>${esc(p[lang])}</span><small>${t.photoSoon}</small></div>`;

  const chips = [
    g && [icon('users'), `${esc(g)} ${t.guests}`],
    br && [icon('bed'), `${esc(br)} ${t.bedrooms}`],
    ba && [icon('bath'), `${esc(ba)} ${t.bathrooms}`],
    sz && [icon('size'), `${esc(sz)} ${t.sqm}`],
    distances[0] && [icon('pin'), `${esc(val(distances[0].value, lang))} · ${esc(val(distances[0].place, lang))}`],
  ].filter(Boolean);

  const specRows = [
    [t.specs.guests, g], [t.specs.bedrooms, br], [t.specs.beds, beds], [t.specs.bathrooms, ba],
    [t.specs.size, sz && `${sz} ${t.sqm}`], [t.specs.checkIn, val(apt.checkIn, lang)], [t.specs.checkOut, val(apt.checkOut, lang)],
  ].filter((r) => r[1]);

  const rating = cfg.rating || {};
  const reviews = (cfg.reviews || []).filter((r) => val(r.text, lang) || val(r.text));

  // ---- structured data (JSON-LD) ----
  const images = photos.filter((p) => p.exists).map((p) => `${siteUrl}/images/${p.file}`);
  const address = {
    '@type': 'PostalAddress',
    addressLocality: lang === 'ar' ? 'مكة المكرمة' : 'Makkah',
    addressRegion: lang === 'ar' ? 'منطقة مكة المكرمة' : 'Makkah Province',
    addressCountry: 'SA',
  };
  const street = [val(cfg.location.street, lang), hood].filter(Boolean).join(', ');
  if (street) address.streetAddress = street;
  if (val(cfg.location.postalCode)) address.postalCode = val(cfg.location.postalCode);
  const business = {
    '@type': 'LodgingBusiness',
    '@id': `${siteUrl}/#business`,
    name: brand,
    description: t.desc,
    url,
    address,
    numberOfRooms: units.length,
    availableLanguage: ['Arabic', 'English'],
    amenityFeature: cfg.amenities.map((a) => ({ '@type': 'LocationFeatureSpecification', name: a[lang], value: true })),
  };
  if (images.length) business.image = images;
  if (hasGeo) { business.geo = { '@type': 'GeoCoordinates', latitude: lat, longitude: lng }; business.hasMap = mapsLink; }
  if (val(cfg.contact.phone)) business.telephone = val(cfg.contact.phone);
  if (val(cfg.contact.email)) business.email = val(cfg.contact.email);
  const sameAs = units.flatMap((u) => [u.airbnb, u.booking]).filter(Boolean);
  if (sameAs.length) business.sameAs = sameAs;
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${siteUrl}/#website`, url: `${siteUrl}/`, name: brand, inLanguage: lang },
      business,
      { '@type': 'FAQPage', mainEntity: list.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    ],
  };

  const gaId = val(cfg.googleAnalyticsId);
  const ga = gaId ? `
  <script async src="https://www.googletagmanager.com/gtag/js?id=${esc(gaId)}"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${esc(gaId)}');</script>` : '';
  const verify = val(cfg.googleSiteVerification);

  return `<!doctype html>
<html lang="${lang}" dir="${t.dir}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(t.desc)}">
  <link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="en" href="${pageUrl('en')}">
  <link rel="alternate" hreflang="ar" href="${pageUrl('ar')}">
  <link rel="alternate" hreflang="x-default" href="${pageUrl('en')}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="theme-color" content="#0e5e4e">
  ${verify ? `<meta name="google-site-verification" content="${esc(verify)}">` : ''}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${esc(brand)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(t.desc)}">
  <meta property="og:url" content="${url}">
  <meta property="og:locale" content="${t.locale}">
  <meta property="og:locale:alternate" content="${T[t.other].locale}">
  ${cover ? `<meta property="og:image" content="${siteUrl}/images/${esc(cover.file)}">\n  <meta property="og:image:alt" content="${esc(cover[lang])}">` : ''}
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="${B}assets/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@300;400;500;600;700&display=swap">
  <link rel="stylesheet" href="${B}assets/styles.css">
  <script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>${ga}
</head>
<body>
  <a class="skip" href="#main">${lang === 'ar' ? 'انتقل إلى المحتوى' : 'Skip to content'}</a>
  <header class="top">
    <div class="wrap top-in">
      <a class="brand" href="./">${icon('pin', 'ic brand-ic')}<span>${esc(brand)}</span></a>
      <nav id="nav" class="nav" aria-label="Main">
        <a href="#gallery">${t.nav.gallery}</a>
        <a href="#apartment">${t.nav.apartment}</a>
        <a href="#location">${t.nav.location}</a>
        <a href="#faq">${t.nav.faq}</a>
        <a href="#contact">${t.nav.contact}</a>
      </nav>
      <a class="lang" href="${otherUrl}" hreflang="${t.other}" lang="${t.other}">${t.otherLabel}</a>
      <a class="btn btn-sm hide-sm" href="${esc(bookHref)}"${bookAttrs}>${t.bookNow}</a>
      <button class="menu" aria-controls="nav" aria-expanded="false" aria-label="${t.menu}"><span></span><span></span><span></span></button>
    </div>
  </header>

  <main id="main">
    <section class="hero">
      <div class="wrap hero-grid">
        <div class="hero-text">
          <p class="eyebrow">${t.eyebrow}</p>
          <h1>${t.h1}</h1>
          <p class="lead">${t.heroSub}</p>
          <div class="cta-row">
            <a class="btn btn-lg" href="${esc(bookHref)}"${bookAttrs}>${t.ctaAirbnb}</a>
            <a class="btn btn-lg btn-ghost" href="#gallery">${t.ctaPhotos}</a>
          </div>
          ${chips.length ? `<ul class="chips">${chips.map(([i, s]) => `<li>${i}${s}</li>`).join('')}</ul>` : ''}
        </div>
        <div class="hero-media">
          <button class="hero-open" data-open="0" aria-label="${t.ctaPhotos}">${photoEl(cover || photos[0], 0, 'hero-img')}</button>
        </div>
      </div>
    </section>

    <section class="section why" aria-labelledby="why-h">
      <div class="wrap">
        <h2 id="why-h">${t.whyTitle}</h2>
        <div class="cards">
          ${t.why.map(([i, h, p]) => `<div class="card">${icon(i, 'ic ic-lg')}<h3>${h}</h3><p>${p}</p></div>`).join('\n          ')}
        </div>
      </div>
    </section>

    <section id="gallery" class="section alt" aria-labelledby="gallery-h">
      <div class="wrap">
        <h2 id="gallery-h">${t.galleryTitle}</h2>
        <p class="lead">${t.galleryLead}</p>
        <ul class="gallery">
          ${photos.map((p, i) => `<li><button data-open="${i}" aria-label="${esc(p[lang])}">${photoEl(p, i)}</button></li>`).join('\n          ')}
        </ul>
      </div>
    </section>

    <section id="apartment" class="section" aria-labelledby="apt-h">
      <div class="wrap two">
        <div>
          <h2 id="apt-h">${t.aptTitle}</h2>
          ${val(apt.layout, lang) ? `<p class="lead">${esc(val(apt.layout, lang))}</p>` : ''}
          ${specRows.length ? `<dl class="specs">${specRows.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
        </div>
        <div>
          <h3>${t.amenitiesTitle}</h3>
          <ul class="amenities">
            ${cfg.amenities.map((a) => `<li>${icon(a.icon)}${esc(a[lang])}</li>`).join('\n            ')}
          </ul>
        </div>
      </div>
    </section>

    <section class="section group" aria-labelledby="group-h">
      <div class="wrap group-in">
        ${icon('users', 'ic ic-xl')}
        <div>
          <h2 id="group-h">${t.groupTitle}</h2>
          <p>${t.groupText}</p>
        </div>
        ${waLink ? `<a class="btn btn-light" href="${esc(waLink)}" target="_blank" rel="noopener" data-track="whatsapp">${icon('chat')}${t.groupCta}</a>` : ''}
      </div>
    </section>

    <section id="location" class="section" aria-labelledby="loc-h">
      <div class="wrap two">
        <div>
          <h2 id="loc-h">${t.locTitle}</h2>
          <p class="lead">${esc(t.locLead(hood))}</p>
          ${distances.length ? `<ul class="distances">${distances.map((d) => `<li>${icon('pin')}<span>${esc(val(d.place, lang))}</span><strong>${esc(val(d.value, lang))}</strong></li>`).join('')}</ul>` : ''}
          ${mapsLink ? `<a class="btn btn-ghost" href="${esc(mapsLink)}" target="_blank" rel="noopener">${icon('pin')}${t.openMaps}</a>` : ''}
        </div>
        ${hasGeo ? `<div class="map"><iframe title="${t.mapTitle}" src="https://maps.google.com/maps?q=${lat},${lng}&z=15&hl=${lang}&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>` : ''}
      </div>
    </section>
${reviews.length ? `
    <section id="reviews" class="section alt" aria-labelledby="rev-h">
      <div class="wrap">
        <h2 id="rev-h">${t.reviewsTitle}</h2>
        ${val(rating.value) && val(rating.count) ? `<p class="rating">${icon('star', 'ic star')}${esc(t.ratingOn(val(rating.value), val(rating.count), val(rating.source) || 'Airbnb'))}</p>` : ''}
        <div class="reviews">
          ${reviews.map((r) => `<figure class="review"><blockquote>${esc(val(r.text, lang) || val(r.text))}</blockquote><figcaption>${esc(val(r.name))}${val(r.date) ? ` · ${esc(val(r.date))}` : ''}${val(r.source) ? ` · ${esc(val(r.source))}` : ''}</figcaption></figure>`).join('\n          ')}
        </div>
      </div>
    </section>
` : ''}
    <section id="faq" class="section${reviews.length ? '' : ' alt'}" aria-labelledby="faq-h">
      <div class="wrap narrow">
        <h2 id="faq-h">${t.faqTitle}</h2>
        ${list.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n        ')}
      </div>
    </section>

    <section id="contact" class="section" aria-labelledby="contact-h">
      <div class="wrap narrow center">
        <h2 id="contact-h">${t.contactTitle}</h2>
        <p class="lead">${t.contactLead}</p>
        <div class="contact">
          ${waLink ? `<a class="btn btn-lg" href="${esc(waLink)}" target="_blank" rel="noopener" data-track="whatsapp">${icon('chat')}WhatsApp</a>` : ''}
          ${val(cfg.contact.phone) ? `<a class="btn btn-lg btn-ghost" href="tel:${esc(val(cfg.contact.phone).replace(/\s/g, ''))}" dir="ltr">${icon('phone')}${esc(val(cfg.contact.phone))}</a>` : ''}
          ${val(cfg.contact.email) ? `<a class="btn btn-lg btn-ghost" href="mailto:${esc(val(cfg.contact.email))}">${icon('mail')}${esc(val(cfg.contact.email))}</a>` : ''}
        </div>
      </div>
    </section>
  </main>

  <footer class="foot">
    <div class="wrap">
      <p><strong>${esc(brand)}</strong> · ${lang === 'ar' ? 'مكة المكرمة، المملكة العربية السعودية' : 'Makkah, Saudi Arabia'}</p>
      ${val(cfg.tourismLicense) ? `<p>${t.license} <span dir="ltr">${esc(val(cfg.tourismLicense))}</span></p>` : ''}
      <p class="small">${t.footerNote}</p>
      <p class="small">© ${year} ${esc(brand)}. ${t.rights} · <a href="${otherUrl}" hreflang="${t.other}" lang="${t.other}">${t.otherLabel}</a></p>
    </div>
  </footer>

  <div class="bookbar">
    <a class="btn" href="${esc(bookHref)}"${bookAttrs}>${t.bookNow}</a>
    ${waLink ? `<a class="btn btn-ghost" href="${esc(waLink)}" target="_blank" rel="noopener" data-track="whatsapp" aria-label="WhatsApp">${icon('chat')}</a>` : ''}
  </div>

  <dialog id="lightbox" class="lb" aria-label="${t.galleryTitle}">
    <button class="lb-close" aria-label="${t.lbClose}">×</button>
    <button class="lb-prev" aria-label="${t.lbPrev}">‹</button>
    <figure><div class="lb-media"></div><figcaption></figcaption></figure>
    <button class="lb-next" aria-label="${t.lbNext}">›</button>
  </dialog>

  <script src="${B}assets/app.js" defer></script>
</body>
</html>
`;
}

// ---------- write everything ----------
function write(rel, content) {
  const f = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, content);
}

write('index.html', page('en'));
write('ar/index.html', page('ar'));
for (const f of fs.readdirSync(path.join(SRC, 'assets'))) write(`assets/${f}`, fs.readFileSync(path.join(SRC, 'assets', f)));

const today = new Date().toISOString().slice(0, 10);
const alt = `\n    <xhtml:link rel="alternate" hreflang="en" href="${pageUrl('en')}"/>\n    <xhtml:link rel="alternate" hreflang="ar" href="${pageUrl('ar')}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl('en')}"/>`;
const imgTags = photos.filter((p) => p.exists).map((p) => `\n    <image:image><image:loc>${siteUrl}/images/${p.file}</image:loc></image:image>`).join('');
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${pageUrl('en')}</loc>
    <lastmod>${today}</lastmod>${alt}${imgTags}
  </url>
  <url>
    <loc>${pageUrl('ar')}</loc>
    <lastmod>${today}</lastmod>${alt}${imgTags}
  </url>
</urlset>
`);
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
write('.nojekyll', '');
if (cfg.customDomain) write('CNAME', `${cfg.customDomain}\n`);
else if (fs.existsSync(path.join(OUT, 'CNAME'))) fs.unlinkSync(path.join(OUT, 'CNAME'));
write('404.html', `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page not found | ${esc(val(cfg.brand, 'en'))}</title><style>body{font-family:system-ui,sans-serif;background:#fbf8f3;color:#1f2a24;display:grid;place-items:center;min-height:100vh;margin:0;text-align:center;padding:16px}a{color:#0e5e4e;font-weight:600}</style></head><body><main><h1>Page not found · الصفحة غير موجودة</h1><p><a href="${siteUrl}/">Go to homepage</a> · <a href="${siteUrl}/ar/">الصفحة الرئيسية</a></p></main></body></html>\n`);

// ---------- report ----------
const todos = findTodos(cfg);
const missing = photos.filter((p) => !p.exists).map((p) => p.file);
console.log(`Built ${path.relative(process.cwd(), OUT) || OUT}/ (en + ar) for ${siteUrl}`);
if (missing.length) console.log(`\nPhotos still missing in docs/images/ (${missing.length}): ${missing.join(', ')}`);
if (todos.length) console.log(`\nStill to fill in site/config.json (${todos.length}) – hidden on the site until filled:\n  - ${todos.join('\n  - ')}`);
