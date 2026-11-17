# Label readiness: core range (checked 16 Nov 2026)

Files: `design/labels/<slug>.label.pdf` (bottle upload file, 6.25" × 2.5" with bleed, text outlined) and
`design/labels/creatine.tub.png` / `.tub.pdf` (tub). Regenerate with `npm run labels`.

## What every label already has (checked on all six)
| Requirement | Rule | Status |
|---|---|---|
| Statement of identity ("Dietary supplement") on the front | 21 CFR 101.3 | ✅ |
| Net quantity in the bottom 30% of the front (capsules / net wt) | 21 CFR 101.105 | ✅ |
| Supplement Facts: serving size, servings, amounts, %DV, † footnote | 21 CFR 101.36 | ✅ |
| "Other ingredients" below the Facts box | 21 CFR 101.4 | ✅ |
| Structure/function claim marked * + full FDA disclaimer | 21 CFR 101.93 | ✅ (info panel, boxed) |
| Name and US address of the distributor ("Distributed by Noovit LLC", Sheridan WY); no email (not required, 17 Nov) | 21 CFR 101.5 | ✅ |
| Domestic address for serious adverse-event reports | FD&C Act 761 | ✅ (same address) |
| Allergen statement (Turmeric: shellfish) | FALCPA | ✅ |
| "Keep out of reach of children", caution, storage, seal warning | good practice | ✅ |
| 18+ statement on creatine | our policy | ✅ |
| Iron products: the mandatory accidental-overdose warning, word for word, boxed, on the panel right of the front (Facts side) | 21 CFR 101.17(e) | ✅ (17 Nov) |
| Biotin products: lab-test interference note (caution + product page) | FDA safety communication | ✅ (17 Nov) |
| Front bottom block ("Dietary supplement", count) clear of the safe zone | Supliful | ✅ raised 4 units (17 Nov) |
| No unproven trust claims ("Made in USA", GMP, third-party tested) | FTC | ✅ removed |
| All text ≥ 5 pt (Supliful's minimum), nothing past the safe zone | Supliful | ✅ (`npm run labels` reports no overflow) |

## Open before ordering stock (in order)
| # | Item | Who | Why it matters |
|---|---|---|---|
| 1 | **"Organic" on Lion's Mane.** The front says "Organic Lion's Mane". Using "organic" on the main panel needs USDA-certified product and the certifier named on the label ("Certified organic by …"). | Owner → ask Supliful for their organic certificate and certifier name. If they can't give it, I remove "organic" from the front (keep it only in the ingredient list if their spec allows). | USDA NOP rules; a common FTC/USDA complaint. |
| 2 | **Magnesium 275 mg.** Confirm the elemental amount with Supliful's spec sheet or COA (pure glycinate would give ~350 mg from 2,500 mg). | Owner → Supliful | The dose is the brand promise. |
| 3 | **Type size on the side panels.** Our small text is 5 pt (Supliful's minimum). Whether the FDA's 1/16" rule applies at this label size is the question for the regulatory reviewer. | Regulatory reviewer (hiring brief 02, Part A) | Only true blocker for the print order. |
| 4 | **Lot number and best-by date.** Our files leave no space for them; ask Supliful how they mark each bottle (sticker or inkjet). | Owner → Supliful | Traceability for recalls and complaints. |
| 5 | **KSM-66® use.** Ask Supliful whether their KSM-66 licence covers our label naming it, and whether Ixoreal requires a trademark line ("KSM-66® is a registered trademark of Ixoreal Biomed"). I add the line if needed. | Owner → Supliful | Trademark licence. |
| 6 | **Printed sample** of one bottle (Magnesium) and the creatine tub: matte finish, white cards printing cleanly to the trim, true colours. | Owner → Supliful | Last visual check before all SKUs. |
| 7 | **UPC barcodes** (GS1). Not needed by Supliful; only for Amazon or retail later. | Owner, later | Optional now. |
| 8 | **QR codes:** not required by FDA. Supliful's editor adds its own lot/QR code (tub, bottom-left corner kept clear). Our own QR (batch COA page) only once COAs exist. | Later | Optional. |

## Product by product
- **Magnesium Sleep+:** ready, pending #2, #3, #4.
- **Ashwagandha Calm+:** ready, pending #3, #4, #5. Every ingredient listed (D3, B6, B12, KSM-66, L-arginine, maca, ginseng, shatavari).
- **Lion's Mane:** pending #1 (organic), #3, #4. Facts amount now printed "1,000mg" to match the front.
- **CoQ10:** ready, pending #3, #4. New plum colour.
- **Turmeric Complex:** ready, pending #3, #4. "Contains: shellfish" in the Facts panel.
- **Creatine (tub):** ready, pending #3, #4. 18+ in the caution; directions include the optional loading phase.
