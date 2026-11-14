# Hiring a medical reviewer (RDN) — brief and job post

_14 Nov 2026. Goal: a named, credentialed Registered Dietitian Nutritionist (RD/RDN) who reviews Noovit's ingredient
guides and Journal posts before they go public, and whose name and credentials appear as "Medically reviewed by" on the
page and in the schema (`reviewer` in `lib/guides.ts`)._

## Where to find one (in order)
1. **Upwork** (fastest, pay per piece): post the job below; RD content reviewers there list roughly $60–125/hour, and
   supplement/fitness sites post review retainers of 4–6 articles a month.
2. **LinkedIn**: search "registered dietitian" + "freelance" / "content review" / "supplement"; message 10–15 people.
3. **Dietitian freelance writers' own sites**: many RDs who write for brands list "content review" as a service.
4. **Later, for the advisory panel**: FrontrowMD (clinician reviews), already in the TODO.

## Budget (recommendation)
- Start with a **paid trial**: 2 guides (magnesium, ashwagandha) at a fixed price per guide.
- Then a **monthly retainer** covering ~8 Journal posts + 1–2 guide refreshes. Expect roughly $300–800/month at
  the rates seen on Upwork; agree a fixed price per piece (guide vs post) so costs stay predictable.

## Vetting checklist (before hiring)
- **Credential:** RD or RDN (not "nutritionist", not DTR). Verify on the Commission on Dietetic Registration site
  (cdrnet.org → verify a credential): active status, expiry date.
- **State licence** (LD/LDN) where they practise, checked on the state board site. Nice to have, not required for
  content review.
- **Relevant experience:** supplements, sports nutrition (creatine), or integrative nutrition; comfortable reading trials
  and meta-analyses. Bonus: CISSN or CSSD.
- **Sample:** ask for one review they've done (redacted is fine).
- **Paid trial** on one guide before any retainer.

## Contract points (have the lawyer glance at it)
- Scope: review for scientific accuracy, safety and clarity; flag claims beyond structure/function. **Not** an
  endorsement of any product, and no product claims attributed to them.
- Attribution: "Medically reviewed by [Name], RDN" with review date on each page; their consent to name, credentials,
  photo and short bio.
- Paid relationship disclosed on the About/advisor page ("Paid advisor").
- Turnaround: within 5 business days per piece; Journal posts are scheduled, so give them the calendar.
- Liability: content review only, no individual advice; they keep their own professional liability cover.

## Job post (copy into Upwork)

**Title:** Registered Dietitian (RDN) to medically review supplement guides and blog posts — ongoing

**Description:**
Noovit is a new, evidence-led US supplement brand (magnesium glycinate, KSM-66 ashwagandha, creatine, lion's mane,
CoQ10, turmeric). We publish plain-English ingredient guides and blog posts that grade the evidence honestly, include
null results, and cite every source (PubMed, NIH ODS, NCCIH).

We're looking for a **Registered Dietitian Nutritionist (RD/RDN)** to review this content before it goes live and be
credited as the medical reviewer.

What you'll do:
- Review each piece for scientific accuracy, safety (interactions, who should avoid it) and clear, compliant wording
  (FDA structure/function language only).
- Check that claims match the cited sources; suggest edits as comments or tracked changes.
- Be credited as "Medically reviewed by [Name], RDN" with the review date.

Scope to start: a **paid trial of 2 guides** (about 2,500–4,000 words each, fully sourced). Then an ongoing retainer of
about **8 blog posts (900–1,300 words) and 1–2 guides a month**.

Requirements:
- Active RD/RDN credential (we verify with CDR). US-based preferred.
- Experience with supplements or sports nutrition; comfortable evaluating clinical trials and meta-analyses.
- Reliable 5-business-day turnaround.

Please include: your credential and CDR number or state licence, a sample of content you've reviewed or written, and your
rate per guide and per blog post.

## After hiring
- Add them in `lib/guides.ts` (`reviewer: { name, credentials, ... }`) and the About/advisors section; this replaces the
  "Medically reviewed by" placeholder.
- Share the Journal calendar (`docs/CONTENT_PLAN.md`) and the post files (`content/journal/`).
