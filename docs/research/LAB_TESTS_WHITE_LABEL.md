# White-label at-home lab tests (research, 19 Nov 2026)

Web research only; no vendor contacted. "Not found" = no public source. Few vendors publish B2B prices; costs marked as
estimates are ours.

## Key findings
- No vendor publishes a wholesale per-kit price for a small custom panel. SiPhox comes closest (30-kit minimum,
  wholesale "40–60% below" its $99–149 retail); Junction prices per marker via API but only on Enterprise contracts.
- **RBC magnesium from a finger-prick is doubtful**: home kits usually measure serum; RBC needs a venous draw. ZRT's
  dried-blood-spot panel offers whole-blood magnesium. Launch without magnesium or label it honestly (whole-blood/serum).
- No ready-made kit found with vitamin D + ferritin + B12 + magnesium and low minimums; Spot builds custom panels with no
  upfront cost (menu not public).
- Regulatory risk sits mostly with the kit vendor; Noovit carries advertising (FTC) and data-breach (FTC HBNR) risk.
  NY, NJ, RI effectively off-limits for mail-order kits.

## Comparison
| Provider | Model | Relevant tests | Collection | Physician network / excluded states | Labs | Pricing | Minimums | Integration | Tiny-brand fit |
|---|---|---|---|---|---|---|---|---|---|
| **Spot** (spotdx.com) | API + white-label kits + branded portal | Custom panels on request (menu not public) | Blood cards (Whatman 903, ADx100, HemaSpot), microtainer, urine, saliva | Own network, 50 states / not found | "Partner labs" (CLIA/CAP not stated) | No upfront cost, usage-based; no figures | Not found | Public API + webhooks; Shopify/Woo/Wix/Squarespace | **High** |
| **SiPhox Health** partner | White/gray-label kits + dashboard + API | Vit D, ferritin, iron, HbA1c, Free T4; no Mg/B12/omega-3 on ready panels | EasyDraw upper-arm device, DBS | Physician oversight, "50 states" / consumer policy excludes HI, NY | CLIA + CAP | Retail $99–149; wholesale 40–60% below | 30 kits; gray label 100; white label/custom 500 | API or dashboard | Medium–high |
| **Junction** (ex-Vital) | Lab API: kits, home phlebotomy, Quest/Labcorp walk-in | Full lab menus incl. serum + RBC Mg (venous) | DBS, saliva, phlebotomy, walk-in | Own/your/mixed network / NY, NJ walk-in only via BioReference | CLIA + CAP | Enterprise custom; Launch plan $300/mo has no labs | 250 kits | Full public API, 4–6 wk setup | Low–medium |
| **imaware** | White-label platform + API | Vit D (finger-prick), thyroid, diabetes, heart | Finger-prick, in-lab | Included every state / not in NY | CLIA + CAP | Setup + monthly + per-user + kit fees (no figures) | Not found | API, ~8 wk | Low |
| **LetsGetChecked / Truepill** | Co-branded B2B for employers, plans | Not found | At-home kits | Not found | Not found | Not found | Not found | Public dev docs | Low |
| **Everlywell / Everly Health** | Enterprise co-brand | Vit D, Mg (type?), ferritin, B12, hs-CRP | Finger-prick, in-lab | Nationwide / Everywhere excludes NY, NJ, RI | CLIA + CAP | Not published | Not found | Gated | Low |
| **ixlayer** | White-label platform for biopharma | Not found | Labs, kits, mobile | Via telehealth partners | Partner labs | Not found | Not found | Not found | Very low |
| **IHD Lab** (ihdlab.com, added 19 Nov from the owner) | White-label kits + branded results portal or API ("LabFlow"); kit triggered by an order on our site | 250+ markers: vitamins, iron panel, omega-3, lipids, HbA1c, CRP, hormones, thyroid, liver/kidney | Home collection, return shipping included | Not stated; **holds NY and MD licences** (rare) | Own lab: CLIA 05D2040304, CA licence, FDA-registered (FEI 3011213917); ISO 17025 not stated | Not published | None stated (volume tiers start "under 250 kits/month") | API or portal | **High: ask alongside Spot** |
| **OmegaQuant** | Affiliate, wholesale, co-brand, white-label API, private label | **Omega-3 index**, vit D | Finger-prick | Not found | CLIA high-complexity | Basic retail $49.95–54.95; affiliate ≥8% (10–20% by tier on one page) | Not found | API | **High as add-on** |
| **Choose Health** | Private-label DBS kits for supplement brands | 28+ markers (not itemised) | Finger-prick DBS | Requisitions handled | Not found | Not found | Not found | Not found | Medium (ask) |
| Rupa → Fullscript | Practitioner ordering | Full | Mixed | Needs practitioner licence | Varies | — | Practitioner account | Rupa closes 20 Jan 2027 | Not suitable |
| Quest / Labcorp OnDemand | Consumer stores, affiliate only | Quest Mg + B12 + iron + ferritin $85 + $6 | In-lab (Quest home draw +$99) | Built in / Quest not AZ, HI, PR | CLIA/CAP | Affiliate ~10% / ~12% (aggregators) | None | Affiliate links | Referral fallback |

