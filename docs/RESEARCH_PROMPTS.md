# Deep research prompts

_28 Oct 2026. Paste one block at a time into a deep-research tool (e.g. ChatGPT or Gemini Deep Research, as for your other projects). Each block is complete: the ingredient, our product facts, what to focus on, and the full brief. Send me the result, or save it as `docs/research/<name>.md`; I turn each into a product page update and a guide following `CONTENT_GUIDELINES.md`._

**Order:** run 1–6 first (the launch products), then 7–10 (once the second supplier is chosen), then the guides (11–14) whenever you like.

## Launch products
### 1. Magnesium glycinate
Save the result as `docs/research/magnesium.md` (or send it to Claude).

```text
INGREDIENT: Magnesium glycinate
Our product: Magnesium Sleep+ — 275 mg elemental magnesium as magnesium glycinate (from 2,500 mg magnesium glycinate) per 3 capsules, 30 servings.
FOCUS ON: Sleep quality and insomnia, stress and anxiety, muscle cramps, migraine, blood pressure, blood sugar. Glycinate vs citrate, oxide, malate and L-threonate (does threonate have human cognitive data?). Who is deficient (dietary intake data, testing limits). The upper limit for *supplemental* magnesium (350 mg) and how our 275 mg compares. Kidney disease, laxative effect, and interactions (antibiotics, bisphosphonates, PPIs, diuretics).

You are a research assistant for Noovit, a new US direct-to-consumer supplement brand. Our positioning is "evidence-graded": we only claim what human studies support, at the doses studied, and we say so plainly when evidence is weak, mixed or null. Research the ingredient below as sold in our product.

Rules
- Use primary and official sources: PubMed, Cochrane, ClinicalTrials.gov, NIH Office of Dietary Supplements, NCCIH, EFSA, Health Canada, FDA and FTC. Give a PMID, DOI or URL for every factual claim.
- Prefer human RCTs and meta-analyses. Label animal and in-vitro work clearly as such.
- Include null and negative trials, not only positive ones.
- Report what is current as of today. US spelling, no marketing language, Markdown with tables, cite claims as [n].

Deliver these sections
1. Summary (5 bullets): what it is; what it's best evidenced for; typical studied dose; main safety issue; bottom line for *our* dose.
2. Evidence by outcome (table): one row per outcome: number of RCTs, total participants, dose/form/duration ranges, effect vs placebo (with units and 95% CI where available), study quality, and an evidence grade:
   - Strong: meta-analysis or several good RCTs with a consistent effect
   - Moderate: several RCTs, mostly positive
   - Limited: few or small trials, or mixed results
   - Early: biomarker, animal or in-vitro only
   - Insufficient: trials found no clear effect
3. Key trials (the 5–8 most important): citation, design, n, population, dose and form, duration, and the primary result in numbers (means or % change for treatment vs placebo), enough to draw a simple bar chart.
4. Dose, form and timing:
   - studied doses, and how our dose compares
   - forms compared (absorption, tolerance, cost)
   - timing (with food? morning or evening?)
   - time to effect in trials, for a "what to expect" timeline: week 1–2, month 1, months 2–3
5. Official positions and limits: NIH ODS / NCCIH summaries, EFSA / Health Canada views, upper limits, regulatory status, FDA or FTC warnings, any country restrictions.
6. Safety:
   - common side effects (with rates)
   - serious adverse events and case reports
   - interactions: drug classes, examples and mechanism
   - contraindications; pregnancy and breastfeeding; children
   - finish with a plain-English warning block we can put on the label and product page
7. Claims we can make in the US: suggested structure/function claims supported at our dose, each with its grade and citation. List claims to avoid (disease claims, overstatements), and flag anything a regulatory lawyer should check.
8. Search landscape (US Google):
   - for "magnesium glycinate", "magnesium glycinate benefits", "magnesium glycinate side effects", "magnesium glycinate dosage" and "best magnesium glycinate supplement": the top 10 results each, with URL, type (publisher, brand or government), what it covers well and what it misses
   - 15–25 "People also ask" questions
   - related searches
   - the main YouTube, Shorts and TikTok topics
9. Community questions: recurring Reddit and forum questions and myths (r/Supplements, r/Nootropics, r/Biohackers and similar), popular stacks, timing and cycling, and what the evidence says about each.
10. Market (table): 10–15 leading products: brand, form, dose per serving, servings, price, $ per day, claims made, certifications (NSF, USP, IFOS, Informed Sport). Explain how doses are labelled (mg of extract vs active compound, CFU, %), and say where our product sits.
11. FAQ draft: 10–12 questions with short, cited answers in our voice: plain, a bit nerdy, honest.
12. Sources: a numbered list with full citations and PMID/DOI/URL.
```

### 2. Ashwagandha (KSM-66)
Save the result as `docs/research/ashwagandha.md` (or send it to Claude).

```text
INGREDIENT: Ashwagandha (KSM-66)
Our product: Ashwagandha Calm+ — KSM-66® ashwagandha root extract 600 mg/day (5% withanolides), 2 capsules. (Supliful's version also adds L-arginine 300 mg, maca 150 mg, Panax ginseng 100 mg, shatavari 50 mg, D3 20 mcg, B6 2.5 mg, B12 25 mcg; comment on whether those add anything at these doses.)
FOCUS ON: Stress and cortisol, sleep, anxiety, focus, testosterone, strength and recovery, thyroid hormones. KSM-66 vs Sensoril vs plain root powder: which trials used which. Liver-injury case reports (LiverTox), thyroid and autoimmune cautions, sedatives, pregnancy. Restrictions in Denmark and other countries and the reasons given. Whether cycling is needed.

You are a research assistant for Noovit, a new US direct-to-consumer supplement brand. Our positioning is "evidence-graded": we only claim what human studies support, at the doses studied, and we say so plainly when evidence is weak, mixed or null. Research the ingredient below as sold in our product.

Rules
- Use primary and official sources: PubMed, Cochrane, ClinicalTrials.gov, NIH Office of Dietary Supplements, NCCIH, EFSA, Health Canada, FDA and FTC. Give a PMID, DOI or URL for every factual claim.
- Prefer human RCTs and meta-analyses. Label animal and in-vitro work clearly as such.
- Include null and negative trials, not only positive ones.
- Report what is current as of today. US spelling, no marketing language, Markdown with tables, cite claims as [n].

Deliver these sections
1. Summary (5 bullets): what it is; what it's best evidenced for; typical studied dose; main safety issue; bottom line for *our* dose.
2. Evidence by outcome (table): one row per outcome: number of RCTs, total participants, dose/form/duration ranges, effect vs placebo (with units and 95% CI where available), study quality, and an evidence grade:
   - Strong: meta-analysis or several good RCTs with a consistent effect
   - Moderate: several RCTs, mostly positive
   - Limited: few or small trials, or mixed results
   - Early: biomarker, animal or in-vitro only
   - Insufficient: trials found no clear effect
3. Key trials (the 5–8 most important): citation, design, n, population, dose and form, duration, and the primary result in numbers (means or % change for treatment vs placebo), enough to draw a simple bar chart.
4. Dose, form and timing:
   - studied doses, and how our dose compares
   - forms compared (absorption, tolerance, cost)
   - timing (with food? morning or evening?)
   - time to effect in trials, for a "what to expect" timeline: week 1–2, month 1, months 2–3
5. Official positions and limits: NIH ODS / NCCIH summaries, EFSA / Health Canada views, upper limits, regulatory status, FDA or FTC warnings, any country restrictions.
6. Safety:
   - common side effects (with rates)
   - serious adverse events and case reports
   - interactions: drug classes, examples and mechanism
   - contraindications; pregnancy and breastfeeding; children
   - finish with a plain-English warning block we can put on the label and product page
7. Claims we can make in the US: suggested structure/function claims supported at our dose, each with its grade and citation. List claims to avoid (disease claims, overstatements), and flag anything a regulatory lawyer should check.
8. Search landscape (US Google):
   - for "ashwagandha", "ashwagandha benefits", "ashwagandha side effects", "ashwagandha dosage" and "best ashwagandha supplement": the top 10 results each, with URL, type (publisher, brand or government), what it covers well and what it misses
   - 15–25 "People also ask" questions
   - related searches
   - the main YouTube, Shorts and TikTok topics
9. Community questions: recurring Reddit and forum questions and myths (r/Supplements, r/Nootropics, r/Biohackers and similar), popular stacks, timing and cycling, and what the evidence says about each.
10. Market (table): 10–15 leading products: brand, form, dose per serving, servings, price, $ per day, claims made, certifications (NSF, USP, IFOS, Informed Sport). Explain how doses are labelled (mg of extract vs active compound, CFU, %), and say where our product sits.
11. FAQ draft: 10–12 questions with short, cited answers in our voice: plain, a bit nerdy, honest.
12. Sources: a numbered list with full citations and PMID/DOI/URL.
```

