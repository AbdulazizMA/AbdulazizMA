import { cfg, T, url, icon, btn, waBtn, faqBlock, faqSchema, ctaBand, agentId } from "../lib.mjs";
import { AREAS } from "./areas-data.mjs";

const list = (items) => `<ul class="checklist">${items.map((i) => `<li>${icon("check")}<span>${i}</span></li>`).join("")}</ul>`;

function areasIndex(lang) {
  const ar = lang === "ar";
  const p = ar ? "" : "/en";
  const title = ar ? `أفضل أحياء ${cfg.city.ar} للاستثمار العقاري` : `Best ${cfg.city.en} Districts for Property Investment`;
  const body = `
<section class="page-hero">
  <div class="wrap narrow">
    <h1>${title}</h1>
    <p class="lead">${
      ar
        ? "لا يوجد «أفضل حي» مطلق — يوجد حي أفضل لهدفك. هنا تحليل مختصر لكل حي أعمل فيه: لمن يناسب، أنواع العقار الأنسب، وما يجب الانتباه له. الأسعار الحالية أشاركها معك مباشرة لأنها تتغير أسرع من أي صفحة."
        : "There's no universally \"best\" district — there's the best district for your goal. Here's a short analysis of each area I cover: who it suits, which property types work, and what to watch. Current prices I share directly, because they move faster than any web page."
    }</p>
  </div>
</section>
<section class="section">
  <div class="wrap">
    ${
      ar
        ? `<div class="grid grid-3">${AREAS.map(
            (a) => `<a class="card card-link area-card" href="${url(`/areas/${a.slug}/`)}"><span class="area-tag">${a.zone.ar}</span><h2 class="h3">${a.name.ar}</h2><p>${a.short.ar}</p><span class="more">${icon("arrow")}</span></a>`
          ).join("")}</div>`
        : AREAS.map(
            (a) => `<article class="area-en" id="${a.slug}"><span class="area-tag">${a.zone.en}</span><h2>${a.name.en}</h2><p>${a.short.en}</p><p><a href="${url(`/areas/${a.slug}/`)}" hreflang="ar" lang="ar">اقرأ التحليل الكامل بالعربية</a></p></article>`
          ).join("")
    }
  </div>
</section>
<section class="section section-alt">
  <div class="wrap narrow">
    <h2>${ar ? "كيف أختار الحي المناسب لك؟" : "How I pick the right district for you"}</h2>
    ${list(
      ar
        ? [
            "<strong>الهدف أولًا:</strong> دخل شهري؟ نمو في القيمة؟ أم الاثنين؟ كل هدف يقود لأحياء مختلفة.",
            "<strong>الميزانية الكاملة:</strong> سعر العقار + ضريبة التصرفات + السعي + التجهيز — لا سعر الإعلان فقط.",
            "<strong>الطلب الحقيقي:</strong> من سيستأجر أو يشتري منك لاحقًا؟ وما حجم المعروض المنافس؟",
            "<strong>السيولة:</strong> كم يحتاج بيع هذا العقار لو احتجت المال؟",
            "<strong>البيانات:</strong> مقارنة بصفقات مسجّلة فعلية، لا بأسعار الإعلانات.",
          ]
        : [
            "<strong>Goal first:</strong> monthly income, capital growth, or both? Each leads to different districts.",
            "<strong>Full budget:</strong> price + transaction tax + brokerage + fit-out — not the listing price alone.",
            "<strong>Real demand:</strong> who will rent or buy from you later, and how much competing supply is coming?",
            "<strong>Liquidity:</strong> how long would it take to sell if you needed the cash?",
            "<strong>Data:</strong> comparison with actual registered transactions, not listing prices.",
          ]
    )}
  </div>
</section>
${ctaBand(lang, ar ? "لست متأكدًا أي حي يناسبك؟" : "Not sure which district suits you?", ar ? "أرسل لي ميزانيتك وهدفك، وأرد عليك بأفضل ٢–٣ أحياء لحالتك مع السبب." : "Send me your budget and goal, and I'll reply with the 2–3 best districts for your case — and why.")}`;

  return {
    key: "areas",
    lang,
    path: p + "/areas/",
    title,
    description: ar
      ? `تحليل أحياء ${cfg.city.ar} للمستثمرين: الملقا، حطين، النرجس، الياسمين، العارض، الرمال — لمن يناسب كل حي، أنواع العقار، والمخاطر.`
      : `District analysis for ${cfg.city.en} property investors: Al Malqa, Hittin, An Narjis, Al Yasmin, Al Arid, Ar Rimal — who each suits, property types and risks.`,
    crumbs: [{ name: ar ? "الأحياء" : "Areas", path: p + "/areas/" }],
    priority: 0.8,
    body,
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: title,
        about: AREAS.map((a) => ({ "@type": "Place", name: `${T(lang, a.name)}, ${T(lang, cfg.city)}` })),
      },
    ],
  };
}

