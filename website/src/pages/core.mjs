import { cfg, T, url, icon, btn, waBtn, faqBlock, faqSchema, ctaBand, agentId, agentSchema, telLink, waLink, esc, mark, pageHero, kicker, arrowLink, CITIES, citiesText, feeText, licenseLine, phoneDisplay, toArDigits } from "../lib.mjs";
import { SERVICES } from "./services-data.mjs";

const pre = (lang) => (lang === "en" ? "/en" : "");
const list = (items, cls = "") => `<ul class="checklist ${cls}">${items.map((i) => `<li>${icon("check")}<span>${i}</span></li>`).join("")}</ul>`;
const num = (lang, i) => String(i + 1).padStart(2, "0");

// ---------------------------------------------------------------------------
// SERVICES
// ---------------------------------------------------------------------------
function services(lang) {
  const ar = lang === "ar";
  const p = pre(lang);
  const title = ar ? `خدمات الوساطة العقارية للمستثمرين في ${citiesText("ar")}` : `Real Estate Services for Investors in ${citiesText("en")}`;
  const S = SERVICES[lang];
  const body = (crumbs) => `
${pageHero(lang, {
  crumbs,
  kicker: ar ? "الخدمات" : "Services",
  title,
  lead: ar ? "كل خدمة تنتهي بنفس النتيجة: قرار شراء مبني على أرقام، وسعر تفاوضت عليه نيابة عنك، ومتابعة حتى الإفراغ." : "Every service ends the same way: a buying decision based on numbers, a price negotiated on your behalf, and follow-through to title transfer.",
  actions: `<nav class="pill-nav" aria-label="${ar ? "الخدمات" : "Services"}">${S.map((s) => `<a href="#${s.id}">${s.title}</a>`).join("")}</nav>`,
})}
<section class="section section-tight">
  <div class="wrap service-list">
    ${S.map(
      (s, i) => `
    <article class="service" id="${s.id}" data-reveal>
      <div class="service-side"><span class="service-n">${num(lang, i)}</span><span class="b-icon">${icon(s.icon)}</span></div>
      <div>
        <h2>${s.title}</h2>
        <p class="service-lead">${s.lead}</p>
        <p class="muted"><strong>${ar ? "لمن؟" : "For whom?"}</strong> ${s.who}</p>
        ${list(s.inc)}
        ${waBtn(lang, ar ? `السلام عليكم، مهتم بخدمة: ${s.title}` : `Hello, I'm interested in: ${s.title}`, ar ? "اسأل عن هذه الخدمة" : "Ask about this service", "btn-outline btn-sm")}
      </div>
    </article>`
    ).join("")}
  </div>
</section>
<section class="section section-sand">
  <div class="wrap split-2">
    <div>${kicker(ar ? "ملف تحليل الصفقة" : "The deal memo")}<h2 class="h-display">${ar ? "ماذا يصلك مع كل عقار أرشّحه" : "What you get with every property I recommend"}</h2></div>
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
      ? `خدمات وسيط عقاري مرخّص للمستثمرين في ${citiesText("ar")}: عقارات مدرّة للدخل، أراضٍ، فلل، مشاريع على الخارطة، صفقات خارج المنصات، ومراجعة المحافظ.`
      : `Licensed buyer's agent services for investors in ${citiesText("en")}: income property, land, villas, off-plan, off-market deals and portfolio reviews.`,
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
      areaServed: CITIES.map((c) => ({ "@type": "City", name: T(lang, c) })),
    })),
  };
}