### 3. Lion's mane
Save the result as `docs/research/lions-mane.md` (or send it to Claude).

```text
INGREDIENT: Lion's mane
Our product: Lion's Mane — 1,000 mg/day organic lion's mane fruiting body + mycelium powder, standardised to 40% polysaccharides, 2 capsules.
FOCUS ON: Cognition (mild cognitive impairment, healthy adults), mood and anxiety, nerve health (NGF). Fruiting body vs mycelium grown on grain; why "polysaccharides" can be inflated by starch, and what beta-glucan and alpha-glucan testing shows (Megazyme method). Hericenones vs erinacines. Extract ratios (e.g. 8:1) vs powder. Allergy and safety data. What dose the human trials used (e.g. 3 g/day of fruiting body).

You are a research assistant for Noovit, a new US direct-to-consumer supplement brand. Our positioning is "evidence-graded": we only claim what human studies support, at the doses studied, and we say so plainly when evidence is weak, mixed or null. Research the ingredient below as sold in our product.

Rules
- Use primary and official sources: PubMed, Cochrane, ClinicalTrials.gov, NIH Office of Dietary Supplements, NCCIH, EFSA, Health Canada, FDA and FTC. Give a PMID, DOI or URL for every factual claim.
- Prefer human RCTs and meta-analyses. Label animal and in-vitro work clearly as such.
- Include null and negative trials, not only positive ones.
- Report what is current as of today. US spelling, no marketing language, Markdown with tables, cite claims as [n].

Deliver these sections
1. Summary (5 bullets): what it is; what it's best evidenced for; typical studied dose; main safety issue; bottom line for *our* dose.
2. Evidence by outcome (table): one row per outcome: number of RCTs, total participants, dose/form/duration ranges, effect vs placebo (with units and 95% CI where available), study quality, and an evidence grade:
   - Strong: meta-analysis or several good RCTs with a consistent effect
   - Moderate: several RCTs, mostly positive
   - Limited: few or small trials, or mixed results
   - Early: biomarker, animal or in-vitro only
   - Insufficient: trials found no clear effect
3. Key trials (the 5–8 most important): citation, design, n, population, dose and form, duration, and the primary result in numbers (means or % change for treatment vs placebo), enough to draw a simple bar chart.
4. Dose, form and timing:
   - studied doses, and how our dose compares
   - forms compared (absorption, tolerance, cost)
   - timing (with food? morning or evening?)
   - time to effect in trials, for a "what to expect" timeline: week 1–2, month 1, months 2–3
5. Official positions and limits: NIH ODS / NCCIH summaries, EFSA / Health Canada views, upper limits, regulatory status, FDA or FTC warnings, any country restrictions.
6. Safety:
   - common side effects (with rates)
   - serious adverse events and case reports
   - interactions: drug classes, examples and mechanism
   - contraindications; pregnancy and breastfeeding; children
   - finish with a plain-English warning block we can put on the label and product page
7. Claims we can make in the US: suggested structure/function claims supported at our dose, each with its grade and citation. List claims to avoid (disease claims, overstatements), and flag anything a regulatory lawyer should check.
8. Search landscape (US Google):
   - for "lion's mane", "lion's mane benefits", "lion's mane side effects", "lion's mane dosage" and "best lion's mane supplement": the top 10 results each, with URL, type (publisher, brand or government), what it covers well and what it misses
   - 15–25 "People also ask" questions
   - related searches
   - the main YouTube, Shorts and TikTok topics
9. Community questions: recurring Reddit and forum questions and myths (r/Supplements, r/Nootropics, r/Biohackers and similar), popular stacks, timing and cycling, and what the evidence says about each.
10. Market (table): 10–15 leading products: brand, form, dose per serving, servings, price, $ per day, claims made, certifications (NSF, USP, IFOS, Informed Sport). Explain how doses are labelled (mg of extract vs active compound, CFU, %), and say where our product sits.
11. FAQ draft: 10–12 questions with short, cited answers in our voice: plain, a bit nerdy, honest.
12. Sources: a numbered list with full citations and PMID/DOI/URL.
```

### 4. Creatine monohydrate
Save the result as `docs/research/creatine.md` (or send it to Claude).

