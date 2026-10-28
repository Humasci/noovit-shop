# Noovit — Content creation guidelines

_v1 · 28 Oct 2026. Covers the website (guides, product pages, comparisons, goal pages, blog), reviews, Google Shopping and social. Read with `SEO_PLAN.md` (search strategy) and `LAUNCH_AUDIT.md` (compliance checklist)._

---

## 1. Who we write for, and how we sound

**Audience: broad, including biohackers.** That means people who want to feel better (sleep, stress, gut, joints, energy) and optimisers who compare forms, doses and stacks.

**Voice: nerdy and data-forward, in plain words.**
- Lead with the answer, then the numbers: study size, dose, duration, effect size, units (mg, mcg, FU, CFU, % withanolides).
- Show our working: link every claim to its source and grade the evidence.
- Respect the reader. No hype, no "miracle", no fear-mongering, no "doctors hate this".
- Say what we don't know. Null and negative results are part of the story.
- Spelling: US English (color, fiber, flavor, micronized, "hot flashes"). Brand: "noovit⁺" is the logo; in prose write **Noovit**.

**Presenters:**
- **AI avatar** (or the owner on camera, if she chooses): high-volume explainers.
- **Real dietitian**: credibility. Reviews guides, records "What I tell my clients" clips, and is named on reviewed pages.

---

## 2. Content types at a glance

| Type | URL | Job | Depth |
|---|---|---|---|
| **Ingredient guide** | `/guides/<ingredient>` | Rank for "[ingredient] benefits / side effects / dosage", feed AI answers and PAA | **Nerdy, exhaustive**, evidence-graded, 8–20 sources |
| **Product page** | `/products/<slug>` | Convert and rank for "[ingredient] supplement" and buyer questions | **Comprehensive, buyer-focused**: what's in it, why this dose, proof of quality, FAQ |
| **Comparison** | `/guides/<a>-vs-<b>` (planned) | "X vs Y", "glycinate vs citrate" | Side-by-side table + verdict by use case |
| **"Can I take X with Y?"** | `/guides/<x>-and-<y>` (planned) | Very specific safety questions | Short answer + mechanism + sources; always "ask your doctor/pharmacist" |
| **Goal page** | `/goals/<goal>` | "supplements for sleep" etc. | Short intro + matched products + quiz |
| **Bundle page** | `/products/<bundle>` | Higher order value, routines | Why these together, what's inside, savings |
| **Blog (Journal)** | `/blog/<slug>` | News, myth-busting, routines, behind the bottle | Opinionated, linked to guides |

**Golden rule:** the **guide is the library**, the **product page is the shop counter**. The guide goes deep on the ingredient for everyone. The product page answers everything a buyer needs about *our* bottle, summarises the science in a few lines, and links to the guide.

---

## 3. What we learned from the search results (and what we copy)

### 3.1 Double Wood, nattokinase product page (ranks on page 1)
**Why it does well, and our implementation:**

| What they do | Why it helps | Noovit implementation |
|---|---|---|
| Keyword in **title, URL and H1** ("Nattokinase Supplement (4000 FU)") | Clear relevance | Product title tag = `[Name] — [key spec] Supplement | Noovit`. URL = ingredient slug. H1 = product name. Put the strength in the SEO title. |
| **~1,500 words** on the product page: description, benefits, directions, "The Science Behind…" | A product page that is also a mini guide ranks for informational and buying queries | Product page sections in §5: a 3–5 line science summary with 2–3 linked studies, plus a link to the full guide |
| **7-question FAQ** matching real searches (FU vs mg, timing, blood thinners, testing, time to results) | Wins long-tail and PAA | Every product page has 6–10 buyer FAQs (§5.6) |
| **Certificate of analysis on the page** (lot, potency 4,664 FU vs spec ≥3,600, heavy metals, microbes, expiry) | Unique, verifiable, strong trust and E-E-A-T | **A "Lab results" block per product** once Supliful supplies COAs: lot, test date, potency vs label, heavy metals, microbes, PDF link |
| **Clear safety**: soy allergy, anticoagulant warnings | Trust; also needed for YMYL topics | A "Who shouldn't take it" box on every product page |
| **Reviews**: on-site widget (36) + AI summary; **3,000+ on Amazon** | Social proof, brand demand, rich results | Review requests after every order (built). Product ratings in Google via an aggregator (§8). Amazon later. |
| **Price-per-dose value** ($19.95 for a 60-day supply) | Comparison shoppers convert | Show "$x per day" and "x-day supply" on product pages and cards |
| **Pairs well with** links | Internal links, order value | "Pairs well with" (by goal), "Bundles with this product", "Learn more" (guide and goal pages): built |
| **Retail presence** (Target, Vitacost) and brand searches | Authority signals | Later: Amazon, then retail/marketplaces |

