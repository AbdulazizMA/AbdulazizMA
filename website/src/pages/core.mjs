import { cfg, T, url, icon, btn, waBtn, faqBlock, faqSchema, ctaBand, agentId, agentSchema, telLink, waLink, esc, monogram } from "../lib.mjs";

const pre = (lang) => (lang === "en" ? "/en" : "");
const list = (items) => `<ul class="checklist">${items.map((i) => `<li>${icon("check")}<span>${i}</span></li>`).join("")}</ul>`;

// ---------------------------------------------------------------------------
// SERVICES
// ---------------------------------------------------------------------------
const SERVICES = {
  ar: [
    {
      id: "income",
      icon: "building",
      title: "شراء عقارات مدرّة للدخل",
      lead: "عمائر سكنية، شقق، أدوار، ومحلات — هدفها دخل شهري منتظم.",
      who: "لمن يريد دخلًا ثابتًا ويفضّل الأصل الملموس على الأسهم والودائع.",
      inc: ["تحليل الدخل الفعلي من عقود إيجار الموثقة وسجل التحصيل", "تقدير الشواغر والصيانة والمصاريف التشغيلية بواقعية", "حساب العائد الصافي والعائد على الكاش مع التمويل وبدونه", "فحص فني للمبنى قبل التوصية"],
    },
    {
      id: "land",
      icon: "land",
      title: "أراضٍ للاستثمار والتطوير",
      lead: "للاحتفاظ طويل المدى أو للبناء والبيع.",
      who: "لمن يملك أفقًا زمنيًا طويلًا أو يفكر في تطوير صغير.",
      inc: ["التحقق من اعتماد المخطط والاستخدام ونظام البناء", "تحليل عرض الشوارع والواجهات وأثرها على القيمة", "مقارنة بصفقات أراضٍ مسجّلة قريبة", "دراسة مبسطة لجدوى التطوير عند الحاجة"],
    },
    {
      id: "growth",
      icon: "key",
      title: "فلل ووحدات بهدف النمو",
      lead: "عقارات في أحياء بطلب مستمر، للتأجير أو إعادة البيع أو السكن كاستثمار.",
      who: "لمن يريد أصلًا يحفظ القيمة وينمو مع المدينة.",
      inc: ["اختيار الحي والموقع داخله حسب الطلب المستقبلي", "تقييم جودة البناء والمطوّر والضمانات", "تقدير سيناريوهات إعادة البيع والتأجير", "تفاوض على السعر وشروط الدفع"],
    },
    {
      id: "offplan",
      icon: "doc",
      title: "مشاريع البيع على الخارطة",
      lead: "دخول مبكر بسعر أقل — مع مخاطر يجب فهمها.",
      who: "لمن يقبل الانتظار مقابل سعر دخول أقل وخطة دفع مرنة.",
      inc: ["التحقق من ترخيص المشروع لدى الجهات المختصة (وافي)", "مراجعة سجل المطوّر ومشاريعه المسلّمة", "قراءة العقد وجدول الدفعات وشروط التأخير", "مقارنة السعر النهائي بالوحدات الجاهزة المماثلة"],
    },
    {
      id: "offmarket",
      icon: "search",
      title: "الوصول لصفقات خارج المنصات",
      lead: "كثير من أفضل الصفقات لا تصل للإعلانات العامة.",
      who: "للمستثمر الجاهز الذي يستطيع اتخاذ القرار بسرعة.",
      inc: ["بحث نشط عبر شبكة الملاك والوسطاء والمطورين", "تنبيهك فور ظهور فرصة تطابق معاييرك", "تحليل سريع خلال ٤٨ ساعة لاتخاذ القرار", "حماية سرية بياناتك وميزانيتك في التفاوض"],
    },
    {
      id: "portfolio",
      icon: "chart",
      title: "مراجعة المحفظة العقارية",
      lead: "لديك عقارات؟ هل تعمل لصالحك فعلًا؟",
      who: "لمن يملك عقارًا أو أكثر ويريد رأيًا مستقلًا بالأرقام.",
      inc: ["حساب العائد الفعلي لكل عقار مقابل قيمته السوقية الحالية", "تحديد العقارات الضعيفة الأداء", "توصية: احتفظ، حسّن، أو بِع وأعد التوزيع", "خطة تنفيذ لإعادة التوزيع إن لزم"],
    },
  ],
  en: [
    { id: "income", icon: "building", title: "Income-producing property", lead: "Residential buildings, apartments, floors and retail — built for steady monthly income.", who: "For investors who want stable income and prefer tangible assets.", inc: ["Real income analysis from registered leases and collection history", "Realistic vacancy, maintenance and operating cost estimates", "Net yield and cash-on-cash, with and without financing", "Technical inspection before any recommendation"] },
    { id: "land", icon: "land", title: "Land for holding or development", lead: "Long-term holds or build-and-sell.", who: "For investors with a long horizon or considering small development.", inc: ["Plan approval, permitted use and building code checks", "Street width and frontage analysis and their effect on value", "Comparison with nearby registered land transactions", "Simple development feasibility when needed"] },
    { id: "growth", icon: "key", title: "Villas & units for growth", lead: "Property in districts with sustained demand — to rent, resell or live in as an investment.", who: "For investors seeking an asset that holds value and grows with the city.", inc: ["District and in-district location selection by future demand", "Build quality, developer and warranty assessment", "Resale and rental scenario estimates", "Price and payment-term negotiation"] },
    { id: "offplan", icon: "doc", title: "Off-plan projects", lead: "Early entry at a lower price — with risks you should understand.", who: "For investors who accept waiting in exchange for a lower entry price and flexible payments.", inc: ["Project licensing checks (Wafi)", "Developer track record review", "Contract, payment schedule and delay-clause review", "Final-price comparison with similar ready units"] },
    { id: "offmarket", icon: "search", title: "Off-market access", lead: "Many of the best deals never reach public listings.", who: "For ready investors who can decide quickly.", inc: ["Active search across owners, brokers and developers", "Alerts the moment a match appears", "Rapid analysis within 48 hours", "Confidentiality of your budget in negotiations"] },
    { id: "portfolio", icon: "chart", title: "Portfolio review", lead: "Already own property? Is it actually working for you?", who: "For owners of one or more properties who want an independent, numbers-based view.", inc: ["Actual return per property vs. current market value", "Identify under-performers", "Recommendation: hold, improve, or sell and redeploy", "Execution plan for redeployment if needed"] },
  ],
};

