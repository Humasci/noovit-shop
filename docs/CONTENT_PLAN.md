# Noovit — launch content plan (blog, social, SEO)

_7 Nov 2026. Builds on `SEO_PLAN.md` (strategy), `SOCIAL_PLAN.md` (channels, formats, compliance) and
`CONTENT_GUIDELINES.md` (voice, templates, claims). This file is the "what to publish first, and in what order"._

## 1. How the pieces fit
- **Guides** (`/guides/<ingredient>`) are the evergreen pillars: one per ingredient, evidence-graded. 10 are live.
- **Journal posts** (`/blog/<slug>`, written in Admin → Blog) are the cluster around each pillar: comparisons, timing,
  "can I take X with Y", myth-busting, label explainers. Each one answers one search question, links to its guide and
  the matching product, and is short (800–1,500 words).
- **Social** turns every guide and post into a pack (videos, carousels, pins), each linking back with UTM tags.
- Every post follows the guide rules: sources opened and verified, structure/function wording, null results included,
  medical reviewer before it goes live.

## 2. The first 12 Journal posts (in this order)
Chosen for: (a) they sell our core range, (b) long-tail questions a new site can rank for within months, (c) we
already have the verified research in the guides, so they are fast to write. Demand is my estimate; confirm in Google
Search Console after launch (and the free Keyword Planner if you open a Google Ads account).

| # | Working title | Main search question | Est. demand | Links to |
|---|---|---|---|---|
| 1 | Can you take magnesium and ashwagandha together? | magnesium and ashwagandha together | Medium | Sleep & Calm Stack, both guides |
| 2 | Magnesium glycinate vs citrate vs oxide: which form for what | magnesium glycinate vs citrate | High | Magnesium Sleep+, magnesium guide |
| 3 | How long does ashwagandha take to work? What the trials measured | how long does ashwagandha take to work | High | Ashwagandha Calm+, guide |
| 4 | Do you need a creatine loading phase? | creatine loading phase | High | Creatine, guide |
| 5 | Does creatine cause hair loss? The one study behind the claim | creatine hair loss | High | Creatine, guide |
| 6 | Creatine for women: what the research shows | creatine for women | High | Creatine, guide |
| 7 | When to take magnesium for sleep, and how much | when to take magnesium for sleep | Medium | Magnesium Sleep+, guide |
| 8 | Lion's mane: fruiting body vs mycelium, and how to read the label | lion's mane fruiting body vs mycelium | Medium | Lion's Mane, guide (stay neutral: we sell both in one) |
| 9 | KSM-66 vs Sensoril: what's the difference? | ksm-66 vs sensoril | Medium | Ashwagandha Calm+, guide |
| 10 | Ubiquinol vs ubiquinone (CoQ10): does the form matter? | ubiquinol vs ubiquinone | Medium | CoQ10, guide |
| 11 | Turmeric vs curcumin: what's on the label and why it matters | turmeric vs curcumin | Medium | Turmeric Complex, guide |
| 12 | How to read a Supplement Facts label (elemental dose, % DV, blends) | how to read supplement facts label | Medium | Every product; our "dose on the front" story |

Later batch: "How long does lion's mane take to work?", "CoQ10 and statins: what the research says" (needs the
reviewer, drug topic), "Is creatine safe for your kidneys?", "Magnesium for muscle cramps: the evidence", "Why we print
the dose on the front of the bottle" (brand story).

**Pace:** 2 posts a week from launch → all 12 in 6 weeks. Each one feeds a social pack (section 3).

## 3. Social: the first 4 weeks
Start **before launch**: post to build the waitlist (`/coming-soon`), so day one has an audience. Instagram + TikTok
first, Pinterest for guides (it behaves like a search engine). Assets already made are in `design/social/`.

| Week | Feed posts (3/week) | Stories / video |
|---|---|---|
| Pre-launch 1 | Brand intro (the dose on the front) · `evidence-ashwagandha` · `infographic-magnesium` (carousel, one slide per panel) | `story-evidence` · "launching soon, join the list" |
| Pre-launch 2 | `dose-creatine` · `molecule-turmeric` · `infographic-creatine` (carousel) | `story-ask-ai` · founder "why Noovit" video (owner on camera) |
| Launch week | Launch post (the core range) · `evidence-magnesium` · `infographic-ashwagandha` (carousel, keep the safety slide) | Launch-offer stories · first unboxing |
| Week 4 | Post 1 + 2 summaries as carousels · `dose-ashwagandha` · `infographic-coq10` (carousel) | 2–3 short videos from the posts' FAQs |

**Carousel rule:** split each infographic into a cover + one slide per panel, big text. The full 1800 × 1200 image is for
guide pages and Pinterest, not the Instagram feed.

**Still to make:** carousel versions of the infographics, a brand-intro post, launch post, lion's mane assets (once it
is active in the shop).

## 4. SEO: what changed on 7 Nov, and the launch-day checklist
**Fixed in code (7 Nov):**
- Product pages lead with what people search for: "Magnesium Glycinate 275 mg — Magnesium Sleep+ | Noovit" instead of
  "Magnesium Sleep+ — Noovit" (`lib/seo.ts`; anything typed in Admin's SEO fields still wins).
- Site title and description match the evidence-led core range (they still listed gut, joints and skin).
- A default share image (`app/opengraph-image.png`) for every page without its own: home, shop, goals and About
  previously showed a blank card when shared.
- Guide share images moved to the science palette; policy pages got real descriptions; US spelling in product copy
  (live DB: `supabase/manual/2026-11-07-us-spelling.sql`).

**Already in good shape:** every page has a canonical URL, one H1, a sitemap entry; guides carry MedicalWebPage, FAQ
and breadcrumb schema; products carry Product and breadcrumb schema; decorative images have empty alt text.

**Launch day (owner):**
1. Vercel: `SITE_LIVE=true` and `NEXT_PUBLIC_SITE_URL=https://noovit.com`, then **redeploy** (the noindex header is set at
   build time, so changing the variable without a redeploy keeps the site hidden from Google).
2. Google Search Console: verify (Admin → Settings → Google site verification), submit `https://noovit.com/sitemap.xml`.
3. Merchant Center: free listings (feeds already built).
4. Check Lion's Mane and CoQ10 are **active** in Admin → Products. The seed data still has them hidden and no SQL file
   switches them on, so the hero product may not be live.
5. Medical reviewer: add the name and credentials to the guides. This is the biggest trust signal for health pages
   (Google's E-E-A-T), and "reviewed by" currently shows a placeholder.

**After launch:** watch Search Console weekly for the questions people find us with, and write posts for those; link
each new post from its guide; refresh guides every 6–12 months.
