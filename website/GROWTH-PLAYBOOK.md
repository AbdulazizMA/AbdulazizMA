# Growth Playbook: getting clients from Google without ads

The website is the storefront. This document is the plan that sends people to it and turns them into clients. Follow it in order. The first two weeks matter most.

---

## 0. The strategy in one paragraph

Most agents in Saudi Arabia are **seller-side marketers** competing on listings. You win by being the opposite: **the investor's advocate**, the licensed buyer's agent who runs the numbers, negotiates the price down, and will say "don't buy." That positioning is:

- **Differentiated:** almost nobody claims it.
- **Content-friendly:** investors search for numbers, costs and risks, which you now answer.
- **High-trust:** a FAL license, a documented brokerage contract and written deal memos.

Everything below reinforces that one idea.

**Your offer ladder:**

1. **Free:** the ROI calculator, the guides and the district analyses. These attract people and build trust.
2. **Free:** a 20-minute "goal session" call. This qualifies the lead.
3. **Paid:** full buyer representation under a brokerage agreement. Your commission comes on closing.
4. **Repeat and referral:** portfolio reviews for past clients. Every closed client should bring you 1–2 more.

---

## 1. Where investors will find you on Google

Searches like "وسيط عقاري الرياض" show three kinds of results. You need to be in all three:

| Surface | What wins it | Time to results |
|---|---|---|
| **Map pack** (the 3 businesses shown on a map) | Google Business Profile, reviews, proximity, activity | **2–8 weeks** ← fastest lever |
| **Organic results** | This website: relevant pages, content, links, speed | 3–6 months |
| **"People also ask" and AI answers** | Clear FAQ answers with structured data (already built in) | 2–6 months |

---

## 2. Launch checklist (do these in order)

### Week 1

- [ ] Fill in `config.mjs` (name, FAL number, phone, WhatsApp, email, photo, bio).
- [ ] Buy a domain (a `.sa` or `.com` with your name), set `customDomain`, and deploy (see README).
- [ ] **Create your Google Business Profile** (section 3). This is the single most important step.
- [ ] Set up **Google Search Console**:
  1. Go to search.google.com/search-console, add a property, and choose "URL prefix".
  2. For verification, pick the "HTML tag" method and paste the tag's content into `googleSiteVerification`, then rebuild.
  3. Submit `https://yourdomain/sitemap.xml` under **Sitemaps**.
  4. Use **URL Inspection** to request indexing of the home page, `/contact/`, `/tools/roi-calculator/` and each guide.
- [ ] Set up **Bing Webmaster Tools**. Import from Search Console with one click.
- [ ] Create **Google Analytics 4** and paste the ID into `ga4Id`. Then mark the `generate_lead` event as a key event (conversion).
- [ ] Set up **WhatsApp Business** on your work number (section 6).

### Week 2

- [ ] Ask your **first 5–10 happy past clients or contacts** for Google reviews (section 3.4).
- [ ] Create or complete profiles on **Aqar, Bayut, Wasalt, LinkedIn, X, Snapchat, Instagram and TikTok**. Put the **same name, phone and website** on every one. Consistent name, address and phone (called "NAP") is a local ranking signal.
- [ ] Add every profile URL to `config.mjs → social` and `googleBusinessProfileUrl`. This builds a verified entity web for Google.
- [ ] Publish your first new guide (section 5).

---

## 3. Google Business Profile: your #1 free lead source

### 3.1 Setup

- Go to **business.google.com**, then Add business.
- **Name:** exactly **"عبدالعزيز القثامي"**, matching the website and your FAL license. **Never** stuff keywords like "Best Realtor Riyadh". Google suspends profiles for it.
- **Primary category:** *Real estate agent* (وكيل عقارات). **Secondary:** *Real estate consultant*.
- **Location:** if you have no office clients visit, choose **service-area business**, hide the address, and add **both Riyadh and Jeddah** as service areas. Google allows one profile per real business, so don't create a second fake "Jeddah office". If you later open a real office in one city, verify that address.
- **Phone:** your WhatsApp number. **Website:** your domain.
- **Hours:** real hours. Accurate hours matter for ranking.
- **Services:** add each service from the Services page, one entry each.

### 3.2 Description (ready to paste, 750 characters max)

```
وسيط عقاري مرخّص من الهيئة العامة للعقار (رخصة فال رقم ______) في الرياض وجدة، أمثّل المستثمر لا البائع.
أساعد المستثمرين المحليين على شراء العقار الصحيح بالسعر الصحيح: عمائر مدرّة للدخل، أراضٍ للاستثمار، فلل ودبلكسات، ومشاريع على الخارطة.
لكل عقار أرشّحه ملف تحليل مكتوب: مقارنة بصفقات مسجّلة، التكاليف الكاملة (ضريبة التصرفات والسعي)، العائد الصافي، والمخاطر — مع توصية واضحة: اشترِ، فاوض، أو اترك.
أتفاوض نيابة عنك وأتابع حتى الإفراغ. عقد وساطة موثّق، وأتعاب ٢٫٥٪ من قيمة العقار تُستحق عند الإفراغ فقط.
الاستشارة الأولى مجانية.
```

