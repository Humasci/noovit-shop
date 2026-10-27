# Noovit — Progress Log

_Last updated: 2026-10-27_

## Decisions
- **Model:** dropship / white-label first, then own contract manufacturer + 3PL per country.
- **Markets:** US first, UK second (needs UK supplier, UK-specific claims copy, council food-business registration).
- **Structure:** site mirrors BetterVits' information architecture; all copy, imagery and slogans are original.
- **Catalog:** 16 human supplements + Creatine + Mushroom Blend, plus 6 Noovit Pets placeholders. **NMN removed** (FDA dispute in US, unauthorised novel food in UK).
- **Commerce stack:** custom Next.js + Stripe (Checkout, Billing, Tax, Customer Portal) + Supabase Postgres. No Shopify.
- **Subscriptions:** one delivery frequency (30/60/90 days) per cart.
- **Customer accounts:** no passwords at launch — "My Subscriptions" emails a Stripe Customer Portal link.
- **Domain:** noovit.com (owned).
- **Documentation:** owner/team user guide in [`USER_GUIDE.md`](USER_GUIDE.md); this file tracks progress and roadmap.

## Done
- [x] Storefront: home, shop (type/diet filters, sort), product pages (packs, subscribe & save, tabs, FAQ, reviews), Reviews, FAQ, About, Contact, policy pages, cart drawer + cart page.
- [x] Noovit Pets section (`/pets`) with Dog/Cat filtering and pet-aware product pages.
- [x] Database schema (`supabase/migrations/`), validated against Postgres.
- [x] Stripe catalog sync script (`npm run stripe:sync`) — 23 products, 276 prices, dry-run verified.
- [x] Supplier outreach email drafted (US: Supliful, HoneyComm / Private Label Supplements, Nutra Group).
- [x] Checkout + payment webhooks + order confirmation emails + success page.
- [x] "My Subscriptions" via emailed Stripe Customer Portal link.
- [x] Customer review submission → admin moderation → shown on product pages.
- [x] Admin dashboard (`/admin`): overview, orders, fulfilment queue + CSV export, subscriptions, customers, products (supplier SKUs), reviews, discount codes.
- [x] Tested end-to-end against a local Postgres + PostgREST and a fake Stripe: checkout rules, webhook ingestion (one-time, subscription, renewal, duplicates, refunds), portal links, reviews, every admin action.
- [x] **Phase 1 (Shopify parity):** admin product editor (DB catalog, photos, status, SEO, supplier SKU, automatic Stripe sync); sitemap, robots, structured data, PNG product images; Google/Meta/TikTok product feeds; richer discount codes; newsletter subscribers with one-click unsubscribe; abandoned-checkout recovery; Settings page with GA4/Meta/TikTok pixels behind a cookie banner. 46/46 end-to-end checks passing.
- [x] **Affiliates & influencers:** partner codes + share links (noovit.com/r/CODE, 30-day memory, code auto-applied), commissions on first orders and optionally renewals, refund-aware, 30-day hold then auto-approval, payouts log, private partner dashboard, CSV export. 55/55 end-to-end checks.
- [x] Label system v1 (`lib/labels/svg.ts`): draft wrap-around label (6.5" × 2.25" + bleed; Supplement Facts | front | info panels), `npm run labels` → `design/labels/`; the same design now draws every product image on the site and the feed PNGs (rendered with resvg + bundled OFL fonts in `assets/fonts`). Brief: `docs/LABEL_DESIGN_BRIEF.md`.
- [x] Supplement quiz at `/quiz` (lib/quiz.ts scoring; diet/pregnancy filters; plan to cart; email capture as source `quiz`).
- [x] Brand mosaic on the site: two mosaic crosses (lib/brand/cross.ts): the five-tile mark in the logo, icon and labels, the nine-tile version in the loader and large graphics; breathing cross loader for checkout, route loading and pending buttons; small fading tile field in the hero with a dissolve into the strip below; product-card hover tiles; tile-fill Add to Cart. Bottle label edges near-straight with a small-tile gradient from the top-right.
- [x] Supplier research (Oct 2026) → `docs/SUPPLIER_RESEARCH.md`.
- [x] **Launch audit (Oct 27)** — code, SEO/content/compliance/performance and UX/accessibility reviews; report and remaining owner actions in [`LAUNCH_AUDIT.md`](LAUNCH_AUDIT.md). Fixed: all placeholder reviews, ratings, counts and advisor quotes removed (only real approved reviews show); working contact form; page titles, canonicals, noindex for cart/account/empty pages, branded 404 and error pages; bottle images served as cached, resized images (home page HTML ~1 MB → a fraction); cart drawer and pop-up are proper dialogs; WCAG contrast, focus and labels; sticky mobile Add to Cart; checkout explains missing consent; security headers; admin login rate limit; webhook re-fetches Stripe objects; fulfilment marks only exported orders; subscription terms in the confirmation email; product pages default to one-time. Migration `0006_launch_audit` applied live.
- [x] **Phase 2 (Shopify parity):** staff accounts with Owner/Manager/Fulfilment roles; partial refunds, cancellations, order notes & tags, manual replacement orders and payment links; customer profiles with notes, tags, segments and CSV export; collections, bundles, bulk product actions, product CSV import/export; editable homepage, announcement bar and pop-up; blog; review-request emails (daily cron), automatic spend discount, cart cross-sell, Klaviyo sync; reports with charts.

