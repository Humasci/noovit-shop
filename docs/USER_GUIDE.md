# Noovit Store — User Guide

This guide explains everything the Noovit store does and how to run it day to day. It is written for the store owner and team, not developers.

> Features marked **(coming)** are planned but not built yet — see the roadmap in `PROGRESS.md`.

---

## 1. How the store works

```
Customer ──► noovit.com ──► Stripe Checkout (payment) ──► Order saved in Admin
                                                              │
                                    You export orders ◄───────┘
                                          │
                                          ▼
                             Supplier (dropship) ships it
                                          │
                     You add tracking ────┴──► Customer gets "shipped" email
```

| Service | What it does for you | Where you log in |
|---|---|---|
| **noovit.com** | The shop customers see | — |
| **Admin dashboard** | Orders, fulfilment, subscriptions, customers, reviews, discounts | `noovit.com/admin` |
| **Stripe** | Takes payments, runs subscriptions, calculates tax, sends receipts, hosts the customer's "manage subscription" page | dashboard.stripe.com |
| **Supabase** | The database where orders and reviews are stored (you rarely need to open it) | supabase.com |
| **Resend** | Sends the store's emails | resend.com |
| **Vercel** | Hosts the website | vercel.com |

---

## 2. What customers can do

### Browse
- **Home page** — best sellers (with Women's / Men's Health tabs), trust badges, reviews, FAQ, newsletter sign-up, subscription benefits.
- **Shop** (`/shop`) — every product, grouped into Supplements, Sports, Specialties and Noovit Pets. Filters: product type, dietary needs (vegan, gluten-free, pregnancy-safe, postpartum-safe, low FODMAP, sugar-free) and sorting by name or price.
- **Noovit Pets** (`/pets`) — the pet range, filterable by Dogs / Cats.
- **Product pages** — image gallery, benefits, description, who it's for, ingredients, FAQs, reviews and related products.
- **Info pages** — About Us, Reviews, FAQ, Contact, Delivery & Returns, Privacy Policy, Terms.

### Buy
On each product page the customer chooses:

| Option | Packs | Price per bottle |
|---|---|---|
| **Subscribe & Save** | 1, 2 or 3 bottles, delivered every 30, 60 or 90 days | Base price −$5, −$7.50, −$10 |
| **One-time purchase** | 1, 3 or 6 bottles | Base price, −$5, −$10 |

Rules the store enforces automatically:
- **One delivery schedule per cart.** If a customer adds a 60-day subscription and then a 30-day one, the whole cart switches to 30 days and they see a message. They can change it in the cart.
- **Subscription consent.** Customers must tick a box agreeing that the subscription renews automatically before they can pay (required by California law and good practice everywhere).
- **Age check.** Carts containing Creatine require an "I am 18 or older" tick (New York law).
- **Prices are always checked on the server**, so a customer can't tamper with prices in their browser.

Checkout happens on Stripe's secure page (card, Apple Pay, Google Pay, discount codes). Shipping is free on every order, US addresses only for now. After paying, customers land on an order confirmation page and receive an email.

