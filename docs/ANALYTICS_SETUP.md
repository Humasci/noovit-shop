# Analytics setup: Google Tag Manager + GA4

_Set up 28 Oct 2026. The site loads **Google Tag Manager `GTM-5LKW5HGS`** on every page (built-in default; change it in Admin → Settings). GA4 (`G-JHK7BF5QB1`, stream "noovit web") is configured **inside GTM**, not on the site._

## How the site behaves
- **Opt-out model** (US store): GTM, and any Meta/TikTok pixels set in Admin → Settings, load immediately. The cookie banner offers **Accept** (dismisses it) or **Decline** (turns all tags off for that browser and reloads). "Cookie preferences" in the footer reopens it.
- **Shop events** are pushed to GTM's `dataLayer` in GA4 ecommerce format: `view_item`, `add_to_cart`, `begin_checkout`, `purchase` (with `transaction_id`, `value`, `currency: USD`, `items`).
- **Page views** on client-side navigation are caught by GA4's enhanced measurement ("page changes based on browser history events").
- **Leave Admin → Settings → "Google Analytics 4 measurement ID" empty.** If it's filled as well as GA4 inside GTM, every visit counts twice.

## One-time setup in GTM (≈10 minutes)
1. **tagmanager.google.com** → container `GTM-5LKW5HGS` → **Tags → New**
   - Tag type **Google Tag**, Tag ID **`G-JHK7BF5QB1`**
   - Trigger: **Initialization – All Pages**
   - Save as `GA4 – Google tag`
2. **Triggers → New → Custom Event**
   - Event name: `view_item|add_to_cart|begin_checkout|purchase`, tick **Use regex matching**
   - Save as `Ecommerce events`
3. **Tags → New → Google Analytics: GA4 Event**
   - Measurement ID: `G-JHK7BF5QB1`
   - Event name: `{{Event}}`
   - **More settings → Ecommerce → tick "Send Ecommerce data"**, data source **Data Layer**
   - Trigger: `Ecommerce events`. Save as `GA4 – Ecommerce events`
4. **Preview** (top right) → enter `https://www.noovit.com` → browse a product and add it to the cart. Both tags should show as "Fired".
5. **Submit → Publish.**

## In GA4
- **Admin → Data streams → noovit web → Enhanced measurement** (already on): click the gear → **Page views → Show advanced settings** → make sure **"Page changes based on browser history events"** is ticked.
- **Admin → Events:** `purchase` is a key event by default. Mark `begin_checkout` as a key event too if you want it in conversion reports.
- The "Data collection isn't active" warning clears within a few hours to 48 hours of publishing GTM.

## Later
- Add the Meta and TikTok pixels either in Admin → Settings (simplest) **or** as GTM tags, never both.
- Google Ads conversion tracking and Merchant Center can reuse the same `purchase` event.
- Note: Washington's My Health My Data Act treats some health-related browsing as consumer health data. Before running retargeting ads on health products, ask the regulatory lawyer whether ads pixels need opt-in for WA visitors.
