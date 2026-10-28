# Noovit: US Supplement Supplier Research

*Researched 26–27 Oct 2026 using web search and suppliers' own pages. Nobody was contacted, and no accounts were created or forms submitted.*

**How to read the confidence labels:**
- **Verified** means it was read on the supplier's own page during this research.
- **Third-party** means it comes from a review site or directory.
- **Unverified / estimate** means it is my inference or a calculation. Confirm it before relying on it.

Most suppliers in this space only show unit prices after login or in a quote. **No per-unit product price could be verified for any dropship supplier.** Every landed-cost figure below is therefore an estimate, and a quote is needed to firm it up.

---

## 1. Summary comparison

Coverage counts are for our 23 launch products: **Y** = yes, **~** = close substitute, **N** = no / not found.

| Supplier | Model | MOQ / fees | Coverage (Y / ~ / N) | Est. landed cost per bottle | Non-Shopify integration | Compliance (as claimed) | Verdict |
|---|---|---|---|---|---|---|---|
| **Supliful** (shortlist) | No-MOQ print-on-demand dropship platform | No MOQ. Free plan, Pro $69/mo (Shopify listing). Samples at base price, max 3 units/product. Label design $149 one-time (third-party) | 8 / 6 / 9 (no pets) | ~$15–20 (unverified: $12 example base + shipping) | **No public API.** Options are manual orders in the portal, or Shopify Admin API as a "headless" backend (needs a Shopify store plus Pro) | "FDA-registered, GMP-compliant facilities", US-made, COAs (third-party) | **Fallback / benchmark.** Most proven, but Shopify-centric and probably above the cost target |
| **HoneyComm / Private Label Supplements** (shortlist) | Was a no-MOQ dropship platform | n/a | n/a | n/a | n/a | n/a | **Do not proceed.** Domains are parked or for sale and the app has been delisted (see §2.2) |
| **Nutra Group LLC** (shortlist) | Low-MOQ private label with dropship/fulfilment | MOQ stated as 24, 72 or 1,000 depending on page. $125 label design. Free US shipping over $500 | Not verifiable. Claims 300+ stock formulas | Unknown | "Complete integration" claimed, no detail | No verifiable certification details | **Hold.** The site was unreachable from our side; get a price list and certificates first |
| **On Demand Fulfillment (ODF)**, West Jordan UT | No-MOQ white-label dropship ("start with 1") | No MOQ. Fees not published. Weekly invoicing | **10 / 3 / 10** (no pets) | Unknown. Likely cheaper than Supliful if it is the same source (inference) | **"API integration"** via its inventory/shipping software. Walmart, Amazon, eBay and Shopify are mentioned | "FDA compliant, Utah organic-certified, cGMP-registered facility" (no documents published) | **Top dropship candidate.** Request samples and API docs. Verify quality and reputation |
| **Professional Nutritionals**, Tampa FL (est. 1999) | No-MOQ private label ("minimum is one bottle") plus dropship | 1 bottle on 170+ stock formulas. $250 label template | 9 / 7 / 7 (no pets) | Unknown (practitioner pricing is behind login) | Not documented. Likely email or portal. Dropships with no packing slip | cGMP labs, all facilities FDA-registered for supplements, raw-material and heavy-metal testing | **Strong candidate,** especially for brain/focus and gap SKUs (zinc, iron, menopause) |
| **Vitalabs**, Atlanta GA area (est. 1977) | Low-MOQ private label plus fulfilment (dropship to consumers) | **144 bottles/SKU** (NASC profile). 240+ stock formulas | 9 / 6 / 8 (no pets yet) | Est. ~$7–12 (unit cost unverified, plus 3PL-style pick and ship) | Not documented. Amazon FBA integration. Ask about CSV/SFTP/API | **NSF/ANSI 455-2 GMP**, SQF (to 07/2027), FDA-registered, USDA Organic, Halal, NASC Preferred Supplier | **Best Phase 2 (low-MOQ) partner** for human SKUs |
| **SMP Nutra**, Largo FL | Private label/contract manufacturer plus fulfilment (no dropship) | **2,500–5,000 bottles/SKU**. Stock $4–20/unit | 800+ stock SKUs (not enumerated). 4 pet chews | $4–20 product plus 3PL | n/a (their fulfilment or your 3PL) | cGMP, FDA-registered, NSF 455-2 | **Phase 3 scale-up only** |
| **OK Capsule** | Personalised daily packs (sachets), per-customer dropship | No inventory. Per-order fee; "as low as $14" fulfilment (unverified) | 60+ stock supplements or own formula (packs, not bottles) | Unknown (quote) | **REST API + MCP + Shopify** | cGMP/FDA-registered, US-made, skip-lot ISO 17025 testing | **Second line:** quiz → personalised daily pack |
| **Makers Nutrition**, NY | Contract manufacturer + in-house fulfilment | 500–1,500 bottles; ~$2,000/mo fulfilment minimum (reported) | Large stock range | Low per unit, high fixed cost | Amazon/eBay | Not checked | **Phase 2–3 only** |
| **ViaCore Nutrition** | Private-label protein/custom + dropship (reported) | Unknown | Protein focus | Unknown | Unknown | Unknown | **Unverified.** Ask if a protein line is planned |
| **Pet Tech Labs** (FoodScience), Syracuse NE (pet) | Low-MOQ pet private label | **504 units** for soft chews, no setup fees | Dog: 3 Y / 1 ~. Cat: ~ | Unknown (quote) | Ships to your distribution centre/3PL. No dropship | **NASC Preferred Supplier**, US-made, NSF/SQF/cGMP logos ("vary per facility") | **Primary pet candidate** (Phase 1b/2, via 3PL) |
| **Natural Pet Innovations**, Earth City MO (pet) | Low-MOQ pet private label | "Low minimums" (number not stated). Free label design. 30-day lead time | Dog: 4 Y. Cat: ? | Unknown (quote) | Ships to Amazon, warehouse or 3PL. Offers product storage | "Made in USA". NASC and cGMP not stated | **Secondary pet candidate.** Best stock dog-chew match |

