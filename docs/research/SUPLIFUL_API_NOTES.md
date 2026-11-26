# Supliful automation for a custom store (26 Nov 2026)

**Source:** Supliful help article "Connect your custom app to Supliful using Shopify Admin API"
(https://help.supliful.com/en/articles/12459926-connect-your-custom-app-to-supliful-using-shopify-admin-api).
The article Victor linked (6127131, "API for Wix and other storefront integrations") returns 404 now.
`api.supliful.com` answers "Healthy!" but has no public docs; `developers.supliful.com` needs a login.

## How it works
Supliful has no direct order API for custom stores. Their documented route is a **hidden Shopify store** that our site
talks to through Shopify's Admin API:
1. Shopify store with the Supliful app installed; our 7 products published from Supliful ("Publish to Shopify" only;
   hand-made Shopify products don't fulfil). Settings → Checkout → "Automatically fulfill the order's line items";
   shipping zones under "Supliful Fulfillment".
2. A Shopify custom app (Settings → Apps → Develop apps) with scopes read/write products, orders, customers
   (+ fulfillments); its Admin API token goes in Vercel.
3. After Stripe confirms payment, our webhook calls `orderCreate` (GraphQL Admin API, `X-Shopify-Access-Token` header)
   with the variant IDs, quantities, shipping + billing address **with phone**, email, `financialStatus: PAID`,
   `sendReceipt: false`, `sendFulfillmentReceipt: false`, and our order number in `note`/`customAttributes`.
   Missing phone or email makes Supliful decline the order.
4. Supliful picks it up automatically (Pro plan, card on file pays product + fulfilment + shipping).
5. Shopify webhooks back to us (`ORDERS_FULFILLED`, `FULFILLMENTS_CREATE`, `FULFILLMENTS_UPDATE`, `ORDERS_CANCELLED`,
   `ORDERS_UPDATED`, verified with `X-Shopify-Hmac-SHA256`, answer 200 within 5 s) carry tracking number, URL and
   carrier → our order goes to "shipped", the customer gets our shipping email, tracking shows in My Account.

## What we'd build (about one session)
- `lib/fulfilment/shopify.ts`: orderCreate + variant mapping (our product slug → Shopify variant ID, stored as the
  product's Supplier SKU or a new field); bundles split into parts (the CSV export already does this).
- Call it from the Stripe webhook after the order is saved (and on subscription renewals); failures leave the order
  in Admin → Fulfilment for a manual retry, with a "Send to Supliful" button.
- `/api/shopify/webhook`: HMAC check, tracking → existing "shipped" flow.
- Off until `SHOPIFY_STORE_DOMAIN` + `SHOPIFY_ADMIN_TOKEN` + `SHOPIFY_WEBHOOK_SECRET` are set; tested against a fake
  Shopify like the fake Stripe.

## Cost and decision
- Shopify plan for the hidden store: Basic is about $39/month ($29 billed yearly). Check whether the cheaper Starter
  plan allows custom apps before choosing it (not confirmed).
- Not needed for launch: manual orders take about 3 minutes each (Admin → Fulfilment → Copy address → Supliful).
- Worth switching when orders reach roughly 5–10 a day, or sooner if shipping speed matters more than $39/month.
