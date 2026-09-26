import { cfg, T, url, icon, waBtn, faqBlock, faqSchema, ctaBand, agentId, CITIES, pageHero, skyline, kicker, arrowLink, feeText } from "../lib.mjs";
import { DISTRICTS, CITY_INFO } from "./cities-data.mjs";

const list = (items, cls = "") => `<ul class="checklist ${cls}">${items.map((i) => `<li>${icon(cls === "warn" ? "shield" : "check")}<span>${i}</span></li>`).join("")}</ul>`;

export const districtCard = (city, d, lang = "ar", tag = "h3") => {
  const href = lang === "ar" ? `/${city.slug}/${d.slug}/` : `/en/${city.slug}/#${d.slug}`;
  return `<a class="d-card" href="${url(href)}" data-reveal><span class="d-zone">${icon("pin")}${T(lang, d.zone)}</span><${tag} class="d-name">${T(lang, d.name)}</${tag}><p>${T(lang, d.short)}</p><span class="d-go">${icon("arrow")}</span></a>`;
};

function hub(city, lang) {
  const ar = lang === "ar";
  const info = CITY_INFO[city.slug];
  const p = ar ? "" : "/en";
  const other = CITIES.find((c) => c.slug !== city.slug);
  const ds = DISTRICTS[city.slug];
  const faq = ar
    ? [
        { q: `كم عمولة الوسيط العقاري في ${city.ar}؟`, a: `أتعابي ${feeText("ar")} من قيمة العقار، تُحدَّد كتابةً في عقد وساطة موثّق وتُستحق عند إتمام الصفقة فقط. الاستشارة الأولى مجانية.` },
        { q: `هل تعمل في كل أحياء ${city.ar}؟`, a: `نعم، أبحث حيث تكون الفرصة الأنسب لهدفك. الأحياء المذكورة هنا هي الأكثر طلبًا من المستثمرين، وليست الوحيدة.` },
        { q: `أستثمر في ${city.ar} أم ${other.ar}؟`, a: `يعتمد على هدفك وميزانيتك وتحمّلك للمخاطر. أعمل في المدينتين، فأقارن لك الخيارات بحيادية بدل أن أدفعك نحو ما لدي فقط.` },
      ]
    : [
        { q: `What does a real estate agent charge in ${city.en}?`, a: `My fee is ${feeText("en")} of the property price, set in writing in a documented brokerage agreement and due only when the deal closes. The first consultation is free.` },
        { q: `Do you cover all of ${city.en}?`, a: `Yes — I search wherever the best opportunity for your goal is. The districts here are the ones investors ask about most, not the only ones.` },
        { q: `Should I invest in ${city.en} or ${other.en}?`, a: `It depends on your goal, budget and risk appetite. I work in both cities, so I compare options neutrally instead of pushing what I have.` },
      ];

  const districtsHtml = ar
    ? `<div class="d-grid">${ds.map((d) => districtCard(city, d, "ar", "h3")).join("")}</div>`
    : ds
        .map(
          (d) => `<article class="d-en" id="${d.slug}" data-reveal><span class="d-zone">${icon("pin")}${d.zone.en}</span><h3>${d.name.en}</h3><p>${d.short.en}</p><p><a href="${url(`/${city.slug}/${d.slug}/`)}" hreflang="ar" lang="ar">التحليل الكامل بالعربية ←</a></p></article>`
        )
        .join("");

  const body = (crumbs) => `
${pageHero(lang, {
  crumbs,
  kicker: ar ? `${city.ar} · ${city.region.ar}` : `${city.en} · ${city.region.en}`,
  title: T(lang, info.title),
  lead: T(lang, info.lead),
  actions: waBtn(lang, ar ? `السلام عليكم، أبحث عن فرصة استثمارية في ${city.ar}. ميزانيتي تقريبًا: ` : `Hello, I'm looking for an investment opportunity in ${city.en}. My budget is roughly: `, ar ? `اطلب فرص ${city.ar}` : `Ask for ${city.en} opportunities`),
  aside: `<div class="city-art city-art-${city.slug}">${skyline(city.slug)}<span>${T(lang, city)}</span></div>`,
})}
<section class="section">
  <div class="wrap">
    ${kicker(ar ? "ما الذي يحرّك السوق" : "What moves the market")}
    <h2 class="h-xl">${ar ? `ثلاثة عوامل يجب أن يفهمها كل مستثمر في ${city.ar}` : `Three forces every ${city.en} investor should understand`}</h2>
    <div class="drivers">${T(lang, info.drivers).map(([t, d], i) => `<article data-reveal><span class="num">0${i + 1}</span><h3>${t}</h3><p>${d}</p></article>`).join("")}</div>
  </div>
</section>
<section class="section section-sand">
  <div class="wrap">
    ${kicker(ar ? "الأحياء" : "Districts")}
    <h2 class="h-xl">${ar ? `أحياء ${city.ar} التي يسأل عنها المستثمرون` : `${city.en} districts investors ask about`}</h2>
    <p class="section-lead">${ar ? "لكل حي منطق استثماري مختلف. لا يوجد «أفضل حي» — يوجد الحي الأفضل لهدفك." : "Each district has its own investment logic. There's no \"best district\" — only the best one for your goal."}</p>
    ${districtsHtml}
  </div>
