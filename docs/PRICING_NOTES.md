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

## Our turmeric pricing
Current site: **$40 one-time, $35 per bottle subscribed** (subscription is $5 off the one-time price), and as low as $30/bottle on a 6-pack.

| | One-time 1 bottle | Subscribe 1 bottle | 6-pack (per bottle) |
|---|---|---|---|
| Price | $40.00 | $35.00 | $30.00 |
| Supliful cost (standard / Pro) | $11 / $8 | $11 / $8 | $11 / $8 |
| Shipping we pay (estimate, verify) | ~$5–7 | ~$5–7 | ~$1.50 (shared) |
| Stripe ~3% + $0.30 | $1.50 | $1.35 | $0.95 |
| **Gross margin before ads** (standard / Pro) | **~$21 (53%) / ~$24 (60%)** | **~$16 (46%) / ~$19 (54%)** | **~$16.5 (55%) / ~$19.5 (65%)** |

**Recommendations:**
- **Price point:** for a 60-capsule, 30-day turmeric, the premium band is $30–40. $40 sits at the very top. Next to Momentous at $29.99 and Absorption at $36.75, consider **$36 one-time / $30 subscribed**, or keep $40 and lean hard on proof (lab results, evidence grades, clinician badge).
- **Supliful Pro ($69/mo)** saves $3 a bottle, so it **pays for itself at about 23 bottles a month** across all products. Start on standard and switch once you pass that.
- **Plan for ad costs:** paid Shopping in supplements often costs **$10–25 per first order**. Subscriptions and bundles carry the margin, which is why the subscription and 3/6-packs matter.
- **Check Supliful's real shipping charges per order** (and multi-item orders). They make the biggest difference to single-bottle margins.

## Changes made for Shopping
- Feed images (`/product-image/<slug>`, used by Google, Meta and TikTok) now use a **plain white background with the bottle filling the frame**, as Merchant Center prefers. The website keeps its warm scene.

## Next (for the minimal / "nootropic look" pass)
- A **cleaner label option**: white label, bigger product name, the colour as a thin accent band rather than a full block, fewer words (name · key dose · count). Optionally amber bottles. Mock up both for the owner to compare at thumbnail size.
- Feed titles in Google's best-practice format: `Noovit Turmeric Complex – 95% Curcuminoids + Black Pepper – 60 Capsules`.
