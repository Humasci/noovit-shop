# Noovit — Open items

_Consolidated 28 Oct 2026 from the whole build conversation. **Owner** = only you can do it. **Build** = Claude does it. Tick items off here; `PROGRESS.md` keeps the history._

## 🔴 Before launch: owner
**🛑 Pre-launch mode is ON (28 Oct).** The public sees a "Coming soon" page with a waitlist; every response says `noindex`; robots.txt has no sitemap. You see the full store while signed in to Admin, and Admin → Overview shows a 30-day preview link to share. Waitlist sign-ups appear in Admin → Subscribers (source `launch-waitlist`).

**Company first** (full plan: `docs/COMPANY_SETUP.md`)
- [ ] **Barbill LLC (Wyoming) annual report, ~1 Jan 2027** ($60 min + agent renewal; file on the Wyoming SOS site). If Barbill's agent is Wyoming Agents, check whether you're auto-enrolled in their $100 Renewal Service and cancel it if you'll file yourself. Also for Barbill: UK Self Assessment 2025/26 by 31 Jan 2027 if Barbill had any activity before 5 Apr 2026; Form 5472 for 2026 by 15 Apr 2027.
- [ ] Launch before six3 exists: Noovit reinvests and pays its own costs; take nothing out personally until six3 + the fee agreement are set up.
- [x] Decided: **new Wyoming LLC** for Noovit (owner is UK resident), formed via **Wyoming Agents** ($153 incl. state fee + year-1 agent; ask them to sign as organizer; add the mail-scanning suite, $49+/yr, for the label address).
- [ ] **Accountant (budget path in `docs/COMPANY_SETUP.md`):** ask six3's accountant or use a free first call. Get the answer **within ~3 months of the first sale** (corporation-tax notice if HMRC sees it as a UK company). Self Assessment for 2026/27 is due 31 Jan 2028. **First Form 5472 due 15 Apr 2027** if the LLC is formed in 2026 (forming on or after 1 Jan 2027 moves it to 15 Apr 2028). HMRC usually treats a US LLC as a company, and one run from the UK can be UK tax-resident. Choose: LLC owned personally, LLC taxed as a C-corp, or a UK Ltd owning the LLC (see `docs/COMPANY_SETUP.md`).
- [ ] **New EIN for Noovit LLC** once the LLC is filed. An EIN belongs to one entity, so the existing one (other company) can't be reused. Use the IRS international line (+1 267 941 1099) or an SS-4 fax; bank (Mercury or Wise Business); check that Stripe US accepts a UK-resident representative without an SSN.
- [ ] **Noovit LLC: forming in the next few days** (Wyoming). Owner confirms the date and the suite address. Site already updated: footer ©, policies ("Who we are"), label "Distributed by Noovit LLC", email footer, Organization structured data (`LEGAL_NAME` in `lib/site.ts`).
- [ ] **Label address (decided 29 Oct):** "Distributed by Noovit LLC" + the Wyoming Agents suite address (21 CFR 101.5: name and physical place of business; "Distributed by" because Supliful manufactures). It doubles as the US contact for adverse-event reports. Owner sends the address once the LLC is filed; then replace `[Street address]` / `[City, ST ZIP]` in `lib/labels/svg.ts` and set Admin → Settings → Business address.
- [ ] **Build (with Supliful's template):** side-panel type size. FDA requires ≥ 1/16" lowercase "o" (≈ 8–9 pt) for required text on the information panel (21 CFR 101.2(c)); our draft directions, cautions and distributor lines are ≈ 5 pt. Resize and shorten copy to fit; ask Supliful why their guide also says "nothing under 5 pt".
- [ ] Operating Agreement (single-member template), then the EIN, bank and Stripe below. Put the registered/mailing suite address in Admin → Settings → Business address and in the label (`[Street address]`, `[City, ST ZIP]`).
- [ ] Accountant: non-US owner → Form 5472 + pro forma 1120 every year ($25k penalty if missed); US tax and home-country tax position.
- [ ] Adverse-event procedure (serious events to FDA within 15 business days) and US contact on the label.
- [ ] Business bank account; Stripe account in the company's name (sandbox now, live keys later).
- [ ] Product liability insurance; sales tax registration where required (Stripe Tax helps).
- [ ] Replace placeholders with real company details: Admin → Settings (support email, business address), label address, legal pages.

**🚀 Launch day**
1. Turn off "Show placeholder trust content" in Admin → Settings.
2. Vercel → Environment Variables: `SITE_LIVE=true` → redeploy. (This removes the coming-soon page, the noindex and restores the sitemap.)
3. Google Search Console: add the domain, submit `https://www.noovit.com/sitemap.xml`, request indexing of the home page.
4. Google Merchant Center (free listings): add the product feed `https://www.noovit.com/feeds/google.xml` (only now: while pre-launch is on, product pages show "Coming soon" and Google would reject them). Set up the account beforehand, in Noovit LLC's name: verify and claim the domain, add free shipping and the 90-day return policy.
5. Email the waitlist (Admin → Subscribers, source `launch-waitlist`) with the welcome code.

**⏳ Next time you're at a computer (5 min)**
- [x] **Supabase → SQL Editor (done 28 Oct):** paste and run `supabase/manual/2026-10-28-catalog-update.sql` (replaces the earlier plus-names file). It applies the "+" names and headlines, the confirmed Supliful formulas (magnesium glycinate 275 mg, KSM-66 ashwagandha, lion's mane, creatine) and hides Berberine Complex. It also sets the **new prices** (`docs/PRICE_LIST.md`). Safe to re-run; supplier SKUs are kept. **Then Admin → Products → Sync to Stripe** so checkout charges the new prices. (Or reconnect the Supabase connector and Claude runs it.) **Until this runs, the live shop shows the old names** ("Collagen Complex", "Magnesium Complex").
- [ ] **Admin → Products → Import launch catalog** (adds the 3 bundles and the NAC and CoQ10 drafts), then save any product once (refreshes the cache) or redeploy.
- [ ] **New core-5 prices (30 Oct):** run `supabase/manual/2026-10-30-core5-prices.sql` in Supabase (Magnesium $29, Ashwagandha $27, Lion's Mane $35, Creatine $29, CoQ10 $28, Sleep & Calm Stack $49), then save any product (refreshes the cache) and, once Stripe is set up, Sync to Stripe. Details in `docs/PRICE_LIST.md`.
- [ ] **Run migration `supabase/migrations/0007_subscriber_goal.sql`** in Supabase (adds the pop-up goal to subscribers; sign-ups still work without it, just without the goal). The price SQL above now also sets creatine to emerald and the best-seller badges to the core range.

**Products and claims**
- [ ] **Real products (tomorrow):** pick the Supliful products. For each, send the Supplement Facts, capsule count and serving, your cost, Supliful SKU, and photos if you have them.
- [ ] **"Made in the USA" wording:** confirm with Supliful which products qualify. If unsure, use "Manufactured in the USA from domestic and imported ingredients". It also appears on labels (`ORIGIN_CLAIM`) and feed images.
- [ ] **Proof for "third-party tested" and "GMP certified":** get Supliful's GMP certificate and per-lot COAs, or tell me to remove the claims.
- [ ] **Regulatory lawyer review of claims.** Covers iron, berberine, zinc/testosterone, "clinically studied strains", quiz symptom wording and the nattokinase guide. Also ask: can methylene blue be sold as a dietary supplement at all? (see `docs/SHOPPING_ANALYSIS_METHYLENE_BLUE.md`)
- [ ] FDA structure/function notification within 30 days of first sale.
- [ ] Prop 65 check (heavy metals in botanicals/powders); product liability insurance.
- [ ] Trademark attorney: clear **NOOVIT** (US/UK, classes 5 and 35) and the "+" product names. Note the existing **CALM+** application.
- [ ] Print labels: replace `[Street address]` / `[City, ST ZIP]`; buy **GS1 UPC** barcodes.

**Legal pages**
- [ ] Full privacy policy, a Consumer Health Data policy (WA/NV) and a "Do Not Sell or Share" link.
- [ ] Full Terms; Delivery & Returns (how to return, refund timing, renewals).

**Accounts and settings**
- [ ] Stripe: keys in Vercel, `npm run stripe:sync`, webhook, customer portal, Stripe Tax; then a real test-mode order.
- [ ] Vercel env: `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY` + `EMAIL_FROM` (verified domain), and social URLs (`NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_TIKTOK_URL`, `NEXT_PUBLIC_FACEBOOK_URL`).
- [ ] Admin → Settings: support email, business address, welcome code (create **WELCOME10** first), Meta/TikTok IDs. (GTM `GTM-5LKW5HGS` is built in; leave the GA4 field empty.)
- [ ] **Owner: set up GA4 inside GTM** (≈15 min, steps in `docs/ANALYTICS_SETUP.md`):
  - [ ] Google tag `G-JHK7BF5QB1` on Initialization – All Pages
  - [ ] Ecommerce trigger (`view_item|add_to_cart|begin_checkout|purchase`, regex) + GA4 event tag with "Send Ecommerce data"
  - [ ] Sign-ups: Data Layer Variable `lead_source`, Custom Event trigger `generate_lead`, GA4 event tag `generate_lead` with parameter `lead_source`
  - [ ] Preview on noovit.com (join the waitlist; sign in to Admin first to test shop events), then Submit → Publish
  - [ ] GA4: mark `generate_lead` (and `begin_checkout`) as key events; custom dimension `Lead source` (parameter `lead_source`); check "page changes based on browser history events" is on
- [ ] Admin → Products: map each **Supplier SKU** to its Supliful product.
- [ ] **Switch "Show placeholder trust content" to `off`** once real reviews and advisors replace the placeholders.

**Trust**
- [ ] Recruit a **registered dietitian (RDN)** as medical reviewer and advisor: name, credentials, photo, consent, paid-relationship disclosure.
- [ ] Collect real reviews (the review emails are automatic). Set up **Trustpilot** and **Google Customer Reviews**.

## 🟠 Before launch: build
- [x] **Redesign, phase 1** (28 Oct): off-white canvas, square navy buttons, calmer corners, new product page (orange-name headline, bullets, stat strip, plan cards, trust row, accordions, bundle upsell, Benefits / Research / What's-inside panels, desktop sticky section bar), new product cards (goal tag, "from" price and % off), giant-wordmark footer.
- [ ] **Redesign, phase 2:** "What to expect" timelines and research panels from the deep research; expert/dietitian section; real product photos; home and goal pages in the same style (owner review first).
- [ ] Align the catalog with the real Supliful products: names, formulas, doses, prices, Supplement Facts with %DV and the iron warning, capsule counts.
- [ ] **COA / lab results** block on product pages (once documents arrive).
- [ ] Google verification + Customer Reviews: **built** (30 Oct, Admin → Settings: "Google verification code" adds the meta tag on every page incl. Coming soon; "Google Customer Reviews: Merchant Center ID" turns on the survey opt-in after checkout). **Owner:** paste the codes once the Merchant Center/Search Console accounts exist.
- [ ] Re-run the full audit after real products: Lighthouse on Vercel, links, claims, US spelling pass.
- [x] Creatine "Adults 18+" notice on the product page and cards (30 Oct; any age-restricted product).

## 🟣 Direction (28 Oct): "nootropic" minimal aesthetic. The catalog stays as is.
- [ ] **Minimal redesign:** product page (29 Oct) and home/goal pages (30 Oct) done: light trust line, lighter headings, open sections, "Our core formulas" = the core range on a light layout, trust row and subscription perks without cards. **Still to do:** clinical-research module with a chart (research prompts), certification row (Supliful GMP/COA proof). **Owner:** review on the preview link.
- [x] **Label rework (29 Oct):** owner picked option "A": colour block with category + name + vertical wordmark; white band with the **dose per serving** left (single-ingredient products) and the **net quantity at legal size** right (21 CFR 101.105); "Dietary supplement" + servings below. Benefit line and "Made in the USA" moved off the front (origin now on the information panel). Supliful's stock capsules edited out of the photo; images framed tight (bottle ≈90% of height). Research: `docs/research/COMPETITORS_CORE5.md`.
- [x] Creatine colour: emerald (30 Oct, my recommendation; one line in `data/products.ts` + the price SQL if you prefer another).
- [x] **Gallery images (30 Oct):** each core product has a "What's in every serving" image (bottle on a light tint + 3 callouts); Magnesium Sleep+ and CoQ10 also have a dose comparison vs the typical range on competitors' labels (no brands named). Copy in `lib/labels/gallery-data.ts`. Later: lifestyle/texture shots with real photography.
- [ ] **Owner:** confirm each product's dietary tags with Supliful (spec sheet / COA) before launch. They now show on product pages as a ticked row under the stat strip (not on the bottle). "Gluten-free" must meet the FDA rule (<20 ppm gluten); "Non-GMO" is not shown anywhere and would need supplier paperwork (or a Non-GMO Project seal) before we add it.
- [ ] **Owner:** download Supliful's label template (dieline) for the 60-capsule bottle from their label editor and send me the trim size, bleed and safe zone. Our draft assumes a **6.5" × 2.25" wrap** (Supplement Facts 2.15" | front 2.2" | info 2.15"). From their photo the bottle looks about 2" wide (≈6.2–6.5" around), so it should fit, but the real template decides. It also sets the net-quantity minimum type size (we assume a 5–25 sq in panel: digits ≥ 1/8"). Sizes live in one place (`LABEL` in `lib/labels/svg.ts`).
- [x] **Photo mockups (28 Oct):** single capsule/softgel products now use Supliful's real blank-bottle photo with our label wrapped on (`lib/labels/photo.ts`, `assets/mockups/`). **Still drawn:** bundles and powder tubs (creatine, Mushroom Clarity+). **Build next:** the same for tubs and bundles using Supliful's tub and multi-bottle photos.
- [x] Google-style feed titles (30 Oct): "Noovit Magnesium Sleep+ – Magnesium Glycinate 275 mg – 90 Capsules".
- [ ] **Owner:** confirm Supliful costs and shipping per product. Turmeric is $11.05 all-in ($8 with Pro); berberine is $10.25 all-in. See `docs/PRICING_NOTES.md` and `docs/pricing/noovit-pricing.xlsx`. Decide the price points (e.g. turmeric $36 / $30 subscribed, berberine $36 / $32).
- [ ] **Owner: ask Supliful for berberine's Supplement Facts/COA with mg of berberine per serving.** Their ingredient list suggests only ~146 mg a day (studies use 900–1,500 mg). If that's right, source a 500 mg berberine HCl elsewhere. See `docs/SHOPPING_ANALYSIS_BERBERINE.md`.
- [ ] **Owner: magnesium figure check (30 Oct).** Pure magnesium bisglycinate is ~14% magnesium, so 2,500 mg would give ~350 mg, not 275 mg (275 mg = 11%, possible with some commercial glycinate ingredients). Ask Supliful for the ingredient spec / COA: elemental mg per serving and the exact compound. The label, product page and guide use 275 mg; fix everywhere if Supliful says otherwise.
- [ ] **Owner: lion's mane (important, 30 Oct).** Our label says "fruiting body & mycelium, 40% polysaccharides"; our own guide (`/guides/lions-mane`, evidence-based) tells buyers to prefer fruiting body and a beta-glucan % because mycelium grown on grain inflates polysaccharide numbers. Ask Supliful for a COA with **beta-glucan % (Megazyme method)** and the fruiting body : mycelium ratio, plus their price. If the beta-glucan figure is good, put it on the label/page and link the guide from the product (`relatedProducts` in `lib/guides.ts`); if not, find a fruiting-body extract. See `docs/SHOPPING_ANALYSIS_LIONS_MANE.md`.
- [ ] **Methylene blue: on hold** as a product (unclear legal status as a supplement, serotonin-syndrome risk with SSRIs, G6PD, 10 mg dose far below studies). The evidence guide is live: `/guides/methylene-blue` (30 Oct).
- [ ] **GLP-1 companion bundle: drafted (30 Oct), hidden.** "Light Appetite Essentials" = Daily Multi+ + Probiotic Gut+ + Magnesium Sleep+, $85 (parts $102). "GLP-1" kept out of the name. **Owner + lawyer:** approve the name and wording, then set it active (Admin → Products) after "Import launch catalog". Skip Supliful's "GLP-1 Support" (proprietary blends, B6 above the EU limit, iron 18 mg, under-dosed ginger and ashwagandha).
- [x] **Guide "Nutrition on GLP-1 medications" (30 Oct):** `/guides/glp-1-nutrition`, 20 verified sources (STEP 1, SURMOUNT-1, the 2025 ACLM/ASN/OMA/TOS advisory, FDA labels, NIH ODS). Protein, fiber, fluids, B12, multivitamin, ginger, magnesium, hair shedding. **Needs medical review before launch.** No FDA/FTC warning specific to "natural Ozempic" supplements was found, so it cites the general rules instead.
- [ ] **NAD+: maybe, phase 2.** The market check is done (`docs/SHOPPING_ANALYSIS_NAD.md`): more than half the ads are injectable "research use only" vials and sprays. The oral market is $40–65. **Cortex (Vitasy) very likely sells the same Supliful capsule at $39.99**, so we'd have to win on honesty, content and bundles. Better: ask suppliers for an **NR / Niagen** option (Elysium's evidence-backed approach). Owner: send Supliful's NAD+ price.
- [ ] **⭐ What we can sell (catalogue sweep, 28 Oct):** see the recap at the top of `docs/SUPLIFUL_PRODUCT_SCREEN.md`. **Launch shortlist:** Magnesium Glycinate (275 mg), Ashwagandha Plus (KSM-66 600 mg), Lion's Mane, Creatine, CoQ10 200 mg. **Turmeric correction:** Supliful's only turmeric is *Platinum Turmeric*, a joint blend with shellfish glucosamine, so get its facts panel before deciding. **Owner:** screenshot the Supplement Facts and prices for the shortlist plus Platinum Turmeric, Joint Support, Women's Vitality, Collagen, Colostrum Powder and Sleep Formula. **Second supplier needed** for zinc, L-theanine, NAC, multivitamin, berberine 500 mg, plain KSM-66, focus stack, NR (D3+K2 may be covered by Supliful's Bone & Heart Support).
- [ ] **Owner: contact new on-demand suppliers** (research in `docs/SUPPLIER_RESEARCH.md` §2.14): **Rocktomic** first (1-unit dropship with our label; lists K2+D3, NAC, multis, berberine, omega-3; $97+/month), then **Vox Nutrition** (NSF facility; may be ODF's manufacturer) and **Rapid Fulfillment** ($999 setup). Ask for Supplement Facts, COAs, the real manufacturer and KSM-66/Niagen licensing.
- [ ] **Product screen:** all checked Supliful products and verdicts are in `docs/SUPLIFUL_PRODUCT_SCREEN.md`. Launch: turmeric, lion's mane, ashwagandha (KSM-66 600 mg; Vitasy sells Supliful's Ashwagandha Plus as 3 brands at $29.99, so get a **plain KSM-66** or price at $30–32. Supliful's plain Ashwagandha is organic root with no amounts or extract type, so it's weaker; ask other suppliers for KSM-66 600 mg). No: reishi relax gummies, cordyceps energy gummies, chaga (added 28 Oct). Supliful's mushroom gummies share one weak template (≈200 mg extract + four 25 mg extras). Bundle/add-on: D3, omega-3. Maybe: colostrum, NMN (lawful again since Sept 2025). No: berberine (as is), GLP-1 Support, methylene blue. **Owner:** send Supliful prices and ask the questions listed at the end of that doc.
- [ ] **Note across all products:** Vitasy (store brands Cortex, Compass, Fernwood + Vitasy gummies) resells Supliful's catalogue in every category we've checked; in ashwagandha it has ~10 of 22 ads. Expect 1–3 identical formulas at ~$25–45; differentiate on our own formulas where it matters, evidence, content, bundles and brand. See `docs/SHOPPING_ANALYSIS_ASHWAGANDHA.md`.
- [x] **Ashwagandha guide (30 Oct):** `/guides/ashwagandha`, 24 verified sources: KSM-66 vs Sensoril vs root powder, study doses, liver and thyroid cautions, Denmark ban. Linked from the Ashwagandha Calm+ page. **Needs a dietitian/doctor review before launch** (high-risk ingredient in `CONTENT_GUIDELINES.md`). Left out (unverified): France/Netherlands/UK/Australia restrictions, NIH ODS sheet (blocked).
- [x] **Owner:** picked a label direction (29 Oct): "A", colour block + white band with dose and net quantity.

## 🟡 Content and SEO
- [ ] **Owner: run the deep research prompts** in `docs/RESEARCH_PROMPTS.md` (copy-paste ready). First the 6 launch products: magnesium glycinate, ashwagandha KSM-66, lion's mane, creatine, turmeric blend, CoQ10. Then batch 2 (probiotics, collagen, menopause, NAC) and the guides (GLP-1 nutrition, methylene blue, NAD+/NMN/NR, berberine). Save results in `docs/research/` or send them to Claude.
- [ ] **Guides (30 Oct): 10 live** — nattokinase, ashwagandha, GLP-1 nutrition, magnesium, CoQ10, creatine, lion's mane (not linked from the product yet), turmeric, methylene blue (safety-first). **All need a dietitian/doctor review before launch.** Next: "X vs Y" comparisons (e.g. magnesium glycinate vs citrate, KSM-66 vs Sensoril) and "Can I take X with Y?" pages, following `CONTENT_GUIDELINES.md`.
- [x] Guides have related products/goals and a 1200×630 social image (`/guide-image/<slug>`) (30 Oct).
- [ ] **Owner:** Google Merchant Center account → free listings; later a paid Shopping test on 3–5 proven products.
- [ ] **Owner:** decide what to do with nattokinase (hold until lawyer and dietitian review; a guide only for now).

## 🟢 Social (plan: `docs/SOCIAL_PLAN.md`)
- [ ] **Owner:** Buffer account, connect TikTok → Instagram → YouTube → Pinterest → X; Buffer API key in Vercel.
- [ ] **Owner:** decide the presenter. You on camera (recommended for key videos) plus the AI avatar for volume, labelled as AI.
- [ ] **Owner:** add the compliance-check skill from your other projects to this repo (`.claude/skills/`).
- [ ] **Build:** content packs, compliance check, admin approval queue, Buffer publishing, UTM tracking, performance dashboard.

## 🔵 Growth and conversion (after launch)
- [ ] **Meta ads (notes, 28 Oct):**
  - [ ] Set up Business Manager + ad account in the company's name; add the Pixel ID in Admin → Settings (the site already sends ViewContent, AddToCart, InitiateCheckout, Purchase and Lead).
  - [ ] Expect Meta to label the account **"health and wellness"** (since early 2025): purchase optimisation and conversion-based audiences may be limited. Plan for upper-funnel optimisation (landing page views, leads), judge results in GA4, and appeal a wrong label. Don't disguise event names to dodge it (risks an account ban). Check current rules in Meta's Business Help Center at setup.
  - [ ] Creative rules: no "you"-health wording ("Struggling with anxiety?"), no before/after, no body-image or weight-loss promises, no disease or "FDA approved" claims; landing page must match the ad; target 18+.
  - [ ] Banned/at-risk ingredients: anabolic steroids, chitosan, comfrey, DHEA, ephedra, HGH, plus anything Meta deems unsafe (methylene blue and "GLP-1" products are high risk).
  - [ ] Confirm whether Facebook/Instagram Shops allow supplement listings (likely not); ads link to noovit.com.
  - [ ] Ask the lawyer about Washington's My Health My Data Act before retargeting health-product viewers.
  - [ ] Start small and clean: new accounts with supplement ads get extra scrutiny.
- [ ] **FrontrowMD** demo and application once products and labels are final (Clinicians' Choice badge + clinician reviews).
- [ ] **Phone line + AI voice agent (Vapi), at launch, kept small:**
  - **Owner:** buy a US number in Vapi; it becomes the business number (EIN form, website, label — it also covers the label's US contact for adverse-event reports).
  - **v1 (launch):** the agent says it's an AI assistant, answers from our FAQ/shipping/returns/subscription pages, takes messages, and **captures any health problem report** (name, contact, product, lot, what happened) → emails the owner immediately and logs it (serious events → FDA within 15 business days). No medical advice, no dosing advice beyond the label; offers a human callback by email. Recording disclosure at the start (two-party-consent states).
  - **v2 (after launch):** order status by order number + email via a small API endpoint (build), and texting the customer a link to manage their subscription (no account changes by voice).
  - **Build when the account exists:** system prompt + knowledge from the site, the message/adverse-event webhook into Admin, order-lookup endpoint.
- [ ] **HSA/FSA payments** via Flex or Truemed (Absorption Company and Naomi both show it).
- [x] Newsletter pop-up asks the **goal first** (30 Oct); goal shown in Admin → Subscribers for segmenting.
- [ ] **Build-your-stack** (multi-buy discount) and a **rewards** programme.
- [ ] Announcement bar with proof points (evidence-graded · tested · free shipping).
- [ ] "+" drawn as the orange mosaic cross in product names and labels (mock-up first).
- [ ] **Daily pack** line with OK Capsule (quotes, API docs, branded sample).
- [ ] Automatic Supliful orders via a hidden Shopify backend (when manual orders reach about 10–15 a day).
- [ ] Amazon (needs lab testing via an approved lab), then TikTok Shop (lab reports ≤180 days); eBay is low priority.
- [ ] Bundles: maybe a 4th, **Women 40+** (Menopause + Magnesium + D3&K2).
- [ ] **Pets (rethought 31 Oct):** the store already has the Pets section, 6 drafted products and a waitlist; what's missing is supply (no US dropshipper found; Pet Tech Labs = 504 units/SKU into a 3PL).
  - **Owner, first:** check Admin → Subscribers for `pets-waitlist` sign-ups (demand signal); run a small Meta test ($100–200) to the Pets waitlist page and compare cost per sign-up with the human products.
  - **Owner:** contact **Organic Pets Treats Inc.** (Largo, FL; advertises private-label dog soft chews — calming, allergy, probiotic, joint — with no minimum order): confirm MOQ, whether they ship orders to customers (dropship), unit price, label fees, NASC membership. If yes, pets can launch with no inventory, like Supliful.
  - **If no dropship:** one SKU only (dog hip & joint chews, the biggest category) from Pet Tech Labs or NPI into a 3PL — roughly $2–4k stock + 3PL setup. Only after the human launch shows paid traffic converts.
  - **Build (when a supplier is confirmed):** pet Shopping/competitor analysis like the core-5 teardown (Zesty Paws, PetLab Co., Native Pet, Pawfectchew), pet labels on the supplier's chew tub, NASC-style label rules, state feed registration check.

- [ ] **Apps (parked 30 Oct, `docs/APP_IDEAS.md`):** not now. If anything, a pet app (meds, supplements and vet reminders).

## ⚪ Tech debt and nice-to-haves (from the audit)
- [x] Mobile shop filters as a bottom sheet; quiz steps in the URL so back works (30 Oct).
- [ ] Replace or self-host the Unsplash photos; real product photography; feed images without text overlays.
- [x] Admin privacy tools (30 Oct): Customer → "Download their data (JSON)" and "Delete personal data" (orders kept without personal details). Still to do: disputes and failed renewals view.
- [ ] Re-measure mobile Lighthouse on production.
