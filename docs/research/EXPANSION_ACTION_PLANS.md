# Expansion action plans: at-home tests for people and for pets (19 Nov 2026)

Built from the owner's Gemini conversation (19 Nov) plus our own checks: `LAB_TESTS_WHITE_LABEL.md`, `IHDLAB_ENQUIRY.md`,
`SPOT_ENQUIRY.md` and `NEW_CATEGORIES_WHITE_LABEL.md`. Gemini's vendor facts are **unverified** unless marked ✅.

## What we checked vs Gemini's claims
- ❌ "IHDLab offers omega-3": **not on its at-home or full menu** (checked 19 Nov). Magnesium is serum only.
- ✅ IHD Lab: white-label kits, its own 3PL and CLIA lab, ships to all 50 states. Prices and physician ordering are not stated.
- ✅ Spot: its own 50-state doctor network, custom panels, API. No public menu (call needed).
- ✅ imaware: a full platform (wearables, trends) with setup, monthly, per-user and kit fees, and about 8 weeks to integrate.
- New names to check: **Choose Health** (clinics/telehealth, 2–6 week launch, finger-prick or Tasso arm device), **My Labs Direct** (custom panels, branded kits), **Karpa Health** (white-label storefront, Tasso kits).
- Skip: **Ash** (built for health plans and public health), **Tempus** (genomics). **Junction** comes later (enterprise, 250 kits).
- ⚠️ Pets: **hair and saliva "sensitivity" tests** (Test My Pets, 5Strands, Glacier Peak) use bioresonance-style methods with no scientific validation. **Reject** them: they would break our evidence-led promise, the same reason we rejected IgG food tests for people.

---

# Plan A: People (now, alongside the supplement launch)

**Goal:** one branded at-home blood test that leads into our supplements, then a retest loop.

### Phase 0: quotes (this week, owner)
1. Send the **IHD Lab** and **Spot** enquiries (`docs/outreach/2026-11-19-at-home-test-enquiries.md`). Book Spot's call.
2. Send the same enquiry to **Choose Health** and **My Labs Direct** for two more prices. Karpa Health is optional.
3. Pick using these criteria, in order: all-in price per kit ≤ ~$50; doctor ordering included; states covered; sample-failure rate and free recollection; API or hosted portal; BAA signed.

### Phase 1: "Nutrient Check" kit (after the store is live and the vendor is chosen, ~4–8 weeks)
- **Panel:** vitamin D, ferritin, B12, magnesium (serum), folate. **Price:** $79–89 ($69 with a supplement subscription). Target ≥ ~$30 left per kit.
- **Build (Claude):**
  - product page and checkout
  - vendor API order on payment
  - results in the vendor's portal (we store no results at first)
  - no tracking pixels on test pages
  - state exclusions at checkout
- **Copy:** wellness screening only. A low result means "talk to your clinician", never "you need our product". Results link to education (guides), not straight to a cart.
- **Legal (owner + brief 02 lawyer):** review the copy, BAA and privacy policy (FTC Health Breach Notification Rule, Washington My Health My Data Act).

### Phase 2: "Baseline & retest" (3–4 months after Phase 1)
- **Bundle:** kit + a 3-month supplement subscription + an automatic retest at 90 days (discounted). Retention is the point.
- **Add-on:** omega-3 index through an **OmegaQuant** affiliate (no lab needed).

### Phase 3: more (only once Phase 2 works)
- **More panels:** heart and energy (hs-CRP, HbA1c, lipids/ApoB), thyroid, hormones.
- **Platform:** move to imaware or Junction only when volume justifies it.
- **Other options:** the sleep apnea test referral (Lofta), paid "Sleep Reset" program and personalised packs (see `NEW_CATEGORIES_WHITE_LABEL.md`).

**Rough cost to start:** $0 upfront with Spot's model; otherwise setup fees per quote. Development is ours.

---

# Plan B: Pets (later: after people products prove paid traffic converts)

**Reality check:** pets don't fit our current zero-stock model. Supplement makers need about 500 units per product, so we'd
carry stock in a 3PL. Pet supplements are also regulated as animal feed, which means state-by-state registration and NASC
standards. Never reuse human formulas (xylitol, vitamin D levels and some oils are dangerous for pets).

### Phase 0: demand check (cheap, owner)
1. **Market check (Claude, free):** pet teardown of search volume, Google Shopping and Amazon best-seller ranks for dog joint and gut chews (Zesty Paws, PetLab Co., Native Pet, Pawfectchew): prices, reviews, gaps.
2. **Ask our own customers (after launch):** one question in the post-purchase email or survey: "Do you have a dog or cat? Would you buy supplements for them from us?" Our existing customers are the real cross-sell audience.
3. Ask **Organic Pets Treats Inc.** (FL) whether it really has no minimum and can dropship. If yes, pets can start with no stock and no risk, and the demand check matters much less.

### Phase 1: supplements first, dogs first (if demand is there)
- **Products:** two dog soft chews, **Hip & Joint** (the biggest category) and **Gut/Probiotic**, from a NASC-audited maker (PetDine, Bimini, Pet Tech Labs, Zero Tolerance Labs; get quotes on stock formulas, ~500 units).
- **Budget:** roughly $3–6k stock, plus 3PL setup and state feed registrations (check costs per state).
- **Build (Claude):** pet competitor teardown, labels on the maker's tub, NASC-style label rules, feed-registration checklist.

### Phase 2: add the tests that hold up
| Category | Test | Partner to check | Verdict |
|---|---|---|---|
| Urinary/kidney | Litter or urine-pole wellness dipstick (pH, blood, protein, glucose) | Coastline Global/CheckUp, Abingdon Simply Test (OEM) | ✅ **Best first pet test:** cheap, instant, real chemistry. Any flag → "see your vet". Pairs with a cat urinary supplement |
| Joint/longevity | Cheek-swab DNA (breed + genetic health risks) | Orivet (white-label portal); Embark/Wisdom as affiliates | ✅ Fine as an affiliate first; white-label later |
| Gut | Stool microbiome/inflammation | Innovative Pet Lab, AnimalBiome | ⚠️ Later: evidence for acting on results is thin, as for people |
| Skin/allergy | Hair/saliva sensitivity | Test My Pets, 5Strands, Glacier Peak | ❌ **Reject** (not scientifically valid). Real allergy testing needs a vet blood draw |
| Biological age | Epigenetic swab | EpiPaws | ❌ Skip for now (weak evidence) |

- **Vet support:** add a "Talk to a vet" affiliate (Vetster, Pawp or Airvet) on the results pages.
- **Claims:** FDA CVM rules apply, so no "detects or treats". Use "supports urinary health", "wellness screen".

### Phase 3: cats and "more"
- **Cat products:** urinary and calming in cat-friendly formats (lickable paste, powder).
- **More:** smart collar or litter-monitor partnerships only once there's a customer base.

---

## Order of everything
1. Launch the human store.
2. People test quotes (now).
3. Nutrient Check kit.
4. Retest bundle.
5. Pets market check and customer question.
6. Dog chews.
7. Urine strips.
8. Cats.
