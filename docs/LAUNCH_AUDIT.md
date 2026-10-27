# Noovit — Launch Audit

_27 October 2026. Three independent reviews of the whole store, followed by a round of fixes:_
- **Code and functionality:** checkout, webhooks, admin, security, data.
- **SEO, content, compliance and performance:** a crawl of 35 URLs plus Lighthouse.
- **UX, UI, responsiveness and accessibility:** 17 pages at 375, 768 and 1440 px, keyboard walk-throughs and axe-core.

**Verdict:** the store is technically ready. Launch is now gated by **business, evidence and legal items only you can supply** (section 4). They mostly decide what you are allowed to claim. Everything the code could fix has been fixed. All end-to-end suites pass: phase 1 46/46, phase 2 58/58, affiliates 55/55.

---

## 1. The Good: keep doing this

- **Checkout and subscriptions are solid.**
  - Stripe Checkout uses server-side prices.
  - Customers give a separate, unticked auto-renew consent, and confirm 18+ for creatine.
  - Customers manage subscriptions online through a magic link, with no password.
  - Duplicate webhooks are ignored, and orders, items and fulfilment are written in one transaction.
- **Admin is complete for a dropship business.** It covers staff roles, refunds, cancellations, manual and replacement orders, fulfilment CSV with supplier SKUs, bundles, collections, the blog, reports, affiliates with payouts, and abandoned-cart recovery.
- **SEO foundations.**
  - One H1 per page.
  - Hidden products return a real 404.
  - The sitemap and the Google, Meta and TikTok feeds have every required field.
  - Product structured data only claims ratings when real reviews exist.
  - URLs are clean and redirect trailing slashes.
- **Privacy plumbing.**
  - Ad pixels load only after a visitor clicks Accept.
  - Marketing emails carry a one-click unsubscribe and a postal address.
  - The admin sits behind a secret address and per-person logins.
- **Layout.** No sideways scrolling at any screen size, consistent spacing, and a distinctive brand system (mosaic cross, breathing loader, bottle mockups).
- **Desktop performance.** Lighthouse scores 97–100 and layout shift is zero everywhere.

## 2. The Bad and the Ugly: what was wrong, and what was fixed