function services(lang) {
  const ar = lang === "ar";
  const p = pre(lang);
  const title = ar ? `خدمات الوساطة العقارية للمستثمرين في ${cfg.city.ar}` : `Real Estate Services for Investors in ${cfg.city.en}`;
  const S = SERVICES[lang];
  const body = `
<section class="page-hero">
  <div class="wrap narrow">
    <h1>${title}</h1>
    <p class="lead">${ar ? "كل خدمة تنتهي بنفس النتيجة: قرار شراء مبني على أرقام، وسعر تفاوضت عليه نيابة عنك، ومتابعة حتى الإفراغ." : "Every service ends the same way: a buying decision based on numbers, a price negotiated on your behalf, and follow-through to title transfer."}</p>
    <nav class="pill-nav" aria-label="${ar ? "الخدمات" : "Services"}">${S.map((s) => `<a href="#${s.id}">${s.title}</a>`).join("")}</nav>
  </div>
</section>
<section class="section">
  <div class="wrap service-list">
    ${S.map(
      (s) => `
    <article class="service" id="${s.id}">
      <div class="card-icon">${icon(s.icon)}</div>
      <div>
        <h2>${s.title}</h2>
        <p class="service-lead">${s.lead}</p>
        <p class="service-who"><strong>${ar ? "لمن؟" : "For whom?"}</strong> ${s.who}</p>
        <h3>${ar ? "ماذا يشمل" : "What's included"}</h3>
        ${list(s.inc)}
        ${waBtn(lang, ar ? `السلام عليكم، مهتم بخدمة: ${s.title}` : `Hello, I'm interested in: ${s.title}`, ar ? "اسأل عن هذه الخدمة" : "Ask about this service", "btn-ghost btn-sm")}
      </div>
    </article>`
    ).join("")}
  </div>
</section>
<section class="section section-alt">
  <div class="wrap narrow">
    <h2>${ar ? "ماذا يصلك مع كل عقار أرشّحه" : "What you get with every property I recommend"}</h2>
    ${list(
      ar
        ? ["ملخص العقار وصور ومقاطع من المعاينة", "مقارنة السعر بصفقات مسجّلة فعلية قريبة", "جدول التكاليف الكاملة: ضريبة التصرفات، السعي، الرسوم، التجهيز", "العائد الإجمالي والصافي والعائد على الكاش", "المخاطر ونقاط التفاوض", "توصية واضحة: اشترِ، فاوض، أو اترك"]
        : ["Property summary with viewing photos and video", "Price comparison against nearby registered transactions", "Full cost table: transaction tax, brokerage, fees, fit-out", "Gross, net and cash-on-cash returns", "Risks and negotiation points", "A clear recommendation: buy, negotiate, or walk away"]
    )}
  </div>
</section>
${ctaBand(lang)}`;

  return {
    key: "services",
    lang,
    path: p + "/services/",
    title,
    description: ar
      ? `خدمات وسيط عقاري مرخّص للمستثمرين في ${cfg.city.ar}: عقارات مدرّة للدخل، أراضٍ، فلل، مشاريع على الخارطة، صفقات خارج المنصات، ومراجعة المحافظ العقارية.`
      : `Licensed buyer's agent services for ${cfg.city.en} investors: income property, land, villas, off-plan, off-market deals and portfolio reviews.`,
    crumbs: [{ name: ar ? "الخدمات" : "Services", path: p + "/services/" }],
    priority: 0.9,
    body,
    schema: S.map((s) => ({
      "@context": "https://schema.org",
      "@type": "Service",
      name: s.title,
      description: `${s.lead} ${s.who}`,
      serviceType: ar ? "وساطة عقارية" : "Real estate brokerage",
      provider: { "@id": agentId },
      areaServed: { "@type": "City", name: T(lang, cfg.city) },
      url: `${url(p + "/services/")}#${s.id}`,
    })),
  };
}