**Their weaknesses, which we must beat:**

| Weakness | Our rule |
|---|---|
| Studies named but **not linked**, no full references | Every study is linked (PubMed/PMC/DOI) with a full reference |
| Typos ("effect circulation"), **duplicated sections** (Benefits ×2) | One H2 per topic; proofread; no repeated blocks |
| **Generic image alt text** ("Nattokinase Supplement" ×7) | Descriptive alt per image: "Noovit Magnesium Sleep+ Supplement Facts panel" |
| Customer Q&A about blood pressure answered "email us" | Answer every on-site question publicly, within compliance (or link the guide) |
| **Risky mechanistic claims** ("lowering plasma levels of certain proteins") | Structure/function claims only on product pages; research findings live in guides, described as findings with sources |
| Data glitches: rating "4.8055553", 235 mg vs 200 mg mismatch, backordered variant still "Add to cart" | Round ratings to one decimal; facts must match the label; out-of-stock variants are disabled |
| Recommends D3+K2 but **doesn't link it** | Every product mentioned is linked |

### 3.2 WebMD, nattokinase (ranks high on authority)
**Copy:** "Medically reviewed by [name, MD], [date]", short sections, a takeaways box, a FAQ, a sources list.
**Beat:** WebMD's "dosage" heading gives **no dose**, unsourced claims (flights, Alzheimer's), **no study sizes or results**, contradictory interaction advice, nothing on choosing a product. Our guides give the dose and source, grade each claim, report sizes and effects, keep advice consistent, and include "How to choose".

### 3.3 More from competitors (owner finds, 28 Oct)
**Double Wood, menu and site-wide signals:**
- **Menu by need, not by ingredient:**
  - Overall Health & Wellness · Mind & Mood · Physical Health · Customer Favorites · New Releases · **Featured Stacks** · **Build Your Stack** · Subscribe · Rewards
  - Takeaway: our "Shop by goal" covers needs. Add **"Stacks"** (our bundles, plus a later **Build-your-stack** tool where buying 3+ gets x% off) and a **Rewards** programme later.
- **Announcement bar with three proof points:** "Backed By Science · Rigorously Tested · Free Shipping on Orders $30+". Takeaway: our announcement bar can carry "Evidence-graded · Third-party tested (once documented) · Free US shipping".
- **Pop-up that asks "What's your primary health concern?"**
  - It segments visitors (and their emails) by goal before offering 25% off.
  - Takeaway: when we switch on the newsletter pop-up, ask the goal first (Sleep & stress · Focus · Gut · Longevity · Other). This lets us send goal-specific emails and link the quiz.

**Naomi (found via Google Shopping), clinician trust and HSA/FSA:**
- **"Clinicians' Choice: 770 clinicians share this on FrontrowMD without compensation"**, with clinician faces and a link to view them.
  - FrontrowMD is a third-party platform where clinicians recommend products to patients; the badge shows how many share it.
  - It is a powerful, verifiable trust signal for YMYL purchases.
  - Takeaway: **apply to FrontrowMD** once products are final, and show the badge next to the price once real clinicians share us. Never fake it.
- **"Pay using HSA/FSA with Flex"** in the top bar.
  - Many US shoppers can pay for eligible health products with pre-tax health accounts.
  - Takeaway: look into **Flex (withflex.com)** or Truemed for HSA/FSA eligibility (some supplements qualify with a letter of medical necessity). It works with Stripe and is a strong conversion lever for a US launch.
- **Not for us:** gamified "Try your luck / match 3 cards" pop-ups and spin-to-win wheels. Tacky and off-brand, and they cheapen a science-led brand. One calm, useful pop-up at most.