> **Bottom line:** No single supplier covers all 23 products. No US supplier we found offers *dropshipped* pet chews under your label. Every pet option is a low-MOQ manufacturer feeding a 3PL.

---

## 2. Supplier profiles

### 2.1 Supliful (shortlist, verified)

**1. Model and fees**
- No-MOQ print-on-demand. You pay base cost plus shipping only when an order is fulfilled.
- Pricing page (fetched Oct 2026) is internally inconsistent. It shows:
  - Free $0, alongside "first month $1, then $29/mo"
  - Pro at $69/mo, $49/mo and $48/mo (annual)
  - Enterprise from $349/mo
- The Shopify App Store listing is the clearest: **Free $0; Pro $69/mo or $660/yr**. Pro adds automatic fulfilment and "on-demand prices up to Tier 7", so base prices fall as volume rises.
- Without an active paid plan, incoming orders are put on hold. Payments are non-refundable once a billing cycle starts.
- Billing entity: Brand On Demand Inc.

**2. Coverage**
- See the matrix in §3: 8 Y / 6 ~ / 9 N. No pet chews; the "Pet Parents" filter shows only 2 items.
- Catalogue has 189 items, of which 123 are supplements.
- **NMN capsules are in the catalogue.** ~~Do not list them.~~ _(Update 28 Oct 2026: the FDA reversed its NMN exclusion on 29 Sept 2025, so NMN is lawful in supplements again. See `SUPLIFUL_PRODUCT_SCREEN.md`.)_

**Brain/nootropic range (good):**
- Lion's Mane capsules
- Brain Focus Formula (proprietary 609 mg blend with **no individual doses**: DMAE, bacopa, phosphatidylserine, huperzine A…)
- Gotu Kola + Bacopa Clarity Complex
- Cognitive Support, Ginkgo + Ginseng, 5-HTP
- Focus powders, mushroom focus strips, Cognitive Relax strips
- Methylene Blue drops (regulatory caution)
- No standalone L-theanine, citicoline, rhodiola or magnesium L-threonate found

**3. Costs and delivery**
- Base prices are hidden behind login. The only published example is "$12.00 base vs $30 retail" (homepage).
- US shipping rates are not published.
- Delivery: homepage claims "3–5 days average". A support reply on Trustpilot says "3–5 business days after fulfilment". A third-party review says 5–7 business days.
- **Estimated landed cost ~$15–20** (unverified). That is above the $12–15 target for most SKUs before the plan fee.

**4. Quality and compliance**
- "Products made in FDA-registered, GMP-compliant facilities"; US-made.
- COAs are mentioned by a third-party review.
- Prop 65 handling and NSF are not stated.

**5. Branding**
- Label editor and Canva templates; custom design service (third-party: $149 one-time for up to 5 labels).
- Samples at base price, max 3 units per product (10% off for 3).
- Label verification can take weeks when corrections are needed (Trustpilot complaints, Sep 2026).

**6. Integration**
- Shopify app and ClickFunnels. A WooCommerce plugin was mentioned in a 2024 blog post.
- **No public Supliful API.**
- The official non-Shopify route for custom stores is Supliful's own guide (updated 1 Sep 2026) to **use Shopify's Admin API as a headless backend**. Your Next.js backend calls `orderCreate` on a Shopify store that has the Supliful app installed. Tracking comes back through Shopify `FULFILLMENTS_CREATE`/`UPDATE` webhooks.
  - Requires Supliful Pro plus an active Shopify store, with products published via "Publish to Shopify".
  - Orders without customer phone/email are declined.
- Alternative: **manual orders** in the Supliful dashboard, paid per order. This is fine at low volume.

**7. Formula flexibility**
- Fixed stock formulas only; no custom formulation.
- Most product pages give exact doses, though some facts panels are images only. Proprietary blends on some SKUs (Brain Focus) hide individual doses.

**8. Reputation**
- Trustpilot **4.2/5 (458 reviews)**, 14% 1-star. Supliful replies to 100% of negative reviews.
- Shopify App Store **4.6/5 (163 reviews)**. App launched Feb 2021.
- Complaints: slow fulfilment, label verification delays, an unannounced price increase (Jul 2026), and Shopify sync outages.

**9. Red flags**
- Contradictory pricing page
- Shopify dependency
- Non-refundable billing
- Proprietary blends
- NMN listed
- Possibly the same catalogue as ODF at a markup (see 2.4)

**UK/EU:** "select products" ship internationally. A third-party review puts Europe shipping at $18–26 per shipment, so it is not viable for the UK.

---

### 2.2 HoneyComm / Private Label Supplements (shortlist): appears defunct

**Evidence (checked 26–27 Oct 2026):**
- `honeycomm.com` serves only a default Nexcess hosting placeholder, with file last-modified Apr 2023.
- `honeycomm.io` and `signup.honeycomm.io` show "This domain may be for sale."
- `privatelabelsupplements.com` and `plsupplements.com` redirect to a GoDaddy "for sale" lander.
- The Shopify app handle formerly listed as "HoneyComm Supplement On Demand" (`apps.shopify.com/private-label`) now shows "Next Day Nutra" and "This app is not currently available on the Shopify App Store."
- The BigCommerce app page returns 404.