## Regulatory basics (US, Nov 2026)
- **Physician order** needed in most states; every white-label vendor supplies its network. New York generally bans
  direct-access testing (AG settlements). NJ and RI need in-person orders per vendors; Maryland unclear. Exclude NY, NJ,
  RI at checkout (and HI for SiPhox). NY/NJ also require pass-through pricing (Junction).
- **HIPAA**: a supplement brand selling cash-pay kits is normally not a covered entity; the lab and physicians are. Let
  the vendor hold results in its portal at launch.
- **FTC Health Breach Notification Rule** (amended, effective 29 Jul 2024) applies if Noovit stores results or test data,
  including leaks via tracking pixels: keep GTM off any results or registration pages.
- **FTC claims** (Health Products Compliance Guidance, Dec 2022) cover diagnostic tests: no unsupported accuracy claims;
  don't present a low result as proof the customer needs a Noovit product; refer low results to a clinician.
- **FDA**: the LDT rule was vacated (31 Mar 2025) and rescinded (Sept 2025); labs stay under CLIA/CMS. FDA still asserts
  authority over home collection kits (warning letters on unauthorised DBS kits, Oct 2024, Feb 2026, both HIV). Ask the
  vendor for the kit's FDA status and who is named as manufacturer; relabelling can create labeller obligations.

## Recommendation
1. **Spot**: primary. No upfront cost, custom panel and fully branded kit/portal, 50-state physicians, public API that fits
   our Stripe webhook. Confirm: menu for vit D / ferritin / B12 / Mg (type), CLIA/CAP labs, BAA, per-kit price, minimum.
- **imaware** (owner note, 19 Nov): the most complete platform (200+ biomarkers, white-label portal with wearable data, trends over time, tailored content). Costs: setup + monthly + per-user + kit fees (no figures) and ~8 weeks to integrate, so better as the step up once kit volume is proven. Ask for a quote with the others.
- **IHD Lab** (added 19 Nov): ask at the same time as Spot. Own CLIA lab, API, no stated minimum, and NY/MD licences (may open states others exclude). Confirm per-kit price, physician ordering, which states, vitamin D/ferritin/B12/Mg (type) panel, BAA.
2. **SiPhox**: fallback with the lowest proven commitment (30 kits, ~1 week onboarding, CLIA/CAP, fulfilment, BAA). Launch
   with its ready Core Health panel (vit D, ferritin, HbA1c, lipids/ApoB); custom panels need 500 kits.
- Add-on: **OmegaQuant** affiliate now (omega-3 index), co-brand later. **Junction** once volume justifies 250 kits or
  venous RBC magnesium is needed.
- **Estimate** (no published per-kit cost): ~$35–70 delivered per kit (kit, two-way shipping, lab, physician); retail
  $79–99 (or $69 with a subscription). Benchmarks: Everlywell vit D $49; imaware vit D $79; Quest 4-marker $91 in-lab.
  At $89 retail and $50 cost, ~$35 left per kit after card fees. Get a real quote first.

## Sources
Spot: https://docs.spotdx.com/ · https://docs.spotdx.com/docs/integrations.md · https://www.spotdx.com/ ·
SiPhox: https://siphoxhealth.com/partner · https://siphoxhealth.com/partner/test-panels ·
https://siphoxhealth.com/policies/state-coverage ·
Junction: https://www.junction.com/pricing · https://docs.junction.com/lab/overview/physicians.md ·
https://docs.junction.com/lab/overview/order-pricing.md · https://www.junction.com/post/lab-testing-new-york-new-jersey ·
imaware: https://imaware.health/wellness-solutions ·
LetsGetChecked/Truepill: https://www.businesswire.com/news/home/20241001340533/en · https://www.letsgetchecked.com/for-businesses/ ·
Everlywell: https://www.everlywell.com/enterprise/partners · https://www.everlywell.com/everywhere/ ·
ixlayer: https://ixlayer.com/ · OmegaQuant: https://omegaquant.com/work-with-us-brands/ · https://omegaquant.com/affiliate-agreement/ ·
Choose Health: https://prnewswire.com/news-releases/choose-health-expands-testing-platform-with-private-label-at-home-blood-tests-301774534.html ·
Fullscript: https://support.fullscript.com/articles/moving-from-rupa-to-fullscript-lab-ordering-access-and-the-authorization-network/ ·
Quest: https://www.questhealth.com/product/magnesium-vitamin-b12-iron-ferritin-test-panel-13926.html ·
Magnesium: https://www.zrtlab.com/sample-types/blood/ · https://www.hims.com/labs/biomarkers/rbc-magnesium ·
Regulatory: https://oig.hhs.gov/fraud/enforcement/ag-schneiderman-announces-settlements-to-stop-prohibited-direct-access-testing ·
https://www.ftc.gov/business-guidance/blog/2024/04/updated-ftc-health-breach-notification-rule-puts-new-provisions-place-protect-users-health-apps ·
https://www.ftc.gov/system/files/ftc_gov/pdf/Health-Products-Compliance-Guidance.pdf ·
https://www.cap.org/advocacy/latest-news-and-practice-data/fda-ldt-rule-rescinded ·
https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/prodx-health-720762-02102026