### Blockers (fixed)
| Problem | Fix |
|---|---|
| Six invented reviews with "Verified Buyer" badges, ★4.8 and made-up counts (4,486 reviews…), a fake star histogram, "25,000+ customers", "36,809+", and "Five Star Reviews" in the trust bar. These are illegal under FTC 16 CFR 465. | All removed. Ratings, counts and reviews now come **only** from approved reviews in the admin, and sections hide themselves until real ones exist. The admin "Rating display" override is gone. |
| "Advisor Name · Registered Nutritionist" panel and an auto-generated nutritionist quote on every product page (a fake endorsement). "Nutritionist formulated/approved" claims. | Removed. The home panel is now a quiz call-to-action, and "Nutritionist" claims became "Evidence-based doses". Add real advisors later in `data/content.ts` (`VETS` for pets). |
| The contact form pretended to send messages; the phone number, address and hours were fake, and the email addresses disagreed. | A real form emails your **support address** (new Settings field) with the customer as reply-to, and tells the customer when sending fails. Fake details removed; your business address shows once it's in Settings. |
| Unsubscribe silently failed for people not already on the list. | Fixed: they are now recorded as opted out. |
| "Mark queued as submitted" could mark orders that arrived *after* your export, so they were never sent to the supplier. | Only exported orders are marked. Export covers every queued order, with no 1,000-row cap. |
| "My Subscriptions" could pick the wrong Stripe customer (Stripe's email search is case-sensitive and can return duplicates). | It now uses the customer recorded on the order first. |
| Renewals could be silently skipped if the webhook's API version differed. | The webhook re-fetches invoices and subscriptions through the SDK. Out-of-order events can't apply stale data, and a skipped renewal is logged. |

### High (fixed)
- **SEO:**
  - Seven pages had copied the home page's title and description; each now has its own title and description, plus canonicals.
  - `/cart` and `/account` are now `noindex`.
  - `/pets` (coming soon) and the empty `/blog` are `noindex` and left out of the sitemap until they have content.
- **404 and errors:** there is now a branded 404 with links back to the shop, a store error page and a last-resort global error page.
- **Google Shopping price mismatch:** the feed said $35 while the page showed $30 (subscribe) first. Product pages now **default to one-time**, so the first price matches the feed and nothing is pre-selected into a recurring charge. Subscribe shows the saving with a struck-through price.
- **Subscription law:**
  - The order confirmation email now lists each subscription's price, how often it renews, that it renews until cancelled, and the cancel link (ROSCA / California).
  - Perks that weren't real ("Price locked in for life", "Priority support", "Nutritionist access") are replaced with true ones.
- **FDA disclaimer:** benefit claims carry `*` with the disclaimer right under them on product pages, not only in the footer.
- **Pregnancy/postpartum "safe" tags** are an unproven safety claim. They are hidden from shoppers; the quiz still uses them internally and tells pregnant users to check with a doctor or midwife.
- **Quiz:** the marketing-consent box was pre-ticked (a dark pattern). It is now unticked.
- **Cart drawer and pop-up:**
  - Both are now real dialogs: focus moves in, Tab stays inside, Escape closes, and focus returns afterwards.
  - The pop-up never opens over the cart.
- **Colour contrast (WCAG AA):**
  - Muted text and accent green darkened slightly.
  - Orange and opal buttons use navy text.
  - Selected quiz answers use the darker green.
- **Inputs:** every email and search field has a visible focus ring, a proper label and autofill hints.
- **Mobile product page:** Add to Cart was about 1,500 px down. A sticky Add to Cart bar now appears while the main button is off screen.
- **Checkout button:** it no longer sits grey with no explanation. Clicking it highlights the box that needs ticking.
- **Shipping promise:** "Ships the same day before 2pm" can't be kept with dropshipping. It now reads "usually ships within 1–2 business days" (FTC Mail Order Rule).

### Medium and low (fixed)
- **Performance:** bottle images are now cached, resized images instead of 30 KB of inline drawing each.
  - Home page HTML went from **969 KB to 355 KB**, and a product thumbnail is about 15 KB.
  - The hero photo is responsive and loads first.
- **Security:**
  - Security headers added (anti-framing/clickjacking, nosniff, HSTS, referrer policy).
  - Admin login is rate-limited: 10 failures per 15 minutes per network or email.
  - A database error no longer re-enables the setup password, and timing no longer reveals which emails are staff.
  - Changing `ADMIN_PATH` now revokes old secret-address access.
  - Emails time out instead of hanging webhooks, and sign-in links are no longer written to production logs.
- **Accessibility:**
  - Skip-to-content link.
  - Menu and accordion buttons announce whether they are open.
  - Product tabs work with arrow keys.
  - Star ratings are readable by screen readers.
  - The cart button says how many items it holds.
  - Larger tap targets.
  - The quiz moves focus to each new question.
  - The marquee and slide-ins stop under "reduce motion".
- **UX:**
  - The FAQ text-splitting bug is fixed.
  - The quiz "Add my plan" no longer doubles items.
  - Pack size is kept when switching purchase type.
  - The shop filter bar no longer slides under the header.
  - Cookie banner, cart, pop-up and toasts now stack correctly.
  - The cart no longer says "You've unlocked free shipping" as if there were a threshold.
  - Social icons are hidden until you set real URLs.
- **Small fixes:**
  - Partner dashboard copy now says the code works on any order, which matches how it behaves.
  - Quantity is capped at 20.
  - The welcome email uses your real domain.
  - The admin "return to" link is validated.
  - A Stripe error when deactivating a code no longer crashes the page.

## 3. Known gaps (not blockers, worth scheduling)
| Area | Gap | Suggestion |
|---|---|---|
| Mobile speed | Mobile Lighthouse was 64 on home before the fixes, held back by page weight and JavaScript. The HTML is now about a third of the size; re-measure on Vercel after deploy. | Run PageSpeed Insights on the live URL. |
| Stock photos | Unsplash images under "Join the community" may imply they are customers. | Replace with your own or licensed brand photography; self-host. |
| Reviews | Anyone who knows a buyer's email could post a review marked "Verified". You approve every review, so check it before approving. | Later: verify through the review-request email link. |
| Structured data | No shipping or returns details, breadcrumbs, logo or social links in schema. No `og:image` on non-product pages. | Add a 1200×630 social image and extend the schema. |
| Copy | British spellings on a US store ("colour", "micronised", "hot flushes" → US "hot flashes"). Home says "10% off your first order", which needs a real `WELCOME10` code set in Settings. | Run a US-English pass. Create the code. |
| Mobile shop filters | They take a lot of the screen on phones. | Later: a "Filter & sort" bottom sheet. |
| Ops | Disputes and failed renewals aren't handled in the admin (do it in Stripe). A mid-cycle upgrade in the portal creates no order until the next cycle. There is no GDPR/CCPA export or delete tool. | Handle in Stripe for now. |

## 4. Your launch checklist (only you can do these)

**Evidence for claims.** Each claim stays on the site only if you can prove it. Otherwise tell me and I'll remove it:
- [ ] **"Made in the USA"** (you're checking). It appears in the hero, marquee, trust strip, product quality pills, bottle labels and feed images. The FTC requires "all or virtually all" content to be domestic, but probiotics, collagen, berberine, ashwagandha and mushroom extracts are usually imported. The safe wording is **"Manufactured in the USA from domestic and imported ingredients"**. The label text lives in `lib/labels/svg.ts` (`ORIGIN_CLAIM`).
- [ ] **"Third-party tested"** and **"GMP certified"**: get the supplier's GMP/NSF certificate and per-lot COAs before launch.
- [ ] **Supplement Facts:** the panels use draft numbers. Copy the manufacturer's final panels: elemental amounts, %DV, vitamin D in mcg, and the iron warning on the Iron product page.
- [ ] **Claims review by a regulatory lawyer.** Points to cover:
  - Iron, "tiredness" and heavy periods
  - Berberine, cholesterol and glucose
  - Zinc and testosterone
  - "Clinically studied strains"
  - The quiz's symptom wording
- [ ] **FDA structure/function notification** within 30 days of first sale.

**Legal pages:**
- [ ] A full **privacy policy**, plus a **Consumer Health Data policy** for Washington and Nevada. Your ad pixels see product names like "Menopause Complex", which counts as health data there. Add a "Do Not Sell or Share" link.
- [ ] **Terms** (only three sentences today) and **Delivery & Returns**: how to return, refund timing, and whether renewals are covered.
- [ ] Prop 65 check (heavy metals in botanicals and powders); product liability insurance; an "Adults 18+" notice for creatine (New York).

**Settings and accounts:**
- [ ] Admin → Settings: **support email**, **business postal address**, **welcome code** (create `WELCOME10` in Stripe first).
- [ ] Vercel: `RESEND_API_KEY` + `EMAIL_FROM`, with a verified domain. **Without it the contact form tells customers to email you, and order emails are not sent.**
- [ ] Vercel: `NEXT_PUBLIC_SITE_URL=https://noovit.com` (or `www`, whichever you use), and social profile URLs (`NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_TIKTOK_URL`, `NEXT_PUBLIC_FACEBOOK_URL`).
- [ ] Stripe keys, `npm run stripe:sync`, webhook and portal (README §2); then one real test-mode order end to end.
- [ ] Choose the supplier, map supplier SKUs, and align formulas and doses on the site with what they actually make.

## 5. Decisions I made that you may want to reverse
- **Product pages default to one-time purchase** (for Google Shopping price matching and subscription law). Many brands default to subscribe; doing that safely means submitting subscription pricing differently to Google. It's one line in `components/product/ProductClient.tsx`.
- **Orange and opal buttons now have navy text** instead of white, because white on vivid orange is only 3:1 contrast. The alternative is a darker orange fill (about `#C2410C`) with white text.
- **Hero badge** now reads "Skip, change or cancel anytime" (editable in Admin → Homepage).

## 6. How this was verified
- `tsc` passes, `eslint` reports no errors in source, and `next build` succeeds.
- End-to-end suites, run against a local Postgres + PostgREST and a fake Stripe: **phase 1 46/46, phase 2 58/58, affiliates 55/55.**
  - A few checks had been reading the page before the loading screen finished, so the test runner now waits for each page to settle.
- Database migration `0006_launch_audit` (`fulfilments.exported_at`, `login_attempts`) has been applied to the live Supabase project.

Raw reports from the three reviews are not in the repo. Ask if you'd like them added.
