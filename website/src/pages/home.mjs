import { cfg, T, url, prefix, icon, btn, waBtn, faqBlock, faqSchema, ctaBand, agentSchema, abs, esc, CITIES, citiesText, feeText, licenseLine, skyline, kicker, arrowLink, toArDigits } from "../lib.mjs";
import { DISTRICTS, CITY_INFO } from "./cities-data.mjs";
import { GUIDES } from "./guides.mjs";

const C = {
  ar: {
    title: `وسيط عقاري في ${citiesText("ar")} للمستثمرين — شراء عقار بعائد مدروس`,
    description: `وسيط عقاري مرخّص في ${citiesText("ar")} يمثّل المستثمر لا البائع: بحث عن عمائر وأراضٍ وفلل، تحليل العائد بالأرقام، تفاوض، ومتابعة حتى الإفراغ. أتعاب ${feeText("ar")} عند الإفراغ فقط.`,
    kicker: `وسيط عقاري مرخّص · ${CITIES.map((c) => c.ar).join(" · ")}`,
    h1: `أمثّل المستثمر.<br><em>لا البائع.</em>`,
    lead: "أبحث لك عن العقار المناسب لهدفك، أحلّل العائد الحقيقي قبل أن تدفع ريالًا، أفاوض على السعر نيابة عنك، وأتابع حتى الإفراغ.",
    ctaWa: "استشارة مجانية عبر واتساب",
    ctaCalc: "احسب عائد عقار",
    trust: [licenseLine("ar"), "عقد وساطة موثّق", `أتعاب ${feeText("ar")} عند الإفراغ فقط`],
    rc: {
      head: "اختبار الواقع — جرّبه الآن",
      price: "سعر العقار (ر.س)",
      rent: "الإيجار السنوي (ر.س)",
      gross: "العائد كما في الإعلان",
      net: "عائدك الحقيقي",
      foot: "بعد ضريبة التصرفات ٥٪، السعي ٢٫٥٪، شواغر ٥٪ ومصاريف ١٠٪.",
      more: "التحليل الكامل",
    },
    gapK: "لماذا يخسر المستثمرون",
    gapH: "الفرق بين عقار جيد وصفقة جيدة<br>هو <em>السعر والأرقام</em>.",
    gap: [
      ["مسوّق البائع لا يعمل لك", "أغلب من تتواصل معهم يمثّلون البائع؛ مصلحتهم أعلى سعر وأسرع إغلاق — لا أفضل صفقة لك."],
      ["عائد «على الورق»", "إيجار مفترض بدون الشواغر والصيانة والضريبة والسعي؛ فتتحوّل ٨٪ المتوقعة إلى ٥٪ فعليًا."],
      ["سعر لا يعكس السوق", "بدون مقارنة بصفقات مسجّلة فعلية في نفس الحي، تدفع زيادة لا تستردها إلا بعد سنوات."],
    ],
    servK: "الخدمات",
    servH: "خدمة واحدة في جوهرها:<br>أن تشتري <em>الصحيح</em> بالسعر <em>الصحيح</em>.",
    services: [
      ["building", "عقارات مدرّة للدخل", "عمائر وشقق ومحلات — مع تحليل الدخل الفعلي من عقود إيجار وسجل التحصيل، لا الإيجار «المتوقع».", "income"],
      ["land", "أراضٍ للاستثمار والتطوير", "المخطط، الاستخدام، عرض الشارع، والمقارنة بصفقات مسجّلة.", "land"],
      ["key", "فلل ووحدات للنمو", "أحياء بطلب مستمر، وجودة بناء مفحوصة.", "growth"],
      ["doc", "مشاريع على الخارطة", "ترخيص وافي، سجل المطوّر، وقراءة العقد.", "offplan"],
      ["search", "صفقات خارج المنصات", "عروض عبر شبكة الملاك قبل وصولها للإعلانات.", "offmarket"],
      ["chart", "مراجعة المحفظة", "احتفظ، حسّن، أو بِع وأعد التوزيع — بالأرقام.", "portfolio"],
    ],
    vsK: "الفرق",
    vsH: "مسوّق البائع مقابل ممثّل المشتري",
    vsThem: "مسوّق البائع",
    vsUs: "ممثّل المشتري — أنا",
    vs: [
      ["يعمل لصالح البائع", "يعمل لصالحك أنت فقط"],
      ["يعرض ما لديه من عروض", "يبحث في السوق كله عمّا يناسب هدفك"],
      ["مصلحته رفع السعر", "مصلحته خفض السعر"],
      ["نادرًا ما يحلّل العائد", "ملف تحليل مكتوب لكل عقار"],
      ["لن يقول لك «لا تشترِ»", "يقولها بصراحة إذا الأرقام لا تستحق"],
    ],
    citiesK: "المدن",
    citiesH: "أعمل في أكبر سوقين في المملكة",
    cityMore: "استكشف",
    districts: "أحياء",
    stepsK: "آلية العمل",
    stepsH: "من أول مكالمة حتى الإفراغ",
    steps: [
      ["جلسة تحديد الهدف", "ميزانيتك، هدفك (دخل أم نمو)، أفقك الزمني، والتمويل. مجانية."],
      ["عقد وساطة وخطة بحث", "عقد موثّق، ومعايير واضحة للقبول والرفض."],
      ["ترشيحات مع ملفات تحليل", "٣–٥ عقارات مختارة، لكل منها أرقام ومقارنات ومخاطر."],
      ["المعاينة والتفاوض", "أعاين وأتحقق من الصك وأفاوض نيابة عنك."],
      ["الإغلاق وما بعده", "متابعة الإفراغ والتمويل، ثم المساعدة في التأجير عبر إيجار."],
    ],
    stepsMore: "التفاصيل الكاملة لآلية العمل",
    feeK: "الأتعاب",
    feeH: "أتعاب واحدة، واضحة، ومكتوبة.",
    feeSub: "من قيمة العقار",
    fee: ["تُستحق عند الإفراغ فقط — لا دفعات مقدّمة", "الاستشارة الأولى مجانية وبدون التزام", "عقد وساطة موثّق يحدد كل شيء مسبقًا", "لا تشتري؟ لا تدفع شيئًا"],
    feeNote: "هدفي في كل صفقة أن يغطي ما أوفّره لك في التفاوض أتعابي — وأكثر.",
    guidesK: "أدلة المستثمر",
    guidesH: "اقرأ قبل أن تشتري",
    guidesMore: "كل الأدلة",
    testiK: "آراء المستثمرين",
    faqK: "أسئلة شائعة",
    faqH: "قبل أن تتواصل",
    faq: [
      { q: "ما معنى أنك «تمثّل المشتري»؟", a: "يعني أنني أعمل لمصلحتك أنت بموجب عقد وساطة موثّق، لا لمصلحة البائع. هدفي أن تشتري بأقل سعر ممكن وبأعلى عائد، وأن أقول لك بصراحة إذا كانت الصفقة لا تستحق." },
      { q: "كم أتعابك ومتى أدفعها؟", a: `أتعابي ${feeText("ar")} من قيمة العقار، مكتوبة في عقد الوساطة، وتُستحق عند إتمام الصفقة والإفراغ فقط. الاستشارة الأولى مجانية.` },
      { q: "في أي مدن تعمل؟", a: `أعمل في ${citiesText("ar")}، وأقارن لك بين فرص المدينتين إن كنت مرنًا في الموقع.` },
      { q: "ما الحد الأدنى للميزانية؟", a: "أعمل مع ميزانيات مختلفة، من شقة أو أرض إلى عمائر ومحافظ. في المكالمة الأولى أقول لك بصراحة ما يمكن تحقيقه بميزانيتك." },
      { q: "هل أستطيع الشراء وأنا خارج المدينة؟", a: "نعم. أعاين نيابة عنك بتقرير مصوّر ومرئي، وأرسل لك ملف التحليل، وتتم الإجراءات عبر الوكالة الإلكترونية والمنصات الرسمية." },
    ],
  },
  en: {
    title: `Buyer's Agent in ${citiesText("en")} for Property Investors`,
    description: `Licensed buyer's agent in ${citiesText("en")} for investors: sourcing, yield analysis, negotiation and closing on buildings, land and villas. ${feeText("en")} fee, paid only at closing.`,
    kicker: `Licensed buyer's agent · ${CITIES.map((c) => c.en).join(" · ")}`,
    h1: `I represent the investor.<br><em>Not the seller.</em>`,
    lead: "I find the property that fits your goal, calculate the real return before you commit a riyal, negotiate the price on your behalf, and follow through to title transfer.",
    ctaWa: "Free consultation on WhatsApp",
    ctaCalc: "Calculate a return",
    trust: [licenseLine("en"), "Documented brokerage agreement", `${feeText("en")} fee, paid only at closing`],
    rc: {
      head: "Reality check — try it",
      price: "Property price (SAR)",
      rent: "Annual rent (SAR)",
      gross: "Yield as advertised",
      net: "Your real yield",
      foot: "After 5% transaction tax, 2.5% brokerage, 5% vacancy and 10% expenses.",
      more: "Full analysis",
    },
    gapK: "Why investors lose",
    gapH: "The difference between a good property and a good deal<br>is <em>price and numbers</em>.",
    gap: [
      ["The seller's agent doesn't work for you", "Most agents you reach represent the seller: highest price, fastest close — not your best deal."],
      ["Returns on paper only", "Assumed rent without vacancy, maintenance, tax or brokerage turns an expected 8% into a real 5%."],
      ["Prices that don't reflect the market", "Without comparing to registered transactions in the same district, you overpay — and wait years to earn it back."],
    ],
    servK: "Services",
    servH: "One core job:<br>buy the <em>right</em> property at the <em>right</em> price.",
    services: [
      ["building", "Income properties", "Buildings, apartments and retail — with real income analyzed from leases and collection history, not \"expected\" rent.", "income"],
      ["land", "Land for holding or development", "Plan, permitted use, street width and registered comparables.", "land"],
      ["key", "Villas & units for growth", "Districts with sustained demand and inspected build quality.", "growth"],
      ["doc", "Off-plan projects", "Wafi licensing, developer track record and contract review.", "offplan"],
      ["search", "Off-market deals", "Owner-network deals before they reach listings.", "offmarket"],
      ["chart", "Portfolio review", "Hold, improve, or sell and redeploy — by the numbers.", "portfolio"],
    ],
    vsK: "The difference",
    vsH: "Seller's agent vs. buyer's agent",
    vsThem: "Seller's agent",
    vsUs: "Buyer's agent — me",
    vs: [
      ["Works for the seller", "Works for you only"],
      ["Shows their own listings", "Searches the whole market for your goal"],
      ["Benefits from a higher price", "Benefits from a lower price"],
      ["Rarely analyzes returns", "A written analysis for every property"],
      ["Won't tell you \"don't buy\"", "Says it plainly when the numbers don't work"],
    ],
    citiesK: "Cities",
    citiesH: "Working in the Kingdom's two largest markets",
    cityMore: "Explore",
    districts: "districts",
    stepsK: "Process",
    stepsH: "From first call to title transfer",
    steps: [
      ["Goal session", "Budget, goal (income or growth), horizon and financing. Free."],
      ["Agreement & search plan", "A documented agreement and clear accept/reject criteria."],
      ["Shortlist with deal memos", "3–5 selected properties, each with numbers, comparables and risks."],
      ["Viewing & negotiation", "I view, verify the deed and negotiate for you."],
      ["Closing & after", "Transfer and financing follow-up, then leasing via Ejar."],
    ],
    stepsMore: "See the full process",
    feeK: "Fees",
    feeH: "One fee. Clear, and in writing.",
    feeSub: "of the property price",
    fee: ["Due only at closing — nothing upfront", "First consultation free, no obligation", "A documented brokerage agreement sets everything upfront", "Don't buy? Don't pay"],
    feeNote: "In every deal, my aim is for what I save you in negotiation to cover my fee — and more.",
    guidesK: "Investor guides",
    guidesH: "Read before you buy",
    guidesMore: "All guides (Arabic)",
    testiK: "What investors say",
    faqK: "FAQ",
    faqH: "Before you get in touch",
    faq: [
      { q: "What does \"buyer's agent\" mean?", a: "I work in your interest under a documented brokerage agreement — not the seller's. My goal is the lowest possible price for the best return, and honesty when a deal isn't worth it." },
      { q: "What is your fee and when do I pay?", a: `${feeText("en")} of the property price, written into the brokerage agreement and due only when the deal closes. The first consultation is free.` },
      { q: "Which cities do you cover?", a: `${citiesText("en")} — and I'll compare opportunities across both if you're flexible on location.` },
      { q: "Is there a minimum budget?", a: "I work with a range of budgets, from a single apartment or plot to buildings and portfolios. On the first call I'll tell you honestly what your budget can achieve." },
      { q: "Can I buy from another city?", a: "Yes. I view on your behalf with photo and video reports, send the deal memo, and complete the process via e-power of attorney and official platforms." },
    ],
  },
};