### 3.4 The results page itself
Shopping ads → Shorts → AI Overview → PAA → NIH → WebMD → Shorts → Wikipedia → Amazon → brands.
→ We need a **Merchant feed** (free listings), **a Short per question**, **answer-first paragraphs**, **PAA-style FAQs**, and **long-tail pages** while authority grows.

---

## 4. Ingredient guide template (nerdy)

Use `lib/guides.ts`. The example is `/guides/nattokinase`.

1. **H1:** `[Ingredient]: benefits, uses, dosage & side effects`
2. **Byline:** Updated [date] · Reviewed by [Name, RD/MD] · [n] sources
3. **"In short"** (2–3 sentences, the AI-overview answer): what it is, the best-supported effect, the main caveat, with citations.
4. **Quick facts:** what it is · typical studied dose · strongest evidence · main risk · avoid if.
5. **On this page** (table of contents).
6. **What is it?** Mechanism in plain words, forms, units, food sources. Clear up confusions (e.g. nattokinase ≠ vitamin K2).
7. **Benefits & evidence**, one card per outcome:
   - **Evidence grade:** Moderate (several good human RCTs) · Limited (few/small or mixed) · Early (lab/biomarker) · Insufficient (trials found no effect).
   - Study design, **n**, dose, duration, **effect size with units**, and link. Include null results.
8. **"The numbers"** (optional): a table of key trials (study, n, dose, length, result).
9. **Dosage:** studied doses with sources, timing, with/without food, how long until effects, upper limits (NIH Office of Dietary Supplements UL where one exists).
10. **Forms compared** (when relevant): e.g. magnesium glycinate vs citrate vs threonate, with bioavailability and gut tolerance.
11. **Side effects:** common, rare and serious, with case reports where relevant.
12. **Interactions:** drug classes with examples (anticoagulants, SSRIs, thyroid medication…) and supplement interactions.
13. **Who should avoid it** (red box).
14. **How to choose a supplement:** units, testing, form, red flags, what to look for on the label.
15. **Biohacker corner** (optional): stacks, timing, cycling, with the evidence grade for each. Never more confident than the evidence.
16. **FAQ:** 6–10 questions taken from PAA and related searches, answered in 1–3 sentences first.
17. **From our range:** link our product(s) for this ingredient **when we sell it**, plus bundles and goal pages. If we don't sell it, link the quiz and related goals; never push an unrelated product.
18. **Sources:** numbered, full references, PubMed/PMC/DOI links. Prefer RCTs, meta-analyses, NIH ODS/NCCIH, EFSA and Health Canada.
19. **Disclaimer.**

**Schema (built):** `MedicalWebPage` + `about: DietarySupplement` (+ `reviewedBy` and `lastReviewed` when real), `FAQPage`, `BreadcrumbList`.

**Length:** whatever answers the topic completely, usually 1,500–3,000 words. No padding.

---

## 5. Product page template (comprehensive, buyer-focused)

Already built: hero, purchase box, info tabs, quality, benefits, FAQ, reviews, related, bundles, Learn more. Content per product:

1. **SEO title:** `[Product name] — [form/strength] [Ingredient] Supplement | Noovit` (e.g. "Magnesium Sleep+: Glycinate, Malate & Citrate Magnesium Supplement | Noovit"), 50–60 characters. **Meta description:** 140–155 characters with dose, count and key benefit.
2. **Above the fold:** name, one-line benefit with `*`, rating (real only), supply length and **price per day**, purchase options, delivery estimate, guarantee.
3. **What's inside:** each ingredient with amount and **why that form and dose** (one line each, linked to evidence).
4. **The science in 60 seconds:** 3–5 lines summarising the best human evidence with 2–3 linked studies, then "Read the full [ingredient] guide →".
5. **How to take it:** dose, timing, with food or not, how long until you notice anything (honest), what to pair it with (link products).
6. **Product FAQ (6–10):** buyer questions such as "How is this different from…?", "Can I take it with…?", "Is it vegan?", "How long does a bottle last?", "When will I notice a difference?", "Is it third-party tested?", "Can I take it while pregnant?" (answer: ask your doctor).
7. **Who shouldn't take it** box: allergens, medications, pregnancy, age (creatine 18+).
8. **Lab results / COA** block (once available).
9. **Supplement Facts** image, matching the real label, plus warnings (iron!).
10. **Reviews** (real; ask after every order).
11. **Bundles with this product · Pairs well with · Learn more** (guides and goal pages): built.
12. **Images:** front, duo, Supplement Facts, and later real photos and lifestyle shots. Descriptive alt text for each.
13. **Compliance:** every benefit has `*` and the FDA disclaimer nearby; structure/function wording only.

