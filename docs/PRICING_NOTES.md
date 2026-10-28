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

## Our turmeric pricing (corrected 28 Oct: shipping and fees are extra)
Supliful turmeric 60 caps: **product $11.05** (free plan; ~$8 on Pro, as low as $4.05 on higher tiers or volume) **+ shipping from $5.29 + fulfilment from $1.29 per order + processing fee if applicable.** Supliful's suggested retail price is $25.90.

**Landed cost of a 1-bottle order:** **$17.63** on the free plan, **~$14.58** on Pro (before any processing fee). Stripe is about 3% + $0.30 on top.

| Our price (1 bottle) | Profit, free plan | Profit, Pro |
|---|---|---|
| $40 one-time (today) | $20.87 (52%) | $23.92 (60%) |
| $36 one-time (suggested) | $16.99 (47%) | $20.04 (56%) |
| $35 subscribed (today) | $16.02 (46%) | $19.07 (54%) |
| $30 subscribed (suggested) | $11.17 (37%) | $14.22 (47%) |

Multi-bottle orders spread the $5.29 shipping and $1.29 fulfilment across bottles (exact multi-unit shipping to confirm with Supliful), so 3- and 6-packs carry better margin per bottle.

**What this means:**
- **A first order paid for with ads (~$10–25 per new customer) roughly breaks even on a single bottle.** The profit comes from **subscriptions, packs and bundles**, which also share shipping.
- **Free shipping on everything costs us $5.29 per order.** Premium peers often use **free shipping over $50** (Innerbody) or free shipping on subscriptions only. Option: free shipping on subscriptions and orders $50+, and $4.95 on a single one-time bottle.
- **Pro ($69/mo)** saves about $3.05/bottle, so it **pays for itself at about 23 bottles a month**. Higher tiers ($4.05) only make sense at volume.
- **Don't price near Supliful's suggested $25.90.** That's the mass/mid tier; at that price margins after shipping and ads disappear.
- **Suggested turmeric pricing:** **$36 one-time / $32 subscribed / 3-pack $33 a bottle / 6-pack $30 a bottle**, with free shipping on subscriptions and orders over $50. Confirm once all real costs are in.

## Changes made for Shopping
- Feed images (`/product-image/<slug>`, used by Google, Meta and TikTok) now use a **plain white background with the bottle filling the frame**, as Merchant Center prefers. The website keeps its warm scene.

## Next (for the minimal / "nootropic look" pass)
- A **cleaner label option**: white label, bigger product name, the colour as a thin accent band rather than a full block, fewer words (name · key dose · count). Optionally amber bottles. Mock up both for the owner to compare at thumbnail size.
- Feed titles in Google's best-practice format: `Noovit Turmeric Complex – 95% Curcuminoids + Black Pepper – 60 Capsules`.