## Waiting on
- [ ] Stripe test keys → run `npm run stripe:sync`, add webhook endpoint + customer portal settings (README §2), test a real test-mode checkout.
- [x] Supabase project `noovit` created; migrations `0001`–`0003` applied (15 tables, RLS on all).
- [ ] Add `SUPABASE_URL` + service-role key in Vercel, redeploy, then Admin → Products → Import launch catalog.
- [ ] Email sending (Resend API key + verified sending domain).
- [ ] `APP_SECRET`, `CRON_SECRET` and `ADMIN_PASSWORD` generated/chosen → add in Vercel; sign in and create the Owner account.
- [ ] Optional: Klaviyo private key + list ID.
- [ ] Admin → Settings: GA4 / Meta / TikTok IDs, welcome code (create WELCOME10 first), business postal address; add feed URLs to Google Merchant Center, Meta Commerce Manager, TikTok.
- [x] NAC added as a **hidden draft** (`/products/nac`, 600mg). To put it in the live database: Admin → Products → **Import launch catalog** (adds only missing products). Before publishing, recheck FDA's NAC status (enforcement discretion since 2022), supplier availability and Amazon/TikTok rules.
- [x] **Launch supplier: Supliful, manual orders** (decided 27 Oct). Admin → Fulfilment shows a copyable address and phone for each queued order, and checkout now collects a phone number. Automatic connection via a hidden Shopify store comes later; OK Capsule daily packs are a possible second line (`docs/DAILY_PACK_CONCEPT.md`).
- [ ] Suppliers (see `docs/SUPPLIER_RESEARCH.md`): HoneyComm appears defunct; request samples from On Demand Fulfillment, Supliful, Professional Nutritionals, Vitalabs and pet makers (Pet Tech Labs / Natural Pet Innovations); then choose, map supplier SKUs, build order forwarding.
- [x] Catalog changes from research (applied to the live database too): Niacinamide and Odorless Garlic hidden; Marine Collagen → Collagen Complex (`/products/collagen-complex`); all pet products hidden and /pets is a "coming soon" waitlist (sign-ups saved as subscribers, source `pets-waitlist`); Noovit Focus drafts added (Focus Complex, Lion's Mane, L-Theanine Calm Focus — hidden until formulas match a supplier).
- [x] Migrations `0004_affiliates` and `0005_hardening` applied to the live Supabase project; security advisor shows only the expected "RLS enabled, no policy" notices.
- [x] Preliminary trademark knock-out search (owner, Oct 2026) — see below.
- [ ] Attorney clearance + file NOOVIT in US and UK (class 5 + 35, consider 30/31) before ordering labelled samples.
- [x] Brand: Funnel Display for the wordmark and all headings, Inter body; navy + vivid orange (#FF5F00) with opal secondary; noovit wordmark and n⁺ icon carry an orange **mosaic cross** (favicon = navy tile, solid cross). Pets button vivid orange; on Pets pages a "Humans" button in opal. Label v2: 3D bottle mockups, colour block + white band, vertical two-tone wordmark.
- [ ] Logo + mockups → apply brand styling.

## Before launch
- [x] Placeholder reviews, review counts, advisor/vet panel and "25,000+ customers" claim removed (Oct 27 audit).
- [ ] Owner actions from [`LAUNCH_AUDIT.md`](LAUNCH_AUDIT.md) (claims evidence, Made in USA wording, legal pages, contact details, social URLs).
- [ ] Align formulas/doses on the site with the chosen supplier's actual products.
- [ ] Claims review by a regulatory lawyer; Prop 65 check; FDA structure/function notification within 30 days of first sale.
- [ ] Product liability insurance; legal review of policy pages.
- [ ] Stripe Tax registrations for states where you have nexus.
- [ ] Turn on live Stripe keys and run `npm run stripe:sync -- --live`.

## Next
- Direct supplier integration (API or Shopify bridge) once a supplier is chosen.
- UK market: region switch (GBP), UK claims copy, UK supplier routing.
- Brand styling from logo/mockups.

## Trademark — preliminary search (Oct 2026)
_Owner's own search on UKIPO and USPTO. Not legal advice._

| Register | Mark | Status | Classes | Risk for NOOVIT (supplements, class 5) |
|---|---|---|---|---|
| USPTO | NOOVITA | Dead / abandoned | 5 (dietary supplements) | None as a blocker — abandoned. |
| UKIPO | NOOVI | Registered (2023) | 10 (medical apparatus), 28 (toys/games) | Closest in spelling; different goods, but class 10 is health-adjacent. Low–moderate. |
| UKIPO | Noovid | Registered | _not visible — check_ | Unknown until classes are checked. |
| UKIPO | NOOXIT | Registered (2019) | _not visible — check_ | Check classes. |
| UKIPO | noovii | Registered (2017) | 21 (household utensils) | Low. |
| UKIPO | NOODIT | Expired | 29–31, 35 | None. |

No live identical "NOOVIT" mark found in either register. Next: check classes for Noovid and NOOXIT; search EUIPO/WIPO Global Brand Database and Amazon/Google for unregistered use; then an attorney clearance and filing in **class 5** (human and animal dietary supplements) and **class 35** (online retail), considering **30** (mushroom coffee blends) and **31** (pet treats).

## Roadmap — Shopify feature parity (dropshipping focus)
Status: **Have** · **Phase N** = planned (Phases 1–2 done Oct 2026) · **Tool** = use a specialist service · **Not needed** for dropshipping

### Products & catalog
| Shopify feature | Status |
|---|---|
| Products with variants (pack sizes, subscribe/one-time) | Have (in code) |
| **Admin product editor** (add/edit products, prices, copy, images, publish/unpublish) with automatic Stripe sync | Have |
| Product image/media uploads | Have |
| Availability: in stock / out of stock / hidden (dropship has no own inventory) | Have |
| SEO per product (title, description, URL), sitemap.xml, robots, Product schema for Google rich results | Have |
| Collections / tags (editable) | Have (collections) |
| Bulk edit, CSV product import/export | Have |
| Supplier stock & price sync | Phase 3 (depends on supplier API) |

### Orders & fulfilment
| Shopify feature | Status |
|---|---|
| Orders list, detail, search, full refunds | Have |
| Fulfilment with tracking + shipping email | Have |
| Supplier export (CSV) | Have |
| Automatic order forwarding to supplier (DSers/Supliful-style) | Phase 3 (after supplier choice) |
| Partial refunds from admin, cancel order, order notes/tags | Have |
| Draft / manual orders (replacements, phone orders) | Have |
| Returns management | Phase 3 |
| Packing slips, own shipping rates/labels | Not needed (supplier handles) |

### Customers
| Shopify feature | Status |
|---|---|
| Customer list, order history, lifetime spend | Have |
| Self-service subscription management | Have (Stripe portal) |
| Customer notes, tags, segments, CSV export | Have |

### Marketing
| Shopify feature | Status |
|---|---|
| Discount codes (% off, usage limits, expiry) | Have |
| Fixed-amount, first-N-months, minimum-order, first-order-only codes (free shipping is always on) | Have |
| Abandoned checkout recovery emails | Have |
| Newsletter sign-ups stored + exported, one-click unsubscribe | Have |
| Google Shopping & Meta/Instagram/TikTok product catalog feeds | Have |
| Analytics & ad pixels (GA4, Meta, TikTok) with cookie consent | Have — IDs go in Admin → Settings |
| Email campaigns & automations (Shopify Email equivalent) | Have (Klaviyo sync) |
| Review request email after delivery | Have |
| Automatic discounts, bundles, cart upsells, newsletter pop-up | Have |
| Blog / content pages for SEO | Have |
| Sales reports by product/day, subscription retention, CSV export | Have (Reports) |
| Affiliate/influencer codes with commissions & payouts | Have |
| Loyalty, gift cards | Tool or Phase 3 |

### Store settings
| Shopify feature | Status |
|---|---|
| Payments, Apple/Google Pay, tax | Have (Stripe) |
| Staff accounts with individual logins & permissions | Have |
| Edit homepage/announcement text without a developer | Have |
| Markets / multi-currency (UK) | with UK launch |
| Custom domain | at launch (noovit.com) |
