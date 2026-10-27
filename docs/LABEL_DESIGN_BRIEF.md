# Noovit — Label Design Brief

*Version 1 · October 2026. Use this to brief a designer, or as our own checklist when we design the labels ourselves.*

> **Not final until a supplier is chosen.** The label size and template (the "dieline"), the bottle, and every Supplement Facts panel come from the supplier. Build the brand system and master layout now. Produce final files only once you have the supplier's dieline and facts panels.

---

## 1. The brand in one line

**Noovit⁺: clean, science-driven supplements, with a lean towards brain and focus.** The labels should feel calm, modern and trustworthy, not clinical and not "gym". There should be plenty of white space and a clear hierarchy, with one confident colour per product.

**Customer.** Adults aged 28–55 who read labels, want fewer, better products, and buy on subscription.

**Avoid:**
- loud gradients
- stock-photo leaves and DNA helixes
- capsule clip-art
- "MAX STRENGTH" shouting
- medical crosses

---

## 2. Brand assets

| Asset | Value |
|---|---|
| **Wordmark** | "noovit" in **Funnel Display Medium (500)**, plus a raised "+" (like an exponent) in opal. The "+" is a drawn shape, not the font's "+". Take it from `components/layout/Logo.tsx` (SVG geometry: two 86-unit bars in a 400-unit square, sitting at the top of the "t"). Supply it as outlined vector. |
| **Symbol** | The opal "+" on its own. Use it for the cap, seal, small panels and social media. |
| **Navy** (primary text, logo) | `#14213D` |
| **Opal** (the "+", accents) | `#5FA68D` |
| **Opal dark** (small text in opal) | `#3A8069` |
| **Opal light** (on navy) | `#9CC9B8` |
| **Soft background** | `#EEF5F2` |
| **Fonts** | **Funnel Display** for the wordmark only. **Manrope** SemiBold (600) for product names and headings. **Inter** for everything else, Regular and Medium (400/500). All three are free under the SIL Open Font License and fine for print. |
| **Pets accent** (for later) | Orange `#E8833A` with the same layout. Pets launch later. |

**Colour in print.** Convert every colour to CMYK and approve it on a printed proof. The hex values above are screen colours. Opal and the per-product colours shift most in print.

---

## 3. Label structure (wrap-around bottle label)

From left to right as the bottle turns:

