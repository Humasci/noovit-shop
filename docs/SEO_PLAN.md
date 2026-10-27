# Noovit: organic search plan

_28 Oct 2026. Based on the owner's review of the US results page for "nattokinase" and WebMD's page._

## What the results page for "nattokinase" shows us
The order is roughly:
1. Google Shopping ads
2. Short videos
3. AI Overview
4. People Also Ask (PAA)
5. NIH
6. WebMD
7. More short videos
8. Wikipedia
9. Amazon
10. Established supplement brands

| Result type | Who wins it | Can Noovit win it? | How |
|---|---|---|---|
| **Shopping ads** (paid) | Brands with products and a feed | **Yes, from day 1** | Our Google Merchant feed is ready. Free listings come first, then a small Shopping budget on proven products. Product pages default to one-time so prices match the feed. |
| **Short videos** (YouTube Shorts, TikTok) | Creators and brands | **Yes, quickly** | 30–60 s answers to one question each ("Can you take nattokinase with aspirin?"). Creators and dietitians via the affiliate programme. Shorts rank fast, even for new channels. |
| **AI Overview** | Cites pages with clear, sourced, direct answers | **Possible** | Each guide opens with a 2–3 sentence "In short" answer, with structured facts and numbered sources. |
| **People Also Ask** | Pages that answer the exact question in a short paragraph | **Yes, mid-term** | Guide FAQs mirror the PAA questions, each answered in 1–3 sentences right under the question. |
| **NIH, WebMD, Mayo, Wikipedia** | Huge-authority medical sites | **Not for the head term** at first | Google treats health as "Your Money or Your Life" (YMYL). Compete on long-tail questions and on depth where they are thin (see below). |
| **Amazon / big brands** | Product intent | **Later** | Amazon listing once lab testing is budgeted (see the Amazon notes). Brand strength builds over time. |

### Where WebMD is weak (our opening)
WebMD's nattokinase page (reviewed Jan 2025):
- has a "dosage" heading but **gives no dose**
- doesn't link claims to studies (the flight and Alzheimer's claims are unsourced)
- gives **no study sizes, lengths or results**
- has contradictory interaction advice
- offers **no guidance on choosing a product** (FU strength, testing, vitamin K2)

Our guide does all of these:
- dose in FU, with the source
- an evidence grade per benefit
- study sizes and results
- the null 3-year trial
- a clear "who should avoid it" box
- how to choose a product

That **information gain** is what helps a smaller site get cited and ranked.

## What we built
- **Ingredient guides** at `/guides/<ingredient>`. The first is `/guides/nattokinase`.
  - **Structure:** "In short" answer → quick facts → table of contents → what it is → benefits with **evidence grades** → dosage → side effects → interactions → who should avoid it → how to choose → FAQ → numbered sources → medical disclaimer.
  - **Schema:**
    - `MedicalWebPage`, with `about: DietarySupplement`, citations and `reviewedBy` once a reviewer exists
    - `FAQPage`
    - `BreadcrumbList`
  - **Sitemap:** guides are listed with `lastModified`.
  - **Linking:** a guide links to related products and goal pages, and product pages link back to their guide (`relatedProducts` in `lib/guides.ts`).
  - **Placeholder:** "Medically reviewed by…" shows as a placeholder until a real reviewer is added.
- **Shop by goal** pages (`/goals/sleep-stress` …) for category searches such as "supplements for sleep".

## The plan
1. **One guide per product ingredient** (magnesium, probiotics, collagen, glucosamine, turmeric, berberine, ashwagandha, vitamin D3 + K2, zinc, iron, biotin, creatine, lion's mane, black cohosh, NAC).
   - Target each keyword set: "[ingredient] benefits", "uses", "side effects", "dosage", "how much [ingredient] per day", "when to take [ingredient]", "[ingredient] vs [alternative]".
   - Each needs 6–10 sources (PubMed, NIH Office of Dietary Supplements fact sheets, NCCIH, Memorial Sloan Kettering).
2. **Medical reviewer (E-E-A-T, Google's "experience, expertise, authority, trust" test):** a named RD/RDN or MD reviews every guide. Their name, credentials and review date appear on the page and in the schema. This is the single biggest trust lever for health pages.
3. **Long-tail questions first** ("nattokinase and aspirin", "magnesium glycinate vs citrate for sleep", "can you take zinc and iron together"). These are winnable within months; head terms take years.
4. **A Short for every FAQ**, embedded on the guide and linking back to it.
5. **Internal links:**
   - guide → product → goal page → quiz
   - blog posts link to guides
6. **Google Merchant Center:** free listings now, plus a paid Shopping test once 3–5 products have reviews and steady margins.
7. **Refresh guides every 6–12 months.** Update `updated`, add new trials, and keep claims within FDA structure/function rules.

## Guardrails
- Inform, don't sell. No disease claims, and no "dissolves clots" or "lowers blood pressure" as product claims; research findings are described as findings, with sources.
- Grade evidence honestly and include null results. This builds trust and protects us legally.
- Never copy WebMD/NIH text. Summarise the primary studies in our own words.
