# Plan: adding new product types to the store and Stripe (19 Nov 2026)

**How it works today:** products live in the `products` table (Admin → Products). Setting one Active and running
Stripe sync (`syncProducts`, `npm run stripe:sync`) creates the Stripe product and its prices (one-time, packs,
subscription). Checkout is Stripe Checkout; the webhook records the order, and fulfilment goes to Supliful.
So **every new type uses the same catalogue and Stripe sync**. What changes is fulfilment.

| Product type | In Stripe? | Catalogue change | Fulfilment after payment | Build effort |
|---|---|---|---|---|
| More Supliful products (e.g. Creatine Hydration+) | Yes (as today) | None | Supliful (as today) | None |
| Second supplier, physical (pet chews, nHA toothpaste) | Yes | New field `fulfiller` (supliful / 3pl / vendor) | Order sent to the 3PL or Bimini by email/CSV or API | Medium (one adapter per fulfiller) |
| **At-home test kits** (Choose Health, Spot, IHD Lab) | Yes | `productType: 'tests'`, `fulfiller: <lab>`, allowed states | Webhook calls the lab's API to create the kit order; the lab ships and holds results in its portal | Medium: lab API + state check at checkout + no pixels on test pages |
| **Digital: courses/programs** (Perimenopause program) | Yes (one-time or subscription) | `productType: 'digital'`, no shipping | Webhook grants access (Supabase flag) + access email (Resend); gated `/learn` pages | Medium |
| **Affiliate products** (Embark, Oura, Embr, Tractive, light box) | **No** | Optional `affiliate` link entries on content pages (not products) | The partner sells; we earn commission | Low (pages + disclosure) |

## Order of work
1. **No build needed:** add Creatine Hydration+ when the price arrives (Admin → Active → Stripe sync).
2. **Tests:** after the lab quote is signed:
   - Add `productType 'tests'` + `fulfiller`.
   - Add a lab adapter in `lib/fulfilment/` (create order on `checkout.session.completed`).
   - Block excluded states (NY, NJ, RI etc. per lab) at checkout via Stripe shipping-address rules.
   - Turn off GTM on test pages.
   - First SKUs: Perimenopause Check (Choose Health), Iron & Nutrient Check (Spot / IHD Lab).
3. **Digital program:**
   - Stripe one-time price; webhook sets `course_access`.
   - `/learn/[module]` behind sign-in.
   - Sell to US customers only at first (VAT).
4. **Affiliate "Tools" pages** (after the EIN: networks need a W-9):
   - Women's tools (Embr, Oura, Natural Cycles, light box).
   - Pet safety tech (Tractive, Fi).
   - FTC disclosure on every page; no affiliate links inside guide bodies.
5. **Pets physical:** only after a supplier quote; `fulfiller: '3pl' | 'bimini'`.

## Owner steps
- Get quotes (tests: Choose Health, Spot, IHD Lab; pets: Organic Pets Treats, Bimini, Pet Tech Labs).
- After the EIN: apply to affiliate networks (Impact, Awin, CJ, Refersion).
- Nothing to do in Stripe by hand: sync creates everything.
