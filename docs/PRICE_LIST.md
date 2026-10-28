# Price list (28 Oct 2026)

_How prices work: the **one-time price** is per bottle. **Subscribe** and the **3-pack** are $5 less per bottle, the **6-pack** and **subscribe ×3** are $10 less ("From $x" on cards). Bundles have one price, with $5 off on subscription. Shipping is free on everything._

_Rule of thumb from the Google Shopping analyses (`docs/SHOPPING_ANALYSIS_*.md`, `docs/pricing/noovit-pricing.xlsx`): sit in the premium-DTC band, but **never above a competitor selling the identical Supliful formula** (Vitasy's Cortex/Compass/Fernwood brands), and win on evidence, content and bundles._

## Launch products (Supliful formulas confirmed)
| Product | Was | **Now** | Subscribe / 3-pack | 6-pack | Why |
|---|---|---|---|---|---|
| Magnesium Sleep+ (275 mg glycinate, 90 caps) | $35 | **$32** | $27 | $22 | Premium glycinate sells for ~$25–35 |
| Ashwagandha Calm+ (KSM-66 600 mg) | $35 | **$32** | $27 | $22 | Market $22–39 (median ~$30); Vitasy sells the same formula at $29.99 |
| Lion's Mane (1,000 mg organic) | $35 | **$40** | $35 | $30 | Market $35–61 (median ~$47); in line per mg with Cortex and Brainstorm |
| Turmeric Complex (Platinum Turmeric) | $40 | **$36** | $31 | $26 | Premium tier $29–40; $36 matches Thorne/Absorption |
| Creatine (281 g, ~56 servings) | $40 | **$34** | $29 | $24 | Thorne ~$43 for 90 servings; mass brands $25–30 for 60 |
| CoQ10 200 mg (draft, hidden) | $35 | **$32** | $27 | $22 | 30-day bottle; Thorne/Qunol $25–40 |

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
| Sleep & Calm Stack (Magnesium + Ashwagandha) | $64 | $59 | **$55** |
| Gut & Immunity Reset (Probiotic + D3&K2 + Zinc) | $86 | $79 | **$74** |
| Joint Support Trio (Glucosamine + Turmeric + Collagen) | $106 | $95 | **$89** |

Pet products are unchanged (no market check yet).

## Margin check (Supliful all-in ≈ $10–11 per bottle)
- At **$32** (assuming $11 all-in): ~$19.75 profit (62%) one-time; ~$14.90 on subscription; ~$16 per bottle in a 6-pack order (extra bottles in the same order cost only ~$4 each).
- At **$22** (zinc): ~$10 one-time, ~$5.20 subscribed. That's thin, so zinc works best inside the Gut & Immunity bundle.
- Replace the placeholder costs in the workbook once Supliful prices arrive, and re-check.

## Applying on the live store
1. Run `supabase/manual/2026-10-28-catalog-update.sql` (Part 4 sets these prices).
2. **Admin → Products → Sync to Stripe** (or `npm run stripe:sync`) so Stripe Checkout charges the new prices.