const pct = (n) => n.toFixed(1) + "%";

export default function home(lang) {
  const c = C[lang];
  const ar = lang === "ar";
  const p = prefix(lang);
  const gross = 7;
  const net = ((70000 * 0.85) / (1000000 * 1.07875)) * 100;

  const testimonials = cfg.testimonials.length
    ? `<section class="section"><div class="wrap">${kicker(c.testiK)}<div class="d-grid">${cfg.testimonials
        .map((r) => `<figure class="quote" data-reveal><blockquote>${esc(T(lang, r.quote))}</blockquote><figcaption><strong>${esc(r.name)}</strong><span>${esc(T(lang, r.detail))}</span></figcaption></figure>`)
        .join("")}</div></div></section>`
    : "";
  const stats = cfg.stats.length
    ? `<div class="stats">${cfg.stats.map((s) => `<div><strong>${esc(s.value)}</strong><span>${esc(T(lang, s.label))}</span></div>`).join("")}</div>`
    : "";
  const num = (i) => "0" + (i + 1);

  const body = `
<section class="hero pattern">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      ${kicker(c.kicker, true)}
      <h1>${c.h1}</h1>
      <p class="lead">${c.lead}</p>
      <div class="hero-actions">
        ${waBtn(lang, null, c.ctaWa, "btn-wa btn-lg")}
        ${btn(url(p + "/tools/roi-calculator/"), `${icon("calc")}<span>${c.ctaCalc}</span>`, "btn-outline-light btn-lg")}
      </div>
      <ul class="hero-trust">${c.trust.map((t) => `<li>${icon("check")}<span>${t}</span></li>`).join("")}</ul>
    </div>
    <form class="reality" id="reality" data-lang="${lang}" onsubmit="return false" aria-label="${c.rc.head}">
      <p class="rc-head"><span class="rc-dot"></span>${c.rc.head}</p>
      <div class="rc-inputs">
        <label>${c.rc.price}<input name="price" type="number" inputmode="numeric" value="1000000" step="10000" min="0" dir="ltr"></label>
        <label>${c.rc.rent}<input name="rent" type="number" inputmode="numeric" value="70000" step="1000" min="0" dir="ltr"></label>
      </div>
      <div class="rc-row"><div class="rc-label"><span>${c.rc.gross}</span><output data-rc="gross">${pct(gross, lang)}</output></div><div class="rc-bar"><i data-bar="gross" style="width:100%"></i></div></div>
      <div class="rc-row rc-real"><div class="rc-label"><span>${c.rc.net}</span><output data-rc="net">${pct(net, lang)}</output></div><div class="rc-bar"><i data-bar="net" style="width:${((net / gross) * 100).toFixed(0)}%"></i></div></div>
      <p class="rc-foot">${c.rc.foot}</p>
      <a class="rc-more" href="${url(p + "/tools/roi-calculator/")}"><span>${c.rc.more}</span>${icon("arrow")}</a>
    </form>
  </div>
  ${stats ? `<div class="wrap">${stats}</div>` : ""}
</section>

<section class="section">
  <div class="wrap">
    ${kicker(c.gapK)}
    <h2 class="h-display" data-reveal>${c.gapH}</h2>
    <div class="gap-grid">
      ${c.gap.map(([t, d], i) => `<article data-reveal><span class="num">${num(i)}</span><h3>${t}</h3><p>${d}</p></article>`).join("")}
    </div>
  </div>
</section>

<section class="section section-sand">
  <div class="wrap">
    <div class="section-head">
      <div>${kicker(c.servK)}<h2 class="h-display">${c.servH}</h2></div>
      ${arrowLink(url(p + "/services/"), ar ? "تفاصيل الخدمات" : "Service details")}
    </div>
    <div class="bento">
      ${c.services
        .map(([i, t, d, id], n) => `<a class="bento-item${n === 0 ? " bento-feature pattern" : ""}" href="${url(p + "/services/#" + id)}" data-reveal><span class="b-icon">${icon(i)}</span><h3>${t}</h3><p>${d}</p><span class="b-go">${icon("arrow")}</span></a>`)
        .join("")}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${kicker(c.vsK)}
    <h2 class="h-display" data-reveal>${c.vsH}</h2>
    <div class="vs">
      <div class="vs-col vs-them" data-reveal><h3>${c.vsThem}</h3><ul>${c.vs.map(([a]) => `<li>${icon("x")}<span>${a}</span></li>`).join("")}</ul></div>
      <div class="vs-col vs-us pattern" data-reveal><h3>${c.vsUs}</h3><ul>${c.vs.map(([, b]) => `<li>${icon("check")}<span>${b}</span></li>`).join("")}</ul></div>
    </div>
  </div>
