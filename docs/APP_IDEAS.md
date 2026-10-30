# App ideas

_Brainstorm, 29 Oct 2026. Nothing here is scheduled yet. Two tracks: **(1) Noovit-branded** tools that sell and retain,
and **(2) unbranded apps** in the same vertical, published by Noovit LLC as separate products with no link to the shop._

The niche has one big problem worth building for: **people stop taking supplements before they could notice anything**
(results take 4–8 weeks). Apps that help people choose well, take things consistently and see change are useful on their
own, whether or not they sell anything.

> **Parked (30 Oct).** The owner isn't pursuing this now. If an app happens, it will most likely be **pet-focused**
> (see #6 Pawdose below: meds, supplements and vet reminders; low regulatory risk, no human health data).

---

## Track 1: Noovit-branded (later; supports the shop)

| Idea | What it does | Why |
|---|---|---|
| **Noovit Daily** (companion web app) | Scan the bottle QR → your products and doses load; reminders ("Magnesium: 3 after dinner"); streaks; "≈6 days left, next box ships Tue" with skip/delay in one tap; 10-second check-ins (sleep, stress, focus, energy, 1–5) and a trend after 4–8 weeks | Protects subscription revenue: measure month-3 churn for users vs non-users |
| **Label checker** (free tool on noovit.com) | Type or snap any supplement label → each dose next to the dose used in research | SEO and email sign-ups; rewards brands that show doses (we do) |
| **Interaction and timing checker** (free tool) | Your meds and supplements → known flags + a daily schedule (with food, evening, etc.) | High-intent searches; reuses our guides |

Build order if we go ahead: Noovit Daily as an installable web app (PWA, no App Store fees or review) → Label checker →
native app only with a few hundred active subscribers.

---

## Track 2: unbranded apps distributed by Noovit LLC (the owner's focus)

### Why do it
- **Separate revenue** (app subscriptions) that doesn't depend on supplement ad rules or one supplier.
- **Audience and insight:** what people take, at what doses, what they struggle with. Useful for product decisions, as
  aggregate, anonymous insight only (see the privacy rules below).
- **Shared know-how:** our dose research, ingredient guides and quiz logic are the hard part of several of these apps.
- **Optionality:** an app that grows can be sold on its own; one that doesn't is a cheap experiment.

### The ideas

Scored 1–5 (5 = best). **Demand** = people already search app stores for it. **Edge** = what we can do better than
existing apps. **Risk** = regulatory/privacy exposure (5 = low risk).

| # | App (working name) | What it does | Demand | Edge | Effort | Risk | Notes |
|---|---|---|---|---|---|---|---|
| 1 | **Stack tracker + dose check** ("Dosewise") | Log your supplements (barcode scan), reminders, refill countdown, and a **dose verdict** per ingredient: below / within / above the range used in research; flags proprietary blends | 4 | **5** | 3 | 4 | Barcode → **NIH Dietary Supplement Label Database (DSLD)**, free API with well over 100k US labels. Existing trackers log; few judge doses. Our research is the moat |
| 2 | **Caffeine tracker** ("Cutoff") | Log coffee/energy drinks/pre-workout; caffeine-in-body curve; "sleep-safe after 9:40 pm" | 4 | 3 | **1** | **5** | Small, proven niche, quick to ship; great first app to learn the store process |
| 3 | **Self-experiment app** ("Trial of One") | Pick something to test (a supplement, cutting caffeine, earlier bedtime) → baseline week → test weeks → daily 1–5 ratings → a plain-English result with honest uncertainty | 3 | **5** | 2 | 5 | Nerdy, on-trend (biohacking, N-of-1), shareable result cards; nobody does this simply |
| 4 | **Sleep diary + wind-down** ("Lights") | Two-tap sleep diary, wind-down routine, breathing timer, optional Apple Health / Health Connect sleep import | 4 | 2 | 3 | 4 | Crowded (Calm, Headspace, sleep trackers); win only with a narrow angle. No insomnia-treatment claims |
| 5 | **Gym supplements and hydration** ("Load") | Creatine streak, protein and water targets, pre-workout caffeine | 3 | 3 | 1 | 5 | Simple; could be a mode of #1 instead of its own app |
| 6 | **Pet meds and supplements reminder** ("Pawdose") | Flea/tick, worming, joint chews, vet visits, weight log; several pets | 4 | 3 | 2 | **5** | Pet owners pay for reminders; low regulatory risk (no human health data) |
| 7 | **Focus timer + nootropics log** ("Deep") | Pomodoro sessions; log what you took and how the session felt; weekly patterns | 3 | 3 | 2 | 5 | Fits the nootropics crowd; overlaps with #3 |
| 8 | **Lab results tracker** ("Markers") | Enter vitamin D, ferritin, B12, etc.; trends against reference ranges | 3 | 3 | 3 | **2** | Closer to medical-device territory; interpretation must stay neutral. Later, with legal advice |

**Recommendation:** start with **#2 Cutoff** (one to two weeks; learn publishing, store listing and paywalls on a small,
safe app), then build **#1 Dosewise** as the flagship (biggest edge, uses our research). Keep **#3 Trial of One** as
the third app, or as a feature inside Dosewise if it tests well.

