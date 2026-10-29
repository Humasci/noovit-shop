import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LEGAL_NAME } from '@/lib/site';
import { getSettings, supportEmail } from '@/lib/settings';

// PLACEHOLDER: have these reviewed by a lawyer before launch.
const POLICIES: Record<string, { title: string; sections: { h: string; p: string }[] }> = {
  'delivery-returns': {
    title: 'Delivery & Returns',
    sections: [
      { h: 'Shipping', p: 'Free standard shipping on all US orders. Orders usually ship within 1–2 business days and arrive 2–5 business days after dispatch. You get a tracking link by email as soon as your order ships.' },
      { h: '90-day money-back guarantee', p: 'If you are not happy with your purchase, contact us within 90 days of delivery for a full refund of the product price — even if the bottle is empty.' },
      { h: 'Damaged or missing items', p: 'Let us know within 14 days of delivery and we will send a replacement at no cost.' },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    sections: [
      { h: 'What we collect', p: 'We collect the information you give us when you place an order, create an account or sign up for emails, plus basic analytics about how the site is used.' },
      { h: 'How we use it', p: 'To fulfil orders, manage subscriptions, provide support and — with your consent — send marketing emails. We never sell your personal data.' },
      { h: 'Your rights', p: 'You can access, correct or delete your data at any time by emailing hello@noovit.com.' },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    sections: [
      { h: 'Use of this site', p: 'By using this website you agree to these terms. Content is for information only and is not medical advice.' },
      { h: 'Subscriptions', p: 'Subscriptions renew automatically at the selected frequency until cancelled. You can change or cancel online at any time before your next billing date, or contact us to pause.' },
      { h: 'Pricing', p: 'Prices are in USD and may change. Subscribers keep the price they signed up at.' },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const policy = POLICIES[slug];
  if (!policy) return {};
  return { title: `${policy.title} — Noovit`, description: `Noovit ${policy.title.toLowerCase()}.`, alternates: { canonical: `/policies/${slug}` } };
}

export function generateStaticParams() {
  return Object.keys(POLICIES).map((slug) => ({ slug }));
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const policy = POLICIES[(await params).slug];
  if (!policy) notFound();
  const [email, settings] = await Promise.all([supportEmail(), getSettings()]);
  return (
    <article className="container max-w-3xl px-6 py-16">
      <h1 className="text-4xl">{policy.title}</h1>
      {policy.sections.map((s) => (
        <section key={s.h} className="mt-8">
          <h2 className="text-xl">{s.h}</h2>
          <p className="mt-2 text-[var(--color-muted)]">{s.p}</p>
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
  );
}
