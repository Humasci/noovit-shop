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
  Lion's Mane (1,000 mg), Creatine (5 g, 280 g tub, 18+ only), CoQ10 (200 mg). Plus Turmeric Complex.
  Competitor teardown: `docs/research/COMPETITORS_CORE5.md`.
- **Prices (30 Oct 2026):** Mg $29, Ashwa $27, Lion's Mane $35, Creatine $29, CoQ10 $28; subscribe/3-pack −$5,
  6-pack −$10; Sleep & Calm Stack $49. Never above the Vitasy twins (Cortex/Compass/Fernwood/Kinetic) on identical
  Supliful formulas. No fake "was" prices. `docs/PRICE_LIST.md`.
- **Label ("A3", 29 Oct):** colour block with category, name, benefit* and vertical "noovit" wordmark; white band with
  the dose per serving (single-ingredient products; blends show key ingredients) on the left and the net quantity at
  legal size on the right; "Dietary supplement" + servings below. Origin claim on the info panel. Distributor line:
  **"Distributed by Noovit LLC" + Wyoming Agents suite address** (address pending). Creatine colour: emerald `#2E8B57`.
- **Product images:** Supliful's blank bottle photo with the stock capsules edited out (`assets/mockups`,
  `scripts/remove-mockup-capsules.mjs`), framed tight (~90% height). Gallery: front, "In every serving" fact image,
  dose comparison (Mg, CoQ10), label close-up, Supplement Facts. Bump `MOCKUP_VERSION` when images change.
- **Analytics:** GTM `GTM-5LKW5HGS` built in; GA4 lives inside GTM (leave the site GA4 field empty). Consent is
  opt-out (banner; Decline = denied). GA4 ecommerce events + `generate_lead` with `lead_source`.
- **Not selling (for now):** berberine (Supliful dose too low), methylene blue (legal status, SSRI/G6PD risks; guide only),
  NAD+ (maybe later), Supliful's "GLP-1 Support". Draft bundle "Light Appetite Essentials" is hidden pending approval.

## Rules for content and claims
- **FDA structure/function language only:** never "treats/cures/prevents". Benefit claims carry * → disclaimer.
- **Guides:** every source opened and verified, evidence graded (Moderate / Limited / Early / Insufficient), null
  results included, no Noovit mention in the body. Brief: `docs/research/GUIDE_RESEARCH_BRIEF.md`. All guides need a
  medical reviewer before launch. Don't link a guide from a product whose label contradicts it (lion's mane, until
  Supliful's beta-glucan COA).
- **No unverified trust claims** (GMP, third-party tested, Made in USA wording) until Supliful provides proof (TODO).
- US spelling on the site. Plain, short sentences.

## Tech
- Next.js 16 (App Router), React 19, Supabase (Postgres + PostgREST), Stripe (Checkout + subscriptions), Resend,
  Vercel. Fonts self-hosted (Inter, Manrope, Funnel Display for the wordmark).
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

## Artifact index
**Strategy & research (docs/)**
- `research/COMPETITORS_CORE5.md` — core-5 competitors, prices, label patterns, Shopping screenshots, decisions.
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
