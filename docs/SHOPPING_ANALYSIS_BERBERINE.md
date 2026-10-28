# Google Shopping analysis: "berberine" (US, 28 Oct 2026)

_Source: owner's 10 screenshots of the Sponsored Products carousel (Denver, CO), 24 unique listings, plus the Supliful product page. Daily dose and servings marked ~ are **assumed** from the label or usual use. The full table, tiers and a profit calculator are in `docs/pricing/noovit-pricing.xlsx` (Berberine tabs)._

## 1. Supliful berberine: what we would actually sell
| | |
|---|---|
| Cost | **$3.75 product, $10.25 all-in delivered** (shipping from $5.29 + fulfilment from $1.29 + processing). Pro is probably ~$7.20, but **unconfirmed** |
| Suggested retail | $39.90 |
| Bottle | 60 vegetable capsules, 2 a day, 30 servings |
| Formula (from the product page's ingredient list) | Per capsule: **790 mg "Granular Berberine HCl Extract 8%"** + **10 mg "Granular Berberine HCl Extract 97%"**. Other ingredients: cellulose capsule, microcrystalline cellulose, L-leucine, olive oil |
| Claims allowed by supplier | Vegan, gluten-free, non-GMO, made in the USA. No GMP or third-party claims listed |

### ⚠️ The dose problem
If "8%" and "97%" are the berberine content, each capsule holds about **73 mg of berberine**, so **~146 mg a day**.
- Human studies on glucose and lipids use **900–1,500 mg a day** (usually 500 mg two or three times a day).
- Competitors sell **400–1,200 mg a day** (Thorne 200 mg and 500 mg, Naked 200 mg, NAOMI 500 mg, Jade 1,200 mg, Xymogen 1 g).
- At ~146 mg we'd be **the lowest dose in the grid** and, at $36, the most expensive per mg (about **$8 per 1,000 mg** vs **$1.20–1.50** for Thorne and NAOMI).
- It would contradict our "evidence-graded" positioning: we couldn't honestly show the study dose.

Our current catalog entry (`Berberine Complex`: 500 mg berberine HCl + chromium + Ceylon cinnamon) **doesn't match** this product either.

**Action:** ask Supliful for the Supplement Facts panel and a COA that states **mg of berberine per serving**. Then:
- **If it's ~146 mg/day:** don't launch Supliful berberine as a hero. Either source a 500 mg berberine HCl elsewhere (On Demand Fulfillment, Vitalabs and Professional Nutritionals list berberine; see `SUPPLIER_RESEARCH.md`), or sell it cheaply ($29) with no study claims.
- **If it's really ~500 mg+/capsule:** go ahead at the prices in §3.

## 2. What the grid shows
### A. Tiers
| Tier | Listings | Price range (median) | Who |
|---|---|---|---|
| **Value** | 4 | $15–25 ($24.99) | Naked 200 mg (HSA/FSA), berberine **patches** (Kind, Vitasy), AKA appetite strips |
| **Core: plain berberine, 60 caps** | 12 | **$30–47 ($37)** | Thorne, NAOMI, Absorption Co., Vitasy ×2, GLOV, Jade, Terry Naturally, Global Healing, Omre |
| **Weight / "GLP-1"** | 6 | $49–79 ($64) | Midi, SpoiledChild, Tonum, Happy Mammoth, Clade "GLP-1 Metabolic", Absorption Co. "WLP-1" |
| **Big packs** | 3 | $87–110 | Xymogen 120 caps, Dr Juan 3-pack, Mara Labs |

Berberine is **pricier than turmeric**: there's no $6–15 mass tier in the sponsored grid, and Supliful's own suggested price is $39.90 (vs $25.90 for turmeric).

### B. The "nature's Ozempic" tier
A quarter of the listings sell berberine as a **weight-loss or GLP-1** product at nearly twice the price. Absorption Co. sells the same ingredient at $31.85 as "Berberine" and $79.20 as "WLP-1".
- **We shouldn't follow.** "GLP-1", "Ozempic" and weight-loss claims are active FDA/FTC enforcement targets, and Google Ads restricts weight-loss claims.
- We can rank for the same searches with honest content: a guide like "Berberine vs GLP-1 drugs: what the evidence actually shows" is exactly our nerdy, evidence-graded angle.

### C. Lead angles
| Angle | Who | For us |
|---|---|---|
| **Dose number** (200 / 500 / 1,200 mg / 1 g) | Thorne, NAOMI, Naked, Jade, Xymogen | The main way people compare. Needs a real dose |
| **Absorption** ("6.2×", "enhanced", "bioavailable") | Absorption Co., Terry, Mara Labs | Needs a branded, studied form (e.g. dihydroberberine or a phytosome) |
| **Metabolism / AMPK science** | Omre, Midi | Fits our tone, if worded as structure/function |
| **Weight / GLP-1 / cravings** | 6 brands | Avoid |
| **Format** (patch, strip, pouch) | Kind, Vitasy, AKA, GLOV | Weak evidence for patches |
| **Badges** (award, HSA/FSA, free gift, buy 3 save 10%) | NAOMI, Naked, Global Healing, Midi | HSA/FSA via Truemed is already on the TODO |

### D. Trust signals
- **Thorne has 5k+ reviews** and appears twice (200 mg at $30, 500 mg at $44). It's the reference brand.
- **Absorption Co. shows 3.1 stars (15 reviews)**: proof that weak ratings show up in the carousel and hurt. Wait for good reviews before switching stars on.
- Several premium listings show no stars at all, so launching without reviews is normal.

### E. Look at thumbnail size
- More premium than the turmeric grid: **minimal white** (Thorne, Xymogen, Cortex) and **amber with one bold colour** (Midi orange, Omre coral, Global Healing green).
- Pouches (GLOV pink, Vitasy navy) stand out in a sea of bottles.
- The loudest are the weight-loss brands (magenta, lifestyle photos).
- Our label option **B (clinical white)** would sit next to Thorne and Xymogen. **D (amber)** would sit next to Midi and Omre.

## 3. Pricing (only if the dose checks out)
| Offer | Price | Profit, free plan | Margin |
|---|---|---|---|
| One-time | **$36** | $24.41 | 68% |
| Subscribe | **$32** | $20.52 | 64% |
| 3-pack | $32 a bottle | $75.17 per order | 78% |
| 6-pack | $29 a bottle | $139.65 per order | 80% |
| Supliful suggested | $39.90 | $28.19 | 71% |
| Low (if ~146 mg) | $29 | $17.61 | 61% |

$36 puts us just under the core median ($37), below NAOMI/Terry ($40) and Thorne 500 mg ($44), and above Absorption ($31.85). With ~$18 ad cost per new customer, a first one-time order at $36 still makes ~$6; subscriptions and packs carry the profit.

## 4. Compliance notes for berberine
- Interactions: berberine affects liver enzymes (CYP3A4, CYP2D6) and adds to diabetes medicines (risk of low blood sugar). Show a clear "talk to your doctor if you take medication, especially for diabetes" warning. Not for pregnancy or breastfeeding.
- Claims: "supports healthy glucose metabolism already in the normal range*" style only. No "lowers blood sugar", "GLP-1" or weight-loss language.
- Already flagged for the regulatory lawyer review in `TODO.md`.