function areaPage(a, i) {
  const title = `الاستثمار العقاري في حي ${a.name.ar} — ${cfg.city.ar}`;
  const others = AREAS.filter((x) => x.slug !== a.slug);
  const wa = `السلام عليكم، مهتم بفرص استثمارية في حي ${a.name.ar}. ميزانيتي تقريبًا: `;
  const body = `
<section class="page-hero">
  <div class="wrap narrow">
    <span class="area-tag">${a.zone.ar}</span>
    <h1>${title}</h1>
    <p class="lead">${a.short.ar}</p>
    <div class="hero-actions">${waBtn("ar", wa, `اطلب فرص حي ${a.name.ar}`)}</div>
  </div>
</section>
<article class="section">
  <div class="wrap narrow prose">
    <h2>نظرة عامة على حي ${a.name.ar}</h2>
    <p>${a.intro}</p>

    <h2>لمن يناسب الاستثمار في ${a.name.ar}؟</h2>
    ${list(a.fit)}

    <h2>أنواع العقار الأنسب</h2>
    <ul class="tags">${a.types.map((t) => `<li>${t}</li>`).join("")}</ul>

    <h2>ما الذي يجب الانتباه له؟</h2>
    <ul class="checklist warn">${a.watch.map((w) => `<li>${icon("shield")}<span>${w}</span></li>`).join("")}</ul>

    <div class="callout">
      <h2 class="h3">كيف أحلّل صفقة في ${a.name.ar}؟</h2>
      <p>قبل أن أرشّح لك أي عقار في ${a.name.ar}، أقارنه بصفقات مسجّلة فعلية في نفس الحي، وأحسب العائد الصافي بعد ضريبة التصرفات العقارية والسعي والشواغر والصيانة، وأتحقق من الصك والاستخدام والمخطط. تصلك النتيجة في ملف واحد مع توصية واضحة: اشترِ، فاوض، أو اترك.</p>
      <p>${btn(url("/tools/roi-calculator/"), `${icon("calc")}<span>جرّب حاسبة العائد</span>`, "btn-ghost btn-sm")}</p>
    </div>

    <h2>أسئلة شائعة عن الاستثمار في ${a.name.ar}</h2>
    ${faqBlock(a.faq)}

    <p class="note">هذه نظرة عامة لأغراض التوعية وليست توصية استثمارية. الأسعار والعوائد الحالية تختلف حسب الموقع داخل الحي وحالة العقار — أرسلها لك محدّثة عند الطلب.</p>
  </div>
</article>
<section class="section section-alt">
  <div class="wrap">
    <h2 class="section-title">أحياء أخرى قد تناسبك</h2>
    <div class="grid grid-3">${[...others.slice(i), ...others.slice(0, i)]
      .slice(0, 3)
      .map((o) => `<a class="card card-link area-card" href="${url(`/areas/${o.slug}/`)}"><span class="area-tag">${o.zone.ar}</span><h3>${o.name.ar}</h3><p>${o.short.ar}</p><span class="more">${icon("arrow")}</span></a>`)
      .join("")}</div>
  </div>
</section>
${ctaBand("ar", `تبحث عن فرصة في ${a.name.ar}؟`, "أرسل لي ميزانيتك وهدفك، وأرسل لك ما يناسبك من المعروض الحالي — بما فيه عروض لم تُنشر بعد.")}`;

  return {
    key: `area-${a.slug}`,
    lang: "ar",
    path: `/areas/${a.slug}/`,
    title,
    description: `هل الاستثمار في حي ${a.name.ar} بـ${cfg.city.ar} مناسب لك؟ تحليل لمن يناسب الحي، أنواع العقار الأنسب، المخاطر، وكيف تحسب العائد قبل الشراء — من وسيط عقاري مرخّص.`,
    crumbs: [
      { name: "الأحياء", path: "/areas/" },
      { name: a.name.ar, path: `/areas/${a.slug}/` },
    ],
    priority: 0.7,
    body,
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: title,
        about: { "@type": "Place", name: `حي ${a.name.ar}، ${cfg.city.ar}`, containedInPlace: { "@type": "City", name: cfg.city.ar } },
        publisher: { "@id": agentId },
        inLanguage: "ar-SA",
      },
      faqSchema(a.faq),
    ],
  };
}

export default function areas() {
  return [areasIndex("ar"), areasIndex("en"), ...AREAS.map(areaPage)];
}