```text
INGREDIENT: Creatine monohydrate
Our product: Creatine — creatine monohydrate 5 g/day, powder (281 g jar, about 56 servings).
FOCUS ON: Strength, power and lean mass; cognition (sleep deprivation, older adults, vegetarians); depression as an adjunct; women and older adults. Loading vs daily 3–5 g. Myths: kidneys, hair loss (the DHT study), water retention, cramping. Creapure vs generic; other forms (HCl, ethyl ester) vs monohydrate. Age 18+ positioning.

You are a research assistant for Noovit, a new US direct-to-consumer supplement brand. Our positioning is "evidence-graded": we only claim what human studies support, at the doses studied, and we say so plainly when evidence is weak, mixed or null. Research the ingredient below as sold in our product.

Rules
- Use primary and official sources: PubMed, Cochrane, ClinicalTrials.gov, NIH Office of Dietary Supplements, NCCIH, EFSA, Health Canada, FDA and FTC. Give a PMID, DOI or URL for every factual claim.
- Prefer human RCTs and meta-analyses. Label animal and in-vitro work clearly as such.
- Include null and negative trials, not only positive ones.
- Report what is current as of today. US spelling, no marketing language, Markdown with tables, cite claims as [n].

Deliver these sections
1. Summary (5 bullets): what it is; what it's best evidenced for; typical studied dose; main safety issue; bottom line for *our* dose.
2. Evidence by outcome (table): one row per outcome: number of RCTs, total participants, dose/form/duration ranges, effect vs placebo (with units and 95% CI where available), study quality, and an evidence grade:
   - Strong: meta-analysis or several good RCTs with a consistent effect
   - Moderate: several RCTs, mostly positive
   - Limited: few or small trials, or mixed results
   - Early: biomarker, animal or in-vitro only
   - Insufficient: trials found no clear effect
3. Key trials (the 5–8 most important): citation, design, n, population, dose and form, duration, and the primary result in numbers (means or % change for treatment vs placebo), enough to draw a simple bar chart.
4. Dose, form and timing:
   - studied doses, and how our dose compares
   - forms compared (absorption, tolerance, cost)
   - timing (with food? morning or evening?)
   - time to effect in trials, for a "what to expect" timeline: week 1–2, month 1, months 2–3
5. Official positions and limits: NIH ODS / NCCIH summaries, EFSA / Health Canada views, upper limits, regulatory status, FDA or FTC warnings, any country restrictions.
6. Safety:
   - common side effects (with rates)
   - serious adverse events and case reports
   - interactions: drug classes, examples and mechanism
   - contraindications; pregnancy and breastfeeding; children
   - finish with a plain-English warning block we can put on the label and product page
7. Claims we can make in the US: suggested structure/function claims supported at our dose, each with its grade and citation. List claims to avoid (disease claims, overstatements), and flag anything a regulatory lawyer should check.
8. Search landscape (US Google):
   - for "creatine", "creatine benefits", "creatine side effects", "creatine dosage" and "best creatine supplement": the top 10 results each, with URL, type (publisher, brand or government), what it covers well and what it misses
   - 15–25 "People also ask" questions
   - related searches
   - the main YouTube, Shorts and TikTok topics
9. Community questions: recurring Reddit and forum questions and myths (r/Supplements, r/Nootropics, r/Biohackers and similar), popular stacks, timing and cycling, and what the evidence says about each.
10. Market (table): 10–15 leading products: brand, form, dose per serving, servings, price, $ per day, claims made, certifications (NSF, USP, IFOS, Informed Sport). Explain how doses are labelled (mg of extract vs active compound, CFU, %), and say where our product sits.
11. FAQ draft: 10–12 questions with short, cited answers in our voice: plain, a bit nerdy, honest.
12. Sources: a numbered list with full citations and PMID/DOI/URL.
```

### 5. Turmeric / curcumin joint blend
Save the result as `docs/research/turmeric.md` (or send it to Claude).

```text
INGREDIENT: Turmeric / curcumin joint blend
Our product: Turmeric Complex, Supliful's "Platinum Turmeric" — a blend of turmeric root powder, turmeric extract 95% curcuminoids, glucosamine sulfate (from shellfish), chondroitin sulfate, ginger root extract, boswellia extract, MSM, BioPerine® (piperine), quercetin, L-methionine and bromelain, 2 capsules a day. *Exact amounts are still to come from the supplier.*
FOCUS ON: Joint pain and osteoarthritis for each ingredient (curcumin, boswellia, glucosamine and chondroitin, including the GAIT trial; ginger; MSM). The minimum curcuminoid dose that's meaningful, and absorption (piperine, branded forms such as phytosome). Liver-injury reports with turmeric + piperine, gallbladder disease, anticoagulants and antiplatelets, diabetes drugs, iron absorption, shellfish allergy. Which ingredients actually carry the evidence.

You are a research assistant for Noovit, a new US direct-to-consumer supplement brand. Our positioning is "evidence-graded": we only claim what human studies support, at the doses studied, and we say so plainly when evidence is weak, mixed or null. Research the ingredient below as sold in our product.

Rules
- Use primary and official sources: PubMed, Cochrane, ClinicalTrials.gov, NIH Office of Dietary Supplements, NCCIH, EFSA, Health Canada, FDA and FTC. Give a PMID, DOI or URL for every factual claim.
- Prefer human RCTs and meta-analyses. Label animal and in-vitro work clearly as such.
- Include null and negative trials, not only positive ones.
- Report what is current as of today. US spelling, no marketing language, Markdown with tables, cite claims as [n].

Deliver these sections
1. Summary (5 bullets): what it is; what it's best evidenced for; typical studied dose; main safety issue; bottom line for *our* dose.
2. Evidence by outcome (table): one row per outcome: number of RCTs, total participants, dose/form/duration ranges, effect vs placebo (with units and 95% CI where available), study quality, and an evidence grade:
   - Strong: meta-analysis or several good RCTs with a consistent effect
   - Moderate: several RCTs, mostly positive
   - Limited: few or small trials, or mixed results
   - Early: biomarker, animal or in-vitro only
   - Insufficient: trials found no clear effect
3. Key trials (the 5–8 most important): citation, design, n, population, dose and form, duration, and the primary result in numbers (means or % change for treatment vs placebo), enough to draw a simple bar chart.
4. Dose, form and timing:
   - studied doses, and how our dose compares
   - forms compared (absorption, tolerance, cost)
   - timing (with food? morning or evening?)
   - time to effect in trials, for a "what to expect" timeline: week 1–2, month 1, months 2–3
5. Official positions and limits: NIH ODS / NCCIH summaries, EFSA / Health Canada views, upper limits, regulatory status, FDA or FTC warnings, any country restrictions.
6. Safety:
   - common side effects (with rates)
   - serious adverse events and case reports
   - interactions: drug classes, examples and mechanism
   - contraindications; pregnancy and breastfeeding; children
   - finish with a plain-English warning block we can put on the label and product page
7. Claims we can make in the US: suggested structure/function claims supported at our dose, each with its grade and citation. List claims to avoid (disease claims, overstatements), and flag anything a regulatory lawyer should check.
8. Search landscape (US Google):
   - for "turmeric", "turmeric benefits", "turmeric side effects", "turmeric dosage" and "best turmeric supplement": the top 10 results each, with URL, type (publisher, brand or government), what it covers well and what it misses
   - 15–25 "People also ask" questions
   - related searches
   - the main YouTube, Shorts and TikTok topics
9. Community questions: recurring Reddit and forum questions and myths (r/Supplements, r/Nootropics, r/Biohackers and similar), popular stacks, timing and cycling, and what the evidence says about each.
10. Market (table): 10–15 leading products: brand, form, dose per serving, servings, price, $ per day, claims made, certifications (NSF, USP, IFOS, Informed Sport). Explain how doses are labelled (mg of extract vs active compound, CFU, %), and say where our product sits.
11. FAQ draft: 10–12 questions with short, cited answers in our voice: plain, a bit nerdy, honest.
12. Sources: a numbered list with full citations and PMID/DOI/URL.
```

