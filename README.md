# Noovit Shop

Next.js 16 storefront for Noovit supplements (human range + Noovit Pets), with Stripe for payments/subscriptions and Supabase (Postgres) for orders, fulfilment and reviews.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in keys (see below)
npm run dev
```

## One-time setup

### 1. Supabase (database)
1. Create a project at supabase.com.
2. Run `supabase/migrations/0001_init.sql` in the SQL editor (or `supabase db push` with the CLI).
3. Copy the project URL and **service-role** key into `.env.local` (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`). The service-role key is server-only — never expose it to the browser.

All tables have row-level security enabled with no policies, so only the server can read or write them.

### 2. Stripe (products & prices)
1. Put a **test-mode** secret key in `.env.local` (`STRIPE_SECRET_KEY=sk_test_...`).
2. Preview what will be created: `npm run stripe:sync -- --dry-run`
3. Sync: `npm run stripe:sync`

The sync reads `data/products.ts` and creates one Stripe product per item plus 12 prices (one-time 1/3/6 bottles; subscribe 1/2/3 bottles every 30/60/90 days). Prices are addressed by lookup key (e.g. `noovit_magnesium-complex_sub_2b_60d`), so changing a price in `data/products.ts` and re-running the sync swaps it in without code changes. It is safe to re-run, and refuses to touch a live account unless you pass `--live`.

## Structure

| Path | What |
|---|---|
| `data/products.ts` | Product catalog and pack pricing |
| `data/content.ts` | Site copy, placeholder reviews/advisors, images |
| `lib/stripe/catalog.ts` | Price plan + lookup keys shared by sync and checkout |
| `supabase/migrations/` | Database schema |
| `scripts/sync-stripe.ts` | Catalog → Stripe sync |
