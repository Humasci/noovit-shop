# Noovit — Progress Log

_Last updated: 2026-10-26_

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

## Waiting on
- [ ] Stripe test keys → run `npm run stripe:sync`, add webhook endpoint + customer portal settings (README §2), test a real test-mode checkout.
- [ ] Supabase project → run `supabase/migrations/0001_init.sql`.
- [ ] Email sending (Resend API key + verified sending domain).
- [ ] Choose `ADMIN_PASSWORD` and generate `APP_SECRET`; add all keys in Vercel.
- [ ] Supplier replies → choose US supplier, map supplier SKUs, decide API vs CSV fulfilment.
- [x] Preliminary trademark knock-out search (owner, Oct 2026) — see below.
- [ ] Attorney clearance + file NOOVIT in US and UK (class 5 + 35, consider 30/31) before ordering labelled samples.
- [ ] Logo + mockups → apply brand styling.

## Before launch
- [ ] Replace placeholder reviews, review counts, advisor/vet panel and "25,000+ customers" claim.
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
Status: **Have** · **Phase N** = planned · **Tool** = use a specialist service · **Not needed** for dropshipping

### Products & catalog
| Shopify feature | Status |
|---|---|
| Products with variants (pack sizes, subscribe/one-time) | Have (in code) |
| **Admin product editor** (add/edit products, prices, copy, images, publish/unpublish) with automatic Stripe sync | Phase 1 |
| Product image/media uploads | Phase 1 |
| Availability: in stock / out of stock / hidden (dropship has no own inventory) | Phase 1 |
| SEO per product (title, description, URL), sitemap.xml, robots, Product schema for Google rich results | Phase 1 |
| Collections / tags (editable) | Have (fixed filters) · Phase 2 editable |
| Bulk edit, CSV product import/export | Phase 2 |
| Supplier stock & price sync | Phase 3 (depends on supplier API) |

### Orders & fulfilment
| Shopify feature | Status |
|---|---|
| Orders list, detail, search, full refunds | Have |
| Fulfilment with tracking + shipping email | Have |
| Supplier export (CSV) | Have |
| Automatic order forwarding to supplier (DSers/Supliful-style) | Phase 3 (after supplier choice) |
| Partial refunds from admin, cancel order, order notes/tags | Phase 2 |
| Draft / manual orders (replacements, phone orders) | Phase 2 |
| Returns management | Phase 3 |
| Packing slips, own shipping rates/labels | Not needed (supplier handles) |

### Customers
| Shopify feature | Status |
|---|---|
| Customer list, order history, lifetime spend | Have |
| Self-service subscription management | Have (Stripe portal) |
| Customer notes, tags, segments, CSV export | Phase 2 |

### Marketing
| Shopify feature | Status |
|---|---|
| Discount codes (% off, usage limits, expiry) | Have |
| Fixed-amount, free-shipping, minimum-order, first-order-only codes | Phase 1 |
| Abandoned checkout recovery emails | Phase 1 |
| Newsletter sign-ups stored + exported (currently not saved) | Phase 1 |
| Google Shopping & Meta/Instagram/TikTok product catalog feeds | Phase 1 |
| Analytics & ad pixels (GA4, Meta, TikTok) with cookie consent | Phase 1 (needs account IDs) |
| Email campaigns & automations (Shopify Email equivalent) | Tool: Klaviyo integration, Phase 2 |
| Review request email after delivery | Phase 2 |
| Automatic discounts, bundles, cart upsells, newsletter pop-up | Phase 2 |
| Blog / content pages for SEO | Phase 2 |
| Sales reports by product/day, subscription retention, CSV export | Have (overview) · Phase 2 reports |
| Affiliates/influencer codes, loyalty, gift cards | Tool or Phase 3 |

### Store settings
| Shopify feature | Status |
|---|---|
| Payments, Apple/Google Pay, tax | Have (Stripe) |
| Staff accounts with individual logins & permissions | Phase 2 (one shared password today) |
| Edit homepage/announcement text without a developer | Phase 2 |
| Markets / multi-currency (UK) | with UK launch |
| Custom domain | at launch (noovit.com) |
