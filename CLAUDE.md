# Noovit — project memory

Read this first. It is the standing context for any session working on this repo. Open items live in `docs/TODO.md`
(the single source of truth for what's left); history lives in `docs/PROGRESS.md`.

## What this is
- **Noovit** (noovit.com): a US direct-to-consumer supplement store. Evidence-led, minimal "nootropic" look,
  doses printed on the front of every bottle. Subscribe & save, free US shipping, 90-day guarantee.
- **Owner:** UK resident, bootstrapping, budget-constrained (no accountant budget). Company: **Noovit LLC (Wyoming)**,
  being formed via Wyoming Agents (late Oct 2026). Owner also has Barbill LLC (media/legal projects): never trade under it.
- **Status:** pre-launch. `SITE_LIVE` is off in production: the public sees `/coming-soon` (waitlist), every response is
  `noindex`. Staff signed in to Admin, and preview-link holders, see the full store.
- **Fulfilment:** Supliful print-on-demand dropship (white HDPE bottles only for now). Pets need another supplier
  (none found that dropships; see the pets plan in the TODO).

## Product decisions (keep consistent everywhere)
- **Core range:** Magnesium Sleep+ (275 mg elemental as glycinate, 90 caps), Ashwagandha Calm+ (KSM-66 600 mg),
  Lion's Mane (**hero**; Supliful's 1,000 mg organic fruiting body + mycelium, a normal mainstream spec — copy says
  "1,000 mg", never that it matches the trial doses of 1.8–3.2 g; a beta-glucan COA is a nice-to-have), Creatine (5 g per 5.6 g scoop, 50 servings, 281 g tub, 18+ only; Supliful $14.69 delivered, i.e. product + shipping + fulfilment), CoQ10 (200 mg). Plus Turmeric Complex (= Supliful Platinum Turmeric: 800 mg root + 100 mg 95% curcuminoids + glucosamine/chondroitin, **contains shellfish**, $29). Ashwagandha: Supliful's "Plus" sold as is, every
  ingredient listed (KSM-66 600 mg + D3, B6, B12, L-arginine, maca, ginseng, shatavari; $10.25 delivered). Wider range unlocked 31 Oct
  (probiotic, joint, collagen, D3/K2, sleep, omega-3, colostrum, menopause, NMN; see `SUPLIFUL_PRODUCT_SCREEN.md`).
  Competitor teardown: `docs/research/COMPETITORS_CORE5.md`.
- **Prices (31 Oct 2026):** Mg $29, Ashwa $29, Lion's Mane $35, Creatine $32, CoQ10 $28; subscribe/3-pack −$5,
  6-pack −$10; Sleep & Calm Stack $49. Never above the Vitasy twins (Cortex/Compass/Fernwood/Kinetic) on identical
  Supliful formulas. No fake "was" prices. Free shipping on everything. Supliful price ranges read "product –
  delivered cost" (e.g. creatine $7.14–$14.69); aim for ≥ ~$15 left per first order after the delivered cost and card fee.
  `docs/PRICE_LIST.md`.
