# Spot (spotdx.com): at-home tests for Noovit (review + draft enquiry, 19 Nov 2026)

Source: https://docs.spotdx.com/docs/introduction, concepts, quickstart, integrations, requisitions (read 19 Nov). No contact made.

## What Spot is
A white-label at-home testing company: blood, urine or saliva kits that customers collect at home and post to a partner
lab. Spot provides:
- Branded kits and packaging, and a branded results portal (on our site or hosted by Spot)
- Fulfilment and shipping
- **Its own physician network, "licensed in all 50 states"**
- Customer phone and SMS support
- Free problem resolution: reshipping, new kits, help with recollection

**Pricing:** "no upfront costs", "usage-based pricing". No figures published.

## Fit for Noovit
**Good**
- Doctors are included, which is the legal gap IHD Lab didn't answer.
- Panels are custom ("If you want to test it, we'll build it").
- Collection by blood-spot card (Whatman 903, ADx100, HemaSpot) or Microtainer, and one kit can combine formats.
- Clean API: `POST /api/v2/orders/` plus status webhooks, an OpenAPI spec, and ready guides for Shopify and WooCommerce. A Stripe-paid order on our site can create a Spot order.

**Unknown**
- Test menu (none published), so we must ask whether vitamin D, ferritin, B12, magnesium and folate are possible.
- Which partner labs (CLIA/CAP), and which states are excluded (the docs mention exclusion checks by age, sex and location).
- Per-kit price and any minimum. No sandbox mentioned.

## IHD Lab vs Spot (so far)
| | IHD Lab | Spot |
|---|---|---|
| Lab | Own CLIA lab (CA), NY/MD licences | Partner labs (not named) |
| Doctors | Not stated | Own 50-state network |
| Menu | 68 at-home tests published (serum Mg) | Custom, not published |
| Collection for our panel | Microtainer | Blood-spot card or Microtainer |
| Integration | LabFlow API or portal | REST API v2 + webhooks, Shopify guide |
| Price / minimum | Not published / none stated | "No upfront cost", usage-based / not stated |

Send both enquiries and compare per-kit cost, doctor ordering, states and sample-failure rates.

## Draft enquiry (owner sends to hello@spotkits.com, or books a call: https://calendly.com/jajack/30minutes)
> Hello, we're a US direct-to-consumer supplement brand. We'd like to offer a white-label at-home test kit, ordered and paid for on our own website (Next.js + Stripe), with results in a branded portal.
> Proposed panel: vitamin D 25-OH, ferritin, vitamin B12, magnesium and folate, ideally on one blood-spot card or a single Microtainer.
> Questions:
> 1. Can you build this panel? Which collection method, and which partner labs run it (CLIA/CAP)? Is magnesium serum, whole blood or RBC?
> 2. Per-kit price at under 250 kits a month (kit, both-way shipping, lab, physician review, portal). Any setup or monthly fees or minimum order?
> 3. Your physician network orders and reviews each test: which states can we sell in (NY, NJ, RI, MD)?
> 4. Sample failure rate and what happens on a failed sample (free recollection?).
> 5. API: v1 or v2 for new integrations? Is there a sandbox? Can we hold results only in your hosted portal at first?
> 6. Will you sign a BAA? Who is the named kit manufacturer for FDA purposes?
> Thank you.

## Call script (Spot publishes no kit list, so the first step is a 30-minute call)
Book: https://calendly.com/jajack/30minutes. Have this page open and take notes in the boxes.

**Introduce us (30 seconds)**
"US direct-to-consumer supplement brand, launching now. We want one branded at-home kit sold on our site, starting small (under 250 kits a month)."

**Must-answer questions, in order**
1. **Menu:** "Which ready-made panels or kits do you already run? Can you send the list?" Then: "Can you do vitamin D, ferritin, B12, magnesium and folate on one collection?"
   - Answer: ______
2. **Collection:** blood-spot card or Microtainer? Is magnesium serum, whole blood or RBC?
   - Answer: ______
3. **Price:** per kit, all-in (kit, both-way shipping, lab, doctor, portal). Any setup or monthly fee? Any minimum?
   - Answer: ______ (we need about $50 or less to sell at $79–89)
4. **Doctors and states:** your network orders every test? Which states are excluded?
   - Answer: ______
5. **Failed samples:** rate, and is recollection free?
   - Answer: ______
6. **Labs:** which labs, and are they CLIA/CAP?
   - Answer: ______
7. **Tech:** API v2, sandbox, can results live in your hosted portal at first? Time to launch?
   - Answer: ______
8. **Data:** will you sign a BAA? Who is the kit manufacturer for FDA purposes?
   - Answer: ______

**Ask them to email:** the price sheet, the panel list, a sample kit and a sample results report.

**Don't share yet:** customer data, revenue figures or bank details. No signing on the call.