### 3.3 Keep it active (15 minutes a week)

- **Weekly Google Post:** reuse your latest guide, a "mistake of the week" or an anonymized deal breakdown. Always link to the site.
- **Photos:** 2–3 a month. Include you at viewings (no client faces without permission), districts, and deal-memo screenshots (anonymized). Profiles with real photos get far more calls.
- **Q&A:** post and answer the top 5 FAQs yourself.

### 3.4 Reviews, the ranking factor you control most

**Goal:** 10 reviews in month 1, then 3–5 every month after. Send your Google review link (in GBP, choose "Ask for reviews") right after a win: a closed deal, a useful consultation, or a deal you talked someone *out of*.

WhatsApp template:

```
السلام عليكم [الاسم]، سعدت جدًا بالعمل معك 🌿
لو كانت تجربتك إيجابية، يسعدني جدًا تقييمك على قوقل — يساعد مستثمرين غيرك يوصلون لي:
[رابط التقييم]
جزاك الله خير 🙏
```

Rules:

- **Reply to every review** within 24 hours and mention the service naturally, for example "سعدت بمساعدتك في شراء عمارتك في الياسمين".
- **Never** buy reviews, write fake ones, or offer rewards for reviews. Google removes them and can suspend the profile. The site also deliberately shows **no** testimonials until you add real ones.
- Add your best 3 review quotes to `config.mjs → testimonials` (with permission).

---

## 4. Keyword map: which page ranks for what

