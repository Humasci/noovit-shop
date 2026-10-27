# Noovit Shop

Next.js 16 storefront for Noovit supplements (human range + Noovit Pets), with Stripe for payments/subscriptions, Supabase (Postgres) for orders, fulfilment and reviews, and an admin dashboard at `/admin`.

Progress and open decisions: [`docs/PROGRESS.md`](docs/PROGRESS.md).

## Local development

```bash
npm install
cp .env.example .env.local   # fill in keys (see below)
npm run dev
```

Everything degrades gracefully without keys: the store works, checkout shows "not set up yet", and the admin shows "not connected".

## Go-live setup (in order)

### 1. Supabase
1. Create a project at supabase.com.
2. Run the files in `supabase/migrations/` in order (`0001` to `0005`) in the SQL editor. `0002` also creates the public `product-images` storage bucket.
3. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. All tables have row-level security with no policies — only the server can read or write.

### 2. Stripe
1. Set `STRIPE_SECRET_KEY` (test mode first).
2. Load the catalog: in **Admin → Products** click **Import launch catalog** (or run `npm run catalog:seed`).
   Then click **Sync all to Stripe** (or `npm run stripe:sync`). Each product gets 12 prices; after that, saving a product in the admin syncs it automatically. The CLI refuses live keys without `--live`.
3. **Webhook:** Developers → Webhooks → add endpoint `https://<your-domain>/api/stripe/webhook` with events:
   `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.expired`, `invoice.paid`,
   `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `charge.refunded`.
   Put its signing secret in `STRIPE_WEBHOOK_SECRET`.
4. **Customer portal:** Settings → Billing → Customer portal — enable cancellation, payment-method and shipping-address updates, invoice history, and subscription updates (add the Noovit products so customers can switch frequency or pack size). The portal has no pause/skip; pause from `/admin/subscriptions`.
5. **Tax (before live):** set up Stripe Tax registrations, then `STRIPE_TAX_ENABLED=true`.

### 3. Email
Create a Resend account, verify your sending domain, set `RESEND_API_KEY` and `EMAIL_FROM`. Sends order confirmations, shipping notifications and "My Subscriptions" links.

### 4. Admin
Set `APP_SECRET` (`openssl rand -base64 48`) and a one-time setup password `ADMIN_PASSWORD`. Set `ADMIN_PATH` to a hard-to-guess word (e.g. `team-k7q2x9m4`); open `/<ADMIN_PATH>` to reach the login (plain `/admin` returns 404 until a browser has used the secret address). Sign in with the setup password, create the Owner account on the Staff page, and from then on everyone signs in with their own email and password (the setup password stops working once a staff account exists). Roles: Owner, Manager, Fulfilment.

### 5. Scheduled job
Set `CRON_SECRET` (random string). `vercel.json` runs `/api/cron/daily` at 15:00 UTC, which sends review-request emails.

### 6. Klaviyo (optional)
Set `KLAVIYO_PRIVATE_KEY` (scopes: lists, profiles, subscriptions, events — write) and the list ID in Admin → Settings.

### 7. Marketing (Admin → Settings)
Create the `WELCOME10` discount, then in Settings add it as the newsletter code, your business postal address, and any GA4 / Meta / TikTok pixel IDs. Settings also lists the product-feed URLs for Google Merchant Center, Meta Commerce Manager and TikTok.

## How it works

- **Checkout** (`/api/checkout`): the server re-validates the cart against the catalog, resolves Stripe prices by lookup key, and creates a Stripe Checkout session. All subscription items share one delivery frequency; subscriptions require auto-renewal consent, and Creatine requires an 18+ confirmation.
- **Webhook** (`/api/stripe/webhook`): verifies the signature, then creates orders (one-time, first subscription order, each renewal), mirrors subscriptions, and marks refunds. Order + items + fulfilment are inserted in one transaction, and duplicate deliveries are ignored.
- **Fulfilment:** each paid order gets a queued fulfilment. In `/admin/fulfilment`, export the CSV for your supplier, mark as submitted, and add tracking when it ships — the customer is emailed.
- **My Subscriptions** (`/account`): customers enter their email and receive a 30-minute signed link to the Stripe customer portal. No passwords.
- **Catalog:** products live in the `products` table (seeded from `data/products.ts`) and are cached for the storefront; admin saves refresh the cache instantly and sync prices to Stripe. Hidden products disappear from the store, feeds and sitemap; out-of-stock products stay visible but can't be bought.
- **Marketing:** newsletter sign-ups and checkout opt-ins are stored as subscribers; every marketing email has a postal address and one-click unsubscribe. Checkouts expire after 2 hours; consenting shoppers get one recovery email (max one a week) and recovered orders are linked back.
- **SEO & channels:** sitemap, robots, canonical URLs, Product/Organization structured data (ratings only from real reviews), PNG product images at `/product-image/<slug>`, and feeds at `/feeds/google.xml`, `/feeds/meta.csv`, `/feeds/tiktok.csv`.
- **Staff & roles:** per-person accounts (scrypt-hashed passwords) with Owner / Manager / Fulfilment roles; every admin page, action and export checks the role, and accounts are re-checked on each request so deactivation is immediate.
- **Order tools:** partial refunds and cancellations (Stripe idempotency keys prevent double refunds), internal notes, tags, free replacement orders and Stripe payment links.
- **Catalog tools:** collections with storefront pages, bundles (expanded into component SKUs for fulfilment), bulk actions, product CSV import/export.
- **Content:** editable homepage/announcement/trust bar/pop-up, and a markdown blog (raw HTML and unsafe URLs stripped).
- **Automations:** review-request emails (daily cron), automatic spend-threshold discount, cart cross-sell, newsletter pop-up, Klaviyo sync.
- **Reports:** revenue by day, sales by product, subscription retention, order CSV export.
- **Analytics:** GA4, Meta and TikTok pixels load only after cookie consent and track page views, product views, add to cart, checkout started and purchases.
- **Reviews:** submitted reviews are held for approval in `/admin/reviews`; once a product has approved reviews they replace its placeholder reviews. "Verified buyer" is set when the email matches an order for that product.

## Structure

| Path | What |
|---|---|
| `app/(store)/` | Storefront pages |
| `app/admin/` | Admin dashboard (password-protected) |
| `app/api/` | Checkout, Stripe webhook, account portal links, reviews |
| `data/products.ts` | Launch catalog (seed data) and pack pricing rules |
| `lib/catalog/` | Catalog loading/caching and DB ↔ product mapping |
| `lib/marketing/` | Subscribers and abandoned-checkout recovery |
| `data/content.ts` | Site copy, placeholder reviews/advisors, images |
| `lib/orders/ingest.ts` | Stripe event → order/subscription logic |
| `lib/stripe/catalog.ts` | Price plan + lookup keys shared by sync and checkout |
| `supabase/migrations/` | Database schema |
| `scripts/` | `stripe:sync` and `catalog:seed` CLI scripts |
