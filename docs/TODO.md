# Noovit — Open items

_Consolidated 28 Oct 2026 from the whole build conversation. **Owner** = only you can do it. **Build** = Claude does it. Tick items off here; `PROGRESS.md` keeps the history._

## 🔴 Before launch: owner
**⏳ Next time you're at a computer (5 min)**
- [ ] **Supabase → SQL Editor:** paste and run `supabase/manual/2026-10-28-plus-names.sql`. It applies the "+" names and the product headlines. (Or reconnect the Supabase connector and Claude runs it.)
- [ ] **Admin → Products → Import launch catalog** (adds the 3 bundles and the NAC draft), then save any product once (refreshes the cache) or redeploy.

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
- [ ] Admin → Settings: support email, business address, welcome code (create **WELCOME10** first), GA4/Meta/TikTok IDs.
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
- [ ] Google Merchant Center verification meta tag + Search Console; Google Customer Reviews script on `/checkout/success`.
- [ ] Re-run the full audit after real products: Lighthouse on Vercel, links, claims, US spelling pass.
- [ ] Creatine "Adults 18+" notice on the product page and cards.

## 🟣 Direction (28 Oct): "nootropic" minimal aesthetic. The catalog stays as is.
- [ ] **Build:** minimal redesign in the Innerbody Labs / Momentous style: cleaner header (no dark trust bar), lighter type, fewer boxes, diet pills, ingredient accordion with doses, a clinical-research module with a chart, a certification row.
- [ ] **Build:** a cleaner label option (white label, bigger name, thin colour accent, optional amber bottle); mock it up at Google Shopping thumbnail size for the owner.
- [ ] **Build:** Google-style feed titles (brand + product + key spec + count).
- [ ] **Owner:** confirm Supliful costs and shipping per product. Turmeric is $11.05 all-in ($8 with Pro); berberine is $10.25 all-in. See `docs/PRICING_NOTES.md` and `docs/pricing/noovit-pricing.xlsx`. Decide the price points (e.g. turmeric $36 / $30 subscribed, berberine $36 / $32).
- [ ] **Owner: ask Supliful for berberine's Supplement Facts/COA with mg of berberine per serving.** Their ingredient list suggests only ~146 mg a day (studies use 900–1,500 mg). If that's right, source a 500 mg berberine HCl elsewhere. See `docs/SHOPPING_ANALYSIS_BERBERINE.md`.
- [ ] **Owner: lion's mane.** Send Supliful's price screenshot (the spreadsheet uses an $11 placeholder) and ask for a COA with beta-glucan % and the fruiting body : mycelium ratio. See `docs/SHOPPING_ANALYSIS_LIONS_MANE.md`.
- [ ] **Methylene blue: on hold** (unclear legal status as a supplement, serotonin-syndrome risk with SSRIs, G6PD, 10 mg dose far below studies). **Build:** an evidence guide instead. See `docs/SHOPPING_ANALYSIS_METHYLENE_BLUE.md`.
- [ ] **Build: "GLP-1 companion" bundle** for people taking GLP-1 medications, made from our own products with every dose visible: Magnesium Sleep+ (constipation, sleep) + a probiotic + a multivitamin or D3 & K2. Name it with care (no "GLP-1" product name implying a hormone effect; lawyer to check wording). Skip Supliful's "GLP-1 Support" (3 proprietary blends, B6 26 mg above the EU limit, iron 18 mg, under-dosed ginger and ashwagandha, biotin 5 mcg sold as a hair-loss aid). Later: a custom OK Capsule daily pack for this audience.
- [ ] **Build: guide "Nutrition on GLP-1 medications"**: protein to protect muscle, fibre, hydration, B12, nausea (ginger evidence), constipation (magnesium), hair loss (rapid weight loss, when biotin helps and when it doesn't). Links to the companion bundle. Owner: send "GLP-1 supplement" Shopping screenshots for the market analysis.
- [ ] **NAD+: maybe, phase 2.** The market check is done (`docs/SHOPPING_ANALYSIS_NAD.md`): more than half the ads are injectable "research use only" vials and sprays. The oral market is $40–65. **Cortex (Vitasy) very likely sells the same Supliful capsule at $39.99**, so we'd have to win on honesty, content and bundles. Better: ask suppliers for an **NR / Niagen** option (Elysium's evidence-backed approach). Owner: send Supliful's NAD+ price.
- [ ] **Note across all products:** Vitasy (Cortex, Compass) appears to resell Supliful's catalogue in every category we've checked. Expect identical formulas at ~$25–45; differentiate on evidence, content, bundles and brand.
- [ ] **Owner:** pick a label direction (B clinical white / C colour block / D amber). See `design/label-options/comparison.png`.

## 🟡 Content and SEO
- [ ] **Owner:** deep research briefs (template in `CONTENT_GUIDELINES.md` §11) for magnesium, ashwagandha, probiotics, creatine, NAC and lion's mane.
- [ ] **Build:** a guide per ingredient, plus "X vs Y" comparisons and "Can I take X with Y?" pages, following `CONTENT_GUIDELINES.md`.
- [ ] **Build:** add `relatedProducts` and goals to each guide; 1200×630 social image; shipping/returns + breadcrumb schema on product pages.
- [ ] **Owner:** Google Merchant Center account → free listings; later a paid Shopping test on 3–5 proven products.
- [ ] **Owner:** decide what to do with nattokinase (hold until lawyer and dietitian review; a guide only for now).

## 🟢 Social (plan: `docs/SOCIAL_PLAN.md`)
- [ ] **Owner:** Buffer account, connect TikTok → Instagram → YouTube → Pinterest → X; Buffer API key in Vercel.
- [ ] **Owner:** decide the presenter. You on camera (recommended for key videos) plus the AI avatar for volume, labelled as AI.
- [ ] **Owner:** add the compliance-check skill from your other projects to this repo (`.claude/skills/`).
- [ ] **Build:** content packs, compliance check, admin approval queue, Buffer publishing, UTM tracking, performance dashboard.

## 🔵 Growth and conversion (after launch)
- [ ] **FrontrowMD** demo and application once products and labels are final (Clinicians' Choice badge + clinician reviews).
- [ ] **HSA/FSA payments** via Flex or Truemed (Absorption Company and Naomi both show it).
- [ ] Newsletter pop-up asks the **goal first**, then the email.
- [ ] **Build-your-stack** (multi-buy discount) and a **rewards** programme.
- [ ] Announcement bar with proof points (evidence-graded · tested · free shipping).
- [ ] "+" drawn as the orange mosaic cross in product names and labels (mock-up first).
- [ ] **Daily pack** line with OK Capsule (quotes, API docs, branded sample).
- [ ] Automatic Supliful orders via a hidden Shopify backend (when manual orders reach about 10–15 a day).
- [ ] Amazon (needs lab testing via an approved lab), then TikTok Shop (lab reports ≤180 days); eBay is low priority.
- [ ] Bundles: maybe a 4th, **Women 40+** (Menopause + Magnesium + D3&K2).
- [ ] Pets line (3 dog chews via a 3PL), UK launch, NAC product (recheck FDA status).

## ⚪ Tech debt and nice-to-haves (from the audit)
- [ ] Mobile shop filters as a bottom sheet; quiz steps in the URL (back button).
- [ ] Replace or self-host the Unsplash photos; real product photography; feed images without text overlays.
- [ ] Admin tools: privacy export/delete, disputes and failed renewals view.
- [ ] Re-measure mobile Lighthouse on production.