| Search (Arabic) | Target page |
|---|---|
| وسيط عقاري مرخص · وسيط عقاري للمستثمرين | Home |
| وسيط عقاري الرياض · مسوق عقاري الرياض · مكتب عقار الرياض | `/riyadh/` |
| وسيط عقاري جدة · مسوق عقاري جدة · مكتب عقار جدة | `/jeddah/` |
| كم عمولة الوسيط العقاري · السعي كم نسبة | `/how-it-works/` + city pages (FAQ) |
| وسيط عقاري للمستثمرين · شراء عقار استثماري الرياض | Home / Services |
| عمائر للبيع الرياض استثمار · شراء عمارة مؤجرة | Services (#income) |
| أراضي للاستثمار الرياض | Services (#land) + Al Arid page |
| الاستثمار العقاري في حي [X] · [X] للاستثمار | `/riyadh/[x]/` or `/jeddah/[x]/` |
| حاسبة العائد الإيجاري · حساب العائد على العقار | Calculator + yield guide |
| تكاليف شراء عقار · ضريبة التصرفات العقارية كم | Costs guide |
| كيف اتحقق من صك العقار · قبل شراء عقار | Due-diligence guide |
| ارض ولا عمارة · افضل استثمار عقاري | Land vs. building guide |

**Rule:** one page per search intent. Don't write two articles competing for the same query.

---

## 5. The content engine: 2 articles a month

Each article must answer **one** investor question better than anything else on page 1, include **your** field experience, and end with a call to action. Add it to `src/pages/guides.mjs`.

**Next 24 articles, in priority order:**

1. البيع على الخارطة (وافي): كيف تتحقق من المشروع قبل الدفع
2. شراء عمارة مؤجرة: ١٠ أسئلة اسألها للبائع
3. التمويل العقاري للمستثمر: متى يرفع العائد ومتى يدمّره (with a financing example)
4. رسوم الأراضي البيضاء: هل تنطبق على أرضك؟ (update whenever the rules change)
5. كيف تفاوض على سعر عقار: ٧ أوراق قوة للمشتري
6. دبلكس أم شقة أم دور: أيها أفضل للتأجير في الرياض؟
7. الإيجار في الرياض: ماذا تعني الأنظمة الجديدة للمستثمر؟ (keep current)
8. كيف تقرأ مؤشرات وزارة العدل العقارية وتقارن الأسعار بنفسك
9. أخطاء المستثمر العقاري الأول (من صفقات حقيقية، anonymized)
10. عقد الوساطة العقارية: ماذا يجب أن يتضمن؟
11. الاستثمار العقاري بمليون ريال: ٣ سيناريوهات بالأرقام
12. …بمليوني ريال · 13. …بخمسة ملايين
14. التطوير الصغير: شراء أرض وبناء فيلا للبيع (دراسة مبسطة)
15. المحلات التجارية: متى تكون استثمارًا جيدًا؟
16. إدارة الأملاك: بنفسك أم عبر شركة؟ (with a cost comparison)
17. اتحاد الملاك: ما تحتاج معرفته قبل شراء شقة
18. الفحص الفني قبل الشراء: ماذا يشمل وكم يكلف؟
19. متى تبيع عقارك الاستثماري؟
20. أحياء شرق الرياض للمستثمر: مقارنة
21. أحياء شمال الرياض للمستثمر: مقارنة
22. الشراء من خارج الرياض: كيف تستثمر عن بُعد بأمان
23. الوكالة الإلكترونية لشراء العقار: خطوة بخطوة
24. تقرير ربعي: ماذا حدث في سوق الرياض هذا الربع؟ (recurring, and very linkable)

**Also add district pages** for every district where you actually do deals. Each one needs genuinely different local insight. Candidates:

- **Riyadh:** الصحافة, الربيع, القيروان, العليا, الندى, المونسية, قرطبة
- **Jeddah:** السلامة, الخالدية, النعيم, الروضة, البساتين, الفيصلية, المرجان, أبحر الجنوبية

Also write two Jeddah-specific guides: **"التأجير قصير المدى في جدة: هل هو مجدٍ؟"** and **"شراء عقار قريب من البحر: ما الذي تفحصه؟"**

**Repurpose every article** into:

- a 60-second Snapchat, TikTok or Reels video
- an X thread
- a Google Business Profile post
- a LinkedIn post

Every piece links back to the article. This is how one article becomes a week of content.

---

## 6. WhatsApp Business: where leads convert

Most of your leads will arrive on WhatsApp. Handle them like a system.

- **Speed:** reply within **5 minutes** during working hours. Response speed is the biggest single conversion factor.
- **Greeting message** (auto):
  ```
  أهلًا وسهلًا 👋 معك عبدالعزيز القثامي، وسيط عقاري مرخّص (فال ______).
  عشان أخدمك بشكل صحيح، أرسل لي باختصار:
  ١) المدينة: الرياض أم جدة؟  ٢) هدفك: دخل شهري أم نمو؟  ٣) الميزانية التقريبية  ٤) كاش أم تمويل؟
  وأرد عليك في أقرب وقت.
  ```
- **Away message:** state your working hours and point to the calculator link.
- **Quick replies:** `/costs` for the costs guide link, `/calc` for the calculator, `/process` for the how-it-works link, and `/fal` for your license verification.
- **Labels:** New lead → Qualified → Goal call booked → Brokerage agreement signed → Deal memo sent → Under negotiation → Closed → Review requested.
- **Follow-up:** day 1, day 3, day 7, then monthly with a relevant new opportunity or article. Most deals close on follow-up, not on the first message.

### The deal memo, your signature deliverable

Send every shortlisted property as a one-page PDF memo containing:

- property summary
- comparables (registered transactions)
- full cost table
- gross, net and cash-on-cash returns
- risks
- negotiation points
- a verdict: **Buy / Negotiate / Walk away**

This one document is what makes clients trust you, pay you, and refer others. Screenshots of memos (anonymized) are also your best social content.

---

## 7. Links and authority (off-site)

Google trusts sites that other trusted sites mention. Work on these, roughly in order of effort:

1. **Profiles** on every portal and social platform above, each linking to your site.
2. **Partner referrals:** mortgage advisors, certified valuers, inspection companies, property managers and real-estate lawyers. Refer to each other and ask for a "trusted partners" link on their sites.
3. **Linkable assets:** the calculator and a quarterly market report. Share them in investor WhatsApp groups, X spaces and LinkedIn.
4. **Local media and podcasts:** pitch expert commentary on market regulation changes. Journalists need licensed voices.
5. **Speaking:** investor meetups and chamber-of-commerce events. Ask organizers to link your site.

---

## 8. Compliance (protects your license and your rankings)

- **FAL license:** displayed on every page (already built in).
- **Property ad license:** every *specific property* you advertise (on the site, social media or portals) needs a REGA advertising license, and its number must appear in the ad. If you later add property listings to the site, include each listing's ad license number.
- **Brokerage agreement:** sign a documented brokerage contract before you represent anyone, as required by the Brokerage Law.
- **Personal data (PDPL):** use lead data only to serve that lead. A privacy page is already included.
- **Honest marketing:** no fake reviews, no invented stats, and no guaranteed returns. The site is written this way on purpose.

*(Regulations change. Re-check REGA's current rules every few months.)*

---

## 9. What to measure (monthly, 20 minutes)

| Metric | Where | Month-3 target | Month-6 target |
|---|---|---|---|
| Google reviews | GBP | 15+ | 30+ |
| GBP calls, WhatsApp taps and website clicks | GBP Performance | growing monthly | 2–3× month 1 |
| Search impressions and clicks | Search Console | ranking for district and guide keywords | page 1 for 10+ keywords |
| `generate_lead` events | GA4 | tracked | growing monthly |
| Qualified leads → goal calls → agreements → closings | your WhatsApp labels | know your ratios | improve the weakest step |

**Realistic expectations:**

- The Business Profile can bring calls within weeks.
- Organic Google traffic compounds from about month 3 to 6.
- Consistency beats intensity: two good articles a month for a year beats 20 rushed ones.

---

## 10. Your 90-day plan

| Days | Focus |
|---|---|
| 1–7 | Config, domain, deploy, Business Profile, Search Console, WhatsApp Business |
| 8–30 | 10 reviews, all profiles live, 2 new guides, 4 GBP posts, partner outreach (5 partners) |
| 31–60 | 2 guides, 3 new district pages, first quarterly market report, 3–4 short videos a week |
| 61–90 | 2 guides, review Search Console queries and improve the pages ranking #5–#20, ask every closed client for a review and a referral |
