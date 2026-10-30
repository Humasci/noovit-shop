# End-to-end tests

Browser and API tests that run against a **production build** of the store, with a local Postgres (PGlite),
PostgREST in front of it (the Supabase API shape), a fake Stripe server and fake Klaviyo. Last run 30 Oct 2026:
phase1 47/47, phase2 60/60, aff 55/55, batch3 15/15.

| Suite | Covers |
|---|---|
| `phase1.mjs` | Catalog import, product editor, Stripe sync, feeds, SEO, discounts, newsletter, abandoned checkout, settings, consent |
| `phase2.mjs` | Staff and roles, order tools, customers, collections, bundles, bulk edit, CSV import/export, content and blog, automations, pop-up (goal first), reports |
| `aff.mjs` | Affiliate and influencer codes, commissions, payouts |
| `batch3.mjs` | Newsletter goal, guide images, feed titles, gallery images, privacy export and deletion |

## One-time setup
1. `cd tests/e2e && npm install`, and point `CHROMIUM_PATH` at a Chromium binary if Playwright can't find one.
2. Put a [PostgREST](https://postgrest.org) binary at `tests/e2e/bin/postgrest`.
3. Copy `postgrest.conf.example` to `postgrest.conf` and set a local `jwt-secret` (32+ characters).
4. Make a service-role key signed with that secret and save it as the first line of `keys.txt`:
   `node -e "console.log(require('jsonwebtoken').sign({ role: 'service_role' }, '<secret>'))" > keys.txt`
5. Copy `test.env.example` to `test.env` and fill it in. Local-only values:
   - `STRIPE_SECRET_KEY=sk_test_123`, `STRIPE_WEBHOOK_SECRET=whsec_test_secret`, `STRIPE_MOCK_PORT=` (fake-stripe's port, see `fake-stripe.mjs`)
   - `SUPABASE_URL=http://127.0.0.1:54321`, `SUPABASE_SERVICE_ROLE_KEY=` (the key from step 4)
   - `ADMIN_PASSWORD=test-admin-pass` (the suites sign in with it), `SITE_LIVE=true`, `NEXT_PUBLIC_SITE_URL=http://localhost:3100`
   - any random strings for `APP_SECRET` and `CRON_SECRET`; `KLAVIYO_PRIVATE_KEY` any value, `KLAVIYO_API_BASE` = the fake server URL.

## Running
Each suite needs a fresh database, so start and stop around every run:
```
bash tests/e2e/startdb.sh                     # database only, for the build
(set -a; . tests/e2e/test.env; set +a; npx next build)
bash tests/e2e/stop.sh
for s in phase1 phase2 aff batch3; do bash tests/e2e/start.sh; node tests/e2e/$s.mjs; bash tests/e2e/stop.sh; done
```
Clear `.next/cache` before building if prices or catalog data look stale (the catalog is cached between builds).
When products are added to `data/products.ts`, update the hard-coded counts in `phase1.mjs` (products, Stripe prices)
and `phase2.mjs` (CSV export lines).