### 6. CoQ10 (ubiquinone)
Save the result as `docs/research/coq10.md` (or send it to Claude).

```text
INGREDIENT: CoQ10 (ubiquinone)
Our product: CoQ10 — coenzyme Q10 as ubiquinone 200 mg/day, 1 capsule, 30 servings.
FOCUS ON: Heart failure (Q-SYMBIO), statin-associated muscle symptoms (mixed results), blood pressure, migraine prevention, fertility, energy and fatigue, ageing. Ubiquinone vs ubiquinol absorption. Interaction with warfarin, and blood-pressure and diabetes drugs. Typical doses in trials.

You are a research assistant for Noovit, a new US direct-to-consumer supplement brand. Our positioning is "evidence-graded": we only claim what human studies support, at the doses studied, and we say so plainly when evidence is weak, mixed or null. Research the ingredient below as sold in our product.

Rules
- Use primary and official sources: PubMed, Cochrane, ClinicalTrials.gov, NIH Office of Dietary Supplements, NCCIH, EFSA, Health Canada, FDA and FTC. Give a PMID, DOI or URL for every factual claim.
- Prefer human RCTs and meta-analyses. Label animal and in-vitro work clearly as such.
- Include null and negative trials, not only positive ones.
- Report what is current as of today. US spelling, no marketing language, Markdown with tables, cite claims as [n].

Deliver these sections
1. Summary (5 bullets): what it is; what it's best evidenced for; typical studied dose; main safety issue; bottom line for *our* dose.
2. Evidence by outcome (table): one row per outcome: number of RCTs, total participants, dose/form/duration ranges, effect vs placebo (with units and 95% CI where available), study quality, and an evidence grade:
   - Strong: meta-analysis or several good RCTs with a consistent effect
   - Moderate: several RCTs, mostly positive
   - Limited: few or small trials, or mixed results
   - Early: biomarker, animal or in-vitro only
   - Insufficient: trials found no clear effect
3. Key trials (the 5–8 most important): citation, design, n, population, dose and form, duration, and the primary result in numbers (means or % change for treatment vs placebo), enough to draw a simple bar chart.
4. Dose, form and timing:
   - studied doses, and how our dose compares
   - forms compared (absorption, tolerance, cost)
   - timing (with food? morning or evening?)
   - time to effect in trials, for a "what to expect" timeline: week 1–2, month 1, months 2–3
5. Official positions and limits: NIH ODS / NCCIH summaries, EFSA / Health Canada views, upper limits, regulatory status, FDA or FTC warnings, any country restrictions.
6. Safety:
   - common side effects (with rates)
   - serious adverse events and case reports
   - interactions: drug classes, examples and mechanism
   - contraindications; pregnancy and breastfeeding; children
   - finish with a plain-English warning block we can put on the label and product page
7. Claims we can make in the US: suggested structure/function claims supported at our dose, each with its grade and citation. List claims to avoid (disease claims, overstatements), and flag anything a regulatory lawyer should check.
8. Search landscape (US Google):
   - for "coq10", "coq10 benefits", "coq10 side effects", "coq10 dosage" and "best coq10 supplement": the top 10 results each, with URL, type (publisher, brand or government), what it covers well and what it misses
   - 15–25 "People also ask" questions
   - related searches
   - the main YouTube, Shorts and TikTok topics
9. Community questions: recurring Reddit and forum questions and myths (r/Supplements, r/Nootropics, r/Biohackers and similar), popular stacks, timing and cycling, and what the evidence says about each.
10. Market (table): 10–15 leading products: brand, form, dose per serving, servings, price, $ per day, claims made, certifications (NSF, USP, IFOS, Informed Sport). Explain how doses are labelled (mg of extract vs active compound, CFU, %), and say where our product sits.
11. FAQ draft: 10–12 questions with short, cited answers in our voice: plain, a bit nerdy, honest.
12. Sources: a numbered list with full citations and PMID/DOI/URL.
```

## Batch 2 (after the supplier is confirmed)
### 7. Probiotics
Save the result as `docs/research/probiotics.md` (or send it to Claude).

```text
INGREDIENT: Probiotics
Our product: Probiotic Gut+ (formula still to be confirmed: Supliful lists 40B CFU with 4 strains and FOS, but without strain codes).
FOCUS ON: Strain-specific evidence: which named strains (e.g. LGG, BB-12, *L. plantarum* 299v, *B. lactis* HN019) have RCTs for bloating, IBS, regularity and antibiotic-associated diarrhoea. Why CFU alone means little. Shelf stability. Who should avoid (immunocompromised).

You are a research assistant for Noovit, a new US direct-to-consumer supplement brand. Our positioning is "evidence-graded": we only claim what human studies support, at the doses studied, and we say so plainly when evidence is weak, mixed or null. Research the ingredient below as sold in our product.

Rules
- Use primary and official sources: PubMed, Cochrane, ClinicalTrials.gov, NIH Office of Dietary Supplements, NCCIH, EFSA, Health Canada, FDA and FTC. Give a PMID, DOI or URL for every factual claim.
- Prefer human RCTs and meta-analyses. Label animal and in-vitro work clearly as such.
- Include null and negative trials, not only positive ones.
- Report what is current as of today. US spelling, no marketing language, Markdown with tables, cite claims as [n].

Deliver these sections
1. Summary (5 bullets): what it is; what it's best evidenced for; typical studied dose; main safety issue; bottom line for *our* dose.
2. Evidence by outcome (table): one row per outcome: number of RCTs, total participants, dose/form/duration ranges, effect vs placebo (with units and 95% CI where available), study quality, and an evidence grade:
   - Strong: meta-analysis or several good RCTs with a consistent effect
   - Moderate: several RCTs, mostly positive
   - Limited: few or small trials, or mixed results
   - Early: biomarker, animal or in-vitro only
   - Insufficient: trials found no clear effect
3. Key trials (the 5–8 most important): citation, design, n, population, dose and form, duration, and the primary result in numbers (means or % change for treatment vs placebo), enough to draw a simple bar chart.
4. Dose, form and timing:
   - studied doses, and how our dose compares
   - forms compared (absorption, tolerance, cost)
   - timing (with food? morning or evening?)
   - time to effect in trials, for a "what to expect" timeline: week 1–2, month 1, months 2–3
5. Official positions and limits: NIH ODS / NCCIH summaries, EFSA / Health Canada views, upper limits, regulatory status, FDA or FTC warnings, any country restrictions.
6. Safety:
   - common side effects (with rates)
   - serious adverse events and case reports
   - interactions: drug classes, examples and mechanism
   - contraindications; pregnancy and breastfeeding; children
   - finish with a plain-English warning block we can put on the label and product page
7. Claims we can make in the US: suggested structure/function claims supported at our dose, each with its grade and citation. List claims to avoid (disease claims, overstatements), and flag anything a regulatory lawyer should check.
8. Search landscape (US Google):
   - for "probiotics", "probiotics benefits", "probiotics side effects", "probiotics dosage" and "best probiotics supplement": the top 10 results each, with URL, type (publisher, brand or government), what it covers well and what it misses
   - 15–25 "People also ask" questions
   - related searches
   - the main YouTube, Shorts and TikTok topics
9. Community questions: recurring Reddit and forum questions and myths (r/Supplements, r/Nootropics, r/Biohackers and similar), popular stacks, timing and cycling, and what the evidence says about each.
10. Market (table): 10–15 leading products: brand, form, dose per serving, servings, price, $ per day, claims made, certifications (NSF, USP, IFOS, Informed Sport). Explain how doses are labelled (mg of extract vs active compound, CFU, %), and say where our product sits.
11. FAQ draft: 10–12 questions with short, cited answers in our voice: plain, a bit nerdy, honest.
12. Sources: a numbered list with full citations and PMID/DOI/URL.
```