// ---------------------------------------------------------------------------
// HOW IT WORKS
// ---------------------------------------------------------------------------
function howItWorks(lang) {
  const ar = lang === "ar";
  const p = pre(lang);
  const title = ar ? "آلية العمل: كيف أشتري لك العقار خطوة بخطوة" : "How It Works: Buying Your Investment Property Step by Step";
  const steps = ar
    ? [
        ["جلسة تحديد الهدف (مجانية)", "مكالمة ٢٠–٣٠ دقيقة نحدد فيها: الميزانية الكاملة، الهدف (دخل أم نمو)، الأفق الزمني، التمويل، ومستوى المخاطرة المقبول. في نهايتها تعرف هل أستطيع خدمتك — وإن لم أستطع أقول لك ذلك.", "يوم ١"],
        ["عقد الوساطة وخطة البحث", "نوقّع عقد وساطة موثّق يحدد نطاق العمل والأتعاب بوضوح. ثم أرسل لك خطة مكتوبة: الأحياء المستهدفة، نوع العقار، ومعايير القبول والرفض.", "يوم ٢–٣"],
        ["البحث والتصفية", "أبحث في المعروض العام وخارج المنصات، وأستبعد كل ما لا يطابق المعايير. أنت لا ترى العشرات — ترى الأفضل فقط.", "أسبوع ١–٣"],
        ["ملفات التحليل", "لكل عقار مرشّح: مقارنات أسعار، جدول تكاليف كامل، العائد الصافي، المخاطر، وتوصية. نناقشها معًا ونختار.", "مستمر"],
        ["المعاينة والفحص", "أعاين معك أو نيابة عنك بتقرير مصوّر، وأنسّق فحصًا فنيًا عند الحاجة، وأتحقق من الصك وخلوّه من الموانع.", "حسب العقار"],
        ["التفاوض", "أفاوض على السعر وشروط الدفع والتسليم نيابة عنك، مستندًا إلى الأرقام لا إلى الانطباع.", "حسب الصفقة"],
        ["الإغلاق والإفراغ", "أنسّق مع البائع وجهة التمويل حتى الإفراغ، وأتأكد من سداد ضريبة التصرفات العقارية وسلامة الإجراءات.", "١–٤ أسابيع"],
        ["ما بعد الشراء", "أساعدك في التأجير وتوثيق العقد في منصة إيجار، وأبقى مرجعك لأي قرار قادم في محفظتك.", "دائمًا"],
      ]
    : [
        ["Goal session (free)", "A 20–30 minute call to define your full budget, goal (income or growth), horizon, financing and risk appetite. By the end you'll know whether I can help — and if I can't, I'll say so.", "Day 1"],
        ["Brokerage agreement & search plan", "We sign a documented brokerage agreement with clear scope and fees. Then you get a written plan: target districts, property type and accept/reject criteria.", "Days 2–3"],
        ["Search & filtering", "I search public and off-market supply and discard anything that misses the criteria. You don't see dozens — only the best.", "Weeks 1–3"],
        ["Deal memos", "For each shortlisted property: comparables, full cost table, net yield, risks and a recommendation. We review and choose together.", "Ongoing"],
        ["Viewing & inspection", "I view with you or for you with a photo report, arrange technical inspection when needed, and verify the title deed is clear.", "Per property"],
        ["Negotiation", "I negotiate price, payment and handover terms on your behalf — based on numbers, not impressions.", "Per deal"],
        ["Closing & transfer", "I coordinate the seller and lender through transfer and make sure transaction tax and procedures are handled correctly.", "1–4 weeks"],
        ["After purchase", "I help you lease and register the contract on Ejar, and stay your go-to for future portfolio decisions.", "Always"],
      ];
  const promises = ar
    ? ["لن أرشّح لك عقارًا لا أشتريه لو كنت مكانك.", "لن أستلم عمولة من البائع في صفقة أمثّلك فيها دون علمك.", "لن أضغط عليك لإغلاق صفقة — القرار قرارك.", "سأقول لك «لا تشترِ» إذا كانت الأرقام لا تستحق."]
    : ["I won't recommend a property I wouldn't buy in your position.", "I won't take a seller-side commission in a deal where I represent you without your knowledge.", "I won't pressure you to close — the decision is yours.", "I'll tell you \"don't buy\" when the numbers don't work."];

  const body = `
<section class="page-hero">
  <div class="wrap narrow">
    <h1>${title}</h1>
    <p class="lead">${ar ? "عملية واضحة من أول مكالمة حتى استلام المفتاح. تعرف في كل مرحلة ماذا يحدث، ولماذا، وماذا يصلك." : "A clear process from the first call to the keys. At every stage you know what's happening, why, and what you receive."}</p>
  </div>
</section>
<section class="section">
  <div class="wrap narrow">
    <ol class="timeline">
      ${steps.map(([t, d, time]) => `<li><div class="tl-time">${icon("clock")} ${time}</div><h2 class="h3">${t}</h2><p>${d}</p></li>`).join("")}
    </ol>
  </div>
</section>
<section class="section section-dark">
  <div class="wrap narrow">
    <h2>${ar ? "التزاماتي تجاهك" : "My commitments to you"}</h2>
    <ul class="checklist light">${promises.map((x) => `<li>${icon("shield")}<span>${x}</span></li>`).join("")}</ul>
  </div>
</section>
${ctaBand(lang)}`;

  return {
    key: "how",
    lang,
    path: p + "/how-it-works/",
    title,
    description: ar
      ? "من جلسة تحديد الهدف المجانية إلى الإفراغ: كيف يبحث الوسيط العقاري الممثل للمشتري ويحلل ويفاوض ويغلق الصفقة نيابة عنك، ومتى يصلك كل شيء."
      : "From a free goal session to title transfer: how a buyer's agent searches, analyzes, negotiates and closes on your behalf — and when you receive what.",
    crumbs: [{ name: ar ? "آلية العمل" : "How it works", path: p + "/how-it-works/" }],
    priority: 0.8,
    body,
  };
}

