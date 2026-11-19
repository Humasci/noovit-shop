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
