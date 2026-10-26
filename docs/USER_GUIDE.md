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
| **Admin dashboard** | Orders, fulfilment, subscriptions, customers, reviews, discounts | your secret admin address (see Signing in) |
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

### Read the Journal
The **Journal** (`/blog`, linked in the menu and footer) holds your articles. Each article has its own page, appears in the sitemap, and shows in Google with article details.

### Collections
Curated pages such as `/collections/sleep-support` group products for a goal or campaign. Active collections also appear as buttons at the top of the Shop page.

### Join the newsletter
The homepage newsletter form (and the marketing tick-box at checkout) adds people to your **Subscribers** list. Newsletter sign-ups get a welcome email with your welcome discount code. Every marketing email has an **Unsubscribe** link that works in one click, including Gmail's and Apple Mail's built-in unsubscribe button.

The optional **pop-up** (set its text in Admin → Homepage) appears once every 14 days — after 20 seconds, or when a desktop visitor moves to leave the page. It never shows on cart, checkout or account pages, or to someone who has already signed up.

### Cookie choice
If you've added tracking IDs in Settings, visitors see a small cookie banner. Nothing is tracked until they click **Accept**. They can change their mind via **Cookie preferences** in the footer.

### Cart extras
- **Pairs well with:** the cart suggests two best sellers that aren't already in it, with one-tap **Add**.
- **Automatic discount:** if you've set one (e.g. 10% off orders over $100), the cart shows a progress bar ("Spend $X more to get 10% off") and the discount applies at checkout by itself. While it applies, discount codes can't also be entered — Stripe allows one discount per checkout.

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
| 14 days after their order shipped (adjustable) | "How are you finding Noovit?" with a review link for each product | Noovit (Resend) |
| You create a payment link for them | "Your Noovit order is ready to complete" with a secure Stripe link | Noovit (Resend) |

---

## 3. The admin dashboard

Open your **secret admin address** (`noovit.com/<ADMIN_PATH>`, set in Vercel) and sign in with your own email and password. Each new browser or device needs the secret address once; after that `noovit.com/admin` works there for 90 days. Anyone without it sees "page not found" at `/admin`. Share the address only with staff, and change `ADMIN_PATH` in Vercel if it leaks. You stay signed in for 7 days on that device. Your name (→ **My account**, to change your password) and **Log out** are at the bottom of the menu.

**First-time setup:** before any staff accounts exist, the login page asks for the setup password (`ADMIN_PASSWORD` in the hosting settings). Sign in with it, create your own **Owner** account on the Staff page, and the setup password stops working.

**Roles** — each person only sees what their role allows:

| Role | Can use |
|---|---|
| **Owner** | Everything, including Staff accounts |
| **Manager** | Everything except Staff |
| **Fulfilment** | Overview (without revenue), Orders (no refunds, cancellations or new orders), Fulfilment, Customers |

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

**Refund an order (full or partial):** open the order → *Payment* box → enter the amount (it defaults to everything not yet refunded), pick a reason, optionally add a note → **Refund**. The money goes back to the customer's card through Stripe; a note records who refunded what. A full refund also cancels any fulfilment not yet sent. Clicking twice can't refund twice.

**Cancel an order:** for orders that haven't shipped. *Payment* box → **Cancel order** → tick to confirm. It stops fulfilment and refunds whatever hasn't been refunded yet. For a first subscription order, tick **Also cancel the subscription now** if the customer wants out entirely. Shipped orders can only be refunded.

**Notes and tags:** every order has internal **Notes** (signed with your name and time; customers never see them) and **Tags** (e.g. `vip`, `wholesale` — comma-separated). Click a tag in the order list to see every order with it.

**Manual orders** (Owner/Manager): **Orders → New order**:
- **Free replacement** — for lost, damaged or goodwill orders. Enter the customer's email, name and US address, choose products, add a note (e.g. "replacement for #1042"). It's created at $0, tagged `replacement`, and goes straight to the fulfilment queue.
- **Payment link** — for phone or email orders. Choose products; a secure Stripe checkout link is created (valid 24 hours) and, if ticked, emailed to the customer. When they pay, the order appears automatically, tagged `payment-link`.

### Fulfilment (daily routine for dropshipping)
Every paid order — including each subscription renewal — appears here as **queued**.

1. Click **Export queued (CSV)**. You get one row per item to ship: name, address, product, **supplier SKU** and number of units. **Bundles are split into their component products**, each with its own SKU, and the `part_of_bundle` column says which bundle it came from.
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
Every customer with number of orders, lifetime spend (after refunds), active subscriptions, last order date, tags and first-seen date. Search by name or email.

**Segments** (buttons above the list, with counts): Active subscribers · Repeat buyers (2+ orders) · One order, no subscription · Lapsed (no order in 60 days and no subscription) · VIP ($200+ lifetime). Click a tag to filter by it.

**Export** downloads the current segment/search as a CSV — e.g. export "Lapsed" to run a win-back campaign in Klaviyo.

Click a customer to open their profile: orders, subscriptions, whether they're subscribed to marketing emails, and editable **tags** and **internal notes**.

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

| **Bundle contents** | Leave empty for a normal product. For a bundle (e.g. "Sleep Stack"), add the products inside it and how many of each. Customers buy one item at the bundle's price; the bundle page lists what's inside; fulfilment ships the components. |

Click **Save changes**. The store updates immediately, and prices are pushed to Stripe automatically — the message tells you how many prices changed. If Stripe was unavailable, use **Sync all to Stripe** on the product list to retry.