</section>

<section class="section section-ink pattern">
  <div class="wrap">
    ${kicker(c.citiesK, true)}
    <h2 class="h-display">${c.citiesH}</h2>
    <div class="cities">
      ${CITIES.map((city) => {
        const ds = DISTRICTS[city.slug];
        return `<a class="city-card" href="${url(`${p}/${city.slug}/`)}" data-reveal>
          <div class="city-top"><h3>${T(lang, city)}</h3><span class="city-count">${ar ? toArDigits(ds.length) : ds.length} ${c.districts}</span></div>
          <p>${T(lang, CITY_INFO[city.slug].lead)}</p>
          <ul class="city-chips">${ds.map((d) => `<li>${T(lang, d.name)}</li>`).join("")}</ul>
          <span class="arrow-link light"><span>${c.cityMore} ${T(lang, city)}</span>${icon("arrow")}</span>
          ${skyline(city.slug)}
        </a>`;
      }).join("")}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <div>${kicker(c.stepsK)}<h2 class="h-display">${c.stepsH}</h2></div>
      ${arrowLink(url(p + "/how-it-works/"), c.stepsMore)}
    </div>
    <ol class="steps">
      ${c.steps.map(([t, d], i) => `<li data-reveal><span class="step-n">${num(i)}</span><h3>${t}</h3><p>${d}</p></li>`).join("")}
    </ol>
  </div>
