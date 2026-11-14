# Hiring brief 02: FDA/FTC supplement regulatory review (labels + website claims)

| | |
|---|---|
| **Status** | Open: post now (needed before ordering stock and before public launch) |
| **Priority** | 2 (the label type-size question blocks the print order) |
| **Contract** | Fixed price, one project. Part A (labels) can be hired on its own if Part B quotes run high |
| **Budget** | Rough guide only, let proposals set it: Part A ~$300–800 for 6 labels; Part B ~$800–2,000. Prefer a flat fee per part |
| **Screening questions** | 1. Are you a US-licensed attorney or a regulatory consultant, and where? 2. How many dietary supplement labels have you reviewed under 21 CFR 101.36? 3. Quote Part A and Part B separately. 4. Turnaround for Part A? 5. Do you carry professional liability insurance? |
| **Must-haves** | Hands-on DSHEA / 21 CFR 101 supplement-label experience; FTC Health Products Compliance Guidance (2022) familiarity for Part B |
| **Red flags** | General "compliance" freelancers with no supplement examples; offers to "certify" or "FDA approve" a label (FDA doesn't approve supplement labels); no written report offered |

_14 Nov 2026. Goal: a written review of our six core supplement labels and the claims on our website, so we can order
stock and launch without a labelling or advertising problem._

## What they review
**Part A: labels** (6 wrap-around bottle labels, 6.0" × 2.25", and one 11" × 3" powder tub, made on the dropshipper's
template; PDFs supplied after hire):
1. Type size: our required text is ≥ 5 pt (the printer's minimum). Does 21 CFR 101.2(c) (1/16" minimum) apply to the
   information panel at this size, and does the small-package rule (101.9(j)(13) / 101.36(i)(2)) let us use smaller type
   or a simplified Supplement Facts format?
2. Principal display panel: statement of identity, net quantity placement (bottom 30%), the "Dietary supplement" wording.
3. Supplement Facts format: serving size, % Daily Values, the † footnote, long ingredient names, "Other ingredients".
4. Allergen declaration (one product contains shellfish), the distributor line ("Distributed by …" + address) and the
   adverse-event contact.
5. The structure/function claim on each front and the disclaimer placement.

**Part B: website claims** (staging link supplied after hire): product pages, ingredient guides, the supplement quiz,
and an AI chat assistant's guardrails. Specific questions:
- Iron, zinc and berberine product wording; "clinically studied" phrases; quiz wording that mentions symptoms.
- A nattokinase guide (education only) and whether methylene blue can be sold as a supplement at all (we don't sell it).
- Washington's My Health My Data Act and similar state laws before retargeting ads to health-product viewers.

**Deliverable:** a written memo with a pass / change / remove call for each item, and suggested wording for every change.

## Job post (copy into Upwork)

**Title:** FDA dietary supplement label + claims review (6 labels, website) — fixed price

**Description:**
We're a new US direct-to-consumer dietary supplement brand (magnesium glycinate, KSM-66 ashwagandha, creatine, lion's
mane, CoQ10, turmeric complex), made and shipped by a US contract manufacturer under our label.

We need an experienced supplement regulatory attorney or consultant to review:

**Part A — 6 bottle labels + 1 powder tub label** against 21 CFR 101 and 101.36: type size on a small (6" × 2.25") wrap
label, principal display panel, net quantity, Supplement Facts format, allergen statement, distributor line,
structure/function claims and the disclaimer.

**Part B — website claims** (product pages, ingredient guides, a quiz, an AI assistant's guardrails) against DSHEA and
the FTC's Health Products Compliance Guidance, plus a few specific questions (state health-data privacy law, two
ingredients we won't sell).

Deliverable: a written memo with clear pass / change / remove calls and suggested wording.

Please quote Part A and Part B separately, with turnaround, and tell us how many supplement labels you've reviewed.

## After hiring
- Send the label PDFs from `design/labels/` (`<slug>.label.pdf`, `creatine.tub.pdf`) and the preview link (Admin →
  Overview → preview link).
- Apply the memo's changes (Claude: `lib/labels/svg.ts`, product copy, guides), then tick the TODO items "side-panel type
  size" and "Regulatory lawyer review of claims".
