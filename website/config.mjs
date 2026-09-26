// ============================================================================
//  SITE CONFIG — the ONLY file you need to edit with your personal details.
//  Anything marked  TODO  is a placeholder. Replace it, then run:  npm run build
// ============================================================================

export default {
  // --- Domain ---------------------------------------------------------------
  // Final public URL, no trailing slash. When you buy a domain (recommended),
  // put it here, e.g. "https://abdulaziz-realestate.sa" and set `customDomain`.
  siteUrl: "https://abdulazizma.github.io/AbdulazizMA",
  customDomain: "", // e.g. "abdulaziz-realestate.sa" -> writes a CNAME file

  // --- You ------------------------------------------------------------------
  name: { ar: "عبدالعزيز", en: "Abdulaziz" }, // TODO: full name as on your FAL license
  brand: { ar: "عبدالعزيز للاستثمار العقاري", en: "Abdulaziz Real Estate Advisory" }, // TODO
  role: { ar: "وسيط عقاري مرخّص — ممثل المشتري المستثمر", en: "Licensed Buyer's Agent for Property Investors" },
  // Optional personal story shown on the About page (2–4 sentences, first person).
  // Real details (background, why you started, a deal you're proud of) build trust.
  bio: { ar: "", en: "" }, // TODO
  photo: "", // TODO: e.g. "assets/abdulaziz.jpg" (put the file in src/assets). Empty = monogram.

  // REGA (الهيئة العامة للعقار) FAL license. Displaying it is a legal
  // requirement for brokerage advertising in KSA — and a huge trust signal.
  falLicense: "0000000000", // TODO: your رخصة فال number
  crNumber: "", // optional: commercial registration (السجل التجاري)

  // --- Contact --------------------------------------------------------------
  phone: "+966500000000", // TODO: international format, no spaces
  whatsapp: "966500000000", // TODO: digits only, with country code
  email: "hello@example.com", // TODO
  // Optional: a Formspree (free) endpoint so form leads also land in your email.
  // Leave empty and the form sends the lead straight to your WhatsApp.
  formEndpoint: "",

  // --- Market ---------------------------------------------------------------
  city: { ar: "الرياض", en: "Riyadh" }, // TODO if you work in another city
  region: { ar: "منطقة الرياض", en: "Riyadh Province" },
  address: {
    street: "", // optional office address; leave empty if you work without an office
    district: { ar: "", en: "" },
    postalCode: "",
  },
  geo: { lat: 24.7136, lng: 46.6753 }, // city center; set to your office if you have one
  hours: "Su-Th 09:00-21:00, Sa 16:00-21:00", // schema.org openingHours format

  // --- Proof (NEVER invent these — leave empty until real) --------------------
  // Each: { value: "35+", label: { ar: "...", en: "..." } }
  stats: [],
  // Each: { name: "أبو محمد", quote: { ar: "...", en: "..." }, detail: { ar: "مستثمر — فيلا في النرجس", en: "..." } }
  testimonials: [],
  yearsExperience: 0, // TODO: 0 hides it

  // --- Links ----------------------------------------------------------------
  googleBusinessProfileUrl: "", // TODO after creating your Google Business Profile
  googleReviewUrl: "", // the "ask for review" short link from Google Business Profile
  social: {
    x: "", // e.g. "https://x.com/yourhandle"
    instagram: "",
    snapchat: "",
    tiktok: "",
    linkedin: "",
    youtube: "",
  },

  // --- Analytics / verification (all free, all optional) ---------------------
  googleSiteVerification: "", // Google Search Console "HTML tag" content value
  bingSiteVerification: "",
  ga4Id: "", // e.g. "G-XXXXXXX"
};
