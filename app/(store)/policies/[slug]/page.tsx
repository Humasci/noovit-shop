import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LEGAL_NAME } from '@/lib/site';
import { getSettings, supportEmail } from '@/lib/settings';
import { JsonLd } from '@/components/seo/JsonLd';
import { pageLd } from '@/lib/structured-data';

// Drafts (21 Nov audit): written to match what the site actually does. Have a US lawyer review them before launch
// (docs/hiring brief 02). `id` gives a section an anchor (e.g. /policies/privacy#choices).
type Section = { h: string; p: string | string[]; id?: string };
const UPDATED = 'November 21, 2026';
const POLICIES: Record<string, { title: string; intro?: string; sections: Section[] }> = {
  'delivery-returns': {
    title: 'Delivery & Returns',
    sections: [
      { h: 'Shipping', p: 'Free standard shipping on all US orders. Orders usually ship within 1–2 business days and arrive 2–5 business days after shipping. You get a tracking link by email as soon as your order ships. We ship to US addresses only.' },
      { h: '90-day money-back guarantee', p: 'If you are not happy with your purchase, contact us within 90 days of delivery for a full refund of the product price, even if the bottle is empty. One refund per product per customer.' },
      { h: 'Damaged or missing items', p: 'Let us know within 14 days of delivery and we will send a replacement at no cost.' },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    intro: `Last updated ${UPDATED}. This policy explains what personal information Noovit collects, why, who we share it with and the choices you have. It applies to noovit.com and our emails.`,
    sections: [
      { h: 'What we collect', p: [
        'Information you give us: your name, email, shipping address and order details when you buy; your email when you join our list, a waitlist (including which at-home test you are interested in) or contact us; reviews you submit; your answers to the quiz; and questions you type into the AI advisor.',
        'Payment details are entered on Stripe’s secure checkout page. We never see or store your full card number.',
        'Information collected automatically: pages visited, device and browser type, approximate location from your IP address, and cookies or similar technologies (see “Cookies, analytics and ads”).',
      ] },
      { h: 'How we use it', p: 'To process and ship orders, manage subscriptions, provide support, send the emails you asked for (order updates, and marketing only if you opted in), improve the site, prevent fraud and meet legal obligations.' },
      { h: 'Who we share it with', p: [
        'Service providers who work for us: Stripe (payments), Supliful (manufacturing and shipping; receives your name and address), Supabase (database), Vercel (hosting), Resend (email delivery), Google (Tag Manager and Analytics; and Gemini, which answers AI advisor questions), and, if enabled, Klaviyo (email marketing).',
        'Advertising partners (Meta, TikTok, Google) receive limited browsing information through cookies so we can measure and show ads, unless you opt out (below). Under some US state laws this counts as “sharing” or “selling” for targeted advertising.',
        'We may also disclose information to comply with the law, protect our rights, or as part of a business transfer.',
      ] },
      { id: 'cookies', h: 'Cookies, analytics and ads', p: 'We use cookies to keep your cart, remember your choices, measure traffic and, unless you opt out, show relevant ads. Click “Decline” in the cookie banner or “Cookie preferences” in the footer to turn analytics and ad tags off on this browser. We honor the Global Privacy Control browser signal as an opt-out. No analytics or advertising tags run on our at-home test pages.' },
      { id: 'choices', h: 'Your privacy choices', p: [
        'Opt out of targeted advertising and the “sale” or “sharing” of personal information: use “Cookie preferences” in the footer, or turn on Global Privacy Control in your browser.',
        'Unsubscribe from marketing emails with the link in any email.',
        'Depending on where you live (for example California, Colorado, Connecticut, Virginia, Texas, Oregon and other states), you may have the right to know, access, correct, delete or get a copy of your personal information, to limit the use of sensitive information, and to appeal our decision. Email us to make a request; we will verify it and reply within the time the law requires. We will not discriminate against you for using these rights.',
      ] },
      { h: 'Health-related information', p: 'Some information can relate to your health: products you buy, quiz answers, which at-home test you join a waitlist for, or questions you ask the AI advisor. We use it only to provide what you asked for, never for advertising. See our Consumer Health Data Privacy Policy.' },
      { id: 'ai-advisor', h: 'AI advisor', p: 'Questions you type are sent to Google’s Gemini service to generate an answer and are processed under Google’s terms. Please don’t enter personal health details, names or contact information.' },
      { h: 'Retention and security', p: 'We keep order records as long as tax and accounting rules require, and other information only as long as needed for the purposes above. We use encryption in transit and access controls, but no system is perfectly secure.' },
      { h: 'Children', p: 'Our site is not directed to children under 13 and we do not knowingly collect their information. Some products are for adults 18+ only.' },
      { h: 'Changes', p: 'We will post any changes here and update the date above. Significant changes will be highlighted on the site or by email.' },
    ],
  },
  'consumer-health-data': {
    title: 'Consumer Health Data Privacy Policy',
    intro: `Last updated ${UPDATED}. This policy applies to “consumer health data” as defined by Washington’s My Health My Data Act, Nevada SB 370 and similar laws.`,
    sections: [
      { h: 'What we collect', p: 'Products you buy or view that relate to a health goal, your quiz answers (for example goals, symptoms, diet or pregnancy status), which at-home test you join a waitlist for, and questions you ask the AI advisor.' },
      { h: 'Where it comes from', p: 'Directly from you when you shop, take the quiz, join a waitlist or use the advisor.' },
      { h: 'Why we use it', p: 'Only to provide the products and services you request: fulfilling orders, recommending products in the quiz, telling you when a test launches, and answering your question. We do not use it for advertising and we do not sell it.' },
      { h: 'Who we share it with', p: 'Only the service providers needed to deliver those services (Stripe, Supliful, Supabase, Vercel, Resend, and Google Gemini for the advisor), under contracts that limit their use. We do not share it with advertising partners: no analytics or ad tags run on our at-home test pages.' },
      { h: 'Your rights', p: 'You can confirm whether we hold your consumer health data, see it, ask us to delete it, and withdraw consent. Email us from the address you used with us; we will respond within 45 days. You can appeal a decision by replying to our response.' },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    intro: `Last updated ${UPDATED}. These terms apply to your use of noovit.com and any purchase from us.`,
    sections: [
      { h: 'Use of this site', p: 'Content on this site, including guides, the quiz and the AI advisor, is general information, not medical advice. Talk to your doctor before starting a supplement, especially if you are pregnant, breastfeeding, take medication or have a medical condition. These statements have not been evaluated by the Food and Drug Administration. Our products are not intended to diagnose, treat, cure, or prevent any disease.' },
      { h: 'Eligibility', p: 'You must be 18 or older to buy from us. Some products, such as creatine, are sold only to adults 18+, and we ship only to US addresses.' },
      { h: 'Orders and pricing', p: 'Prices are in USD and may change. We may refuse or cancel an order (for example a pricing error or suspected fraud) and will refund any payment in full.' },
      { h: 'Subscriptions', p: 'Subscriptions renew automatically at the frequency and price shown when you subscribed until you cancel. You can change or cancel online from “My Account” at any time before your next billing date. If a subscription price changes, we email you before your next renewal so you can cancel or change it.' },
      { h: 'Returns and guarantee', p: 'See Delivery & Returns for our 90-day money-back guarantee and how to claim it.' },
      { h: 'Discount codes', p: 'One code per order unless stated. Codes have no cash value and may expire.' },
      { h: 'Reviews', p: 'Reviews must be honest and about your own experience. We moderate reviews for spam and offensive content, but we do not remove reviews because they are negative.' },
      { h: 'Intellectual property', p: 'The site’s content, design and brand belong to Noovit LLC and may not be copied without permission.' },
      { h: 'Limitation of liability', p: 'To the extent the law allows, our total liability for any claim relating to a product or this site is limited to the amount you paid for that product. Nothing in these terms limits rights you have under consumer protection law that cannot be waived.' },
      { h: 'Governing law', p: 'These terms are governed by the laws of the State of Wyoming, without regard to conflict-of-law rules. Please contact us first so we can try to resolve any issue informally.' },
    ],
  },
  accessibility: {
    title: 'Accessibility',
    intro: 'We want noovit.com to work for everyone.',
    sections: [
      { h: 'Our approach', p: 'We design and test the site against the Web Content Accessibility Guidelines (WCAG) 2.1 level AA: keyboard navigation, screen-reader labels, text alternatives for images, sufficient color contrast and layouts that work at any screen size.' },
      { h: 'Tell us if something doesn’t work', p: 'If any part of the site is hard to use, email us with the page and the problem. We will reply and help you complete your order another way if needed.' },
    ],
  },
};

const POLICY_DESCRIPTIONS: Record<string, string> = {
  'delivery-returns': 'Free standard shipping on all US orders, delivery times and tracking, damaged items, and our 90-day money-back guarantee.',
  privacy: 'What personal data Noovit collects, who we share it with, cookies and ads, and your privacy choices and rights.',
  terms: 'The terms for using noovit.com: eligibility, how subscriptions renew and how to cancel, returns, liability and governing law.',
  'consumer-health-data': 'How Noovit collects, uses and shares consumer health data, and your rights under Washington, Nevada and similar laws.',
  accessibility: 'Our commitment to an accessible website (WCAG 2.1 AA) and how to tell us if something on noovit.com is hard to use.',
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const policy = POLICIES[slug];
  if (!policy) return { title: 'Page not found | Noovit', robots: { index: false } };
  const description = POLICY_DESCRIPTIONS[slug] ?? `Noovit ${policy.title.toLowerCase()}.`;
  return { title: `${policy.title} | Noovit`, description, alternates: { canonical: `/policies/${slug}` } };
}

export function generateStaticParams() {
  return Object.keys(POLICIES).map((slug) => ({ slug }));
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const policy = POLICIES[(await params).slug];
  if (!policy) notFound();
  const [email, settings] = await Promise.all([supportEmail(), getSettings()]);
  const slug = (await params).slug;
  return (
    <>
    <JsonLd data={pageLd({ path: `/policies/${slug}`, name: policy.title, crumbs: [[policy.title, `/policies/${slug}`]] })} />
    <article className="container max-w-3xl px-6 py-16">
      <h1 className="text-4xl">{policy.title}</h1>
      {policy.intro && <p className="mt-4 text-[var(--color-muted)]">{policy.intro}</p>}
      {policy.sections.map((s) => (
        <section key={s.h} id={s.id} className="mt-8 scroll-mt-28">
          <h2 className="text-xl">{s.h}</h2>
          {(Array.isArray(s.p) ? s.p : [s.p]).map((t) => <p key={t} className="mt-2 text-[var(--color-muted)]">{t}</p>)}
        </section>
      ))}
      <section className="mt-8">
        <h2 className="text-xl">Who we are</h2>
        <p className="mt-2 text-[var(--color-muted)]">
          noovit.com is operated by {LEGAL_NAME}, a Wyoming limited liability company
          {settings.business_address ? `, ${settings.business_address.replace(/^Noovit LLC,?\s*/i, '')}` : ''}. Contact us at{' '}
          <a href={`mailto:${email}`} className="underline">{email}</a>.
        </p>
      </section>
    </article>
    </>
  );
}