### 8. Collagen peptides
Save the result as `docs/research/collagen.md` (or send it to Claude).

```text
INGREDIENT: Collagen peptides
Our product: Collagen Glow+ (bovine hydrolysed collagen peptides, types I & III; dose per serving to be confirmed, aim 10 g).
FOCUS ON: Skin elasticity and hydration RCTs (dose, peptide types, industry funding), joints, bone, nails, hair. Bovine vs marine. Heavy metals testing.

You are a research assistant for Noovit, a new US direct-to-consumer supplement brand. Our positioning is "evidence-graded": we only claim what human studies support, at the doses studied, and we say so plainly when evidence is weak, mixed or null. Research the ingredient below as sold in our product.

Rules
- Use primary and official sources: PubMed, Cochrane, ClinicalTrials.gov, NIH Office of Dietary Supplements, NCCIH, EFSA, Health Canada, FDA and FTC. Give a PMID, DOI or URL for every factual claim.
- Prefer human RCTs and meta-analyses. Label animal and in-vitro work clearly as such.
- Include null and negative trials, not only positive ones.
- Report what is current as of today. US spelling, no marketing language, Markdown with tables, cite claims as [n].

Deliver these sections
1. Summary (5 bullets): what it is; what it's best evidenced for; typical studied dose; main safety issue; bottom line for *our* dose.
2. Evidence by outcome (table): one row per outcome: number of RCTs, total participants, dose/form/duration ranges, effect vs placebo (with units and 95% CI where available), study quality, and an evidence grade:
   - Strong: meta-analysis or several good RCTs with a consistent effect
   - Moderate: several RCTs, mostly positive
   - Limited: few or small trials, or mixed results
   - Early: biomarker, animal or in-vitro only
   - Insufficient: trials found no clear effect
3. Key trials (the 5–8 most important): citation, design, n, population, dose and form, duration, and the primary result in numbers (means or % change for treatment vs placebo), enough to draw a simple bar chart.
4. Dose, form and timing:
   - studied doses, and how our dose compares
   - forms compared (absorption, tolerance, cost)
   - timing (with food? morning or evening?)
   - time to effect in trials, for a "what to expect" timeline: week 1–2, month 1, months 2–3
5. Official positions and limits: NIH ODS / NCCIH summaries, EFSA / Health Canada views, upper limits, regulatory status, FDA or FTC warnings, any country restrictions.
6. Safety:
   - common side effects (with rates)
   - serious adverse events and case reports
   - interactions: drug classes, examples and mechanism
   - contraindications; pregnancy and breastfeeding; children
   - finish with a plain-English warning block we can put on the label and product page
7. Claims we can make in the US: suggested structure/function claims supported at our dose, each with its grade and citation. List claims to avoid (disease claims, overstatements), and flag anything a regulatory lawyer should check.
8. Search landscape (US Google):
   - for "collagen", "collagen benefits", "collagen side effects", "collagen dosage" and "best collagen supplement": the top 10 results each, with URL, type (publisher, brand or government), what it covers well and what it misses
   - 15–25 "People also ask" questions
   - related searches
   - the main YouTube, Shorts and TikTok topics
9. Community questions: recurring Reddit and forum questions and myths (r/Supplements, r/Nootropics, r/Biohackers and similar), popular stacks, timing and cycling, and what the evidence says about each.
10. Market (table): 10–15 leading products: brand, form, dose per serving, servings, price, $ per day, claims made, certifications (NSF, USP, IFOS, Informed Sport). Explain how doses are labelled (mg of extract vs active compound, CFU, %), and say where our product sits.
11. FAQ draft: 10–12 questions with short, cited answers in our voice: plain, a bit nerdy, honest.
12. Sources: a numbered list with full citations and PMID/DOI/URL.
```

### 9. Menopause herbal blend
Save the result as `docs/research/menopause.md` (or send it to Claude).

```text
INGREDIENT: Menopause herbal blend
Our product: Menopause Balance+ (Supliful "Women's Vitality": black cohosh 160 mg, red clover 400 mg, sage 200 mg, dong quai 150 mg, licorice 150 mg, soy isoflavones 30 mg, chasteberry 50 mg and others).
FOCUS ON: Evidence per herb for hot flushes, sleep and mood; safety (black cohosh liver reports, licorice and blood pressure, dong quai and bleeding, phytoestrogens and breast-cancer history); drug interactions; what an honest claim looks like.

You are a research assistant for Noovit, a new US direct-to-consumer supplement brand. Our positioning is "evidence-graded": we only claim what human studies support, at the doses studied, and we say so plainly when evidence is weak, mixed or null. Research the ingredient below as sold in our product.

Rules
- Use primary and official sources: PubMed, Cochrane, ClinicalTrials.gov, NIH Office of Dietary Supplements, NCCIH, EFSA, Health Canada, FDA and FTC. Give a PMID, DOI or URL for every factual claim.
- Prefer human RCTs and meta-analyses. Label animal and in-vitro work clearly as such.
- Include null and negative trials, not only positive ones.
- Report what is current as of today. US spelling, no marketing language, Markdown with tables, cite claims as [n].

Deliver these sections
1. Summary (5 bullets): what it is; what it's best evidenced for; typical studied dose; main safety issue; bottom line for *our* dose.
2. Evidence by outcome (table): one row per outcome: number of RCTs, total participants, dose/form/duration ranges, effect vs placebo (with units and 95% CI where available), study quality, and an evidence grade:
   - Strong: meta-analysis or several good RCTs with a consistent effect
   - Moderate: several RCTs, mostly positive
   - Limited: few or small trials, or mixed results
   - Early: biomarker, animal or in-vitro only
   - Insufficient: trials found no clear effect
3. Key trials (the 5–8 most important): citation, design, n, population, dose and form, duration, and the primary result in numbers (means or % change for treatment vs placebo), enough to draw a simple bar chart.
4. Dose, form and timing:
   - studied doses, and how our dose compares
   - forms compared (absorption, tolerance, cost)
   - timing (with food? morning or evening?)
   - time to effect in trials, for a "what to expect" timeline: week 1–2, month 1, months 2–3
5. Official positions and limits: NIH ODS / NCCIH summaries, EFSA / Health Canada views, upper limits, regulatory status, FDA or FTC warnings, any country restrictions.
6. Safety:
   - common side effects (with rates)
   - serious adverse events and case reports
   - interactions: drug classes, examples and mechanism
   - contraindications; pregnancy and breastfeeding; children
   - finish with a plain-English warning block we can put on the label and product page
7. Claims we can make in the US: suggested structure/function claims supported at our dose, each with its grade and citation. List claims to avoid (disease claims, overstatements), and flag anything a regulatory lawyer should check.
8. Search landscape (US Google):
   - for "menopause supplements", "menopause supplements benefits", "menopause supplements side effects", "menopause supplements dosage" and "best menopause supplements supplement": the top 10 results each, with URL, type (publisher, brand or government), what it covers well and what it misses
   - 15–25 "People also ask" questions
   - related searches
   - the main YouTube, Shorts and TikTok topics
9. Community questions: recurring Reddit and forum questions and myths (r/Supplements, r/Nootropics, r/Biohackers and similar), popular stacks, timing and cycling, and what the evidence says about each.
10. Market (table): 10–15 leading products: brand, form, dose per serving, servings, price, $ per day, claims made, certifications (NSF, USP, IFOS, Informed Sport). Explain how doses are labelled (mg of extract vs active compound, CFU, %), and say where our product sits.
11. FAQ draft: 10–12 questions with short, cited answers in our voice: plain, a bit nerdy, honest.
12. Sources: a numbered list with full citations and PMID/DOI/URL.
```