**History:**
- Scottsdale, AZ.
- Shopify app from $147/mo, according to an older third-party listing.
- Most reviews are promotional pages tied to the "Consumable System" course (2023).

**Verdict:** If your earlier outreach got a reply, ask them for their current legal entity, live domain and manufacturer before going further. Otherwise drop it.

---

### 2.3 Nutra Group LLC, Savannah GA (shortlist, partly verified)

The site (`nutragroupusa.com`) returned TLS handshake failures and HTTP 503 to every fetch, so the figures below come from search snippets of their own pages plus directories.

| # | Topic | Findings |
|---|---|---|
| 1 | Model and fees | Private label with stock formulas. **MOQ "starts @ 72 units"** on many stock formulas; elsewhere "as low as 24 bottles"; some formulas need 1,000. Custom formulas start at 2,500 bottles. **Label design $125 one-time.** Free US shipping on orders over $500. FAQ claims drop shipping and fulfilment with "same day shipping, tracking and complete integration" |
| 2 | Coverage | "300+ in stock formulas" (another page says 200+). Examples include Collagen Peptides Complex capsules. Could not be enumerated against our list |
| 3 | Costs | Not available |
| 4 | Compliance | Not verifiable. Claims Kosher, Halal and non-GMO options (third-party list) |
| 6 | Integration | Unknown beyond "complete integration" |
| 8 | Reputation | Veteran-owned. "Launched Veterans Day 2008" per a directory. No independent reviews found. The 72-bottle MOQ also appears in a 2019 post (old) |
| 9 | Red flags | Site unreachable; inconsistent MOQs; no certificate evidence |

**Verdict:** Hold. Ask for the PDF price list, FDA registration number and a sample COA.

---

### 2.4 On Demand Fulfillment (ODF), West Jordan UT (new, verified on their site)

**1. Model and fees**
- White-label dropship, "No Minimum Orders… Start with 1".
- Labels are printed in-house and applied before shipping. Shipping labels carry your company name and logo.
- Weekly invoices. Membership and per-order fees are not published.

**2. Coverage (10 / 3 / 10)**
- Menopause Support (90 caps), Magnesium Complex and Magnesium Glycinate, Vitamin K2 + D3 capsules
- Probiotic 40B and 60B, Platinum Turmeric / Turmeric w/ Bioperine, Berberine, Ashwagandha, Complete Multi-Vitamin
- Creatine Powder, **Mushroom Plus Powder**
- Collagen Complex capsules, Hair Skin & Nails, Joint Flex
- Brain: **Neuro Brain & Focus**, Ginkgo, 5-HTP, Mushroom 10X Complex, Deep Calm
- No zinc, iron, garlic or pets
- 120+ products in total

**3. Costs and delivery**
- No prices are published. "Most orders ship the same business day."
- Delivery times are not stated.

**4. Compliance (claimed on the About page)**
- Manufactured in an "FDA compliant, Utah Department of Agriculture and Food Organic Certified, and cGMP registered facility".
- The facility is not named and no certificates are published.
- A third-party Thomasnet profile claims "FDA approved". The FDA does not approve supplements, so treat that wording as a yellow flag.

**5. Branding:** in-house label designers. Sample cost not stated.

**6. Integration**
- "Product and shipping data is sent via API integration" through its inventory and shipping software.
- Amazon, Walmart, eBay, Google Shopping and Shopify are mentioned.
- **This is the most promising non-Shopify route among the dropshippers.** Ask for the API docs (order create, tracking webhook, stock feed).

**7. Formula flexibility:** stock formulas. Doses are not shown on the public pages, so ask for full Supplement Facts.

**8. Reputation**
- CB Insights lists it as founded 2017; ODF says "over 10 years" in bottling and private labelling.
- **No independent customer reviews found.**

**9. Red flags and an observation**
- Unverified certifications; no reviews.
- **Inference (unverified):** ODF's product names closely mirror Supliful's catalogue (Keto 5, Probiotic 40 Billion, Platinum Turmeric, Nitric Shock pre-workout, Max Detox, Mushroom 10X, Magnesium Glycinate 90 ct, Sea Moss, Maca Plus). That suggests a shared underlying manufacturer or fulfiller in Utah. If so, buying direct from ODF could give the same products with an API and no Shopify dependency, possibly at a lower cost.
- Confirm by comparing sample labels and Supplement Facts side by side.

---

### 2.5 Professional Nutritionals, Tampa FL (new, verified)

**1. Model and fees**
- Private label with **no minimum ("our minimum is one bottle")** on 170+ stock products.
- Dropship available: "no inventory to buy & store". Dropshipped orders go out **without packing slip or invoice**, which is good for white label.
- **$250 standard label template.** Complex or logo-less designs cost more.
- Practitioner shipping is $10, free over $250. The per-order dropship cost is not stated.

**2. Coverage (9 / 7 / 7)**
- Meno Support (120 caps), Iron Bisglycinate DS / Ferrochel, Zinc, Magnesium capsules / Multi-Mag
- Probiotic 40 shelf-stable, Berberine Herbal Complex, Daily Multi-Vite, Biotin, Creatine
- Joint Health (120 caps), Curcumin w/ Serratiopeptidase, Beef Collagen powder
- Garlic / Allicin Plus, D3-K2 chewable, Mushroom Complex (9 organic species, capsules)
- No pets

**Brain range (best of the human suppliers):**
- Cognitive Support (caps and powder), Memory Support, Choline Brain Complex (choline + TMG)
- Phos-Serine, Phos-Choline, ALCAR, **Theanine Chews**, Relax Focus, GABA chews, Ginkgo, Mood Elevate/Relief
- No confirmed citicoline, bacopa, rhodiola or Mg L-threonate SKUs

