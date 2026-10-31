# Deep research result: ashwagandha (received 31 Oct 2026) — reviewed

The owner ran prompt 2 from `docs/RESEARCH_PROMPTS.md`. This file keeps what is usable and flags what is not. The full
report text is in the conversation; **don't publish anything from it that isn't verified** (see below). Published
numbers come only from the verified sources in `lib/guides.ts` (ashwagandha guide) and `lib/evidence.ts`.

## Do not use (errors or unverifiable)
- **Claim about us not yet documented:** the market table lists "Noovit Ashwagandha Calm+ … cGMP facility tested,
  ISO/IEC 17025 third-party validated purity" (and $28; the price is $27). The owner says Supliful's product is
  third-party tested. We can say so publicly once we hold the paperwork: Supliful's GMP certificate and a per-lot COA
  from an ISO/IEC 17025-accredited lab (FTC substantiation). Then: "Third-party tested in an ISO/IEC 17025 lab", with
  the COA linked on the product page (TODO: COA block).
- **Doubtful sources:** "Naturecan Clinical Review Group 2026, Journal of Clinical Phytotherapy" (the URL is a blog);
  "Fornalik 2026, Frontiers in Endocrinology" and "Salve 2026, Nutrients" (no PMID, link goes to the PubMed home page);
  "Limaye 2024" (unchecked); "Examine study 1lV3E9" (not a citation). Treat as unverified.
- **Numbers that disagree with the paper:** Langade 2019 sleep onset given as 44.3→29.0 vs 47.0→40.0 min; the verified
  figures are about 42→29 vs 42→34 min. Langade 2021, Gopukumar 2021 and Choudhary 2015 effect sizes are unchecked.
- **Overstatements:** "Strong" evidence grades (our scale tops out at Moderate for this evidence); GABA-receptor
  downregulation and an "ashwagandha syndrome" presented as established (they are speculative/anecdotal); cycling and
  a "do not use more than 12 weeks" label line presented as required (no trial tested cycling; it's a precaution).
- **Claims list:** some suggested structure/function claims go beyond the evidence (e.g. VO2max, testosterone) and
  need the lawyer's review before any use.

## Usable (consistent with verified sources)
- KSM-66 = root-only aqueous extract, ≥5% withanolides; 600 mg/day is the main trial dose (Chandrasekhar 2012:
  stress score −44% vs −5.5%, cortisol −27.9% vs −7.9%, 60 days; Wankhede 2015 strength figures).
- Safety: rare liver injury (LiverTox; onset ~2–12 weeks; jaundice, dark urine), can raise thyroid hormones (Sharma
  2018), avoid in pregnancy/breastfeeding, caution with thyroid medication, sedatives, immunosuppressants,
  hormone-sensitive prostate cancer, liver disease. Denmark banned it in food supplements (2023).
- Health Canada monograph risk statements (pregnancy/breastfeeding; benign prostatic hypertrophy/prostate cancer;
  avoid alcohol and sedatives) — worth checking against our label warnings once Supliful's panel arrives.

## Ideas taken into the site (31 Oct)
- Product page "The research: what changed vs placebo" bars and "What to expect" timeline (`lib/evidence.ts`), using
  only verified numbers.
- FAQs from the People-Also-Ask list: emotional numbness (honest: anecdotal, not measured in trials), cycling (no trial
  tested a cycle; safety beyond ~3 months unstudied), morning vs night, liver warning signs.

## Ideas for later
- More PAA topics for the guide/FAQ: thyroid tests and levothyroxine, women and hormones, SSRIs, stacking with
  magnesium or L-theanine, stopping abruptly.
- Competitor price points to re-check (unverified here): Transparent Labs KSM-66 600 mg ~$0.33/day, Jarrow and Nature
  Made KSM-66 300 mg, Thorne Sensoril 125 mg ~$0.38/day, Goli gummies (300 mg KSM-66 per 2 gummies).

## Product decision this raises
Supliful's **Ashwagandha Plus** is KSM-66 600 mg **plus** L-arginine 300 mg, maca 150 mg, Panax ginseng 100 mg,
shatavari 50 mg, D3 20 mcg, B6 2.5 mg, B12 25 mcg. Our catalog lists only KSM-66 600 mg. If we sell Ashwagandha Plus,
the product page and Supplement Facts **must list every ingredient**, and the stimulating extras (ginseng, arginine) sit
oddly with a "Calm+" product. Preferred: a plain KSM-66 600 mg capsule (ask Supliful and other suppliers).