- **Label ("A3", 29 Oct):** colour block with category, name, benefit* and vertical "noovit" wordmark; white band with
  the dose per serving (single-ingredient products; blends show key ingredients) on the left and the net quantity at
  legal size on the right; "Dietary supplement" + servings below. Supliful tub template = 11" × 3" trim + 0.125" bleed
  (`tubLabelSvg`, `npm run labels` → `design/labels/<slug>.tub.png`/`.tub.pdf`). Bottle = Supliful template 6.0" × 2.25" + 0.125" bleed,
  panels Info | Front | Facts (`LABEL`, template in `design/supliful-templates/bottle`); upload file `design/labels/<slug>.label.pdf`
  (text outlined). All label text ≥ 5 pt (Supliful's minimum; 1 unit = 0.72 pt); `npm run labels` warns on overflow;
  long ingredient names can take a shorter `label` for the printed panel. Origin claim on the info panel. Distributor line:
  **"Distributed by Noovit LLC" + Wyoming Agents suite address** (address pending). Creatine colour: emerald `#2E8B57`. Every label colour block is a gradient (`labelGradient`: product colour → deeper tone; picks in `LABEL_GRADIENTS`): Ashwagandha coral → berry (site `#B6575E`), Lion's Mane teal → petrol (`#27798A`), CoQ10 ruby → wine (`#9B2B46`). No brown. No website on the bottle label.
- **Label V2 (3 Nov, the owner's restart point):** "M2" = clinical white, product-colour band with the quantity, and the
  product's key molecule in fine glossy beads dissolving at one end (`frontPanelClinical(..., { form: 'molecule-spectrum' })`,
  `lib/labels/molecule.ts`, data `data/molecules.json`). Used for the website product photos now; the print PDFs
  (`fullLabelSvg`) still use the old front until converted. Core colours: Mg `#4A6B94`, Ashwa `#AE5559`, Lion's Mane
  `#2B7C82`, Creatine `#2F6F4E`, CoQ10 `#8E2E45`, Turmeric `#B56E1E`. Website graphics in the same style: `/art/molecule-<slug>.svg`,
  `/art/drift-<slug>.svg` (`lib/labels/web-art.ts`).
- **The cross:** only the five-tile mosaic cross, everywhere (logo, favicon, loader, brand name in text, emails, advisor icon).
- **Product images:** Supliful's blank bottle photo with the stock capsules edited out (`assets/mockups`,
  `scripts/remove-mockup-capsules.mjs`), framed tight (~90% height). Gallery: front, "In every serving" fact image,
  dose comparison (Mg, CoQ10), label close-up, Supplement Facts. Bump `MOCKUP_VERSION` when images change.
- **Analytics:** GTM `GTM-5LKW5HGS` built in; GA4 lives inside GTM (leave the site GA4 field empty). Consent is
  opt-out (banner; Decline = denied). GA4 ecommerce events + `generate_lead` with `lead_source`.
- **Trend drafts (31 Oct, hidden until facts/costs confirmed):** NMN 500 mg ($39), NAD+ Complex (NAD+ 500 mg + quercetin +
  resveratrol, $38, delivered cost $12.99; never claim "DNA repair"), Colostrum+ powder 2,300 mg ($35, contains milk),
  Deep Sleep Complex (melatonin 2 mg + herbs, $27, 18+).
- **Not selling (for now):** berberine (Supliful dose too low), methylene blue (legal status, SSRI/G6PD risks; guide only),
  Supliful's "GLP-1 Support". Draft bundle "Light Appetite Essentials" is hidden pending approval.

## Rules for content and claims
- **FDA structure/function language only:** never "treats/cures/prevents". Benefit claims carry * → disclaimer.
- **Guides:** every source opened and verified, evidence graded (Moderate / Limited / Early / Insufficient), null
  results included, no Noovit mention in the body. Brief: `docs/research/GUIDE_RESEARCH_BRIEF.md`. All guides need a
  medical reviewer before launch. Guides stay neutral on product formats we sell (no "avoid X" for our own spec).
- **No unverified trust claims** (GMP, third-party tested, Made in USA wording) until Supliful provides proof (TODO).
- US spelling on the site. Plain, short sentences.

## Tech
- Next.js 16 (App Router), React 19, Supabase (Postgres + PostgREST), Stripe (Checkout + subscriptions), Resend,
  Vercel. Fonts self-hosted (Inter, Manrope, Funnel Display for the wordmark).
- **AI wellness advisor (3 Nov):** `lib/advisor.ts` (system prompt from the live catalog + guides; compliance rules),
  `app/api/advisor/route.ts` (streams; Claude via `@anthropic-ai/sdk`, model `ADVISOR_MODEL` env, default
  `claude-opus-5-5`, low effort, server-side refusal fallback), widget `components/advisor/Advisor.tsx` + header
  "Ask Noovit" button. Shown only when `ANTHROPIC_API_KEY` is set. Site look: Thorne-like (white, pill buttons,
  black announcement bar, shop-by-goal tiles).
- Key paths: catalog seed `data/products.ts` (live catalog is the `products` table, jsonb `data`; `status` is a column);
  labels `lib/labels/{svg,photo,png,gallery,gallery-data}.ts`; guides `lib/guides.ts`; quiz `lib/quiz.ts`;
  settings `lib/settings.ts` (admin values > env > defaults); pre-launch gate `proxy.ts` + `lib/launch.ts`;
  feeds `lib/feeds`; company name `LEGAL_NAME` in `lib/site.ts`.