**3. Costs and delivery**
- Prices are behind practitioner login, so unknown. Practitioner-grade pricing is often higher, which is a cost risk.
- Delivery: "3–5 business days from ship date", via UPS or USPS.

**4. Compliance**
- "select cGMP labs"; manufacturing facilities "all registered with the FDA for dietary supplement manufacturing".
- Raw-material identity and heavy-metal testing; outside-lab audits.
- NSF, organic and Prop 65 handling are not stated.

**5. Branding:** template labels ($250). Sample cost not stated.

**6. Integration:** not documented. Expect email or portal ordering; ask about CSV, SFTP or API.

**7. Formula flexibility**
- Stock formulas, plus custom formulas with minimums.
- Ingredient amounts are not public; ask for facts panels.

**8. Reputation**
- Family-owned since 1999.
- No Trustpilot or Reddit presence found, which is neutral: they are a practitioner-channel company.

**9. Red flags:** pricing opacity, and possible friction with a consumer-ecommerce use case. Ask whether DTC ecommerce brands are accepted.

---

### 2.6 Vitalabs, Georgia (new, verified)

**1. Model and fees**
- Private label with **MOQ 144 bottles per product** (NASC supplier profile). Their site says "lowest minimum order quantities in the industry".
- Fulfilment: "stores, picks, packs, and ships products directly to your customers". Supports custom websites and Amazon FBA.
- Sells only to qualified distributors or retailers.

**2. Coverage (9 / 6 / 8)**
- Probiotic Blend / 30 Billion / Advanced Probiotic, Glucosamine 500 mg / Joint Matrix, Magnesium Bisglycinate 200 mg, **Zinc 50 mg**
- Turmeric 500/750 mg, Berberine Complex, Just For Life Complete Multi / Veggie-Vite, Biotin 10,000 mcg, Creatine Monohydrate
- Collagen Complex capsules, Women's Support, D3 + K2 (chewable/gummy), Garlic & Parsley, Organic Ashwagandha tablets, Mushroom Complex
- No iron or niacinamide found. **NMN Daily Vitality is in the catalogue; exclude it.**

**Brain range:** Lion's Mane Complex, Mind Matrix, Mood Formula, Adaptogen Formula, Ginkgo 60/120 mg, 5-HTP, Panax Ginseng, Mucuna.

**3. Costs**
- Unit prices are not published.
- **Estimate (unverified):** stock capsules at 144 MOQ typically ~$3–7 per bottle in the industry. Add pick/pack plus postage of ~$5–8, giving ~$8–15 landed.
- Inventory outlay is 144 × unit cost per SKU.

**4. Compliance (strongest verified)**
- **NSF/ANSI 455-2 GMP registration** (2026 certificate linked)
- SQF FSC 31 (filename indicates expiry 07/2027)
- FDA-registered facility, USDA Organic (WFCF), Halal (ISA)
- NASC Preferred Supplier (certified through 07/04/2027)
- **Prop 65:** they put warnings on their own brand, but private-label customers are responsible. They recommend a warning on every package sold in California.

**5. Branding:** in-house label design, product images, bottles/pouches/packets. Sample cost not stated.

**6. Integration:** not documented beyond Amazon FBA. Ask about CSV, SFTP, API and tracking return.

**7. Formula flexibility:** 240+ stock formulas plus custom formulation.

**8. Reputation**
- Family-owned since 1977.
- "100M+ units shipped in 2025, 3,000+ clients" (their own claim).
- No significant complaints found.

**9. Red flags:** Prop 65 burden falls on the brand; integration is unknown; NMN in the catalogue.

---

### 2.7 SMP Nutra, Largo FL (scale-up reference, verified)

| Topic | Findings |
|---|---|
| MOQ | **Stock 2,500–5,000 bottles/SKU.** Min 1,000 per SKU even on split runs |
| Cost | **$4–20/unit stock; $5–30 custom**, including bottle, testing, seal and label |
| Lead time | **8–10 weeks** new, 6–8 weeks reorders |
| Fulfilment | Offers warehouse and fulfilment. **"We do not currently offer drop shipping."** |
| Compliance | cGMP, FDA-registered, NSF/ANSI 455-2, made in USA. 155,000 sq ft facility; new Largo HQ (Jun 2025) |
| Catalogue | 800+ stock SKUs |
| Pets | 6 soft chews: Allergy Aid, Calming Aid (×2), Digestive Enzymes w/ Probiotics, Joint Health. NASC not stated |
| Samples | Purchasable |

**Verdict:** Phase 3 only, once SKUs sell more than ~2,500 per year.

---

### 2.8 Pet Tech Labs (FoodScience LLC), Syracuse NE (pet, verified)

**1. Model and fees**
- Pet private label, **soft-chew MOQ 504 units**. They contrast this with the 800 most competitors require.
- **No setup fees.**
- Ships to approved distribution centres or 3PL. No dropship.

**2. Coverage**
- Dog stock lines: Joint, Digestive, Skin & Coat, Dental. They also mention probiotic and "behavioral" (calming) supplements.
- Cat: a stock range exists ("digestive" category) but no hairball or probiotic powder is named.
- Formats: chews, granules, powders, tablets.

**3. Costs:** quote only.

**4. Compliance**
- **NASC Preferred Supplier.**
- Made in USA; third-party ingredient testing.
- NSF, SQF, cGMP and CRN logos, though "certifications vary per facility".
- Parent FoodScience (VT) claims 50 years in pet supplements.

**5. Branding:** consultants guide regulatory label language; you approve the final label draft.

**6. Integration:** n/a (via your 3PL).

**7. Formula flexibility:** stock plus custom.

