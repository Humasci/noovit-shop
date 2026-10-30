# Brief: evidence-graded ingredient guide for Noovit (US supplement brand)

Output: ONE TypeScript object literal matching the `Guide` interface in `lib/guides.ts`,
then merged into `GUIDES` in `lib/guides.ts`. (Used on 30 Oct 2026 to brief research agents; reuse it for new guides.)

Read first, and match exactly in style and structure:
- `lib/guides.ts`: the interface and the three finished guides (nattokinase, ashwagandha,
  glp-1-nutrition). Plain words, short sentences, numbers with units, citations as [1], [2] (1-based into `sources`).
- `docs/CONTENT_GUIDELINES.md` section 4 (ingredient guide template).
- `docs/research/COMPETITORS_CORE5.md` for market context only (never cite it).
- `data/products.ts` for our product's formula if a product slug is given (never mention Noovit in the body).
- `lib/goals.ts` for valid `relatedGoals` slugs.

Content: what it is (forms, units, food sources, common confusions); benefits as cards with honest evidence grades
(Moderate = several good human RCTs/meta-analyses; Limited = few/small/mixed; Early = lab/biomarker; Insufficient = trials
found no effect), each with design, n, dose, duration and effect size with units, including null or mixed results;
dosage (study doses, timing, food, time to effect, upper limits from NIH ODS where they exist); forms compared where relevant;
side effects; interactions (drug classes with examples); who should avoid it; how to choose a supplement (label red flags,
testing); 6–8 People-Also-Ask FAQs answered first in 1–3 sentences. `published`/`updated`: '2026-10-30'. No `reviewer`.
`metaTitle` ≤ 60 chars; `metaDescription` 140–160 chars.

Rules:
- Every source must be real and verified: open each URL (WebFetch, or search when blocked) and confirm title and numbers.
  Prefer PubMed/PMC/DOI, meta-analyses, NIH ODS, NCCIH, LiverTox, EFSA, FDA, Health Canada. Never invent a study, number
  or URL; leave out what you can't verify.
- FDA structure/function language only: never say it treats, cures or prevents a disease ("lowered X in a trial").
  Don't mention Noovit or its products in the body. US spelling.
- Complete, not padded (the existing guides are the length benchmark).

When done, reply with: the file path, the sources with one line each on what they support, and what you left out
because you couldn't verify it. Also confirm it type-checks against `Guide` (e.g. a temp file in the scratchpad that imports
the type from lib/guides.ts and runs `npx tsc --noEmit` from /home/user/noovit-shop with that file,
then delete the temp file).
