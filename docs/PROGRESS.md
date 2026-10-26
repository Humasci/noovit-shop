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
- [ ] "Noovit" trademark search (USPTO / UKIPO) before ordering labelled samples.
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