**9. Red flags:** no published lead time or pricing.

---

### 2.9 Natural Pet Innovations, Earth City MO (pet, verified)

**1. Model and fees**
- "Low minimums" (number not stated). **Free graphic design.** **30-day concept-to-completion.**
- Product storage offered. Ships to Amazon, your warehouse or a 3PL. DTC dropship is not stated.

**2. Coverage (stock 2.2 g soft chews, 120-count jars)**
- **Digestive (probiotic)**, **Hip & Joint**, **Calming (melatonin)**, **Skin & Coat**
- Also Allergy, Urinary, and hemp variants (avoid hemp for compliance simplicity)
- A cat supplements section exists; specific cat SKUs are unverified.

**4. Compliance**
- "Pet Products Made in USA".
- NASC and cGMP not stated. Ask, and require NASC for retail credibility.

**8. Reputation:** "20+ years" (directory).

**Alternatives:** Cassco Bio Labs (MO) offers Hip & Joint, Skin & Coat, Calming and Multi soft chews, free label design, "lowest minimums" and US-made, but no probiotic or cat SKUs.

---

### 2.11 OK Capsule (added 27 Oct 2026, verified on their site)
Personalised **daily-pack** fulfilment: one sachet per day holding all of a customer's capsules, printed per customer under your brand, shipped direct.

- **Model:** formulates, packs and ships per customer ("per-patient, per-protocol packing at scale"). No inventory. You can bring your own formula or use theirs.
- **Range:** "60+ bioavailable, clinically-backed supplements", plus custom formulas. No pets.
- **Integration:** **REST API, an MCP server, or Shopify**. They say "Every capability — formulation, ordering, fulfillment, tracking — is API-exposed". **No Shopify needed.**
- **Fees (unverified, sources conflict):**
  - The pricing page is behind a login and only says "a simple per-order fee".
  - The Shopify app lists fulfilment "as low as $14".
  - A directory lists a $100/mo Starter tier plus $15.95 shipping & handling plus the supplements.
- **Compliance (claimed):**
  - cGMP, FDA-registered facilities, "100% US-manufactured".
  - Third-party potency and purity testing on a **skip-lot** basis (spot checks, not every lot) at ISO 17025 labs.
  - Non-GMO, USDA Organic and Vegan logos. No NSF.
- **Company:** raised $9.5M in 2022 (Mucker Capital, Next Ventures). The Shopify app has 0–1 reviews.
- **Verdict:** **best fit for a quiz-driven "personalised daily pack" line** (see `docs/DAILY_PACK_CONCEPT.md`). It doesn't replace a bottle supplier.
- **Ask:**
  - Per-supplement and per-order prices, plus shipping.
  - Their equivalents of our 15 products, and whether they can use our product names.
  - API docs and how tracking is returned.
  - Ingredient origin (Made in USA?) and COAs.
  - A branded sample pack.
  - Whether they can also ship bottles.

### 2.12 Makers Nutrition, New York (added from owner research, partly verified)
A traditional contract manufacturer with in-house fulfilment: you buy a production run, and they store it and ship orders.

- **MOQ:** conflicting. Their own pages say "as low as 500 bottles" in one place and 1,500 in another.
- **Fees:** owner research reports a **~$2,000/month minimum fulfilment fee** (unverified).
- **Integration:** Amazon and eBay are mentioned.
- **Lead time:** 2–3 weeks for stock formulas, 6–8 weeks for custom.
- **Verdict:** **Phase 2–3 only.** The minimum fee alone rules it out before sales are proven.

### 2.13 ViaCore Nutrition (added from owner research, not verified)
Described as private-label protein powders and custom formulas, made in-house, with dropshipping to US customers. **Nothing could be verified online.** Possibly relevant later for a protein or creatine line. Ask for MOQ, dropship fees and certificates.

---

### 2.10 Screened out

| Supplier | Reason |
|---|---|
| **ClickNutra** (Ohio) | No MOQ and an API, but only ~50 products. Says "FDA Approved", which is a misleading claim. Too new and unproven |
| **SelfNamed** | Cosmetics only. No supplements on the site |
| **Private Label Partners** | CBD-focused |
| **Fulfillment Nutra** | Location unclear; Shopify sync only |
| **Nutribl** (UK) | 10-unit MOQ, dropship/"light 3PL", has a pet probiotic. **Revisit for the UK launch** |
| **Vets Plus** | NASC; can drop-ship to customers, but is a custom manufacturer (MOQ not published) |
| **Uckele** | NASC/NSF; "no minimum" claimed, but no dropship and no stock-SKU detail |

---

## 3. Product coverage matrix

**Abbreviations:** SUP = Supliful, ODF = On Demand Fulfillment, PN = Professional Nutritionals, VL = Vitalabs, SMP = SMP Nutra, PTL = Pet Tech Labs, NPI = Natural Pet Innovations.

**Marks:** Y = stock match · ~ = close substitute (product named in brackets) · N = not found · ? = not verifiable. Nutra Group and HoneyComm are omitted because their catalogues could not be verified.