### 10. NAC (N-acetyl cysteine)
Save the result as `docs/research/nac.md` (or send it to Claude).

```text
INGREDIENT: NAC (N-acetyl cysteine)
Our product: NAC 600 mg (draft; supplier to be found).
FOCUS ON: Respiratory, mental health (OCD, addiction, bipolar adjunct), glutathione and antioxidant evidence; the FDA's NAC enforcement discretion and current status; safety and interactions (nitroglycerin, activated charcoal).

You are a research assistant for Noovit, a new US direct-to-consumer supplement brand. Our positioning is "evidence-graded": we only claim what human studies support, at the doses studied, and we say so plainly when evidence is weak, mixed or null. Research the ingredient below as sold in our product.

Rules
- Use primary and official sources: PubMed, Cochrane, ClinicalTrials.gov, NIH Office of Dietary Supplements, NCCIH, EFSA, Health Canada, FDA and FTC. Give a PMID, DOI or URL for every factual claim.
- Prefer human RCTs and meta-analyses. Label animal and in-vitro work clearly as such.
- Include null and negative trials, not only positive ones.
- Report what is current as of today. US spelling, no marketing language, Markdown with tables, cite claims as [n].

Deliver these sections
1. Summary (5 bullets): what it is; what it's best evidenced for; typical studied dose; main safety issue; bottom line for *our* dose.
2. Evidence by outcome (table): one row per outcome: number of RCTs, total participants, dose/form/duration ranges, effect vs placebo (with units and 95% CI where available), study quality, and an evidence grade:
   - Strong: meta-analysis or several good RCTs with a consistent effect
   - Moderate: several RCTs, mostly positive
   - Limited: few or small trials, or mixed results
   - Early: biomarker, animal or in-vitro only
   - Insufficient: trials found no clear effect
3. Key trials (the 5–8 most important): citation, design, n, population, dose and form, duration, and the primary result in numbers (means or % change for treatment vs placebo), enough to draw a simple bar chart.
4. Dose, form and timing:
   - studied doses, and how our dose compares
   - forms compared (absorption, tolerance, cost)
   - timing (with food? morning or evening?)
   - time to effect in trials, for a "what to expect" timeline: week 1–2, month 1, months 2–3
5. Official positions and limits: NIH ODS / NCCIH summaries, EFSA / Health Canada views, upper limits, regulatory status, FDA or FTC warnings, any country restrictions.
6. Safety:
   - common side effects (with rates)
   - serious adverse events and case reports
   - interactions: drug classes, examples and mechanism
   - contraindications; pregnancy and breastfeeding; children
   - finish with a plain-English warning block we can put on the label and product page
7. Claims we can make in the US: suggested structure/function claims supported at our dose, each with its grade and citation. List claims to avoid (disease claims, overstatements), and flag anything a regulatory lawyer should check.
8. Search landscape (US Google):
   - for "nac", "nac benefits", "nac side effects", "nac dosage" and "best nac supplement": the top 10 results each, with URL, type (publisher, brand or government), what it covers well and what it misses
   - 15–25 "People also ask" questions
   - related searches
   - the main YouTube, Shorts and TikTok topics
9. Community questions: recurring Reddit and forum questions and myths (r/Supplements, r/Nootropics, r/Biohackers and similar), popular stacks, timing and cycling, and what the evidence says about each.
10. Market (table): 10–15 leading products: brand, form, dose per serving, servings, price, $ per day, claims made, certifications (NSF, USP, IFOS, Informed Sport). Explain how doses are labelled (mg of extract vs active compound, CFU, %), and say where our product sits.
11. FAQ draft: 10–12 questions with short, cited answers in our voice: plain, a bit nerdy, honest.
12. Sources: a numbered list with full citations and PMID/DOI/URL.
```

## Guides only (no product, or phase 2)
### 11. Nutrition on GLP-1 medications
Save the result as `docs/research/glp1-nutrition.md` (or send it to Claude).

