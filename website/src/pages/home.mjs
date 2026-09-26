import { cfg, T, url, prefix, icon, btn, waBtn, faqBlock, faqSchema, ctaBand, agentSchema, abs, esc } from "../lib.mjs";
import { AREAS } from "./areas-data.mjs";

const C = {
  ar: {
    title: `وسيط عقاري في ${cfg.city.ar} للمستثمرين — شراء عقار بعائد مدروس`,
    description: `وسيط عقاري مرخّص (فال) في ${cfg.city.ar} يمثّل المستثمر لا البائع: بحث عن فلل وأراضٍ وعمائر، تحليل العائد بالأرقام، تفاوض، ومتابعة حتى الإفراغ. استشارة أولى مجانية.`,
    eyebrow: `وسيط عقاري مرخّص في ${cfg.city.ar}`,
    h1: `أشتري لك العقار <span>بعقلية مستثمر</span> — لا بعقلية بائع`,
    lead: "أمثّلك أنت في الصفقة: أبحث عن العقار المناسب لهدفك، أحلّل العائد بالأرقام قبل ما تدفع ريال، أفاوض على السعر، وأتابع معك حتى الإفراغ. فلل، أراضٍ، عمائر، ومشاريع على الخارطة.",
    ctaCalc: "احسب عائد عقار الآن",
    trust: [
      [`مرخّص من الهيئة العامة للعقار — فال ${cfg.falLicense}`, "shield"],
      ["عقد وساطة موثّق وأتعاب واضحة مسبقًا", "doc"],
      ["ملف تحليل مالي لكل عقار أرشّحه", "chart"],
    ],
    memo: {
      tag: "مثال توضيحي",
      title: "ملف تحليل صفقة",
      sub: "عمارة سكنية — شمال الرياض",
      rows: [
        ["السعر المطلوب", "٦٬٢٠٠٬٠٠٠ ر.س"],
        ["السعر بعد التفاوض", "٥٬٧٥٠٬٠٠٠ ر.س"],
        ["الدخل الإيجاري السنوي", "٤٦٨٬٠٠٠ ر.س"],
        ["صافي الدخل التشغيلي", "٣٩٧٬٨٠٠ ر.س"],
      ],
      kpis: [["العائد الصافي بعد التكاليف", "٦٫٤٪"], ["توفير التفاوض", "٤٥٠ ألف"]],
      verdict: "التوصية: شراء — بشرط فحص فني للسطح والخزانات",
    },
    problemsTitle: "لماذا يخسر كثير من المستثمرين قبل أن يبدؤوا؟",
    problemsLead: "المشكلة غالبًا ليست في السوق، بل في طريقة الشراء.",
    problems: [
      ["مسوّق البائع لا يعمل لك", "أغلب من تتواصل معهم يمثّلون البائع، ومصلحتهم أعلى سعر وأسرع إغلاق — لا أفضل صفقة لك."],
      ["عائد «على الورق» فقط", "إيجار مفترض بدون احتساب الشواغر والصيانة وضريبة التصرفات والسعي؛ فيتحوّل ٨٪ المتوقعة إلى ٤٪ فعليًا."],
      ["سعر لا يعكس السوق", "بدون مقارنة بصفقات فعلية مسجّلة في نفس الحي، تدفع زيادة لا تستردها إلا بعد سنوات."],
    ],
    servicesTitle: "كيف أخدمك كمستثمر",
    servicesLead: "خدمة واحدة في جوهرها: أن تشتري العقار الصحيح بالسعر الصحيح. وتتفرّع حسب هدفك.",
    services: [
      ["building", "عقارات مدرّة للدخل", "عمائر سكنية، شقق للتأجير، ومحلات — مع تحليل الدخل الفعلي وتاريخ الإشغال."],
      ["land", "أراضٍ للاستثمار والتطوير", "تحليل الموقع والتنظيم وعرض الشوارع وفرص النمو، سواء للاحتفاظ أو للتطوير."],
      ["key", "فلل ووحدات بهدف النمو", "وحدات في أحياء بطلب مستمر؛ مناسبة للتأجير أو إعادة البيع أو السكن مع الاستثمار."],
      ["search", "صفقات خارج المنصات", "عقارات تُعرض عبر شبكة الملاك والوسطاء قبل وصولها للإعلانات العامة."],
      ["handshake", "التفاوض والإغلاق", "أفاوض نيابة عنك، أراجع المستندات، وأنسّق مع البائع والتمويل حتى الإفراغ."],
      ["chart", "مراجعة محفظة", "عندك عقارات؟ أراجع أداءها وأقترح: احتفظ، حسّن، أو بِع وأعد التوزيع."],
    ],
    compareTitle: "الفرق بين مسوّق البائع وممثّل المشتري",
    compareCols: ["", "مسوّق البائع", "ممثّل المشتري (أنا)"],
    compareRows: [
      ["لمن يعمل؟", "للبائع", "لك أنت فقط"],
      ["ماذا يعرض عليك؟", "ما لديه من عروض", "ما يناسب هدفك من كامل السوق"],
      ["التفاوض على السعر", "يرفعه", "يخفضه"],
      ["تحليل العائد والتكاليف", "نادرًا", "ملف مكتوب لكل عقار"],
      ["يقول لك «لا تشترِ»؟", "لا", "نعم، إذا الأرقام لا تستحق"],
    ],
    processTitle: "من أول مكالمة حتى الإفراغ",
    process: [
      ["جلسة تحديد الهدف", "ميزانيتك، هدفك (دخل أم نمو)، أفقك الزمني، ومستوى المخاطرة."],
      ["خطة البحث", "نطاق الأحياء، نوع العقار، ومعايير واضحة للقبول والرفض."],
      ["ترشيحات مع ملفات تحليل", "٣–٥ عقارات مختارة، لكل منها أرقام ومقارنات ومخاطر."],
      ["المعاينة والتفاوض", "أعاين وأفاوض نيابة عنك، وأتحقق من الصك والمستندات."],
      ["الإغلاق وما بعده", "متابعة الإفراغ والتمويل، ثم مساعدتك في التأجير عبر إيجار."],
    ],
    processMore: "التفاصيل الكاملة لآلية العمل",
    areasTitle: `أحياء أعمل فيها في ${cfg.city.ar}`,
    areasLead: "لكل حي منطق استثماري مختلف. اقرأ تحليلي لكل حي ولمن يناسب.",
    areasMore: "كل الأحياء",
    calcTitle: "احسب العائد الحقيقي قبل أن تشتري",
    calcText: "حاسبة مجانية تحتسب ضريبة التصرفات العقارية، السعي، الشواغر، المصاريف، والتمويل — وتعطيك العائد الصافي والعائد على الكاش.",
    calcCta: "افتح حاسبة العائد",
    testimonialsTitle: "ماذا يقول المستثمرون",
    faqTitle: "أسئلة يسألها المستثمرون عادة",
    faq: [
      { q: "ما معنى أنك «تمثّل المشتري»؟", a: "يعني أنني أعمل لمصلحتك أنت بموجب عقد وساطة موثّق، لا لمصلحة البائع. هدفي أن تشتري بأقل سعر ممكن وبأعلى عائد، وأن أقول لك بصراحة إذا كانت الصفقة لا تستحق." },
      { q: "كم أتعابك ومتى أدفعها؟", a: "الأتعاب تُحدّد مسبقًا وكتابةً في عقد الوساطة وفق نظام الوساطة العقارية، وتُستحق عند إتمام الصفقة. الاستشارة الأولى مجانية وبدون أي التزام." },
      { q: "ما الحد الأدنى للميزانية؟", a: "أعمل مع ميزانيات مختلفة، من شقة أو أرض للاستثمار إلى عمائر ومحافظ. في المكالمة الأولى أقول لك بصراحة ما الذي يمكن تحقيقه بميزانيتك وما لا يمكن." },
      { q: "هل تساعد في التمويل العقاري؟", a: "نعم، أنسّق مع جهة التمويل التي تختارها وأتأكد أن التقييم وجدول الإفراغ متوافقان مع الصفقة. وأدخل تكلفة التمويل في تحليل العائد من البداية." },
      { q: "هل أستطيع الشراء وأنا خارج المدينة أو خارج المملكة؟", a: "نعم. أعاين نيابة عنك بتقرير مصوّر ومرئي، وأرسل لك ملف التحليل، ونُنجز الإجراءات عبر الوكالة الإلكترونية والمنصات الرسمية." },
    ],
  },
  en: {
    title: `Buyer's Agent in ${cfg.city.en} for Property Investors`,
    description: `Licensed (FAL) buyer's agent in ${cfg.city.en} for investors: sourcing, yield analysis, negotiation and closing on villas, land and income buildings. Free first consultation.`,
    eyebrow: `Licensed buyer's agent in ${cfg.city.en}`,
    h1: `I buy property for you <span>like an investor</span> — not like a salesman`,
    lead: "I represent you in the deal: I find the property that fits your goal, run the numbers before you commit a riyal, negotiate the price, and follow through to title transfer. Villas, land, income buildings and off-plan.",
    ctaCalc: "Calculate a property's return",
    trust: [
      [`Licensed by REGA — FAL ${cfg.falLicense}`, "shield"],
      ["Documented brokerage agreement, fees agreed upfront", "doc"],
      ["A written financial analysis for every property", "chart"],
    ],
    memo: {
      tag: "Illustrative example",
      title: "Deal memo",
      sub: "Residential building — North Riyadh",
      rows: [
        ["Asking price", "SAR 6,200,000"],
        ["Negotiated price", "SAR 5,750,000"],
        ["Gross annual rent", "SAR 468,000"],
        ["Net operating income", "SAR 397,800"],
      ],
      kpis: [["Net yield after costs", "6.4%"], ["Negotiation saving", "SAR 450k"]],
      verdict: "Recommendation: Buy — subject to roof & tank inspection",
    },
    problemsTitle: "Why many investors lose before they start",
    problemsLead: "The problem is rarely the market. It's how the property is bought.",
    problems: [
      ["The seller's agent doesn't work for you", "Most agents you call represent the seller. Their interest is the highest price and the fastest close — not your best deal."],
      ["Returns that only exist on paper", "Assumed rent without vacancy, maintenance, transaction tax or brokerage fees turns an expected 8% into a real 4%."],
      ["Prices that don't reflect the market", "Without comparing to actual registered transactions in the same district, you overpay — and wait years to earn it back."],
    ],
    servicesTitle: "How I serve investors",
    servicesLead: "One core job: help you buy the right property at the right price. It branches by your goal.",
    services: [
      ["building", "Income properties", "Residential buildings, rental apartments and retail — with real income and occupancy history analyzed."],
      ["land", "Land for holding or development", "Location, zoning, street width and growth analysis — to hold or to build."],
      ["key", "Villas & units for growth", "Units in districts with sustained demand — to rent, resell, or live in as an investment."],
      ["search", "Off-market deals", "Properties shared through owner and broker networks before they hit public listings."],
      ["handshake", "Negotiation & closing", "I negotiate for you, review documents and coordinate the seller and financing through transfer."],
      ["chart", "Portfolio review", "Already own property? I review performance and advise: hold, improve, or sell and redeploy."],
    ],
    compareTitle: "Seller's agent vs. buyer's agent",
    compareCols: ["", "Seller's agent", "Buyer's agent (me)"],
    compareRows: [
      ["Works for", "The seller", "You only"],
      ["Shows you", "Their own listings", "What fits your goal, market-wide"],
      ["On price", "Pushes it up", "Pushes it down"],
      ["Yield & cost analysis", "Rarely", "Written for every property"],
      ["Will tell you \"don't buy\"?", "No", "Yes, if the numbers don't work"],
    ],
    processTitle: "From first call to title transfer",
    process: [
      ["Goal session", "Budget, goal (income or growth), time horizon and risk appetite."],
      ["Search plan", "Target districts, property type and clear accept/reject criteria."],
      ["Shortlist with deal memos", "3–5 selected properties, each with numbers, comparables and risks."],
      ["Viewing & negotiation", "I view and negotiate for you, and verify the title deed and documents."],
      ["Closing & after", "Transfer and financing follow-up, then help leasing through Ejar."],
    ],
    processMore: "See the full process",
    areasTitle: `Districts I cover in ${cfg.city.en}`,
    areasLead: "Each district has a different investment logic. Read who each one suits.",
    areasMore: "All areas",
    calcTitle: "Know the real return before you buy",
    calcText: "A free calculator that accounts for real estate transaction tax, brokerage, vacancy, expenses and financing — giving you net yield and cash-on-cash return.",
    calcCta: "Open the ROI calculator",
    testimonialsTitle: "What investors say",
    faqTitle: "Questions investors usually ask",
    faq: [
      { q: "What does \"buyer's agent\" mean?", a: "It means I work in your interest under a documented brokerage agreement — not the seller's. My goal is for you to pay the lowest possible price for the best return, and to tell you honestly when a deal isn't worth it." },
      { q: "What are your fees and when do I pay?", a: "Fees are agreed upfront in writing in the brokerage agreement, per the Saudi Real Estate Brokerage Law, and are due when the deal closes. The first consultation is free with no obligation." },
      { q: "Is there a minimum budget?", a: "I work with a range of budgets — from a single apartment or plot to buildings and portfolios. On the first call I'll tell you honestly what your budget can and can't achieve." },
      { q: "Do you help with financing?", a: "Yes. I coordinate with your chosen lender so the valuation and transfer timeline fit the deal, and I include financing costs in the return analysis from day one." },
      { q: "Can I buy while living in another city or abroad?", a: "Yes. I view properties on your behalf with photo and video reports, send you the deal memo, and complete the process via e-power of attorney and official platforms." },
    ],
  },
};

