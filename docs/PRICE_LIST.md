# Price list (updated 30 Oct 2026)

_How prices work: the **one-time price** is per bottle. **Subscribe** and the **3-pack** are $5 less per bottle, the **6-pack** and **subscribe ×3** are $10 less ("From $x" on cards). Bundles have one price, with $5 off on subscription. Shipping is free on everything._

_Rule of thumb from the Google Shopping analyses (`docs/SHOPPING_ANALYSIS_*.md`, `docs/pricing/noovit-pricing.xlsx`): sit in the premium-DTC band, but **never above a competitor selling the identical Supliful formula** (Vitasy's Cortex/Compass/Fernwood brands), and win on evidence, content and bundles._

## Launch products (Supliful formulas confirmed)
Core-5 prices cut on 30 Oct after the competitor teardown (`docs/research/COMPETITORS_CORE5.md`): under the Vitasy twins
(Fernwood/Cortex/Kinetic) on identical bottles, and closer to the premium median per day.

| Product | 28 Oct | **Now (30 Oct)** | Subscribe / 3-pack | 6-pack | Why |
|---|---|---|---|---|---|
| Magnesium Sleep+ (275 mg glycinate, 90 caps) | $32 | **$29** | $24 | $19 | Fernwood (same formula) $39.99 / $31.99; our 275 mg is ~1.4× Momentous |
| Ashwagandha Calm+ (KSM-66 600 mg) | $32 | **$27** | $22 | $17 | Cortex (same formula) $29.99; value brands sell 600 mg KSM-66 for $0.28–0.33/day |
| Lion's Mane (1,000 mg organic) | $40 | **$35** | $30 | $25 | Cortex $44.99, Host Defense $33.95; median $0.57/day |
| Turmeric Complex (Platinum Turmeric) | $36 | $36 | $31 | $26 | Unchanged (not in the core-5 teardown) |
| Creatine (281 g, ~56 servings) | $34 | **$29** | $24 | $19 | Kinetic $44.99; Momentous/Thorne ~$0.48/day with NSF Sport |
| CoQ10 200 mg (draft, hidden) | $32 | **$28** | $23 | $18 | Cortex $39.99; 2× Thorne's dose |

## Pending a second supplier (prices set to the market tier)
| Product | Was | **Now** |
|---|---|---|
| Probiotic Gut+ | $40 | **$38** |
| Glucosamine Joint+ | $40 | **$36** |
| Collagen Glow+ | $40 | **$34** |
| Menopause Balance+ | $40 | **$38** |
| Zinc | $30 | **$22** (commodity; Thorne ~$15) |
| Iron Complex | $30 | **$24** |
| Vitamin D3 & K2 | $30 | **$26** |
| Daily Multi+ | $35 | $35 (unchanged) |
| Biotin Complex | $40 | **$28** |
| Niacinamide Complex | $40 | **$32** |
| Mushroom Clarity+ (powder) | $45 | **$42** |
| L-Theanine Calm Focus (hidden) | $30 | **$26** |
| NAC (draft) | $30 | **$28** |
| Focus Complex (hidden) | $45 | $45 (unchanged) |
| Berberine Complex (hidden) | $40 | **$36** (only if a 500 mg source is found) |
| Odorless Garlic (hidden) | $30 | **$26** |

## Bundles (about 14–16% off the parts)
| Bundle | Parts at new prices | Was | **Now** |
|---|---|---|---|
| Sleep & Calm Stack (Magnesium + Ashwagandha) | $56 | $55 | **$49** (30 Oct) |
| Gut & Immunity Reset (Probiotic + D3&K2 + Zinc) | $86 | $79 | **$74** |
| Joint Support Trio (Glucosamine + Turmeric + Collagen) | $106 | $95 | **$89** |

Pet products are unchanged (no market check yet).

## Margin check (Supliful all-in ≈ $10–11 per bottle)
- At **$29** (assuming $11 all-in): ~$17 profit (≈59%) one-time; ~$12 on subscription.
- At **$27** (ashwagandha): ~$15 one-time, ~$10 subscribed. Still fine, but watch Supliful's real cost.
- At **$22** (zinc): ~$10 one-time, ~$5.20 subscribed. That's thin, so zinc works best inside the Gut & Immunity bundle.
- Replace the placeholder costs in the workbook once Supliful prices arrive, and re-check.

## Applying on the live store
1. Run `supabase/manual/2026-10-28-catalog-update.sql` (Part 4), then `supabase/manual/2026-10-30-core5-prices.sql` (the core-5 cut and the Sleep & Calm Stack).
2. **Admin → Products → Sync to Stripe** (or `npm run stripe:sync`) so Stripe Checkout charges the new prices.