| # | Product | SUP | ODF | PN | VL | SMP | PTL | NPI |
|---|---|---|---|---|---|---|---|---|
| 1 | Probiotic Complex | Y (20B / 40B+prebiotic) | Y (40B / 60B) | Y (Probiotic 40) | Y (Probiotic Blend / 30B) | ? | – | – |
| 2 | Glucosamine Complex | ~ (Joint Support: glucosamine HCl + MSM + turmeric + boswellia) | ~ (Joint Flex) | ~ (Joint Health) | Y (Glucosamine 500 / Joint Matrix) | ? | – | – |
| 3 | Marine Collagen Complex | ~ (bovine collagen powder) | ~ (Collagen Complex caps, source ?) | ~ (beef collagen powder) | ~ (Collagen Complex caps) | ? | – | – |
| 4 | Menopause Complex | ~ (Women's Vitality: black cohosh, red clover…) | Y (Menopause Support) | Y (Meno Support) | ~ (Women's Support) | ? | – | – |
| 5 | Magnesium Complex | Y (Glycinate) | Y (Magnesium Complex) | Y (Multi-Mag) | Y (Bisglycinate) | ? | – | – |
| 6 | Zinc | N | N | Y | Y (50 mg) | ? | – | – |
| 7 | Iron Complex | ~ (iron strips) | N | Y (Iron Bisglycinate DS) | N | ? | – | – |
| 8 | Vitamin D3 & K2 | ~ (Bone & Heart: Ca + D3 2000 IU + K2) | Y (K2 + D3 caps) | ~ (chewable) | ~ (chewable / gummy) | ? | – | – |
| 9 | Turmeric Complex | Y (Platinum Turmeric) | Y | ~ (Curcumin + serratiopeptidase) | Y | ? | – | – |
| 10 | Berberine Complex | Y | Y | Y | Y | ? | – | – |
| 11 | Odorless Garlic (softgels) | N | N | ~ (Garlic / Allicin Plus) | ~ (Garlic & Parsley) | ? | – | – |
| 12 | Ashwagandha | Y | Y | ~ (Adrenal / Cortisol blends) | ~ (organic tablets) | ? | – | – |
| 13 | Multivitamin | Y | Y | Y | Y | ? | – | – |
| 14 | Niacinamide Complex | N (serum only) | N | N | N | ? | – | – |
| 15 | Biotin Complex | ~ (Hair/Skin/Nails) | ~ (Hair/Skin/Nails) | Y | Y (10,000 mcg) | ? | – | – |
| 16 | Creatine (powder) | Y | Y | Y | Y | ? | – | – |
| 17 | Mushroom Blend Powder | Y (Fermented Mushroom Blend) | Y (Mushroom Plus Powder) | ~ (caps) | ~ (Mushroom Complex) | ? | – | – |
| 18 | Dog Probiotic Chews | N | N | N | N | ~ (Digestive Enzymes w/ Probiotics) | Y (Digestive) | Y (Digestive soft chew) |
| 19 | Dog Hip & Joint Chews | N | N | N | N | Y | Y | Y |
| 20 | Dog Calming Chews | N | N | N | N | Y | ~ ("behavioral") | Y |
| 21 | Skin & Coat Chews | N | N | N | N | ~ (Allergy Aid) | Y | Y |
| 22 | Cat Probiotic Powder | N | N | N | N | N | ~ (cat digestive, powder format offered) | ? |
| 23 | Cat Hairball & Digestive Chews | N | N | N | N | N | ? | ? |
| | **Totals (Y / ~ / N)** | **8 / 6 / 9** | **10 / 3 / 10** | **9 / 7 / 7** | **9 / 6 / 8** | n/a | pet only | pet only |

**Brain/focus range**

| Supplier | Range |
|---|---|
| PN | Best: Cognitive Support, Memory Support, Choline Brain, Phos-Serine, ALCAR, Theanine Chews, Relax Focus |
| SUP | Good: Lion's Mane, Bacopa / Gotu Kola, Brain Focus |
| VL | Good: Lion's Mane Complex, Mind Matrix, Ginkgo |
| ODF | Modest: Neuro Brain & Focus |

**None** of them confirmed standalone **citicoline, rhodiola or magnesium L-threonate** stock SKUs. Those need custom formulation (Vitalabs or Nutra Group custom runs) or a later phase.

---

## 4. Recommended strategy

### Supplier pairing