export default function home(lang) {
  const c = C[lang];
  const p = prefix(lang);
  const areas = AREAS.slice(0, 6);

  const testimonials = cfg.testimonials.length
    ? `<section class="section"><div class="wrap"><h2 class="section-title">${c.testimonialsTitle}</h2><div class="grid grid-3">${cfg.testimonials
        .map((r) => `<figure class="quote"><blockquote>${esc(T(lang, r.quote))}</blockquote><figcaption><strong>${esc(r.name)}</strong><span>${esc(T(lang, r.detail))}</span></figcaption></figure>`)
        .join("")}</div></div></section>`
    : "";

  const stats = cfg.stats.length
    ? `<div class="stats">${cfg.stats.map((s) => `<div><strong>${esc(s.value)}</strong><span>${esc(T(lang, s.label))}</span></div>`).join("")}</div>`
    : "";

  const body = `
<section class="hero">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <p class="eyebrow">${c.eyebrow}</p>
      <h1>${c.h1}</h1>
      <p class="lead">${c.lead}</p>
      <div class="hero-actions">
        ${waBtn(lang, null, lang === "ar" ? "استشارة مجانية عبر واتساب" : "Free consultation on WhatsApp")}
        ${btn(url(p + "/tools/roi-calculator/"), `${icon("calc")}<span>${c.ctaCalc}</span>`, "btn-ghost")}
      </div>
      <ul class="trust">${c.trust.map(([t, i]) => `<li>${icon(i)}<span>${t}</span></li>`).join("")}</ul>
    </div>
    <aside class="memo" aria-label="${c.memo.title}">
      <div class="memo-head"><span class="memo-tag">${c.memo.tag}</span><strong>${c.memo.title}</strong><small>${c.memo.sub}</small></div>
      <dl>${c.memo.rows.map(([k, v], i) => `<div${i === 1 ? ' class="hl"' : ""}><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
      <div class="memo-kpis">${c.memo.kpis.map(([k, v]) => `<div><span>${k}</span><strong>${v}</strong></div>`).join("")}</div>
      <p class="memo-verdict">${icon("check")} ${c.memo.verdict}</p>
    </aside>
  </div>
  ${stats ? `<div class="wrap">${stats}</div>` : ""}
</section>

<section class="section">
  <div class="wrap">
    <h2 class="section-title">${c.problemsTitle}</h2>
    <p class="section-lead">${c.problemsLead}</p>
    <div class="grid grid-3">
      ${c.problems.map(([t, d], i) => `<article class="card card-problem"><span class="num">0${i + 1}</span><h3>${t}</h3><p>${d}</p></article>`).join("")}
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    <h2 class="section-title">${c.servicesTitle}</h2>
    <p class="section-lead">${c.servicesLead}</p>
    <div class="grid grid-3">
      ${c.services.map(([i, t, d]) => `<article class="card"><div class="card-icon">${icon(i)}</div><h3>${t}</h3><p>${d}</p></article>`).join("")}
    </div>
    <p class="center">${btn(url(p + "/services/"), `<span>${lang === "ar" ? "تفاصيل الخدمات" : "Service details"}</span>${icon("arrow")}`, "btn-link")}</p>
  </div>
</section>

<section class="section">
  <div class="wrap narrow">
    <h2 class="section-title">${c.compareTitle}</h2>
    <div class="table-wrap">
      <table class="compare">
        <thead><tr>${c.compareCols.map((h, i) => `<th${i === 2 ? ' class="us"' : ""} scope="col">${h}</th>`).join("")}</tr></thead>
        <tbody>${c.compareRows.map(([a, b, d]) => `<tr><th scope="row">${a}</th><td>${b}</td><td class="us">${d}</td></tr>`).join("")}</tbody>
      </table>
    </div>
  </div>
</section>

<section class="section section-dark">
  <div class="wrap">
    <h2 class="section-title">${c.processTitle}</h2>
    <ol class="steps">
      ${c.process.map(([t, d]) => `<li><h3>${t}</h3><p>${d}</p></li>`).join("")}
    </ol>
    <p class="center">${btn(url(p + "/how-it-works/"), `<span>${c.processMore}</span>${icon("arrow")}`, "btn-link btn-link-light")}</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <h2 class="section-title">${c.areasTitle}</h2>
    <p class="section-lead">${c.areasLead}</p>
    <div class="grid grid-3">
      ${areas
        .map((a) => {
          const href = lang === "ar" ? `/areas/${a.slug}/` : `/en/areas/#${a.slug}`;
          return `<a class="card card-link area-card" href="${url(href)}"><span class="area-tag">${T(lang, a.zone)}</span><h3>${T(lang, a.name)}</h3><p>${T(lang, a.short)}</p><span class="more">${icon("arrow")}</span></a>`;
        })
        .join("")}
    </div>
    <p class="center">${btn(url(p + "/areas/"), `<span>${c.areasMore}</span>${icon("arrow")}`, "btn-link")}</p>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap split">
    <div>
      <h2>${c.calcTitle}</h2>
      <p class="section-lead">${c.calcText}</p>
      ${btn(url(p + "/tools/roi-calculator/"), `${icon("calc")}<span>${c.calcCta}</span>`, "btn-primary")}
    </div>
    <div class="calc-teaser" aria-hidden="true">
      <div><span>${lang === "ar" ? "العائد الإجمالي" : "Gross yield"}</span><strong>8.1%</strong></div>
      <div><span>${lang === "ar" ? "العائد الصافي" : "Net yield"}</span><strong>6.2%</strong></div>
      <div><span>${lang === "ar" ? "العائد على الكاش" : "Cash-on-cash"}</span><strong>7.4%</strong></div>
    </div>
  </div>
</section>

${testimonials}

<section class="section">
  <div class="wrap narrow">
    <h2 class="section-title">${c.faqTitle}</h2>
    ${faqBlock(c.faq)}
  </div>
</section>

${ctaBand(lang)}
`;

  return {
    key: "home",
    lang,
    path: p + "/",
    title: c.title,
    description: c.description,
    priority: 1.0,
    body,
    schema: [
      agentSchema(lang),
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": abs("/#website"),
        url: abs(p + "/"),
        name: T(lang, cfg.brand),
        inLanguage: lang === "ar" ? "ar-SA" : "en",
        publisher: { "@id": abs("/#agent") },
      },
      faqSchema(c.faq),
    ],
  };
}