**① Supplement Facts panel** (left of the front, or wherever the supplier's dieline places it)
- The supplier's facts panel, unchanged, with **Other ingredients** directly below it.
- Allergen statement if any (e.g. "Contains: fish" for marine collagen).

**② Front panel (principal display panel), centred**
- **Top:** the noovit⁺ wordmark.
- **Middle:**
  - **Product name** in large Manrope type, e.g. "Magnesium Complex".
  - **One benefit line** using the "supports…" wording from the website, e.g. "Supports relaxation, sleep & muscle function".
  - **One proof point**, e.g. "3 forms of magnesium · 400 mg" or "40 billion CFU · 12 strains".
  - **Product colour band or shape.** Each product has its own colour (see §6). Keep the layout identical for every product; only the colour and text change.
- **Bottom 30% (legally required here):**
  - **Statement of identity:** "Dietary Supplement".
  - **Net quantity:** "60 Capsules", parallel to the base of the bottle.
- **Optional icons**, small and in a row: Vegan · Gluten-free · Third-party tested · Made in USA. Use only what the supplier can certify.

**③ Right panel (information panel)**
- **Directions**, from the site's "how to take".
- **Warnings and storage**, e.g. "Consult your healthcare provider before use if pregnant, nursing, taking medication or have a medical condition. Keep out of reach of children. Store in a cool, dry place. Do not use if seal is broken."
- **FDA disclaimer** in a box (see §4).
- **Distributor block:** "Distributed by Noovit, [address], noovit.com", plus a phone number or US address for adverse-event reports.
- **UPC barcode** (GS1), at least 80% of its standard size, with a white quiet zone around it.
- **Blank area for lot number and expiry/best-by date.** The manufacturer prints these, so ask for the size they need.
- **Small mark:** "Made in USA" if true, and the third-party testing claim only if the supplier provides certificates of analysis.

**Powders (Creatine, Mushroom Blend).** These come in a tub or pouch. Use the same three zones, adapted to the supplier's tub or pouch dieline. Add the scoop size to the directions.

---

## 4. US label rules checklist (FDA, 21 CFR 101)

Check every product's label against this before printing. The final review should be done by the supplier's regulatory team or a lawyer.

- [ ] **Statement of identity** on the front panel: "Dietary Supplement", or "[Ingredient] Supplement", e.g. "Magnesium Supplement". (101.3)
- [ ] **Net quantity** in the bottom 30% of the front panel, parallel to the base. Minimum type height depends on front-panel area: 1/16" up to 5 sq in, 1/8" for 5–25 sq in, 3/16" for 25–100 sq in. (101.105)
- [ ] **Supplement Facts** in the official format (101.36):
  - the title larger than the other panel text
  - serving size and servings per container
  - amounts per serving and % Daily Value
  - proprietary blends shown as the rule requires

  Use the supplier's panel; don't retype it. Keep nutrient text at a minimum of about 8 pt unless the label is small enough to qualify for the small-package allowance.
- [ ] **Other ingredients** (capsule, fillers) listed below the facts panel.
- [ ] **Allergens:** declare any of the 9 major allergens, including fish, shellfish, milk, soy and sesame.
- [ ] **Name and address** with "Distributed by" (or "Manufactured for"). (101.5)
- [ ] **Adverse-event contact:** a US address or phone number where consumers can report serious reactions (FD&C Act 403(y)). The distributor block can cover this if it includes a phone number.
- [ ] **Disclaimer** next to any "supports…" claim, marked with an asterisk (*), in bold and in a box when it's on a different panel from the claim (101.93). Minimum 1/16" type height. Exact wording: *"\*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease."*
- [ ] **Iron warning (Iron Complex and any product containing iron),** exact wording, in a box or set apart from other text (101.17(e)): *"WARNING: Accidental overdose of iron-containing products is a leading cause of fatal poisoning in children under 6. Keep this product out of reach of children. In case of accidental overdose, call a doctor or poison control center immediately."*
- [ ] **Claims:** only structure/function wording ("supports…", "helps maintain…"). Never "treats", "cures", "prevents", "reduces anxiety", "fights disease".
- [ ] **Prop 65 warning** if the supplier's testing says it's needed for California.
- [ ] **Lot and expiry** area left free for the manufacturer.

---

## 5. Print file requirements

Each product needs these files:
- **Editable master:** Affinity Designer (`.af`) or Illustrator (`.ai`), with layers for: dieline (non-printing), artwork, text, varnish or white ink (if a clear label).
- **Print PDF:**
  - **PDF/X-1a or PDF/X-4**, **CMYK**
  - **fonts converted to outlines**, images at **300 dpi** at print size
  - **0.125" (3 mm) bleed**, and text kept **0.0625–0.125" inside the trim** (use the supplier's safe zone if theirs is bigger)
  - **barcode in 100% black** (K only)
- **Proof JPG/PNG** of the flat label, plus one **3D bottle mockup** (Pacdora or Placeit) for the website and ads.
- **Naming:** `noovit_<product-slug>_<bottle-size>_v<version>.pdf`, e.g. `noovit_magnesium-complex_60ct_v1.pdf`.

**Order of work:**
1. Master layout on one product (Magnesium Complex).
2. Review it.
3. Roll out to the other products.
4. Print proof.
5. Supplier approval.

---

## 6. Products (launch set)

Wording, doses and colours come from the website catalog. **Doses must be replaced with the chosen supplier's Supplement Facts.** Drafts launch later, once their formulas are confirmed.

| Product | Status | Contents | Form | Directions | Product colour (screen) | Key ingredients (draft) |
|---|---|---|---|---|---|---|
| Probiotic Complex | Launch | 60 servings | Capsules | Take 1 capsule daily with water. | `#5B8DB8` | Probiotic blend (12 strains) 40 Billion CFU; Inulin 100 mg |
| Glucosamine Complex | Launch | 30 servings | Capsules | Take 3 capsules daily with a meal. | `#4A9B8E` | Glucosamine sulfate 1500 mg; Chondroitin 400 mg; MSM 500 mg; Curcumin 50 mg |
| Collagen Complex | Launch | 30 servings | Capsules | Take 2 capsules daily. | `#D98B8B` | Hydrolysed collagen peptides 1000 mg; Hyaluronic acid 50 mg; Vitamin C 80 mg |
| Menopause Complex | Launch | 30 servings | Capsules | Take 2 capsules daily with breakfast. | `#A27BB8` | Black cohosh 40 mg; Sage leaf 150 mg; Vitamin D3 1000 IU; Vitamin B6 10 mg |
| Magnesium Complex | Launch | 30 servings | Capsules | Take 2 capsules daily, ideally after an evening meal. | `#5C7FA8` | Mg glycinate 200 mg; Mg malate 100 mg; Mg citrate 100 mg; Zinc 10 mg; D3 1000 IU |
| Zinc | Launch | 90 servings | Capsules | Take 1 capsule daily with food. | `#7A8C99` | Zinc picolinate 25 mg; Copper 1 mg |
| Iron Complex | Launch | 60 servings | Capsules | Take 1 capsule daily with food. | `#B85C5C` | Iron bisglycinate 20 mg; Vitamin C 80 mg; B12 250 mcg; Folate 200 mcg. **Needs the iron warning.** |
| Vitamin D3 & K2 | Launch | 60 servings | Capsules | Take 1 capsule daily with a meal. | `#E0A63A` | Vitamin D3 2000 IU; Vitamin K2 (MK-7) 75 mcg |
| Turmeric Complex | Launch | 30 servings | Capsules | Take 2 capsules daily with a meal. | `#E09A2D` | Turmeric (95% curcuminoids) 500 mg; Boswellia 200 mg; Ginger 100 mg; Black pepper 5 mg |
| Berberine Complex | Launch | 30 servings | Capsules | Take 1 capsule up to 3 times daily, before meals. | `#C7A23A` | Berberine HCl 500 mg; Chromium 40 mcg; Ceylon cinnamon 100 mg |
| Ashwagandha | Launch | 30 servings | Capsules | Take 1 capsule twice daily. | `#9C7A5B` | Ashwagandha root extract (5% withanolides) 600 mg |
| Multivitamin | Launch | 30 servings | Capsules | Take 2 capsules daily with breakfast. | `#E07A5F` | 23 vitamins and minerals (full panel from supplier). **If it contains iron, add the iron warning.** |
| Biotin Complex | Launch | 60 servings | Capsules | Take 1 capsule daily. | `#C98DA8` | Biotin 5000 mcg; Zinc 10 mg; Selenium 55 mcg |
| Creatine | Launch | 60 servings | Powder (tub/pouch) | Mix 1 scoop (5 g) into water or a shake daily. | `#2F4858` | Creatine monohydrate (micronised) 5 g |
| Mushroom Blend Powder | Launch | 30 servings | Powder (tub/pouch) | Stir 1 scoop into coffee, tea or a smoothie daily. | `#6B5B45` | Lion's mane 1000 mg; Cordyceps 500 mg; Reishi 500 mg; Chaga 500 mg |
| Focus Complex | Draft | 30 servings | Capsules | Take 2 capsules daily with food. | `#4F6D7A` | Lion's mane 500 mg; Bacopa 300 mg; L-theanine 200 mg; Ginkgo 60 mg |
| Lion's Mane | Draft | 30 servings | Capsules | Take 2 capsules daily. | `#B89B72` | Organic lion's mane extract 1000 mg |
| L-Theanine Calm Focus | Draft | 60 servings | Capsules | Take 1 capsule once or twice daily. | `#7FA99B` | L-theanine 200 mg |

**Optional idea for the Focus line:** a navy label with an opal band, so the brain range reads as a family within Noovit.

---

## 7. What "done" looks like

- One master label approved on a printed proof, with colours checked against the CMYK values.
- Every launch product produced from the master and checked against §4.
- Files delivered as in §5, accepted by the supplier's prepress team.
- A 3D mockup of each product for the website. These replace the drawn bottles on the site; upload them under Admin → Products → Photos.
