# Pricing and Google Shopping: turmeric case study

_28 Oct 2026. From the owner's Google Shopping screenshots for "turmeric tablets" (Denver, CO) and Supliful's quoted cost: **turmeric 60 capsules = $11/bottle, or $8 with Supliful Pro ($69/mo).**_

## What the shopping results show
| Tier | Examples (price) | Look |
|---|---|---|
| **Value / mass** | Swanson $5.99 · CGN Curcumin 95 $10.27 · Life Extension $14.25 · Nature Made $13.99 · NatureWise $15.44 · NOW $17.14 · Nutrition Geeks $14 | Busy, colourful labels, big claims ("Pharmacist recommended", "Up to 45.5×"), lots of reviews (1k–9k) |
| **Premium DTC** | Momentous $29.99 (from $40) · Paleovalley $34.99 · BetterVits $35 · Absorption Co. $36.75 (from $49) · Thorne $36 / $64 · Naomi $39.99 · Gaia $49.49 | **Minimal white or amber bottles, few words, one accent colour**; ratings 4.6–4.9; prices often shown with a strike-through ("SALE", "25% OFF", "1st order price") |

**Takeaways:**
1. **The minimal "nootropic" aesthetic wins attention in a busy grid.** Momentous (white bottle, black type, one orange logo), Thorne (white, one illustration) and Future Kind (amber bottle, cream label) stand out because they're quiet next to loud mass-market labels. That's the "nootropics as aesthetics" direction: **clean, clinical, lots of white, one accent**.
2. **The image is about 160 px wide on a phone**, so only three things read: the **bottle shape and colour**, the **product name** and maybe one number. Everything else is noise.
3. **Strike-through prices and "SALE" badges come from the feed's `sale_price`**, which must be a real, current price on the product page. Momentous shows "1st order price" for a subscription discount.
4. **Stars need reviews through an approved aggregator** (50+ reviews). Without them we compete on image, title and price.
5. Free delivery dates show for everyone, so free shipping is table stakes.

> ⚠️ **Formula correction (28 Oct, later):** Supliful's catalogue has only one turmeric, **Platinum Turmeric**, a joint blend (turmeric + 95% extract, glucosamine from shellfish, chondroitin, boswellia, MSM, BioPerine, quercetin, bromelain). The prices below still apply, but the product isn't plain curcumin + black pepper. See `SUPLIFUL_PRODUCT_SCREEN.md`.

## Our turmeric pricing (corrected again 28 Oct)
Supliful turmeric 60 caps shows **$4.05 – $11.05**: **$4.05 is the product**, and **$11.05 is the all-in cost of one bottle delivered** (≈ $4.05 product + $5.29 shipping + $1.29 fulfilment + ~$0.42 processing). About **$8 all-in on Pro.** Supliful's suggested retail price is $25.90. Stripe is about 3% + $0.30 on top.

| Our price (1 bottle) | Profit, free plan ($11.05 landed) | Profit, Pro (~$8) |
|---|---|---|
| $40 one-time | $27.45 (69%) | ~$30.50 (76%) |
| $36 one-time | $23.57 (65%) | ~$26.60 (74%) |
| $35 subscribed | $22.60 (65%) | ~$25.65 (73%) |
| $32 subscribed | $19.69 (62%) | ~$22.75 (71%) |
| $30 subscribed | $17.75 (59%) | ~$20.80 (69%) |

Extra bottles in the same order add roughly the $4.05 product cost plus a little shipping (multi-unit shipping to confirm), so packs and bundles are very profitable.

**What this means:**
- **Margins are healthy:** a first order is profitable even after ~$10–25 of ad cost, and repeat orders are mostly profit.
- **Keep free shipping on all orders.** Shipping is already inside the landed cost.
- **Pro ($69/mo)** saves about $3/bottle, so it pays for itself at about 23 bottles a month.
- **Don't price near Supliful's suggested $25.90.** Our tier is $29–40.
- **Suggested turmeric pricing:** $36–40 one-time / **$30–32 subscribed** / 3-pack $33 a bottle / 6-pack $30 a bottle, free shipping on everything.

## Changes made for Shopping
- Feed images (`/product-image/<slug>`, used by Google, Meta and TikTok) now use a **plain white background with the bottle filling the frame**, as Merchant Center prefers. The website keeps its warm scene.

## Next (for the minimal / "nootropic look" pass)
- A **cleaner label option**: white label, bigger product name, the colour as a thin accent band rather than a full block, fewer words (name · key dose · count). Optionally amber bottles. Mock up both for the owner to compare at thumbnail size.
- Feed titles in Google's best-practice format: `Noovit Turmeric Complex – 95% Curcuminoids + Black Pepper – 60 Capsules`.