### How to build several apps cheaply
- **One shared core:** login (optional), local-first logging, reminders, charts, paywall, analytics. Each app is a thin
  layer on top.
- **Stack:** Expo / React Native (TypeScript, same language as the shop) for iOS and Android; RevenueCat for
  subscriptions; Supabase only where sync is needed. Keep data on the device by default; it's simpler for privacy.
- **Validate before building:** check App Store search suggestions and keyword tools for demand; read competitors'
  1–2★ reviews for gaps; a one-page waitlist per idea.
- **Pricing pattern:** free core, paid tier ≈ $3–6/month or $20–40/year (history, insights, export, widgets).

### Publishing (unbranded, but Noovit LLC is the publisher)
- **The store shows the developer name.** Publishing as "Noovit LLC" is visible but neutral (no shop link needed). If
  even the name should be separate, use a DBA or a second entity later.
- **Apple Developer Program:** $99/year; an organisation account needs a **D-U-N-S number** for Noovit LLC (free, takes
  days to weeks); do it after the LLC and EIN.
- **Google Play:** one-off $25; organisation verification. Organisation accounts avoid the closed-testing requirement
  that new personal accounts face before going live.
- **Health-app store rules:** Apple requires accuracy and disclosure for health features and forbids using HealthKit
  data for advertising; Google Play asks health apps to complete a health declaration. Check both at submission.

### Rules that apply to every app (non-negotiable)
- **Wellness, not medicine:** tracking, reminders, education and general ranges are fine. Diagnosing, or telling people
  to treat a condition, can make the software a medical device (FDA). Dose verdicts compare to research ranges and say
  "talk to your doctor"; they never recommend treatment.
- **No disease claims** in listings or in-app copy.
- **Health-data privacy:**
  - FTC Health Breach Notification Rule: a leak means notifying users.
  - Washington's My Health My Data Act, plus Nevada and Connecticut: separate opt-in consent for consumer health data.
  - UK/EU users: GDPR special-category data.
  - Collect the minimum, keep it on the device where possible, never sell it or pass it to ad platforms.
- **No hidden funnel to Noovit:** using app users' health data to market Noovit products would breach those laws and the
  store rules. Any cross-promotion must be clearly disclosed and opt-in. Aggregate, anonymous insights for product
  decisions are fine if the privacy policy says so.
- **Data sources:** DSLD (public domain, NIH); NIH Office of Dietary Supplements fact sheets for dose ranges, cited in
  the app. Licensed interaction databases are expensive: avoid interaction checking in v1.

### Open questions for the owner
1. Same publisher name (Noovit LLC) or a separate DBA for the apps?
2. Which first: Cutoff (fast, safe) or straight to Dosewise (flagship)?
3. Budget: Apple $99/yr + Google $25 + RevenueCat (free tier for small apps; check current pricing) + design time.
4. Mock-ups first? (Two or three screens per app at phone size.)
