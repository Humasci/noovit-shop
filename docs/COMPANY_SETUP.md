# Company setup plan: Noovit LLC (Wyoming)

_28 Oct 2026. A plan, not legal or tax advice. Confirm the tax points with a cross-border accountant and the supplement points with the regulatory lawyer (already on the TODO). Rules change, so re-check each step when you do it._

## 0. Two answers that change the plan
1. **Where do you live and pay tax?**
   - **Outside the US:** Wyoming is a good fit (cheap, private, no state income tax). Extra federal filing applies (see §4) and banking/Stripe need checking for non-residents.
   - **In a US state:** usually form the LLC **in your home state**. A Wyoming LLC run from another state normally has to register there as a "foreign LLC" anyway, so you pay twice.
2. **New LLC or an existing one?** Use a **separate LLC for Noovit**, even if you already have a Wyoming LLC for other projects. Supplements carry product-liability risk, and a separate company keeps that risk away from your other businesses.

## ★ Decisions so far (28 Oct)
- Owner lives in the **UK** → Wyoming fits. Noovit gets a **new LLC**.
- **Plan:** Wyoming LLC (cheapest, simplest); **reinvest** revenue into stock, ads and content; pay **six3** an arm's-length marketing fee; the owner is paid through six3 (UK tax). For tax, money *spent* on business costs (ads, Supliful orders, fees) reduces profit. Profit *kept* in the bank still counts as profit, so confirm with the accountant how HMRC taxes retained LLC profit.
- Formation through **Wyoming Agents** (wyomingagents.com, Wyoming Registered Agent Services LLC, 32 N Gould St, Sheridan WY):
  - **$153 total**: $103 state fee, plus year 1 of the $25/yr registered agent, compliance reminders and scanning of state notices. Filing takes 3–5 business days.
  - Ask them to **sign as organizer**, which keeps your name off the public record.
  - Add the **mail scanning plan / unique suite** (from $49/yr). That gives the address for the label ("Distributed by Noovit LLC…"), CAN-SPAM emails and the bank. Their site says the address can be used as the mailing and principal address; confirm in writing that it can go on product labels.
  - **Skip their $100 renewal service.** The Wyoming annual report ($60 minimum) takes about 5 minutes online each year.
  - Their site doesn't mention EIN help or an operating agreement. Do both yourself (below).

## ⚠️ UK owner: settle the tax structure BEFORE filing
A US LLC owned and run by a UK resident gets very different tax treatment on each side:
- **US:** a single-member LLC is "disregarded". With no US trade or business, there's usually no US income tax, but the **Form 5472 + pro forma 1120 filing is due every year** ($25,000 penalty if missed).
- **UK:** HMRC generally treats a US LLC as a **company** (opaque), not see-through. A company **managed and controlled from the UK** (you, running it from home) can be **UK tax-resident**, which means **UK corporation tax** (19–25%) on its profits, plus registering it with HMRC. The mismatch between the US and UK treatment can cause double tax or lost treaty relief.
- **Options to ask a UK accountant with US experience** (a one-hour consult is worth it):
  1. Wyoming LLC owned by you personally (simplest on the US side; the UK position is the question)
  2. Wyoming LLC **elected to be taxed as a C-corp** (Form 8832)
  3. **UK Ltd owning the Wyoming LLC.** UK corporation tax on the profits; clean for HMRC; common for UK founders
  4. UK Ltd only, selling to US customers (then the label still needs a US address or phone number for adverse event reports)
- Also ask: Self Assessment reporting, how you pay yourself (salary or dividends), and whether US sales via Supliful's fulfilment create a US trade or business.

