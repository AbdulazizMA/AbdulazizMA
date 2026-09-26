import { cfg, url, icon, faqBlock, faqSchema, ctaBand, agentId, esc, abs } from "../lib.mjs";

const C = {
  ar: {
    title: "حاسبة العائد على الاستثمار العقاري — العائد الإيجاري الصافي",
    description: "حاسبة مجانية للعائد الإيجاري في السعودية: تحتسب ضريبة التصرفات العقارية ٥٪، السعي، الشواغر، المصاريف، والتمويل — وتعطيك العائد الإجمالي والصافي والعائد على الكاش.",
    h1: "حاسبة العائد على الاستثمار العقاري",
    lead: "اعرف العائد الحقيقي لأي عقار قبل الشراء — بعد ضريبة التصرفات والسعي والشواغر والمصاريف والتمويل. الأرقام تتحدّث فورًا.",
    g1: "الشراء",
    price: "سعر الشراء (ر.س)",
    rett: "أتحمّل ضريبة التصرفات العقارية (٥٪)",
    brokerage: "السعي (٪ من السعر)",
    vat: "إضافة ضريبة القيمة المضافة ١٥٪ على السعي",
    other: "تكاليف أخرى: تجهيز، فحص، رسوم (ر.س)",
    g2: "الدخل والمصاريف",
    rent: "الإيجار السنوي المتوقع (ر.س)",
    vacancy: "نسبة الشواغر / عدم التحصيل (٪)",
    opex: "المصاريف التشغيلية (٪ من الإيجار)",
    opexHint: "صيانة، إدارة، كهرباء الخدمات، تأمين",
    g3: "التمويل (اختياري)",
    ltv: "نسبة التمويل من السعر (٪)",
    rate: "نسبة الربح السنوية (٪)",
    term: "مدة التمويل (سنوات)",
    r: {
      total: "التكلفة الإجمالية للشراء",
      gross: "العائد الإجمالي",
      noi: "صافي الدخل التشغيلي السنوي",
      net: "العائد الصافي (على التكلفة الكاملة)",
      debt: "القسط السنوي للتمويل",
      cash: "الكاش المطلوب منك",
      cf: "التدفق النقدي السنوي بعد القسط",
      coc: "العائد على الكاش",
      payback: "فترة استرداد الكاش",
      years: "سنة",
    },
    send: "أرسل النتيجة لي لمراجعتها",
    disclaimer: "النتائج تقديرية لأغراض المقارنة ولا تُعد توصية استثمارية. تحقق من الأنظمة والرسوم السارية.",
    sr: "النتائج",
  },
  en: {
    title: "Property Investment ROI Calculator — Net Rental Yield (Saudi Arabia)",
    description: "Free Saudi rental yield calculator including 5% transaction tax, brokerage, vacancy, expenses and financing — see gross, net and cash-on-cash return.",
    h1: "Property Investment ROI Calculator",
    lead: "Know the real return on any property before you buy — after transaction tax, brokerage, vacancy, expenses and financing. Results update instantly.",
    g1: "Purchase",
    price: "Purchase price (SAR)",
    rett: "I pay Real Estate Transaction Tax (5%)",
    brokerage: "Brokerage (% of price)",
    vat: "Add 15% VAT on brokerage",
    other: "Other costs: fit-out, inspection, fees (SAR)",
    g2: "Income & expenses",
    rent: "Expected annual rent (SAR)",
    vacancy: "Vacancy / non-collection (%)",
    opex: "Operating expenses (% of rent)",
    opexHint: "Maintenance, management, common utilities, insurance",
    g3: "Financing (optional)",
    ltv: "Financing as % of price",
    rate: "Annual profit rate (%)",
    term: "Term (years)",
    r: {
      total: "Total acquisition cost",
      gross: "Gross yield",
      noi: "Annual net operating income",
      net: "Net yield (on total cost)",
      debt: "Annual financing payment",
      cash: "Cash you put in",
      cf: "Annual cash flow after payments",
      coc: "Cash-on-cash return",
      payback: "Cash payback period",
      years: "years",
    },
    send: "Send me these results for review",
    disclaimer: "Estimates for comparison purposes only — not investment advice. Verify current regulations and fees.",
    sr: "Results",
  },
};

