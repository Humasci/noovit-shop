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
2. Run `supabase/migrations/0001_init.sql` in the SQL editor.
3. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. All tables have row-level security with no policies — only the server can read or write.

### 2. Stripe
1. Set `STRIPE_SECRET_KEY` (test mode first).
2. `npm run stripe:sync -- --dry-run`, then `npm run stripe:sync` — creates 23 products × 12 prices from `data/products.ts`. Re-run whenever prices change; it refuses live keys without `--live`.
3. **Webhook:** Developers → Webhooks → add endpoint `https://<your-domain>/api/stripe/webhook` with events:
   `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `invoice.paid`,
   `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `charge.refunded`.
   Put its signing secret in `STRIPE_WEBHOOK_SECRET`.
4. **Customer portal:** Settings → Billing → Customer portal — enable cancel, pause, update payment method and shipping address.
5. **Tax (before live):** set up Stripe Tax registrations, then `STRIPE_TAX_ENABLED=true`.

### 3. Email
Create a Resend account, verify your sending domain, set `RESEND_API_KEY` and `EMAIL_FROM`. Sends order confirmations, shipping notifications and "My Subscriptions" links.

### 4. Admin
Set `ADMIN_PASSWORD` and `APP_SECRET` (`openssl rand -base64 48`), then sign in at `/admin`.

## How it works

- **Checkout** (`/api/checkout`): the server re-validates the cart against the catalog, resolves Stripe prices by lookup key, and creates a Stripe Checkout session. All subscription items share one delivery frequency; subscriptions require auto-renewal consent, and Creatine requires an 18+ confirmation.
- **Webhook** (`/api/stripe/webhook`): verifies the signature, then creates orders (one-time, first subscription order, each renewal), mirrors subscriptions, and marks refunds. Order + items + fulfilment are inserted in one transaction, and duplicate deliveries are ignored.
- **Fulfilment:** each paid order gets a queued fulfilment. In `/admin/fulfilment`, export the CSV for your supplier, mark as submitted, and add tracking when it ships — the customer is emailed.
- **My Subscriptions** (`/account`): customers enter their email and receive a 30-minute signed link to the Stripe customer portal. No passwords.
- **Reviews:** submitted reviews are held for approval in `/admin/reviews`; once a product has approved reviews they replace its placeholder reviews. "Verified buyer" is set when the email matches an order for that product.

## Structure

| Path | What |
|---|---|
| `app/(store)/` | Storefront pages |
| `app/admin/` | Admin dashboard (password-protected) |
| `app/api/` | Checkout, Stripe webhook, account portal links, reviews |
| `data/products.ts` | Product catalog and pack pricing |
| `data/content.ts` | Site copy, placeholder reviews/advisors, images |
| `lib/orders/ingest.ts` | Stripe event → order/subscription logic |
| `lib/stripe/catalog.ts` | Price plan + lookup keys shared by sync and checkout |
| `supabase/migrations/` | Database schema |
| `scripts/sync-stripe.ts` | Catalog → Stripe sync |