## Thresholds people mix up (none of these is a "no tax below £/$X" rule for profits)
| Threshold | What it is | Applies to Noovit? |
|---|---|---|
| **US sales tax ~$100k or 200 orders per state** | When you must start **collecting sales tax from customers** in that state | Yes, per state; Stripe Tax tracks it |
| **UK VAT £90k** | When a UK business must register for VAT | Only for UK sales (US sales through a US LLC aren't UK-VATable) |
| **US income tax** | A one-owner LLC owned by a non-resident pays **no US income tax at any profit level** if it has no "US trade or business". If it does have one, tax applies **from the first dollar**. There is no $80–100k allowance | The question for the accountant |
| **UK tax** | You're UK-resident, so the profit is taxed in the UK **at any amount**, either as corporation tax (if HMRC sees the LLC as a UK-run company) or on your personal return | Yes |

## What "US trade or business" means (and why it's usually zero US tax for us)
- **The test:** the US taxes a foreign owner's business profits only if the business has a **"trade or business in the US"**: regular, continuous activity carried out *in* the US by you, employees or agents. Under the **US–UK tax treaty**, the US can tax business profits only if there's a **"permanent establishment"**: a fixed place of business in the US (office, shop, your own warehouse or staff) or a US agent who habitually signs contracts for you.
- **Usually does NOT count:** selling online to US customers from the UK; using **independent** providers (Supliful making and shipping orders, Stripe, Vercel servers, a registered agent address, a US bank account); paying independent US freelancers, affiliates or a dietitian who don't sign contracts for Noovit. The treaty also excludes facilities used *only to store or deliver* goods.
- **Could change it later:** hiring staff or a manager in the US, renting an office, or a US person who negotiates and signs deals for Noovit. Moving to our own stock in a 3PL is usually still fine under the treaty's storage exclusion, but review it at the time.
- **Still required either way:** Form 5472 + pro forma 1120 every year; possibly Form 8833 to claim treaty benefits. HMRC's "LLC = company" view can affect treaty access, which is another accountant question.
- **State taxes are separate:** Wyoming has no income tax, but a few states charge **gross-receipts or business taxes** once your sales there pass a threshold (e.g. Washington's B&O tax), even for remote sellers. Stripe Tax covers sales tax, not these; review once sales grow.

## Plan: Noovit LLC pays six3 (owner's UK company) for marketing
Common and legitimate, **if it's done at arm's length**:
- **Written agreement** between Noovit LLC and six3 (scope: marketing, content, ads management), with a **market-rate fee** (e.g. a monthly retainer or % of ad spend, what six3 would charge a stranger).
- **Real services, real invoices** from six3 to Noovit LLC, paid from the **LLC's bank account** to six3's account. No personal accounts in between.
- **UK VAT:** marketing services from a UK business to a business customer outside the UK are generally **outside the scope of UK VAT**, so six3 invoices without VAT (the place of supply is the US). Note "reverse charge / outside scope" on the invoice. Confirm with the accountant.
- **Form 5472:** every payment from Noovit LLC to six3 is a **reportable related-party transaction** on the yearly 5472. Keep a ledger.
- **Transfer pricing:** UK rules generally exempt small and medium-sized businesses, and the US side matters little if the LLC has no US trade or business. The fee should still be defensible, so don't move 100% of the profit with a made-up fee.
- **You** then pay yourself from six3 as normal (salary and dividends), taxed in the UK.
- **Alternative to ask about:** **six3 owns Noovit LLC** (option 3 above). Then Noovit's profit belongs to six3 directly, with no need for a fee to move it. That said, it puts supplement risk under six3's ownership. The LLC still holds the liability, but think about whether that matters to six3's clients or a future sale.

**Accountant questions:** (1) Is the LLC UK-resident under HMRC's "central management and control" test? (2) Is it better owned by me or by six3? (3) Is the marketing fee arrangement sound, and what's a defensible fee? (4) Do I need a US trade-or-business review? (5) How do I report it all on my Self Assessment and six3's accounts?

## Privacy checklist (keep the owner's name off public records)
_Privacy only keeps your name off **public** records. It doesn't change who knows privately (IRS, HMRC, banks, Stripe, Supliful) and it doesn't change any tax you owe._
- [ ] **Wyoming Agents** acts as **registered agent and organizer**, so the public filing shows only Noovit LLC and their name. Ask whether the organizer service is included in the $153.
- [ ] **Operating Agreement** names you as the member. It's private; keep it for the bank and Stripe.
- [ ] **Trademark (USPTO):** file in **Noovit LLC's** name; the attorney signs and is the correspondent. Applications are public.
- [ ] **Google Ads / Merchant Center:** verify as an **organisation (Noovit LLC)**, not an individual; Google's public Ads Transparency Center shows the verified name.
- [ ] **Meta Business / ad account** in the company's name.
- [ ] **Domain:** WHOIS privacy on; move the registrant to Noovit LLC.
- [ ] **Website, emails and labels:** "Noovit LLC" + the Wyoming Agents suite address only. No personal name or address in the footer, privacy policy contact or emails (use support@).
- [ ] **FDA structure/function notifications:** signed with a title ("Member, Noovit LLC"); ask the lawyer what a public-records request would reveal.
- [ ] **Marketplaces later** (Amazon, TikTok Shop): register as the business; they display business details.
- [ ] **If six3 ever owns Noovit,** check with the accountant whether six3's UK filings would list it.
- [ ] Founder posts on LinkedIn or social media will connect you; decide if and when you want that.

## Accountants (Wyoming Agents doesn't do tax or accounting)
- **UK accountant with US LLC experience** (main adviser): structure, HMRC view of the LLC, six3 fee, Self Assessment. Find one through ICAEW's "Find a chartered accountant" (filter for US or international tax), or ask for referrals in UK founder communities. Ask up front: "Have you advised UK residents with Wyoming single-member LLCs and filed or coordinated Form 5472?"
- **US preparer (CPA or Enrolled Agent) for Form 5472 + pro forma 1120** each year, typically a few hundred dollars. Check credentials. The 5472 is due **April 15** for a calendar year, and an extension (Form 7004) **does not** extend the 5472. Even putting money into the LLC (a capital contribution) is a reportable transaction, so it's due even in a year with no sales.
- Some firms do both; one firm for both sides is ideal.

## Budget path (no paid accountant yet)
1. **Ask six3's existing accountant first.** If six3 is a UK Ltd, it already pays an accountant for its accounts and CT600. Ask them to add the five questions above as a small add-on; it's often cheap or folded into the yearly fee.
2. **Use free first calls.** Many UK firms, and firms that specialise in US LLCs for non-residents, offer a free 15–30 minute call. Send the five questions in advance so one short call answers them.
3. **Form the LLC in your own name.** It's cheap, and the US side is clear. Get the UK answer within about 3 months of the first sales (see the deadlines below). While you're reinvesting there will be little or no profit, so there's little at stake at first. Moving ownership to six3 later is simple while the LLC is worth almost nothing.
4. **Do-it-yourself musts (free or nearly free):**
   - **Form 5472 + pro forma 1120 by 15 April every year.** Plenty of founders file it themselves from the IRS instructions (by fax or post), or use a low-cost filing service. Calendar it now; this is the one with the $25k penalty.
   - **Bookkeeping from day one** in free software (e.g. Wave), using the LLC bank account only. Admin → Reports exports orders and revenue as CSV.
   - **Signed six3 service agreement + monthly invoices**, kept with the books.
   - **Never pay yourself directly from the LLC account.** Money goes LLC → six3 (invoice) → you.
5. **Free reading:** HMRC's International Manual on US LLCs (search "INTM180030"), and the IRS Form 5472 instructions.

## Key deadlines (if formed Nov–Dec 2026)
| Date | What | Notes |
|---|---|---|
| **15 Apr 2027** | **Form 5472 + pro forma 1120 for 2026** | Due even with no sales: paying the formation fee into or for the LLC counts as a reportable transaction. **Tip:** if launch isn't before January, forming on or after **1 Jan 2027** avoids a near-empty 2026 filing (the first would then be due 15 Apr 2028). |
| **~3 months after the first sale** | **Only if HMRC treats the LLC as a UK-resident company:** tell HMRC it has started trading (corporation tax registration) | This is the one UK deadline that comes soon after launch, so get the accountant's answer by then. |
| **31 Jan 2028** | **Self Assessment for 2026/27** (UK tax year 6 Apr 2026 – 5 Apr 2027) | Covers any Noovit income from launch to 5 April 2027. The 31 Jan **2027** deadline is for 2025/26, before Noovit existed. |
| **Every anniversary** | Wyoming annual report ($60) | Missing it gets the LLC dissolved. |

## Until six3 exists (launch first)
- six3 isn't formed yet, so there's no marketing fee to pay at launch. Until it exists: **reinvest**. Noovit LLC pays its own costs (Supliful, ads, apps) from its account.
- **Avoid taking money out personally.** Any money moving between you and the LLC (paying costs for it, or taking cash out) is a related-party transaction for the 5472, and how the UK taxes withdrawals depends on the accountant's answer. Keep it simple: put money in only when needed, and take nothing out until six3 and the fee agreement are in place.

## Barbill LLC (formed end of January 2026): owner's other company
_Assumes Barbill is also a Wyoming single-member LLC on a calendar tax year. Confirm the state._
| When | What |
|---|---|
| **~1 Jan 2027** (the first day of its anniversary month) | **Wyoming annual report ($60 minimum)** + registered agent renewal. Due soon. A report left 60 days overdue leads to dissolution |
| **31 Jan 2027** | **UK Self Assessment 2025/26** (6 Apr 2025 – 5 Apr 2026). If Barbill had **any income or activity between formation and 5 April 2026**, it belongs on this return |
| **15 Apr 2027** | **Form 5472 + pro forma 1120 for 2026.** Due even with no income if money moved between you and Barbill (paying its fees, putting money in) |
| Ongoing | If HMRC treats Barbill as a UK-run company, corporation tax registration was due within 3 months of it starting to trade. Ask the accountant when you ask about Noovit |

## Stock from a minimum-order supplier (e.g. Makers Nutrition) later
- Buying stock is **not a cost when you pay for it**. It's an asset ("inventory") until sold, and becomes a cost (cost of goods sold) **as each unit sells**.
- Example: buy 1,000 bottles at $4 ($4,000) in November and sell 300 by year-end → **$1,200** counts as this year's cost; **$2,800** of stock carries into next year.
- **Expired, damaged or unsellable stock can be written down** (supplements have expiry dates, so track batches and dates).
- Cash-flow warning: minimum orders tie up cash, and you can owe tax on profit while the cash sits in boxes. Size orders carefully.
- (Companies use this "accruals" basis. If the accountant decides you're taxed personally instead, simpler cash-basis rules may apply. Ask.)

## UK owner: practical steps
- **EIN without an SSN:** fax Form SS-4 to the IRS, or **phone the IRS international line (+1 267 941 1099)**, which can usually issue the EIN on the call. The "responsible party" is you, with your passport details; no ITIN is needed.
- **Bank:** Mercury and Wise Business have accepted non-US owners of US LLCs. Policies change, so check them when you apply. You'll need the Articles, the EIN letter (CP 575), the Operating Agreement and your passport.
- **Stripe:** check whether Stripe US accepts your LLC with a UK-resident representative without an SSN. If not, the alternatives are Stripe Atlas (a Delaware company) or Stripe UK through a UK Ltd (option 3 or 4 above).
- **Operating Agreement:** a single-member template is fine (many are free). Keep it with the bank documents.

## 1. Why Wyoming (for a non-US owner)
- **Cheap:** about $100 to file, and the annual report is $60 minimum (based on assets in Wyoming).
- **Private:** members aren't listed publicly.
- **No state income tax**, and simple upkeep.
- Delaware only matters if you plan to raise venture capital (usually as a C-corp). Not needed for a DTC shop now; you can convert later.

## 2. Formation steps (about 1–3 weeks, longer for the EIN without an SSN)
1. **Check the name** "Noovit LLC" on the Wyoming Secretary of State business search. Also check USPTO for "NOOVIT" (the trademark item is already on the TODO).
2. **Choose a registered agent** in Wyoming (about $25–150 a year). Pick one that also offers a **mailing address and mail scanning**, because you'll need a US address for the label, emails and banking (see §5).
3. **File the Articles of Organization** online (Wyoming SOS), about $100. Or use a formation service, but check you aren't paying for add-ons you don't need.
4. **Write an Operating Agreement** (single-member). Banks and Stripe ask for it, and it supports the liability shield.
5. **Get the EIN** from the IRS. It's free.
   - **With an SSN/ITIN:** online, the same day.
   - **Without one:** Form SS-4 by fax or post, 4–8 weeks (some agents do this for a fee).
6. **Beneficial ownership (BOI):** since March 2025, FinCEN exempts US-formed companies from BOI reporting. Confirm this still applies when you file.

## 3. Money
- **Business bank account** in the LLC's name. Options include Mercury, Relay and Wise Business; non-resident policies change often, so check each bank's current rules.
- **Stripe:** open the live account in the **LLC's name** with the EIN. Check what Stripe needs from the account representative if you don't have an SSN; Stripe Atlas is the fallback, but it forms a Delaware company. Move the sandbox setup over when the LLC exists.
- **Keep finances separate.** No personal spending from the business account. Mixing them weakens the liability protection.
- **Bookkeeping** from day one (e.g. QuickBooks, Xero or Wave), so year-end filings are easy.

## 4. Tax (confirm with an accountant)
- **Federal:** a single-member LLC is "disregarded" by default.
  - **If you're a non-US owner:** you must file **Form 5472 with a pro forma Form 1120 every year**. The penalty for missing it is $25,000.
  - Whether you owe US income tax depends on whether the business counts as "effectively connected" with the US. With US fulfilment (Supliful) and US customers, get a professional view.
  - Your **home country** may tax the LLC's profits too. How it treats a US LLC varies by country.
- **Sales tax:** where you **sell**, not where you're incorporated, decides this. You owe it in a state once you pass its "economic nexus" threshold, often $100,000 in sales or 200 orders a year.
  - **Turn on Stripe Tax** to track thresholds and collect, and register in each state as you cross its threshold.
  - Check whether supplements are taxable in each state; many states exempt food but tax supplements, and the rules differ.
- **Wyoming annual report** each year on the formation anniversary. Missing it gets the LLC dissolved.

## 5. Supplement-specific obligations (Noovit's name is on the label)
- **Label address:** the label must show the name and place of business of the manufacturer, packer or distributor, for us "Distributed by Noovit LLC, city, state, ZIP". Use the LLC's real US address and replace `[Street address]` / `[City, ST ZIP]` in the label generator.
- **Adverse event reporting:**
  - The label needs a **US address or phone number** for adverse event reports.
  - **Serious adverse events must be reported to the FDA within 15 business days**, by the company named on the label, and records kept for 6 years.
  - Set up a support inbox and a short written procedure.
- **Structure/function notification** to the FDA within 30 days of first selling each product with a claim (already on the TODO). Noovit LLC files it.
- **Facility registration:** the manufacturer (Supliful's facility) is registered. A brand that doesn't hold stock usually isn't required to register; confirm with the lawyer.
- **Product liability insurance:** essential for supplements. Get it before launch; some suppliers ask for a certificate naming them.
- **Prop 65 (California):** check heavy-metal results for botanicals and powders.
- **Trademark "NOOVIT"** filed in the **LLC's name** (classes 5 and 35), not yours personally.

## 6. Update the shop when the LLC exists
- **Admin → Settings:**
  - **Business address:** the real one. Emails must include a physical address under CAN-SPAM; a registered-agent mail address or a USPS-registered mailbox works.
  - **Support email:** the real support address.
- **Legal pages:** company name, address and contact in the privacy policy, terms and returns pages.
- **Labels:** the distributor line and address.
- **Accounts in the LLC's name:** Stripe, Google (Merchant Center, Ads), Meta Business, Supliful and Resend.
- **Then flip pre-launch off** (`SITE_LIVE=true`), as described in the TODO launch-day steps.

## Rough costs (first year)
| Item | Cost |
|---|---|
| Wyoming filing | ~$100 |
| Registered agent + mail address | ~$50–300/yr |
| EIN | free (a service may charge $50–150 without an SSN) |
| Annual report (from year 2) | $60 minimum |
| Accountant (non-US owner, 5472/1120 + advice) | ~$300–1,000/yr |
| Product liability insurance | often ~$500–3,000/yr (quote needed) |
| Trademark (USPTO, 2 classes) | ~$700 + attorney fees |
