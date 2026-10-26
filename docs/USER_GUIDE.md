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

### Join the newsletter
The homepage newsletter form (and the marketing tick-box at checkout) adds people to your **Subscribers** list. Newsletter sign-ups get a welcome email with your welcome discount code. Every marketing email has an **Unsubscribe** link that works in one click, including Gmail's and Apple Mail's built-in unsubscribe button.

### Cookie choice
If you've added tracking IDs in Settings, visitors see a small cookie banner. Nothing is tracked until they click **Accept**. They can change their mind via **Cookie preferences** in the footer.

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
| Joins the newsletter | Welcome email with your welcome code | Noovit (Resend) |
| Leaves checkout without paying (and ticked the marketing box) | "You left something in your cart" with a link back to their exact cart — at most one a week | Noovit (Resend) |

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
The list shows every product with photo, type, status, one-bottle price, lowest price and supplier SKU. Filter by type, click **Edit** to change a product, or **New product** to add one.

**First-time setup:** when the database is new, click **Import launch catalog** to copy in the 23 launch products, then **Sync all to Stripe** to create their prices.

**Editing a product** — everything shoppers see is editable:

| Section | What it controls |
|---|---|
| **Photos** | Upload JPG/PNG/WebP (up to 4 MB, square works best). The first photo is the main image; use the arrows to reorder. With no photos the store shows a generated bottle mockup. |
| **Basics** | Name, short benefit (shown on cards), description, who it's for, product type. The URL handle is set when the product is created and can't change afterwards. |
| **Pricing & format** | Base price (one-time, 1 bottle), form, servings per bottle and label colour. A preview shows all six pack prices — subscribe: base −$5 / −$7.50 / −$10 per bottle; one-time packs: −$0 / −$5 / −$10. Minimum base price is $15. |
| **Benefits, ingredients, dosage, product FAQs** | The product page tabs and FAQ. Add or remove rows freely. |
| **Search engine listing** | The page title and description Google shows, with a live preview and length counters. |
| **Status** | **Active** (on sale), **Out of stock** (still visible, can't be bought — use when your supplier runs out), **Hidden** (removed from the store, search, sitemap and ad feeds). |
| **Supplier** | Your supplier's product code; added to every new order and the fulfilment CSV. |
| **Tags** | Dietary filters, Women's/Men's Health tabs, Dogs/Cats for pet products, Best seller, and 18+ age check. |
| **Rating display** | Placeholder rating and count, used only until real reviews are approved (set the count to 0 to hide stars). |

Click **Save changes**. The store updates immediately, and prices are pushed to Stripe automatically — the message tells you how many prices changed. If Stripe was unavailable, use **Sync all to Stripe** on the product list to retry.

> New products start **hidden** so you can add photos and check the page first. Existing subscribers keep paying the price they signed up at; price changes apply to new purchases.

### Reviews
- **Pending** reviews wait here. **Approve** publishes it on the product page; **Reject** hides it.
- As soon as a product has at least one approved review, its placeholder reviews are replaced with real ones.
- Each review shows whether the reviewer is a verified buyer.

### Discounts
Create discount codes customers enter at checkout:
- **Type:** percentage off or a fixed dollar amount off.
- **Applies to:** first payment only, the first N months of a subscription (e.g. "20% off your first 3 months"), or every payment.
- **Conditions (optional):** minimum order amount, first-time customers only, maximum number of uses, expiry date.
- The list shows each code's conditions and usage and lets you **Deactivate** it.
- Shipping is always free, so there's no free-shipping code type.
- The newsletter promises 10% off the first order — create `WELCOME10` (10%, first payment only, first-time customers only) and enter it in **Settings**.

### Subscribers
Everyone who joined the newsletter or ticked the marketing box at checkout. See totals (subscribed, new in 30 days, unsubscribed), search, filter, and **Export subscribed (CSV)** to import into an email tool such as Klaviyo. Unsubscribes are recorded automatically.

### Abandoned carts
A checkout counts as abandoned if it isn't paid within **2 hours**. This page shows the last 30 days: how many carts were abandoned and their value, how many reminder emails were sent, how many were **recovered** (with a link to the resulting order) and the recovered revenue.
- Only shoppers who ticked the marketing box at checkout are emailed — that's required by law in many places and by Stripe.
- Each person gets at most one reminder a week. The email links straight back to their saved cart and mentions your welcome code.

### Settings
- **Analytics & ad tracking:** paste your Google Analytics 4 measurement ID (`G-…`), Meta Pixel ID and TikTok Pixel ID. Leave blank to switch a platform off. Tracking starts only after a visitor accepts cookies, and records page views, product views, add to cart, checkout started and purchases (with order value) — enough to run and measure ad campaigns.
- **Marketing emails:** the welcome discount code and your business postal address (US law requires it in marketing emails).
- **Sales channels:** the product-feed links for **Google Merchant Center** (Google Shopping), **Meta Commerce Manager** (Facebook & Instagram shops and catalog ads) and **TikTok**, with where to paste each one. Feeds always reflect current products, prices, photos and stock; hidden products are left out. The sitemap link for Google Search Console is here too.

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
| Map products to the supplier | Admin → Products → Edit → Supplier SKU → Save |
| Add a new product | Admin → Products → New product → fill in → Create → add photos → set Active → Save |
| Change a price | Admin → Products → Edit → Base price → Save (Stripe updates automatically) |
| Mark something out of stock | Admin → Products → Edit → Status: Out of stock → Save |
| List products on Google Shopping / Instagram / TikTok | Admin → Settings → copy the feed link into that platform |
| Turn on Google Analytics or ad pixels | Admin → Settings → paste the IDs → Save |
| Email my subscribers | Admin → Subscribers → Export CSV → import into Klaviyo (or similar) |
| See abandoned carts | Admin → Abandoned carts |
| See how the business is doing | Admin → Overview |

---

## 6. Compliance built into the store

- FDA disclaimer in the footer of every page.
- Auto-renewal consent before subscription checkout, with renewal terms shown on the Stripe payment page and online cancellation.
- 18+ confirmation for Creatine.
- Reviews are moderated; "Verified Buyer" is only shown when the email matches a real order.
- Star ratings sent to Google come only from real approved reviews, never placeholder numbers.
- Tracking pixels load only after cookie consent; marketing emails include a postal address and one-click unsubscribe; abandoned-cart emails go only to shoppers who opted in.
- **Before launch, replace placeholders:** demo reviews and review counts, the "25,000+ customers" claim, the advisor/vet names, and draft policy pages. Publishing invented reviews or endorsements is illegal in the US (FTC) and UK (CMA).

---

## 7. Troubleshooting

| Problem | Likely cause / fix |
|---|---|
| Checkout says "not set up yet" | Stripe keys not added to the hosting environment. |
| Checkout says a product is "temporarily unavailable" | Its price isn't in Stripe — click **Sync all to Stripe** in Admin → Products. |
| A product edit doesn't show in the store | Hard-refresh the page. Check the product isn't set to Hidden. |
| Photo upload fails | Use JPG, PNG or WebP under 4 MB. |
| No cookie banner appears | No tracking IDs are set in Settings (the banner only shows when there's something to consent to). |
| Feed rejected by Google/Meta | Check the product has a description and, ideally, a real photo; mockup images are accepted but real photos perform better. |
| Order paid in Stripe but not in Admin | The Stripe webhook isn't configured or is failing — check Stripe → Developers → Webhooks for errors. Stripe retries automatically for 3 days. |
| Customers aren't receiving emails | Resend key missing or domain not verified. |
| Admin says "not connected" | Database keys missing. |
| Can't sign in to Admin | Check the admin password in the hosting settings. |