// ---------------------------------------------------------------------------
// HOW IT WORKS (+ fees)
// ---------------------------------------------------------------------------
function howItWorks(lang) {
  const ar = lang === "ar";
  const p = pre(lang);
  const title = ar ? "آلية العمل والأتعاب: كيف أشتري لك العقار خطوة بخطوة" : "Process & Fees: How I Buy Your Investment Property";
  const steps = ar
    ? [
        ["جلسة تحديد الهدف (مجانية)", "مكالمة ٢٠–٣٠ دقيقة نحدد فيها: الميزانية الكاملة، الهدف (دخل أم نمو)، المدينة، الأفق الزمني، التمويل، ومستوى المخاطرة. في نهايتها تعرف هل أستطيع خدمتك — وإن لم أستطع أقول لك ذلك.", "يوم ١"],
        ["عقد الوساطة وخطة البحث", `نوقّع عقد وساطة موثّق يحدد نطاق العمل والأتعاب (${feeText("ar")} من قيمة العقار عند الإفراغ). ثم أرسل لك خطة مكتوبة: الأحياء المستهدفة، نوع العقار، ومعايير القبول والرفض.`, "يوم ٢–٣"],
        ["البحث والتصفية", "أبحث في المعروض العام وخارج المنصات، وأستبعد كل ما لا يطابق المعايير. أنت لا ترى العشرات — ترى الأفضل فقط.", "أسبوع ١–٣"],
        ["ملفات التحليل", "لكل عقار مرشّح: مقارنات أسعار، جدول تكاليف كامل، العائد الصافي، المخاطر، وتوصية. نناقشها معًا ونختار.", "مستمر"],
        ["المعاينة والفحص", "أعاين معك أو نيابة عنك بتقرير مصوّر، وأنسّق فحصًا فنيًا عند الحاجة، وأتحقق من الصك وخلوّه من الموانع.", "حسب العقار"],
        ["التفاوض", "أفاوض على السعر وشروط الدفع والتسليم نيابة عنك، مستندًا إلى الأرقام لا إلى الانطباع.", "حسب الصفقة"],
        ["الإغلاق والإفراغ", "أنسّق مع البائع وجهة التمويل حتى الإفراغ، وأتأكد من سداد ضريبة التصرفات العقارية وسلامة الإجراءات. هنا فقط تُستحق أتعابي.", "١–٤ أسابيع"],
        ["ما بعد الشراء", "أساعدك في التأجير وتوثيق العقد في منصة إيجار، وأبقى مرجعك لأي قرار قادم في محفظتك.", "دائمًا"],
      ]
    : [
        ["Goal session (free)", "A 20–30 minute call to define your full budget, goal (income or growth), city, horizon, financing and risk appetite. By the end you'll know whether I can help — and if I can't, I'll say so.", "Day 1"],
        ["Brokerage agreement & search plan", `We sign a documented brokerage agreement with clear scope and fee (${feeText("en")} of the property price, at closing). Then you get a written plan: target districts, property type and accept/reject criteria.`, "Days 2–3"],
        ["Search & filtering", "I search public and off-market supply and discard anything that misses the criteria. You don't see dozens — only the best.", "Weeks 1–3"],
        ["Deal memos", "For each shortlisted property: comparables, full cost table, net yield, risks and a recommendation. We review and choose together.", "Ongoing"],
        ["Viewing & inspection", "I view with you or for you with a photo report, arrange technical inspection when needed, and verify the title deed is clear.", "Per property"],
        ["Negotiation", "I negotiate price, payment and handover terms on your behalf — based on numbers, not impressions.", "Per deal"],
        ["Closing & transfer", "I coordinate the seller and lender through transfer and make sure transaction tax and procedures are handled correctly. Only now is my fee due.", "1–4 weeks"],
        ["After purchase", "I help you lease and register the contract on Ejar, and stay your go-to for future portfolio decisions.", "Always"],
      ];
  const promises = ar
    ? ["لن أرشّح لك عقارًا لا أشتريه لو كنت مكانك.", "لن أستلم عمولة من البائع في صفقة أمثّلك فيها دون علمك.", "لن أضغط عليك لإغلاق صفقة — القرار قرارك.", "سأقول لك «لا تشترِ» إذا كانت الأرقام لا تستحق."]
    : ["I won't recommend a property I wouldn't buy in your position.", "I won't take a seller-side commission in a deal where I represent you without your knowledge.", "I won't pressure you to close — the decision is yours.", "I'll tell you \"don't buy\" when the numbers don't work."];

  const example = ar
    ? `مثال: عقار بـ٢٬٠٠٠٬٠٠٠ ريال ← أتعابي ٥٠٬٠٠٠ ريال. تفاوض يخفض السعر ٣٪ فقط يوفّر لك ٦٠٬٠٠٠ ريال.`
    : `Example: a SAR 2,000,000 property → my fee is SAR 50,000. A negotiation that takes just 3% off the price saves you SAR 60,000.`;

  const body = (crumbs) => `
${pageHero(lang, {
  crumbs,
  kicker: ar ? "آلية العمل" : "Process",
  title,
  lead: ar ? "عملية واضحة من أول مكالمة حتى استلام المفتاح، وأتعاب واحدة مكتوبة مسبقًا. تعرف في كل مرحلة ماذا يحدث، ولماذا، وماذا يصلك." : "A clear process from the first call to the keys, and one fee agreed in writing upfront. At every stage you know what's happening, why, and what you receive.",
})}
<section class="section section-tight">
  <div class="wrap">
    <ol class="timeline">
      ${steps.map(([t, d, time], i) => `<li data-reveal><span class="tl-n">${num(lang, i)}</span><div><span class="tl-time">${icon("clock")} ${time}</span><h2 class="h3">${t}</h2><p>${d}</p></div></li>`).join("")}
    </ol>
  </div>
</section>
<section class="section section-tight" id="fees">
  <div class="wrap">
    <div class="fee pattern" data-reveal>
      <div class="fee-num"><strong>${cfg.feePercent}%</strong><span>${ar ? "من قيمة العقار" : "of the property price"}</span></div>
      <div class="fee-body">
        ${kicker(ar ? "الأتعاب" : "Fees", true)}
        <h2>${ar ? "أتعاب واحدة، تُستحق عند الإفراغ فقط" : "One fee, due only at closing"}</h2>
        <ul>${(ar ? ["لا دفعات مقدّمة ولا رسوم استشارة", "مكتوبة في عقد وساطة موثّق قبل البدء", "لا تشتري؟ لا تدفع شيئًا"] : ["No upfront payments or consultation fees", "Written into a documented brokerage agreement before we start", "Don't buy? Don't pay"]).map((f) => `<li>${icon("check")}<span>${f}</span></li>`).join("")}</ul>
        <p class="fee-note">${example}</p>
      </div>
    </div>
  </div>
</section>
<section class="section section-ink pattern">
  <div class="wrap split-2">
    <div>${kicker(ar ? "التزاماتي" : "Commitments", true)}<h2 class="h-display">${ar ? "التزاماتي تجاهك" : "My commitments to you"}</h2></div>
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
      ? `من جلسة تحديد الهدف المجانية إلى الإفراغ: كيف يبحث ممثل المشتري ويحلل ويفاوض نيابة عنك. الأتعاب ${feeText("ar")} من قيمة العقار عند الإفراغ فقط.`
      : `From a free goal session to title transfer: how a buyer's agent searches, analyzes and negotiates for you. Fee: ${feeText("en")} of the price, at closing only.`,
    crumbs: [{ name: ar ? "آلية العمل والأتعاب" : "Process & fees", path: p + "/how-it-works/" }],
    priority: 0.8,
    body,
  };
}