const GUIDE = {
  ar: `
<h2>كيف تقرأ النتائج؟</h2>
<h3>العائد الإجمالي</h3>
<p>الإيجار السنوي مقسومًا على سعر الشراء. هذا الرقم الذي يُذكر عادة في الإعلانات، وهو <strong>مضلّل</strong> لأنه يتجاهل كل التكاليف.</p>
<h3>صافي الدخل التشغيلي (NOI)</h3>
<p>الإيجار بعد خصم الشواغر والمصاريف التشغيلية. هذا ما يدخل جيبك فعلًا قبل التمويل.</p>
<h3>العائد الصافي</h3>
<p>صافي الدخل التشغيلي مقسومًا على <strong>التكلفة الكاملة</strong> للشراء (السعر + ضريبة التصرفات + السعي + التكاليف الأخرى). هذا الرقم الذي تقارن به عقارًا بعقار.</p>
<h3>العائد على الكاش</h3>
<p>إذا اشتريت بتمويل، هذا هو العائد على المال الذي دفعته من جيبك. التمويل يرفعه إذا كان العائد الصافي أعلى من تكلفة التمويل — ويخفضه إذا كان أقل.</p>
<h2>مثال سريع</h2>
<p>شقة بسعر ١٬٠٠٠٬٠٠٠ ريال وإيجار ٧٠٬٠٠٠ ريال سنويًا: العائد الإجمالي ٧٪. لكن بعد ضريبة تصرفات ٥٪، وسعي ٢٫٥٪ مع ضريبة القيمة المضافة، وشواغر ٥٪، ومصاريف ١٠٪، ينخفض العائد الصافي إلى نحو ٥٫٥٪. الفرق بين الرقمين هو الفرق بين صفقة «ممتازة» في الإعلان وصفقة «عادية» في الواقع.</p>`,
  en: `
<h2>How to read the results</h2>
<h3>Gross yield</h3>
<p>Annual rent divided by purchase price. It's the number listings quote — and it's <strong>misleading</strong> because it ignores every cost.</p>
<h3>Net operating income (NOI)</h3>
<p>Rent after vacancy and operating expenses. What actually reaches your pocket before financing.</p>
<h3>Net yield</h3>
<p>NOI divided by the <strong>total acquisition cost</strong> (price + transaction tax + brokerage + other costs). The number to compare property against property.</p>
<h3>Cash-on-cash return</h3>
<p>If you buy with financing, this is the return on the cash you put in. Financing lifts it when net yield exceeds the financing cost — and drags it down when it doesn't.</p>
<h2>Quick example</h2>
<p>An apartment at SAR 1,000,000 renting for SAR 70,000/year: gross yield 7%. After 5% transaction tax, 2.5% brokerage plus VAT, 5% vacancy and 10% expenses, net yield falls to about 5.5%. That gap is the difference between an "excellent" deal on a listing and an "ordinary" one in reality.</p>`,
};

const FAQS = {
  ar: [
    { q: "كيف أحسب العائد الإيجاري للعقار؟", a: "العائد الإجمالي = الإيجار السنوي ÷ سعر الشراء × ١٠٠. أما العائد الصافي فهو (الإيجار − الشواغر − المصاريف) ÷ (السعر + ضريبة التصرفات + السعي + التكاليف الأخرى) × ١٠٠، وهو الأدق للمقارنة." },
    { q: "ما نسبة المصاريف التشغيلية المعقولة؟", a: "تختلف حسب نوع العقار وعمره: الوحدات الحديثة قد تكون ٥–١٠٪ من الإيجار، والعمائر القديمة أو التي تحتاج إدارة وحراسة قد تتجاوز ١٥–٢٠٪. استخدم أرقامًا متحفظة." },
    { q: "هل تدخل ضريبة التصرفات العقارية في حساب العائد؟", a: "نعم إذا كنت ستتحملها، لأنها جزء من تكلفة الشراء الفعلية. في الحاسبة يمكنك تفعيلها أو إلغاؤها حسب الاتفاق مع البائع أو في حال الإعفاء." },
  ],
  en: [
    { q: "How do I calculate rental yield?", a: "Gross yield = annual rent ÷ purchase price × 100. Net yield = (rent − vacancy − expenses) ÷ (price + transaction tax + brokerage + other costs) × 100 — the more accurate figure for comparisons." },
    { q: "What operating expense ratio is reasonable?", a: "It varies with property type and age: newer units may run 5–10% of rent, while older buildings needing management and security can exceed 15–20%. Use conservative numbers." },
    { q: "Should transaction tax be included in the return?", a: "Yes, if you're paying it — it's part of your real acquisition cost. The calculator lets you toggle it depending on your agreement with the seller or any exemption." },
  ],
};