```text
INGREDIENT: Nutrition on GLP-1 medications
For a guide, not a product: people taking semaglutide or tirzepatide.
FOCUS ON: Muscle loss and protein needs, fibre, hydration, B12, micronutrient gaps, nausea (ginger evidence), constipation (magnesium, fibre), hair loss (telogen effluvium; when biotin helps), what dietitians and ADA/Obesity Society guidance say; what a companion supplement bundle should and shouldn't claim.

You are a research assistant for Noovit, a new US direct-to-consumer supplement brand. Our positioning is "evidence-graded": we only claim what human studies support, at the doses studied, and we say so plainly when evidence is weak, mixed or null. Research the ingredient below as sold in our product.

Rules
- Use primary and official sources: PubMed, Cochrane, ClinicalTrials.gov, NIH Office of Dietary Supplements, NCCIH, EFSA, Health Canada, FDA and FTC. Give a PMID, DOI or URL for every factual claim.
- Prefer human RCTs and meta-analyses. Label animal and in-vitro work clearly as such.
- Include null and negative trials, not only positive ones.
- Report what is current as of today. US spelling, no marketing language, Markdown with tables, cite claims as [n].

Deliver these sections
1. Summary (5 bullets): what it is; what it's best evidenced for; typical studied dose; main safety issue; bottom line for *our* dose.
2. Evidence by outcome (table): one row per outcome: number of RCTs, total participants, dose/form/duration ranges, effect vs placebo (with units and 95% CI where available), study quality, and an evidence grade:
   - Strong: meta-analysis or several good RCTs with a consistent effect
   - Moderate: several RCTs, mostly positive
   - Limited: few or small trials, or mixed results
   - Early: biomarker, animal or in-vitro only
   - Insufficient: trials found no clear effect
3. Key trials (the 5–8 most important): citation, design, n, population, dose and form, duration, and the primary result in numbers (means or % change for treatment vs placebo), enough to draw a simple bar chart.
4. Dose, form and timing:
   - studied doses, and how our dose compares
   - forms compared (absorption, tolerance, cost)
   - timing (with food? morning or evening?)
   - time to effect in trials, for a "what to expect" timeline: week 1–2, month 1, months 2–3
5. Official positions and limits: NIH ODS / NCCIH summaries, EFSA / Health Canada views, upper limits, regulatory status, FDA or FTC warnings, any country restrictions.
6. Safety:
   - common side effects (with rates)
   - serious adverse events and case reports
   - interactions: drug classes, examples and mechanism
   - contraindications; pregnancy and breastfeeding; children
   - finish with a plain-English warning block we can put on the label and product page
7. Claims we can make in the US: suggested structure/function claims supported at our dose, each with its grade and citation. List claims to avoid (disease claims, overstatements), and flag anything a regulatory lawyer should check.
8. Search landscape (US Google):
   - for "glp-1 supplements", "glp-1 supplements benefits", "glp-1 supplements side effects", "glp-1 supplements dosage" and "best glp-1 supplements supplement": the top 10 results each, with URL, type (publisher, brand or government), what it covers well and what it misses
   - 15–25 "People also ask" questions
   - related searches
   - the main YouTube, Shorts and TikTok topics
9. Community questions: recurring Reddit and forum questions and myths (r/Supplements, r/Nootropics, r/Biohackers and similar), popular stacks, timing and cycling, and what the evidence says about each.
10. Market (table): 10–15 leading products: brand, form, dose per serving, servings, price, $ per day, claims made, certifications (NSF, USP, IFOS, Informed Sport). Explain how doses are labelled (mg of extract vs active compound, CFU, %), and say where our product sits.
11. FAQ draft: 10–12 questions with short, cited answers in our voice: plain, a bit nerdy, honest.
12. Sources: a numbered list with full citations and PMID/DOI/URL.
```

### 12. Methylene blue
Save the result as `docs/research/methylene-blue.md` (or send it to Claude).

```text
INGREDIENT: Methylene blue
For a guide, not a product: we are not selling it.
FOCUS ON: Human cognitive studies and doses, its FDA drug status and whether it can legally be a supplement, serotonin syndrome with SSRIs and SNRIs (FDA communication), G6PD deficiency, why "research use only" products exist; an honest summary.

You are a research assistant for Noovit, a new US direct-to-consumer supplement brand. Our positioning is "evidence-graded": we only claim what human studies support, at the doses studied, and we say so plainly when evidence is weak, mixed or null. Research the ingredient below as sold in our product.

Rules
- Use primary and official sources: PubMed, Cochrane, ClinicalTrials.gov, NIH Office of Dietary Supplements, NCCIH, EFSA, Health Canada, FDA and FTC. Give a PMID, DOI or URL for every factual claim.
- Prefer human RCTs and meta-analyses. Label animal and in-vitro work clearly as such.
- Include null and negative trials, not only positive ones.
- Report what is current as of today. US spelling, no marketing language, Markdown with tables, cite claims as [n].

Deliver these sections
1. Summary (5 bullets): what it is; what it's best evidenced for; typical studied dose; main safety issue; bottom line for *our* dose.
2. Evidence by outcome (table): one row per outcome: number of RCTs, total participants, dose/form/duration ranges, effect vs placebo (with units and 95% CI where available), study quality, and an evidence grade:
   - Strong: meta-analysis or several good RCTs with a consistent effect
   - Moderate: several RCTs, mostly positive
   - Limited: few or small trials, or mixed results
   - Early: biomarker, animal or in-vitro only
   - Insufficient: trials found no clear effect
3. Key trials (the 5–8 most important): citation, design, n, population, dose and form, duration, and the primary result in numbers (means or % change for treatment vs placebo), enough to draw a simple bar chart.
4. Dose, form and timing:
   - studied doses, and how our dose compares
   - forms compared (absorption, tolerance, cost)
   - timing (with food? morning or evening?)
   - time to effect in trials, for a "what to expect" timeline: week 1–2, month 1, months 2–3
5. Official positions and limits: NIH ODS / NCCIH summaries, EFSA / Health Canada views, upper limits, regulatory status, FDA or FTC warnings, any country restrictions.
6. Safety:
   - common side effects (with rates)
   - serious adverse events and case reports
   - interactions: drug classes, examples and mechanism
   - contraindications; pregnancy and breastfeeding; children
   - finish with a plain-English warning block we can put on the label and product page
7. Claims we can make in the US: suggested structure/function claims supported at our dose, each with its grade and citation. List claims to avoid (disease claims, overstatements), and flag anything a regulatory lawyer should check.
8. Search landscape (US Google):
   - for "methylene blue", "methylene blue benefits", "methylene blue side effects", "methylene blue dosage" and "best methylene blue supplement": the top 10 results each, with URL, type (publisher, brand or government), what it covers well and what it misses
   - 15–25 "People also ask" questions
   - related searches
   - the main YouTube, Shorts and TikTok topics
9. Community questions: recurring Reddit and forum questions and myths (r/Supplements, r/Nootropics, r/Biohackers and similar), popular stacks, timing and cycling, and what the evidence says about each.
10. Market (table): 10–15 leading products: brand, form, dose per serving, servings, price, $ per day, claims made, certifications (NSF, USP, IFOS, Informed Sport). Explain how doses are labelled (mg of extract vs active compound, CFU, %), and say where our product sits.
11. FAQ draft: 10–12 questions with short, cited answers in our voice: plain, a bit nerdy, honest.
12. Sources: a numbered list with full citations and PMID/DOI/URL.
```

### 13. NAD+, NMN and NR
Save the result as `docs/research/nad-nmn-nr.md` (or send it to Claude).