**Human, primary (Phase 1 dropship): Supliful (owner's decision, 27 Oct 2026).**
- Supliful has the most proven operations and no MOQ.
- How it connects without Shopify as the storefront:
  - **(a) At launch: manual orders.** Use the Supliful dashboard, working from Admin → Fulfilment → Export.
  - **(b) Later: a headless Shopify backend.** A $29–39/mo Shopify store with the Supliful app, plus Supliful Pro ($69/mo). Our server calls `orderCreate` after each paid order, and tracking returns via Shopify webhooks. Customers never see Shopify.
- **Alternative:** On Demand Fulfillment, *if* samples, certificates and API docs check out. It has a similar range, no MOQ, and a stated direct API.

**Human, secondary / gap-filler:**
- **Professional Nutritionals** (1-bottle MOQ) for Zinc, Iron, and a Noovit "Focus" sub-line (Cognitive Support, Theanine, Choline/ALCAR).
- Caveat: two dropshippers means split shipments on mixed orders. Either route mixed carts to one supplier or keep the PN SKUs as standalone subscriptions.
- If PN's prices are competitive and it has an ordering route, it could be the *single* primary supplier instead of ODF, because its coverage of our list is similar and it adds the brain range.

**Pets:**
- No US dropship option exists. Launch pets as a **Phase 1b inventory line**:
  - Start with **3 dog SKUs** (Hip & Joint, Calming, Probiotic/Digestive), plus optionally Skin & Coat.
  - Source from **Pet Tech Labs** (NASC, 504 MOQ) or **Natural Pet Innovations** (30-day lead time, free design).
  - Hold the stock at a small DTC 3PL that has a REST API.
- Order of magnitude (unverified): 504 × 3 SKUs ≈ 1,500 units of inventory.

### Drop or swap

| Product | Action |
|---|---|
| **Niacinamide Complex** | Nobody stocks it as an ingestible. **Drop for launch**, or replace with "Hair, Skin & Nails / Biotin Complex", or move it to custom later |
| **Odorless Garlic softgels** | Rare as a white-label dropship item. **Drop**, or swap to Garlic capsules (PN Allicin Plus / VL Garlic & Parsley), after confirming the odour claim |
| **Marine Collagen Complex** | No marine collagen capsule found. Swap to "Collagen Complex" capsules (confirm the source on the facts panel) and **remove "marine" from site copy** unless confirmed |
| **Glucosamine Complex** | Use the joint blends (VL Glucosamine 500 / Joint Matrix is the closest pure match) and rename on site if the formula differs |
| **D3 & K2** | ODF capsules match. Elsewhere it is a chewable/gummy, or Supliful's version includes calcium; facts must match |
| **Cat Probiotic Powder and Cat Hairball chews** | **Defer**. No stock source verified |
| **Iron and Zinc** | PN (both) or Vitalabs (zinc). Supliful/ODF cannot cover them |
| **NMN** | Both Supliful and Vitalabs list it. ~~Make sure it never gets published to the US store~~ Lawful again since the FDA reversal (29 Sept 2025); a phase-2 candidate, see `SUPLIFUL_PRODUCT_SCREEN.md` |

### Phases

**Phase 0 (now to ~6 weeks): sample and verify**
- Order samples (see §5).
- Compare Supplement Facts against site copy.
- Check FDA facility registration and NSF listings in the public databases.
- Build an **order-forwarding service** in Next.js: Stripe `checkout.session.completed` webhook → supplier adapter. Adapter types:
  - REST (ODF?)
  - Shopify Admin `orderCreate` (Supliful)
  - CSV/email (PN / Vitalabs)
- Store tracking numbers returned by webhook or by polling.

**Phase 1 (launch): human dropship**
- About 12–15 human SKUs from one primary dropshipper, with an optional PN Focus line.
- Track per-SKU velocity and real landed cost.

**Phase 1b (launch + 1–3 months): pets via 3PL**
- 3–4 dog chews from Pet Tech Labs or NPI, stored at a 3PL with an API.
- This also builds the 3PL relationship needed for Phase 2.

**Phase 2 (once a SKU sells ~50–100+/month): low-MOQ to own 3PL**
- Move winning human SKUs to **Vitalabs (144 MOQ, NSF)** or Nutra Group (72 MOQ, if verified), shipped into the same 3PL.
- Add custom nootropic SKUs here: citicoline, rhodiola, Mg L-threonate, L-theanine.
- Target landed cost of ~$8–12.

**Phase 3 (SKUs over ~2,500/yr): scale**
- SMP Nutra (NSF, $4–20/unit, 2,500 MOQ) or Vitalabs custom.

**UK later**
- Nutribl (UK, 10-unit MOQ, pet probiotic) or a UK 3PL importing US-made stock.
- UK/EU labelling and novel-food rules need a separate review.
- Supliful's EU shipping ($18–26) is not viable.

---

## 5. Next steps

### Request samples from

1. **ODF:** Menopause Support, Magnesium Complex, K2+D3, Mushroom Plus Powder, Neuro Brain & Focus.
2. **Supliful:** the same equivalents, for a side-by-side label and Supplement Facts comparison to test the shared-source theory. Max 3 per product, at base price.
3. **Professional Nutritionals:** Cognitive Support, Theanine Chews, Iron Bisglycinate, Zinc, Meno Support.
4. **Vitalabs:** Glucosamine 500, Magnesium Bisglycinate, Lion's Mane Complex (to benchmark Phase 2 quality and price).
5. **Pet Tech Labs and Natural Pet Innovations:** Hip & Joint, Calming, Digestive/Probiotic dog chews.

### Questions for every supplier

- Exact per-unit price at our volumes (1–50, 50–200, 200+ per month) and every fee: setup, label, plan, per-order, pick/pack, packaging.
- US shipping cost by weight and zone. Processing time plus transit time.
- Full Supplement Facts panel and spec sheet per SKU, plus how much notice we get before a formula change (our site copy must match).
- FDA facility registration number, cGMP (21 CFR 111) audit or certificate, NSF/SQF status, batch COAs (identity, potency, heavy metals, micro).
- Prop 65: do they test against Prop 65 limits, and will they apply California warnings to our labels?
- Who is the manufacturer of record, and can the label say "Distributed by Noovit"?
- Returns, damaged and lost orders, and recall procedure. Product liability insurance, and whether we can be named as additional insured.

### Supplier-specific questions

**ODF**
- API docs: order create, cancel, status, **tracking webhook**, stock and price feed.
- CSV/SFTP fallback.
- Who manufactures the products, and is it the same source as Supliful?
- Certificates behind the "cGMP registered / organic" claims.
- Brand inserts and custom packaging.

**Supliful**
- Exact base price tiers (Tier 1–7) for our SKUs.
- Is there any direct order API on the Business/Enterprise plan, rather than Shopify headless?
- Which Shopify plan is the cheapest that supports custom-app `orderCreate`? (Verify with Shopify.)
- Label verification turnaround.

**Professional Nutritionals**
- Do you accept DTC ecommerce brands (not practitioners)?
- Dropship per-order fee and ordering method (email, CSV, portal, API).
- Wholesale price list.
- Custom formula MOQ, for a citicoline/rhodiola "Focus" product.

**Vitalabs**
- Unit prices at 144 and 500 units.
- Fulfilment fees and integration method (CSV, SFTP, API).
- Do you ship into third-party 3PLs?
- Iron SKU availability. D3+K2 in capsule form.
- Pet line timing (NASC).

**Nutra Group**
- Current price list PDF, real MOQ (24 vs 72), dropship fees and integration.
- FDA registration and COAs.

**HoneyComm**
- Only if they replied to earlier outreach: current entity, domain and manufacturer. The public sites are parked.

**Pet suppliers**
- MOQ per SKU and per jar size, and unit price at the MOQ.
- NASC Quality Seal use on our label.
- Cat probiotic powder and hairball chew options.
- Lead time, shelf life, and whether they ship to our chosen 3PL.

---

## 6. Sources

*Accessed 26–27 Oct 2026 unless noted.*

**Supliful**
- Pricing: https://supliful.com/pricing
- Homepage (claims, $12 example, samples): https://supliful.com/
- Catalogue: https://supliful.com/catalog · products: `/catalog/magnesium-glycinate-capsules`, `/catalog/bone-heart-support-capsules`, `/catalog/joint-support-capsules`, `/catalog/womens-vitality-formula-capsules`, `/catalog/brain-focus-formula-capsules`
- Custom app via Shopify Admin API (updated 1 Sep 2026): https://help.supliful.com/en/articles/12459926-connect-your-custom-app-to-supliful-using-shopify-admin-api
- Manual vs automated fulfilment: https://help.supliful.com/en/articles/5519581-manual-and-automated-order-fulfilment
- Manual orders: https://help.supliful.com/en/articles/5907587-how-to-place-a-manual-order
- Shopify App Store listing: https://apps.shopify.com/supliful
- Trustpilot: https://www.trustpilot.com/review/supliful.com
- Third-party review (label $149, EU shipping, 5–7 days; modified Jul 2026): https://dodropshipping.com/supliful-review/
- ClickFunnels integration: https://support.myclickfunnels.com/docs/how-to-integrate-supliful-for-dropshipping/

**HoneyComm / PLS**
- https://honeycomm.com/ (hosting placeholder)
- https://signup.honeycomm.io/ (domain for sale)
- https://privatelabelsupplements.com/ (GoDaddy for-sale lander)
- https://apps.shopify.com/private-label (now "Next Day Nutra", delisted)
- ZoomInfo: https://zoominfo.com/c/honeycomm/1311934854
- Old app listing: https://softpulseinfotech.com/shopify-app/private-label
- Promotional review: https://silverbulletpublishing.com/honeycomm-review/

**Nutra Group**
- https://nutragroupusa.com/ (unreachable; snippets via search)
- https://nutragroupusa.com/manufacturing-vitamins/
- https://www.linkedin.com/company/nutra-group-llc
- https://veteranbusinessowners.com/business/29658/nutra-group-llc
- https://www.inven.ai/company-lists/top-25-supliful-alternatives

**On Demand Fulfillment**
- https://ondemandfulfillment.com/private-label/
- https://ondemandfulfillment.com/white-label-supplements-dropshipping/
- https://ondemandfulfillment.com/get-started/
- https://ondemandfulfillment.com/about/
- https://ondemandfulfillment.com/general-health-supplements/
- https://ondemandfulfillment.com/hair-beauty-products/
- https://ondemandfulfillment.com/sports-nutrition/
- CB Insights: https://www.cbinsights.com/company/on-demand-fulfilment
- Thomasnet: https://www.thomasnet.com/company/on-demand-fulfillment-30851932/profile

**Professional Nutritionals**
- https://www.professionalnutritionals.com/
- https://www.professionalnutritionals.com/wholesale-private-label-supplements-faqs/
- https://www.professionalnutritionals.com/quality-manufacturing/
- https://www.professionalnutritionals.com/professional-products/ (product pages for choline-brain-complex, joint-health, mushroom, meno-support)

**Vitalabs**
- https://www.vitalabs.com/
- https://www.vitalabs.com/fulfillment/
- https://www.vitalabs.com/products/ and category pages under `/private-label-products/vitamins-nutrition/`
- https://www.vitalabs.com/prop65
- https://www.vitalabs.com/about/seals-and-certifications
- NASC profile (144 MOQ): https://www.nasc.cc/preferred-suppliers/vitalabs-inc/

**SMP Nutra**
- https://smpnutra.com/
- https://smpnutra.com/faq
- https://smpnutra.com/private-label-stock-products/pet

**Pet suppliers**
- https://www.pettechlabs.com/
- https://www.pettechlabs.com/private-label-process
- https://www.pettechlabs.com/private-label-dog-supplements
- https://www.pettechlabs.com/private-label-cat-supplements
- https://www.naturalpetinnovations.com/
- https://www.naturalpetinnovations.com/private-label-dog-products/private-label-dog-supplements/
- https://www.cassco-bio.com/private-label-pet-products/
- https://www.uckele.com/private-label-formulation/
- https://www.nasc.cc/?p=6555 (Vets Plus)
- https://www.nasc.cc/preferred-suppliers/

**Screened out**
- https://clicknutra.io/
- https://selfnamed.com/
- https://privatelabelpartners.com/services/dropshipping-fulfillment/
- https://www.fulfillment-nutra.com/en
- https://www.nutribl.com/c-52-pet-nutrition.aspx

**OK Capsule / Makers Nutrition**
- https://okcapsule.com/
- https://apps.shopify.com/ok-capsule-pack-builder
- https://nutraingredients-usa.com/Article/2022/03/24/personalized-vitamin-company-scores-9.5m-investment
- https://makersnutrition.com/news/the-truth-about-private-label-vitamin-manufacturing
- https://europeanbusinessmagazine.com/best-private-label-supplement-companies-complete-guide/

**Industry benchmark (generic, not supplier-specific)**
- Fulfilment cost ranges ($5–12 shipping, $2–5 pick/pack): https://opensend.com/post/fulfillment-cost-per-order-ecommerce