// ---------------------------------------------------------------------------
// ABOUT (works beautifully with or without a photo)
// ---------------------------------------------------------------------------
function about(lang) {
  const ar = lang === "ar";
  const p = pre(lang);
  const name = T(lang, cfg.name);
  const title = ar ? `من أنا — ${name}، وسيط عقاري مرخّص في ${citiesText("ar")}` : `About ${name} — Licensed Buyer's Agent in ${citiesText("en")}`;
  const bio = T(lang, cfg.bio);
  const portrait = cfg.photo
    ? `<img class="portrait" src="${url("/" + cfg.photo)}" alt="${esc(name)}" width="360" height="450" loading="eager">`
    : `<div class="id-card pattern" aria-hidden="true">${mark(72)}<strong>${esc(name)}</strong><span>${esc(T(lang, cfg.role))}</span><ul>${CITIES.map((c) => `<li>${icon("pin")}${T(lang, c)}</li>`).join("")}</ul><small>${licenseLine(lang)}</small></div>`;
  const principles = ar
    ? [
        ["الأرقام قبل الانطباع", "العقار الجميل ليس بالضرورة استثمارًا جيدًا. كل توصية مني مبنية على مقارنات وحسابات مكتوبة."],
        ["أمثّل طرفًا واحدًا", "أنت. هذا يعني أن مصلحتي أن تشتري بسعر أقل، لا أعلى."],
        ["الشفافية الكاملة", `أتعاب واحدة (${feeText("ar")}) مكتوبة مسبقًا، مخاطر مذكورة بوضوح، ولا مفاجآت عند الإفراغ.`],
        ["علاقة طويلة لا صفقة واحدة", "نجاحي الحقيقي أن تعود لي في صفقتك الثانية والثالثة، وأن ترشّحني لغيرك."],
      ]
    : [
        ["Numbers before impressions", "A beautiful property isn't necessarily a good investment. Every recommendation is backed by written comparables and calculations."],
        ["I represent one side", "Yours. That means my interest is that you pay less, not more."],
        ["Full transparency", `One fee (${feeText("en")}) agreed in writing upfront, risks stated clearly, no surprises at transfer.`],
        ["A relationship, not a transaction", "My real success is you coming back for your second and third deal — and referring others."],
      ];

  const body = (crumbs) => `
${pageHero(lang, {
  crumbs,
  kicker: T(lang, cfg.role),
  title: ar ? `أنا ${esc(name)}` : `I'm ${esc(name)}`,
  lead: ar
    ? `وسيط عقاري مرخّص من الهيئة العامة للعقار، أعمل في ${citiesText("ar")}. اخترت أن أعمل في جهة واحدة من الطاولة: جهة المستثمر. أساعد المستثمرين المحليين على شراء عقارات بأسعار صحيحة وعوائد مفهومة، بعيدًا عن ضجيج الإعلانات والتسعير العاطفي.`
    : `A REGA-licensed real estate broker working in ${citiesText("en")}. I chose one side of the table: the investor's. I help local investors buy property at the right price with returns they understand — away from listing noise and emotional pricing.`,
  actions: `${bio ? `<p>${esc(bio)}</p>` : ""}${cfg.yearsExperience ? `<p class="badge">${ar ? `${toArDigits(cfg.yearsExperience)}+ سنوات في السوق العقاري` : `${cfg.yearsExperience}+ years in property`}</p>` : ""}${waBtn(lang, null, ar ? "تواصل معي مباشرة" : "Talk to me directly")}`,
  aside: portrait,
})}
<section class="section">
  <div class="wrap">
    ${kicker(ar ? "المبادئ" : "Principles")}
    <h2 class="h-display">${ar ? "مبادئ أعمل بها" : "Principles I work by"}</h2>
    <div class="gap-grid gap-grid-4">${principles.map(([t, d], i) => `<article data-reveal><span class="num">${num(lang, i)}</span><h3>${t}</h3><p>${d}</p></article>`).join("")}</div>
  </div>