</section>
<section class="section">
  <div class="wrap split-2">
    <div>
      ${kicker(ar ? "أسئلة شائعة" : "FAQ")}
      <h2 class="h-xl">${ar ? `الاستثمار العقاري في ${city.ar}` : `Investing in ${city.en}`}</h2>
      <p class="muted">${ar ? `أعمل أيضًا في ${other.ar}.` : `I also work in ${other.en}.`} ${arrowLink(url(`${p}/${other.slug}/`), ar ? `استكشف ${other.ar}` : `Explore ${other.en}`)}</p>
    </div>
    ${faqBlock(faq)}
  </div>
</section>
${ctaBand(lang, ar ? `تبحث عن فرصة في ${city.ar}؟` : `Looking for an opportunity in ${city.en}?`, ar ? "أرسل لي ميزانيتك وهدفك، وأرد عليك بأفضل ٢–٣ أحياء لحالتك والمعروض الحالي — بما فيه عروض لم تُنشر بعد." : "Send me your budget and goal, and I'll reply with the best 2–3 districts for your case and current supply — including unlisted deals.")}`;

  return {
    key: `city-${city.slug}`,
    lang,
    city,
    path: `${p}/${city.slug}/`,
    title: T(lang, info.title),
    description: T(lang, info.description),
    crumbs: [{ name: T(lang, city), path: `${p}/${city.slug}/` }],
    priority: 0.95,
    body,
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: T(lang, info.title),
        serviceType: ar ? "وساطة عقارية للمشتري" : "Buyer's real estate brokerage",
        provider: { "@id": agentId },
        areaServed: { "@type": "City", name: T(lang, city) },
      },
      faqSchema(faq),
    ],
  };
}

function districtPage(city, d, i) {
  const ds = DISTRICTS[city.slug];
  const others = ds.filter((x) => x.slug !== d.slug);
  const title = `الاستثمار العقاري في حي ${d.name.ar} — ${city.ar}`;
  const wa = `السلام عليكم، مهتم بفرص استثمارية في حي ${d.name.ar} ب${city.ar}. ميزانيتي تقريبًا: `;
  const body = (crumbs) => `
${pageHero("ar", { crumbs, kicker: d.zone.ar, title, lead: d.short.ar, actions: waBtn("ar", wa, `اطلب فرص حي ${d.name.ar}`) })}
<article class="section">
  <div class="wrap article-grid">
    <div class="prose">
      <h2>نظرة عامة على حي ${d.name.ar}</h2>
      <p>${d.intro}</p>
      <h2>لمن يناسب الاستثمار في ${d.name.ar}؟</h2>
      ${list(d.fit)}
      <h2>أنواع العقار الأنسب</h2>
      <ul class="tags">${d.types.map((t) => `<li>${t}</li>`).join("")}</ul>
      <h2>ما الذي يجب الانتباه له؟</h2>
      ${list(d.watch, "warn")}
      <h2>أسئلة شائعة عن حي ${d.name.ar}</h2>
      ${faqBlock(d.faq)}
      <p class="note">نظرة عامة للتوعية وليست توصية استثمارية. الأسعار والعوائد الحالية تختلف حسب الموقع داخل الحي وحالة العقار — أرسلها لك محدّثة عند الطلب.</p>
    </div>
    <aside class="sidebar">
      <div class="side-card">
        <h2 class="h3">كيف أحلّل صفقة في ${d.name.ar}؟</h2>
        <p>أقارن العقار بصفقات مسجّلة فعلية في نفس الحي، وأحسب العائد الصافي بعد ضريبة التصرفات والسعي والشواغر والصيانة، وأتحقق من الصك والاستخدام. النتيجة ملف واحد مع توصية: اشترِ، فاوض، أو اترك.</p>
        ${waBtn("ar", wa, "أرسل ميزانيتك", "btn-wa btn-block")}
        ${arrowLink(url("/tools/roi-calculator/"), "أو جرّب حاسبة العائد")}
      </div>
    </aside>
  </div>
</article>
<section class="section section-sand">
  <div class="wrap">
    <h2 class="h-xl">أحياء أخرى في ${city.ar}</h2>
    <div class="d-grid">${[...others.slice(i), ...others.slice(0, i)].slice(0, 3).map((o) => districtCard(city, o)).join("")}</div>
  </div>
</section>
${ctaBand("ar", `تبحث عن فرصة في ${d.name.ar}؟`, "أرسل لي ميزانيتك وهدفك، وأرسل لك ما يناسبك من المعروض الحالي — بما فيه عروض لم تُنشر بعد.")}`;

  return {
    key: `d-${city.slug}-${d.slug}`,
    lang: "ar",
    city,
    path: `/${city.slug}/${d.slug}/`,
    title,
    description: `هل الاستثمار في حي ${d.name.ar} ب${city.ar} مناسب لك؟ لمن يناسب الحي، أنواع العقار الأنسب، المخاطر، وكيف تحسب العائد قبل الشراء — من وسيط عقاري مرخّص.`,
    crumbs: [
      { name: city.ar, path: `/${city.slug}/` },
      { name: d.name.ar, path: `/${city.slug}/${d.slug}/` },
    ],
    priority: 0.7,
    body,
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: title,
        about: { "@type": "Place", name: `حي ${d.name.ar}، ${city.ar}`, containedInPlace: { "@type": "City", name: city.ar } },
        publisher: { "@id": agentId },
        inLanguage: "ar-SA",
      },
      faqSchema(d.faq),
    ],
  };
}

export default function cities() {
  return CITIES.flatMap((c) => [hub(c, "ar"), hub(c, "en"), ...DISTRICTS[c.slug].map((d, i) => districtPage(c, d, i))]);
}