// ---------------------------------------------------------------------------
// ABOUT
// ---------------------------------------------------------------------------
function about(lang) {
  const ar = lang === "ar";
  const p = pre(lang);
  const name = T(lang, cfg.name);
  const title = ar ? `من أنا — ${name}، وسيط عقاري مرخّص في ${cfg.city.ar}` : `About ${name} — Licensed Buyer's Agent in ${cfg.city.en}`;
  const bio = T(lang, cfg.bio);
  const photo = cfg.photo
    ? `<img class="portrait" src="${url("/" + cfg.photo)}" alt="${esc(name)}" width="320" height="400" loading="eager">`
    : `<div class="portrait portrait-mono">${monogram()}<strong>${esc(name)}</strong></div>`;
  const principles = ar
    ? [
        ["الأرقام قبل الانطباع", "العقار الجميل ليس بالضرورة استثمارًا جيدًا. كل توصية مني مبنية على مقارنات وحسابات مكتوبة."],
        ["أمثّل طرفًا واحدًا", "أنت. هذا يعني أن مصلحتي أن تشتري بسعر أقل، لا أعلى."],
        ["الشفافية الكاملة", "أتعاب مكتوبة مسبقًا، مخاطر مذكورة بوضوح، ولا مفاجآت عند الإفراغ."],
        ["علاقة طويلة لا صفقة واحدة", "نجاحي الحقيقي أن تعود لي في صفقتك الثانية والثالثة، وأن ترشّحني لغيرك."],
      ]
    : [
        ["Numbers before impressions", "A beautiful property isn't necessarily a good investment. Every recommendation is backed by written comparables and calculations."],
        ["I represent one side", "Yours. That means my interest is that you pay less, not more."],
        ["Full transparency", "Fees agreed in writing upfront, risks stated clearly, no surprises at transfer."],
        ["A relationship, not a transaction", "My real success is you coming back for your second and third deal — and referring others."],
      ];

  const body = `
<section class="page-hero">
  <div class="wrap about-grid">
    ${photo}
    <div>
      <p class="eyebrow">${T(lang, cfg.role)}</p>
      <h1>${ar ? `أنا ${esc(name)}` : `I'm ${esc(name)}`}</h1>
      <p class="lead">${
        ar
          ? `وسيط عقاري مرخّص من الهيئة العامة للعقار في ${cfg.city.ar}. اخترت أن أعمل في جهة واحدة من الطاولة: جهة المستثمر. أساعد المستثمرين المحليين على شراء عقارات بأسعار صحيحة وعوائد مفهومة، بعيدًا عن ضجيج الإعلانات والتسعير العاطفي.`
          : `A REGA-licensed real estate broker in ${cfg.city.en}. I chose to work on one side of the table: the investor's. I help local investors buy property at the right price with returns they understand — away from listing noise and emotional pricing.`
      }</p>
      ${bio ? `<p>${esc(bio)}</p>` : ""}
      ${cfg.yearsExperience ? `<p class="badge">${ar ? `${cfg.yearsExperience}+ سنوات في سوق ${cfg.city.ar} العقاري` : `${cfg.yearsExperience}+ years in the ${cfg.city.en} property market`}</p>` : ""}
      <p class="license">${icon("shield")} ${ar ? "رخصة فال رقم" : "FAL License No."} <strong>${esc(cfg.falLicense)}</strong></p>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <h2 class="section-title">${ar ? "مبادئ أعمل بها" : "Principles I work by"}</h2>
    <div class="grid grid-2">${principles.map(([t, d]) => `<article class="card"><h3>${t}</h3><p>${d}</p></article>`).join("")}</div>
  </div>
</section>
<section class="section section-alt">
  <div class="wrap narrow">
    <h2>${ar ? "لماذا «ممثل المشتري»؟" : "Why a buyer's agent?"}</h2>
    <p>${
      ar
        ? "في أغلب الصفقات العقارية، الوسيط يعمل لصالح البائع — وهذا طبيعي. لكن المستثمر يبقى بلا من يمثّله: يقارن وحده، ويفاوض وحده، ويتحمّل أخطاء الحساب وحده. هذا الفراغ هو ما أعمل فيه. أنا لا أبيع لك مخزونًا عندي؛ أبحث في السوق كله عن العقار الذي يحقق هدفك، ثم أدافع عن مصلحتك حتى نهاية الصفقة."
        : "In most property deals, the broker works for the seller — that's normal. But it leaves the investor unrepresented: comparing alone, negotiating alone, and absorbing calculation mistakes alone. That gap is where I work. I don't sell you my inventory; I search the whole market for the property that meets your goal, then defend your interest to the end of the deal."
    }</p>
    <p>${ar ? "تحقق من رخصتي عبر منصة الهيئة العامة للعقار في أي وقت — الشفافية تبدأ من هنا." : "You can verify my license on the Real Estate General Authority platform at any time — transparency starts there."}</p>
  </div>
</section>
${ctaBand(lang)}`;

  return {
    key: "about",
    lang,
    path: p + "/about/",
    title,
    description: ar
      ? `${name} — وسيط عقاري مرخّص (فال ${cfg.falLicense}) في ${cfg.city.ar}، يمثّل المستثمرين المحليين في شراء العقارات بأسعار صحيحة وعوائد مدروسة.`
      : `${name} — FAL-licensed broker (${cfg.falLicense}) in ${cfg.city.en}, representing local investors to buy property at the right price with well-analyzed returns.`,
    crumbs: [{ name: ar ? "من أنا" : "About", path: p + "/about/" }],
    priority: 0.7,
    ogType: "profile",
    body,
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        mainEntity: {
          "@type": "Person",
          name,
          jobTitle: T(lang, cfg.role),
          worksFor: { "@id": agentId },
          knowsAbout: ar ? ["الاستثمار العقاري", "الوساطة العقارية", "تحليل العائد الإيجاري", cfg.city.ar] : ["Real estate investment", "Real estate brokerage", "Rental yield analysis", cfg.city.en],
          ...(cfg.photo ? { image: url("/" + cfg.photo) } : {}),
        },
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// CONTACT — the investor brief form. Sends to WhatsApp (no backend needed),
// and optionally to email via Formspree if `formEndpoint` is set.
// ---------------------------------------------------------------------------
function contact(lang) {
  const ar = lang === "ar";
  const p = pre(lang);
  const title = ar ? "تواصل معي — أرسل طلبك الاستثماري" : "Contact — Send Your Investment Brief";
  const opt = (name, items, type = "radio") =>
    `<div class="chips">${items.map((v, i) => `<label class="chip"><input type="${type}" name="${name}" value="${esc(v)}"${type === "radio" && i === 0 ? " required" : ""}><span>${v}</span></label>`).join("")}</div>`;
  const L = ar
    ? {
        name: "الاسم",
        phone: "رقم الجوال",
        goal: "ما هدفك من الاستثمار؟",
        goals: ["دخل شهري", "نمو في القيمة", "الاثنين معًا", "سكن + استثمار"],
        type: "نوع العقار المفضّل (اختر ما يناسب)",
        types: ["شقة", "دبلكس / فيلا", "عمارة", "أرض", "تجاري", "على الخارطة", "لست متأكدًا"],
        budget: "الميزانية التقريبية",
        budgets: ["أقل من ١ مليون", "١ – ٢ مليون", "٢ – ٥ مليون", "٥ – ١٠ ملايين", "أكثر من ١٠ ملايين"],
        pay: "طريقة الشراء",
        pays: ["كاش", "تمويل بنكي", "لم أقرر"],
        when: "متى تنوي الشراء؟",
        whens: ["خلال شهر", "خلال ٣ أشهر", "خلال ٦ أشهر", "أستكشف فقط"],
        areas: "أحياء مفضّلة (اختياري)",
        notes: "ملاحظات إضافية (اختياري)",
        submit: "أرسل الطلب عبر واتساب",
        privacy: "بياناتك تُستخدم فقط للتواصل معك بخصوص طلبك.",
        sent: "تم تجهيز رسالتك في واتساب — اضغط إرسال هناك.",
        choose: "اختر",
      }
    : {
        name: "Name",
        phone: "Mobile number",
        goal: "What's your investment goal?",
        goals: ["Monthly income", "Capital growth", "Both", "Live-in + invest"],
        type: "Preferred property type (select any)",
        types: ["Apartment", "Duplex / Villa", "Building", "Land", "Commercial", "Off-plan", "Not sure"],
        budget: "Approximate budget (SAR)",
        budgets: ["Under 1M", "1M – 2M", "2M – 5M", "5M – 10M", "Over 10M"],
        pay: "Payment method",
        pays: ["Cash", "Bank financing", "Undecided"],
        when: "When do you plan to buy?",
        whens: ["Within a month", "Within 3 months", "Within 6 months", "Just exploring"],
        areas: "Preferred districts (optional)",
        notes: "Anything else? (optional)",
        submit: "Send brief via WhatsApp",
        privacy: "Your details are used only to contact you about your request.",
        sent: "Your message is ready in WhatsApp — tap send there.",
        choose: "Choose",
      };

  const body = `
<section class="page-hero">
  <div class="wrap narrow">
    <h1>${title}</h1>
    <p class="lead">${ar ? "دقيقة واحدة تكفي. كلما كانت معلوماتك أوضح، كان ردّي أدق — وغالبًا أرد في نفس اليوم." : "It takes a minute. The clearer your details, the sharper my reply — usually the same day."}</p>
  </div>
</section>
<section class="section">
  <div class="wrap contact-grid">
    <form class="brief" id="brief" data-endpoint="${esc(cfg.formEndpoint)}" data-wa="${esc(cfg.whatsapp)}" data-lang="${lang}" novalidate>
      <div class="row2">
        <label>${L.name}<input name="name" autocomplete="name" required></label>
        <label>${L.phone}<input name="phone" type="tel" inputmode="tel" autocomplete="tel" dir="ltr" placeholder="05xxxxxxxx" required></label>
      </div>
      <fieldset><legend>${L.goal}</legend>${opt("goal", L.goals)}</fieldset>
      <fieldset><legend>${L.type}</legend>${opt("type", L.types, "checkbox")}</fieldset>
      <div class="row2">
        <label>${L.budget}<select name="budget" required><option value="">${L.choose}</option>${L.budgets.map((b) => `<option>${b}</option>`).join("")}</select></label>
        <label>${L.when}<select name="when" required><option value="">${L.choose}</option>${L.whens.map((b) => `<option>${b}</option>`).join("")}</select></label>
      </div>
      <fieldset><legend>${L.pay}</legend>${opt("pay", L.pays)}</fieldset>
      <label>${L.areas}<input name="areas"></label>
      <label>${L.notes}<textarea name="notes" rows="3"></textarea></label>
      <input type="text" name="_gotcha" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <button class="btn btn-wa btn-block" type="submit">${icon("whatsapp")}<span>${L.submit}</span></button>
      <p class="form-note">${L.privacy}</p>
      <p class="form-status" role="status" aria-live="polite" data-sent="${esc(L.sent)}"></p>
    </form>
    <aside class="contact-cards">
      <a class="contact-card" href="${waLink(ar ? "السلام عليكم، وصلت من موقعك." : "Hello, I found your website.")}" target="_blank" rel="noopener" data-track="whatsapp">${icon("whatsapp")}<span><strong>${ar ? "واتساب" : "WhatsApp"}</strong><small dir="ltr">${esc(cfg.phone)}</small></span></a>
      <a class="contact-card" href="${telLink()}" data-track="call">${icon("phone")}<span><strong>${ar ? "اتصال مباشر" : "Call"}</strong><small dir="ltr">${esc(cfg.phone)}</small></span></a>
      <a class="contact-card" href="mailto:${esc(cfg.email)}">${icon("doc")}<span><strong>${ar ? "البريد الإلكتروني" : "Email"}</strong><small>${esc(cfg.email)}</small></span></a>
      <div class="contact-card static">${icon("clock")}<span><strong>${ar ? "أوقات العمل" : "Hours"}</strong><small>${ar ? "الأحد – الخميس ٩ص – ٩م · السبت ٤م – ٩م" : "Sun–Thu 9am–9pm · Sat 4pm–9pm"}</small></span></div>
      <div class="contact-card static">${icon("shield")}<span><strong>${ar ? "رخصة فال" : "FAL License"}</strong><small>${esc(cfg.falLicense)}</small></span></div>
    </aside>
  </div>
</section>`;

  return {
    key: "contact",
    lang,
    path: p + "/contact/",
    title,
    description: ar
      ? `تواصل مع وسيط عقاري مرخّص في ${cfg.city.ar} عبر واتساب أو الاتصال. أرسل ميزانيتك وهدفك الاستثماري واحصل على رد مدروس — الاستشارة الأولى مجانية.`
      : `Contact a licensed buyer's agent in ${cfg.city.en} via WhatsApp or phone. Send your budget and goal and get a considered reply — first consultation free.`,
    crumbs: [{ name: ar ? "تواصل معي" : "Contact", path: p + "/contact/" }],
    priority: 0.9,
    body,
    schema: [{ "@context": "https://schema.org", "@type": "ContactPage", mainEntity: agentSchema(lang) }],
  };
}

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------
const FAQ = {
  ar: [
    ["عن الخدمة", [
      { q: "ما الفرق بين وسيط يمثّل المشتري ومسوّق عقاري عادي؟", a: "المسوّق العقاري عادةً يمثّل البائع ويعرض ما لديه من عقارات. ممثّل المشتري يعمل لصالحك: يبحث في السوق كله عمّا يناسب هدفك، يحلّل الأرقام، ويفاوض لخفض السعر." },
      { q: "هل أنت مرخّص؟", a: `نعم. أحمل رخصة فال للوساطة العقارية رقم ${cfg.falLicense} من الهيئة العامة للعقار، ويمكنك التحقق منها عبر منصة الهيئة.` },
      { q: "هل الاستشارة الأولى مجانية فعلًا؟", a: "نعم، ٢٠–٣٠ دقيقة بدون أي التزام. نحدد فيها هدفك وميزانيتك، وأقول لك بصراحة ما يمكن تحقيقه." },
      { q: "كم أتعابك؟", a: "تُحدَّد مسبقًا وكتابةً في عقد الوساطة وفق نظام الوساطة العقارية، وتُستحق عند إتمام الصفقة. لا مفاجآت." },
      { q: "هل تعمل مع مستثمرين من خارج المدينة؟", a: "نعم. أعاين نيابة عنك بتقارير مصوّرة ومرئية، وتتم الإجراءات عبر الوكالة الإلكترونية والمنصات الرسمية." },
    ]],
    ["عن التكاليف والأنظمة", [
      { q: "ما التكاليف الإضافية على سعر العقار؟", a: "أهمها ضريبة التصرفات العقارية (٥٪ من قيمة الصفقة، مع إعفاء المسكن الأول للمواطن ضمن حدود وشروط)، وعمولة السعي (تُحدَّد وفق نظام الوساطة العقارية وعقد الوساطة، والمتعارف عليه ٢٫٥٪ من قيمة الصفقة، وقد تُضاف عليها ضريبة القيمة المضافة)، إضافة إلى التقييم والفحص والتجهيز حسب الحالة." },
      { q: "من يدفع ضريبة التصرفات العقارية؟", a: "الأصل أنها على البائع نظامًا، لكن في الواقع كثيرًا ما يُتفق على أن يتحملها المشتري أو تُدمج في السعر. لذلك يجب أن تكون واضحة ومكتوبة قبل الاتفاق — وهذه من نقاط التفاوض." },
      { q: "كيف أتحقق من سلامة صك العقار؟", a: "عبر المنصات الرسمية لوزارة العدل والسجل العقاري، للتأكد من ملكية البائع وخلوّ العقار من الرهن أو الإيقاف. أتحقق من ذلك قبل أي توصية." },
    ]],
    ["عن الاستثمار", [
      { q: "ما العائد الإيجاري الجيد في السعودية؟", a: "لا يوجد رقم واحد؛ يعتمد على نوع العقار والحي والمخاطر. الأهم أن تقارن العائد الصافي (بعد كل التكاليف) لا الإجمالي. استخدم حاسبة العائد في الموقع لترى الفرق بنفسك." },
      { q: "أرض أم عقار مبني؟", a: "الأرض مرنة وبدون صيانة لكنها لا تدرّ دخلًا وقد تخضع لرسوم الأراضي البيضاء. العقار المبني يعطي دخلًا فوريًا مع تكاليف تشغيل. الاختيار يعتمد على هدفك وسيولتك وأفقك الزمني." },
      { q: "هل أشتري كاش أم بتمويل؟", a: "التمويل قد يرفع العائد على رأس مالك إذا كان العائد الصافي أعلى من تكلفة التمويل، ويخفضه إذا كان أقل. أحسب لك السيناريوهين قبل القرار." },
      { q: "هل البيع على الخارطة آمن؟", a: "المشاريع المرخّصة ضمن برنامج البيع على الخارطة (وافي) تخضع لضوابط وحسابات ضمان، لكن تبقى مخاطر التأخير وجودة التنفيذ. أراجع ترخيص المشروع وسجل المطوّر والعقد قبل أي توصية." },
    ]],
  ],
  en: [
    ["About the service", [
      { q: "What's the difference between a buyer's agent and a typical agent?", a: "A typical agent usually represents the seller and shows their own listings. A buyer's agent works for you: searching the whole market for what fits your goal, analyzing the numbers and negotiating the price down." },
      { q: "Are you licensed?", a: `Yes. I hold FAL real estate brokerage license ${cfg.falLicense} from the Real Estate General Authority (REGA), which you can verify on REGA's platform.` },
      { q: "Is the first consultation really free?", a: "Yes — 20–30 minutes, no obligation. We define your goal and budget and I tell you honestly what's achievable." },
      { q: "What are your fees?", a: "Agreed upfront in writing in the brokerage agreement per the Real Estate Brokerage Law, and due when the deal closes. No surprises." },
      { q: "Do you work with investors outside the city?", a: "Yes. I view on your behalf with photo and video reports, and the process is completed via e-power of attorney and official platforms." },
    ]],
    ["Costs & regulations", [
      { q: "What costs come on top of the price?", a: "Mainly Real Estate Transaction Tax (5% of the deal value, with a first-home exemption for citizens within limits and conditions) and brokerage commission (set under the Brokerage Law and your brokerage agreement — customarily 2.5% of the deal value, VAT may apply), plus valuation, inspection and fit-out as needed." },
      { q: "Who pays the transaction tax?", a: "By default the seller, but in practice it's often agreed that the buyer pays it or it's built into the price. It must be clear and written before agreement — it's a negotiation point." },
      { q: "How do I verify a title deed?", a: "Through the official Ministry of Justice and Real Estate Registry platforms, confirming the seller's ownership and that there's no mortgage or hold. I check this before any recommendation." },
    ]],
    ["Investing", [
      { q: "What's a good rental yield in Saudi Arabia?", a: "There's no single number — it depends on property type, district and risk. What matters is comparing net yield (after all costs), not gross. Use the site's ROI calculator to see the difference." },
      { q: "Land or built property?", a: "Land is flexible and maintenance-free but produces no income and may be subject to white land fees. Built property earns immediately but has running costs. It depends on your goal, liquidity and horizon." },
      { q: "Cash or financing?", a: "Financing can raise the return on your capital if net yield exceeds the financing cost, and lowers it if not. I model both scenarios before you decide." },
      { q: "Is off-plan safe?", a: "Projects licensed under the off-plan sales program (Wafi) are subject to controls and escrow accounts, but delay and build-quality risks remain. I review the license, developer track record and contract first." },
    ]],
  ],
};