</section>
<section class="section section-sand">
  <div class="wrap split-2">
    <div>${kicker(ar ? "لماذا" : "Why")}<h2 class="h-display">${ar ? "لماذا «ممثل المشتري»؟" : "Why a buyer's agent?"}</h2></div>
    <div class="prose">
      <p>${
        ar
          ? "في أغلب الصفقات العقارية، الوسيط يعمل لصالح البائع — وهذا طبيعي. لكن المستثمر يبقى بلا من يمثّله: يقارن وحده، ويفاوض وحده، ويتحمّل أخطاء الحساب وحده. هذا الفراغ هو ما أعمل فيه. أنا لا أبيع لك مخزونًا عندي؛ أبحث في السوق كله عن العقار الذي يحقق هدفك، ثم أدافع عن مصلحتك حتى نهاية الصفقة."
          : "In most property deals, the broker works for the seller — that's normal. But it leaves the investor unrepresented: comparing alone, negotiating alone, and absorbing calculation mistakes alone. That gap is where I work. I don't sell you my inventory; I search the whole market for the property that meets your goal, then defend your interest to the end of the deal."
      }</p>
      <p>${ar ? "تستطيع التحقق من رخصتي عبر منصة الهيئة العامة للعقار في أي وقت — الشفافية تبدأ من هنا." : "You can verify my license on the Real Estate General Authority platform at any time — transparency starts there."}</p>
    </div>
  </div>
