// ============================================================================
//  SITE CONFIG: the ONLY file you need to edit with your personal details.
//  Anything marked  TODO  is still missing. Replace it, then run:  node build.mjs
// ============================================================================

export default {
  // --- Domain ---------------------------------------------------------------
  // Final public URL, no trailing slash. When you buy a domain, put it in
  // `customDomain` (e.g. "alkuthami.sa") and it takes over automatically.
  siteUrl: "https://abdulazizma.github.io/AbdulazizMA",
  customDomain: "",

  // --- You ------------------------------------------------------------------
  name: { ar: "عبدالعزيز القثامي", en: "Abdulaziz Alkuthami" }, // check the Arabic spelling
  brand: { ar: "عبدالعزيز القثامي", en: "Abdulaziz Alkuthami" }, // personal brand = name on Google
  role: { ar: "وسيط عقاري مرخّص للمستثمرين", en: "Licensed Buyer's Agent for Investors" },
  // Optional short personal story for the About page (2–4 sentences, first person).
  bio: { ar: "", en: "" },
  photo: "", // e.g. "assets/abdulaziz.jpg" once you have one. Empty = typographic design.

  // REGA FAL license. Displaying it on brokerage advertising is a legal
  // requirement, so fill it in before sharing the site publicly.
  falLicense: "", // TODO: رقم رخصة فال
  crNumber: "", // optional: السجل التجاري

  // --- Fees -----------------------------------------------------------------
  feePercent: 2.5, // % of the property price, paid by the client at closing

  // --- Contact --------------------------------------------------------------
  phone: "+966561056054",
  whatsapp: "966561056054",
  email: "", // optional: shown in the footer/contact page when set
  formEndpoint: "", // optional Formspree endpoint: form leads also land in email

  // --- Markets (first one = primary base in Google data) ---------------------
  cities: [
    {
      slug: "riyadh",
      ar: "الرياض",
      en: "Riyadh",
      region: { ar: "منطقة الرياض", en: "Riyadh Province" },
      regionCode: "SA-01",
      geo: { lat: 24.7136, lng: 46.6753 },
    },
    {
      slug: "jeddah",
      ar: "جدة",
      en: "Jeddah",
      region: { ar: "منطقة مكة المكرمة", en: "Makkah Province" },
      regionCode: "SA-02",
      geo: { lat: 21.5433, lng: 39.1728 },
    },
  ],
  hours: "Su-Th 09:00-21:00, Sa 16:00-21:00",

  // --- Proof (NEVER invent these; they stay hidden until real) ---------------
  // { value: "35+", label: { ar: "صفقة", en: "deals" } }
  stats: [],
  // { name: "أبو محمد", quote: { ar: "...", en: "..." }, detail: { ar: "مستثمر — عمارة في الياسمين", en: "..." } }
  testimonials: [],
  yearsExperience: 0,

  // --- Links ----------------------------------------------------------------
  googleBusinessProfileUrl: "",
  googleReviewUrl: "",
  social: { x: "", instagram: "", snapchat: "", tiktok: "", linkedin: "", youtube: "" },

  // --- Analytics / verification (free, optional) -----------------------------
  googleSiteVerification: "",
  bingSiteVerification: "",
  ga4Id: "",
};