function faq(lang) {
  const ar = lang === "ar";
  const p = pre(lang);
  const title = ar ? "الأسئلة الشائعة عن شراء العقار والاستثمار العقاري" : "FAQ: Buying Investment Property in Saudi Arabia";
  const all = FAQ[lang].flatMap(([, items]) => items);
  const body = `
<section class="page-hero"><div class="wrap narrow"><h1>${title}</h1><p class="lead">${ar ? "إجابات مباشرة عن أكثر ما يسأله المستثمرون قبل الشراء." : "Straight answers to what investors ask most before buying."}</p></div></section>
<section class="section"><div class="wrap narrow">
${FAQ[lang].map(([h, items]) => `<h2>${h}</h2>${faqBlock(items)}`).join("")}
<p class="note">${ar ? "المعلومات عامة للتوعية وقد تتغير الأنظمة؛ تحقق دائمًا من الجهات الرسمية أو اسألني عن حالتك." : "General information only; regulations change. Always confirm with official sources or ask me about your case."}</p>
</div></section>
${ctaBand(lang, ar ? "سؤالك غير موجود؟" : "Question not here?", ar ? "أرسله لي على واتساب وأرد عليك مباشرة." : "Send it to me on WhatsApp and I'll answer directly.")}`;
  return {
    key: "faq",
    lang,
    path: p + "/faq/",
    title,
    description: ar
      ? "إجابات عن أسئلة المستثمرين: أتعاب الوسيط، ضريبة التصرفات العقارية، السعي، التحقق من الصك، العائد الإيجاري، التمويل، والبيع على الخارطة."
      : "Answers to investor questions: broker fees, transaction tax, brokerage commission, title verification, rental yield, financing and off-plan.",
    crumbs: [{ name: ar ? "الأسئلة الشائعة" : "FAQ", path: p + "/faq/" }],
    priority: 0.7,
    body,
    schema: [faqSchema(all)],
  };
}