- Live DB changes: migrations in `supabase/migrations` and one-off SQL in `supabase/manual` are **run by the owner**
  in the Supabase SQL editor (list the step in the TODO). After catalog SQL: save any product (cache) / Stripe sync.
- Commands: `npm run build`, `npm run lint`, `npm run labels` (print label drafts → `design/labels`),
  `npm run stripe:sync`, `npm run catalog:seed`. E2E tests: `tests/e2e/README.md`.

## Working conventions
- Branch: `claude/noovit-ecommerce-build-01AgHwmMXyw3TzvCrzNnVa8R`; push there; no PRs unless asked.
- Commit trailers: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` and the session link. No model names in
  code, docs or commits beyond that.
- Never commit secrets (Stripe keys, service-role keys, `vercel-secrets`); never ask the owner to paste keys in chat.
- Keep `docs/TODO.md` current after every batch (tick, add owner steps); add a line to `docs/PROGRESS.md`.
- The owner prefers a clear recommendation over a menu of options, and plain explanations.
- **Brand ambition (3 Nov):** become a premium, Thorne-level brand over time. Today's prices are **launch prices**;
  raise them as proof builds (reviews, COAs/third-party testing, own formulas). Never show a fake "was"/"regular" price
  that wasn't really charged (FTC 16 CFR 233): say "launch price" and raise prices for real. Label system: clinical white,
  dark type, product-colour band, particle illustration in a square top-right block (`frontPanelField`, F2; brief in
  `docs/ILLUSTRATION_BRIEF.md`). Branding is the owner's focus while the EIN is pending.
- Positioning: a **mainstream** evidence-led brand, not a clinical lab. Be honest, but don't hold products to a stricter
  bar than the market (e.g. a normal 1,000 mg lion's mane is fine); avoid self-defeating copy.

## Artifact index
**Strategy & research (docs/)**
- `research/COMPETITORS_CORE5.md` — core-5 competitors, prices, label patterns, Shopping screenshots, decisions.
- `research/deep-research-*.md` — the owner's deep-research results, reviewed (what's usable, what isn't, decisions).
- `SHOPPING_ANALYSIS_*.md` (ashwagandha, berberine, lion's mane, methylene blue, NAD+, turmeric) — Google Shopping teardowns.
- `SUPLIFUL_PRODUCT_SCREEN.md` — every checked Supliful product with verdicts (recap at top).
- `SUPPLIER_RESEARCH.md` — dropship/private-label suppliers incl. pets. `pricing/noovit-pricing.xlsx`, `PRICING_NOTES.md`, `PRICE_LIST.md`.
- `RESEARCH_PROMPTS.md` — deep-research prompts for the owner. `research/GUIDE_RESEARCH_BRIEF.md` — guide brief.
- `COMPANY_SETUP.md`, `ACCOUNTING_BRIEF.md` — Wyoming LLC plan, UK tax questions, deadlines (Barbill annual report ~1 Jan 2027).
- `ANALYTICS_SETUP.md`, `SEO_PLAN.md`, `SOCIAL_PLAN.md`, `CONTENT_GUIDELINES.md`, `DESIGN_DIRECTION.md`,
  `LABEL_DESIGN_BRIEF.md`, `DAILY_PACK_CONCEPT.md`, `APP_IDEAS.md` (parked; pets if anything), `LAUNCH_AUDIT.md`, `USER_GUIDE.md`.

**Design (design/)**
- `label-rework-2026-10/` — label exploration A–G, Shopping-tile tests, chosen A3, final renders, creatine colours,
  gallery images, original supplier photo.
- `labels/` — print drafts of every wrap-around label (SVG + guides PNG), regenerated by `npm run labels`.
- `label-options/` — earlier label directions (28 Oct). `reference/` — competitor screenshots (Google Shopping rows,
  FourFive, Innerbody, Absorption Co.). `screens-2026-10-30/` — site screenshots after the 30 Oct batch.

**Tests** — `tests/e2e/` (phase1, phase2, aff, batch3) with setup README.
