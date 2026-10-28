# Accounting & company brief (paste into a new chat)

_Prepared 28 Oct 2026 to start a dedicated accounting/company chat. Everything below is context gathered so far. It is not professional advice, and the open questions are exactly what still needs checking._

---

**Copy everything from here down into the new chat:**

I'm a **UK tax resident** setting up a US e-commerce business while bootstrapping (I can't pay for an accountant yet). Please help me plan the company, tax and compliance side step by step. Be clear when something needs a professional, and tell me the cheapest safe way to do each thing. Today is 28 October 2026.

## My situation
- **Me:** UK resident individual. I file UK Self Assessment.
- **Barbill LLC:** my existing **Wyoming single-member LLC**, formed **end of January 2026** (calendar tax year). It has its own EIN.
- **six3:** a UK marketing agency I plan to set up (a UK Ltd), **not formed yet**.
- **Noovit:** a new supplement brand (noovit.com) selling **only to US consumers**. Products are made and drop-shipped in the US by **Supliful** (made to order, so I hold no stock). Payments run through **Stripe**; the site is hosted on Vercel. No US staff, office or warehouse. The site is in pre-launch mode, and I want to launch **before six3 exists**.

## Decisions so far
- Form a **new Wyoming LLC for Noovit** (separate from Barbill, because supplements carry product-liability risk), owned by me personally.
- Use **Wyoming Agents** (wyomingagents.com): **$153** formation (includes the $103 state fee + year 1 of the $25/yr registered agent). Ask them to **sign as organizer** to keep my name off the public record. Add their **mail-scanning suite (from $49/yr)** as the US address for product labels, emails and the bank. File the annual report myself ($60), not through their $100 service.
- Noovit needs **its own new EIN** (Barbill's can't be reused). I'll get it from the IRS international line, +1 267 941 1099, or by faxing Form SS-4.
- **Reinvest** revenue into stock, ads and content. Later, once six3 exists, Noovit pays six3 an **arm's-length marketing fee**, and I pay myself through six3 (UK tax).
- **Until six3 exists:** Noovit pays its own costs; I take nothing out personally.

## What I've understood (please confirm or correct)
1. **US income tax:** a single-member LLC owned by a non-resident is "disregarded". If it has **no US trade or business** (and, under the **US–UK treaty, no US permanent establishment**), there's **no US income tax at any profit level**. Selling online to US customers with an independent US fulfilment provider (Supliful), Stripe, a registered agent address and a US bank account usually doesn't create one. US staff, an office, or a US agent signing contracts could.
2. **US filing:** the LLC must file **Form 5472 + pro forma Form 1120 every year by 15 April**, even with no income, because any money moving between me and the LLC is reportable. The **$25,000 penalty** applies if it's missed. A Form 7004 extension does **not** extend the 5472. Payments to six3 later are related-party transactions for the 5472 too.
3. **UK:** I'm UK-resident, so the profit is taxable in the UK. HMRC **generally treats a US LLC as a company (opaque)** (see INTM180030). If it's **managed and controlled from the UK**, it may be **UK tax-resident**, meaning UK corporation tax (19–25%) and HMRC registration within **3 months of starting to trade**. The US and UK treat it differently, so there's a double-tax or treaty-access risk.
4. **Thresholds that are NOT income-tax allowances:** US state sales tax nexus (often $100k or 200 orders per state; I'll use Stripe Tax); UK VAT registration at £90k (UK sales only). A few states (e.g. Washington B&O) charge gross-receipts taxes above a threshold.
5. **Accounting basis:** profit is per financial year. Cash kept at year-end still counts as profit. Prepayments for next year aren't this year's cost. Stock (if I ever buy minimum-order stock, e.g. from Makers Nutrition) only becomes a cost when sold; unsold stock is an asset, and expired stock can be written down.
6. **six3 fee (later):** needs a written agreement, a market-rate fee, real services, invoices, and payment LLC bank → six3 bank. Probably outside the scope of UK VAT (B2B services to a non-UK customer). UK transfer-pricing rules generally exempt SMEs, but the fee must still be defensible.
7. **Privacy:** Wyoming doesn't publish owners. Wyoming Agents as agent and organizer keeps my name off the public filing. Privacy **doesn't** change any tax I owe, and HMRC and the IRS know anyway.
8. **BOI reporting:** since March 2025, FinCEN exempts US-formed companies. Please confirm this is still the case.

## Deadlines I know about
| When | Company | What |
|---|---|---|
| ~1 Jan 2027 | Barbill (Wyoming) | Annual report ($60 min) + registered agent renewal (due the first day of its anniversary month; 60 days overdue → dissolution) |
| 31 Jan 2027 | Me | UK Self Assessment 2025/26 (6 Apr 2025 – 5 Apr 2026). Does any Barbill activity before 5 Apr 2026 belong on it? |
| 15 Apr 2027 | Barbill | Form 5472 + pro forma 1120 for 2026 |
| 15 Apr 2027 | Noovit (if formed in 2026) | Form 5472 for 2026. Forming on or after 1 Jan 2027 would move its first filing to 15 Apr 2028 |
| ~3 months after Noovit's first sale | Noovit | Only if HMRC treats it as a UK-resident company: corporation tax registration |
| 31 Jan 2028 | Me | Self Assessment 2026/27 (covers Noovit from launch to 5 Apr 2027) |
| Each anniversary | Noovit (Wyoming) | Annual report ($60 min) |

## Supplement-specific obligations (on the company named on the label)
- Label line "Distributed by Noovit LLC" with a US address; a **US address or phone number for adverse event reports**; **serious adverse events reported to the FDA within 15 business days**; records kept for 6 years.
- **FDA structure/function notification** within 30 days of first sale of each product with a claim.
- **Product liability insurance** before launch; Prop 65 check for California; trademark "NOOVIT" filed in the LLC's name.

## What I need help with in this chat
1. **Structure:** is my plan sensible for a UK resident (LLC owned by me, pay six3 later), or should six3 own Noovit LLC, or should I elect C-corp taxation? Which is cheapest and safest at my stage?
2. **How HMRC will most likely see Noovit LLC and Barbill LLC** (opaque vs transparent; UK-resident through central management and control?). What I should register or report, and when.
3. **Barbill:** what's due now: the annual report, the 2025/26 Self Assessment, the 2026 Form 5472. Is anything already late?
4. **Form 5472 DIY:** a step-by-step guide to preparing and filing it myself (fax or post), and what records to keep.
5. **Bookkeeping setup** with free tools (e.g. Wave): chart of accounts for an e-commerce supplement business, recording Stripe payouts, Supliful costs, ad spend and owner contributions.
6. **Banking and Stripe** for a UK-resident owner of a US LLC: which bank (Mercury, Wise Business), and whether Stripe US accepts me without an SSN.
7. **six3 service agreement** outline and a sensible way to set the fee.
8. **A calendar** of every deadline for me, Barbill, Noovit and later six3.

---

_Related project files (in the Noovit repo): `docs/COMPANY_SETUP.md` (full plan, privacy checklist, budget path), `docs/TODO.md` ("Company first" section)._