---

## 6. Internal linking rules
- **Guide → product** (when sold), bundles, goal pages, related guides, quiz.
- **Product → guide**, bundles that include it, related products (by goal), goal pages.
- **Bundle → each component product**, and the components' guides.
- **Goal page → products** (ranked by fit), the quiz, related guides.
- **Blog → guides and products** it mentions (every mention is a link).
- **Anchor text** describes the target ("magnesium dosage guide", not "click here").
- **No orphan pages:** every new page is linked from at least 2 existing pages and the sitemap.

---

## 7. Compliance (applies to everything, including social)
- **FDA (DSHEA) structure/function only:** "supports", "helps maintain". Never "treats, cures, prevents, lowers [disease marker]" as a product claim. Research findings go in guides, described as findings with sources.
- `*` plus the FDA disclaimer next to claims on product and goal pages, and at the end of guides.
- **No disease or drug comparisons:** "works like Ozempic/GLP-1", "replaces your blood thinner".
- **FTC:** reviews must be real, never incentivised without disclosure. Endorsers disclose paid relationships ("#ad", "Paid advisor"). **AI avatar videos are labelled as AI-generated.**
- **Evidence honesty:** grade it and include null results.
- **"Made in the USA", "third-party tested", "GMP":** only with supplier documents (see `LAUNCH_AUDIT.md`).
- **Sensitive groups:** pregnancy, children, medication users get "talk to your doctor or pharmacist".
- **Medical review:** guides on high-risk ingredients (nattokinase, berberine, iron, black cohosh, ashwagandha, NAC) need dietitian or doctor review before publishing.

---

## 8. Trust signals (ranked), and reviews

**Ranked by strength for a supplement brand:**
1. **Lab results per batch (COA)** on the product page.
2. **Named clinician endorsement:** our dietitian reviewer, then FrontrowMD "Clinicians' Choice" once earned.
3. **Real reviews** (on-site, Google, Trustpilot, Amazon later).
4. **Independent testing** (Labdoor, ConsumerLab, NSF certification later).
5. **Evidence-graded guides with sources.**
6. **Guarantees and policies:** 90-day money-back, cancel anytime online, free US shipping.
7. **HSA/FSA eligibility** (Flex/Truemed).
8. **Retail presence** (Amazon, then stores).

Never show a trust signal we can't back up: no invented counts, no generic "doctor recommended", no "as seen in" without proof.

### Reviews: where and how
| Where | Why | How |
|---|---|---|
| **Our site** (built: moderated, "Verified Buyer" when matched) | Conversion, product schema | Review-request email after shipping (built, Settings → days) |
| **Google: product ratings** in Shopping and free listings | Stars on Shopping results | Needs **50+ reviews** across products via an **approved aggregator** (e.g. Trustpilot, Judge.me, Yotpo, Reviews.io) or a product-review feed in Merchant Center, refreshed monthly |
| **Google Customer Reviews** (free) | Seller rating stars; feeds Google ratings | Opt-in survey after checkout. Add the Google script on `/checkout/success` |
| **Trustpilot** | Brand trust, seller ratings, ranks for "noovit reviews" | Free plan + invite links in the post-purchase email |
| **Amazon** | Volume and brand demand (Double Wood has 3,000+) | When we list (after lab testing) |
| **TikTok Shop** | Social proof on TikTok | When we join TikTok Shop |
| **Reddit and communities** (r/Supplements, r/Nootropics, r/Biohackers) | Biohackers check here first; also ranks in Google | Participate honestly as the brand; never astroturf |
| **Independent testers** (Labdoor, ConsumerLab) | Strongest third-party credibility | Submit products once stable |
| **BBB, Sitejabber** (optional) | Extra trust signals | Low priority |

---