</section>
${ctaBand(lang)}`;

  return {
    key: "about",
    lang,
    path: p + "/about/",
    title,
    description: ar
      ? `${name} — وسيط عقاري مرخّص في ${citiesText("ar")}، يمثّل المستثمرين المحليين في شراء العقارات بأسعار صحيحة وعوائد مدروسة.`
      : `${name} — licensed buyer's agent in ${citiesText("en")}, representing local investors to buy property at the right price with well-analyzed returns.`,
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
          telephone: cfg.phone,
          worksFor: { "@id": agentId },
          knowsAbout: ar ? ["الاستثمار العقاري", "الوساطة العقارية", "تحليل العائد الإيجاري", ...CITIES.map((c) => c.ar)] : ["Real estate investment", "Real estate brokerage", "Rental yield analysis", ...CITIES.map((c) => c.en)],
          ...(cfg.photo ? { image: url("/" + cfg.photo) } : {}),
        },
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// CONTACT — investor brief form → WhatsApp (optional Formspree email copy)
// ---------------------------------------------------------------------------
function contact(lang) {
  const ar = lang === "ar";
  const p = pre(lang);
  const title = ar ? "تواصل معي — أرسل طلبك الاستثماري" : "Contact — Send Your Investment Brief";
  const opt = (name, items, type = "radio") =>
    `<div class="chips">${items.map((v, i) => `<label class="chip"><input type="${type}" name="${name}" value="${esc(v)}"${type === "radio" && i === 0 ? " required" : ""}><span>${v}</span></label>`).join("")}</div>`;
  const L = ar
    ? {
        name: "الاسم", phone: "رقم الجوال", city: "المدينة",
        cities: [...CITIES.map((c) => c.ar), "أي منهما"],
        goal: "ما هدفك من الاستثمار؟", goals: ["دخل شهري", "نمو في القيمة", "الاثنين معًا", "سكن + استثمار"],
        type: "نوع العقار (اختر ما يناسب)", types: ["شقة", "دبلكس / فيلا", "عمارة", "أرض", "تجاري", "على الخارطة", "لست متأكدًا"],
        budget: "الميزانية التقريبية", budgets: ["أقل من ١ مليون", "١ – ٢ مليون", "٢ – ٥ مليون", "٥ – ١٠ ملايين", "أكثر من ١٠ ملايين"],
        pay: "طريقة الشراء", pays: ["كاش", "تمويل بنكي", "لم أقرر"],
        when: "متى تنوي الشراء؟", whens: ["خلال شهر", "خلال ٣ أشهر", "خلال ٦ أشهر", "أستكشف فقط"],
        areas: "أحياء مفضّلة (اختياري)", notes: "ملاحظات إضافية (اختياري)",
        submit: "أرسل الطلب عبر واتساب", privacy: "بياناتك تُستخدم فقط للتواصل معك بخصوص طلبك.",
        sent: "تم تجهيز رسالتك في واتساب — اضغط إرسال هناك.", choose: "اختر",
      }
    : {
        name: "Name", phone: "Mobile number", city: "City",
        cities: [...CITIES.map((c) => c.en), "Either"],
        goal: "What's your investment goal?", goals: ["Monthly income", "Capital growth", "Both", "Live-in + invest"],
        type: "Property type (select any)", types: ["Apartment", "Duplex / Villa", "Building", "Land", "Commercial", "Off-plan", "Not sure"],
        budget: "Approximate budget (SAR)", budgets: ["Under 1M", "1M – 2M", "2M – 5M", "5M – 10M", "Over 10M"],
        pay: "Payment method", pays: ["Cash", "Bank financing", "Undecided"],
        when: "When do you plan to buy?", whens: ["Within a month", "Within 3 months", "Within 6 months", "Just exploring"],
        areas: "Preferred districts (optional)", notes: "Anything else? (optional)",
        submit: "Send brief via WhatsApp", privacy: "Your details are used only to contact you about your request.",
        sent: "Your message is ready in WhatsApp — tap send there.", choose: "Choose",
      };

  const body = (crumbs) => `
${pageHero(lang, {
  crumbs,
  kicker: ar ? "تواصل معي" : "Contact",
  title: ar ? "أرسل طلبك الاستثماري" : "Send your investment brief",
  lead: ar ? "دقيقة واحدة تكفي. كلما كانت معلوماتك أوضح، كان ردّي أدق — وغالبًا أرد في نفس اليوم." : "It takes a minute. The clearer your details, the sharper my reply — usually the same day.",
})}
<section class="section section-tight">
  <div class="wrap contact-grid">
    <form class="brief" id="brief" data-endpoint="${esc(cfg.formEndpoint)}" data-wa="${esc(cfg.whatsapp)}" data-lang="${lang}" novalidate>
      <div class="row2">
        <label>${L.name}<input name="name" autocomplete="name" required></label>
        <label>${L.phone}<input name="phone" type="tel" inputmode="tel" autocomplete="tel" dir="ltr" placeholder="05xxxxxxxx" required></label>
      </div>
      <fieldset><legend>${L.city}</legend>${opt("city", L.cities)}</fieldset>
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
      <button class="btn btn-wa btn-lg btn-block" type="submit">${icon("whatsapp")}<span>${L.submit}</span></button>
      <p class="form-note">${L.privacy}</p>
      <p class="form-status" role="status" aria-live="polite" data-sent="${esc(L.sent)}"></p>
    </form>
    <aside class="contact-side">
      <a class="contact-card cc-wa" href="${waLink(ar ? "السلام عليكم أستاذ عبدالعزيز، وصلت من موقعك." : "Hello Abdulaziz, I found your website.")}" target="_blank" rel="noopener" data-track="whatsapp">${icon("whatsapp")}<span><strong>${ar ? "واتساب" : "WhatsApp"}</strong><small dir="ltr">${phoneDisplay()}</small></span></a>
      <a class="contact-card" href="${telLink()}" data-track="call">${icon("phone")}<span><strong>${ar ? "اتصال مباشر" : "Call"}</strong><small dir="ltr">${phoneDisplay()}</small></span></a>
      ${cfg.email ? `<a class="contact-card" href="mailto:${esc(cfg.email)}">${icon("doc")}<span><strong>${ar ? "البريد الإلكتروني" : "Email"}</strong><small>${esc(cfg.email)}</small></span></a>` : ""}
      <div class="contact-card">${icon("pin")}<span><strong>${ar ? "مناطق العمل" : "Markets"}</strong><small>${citiesText(lang)}</small></span></div>
      <div class="contact-card">${icon("clock")}<span><strong>${ar ? "أوقات العمل" : "Hours"}</strong><small>${ar ? "الأحد – الخميس ٩ص – ٩م · السبت ٤م – ٩م" : "Sun–Thu 9am–9pm · Sat 4pm–9pm"}</small></span></div>
      <div class="contact-card">${icon("shield")}<span><strong>${ar ? "الترخيص" : "License"}</strong><small>${licenseLine(lang)}</small></span></div>
    </aside>
  </div>
</section>`;

  return {
    key: "contact",
    lang,
    path: p + "/contact/",
    title,
    description: ar
      ? `تواصل مع وسيط عقاري مرخّص في ${citiesText("ar")} عبر واتساب أو الاتصال: ${phoneDisplay()}. أرسل ميزانيتك وهدفك واحصل على رد مدروس — الاستشارة الأولى مجانية.`
      : `Contact a licensed buyer's agent in ${citiesText("en")} via WhatsApp or phone: ${phoneDisplay()}. Send your budget and goal — first consultation free.`,
    crumbs: [{ name: ar ? "تواصل معي" : "Contact", path: p + "/contact/" }],
    priority: 0.9,
    body,
    schema: [{ "@context": "https://schema.org", "@type": "ContactPage", mainEntity: agentSchema(lang) }],
  };
}

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------
const licAr = cfg.falLicense ? `نعم. أحمل رخصة فال للوساطة العقارية رقم ${cfg.falLicense} من الهيئة العامة للعقار، ويمكنك التحقق منها عبر منصة الهيئة.` : "نعم. أحمل رخصة فال للوساطة العقارية من الهيئة العامة للعقار، ويمكنك التحقق منها عبر منصة الهيئة.";
const licEn = cfg.falLicense ? `Yes. I hold FAL real estate brokerage license ${cfg.falLicense} from REGA, which you can verify on REGA's platform.` : "Yes. I hold a FAL real estate brokerage license from REGA, which you can verify on REGA's platform.";