// ---------------------------------------------------------------------------
// PRIVACY + 404
// ---------------------------------------------------------------------------
function privacy(lang) {
  const ar = lang === "ar";
  const p = pre(lang);
  const title = ar ? "سياسة الخصوصية" : "Privacy Policy";
  const body = `
<section class="page-hero"><div class="wrap narrow"><h1>${title}</h1></div></section>
<section class="section"><div class="wrap narrow prose">
${
  ar
    ? `<p>نحترم خصوصيتك ونلتزم بنظام حماية البيانات الشخصية في المملكة العربية السعودية.</p>
<h2>ما البيانات التي نجمعها؟</h2><p>فقط ما ترسله بنفسك عبر نموذج الطلب أو واتساب أو الاتصال: الاسم، رقم الجوال، وتفاصيل طلبك الاستثماري.</p>
<h2>كيف نستخدمها؟</h2><p>للتواصل معك بخصوص طلبك فقط. لا نبيع بياناتك ولا نشاركها مع أي طرف ثالث لأغراض تسويقية، ولا نشارك ميزانيتك مع أي بائع دون إذنك.</p>
<h2>ملفات تعريف الارتباط والتحليلات</h2><p>قد نستخدم أدوات تحليل مجهولة الهوية لفهم أداء الموقع وتحسينه.</p>
<h2>حقوقك</h2><p>يمكنك طلب الاطلاع على بياناتك أو تصحيحها أو حذفها في أي وقت عبر <a href="mailto:${esc(cfg.email)}">${esc(cfg.email)}</a>.</p>`
    : `<p>We respect your privacy and comply with the Saudi Personal Data Protection Law.</p>
<h2>What we collect</h2><p>Only what you send us via the brief form, WhatsApp or phone: name, mobile number and your investment request details.</p>
<h2>How we use it</h2><p>Solely to contact you about your request. We never sell or share your data for marketing, and never share your budget with a seller without your permission.</p>
<h2>Cookies & analytics</h2><p>We may use anonymous analytics to understand and improve site performance.</p>
<h2>Your rights</h2><p>You can request access, correction or deletion of your data at any time via <a href="mailto:${esc(cfg.email)}">${esc(cfg.email)}</a>.</p>`
}
</div></section>`;
  return { key: "privacy", lang, path: p + "/privacy/", title, description: ar ? "سياسة الخصوصية وحماية البيانات الشخصية." : "Privacy and personal data protection policy.", crumbs: [{ name: title, path: p + "/privacy/" }], priority: 0.2, body };
}

function notFound() {
  return {
    key: "404",
    lang: "ar",
    path: "/404.html",
    file: "404.html",
    noindex: true,
    sitemap: false,
    title: "الصفحة غير موجودة",
    description: "الصفحة غير موجودة.",
    body: `<section class="page-hero"><div class="wrap narrow center"><h1>الصفحة غير موجودة</h1><p class="lead">يبدو أن الرابط تغيّر. جرّب إحدى هذه الصفحات:</p><p class="hero-actions center-actions">${btn(url("/"), "الرئيسية")} ${btn(url("/areas/"), "الأحياء", "btn-ghost")} ${btn(url("/guides/"), "أدلة المستثمر", "btn-ghost")}</p><p lang="en" dir="ltr">Page not found — <a href="${url("/en/")}">English home</a></p></div></section>`,
  };
}

export default function core() {
  return ["ar", "en"].flatMap((l) => [services(l), howItWorks(l), about(l), contact(l), faq(l), privacy(l)]).concat(notFound());
}