**Bulk actions:** tick products in the list, choose an action (set active / out of stock / hidden, mark or unmark best seller, add to or remove from a collection) → **Apply**.

**Spreadsheet import/export:** **Export CSV** downloads every product. Edit it in Excel or Google Sheets and upload it under **Import from spreadsheet**. Products are matched by `slug`; you can change name, status, base price, servings, supplier SKU, best seller (yes/no), short benefit and SEO fields. Blank cells are left unchanged, and rows with problems are skipped and listed. Price changes are pushed to Stripe automatically. New products must be created in the editor.

> New products start **hidden** so you can add photos and check the page first. Existing subscribers keep paying the price they signed up at; price changes apply to new purchases.

### Collections
**Collections → New collection**: give it a title (the URL handle fills in automatically), a description, and pick products from the search list; reorder with the arrows. Set it **Active** to publish it at `noovit.com/collections/<handle>`. After the first save you can add a wide banner image. Collections are great landing pages for ads and emails ("Women's Health", "Gift ideas"). Deleting a collection never affects its products.

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

### Reports
Choose a period (last 7 / 30 / 90 days or 12 months):
- **Headline numbers:** net revenue (after refunds), orders, average order, subscription share of revenue, new customers, refunds, discounts given.
- **Net revenue per day:** columns split into subscription and one-time revenue. Hover (or tab) over a day for the exact figures; **Show as table** lists every day.
- **Sales by product:** the top 12 by revenue; hover a bar for bottles, orders and share.
- **Subscription retention:** for each month's new subscribers, how many are still active today.
- **Export orders (CSV):** every order line in the period, for your accountant or spreadsheet.

Free replacement orders don't count as revenue; cancelled orders are excluded.

### Homepage
Edit the storefront without a developer:
- **Announcement bar** — an optional coloured strip above the header (e.g. "Free shipping on every order"), with an optional link.
- **Trust bar** — the five short promises across the top.
- **Hero** — badge, headline, text, button label and link, bullet points, and the background photo.
- **Newsletter pop-up** — headline and text; leave the headline empty to switch the pop-up off.
Links must start with `/` (a page on your site) or `https://`. **Reset all homepage text to defaults** puts the original copy back.

### Blog
**Blog → New post**: title, URL handle, a short excerpt (shown on the blog list and in Google), and the article. Format with simple markdown — `## Heading`, `**bold**`, `- bullet`, `[link text](/products/magnesium-complex)` (see *Formatting help*). Add a cover image, then choose **Draft** (private — use **Preview** to see it) or **Published**. A future publish date schedules the post. For safety, any HTML pasted into an article is removed. Keep health wording as careful as on product pages ("supports…"), and every article automatically ends with a "not medical advice" note.

### Staff (Owner only)
Add people with their name, email, role and a temporary password (12+ characters) — share it securely and ask them to change it under **My account**. You can change someone's role, **deactivate** them (they're signed out immediately) or reset their password. There must always be at least one active Owner.

### Settings
- **Analytics & ad tracking:** paste your Google Analytics 4 measurement ID (`G-…`), Meta Pixel ID and TikTok Pixel ID. Leave blank to switch a platform off. Tracking starts only after a visitor accepts cookies, and records page views, product views, add to cart, checkout started and purchases (with order value) — enough to run and measure ad campaigns.
- **Marketing emails:** the welcome discount code and your business postal address (US law requires it in marketing emails).
- **Review requests:** how many days after shipping to email customers asking for a review (default 14; 0 switches it off). Sent once per order, never to people who unsubscribed or whose order was refunded or cancelled. Runs daily at 15:00 UTC.
- **Automatic discount:** a minimum order ($) and % off, e.g. 100 and 10. Leave blank to switch off.
- **Klaviyo:** your Klaviyo list ID. With the Klaviyo private key added to the hosting settings, new subscribers are added to that list, unsubscribes are synced, and every order is sent to Klaviyo as **Placed Order** (and **Fulfilled Order** when shipped) — use these to build welcome, post-purchase and win-back flows in Klaviyo.
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
| Refund part of an order | Orders → open order → enter amount → Refund |
| Send a replacement | Orders → New order → Free replacement |
| Take a phone order | Orders → New order → Payment link |
| Find my best customers | Customers → VIP segment |
| Win back lapsed customers | Customers → Lapsed → Export → import into Klaviyo |
| Create a landing page for an ad | Collections → New collection |
| Sell a bundle | Products → New product → Bundle contents |
| Change many prices at once | Products → Export CSV → edit → Import CSV |
| Change the homepage headline or add a banner | Homepage |
| Publish an article | Blog → New post |
| Give someone access | Staff → Add a staff member |
| See sales trends | Reports |
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
| Review-request emails aren't going out | `CRON_SECRET` must be set in the hosting settings (Vercel runs the daily job with it), and "Days after shipping" must not be 0. |
| Klaviyo isn't receiving anything | Check the Klaviyo list ID in Settings and that `KLAVIYO_PRIVATE_KEY` is set with lists, profiles, subscriptions and events write access. |
| Someone can't see a section | Their role doesn't include it — an Owner can change roles under Staff. |
| Feed rejected by Google/Meta | Check the product has a description and, ideally, a real photo; mockup images are accepted but real photos perform better. |
| Order paid in Stripe but not in Admin | The Stripe webhook isn't configured or is failing — check Stripe → Developers → Webhooks for errors. Stripe retries automatically for 3 days. |
| Customers aren't receiving emails | Resend key missing or domain not verified. |
| Admin says "not connected" | Database keys missing. |
| Can't sign in to Admin | Check the admin password in the hosting settings. |