</section>

<section class="section section-tight">
  <div class="wrap">
    <div class="fee pattern" data-reveal>
      <div class="fee-num"><strong>${cfg.feePercent}%</strong><span>${c.feeSub}</span></div>
      <div class="fee-body">
        ${kicker(c.feeK, true)}
        <h2>${c.feeH}</h2>
        <ul>${c.fee.map((f) => `<li>${icon("check")}<span>${f}</span></li>`).join("")}</ul>
        <p class="fee-note">${c.feeNote}</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-sand">
  <div class="wrap">
    <div class="section-head">
      <div>${kicker(c.guidesK)}<h2 class="h-display">${c.guidesH}</h2></div>
      ${arrowLink(url("/guides/"), c.guidesMore)}
    </div>
    <div class="d-grid">
      ${GUIDES.slice(0, 3)
        .map((g) => `<a class="g-card" href="${url(`/guides/${g.slug}/`)}"${ar ? "" : ' hreflang="ar" lang="ar" dir="rtl"'} data-reveal><span class="g-meta">${icon("clock")} ${toArDigits(g.minutes)} دقائق قراءة</span><h3>${g.title}</h3><p>${g.summary}</p><span class="d-go">${icon("arrow")}</span></a>`)
        .join("")}
    </div>
  </div>
</section>

${testimonials}

<section class="section">
  <div class="wrap split-2">
    <div>${kicker(c.faqK)}<h2 class="h-display">${c.faqH}</h2>${arrowLink(url(p + "/faq/"), ar ? "كل الأسئلة" : "All questions")}</div>
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
    bodyClass: "home",
    body,
    schema: [
      agentSchema(lang),
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": abs("/#website"),
        url: abs(p + "/"),
        name: T(lang, cfg.brand),
        inLanguage: ar ? "ar-SA" : "en",
        publisher: { "@id": abs("/#agent") },
      },
      faqSchema(c.faq),
    ],
  };
}