const FAQ = {
  ar: [
    ["عن الخدمة والأتعاب", [
      { q: "ما الفرق بين وسيط يمثّل المشتري ومسوّق عقاري عادي؟", a: "المسوّق العقاري عادةً يمثّل البائع ويعرض ما لديه من عقارات. ممثّل المشتري يعمل لصالحك: يبحث في السوق كله عمّا يناسب هدفك، يحلّل الأرقام، ويفاوض لخفض السعر." },
      { q: "كم أتعابك؟", a: `${feeText("ar")} من قيمة العقار، مكتوبة في عقد وساطة موثّق، وتُستحق عند إتمام الصفقة والإفراغ فقط. لا دفعات مقدّمة ولا رسوم استشارة.` },
      { q: "هل أنت مرخّص؟", a: licAr },
      { q: "هل الاستشارة الأولى مجانية فعلًا؟", a: "نعم، ٢٠–٣٠ دقيقة بدون أي التزام. نحدد فيها هدفك وميزانيتك، وأقول لك بصراحة ما يمكن تحقيقه." },
      { q: "في أي مدن تعمل؟", a: `في ${citiesText("ar")}. وإذا كنت مرنًا في الموقع، أقارن لك بين فرص المدينتين بحيادية.` },
      { q: "هل تعمل مع مستثمرين من خارج المدينة؟", a: "نعم. أعاين نيابة عنك بتقارير مصوّرة ومرئية، وتتم الإجراءات عبر الوكالة الإلكترونية والمنصات الرسمية." },
    ]],
    ["عن التكاليف والأنظمة", [
      { q: "ما التكاليف الإضافية على سعر العقار؟", a: "أهمها ضريبة التصرفات العقارية (٥٪ من قيمة الصفقة، مع إعفاء المسكن الأول للمواطن ضمن حدود وشروط)، وعمولة الوساطة (المتعارف عليها ٢٫٥٪ من قيمة الصفقة)، إضافة إلى التقييم والفحص والتجهيز حسب الحالة." },
      { q: "من يدفع ضريبة التصرفات العقارية؟", a: "الأصل أنها على البائع نظامًا، لكن في الواقع كثيرًا ما يُتفق على أن يتحملها المشتري أو تُدمج في السعر. لذلك يجب أن تكون واضحة ومكتوبة قبل الاتفاق — وهذه من نقاط التفاوض." },
      { q: "كيف أتحقق من سلامة صك العقار؟", a: "عبر المنصات الرسمية لوزارة العدل والسجل العقاري، للتأكد من ملكية البائع وخلوّ العقار من الرهن أو الإيقاف. أتحقق من ذلك قبل أي توصية." },
    ]],
    ["عن الاستثمار", [
      { q: "ما العائد الإيجاري الجيد في السعودية؟", a: "لا يوجد رقم واحد؛ يعتمد على نوع العقار والحي والمخاطر. الأهم أن تقارن العائد الصافي (بعد كل التكاليف) لا الإجمالي. استخدم حاسبة العائد في الموقع لترى الفرق بنفسك." },
      { q: "أستثمر في الرياض أم جدة؟", a: "لكل مدينة منطق مختلف: الرياض سوق أكبر يقوده النمو الاقتصادي والمشاريع الكبرى، وجدة سوق ساحلي تؤثر فيه الواجهة البحرية والمواسم ومشاريع التطوير. الاختيار يعتمد على هدفك وميزانيتك." },
      { q: "أرض أم عقار مبني؟", a: "الأرض مرنة وبدون صيانة لكنها لا تدرّ دخلًا وقد تخضع لرسوم الأراضي البيضاء. العقار المبني يعطي دخلًا فوريًا مع تكاليف تشغيل. الاختيار يعتمد على هدفك وسيولتك وأفقك الزمني." },
      { q: "هل أشتري كاش أم بتمويل؟", a: "التمويل قد يرفع العائد على رأس مالك إذا كان العائد الصافي أعلى من تكلفة التمويل، ويخفضه إذا كان أقل. أحسب لك السيناريوهين قبل القرار." },
      { q: "هل البيع على الخارطة آمن؟", a: "المشاريع المرخّصة ضمن برنامج البيع على الخارطة (وافي) تخضع لضوابط وحسابات ضمان، لكن تبقى مخاطر التأخير وجودة التنفيذ. أراجع ترخيص المشروع وسجل المطوّر والعقد قبل أي توصية." },
    ]],
  ],
  en: [
    ["Service & fees", [
      { q: "What's the difference between a buyer's agent and a typical agent?", a: "A typical agent usually represents the seller and shows their own listings. A buyer's agent works for you: searching the whole market for what fits your goal, analyzing the numbers and negotiating the price down." },
      { q: "What is your fee?", a: `${feeText("en")} of the property price, written into a documented brokerage agreement and due only when the deal closes. No upfront payments or consultation fees.` },
      { q: "Are you licensed?", a: licEn },
      { q: "Is the first consultation really free?", a: "Yes — 20–30 minutes, no obligation. We define your goal and budget and I tell you honestly what's achievable." },
      { q: "Which cities do you cover?", a: `${citiesText("en")}. If you're flexible on location, I'll compare opportunities across both neutrally.` },
      { q: "Do you work with investors outside the city?", a: "Yes. I view on your behalf with photo and video reports, and the process is completed via e-power of attorney and official platforms." },
    ]],
    ["Costs & regulations", [
      { q: "What costs come on top of the price?", a: "Mainly Real Estate Transaction Tax (5% of the deal value, with a first-home exemption for citizens within limits) and brokerage (customarily 2.5% of the deal value), plus valuation, inspection and fit-out as needed." },
      { q: "Who pays the transaction tax?", a: "By default the seller, but in practice it's often agreed that the buyer pays it or it's built into the price. It must be clear and written before agreement — it's a negotiation point." },
      { q: "How do I verify a title deed?", a: "Through the official Ministry of Justice and Real Estate Registry platforms, confirming the seller's ownership and that there's no mortgage or hold. I check this before any recommendation." },
    ]],
    ["Investing", [
      { q: "What's a good rental yield in Saudi Arabia?", a: "There's no single number — it depends on property type, district and risk. Compare net yield (after all costs), not gross. Use the site's ROI calculator to see the difference." },
      { q: "Riyadh or Jeddah?", a: "Different logic: Riyadh is the larger market driven by economic growth and mega projects; Jeddah is a coastal market shaped by the waterfront, seasonality and redevelopment. The right choice depends on your goal and budget." },
      { q: "Land or built property?", a: "Land is flexible and maintenance-free but earns nothing and may be subject to white-land fees. Built property earns immediately but has running costs." },
      { q: "Cash or financing?", a: "Financing lifts the return on your capital only if net yield exceeds the financing cost. I model both scenarios before you decide." },
      { q: "Is off-plan safe?", a: "Projects licensed under Wafi are subject to controls and escrow accounts, but delay and build-quality risks remain. I review the license, developer record and contract first." },
    ]],
  ],
};