export default function calculator() {
  return ["ar", "en"].map((lang) => {
    const c = C[lang];
    const p = lang === "ar" ? "" : "/en";
    const num = (name, label, value, extra = "") =>
      `<label>${label}<input type="number" name="${name}" value="${value}" inputmode="decimal" min="0" ${extra} dir="ltr"></label>`;
    const out = (k, cls = "") => `<div class="out ${cls}"><span>${c.r[k]}</span><output data-k="${k}">—</output></div>`;
    const body = `
<section class="page-hero">
  <div class="wrap narrow">
    <h1>${c.h1}</h1>
    <p class="lead">${c.lead}</p>
  </div>
</section>
<section class="section section-tight">
  <div class="wrap calc" id="roi" data-lang="${lang}" data-wa="${esc(cfg.whatsapp)}" data-labels='${esc(JSON.stringify(c.r))}'>
    <form class="calc-form" onsubmit="return false">
      <fieldset><legend>${icon("key")} ${c.g1}</legend>
        ${num("price", c.price, 1000000, 'step="10000"')}
        <label class="check"><input type="checkbox" name="rett" checked> ${c.rett}</label>
        ${num("brokerage", c.brokerage, 2.5, 'step="0.1" max="10"')}
        <label class="check"><input type="checkbox" name="vat" checked> ${c.vat}</label>
        ${num("other", c.other, 0, 'step="1000"')}
      </fieldset>
      <fieldset><legend>${icon("building")} ${c.g2}</legend>
        ${num("rent", c.rent, 70000, 'step="1000"')}
        ${num("vacancy", c.vacancy, 5, 'step="1" max="100"')}
        ${num("opex", c.opex, 10, 'step="1" max="100"')}
        <small class="hint">${c.opexHint}</small>
      </fieldset>
      <fieldset><legend>${icon("chart")} ${c.g3}</legend>
        ${num("ltv", c.ltv, 0, 'step="5" max="90"')}
        ${num("rate", c.rate, 5.5, 'step="0.1" max="30"')}
        ${num("term", c.term, 20, 'step="1" max="30"')}
      </fieldset>
    </form>
    <div class="calc-sticky" aria-hidden="true"><span>${c.r.net}</span><strong data-mirror="net">—</strong></div>
    <div class="calc-results" aria-live="polite" aria-label="${c.sr}">
      <div class="out-hero">${out("net", "big")}${out("gross")}</div>
      ${out("total")}${out("noi")}
      <div class="fin-only">${out("debt")}${out("cash")}${out("cf")}${out("coc", "big")}</div>
      ${out("payback")}
      <a class="btn btn-wa btn-block" id="roi-send" href="#" target="_blank" rel="noopener" data-track="whatsapp-calc">${icon("whatsapp")}<span>${c.send}</span></a>
      <p class="note">${c.disclaimer}</p>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap narrow prose">
    ${GUIDE[lang]}
    <h2>${lang === "ar" ? "أسئلة عن حساب العائد" : "Yield calculation FAQ"}</h2>
    ${faqBlock(FAQS[lang])}
    ${lang === "ar" ? `<p>اقرأ أيضًا: <a href="${url("/guides/how-to-calculate-rental-yield/")}">دليل حساب العائد الإيجاري بالتفصيل</a> و<a href="${url("/guides/property-buying-costs-saudi-arabia/")}">كل تكاليف شراء العقار في السعودية</a>.</p>` : ""}
  </div>
</section>
${ctaBand(lang, lang === "ar" ? "الأرقام مشجّعة؟ خلّني أتحقق منها." : "Numbers look good? Let me verify them.", lang === "ar" ? "أرسل لي تفاصيل العقار، وأراجع الإيجار والتكاليف والسعر مقابل صفقات فعلية في نفس الحي." : "Send me the property details and I'll check the rent, costs and price against actual transactions in the same district.")}`;
    return {
      key: "calc",
      lang,
      path: p + "/tools/roi-calculator/",
      title: c.title,
      description: c.description,
      crumbs: [{ name: lang === "ar" ? "حاسبة العائد" : "ROI Calculator", path: p + "/tools/roi-calculator/" }],
      priority: 0.9,
      body,
      schema: [
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: c.h1,
          url: abs(p + "/tools/roi-calculator/"),
          applicationCategory: "FinanceApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "SAR" },
          provider: { "@id": agentId },
          inLanguage: lang === "ar" ? "ar-SA" : "en",
        },
        faqSchema(FAQS[lang]),
      ],
    };
  });
}