### Manage their subscription — "My Subscriptions"
There are no passwords. The customer goes to **My Subscriptions** (`/account`), enters the email they ordered with, and receives a secure link (valid 30 minutes) to their Stripe subscription page, where they can:
- change delivery frequency (once enabled in Stripe's portal settings) or cancel
- update their card and shipping address
- see past invoices

Stripe's page doesn't offer **pause** or **skip**. If a customer asks, pause it for them in Admin → Subscriptions.

### Leave a review
Any visitor can submit a review from a product page or the Reviews page. It **does not appear until you approve it**. If the reviewer's email matches an order for that product, it is automatically marked **Verified Buyer**.

### Emails customers receive

| When | Email | Sent by |
|---|---|---|
| Order paid | Order confirmation with items and total | Noovit (Resend) |
| Order paid | Payment receipt (turn on in Stripe → Settings → Customer emails) | Stripe |
| You mark an order shipped | "Your order is on its way" with tracking link | Noovit (Resend) |
| Customer requests it | "Manage your subscription" link | Noovit (Resend) |
| Each subscription renewal | Receipt (turn on in Stripe → Settings → Customer emails); a new order also appears in your admin | Stripe |
| Card fails on renewal | Payment retry / update card emails | Stripe (turn on in Stripe → Settings → Billing) |

---

## 3. The admin dashboard

Go to **noovit.com/admin** and sign in with the admin password. You stay signed in for 7 days on that device. **Log out** is at the bottom of the menu.

### Overview
Your daily snapshot:
- **Revenue today / 7 days / 30 days** (refunded orders excluded) and average order value.
- **Monthly recurring revenue** — what active subscriptions bring in per month, and how many active subscribers you have.
- **Cancelled (30 days)**, **cancelling at period end**, **paused** subscriptions.
- **Fulfilment issues** — orders that failed or have been waiting more than 2 days. A red banner links straight to them.
- **Recent orders** and **top products** for the last 30 days.

### Orders
- Search by **email** or **order number** (e.g. `1042` or `#1042`), filter by status, page through results.
- Click an order to see items, totals (subtotal, discount, tax, shipping), shipping address, customer, subscription and payment.

**Order statuses**

| Status | Meaning |
|---|---|
| paid | Payment received, not yet sent to supplier |
| fulfilling | Sent to the supplier |
| shipped | Supplier shipped it, tracking added |
| delivered | Delivered |
| refunded / partially refunded | Money returned |
| cancelled | Cancelled |

**Refund an order:** open the order → *Payment* box → tick "Refund $X in full" → **Refund order**. The refund goes back to the customer's card through Stripe, and any fulfilment that hasn't been sent is cancelled. For a **partial refund**, use the "View in Stripe" link and refund there — the order updates automatically.

### Fulfilment (daily routine for dropshipping)
Every paid order — including each subscription renewal — appears here as **queued**.

1. Click **Export queued (CSV)**. You get one row per product line with name, address, product, **supplier SKU**, bottles per pack, number of packs and total bottles.
2. Upload or send that file to your supplier (or enter the orders in their portal).
3. Click **Mark N queued as submitted**.
4. When the supplier ships, open the order (or find it on this page), set status to **shipped**, and enter carrier, tracking number and tracking link → **Save**. The customer is emailed automatically.
5. Optionally mark **delivered** later.

If a supplier rejects an order, set it to **failed** — it will show up in the Overview's red banner until you resolve it.

> Each row shows the supplier SKU. Anything shown in **red "no SKU"** needs a SKU mapped in **Products** first.

### Subscriptions
See every subscription with customer, status, delivery frequency, amount per delivery, next renewal date and start date. Filter by active, past due (card failed), paused or canceled.

Actions (they take effect in Stripe immediately):
- **Pause / Resume** — pauses billing and therefore new renewal orders.
- **Cancel at period end** — the customer gets the deliveries they've paid for, then it stops. **Undo cancel** reverses it.

### Customers
Every customer with number of orders, lifetime spend, active subscriptions, last order date and first-seen date. Search by name or email. Click an email to see all their orders.

### Products
Lists every product with type, one-bottle price and lowest price. Here you set each product's **supplier SKU** — the product code your supplier uses. It is attached to every new order and to the fulfilment CSV.

> Adding products or changing names, prices, descriptions or images is currently done by your developer (in `data/products.ts`, then a one-command Stripe sync). A full product editor in the admin is **(coming)** — see the roadmap.

### Reviews
- **Pending** reviews wait here. **Approve** publishes it on the product page; **Reject** hides it.
- As soon as a product has at least one approved review, its placeholder reviews are replaced with real ones.
- Each review shows whether the reviewer is a verified buyer.

### Discounts
Create discount codes customers enter at checkout:
- **Code** (e.g. `WELCOME10`), **% off**, **applies to** (first payment only, or every payment for subscriptions), optional **max uses** and **expiry date**.
- The list shows each code's usage and lets you **Deactivate** it.
- The newsletter promises 10% off the first order — create `WELCOME10` (first payment only) to honour it.

> Fixed-amount, free-shipping, minimum-order and first-order-only codes are **(coming)**.

---

## 4. Things you do in Stripe

| Task | Where in Stripe |
|---|---|
| See all payments, payouts to your bank | Payments, Balances |
| Partial refunds, disputes/chargebacks | Payments → open payment |
| Customer subscription page options (what customers can change) | Settings → Billing → Customer portal |
| Failed payment retries and emails | Settings → Billing → Subscriptions and emails |
| Sales tax registrations | Tax |
| Business details, branding on checkout and receipts (logo, colours) | Settings → Business, Branding |

---

## 5. Common tasks — quick answers

| I want to… | Do this |
|---|---|
| Ship today's orders | Admin → Fulfilment → Export CSV → send to supplier → Mark as submitted |
| Add tracking | Admin → Orders → open order → status *shipped* + tracking → Save |
| Cancel a customer's subscription for them | Admin → Subscriptions → Cancel at period end |
| Refund an order | Admin → Orders → open order → Refund |
| Help a customer who can't manage their subscription | Ask them to use My Subscriptions on the site, or change it for them in Admin → Subscriptions |
| Run a promotion | Admin → Discounts → New code |
| Publish a review | Admin → Reviews → Approve |
| Map products to the supplier | Admin → Products → enter SKU → Save |
| See how the business is doing | Admin → Overview |

---

## 6. Compliance built into the store

- FDA disclaimer in the footer of every page.
- Auto-renewal consent before subscription checkout, with renewal terms shown on the Stripe payment page and online cancellation.
- 18+ confirmation for Creatine.
- Reviews are moderated; "Verified Buyer" is only shown when the email matches a real order.
- **Before launch, replace placeholders:** demo reviews and review counts, the "25,000+ customers" claim, the advisor/vet names, and draft policy pages. Publishing invented reviews or endorsements is illegal in the US (FTC) and UK (CMA).

---

## 7. Troubleshooting

| Problem | Likely cause / fix |
|---|---|
| Checkout says "not set up yet" | Stripe keys not added to the hosting environment. |
| Checkout says a product is "temporarily unavailable" | Its price isn't in Stripe — your developer runs the Stripe sync. |
| Order paid in Stripe but not in Admin | The Stripe webhook isn't configured or is failing — check Stripe → Developers → Webhooks for errors. Stripe retries automatically for 3 days. |
| Customers aren't receiving emails | Resend key missing or domain not verified. |
| Admin says "not connected" | Database keys missing. |
| Can't sign in to Admin | Check the admin password in the hosting settings. |