function faq(lang) {
  const ar = lang === "ar";
  const p = pre(lang);
  const title = ar ? "الأسئلة الشائعة عن الوساطة والاستثمار العقاري" : "FAQ: Buying Investment Property in Saudi Arabia";
  const all = FAQ[lang].flatMap(([, items]) => items);
  const body = (crumbs) => `
${pageHero(lang, { crumbs, kicker: ar ? "أسئلة شائعة" : "FAQ", title, lead: ar ? "إجابات مباشرة عن أكثر ما يسأله المستثمرون قبل الشراء." : "Straight answers to what investors ask most before buying." })}
<section class="section section-tight"><div class="wrap">
${FAQ[lang].map(([h, items]) => `<div class="split-2 faq-group"><h2>${h}</h2>${faqBlock(items)}</div>`).join("")}
<p class="note">${ar ? "المعلومات عامة للتوعية وقد تتغير الأنظمة؛ تحقق دائمًا من الجهات الرسمية أو اسألني عن حالتك." : "General information only; regulations change. Always confirm with official sources or ask me about your case."}</p>
</div></section>
${ctaBand(lang, ar ? "سؤالك غير موجود؟" : "Question not here?", ar ? "أرسله لي على واتساب وأرد عليك مباشرة." : "Send it to me on WhatsApp and I'll answer directly.")}`;
  return {
    key: "faq",
    lang,
    path: p + "/faq/",
    title,
    description: ar
      ? `إجابات عن أسئلة المستثمرين: أتعاب الوسيط (${feeText("ar")})، ضريبة التصرفات العقارية، التحقق من الصك، العائد الإيجاري، التمويل، والاستثمار في الرياض وجدة.`
      : `Investor questions answered: broker fees (${feeText("en")}), transaction tax, title verification, rental yield, financing, and Riyadh vs. Jeddah.`,
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
  const reach = cfg.email ? `<a href="mailto:${esc(cfg.email)}">${esc(cfg.email)}</a>` : `<a href="${waLink(ar ? "طلب بخصوص بياناتي الشخصية" : "Request about my personal data")}">${ar ? "واتساب" : "WhatsApp"}</a>`;
  const body = (crumbs) => `
${pageHero(lang, { crumbs, title })}
<section class="section section-tight"><div class="wrap"><div class="prose narrow">
${
  ar
    ? `<p>نحترم خصوصيتك ونلتزم بنظام حماية البيانات الشخصية في المملكة العربية السعودية.</p>
<h2>ما البيانات التي نجمعها؟</h2><p>فقط ما ترسله بنفسك عبر نموذج الطلب أو واتساب أو الاتصال: الاسم، رقم الجوال، وتفاصيل طلبك الاستثماري.</p>
<h2>كيف نستخدمها؟</h2><p>للتواصل معك بخصوص طلبك فقط. لا نبيع بياناتك ولا نشاركها مع أي طرف ثالث لأغراض تسويقية، ولا نشارك ميزانيتك مع أي بائع دون إذنك.</p>
<h2>التحليلات</h2><p>قد نستخدم أدوات تحليل مجهولة الهوية لفهم أداء الموقع وتحسينه.</p>
<h2>حقوقك</h2><p>يمكنك طلب الاطلاع على بياناتك أو تصحيحها أو حذفها في أي وقت عبر ${reach}.</p>`
    : `<p>We respect your privacy and comply with the Saudi Personal Data Protection Law.</p>
<h2>What we collect</h2><p>Only what you send via the brief form, WhatsApp or phone: name, mobile number and your investment request details.</p>
<h2>How we use it</h2><p>Solely to contact you about your request. We never sell or share your data for marketing, and never share your budget with a seller without permission.</p>
<h2>Analytics</h2><p>We may use anonymous analytics to understand and improve site performance.</p>
<h2>Your rights</h2><p>You can request access, correction or deletion of your data at any time via ${reach}.</p>`
}
</div></div></section>`;
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
    body: `<section class="page-hero"><div class="wrap center"><p class="kicker">٤٠٤</p><h1>الصفحة غير موجودة</h1><p class="lead">يبدو أن الرابط تغيّر. جرّب إحدى هذه الصفحات:</p><div class="hero-actions center-actions">${btn(url("/"), "الرئيسية")} ${CITIES.map((c) => btn(url(`/${c.slug}/`), c.ar, "btn-outline")).join(" ")} ${btn(url("/guides/"), "أدلة المستثمر", "btn-outline")}</div><p lang="en" dir="ltr">Page not found — <a href="${url("/en/")}">English home</a></p></div></section>`,
  };
}

export default function core() {
  return ["ar", "en"].flatMap((l) => [services(l), howItWorks(l), about(l), contact(l), faq(l), privacy(l)]).concat(notFound());
}