## 9. Google Shopping: free listings first
1. Create **Google Merchant Center** (merchants.google.com) with the business Google account. Add business info, return policy, shipping (free US), and tax (US: automatic).
2. **Verify and claim** noovit.com (via Google Search Console or a meta tag; we can add the tag).
3. **Products → Add products → scheduled fetch:** `https://noovit.com/feeds/google.xml` (built, updates automatically), daily.
4. Turn on **"Free listings"** (surfaces across Google: Shopping tab, Search, Images, Lens) and **"Customer engagements"**.
5. Fix any disapprovals: price match (we default to one-time), images (real photos preferred, no text overlays; our renders include text, so replace with photos when available), GTINs (add UPCs when we buy GS1 codes; until then `identifier_exists = no`).
6. Health products: supplements are allowed, but **no disease claims** in titles or descriptions. Our feed uses product names and descriptions, so keep them compliant.
7. Later: add Google Customer Reviews, then a small **paid Shopping/Performance Max** test on 3–5 proven products.

---

## 10. Social content system (scope; to build)
**Channels, in this order:** TikTok → Instagram (Reels and carousels) → YouTube Shorts → Pinterest → X.

**Pipeline:**
1. **Source:** each guide, comparison or product update becomes a **content pack**: 5 Short scripts (one per FAQ or "the numbers" fact), 2 carousels, 1 dietitian clip brief, captions per channel, hashtags, alt text, UTM link.
2. **Create:** avatar videos (HeyGen, or the owner on camera), carousels in brand style (mosaic, navy/orange/opal), and dietitian clips recorded monthly in batches.
3. **Compliance check:** an automatic pass over every script and caption (the owner's existing compliance skill from other projects can be reused), plus an AI-disclosure label on avatar videos.
4. **Approval queue** in the admin: nothing posts without the owner's OK.
5. **Publish:** **direct API connections per platform** (owner preference), via each platform's API (TikTok Content Posting API, Instagram Graph API, YouTube Data API, Pinterest API, X API); each needs a developer app and review. The alternative is a scheduler API (Buffer is cheapest at ~$6/channel/month and has an API; Metricool bills per brand and its API needs a higher plan), which is faster to start.
6. **Measure:** views, clicks (UTM), add-to-carts and sales per post; feed the winners back into new content.

**Rhythm (target):** 1 guide or comparison a week → 5 Shorts, 2 carousels, 1 dietitian clip. Pinterest gets pins for guides and goal pages.

**Decisions pending:** presenter (owner on camera or avatar), scheduler vs direct APIs (cost vs control), and whether X is worth it for a supplement brand.

---

## 11. Research brief (per ingredient; owner runs deep research)
Ask for:
1. **Key human trials:** design, n, population, dose and form, duration, outcomes, effect sizes, link. Meta-analyses. **Null and negative results.**
2. **Official positions:** NIH ODS fact sheet, NCCIH, EFSA/Health Canada, upper limits.
3. **Safety:** side effects, case reports, interactions (drug classes and examples), contraindications, pregnancy, children.
4. **Forms compared** (bioavailability, tolerance, cost).
5. **SERP:** top 10 results for "[ingredient]", "[ingredient] benefits", "side effects", "dosage"; what each covers or misses; PAA questions; related searches; Shorts and videos ranking.
6. **Biohacker angles:** stacks, timing, cycling; Reddit and community questions; evidence for each.
7. **Product-market:** typical doses and prices on Amazon and leading brands, and how they're labelled (FU, CFU, % extract).

**First batch:** magnesium, ashwagandha, probiotics, creatine, NAC, lion's mane.

---

## 12. Workflow and upkeep
1. Research (owner) → 2. Draft (Claude) → 3. Dietitian review → 4. Publish (guide + product updates + links) → 5. Social pack → 6. Measure → 7. **Refresh every 6–12 months** (update `updated`, add new trials).

**Pre-publish checklist:**
- [ ] Answer-first summary
- [ ] Every claim sourced and graded
- [ ] Doses in units
- [ ] Null results included
- [ ] Safety and avoid-if box
- [ ] Links to and from products, bundles, goals and the quiz
- [ ] Descriptive alt text
- [ ] SEO title ≤60 characters, meta description ≤155
- [ ] US spelling
- [ ] FDA/FTC check
- [ ] Reviewer named (or placeholder)
- [ ] Sitemap (automatic)