```text
INGREDIENT: NAD+, NMN and NR
For a guide (and a possible phase-2 product): Supliful sells NAD+ 500 mg + quercetin + resveratrol, and NMN 500 mg.
FOCUS ON: Does oral NAD+ raise NAD+ levels; NMN and NR human trials (blood NAD+, functional outcomes); the FDA NMN reversal (Sept 2025); IV and injectable NAD+ (and why we don't sell it); safety.

You are a research assistant for Noovit, a new US direct-to-consumer supplement brand. Our positioning is "evidence-graded": we only claim what human studies support, at the doses studied, and we say so plainly when evidence is weak, mixed or null. Research the ingredient below as sold in our product.

Rules
- Use primary and official sources: PubMed, Cochrane, ClinicalTrials.gov, NIH Office of Dietary Supplements, NCCIH, EFSA, Health Canada, FDA and FTC. Give a PMID, DOI or URL for every factual claim.
- Prefer human RCTs and meta-analyses. Label animal and in-vitro work clearly as such.
- Include null and negative trials, not only positive ones.
- Report what is current as of today. US spelling, no marketing language, Markdown with tables, cite claims as [n].

Deliver these sections
1. Summary (5 bullets): what it is; what it's best evidenced for; typical studied dose; main safety issue; bottom line for *our* dose.
2. Evidence by outcome (table): one row per outcome: number of RCTs, total participants, dose/form/duration ranges, effect vs placebo (with units and 95% CI where available), study quality, and an evidence grade:
   - Strong: meta-analysis or several good RCTs with a consistent effect
   - Moderate: several RCTs, mostly positive
   - Limited: few or small trials, or mixed results
   - Early: biomarker, animal or in-vitro only
   - Insufficient: trials found no clear effect
3. Key trials (the 5–8 most important): citation, design, n, population, dose and form, duration, and the primary result in numbers (means or % change for treatment vs placebo), enough to draw a simple bar chart.
4. Dose, form and timing:
   - studied doses, and how our dose compares
   - forms compared (absorption, tolerance, cost)
   - timing (with food? morning or evening?)
   - time to effect in trials, for a "what to expect" timeline: week 1–2, month 1, months 2–3
5. Official positions and limits: NIH ODS / NCCIH summaries, EFSA / Health Canada views, upper limits, regulatory status, FDA or FTC warnings, any country restrictions.
6. Safety:
   - common side effects (with rates)
   - serious adverse events and case reports
   - interactions: drug classes, examples and mechanism
   - contraindications; pregnancy and breastfeeding; children
   - finish with a plain-English warning block we can put on the label and product page
7. Claims we can make in the US: suggested structure/function claims supported at our dose, each with its grade and citation. List claims to avoid (disease claims, overstatements), and flag anything a regulatory lawyer should check.
8. Search landscape (US Google):
   - for "nmn", "nmn benefits", "nmn side effects", "nmn dosage" and "best nmn supplement": the top 10 results each, with URL, type (publisher, brand or government), what it covers well and what it misses
   - 15–25 "People also ask" questions
   - related searches
   - the main YouTube, Shorts and TikTok topics
9. Community questions: recurring Reddit and forum questions and myths (r/Supplements, r/Nootropics, r/Biohackers and similar), popular stacks, timing and cycling, and what the evidence says about each.
10. Market (table): 10–15 leading products: brand, form, dose per serving, servings, price, $ per day, claims made, certifications (NSF, USP, IFOS, Informed Sport). Explain how doses are labelled (mg of extract vs active compound, CFU, %), and say where our product sits.
11. FAQ draft: 10–12 questions with short, cited answers in our voice: plain, a bit nerdy, honest.
12. Sources: a numbered list with full citations and PMID/DOI/URL.
```

### 14. Berberine
Save the result as `docs/research/berberine.md` (or send it to Claude).

```text
INGREDIENT: Berberine
For a guide and a possible product: studies use 500 mg 2–3× a day; Supliful's version is only about 146 mg a day.
FOCUS ON: Glucose, HbA1c and lipids meta-analyses; the "nature's Ozempic" claims vs evidence; GI side effects; interactions (CYP3A4/2D6, metformin, cyclosporine); dihydroberberine; pregnancy.

You are a research assistant for Noovit, a new US direct-to-consumer supplement brand. Our positioning is "evidence-graded": we only claim what human studies support, at the doses studied, and we say so plainly when evidence is weak, mixed or null. Research the ingredient below as sold in our product.

Rules
- Use primary and official sources: PubMed, Cochrane, ClinicalTrials.gov, NIH Office of Dietary Supplements, NCCIH, EFSA, Health Canada, FDA and FTC. Give a PMID, DOI or URL for every factual claim.
- Prefer human RCTs and meta-analyses. Label animal and in-vitro work clearly as such.
- Include null and negative trials, not only positive ones.
- Report what is current as of today. US spelling, no marketing language, Markdown with tables, cite claims as [n].

Deliver these sections
1. Summary (5 bullets): what it is; what it's best evidenced for; typical studied dose; main safety issue; bottom line for *our* dose.
2. Evidence by outcome (table): one row per outcome: number of RCTs, total participants, dose/form/duration ranges, effect vs placebo (with units and 95% CI where available), study quality, and an evidence grade:
   - Strong: meta-analysis or several good RCTs with a consistent effect
   - Moderate: several RCTs, mostly positive
   - Limited: few or small trials, or mixed results
   - Early: biomarker, animal or in-vitro only
   - Insufficient: trials found no clear effect
3. Key trials (the 5–8 most important): citation, design, n, population, dose and form, duration, and the primary result in numbers (means or % change for treatment vs placebo), enough to draw a simple bar chart.
4. Dose, form and timing:
   - studied doses, and how our dose compares
   - forms compared (absorption, tolerance, cost)
   - timing (with food? morning or evening?)
   - time to effect in trials, for a "what to expect" timeline: week 1–2, month 1, months 2–3
5. Official positions and limits: NIH ODS / NCCIH summaries, EFSA / Health Canada views, upper limits, regulatory status, FDA or FTC warnings, any country restrictions.
6. Safety:
   - common side effects (with rates)
   - serious adverse events and case reports
   - interactions: drug classes, examples and mechanism
   - contraindications; pregnancy and breastfeeding; children
   - finish with a plain-English warning block we can put on the label and product page
7. Claims we can make in the US: suggested structure/function claims supported at our dose, each with its grade and citation. List claims to avoid (disease claims, overstatements), and flag anything a regulatory lawyer should check.
8. Search landscape (US Google):
   - for "berberine", "berberine benefits", "berberine side effects", "berberine dosage" and "best berberine supplement": the top 10 results each, with URL, type (publisher, brand or government), what it covers well and what it misses
   - 15–25 "People also ask" questions
   - related searches
   - the main YouTube, Shorts and TikTok topics
9. Community questions: recurring Reddit and forum questions and myths (r/Supplements, r/Nootropics, r/Biohackers and similar), popular stacks, timing and cycling, and what the evidence says about each.
10. Market (table): 10–15 leading products: brand, form, dose per serving, servings, price, $ per day, claims made, certifications (NSF, USP, IFOS, Informed Sport). Explain how doses are labelled (mg of extract vs active compound, CFU, %), and say where our product sits.
11. FAQ draft: 10–12 questions with short, cited answers in our voice: plain, a bit nerdy, honest.
12. Sources: a numbered list with full citations and PMID/DOI/URL.
```

## What I do with each result
1. Product page: hero bullets, stat strip, "what to expect" timeline, research module (trial vs placebo chart), safety block, FAQs, all with citations.
2. Ingredient guide (`/guides/<name>`) with schema and sources, linked to the product, bundles and goal pages.
3. Label and claims check: flag anything for the regulatory lawyer.
