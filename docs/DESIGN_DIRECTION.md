# Design direction: product pages "as close as possible" to The Absorption Company

_28 Oct 2026. Reference: absorbmore.com/products/curcumin (owner: "the best style and design"). We match the **structure, calm and clarity**, not their brand: our own colours (navy, orange, opal), fonts (Funnel logo, Manrope headings, Inter body), mosaic cross and wording._

## What makes their page great
1. **Calm, premium canvas:** warm off-white background (~#F5F4F0), lots of space, black text, one accent colour (orange) used sparingly. Product shots on a soft grey card, no clutter.
2. **Title with the ingredient in the accent colour:** "**Curcumin:** Daily Recovery & Joint Support". It's instantly scannable and keyword-rich.
3. **Answer-first hero:** rating link → 2-line promise → 4 benefit bullets with small icons → **a stat strip** of 4 boxed numbers (500 mg per dose · 149× absorption · 40% faster · 8× bioavailability).
4. **Plan selector as large cards:** "CHOOSE YOUR PLAN".
   - The 3-bottle option is preselected and tinted, with a "MOST POPULAR" tag.
   - Each card shows a black "SAVE 35%" tag, the price per month, the struck-through price, the "total today" and "save $51".
   - The selected card lists perks (free gifts, free shipping, update/pause/cancel anytime).
5. **Big black ADD TO CART**, then "Buy once for $147" as a quiet text link.
6. **Trust row under the button:** free shipping · 30-day money-back · HSA/FSA eligible, each with a thin icon.
7. **Clinicians' Choice box** (FrontrowMD) right under the buy area.
8. **Accordions on the right:** How to use · When will I see results? · Ingredients · What is [technology]? · Side effects? · Third-party tested? · Can I stack it?
9. **Lab badge:** "Tested by Light Labs in JUN 2026 · 14 substances tested for quality →".
10. **Stack upsell card:** "Part of the Immunity + Inflammation Stack", with price and a "Choose options" button.
11. **Left column under the gallery:**
    - an orange-headed **"Clinical research"** stat card
    - a **"Benefits"** card with check rows (bold claim plus a one-line explanation, each with `*`)
    - a **"Users also reported"** box
12. **Sticky bottom bar (desktop):** section tabs (Benefits · Absorption · What to Expect · Experts · Ingredients · FAQs) plus a mini product and an ADD TO CART button. On mobile, a full-width ADD TO CART.
13. **Lower page, in this order:**
    - USP marquee (thin icons)
    - lifestyle photo with a 6-card benefit grid
    - **"What to expect" timeline** (Month 1, 2, 3, 4+)
    - **expert section** (photo, quote, credentials, over a full-bleed image)
    - Clinicians' Choice strip
    - **"Pairs well with"** cards with category pills, rating, "From $x/mo" plus struck-through price and "35% off"
    - **clinician reviews** (name, specialty, years, cited journal)
    - **customer reviews** (score, distribution, search/filter, photos)
    - Instagram strip
    - black footer with a giant wordmark
14. **Typography:** a neutral grotesk in tight weights, large H1, small caps-style labels ("CHOOSE YOUR PLAN", "CLINICAL RESEARCH ON CURCUMIN").

## What we won't copy
- Exaggerated or unverifiable numbers ("149× absorption", "fights inflammation at the root", "less facial puffiness"). Our stat strip uses **real, sourced numbers** (dose, form, study effect sizes with evidence grade).
- Free-gift bundles at launch (cost). Maybe later.
- 3-bottle preselected subscription: we default to **one-time** for Google Shopping price matching and subscription law. We can visually *highlight* the best-value plan without preselecting it.

## Noovit product page: target layout
**Above the fold, desktop (two columns):**
- **Left:** gallery card (soft background, thumbnails underneath; bundles show the real bottles).
- **Right:**
  1. Title "**Magnesium:** Sleep+ — Restful Sleep & Calm" (ingredient in orange), with a rating link (real reviews only) and links to Ingredients and Benefits.
  2. 2-line promise, then 4 benefit bullets with small mosaic-tile icons.
  3. **Stat strip:** 4 boxes, e.g. "300 mg elemental Mg · 3 forms · 60 capsules · $0.58/day". Numbers must be on the label or sourced.
  4. **Choose your plan:** large radio cards:
     - One-time (default)
     - Subscribe & save (highlighted "Best value", but not preselected), with a black SAVE tag, price per bottle, struck-through price, total and savings
     - 1/3/6 packs
     - Perks list on the selected card
  5. Black full-width ADD TO CART.
  6. Trust row: Free US shipping · 90-day money-back · Cancel anytime (later HSA/FSA).
  7. Clinicians' Choice / dietitian box (placeholder until real).
  8. Accordions: How to use · When will I notice a difference? · Ingredients & Supplement Facts · Side effects & who should avoid it · Is it third-party tested? (COA link) · Can I stack it? · Read the full guide.
  9. Lab-tested badge (when the COA exists).
  10. Bundle upsell card: "Part of the Sleep & Calm Stack".
- **Left, under the gallery:**
  - "The research" stat card, with an orange header and evidence grades
  - "Benefits" check rows (claim plus one-line why, with `*`)
  - (later) "Customers also reported", from real reviews

**Sticky bar:** desktop has section tabs (Benefits · The research · What to expect · Experts · Ingredients · FAQ) plus a mini product and Add to cart. Mobile keeps our sticky Add bar.

**Lower page:**
1. USP marquee (thin icons)
2. Lifestyle image + 6 benefit cards
3. "What to expect" timeline: weeks 1–2, month 1, month 2–3; honest and sourced where possible
4. Expert/dietitian section with photo and quote (placeholder until real)
5. Pairs well with: cards with category pills (goal), price per month, saving
6. Clinician reviews (FrontrowMD, later)
7. Customer reviews
8. FAQ
9. Social strip (later)

**Global style updates:**
- Page background moves to a warm off-white (`#F6F4EF`), with cards in white or `#EFECE6`.
- Primary buttons switch to **black/navy solid with uppercase labels** on product pages (keep pill shapes, or square corners like theirs?). This needs the owner's decision.
- Labels: small uppercase tracked captions for section labels.
- Thin-line icons everywhere (already started).
- Footer: dark with a giant noovit⁺ wordmark (fits our logo well).

## Content needed per product (new fields)
- `heroTitle` ("Restful Sleep & Calm") and 4 hero bullets
- 4 stat-strip items (value plus label, sourced)
- "The research": 2–3 stats with evidence grade and source
- "What to expect" timeline (3–4 steps)
- Accordion answers (some exist: FAQ, dosage, whoFor)
- Bundle upsell (automatic from bundles)

These come from the real Supliful products plus the deep research. Until then we fill them with careful drafts.

## Build order
1. Global canvas, typography labels and button style (owner decides pill vs square).
2. Product hero: title, bullets, stat strip, plan cards, trust row, accordions, upsell.
3. Left-column research and benefits cards, plus the sticky section bar.
4. Lower sections: timeline, expert, pairs-well cards, reviews restyle, giant-wordmark footer.
5. Apply to bundles and goal pages; mobile polish; screenshots for owner review.
