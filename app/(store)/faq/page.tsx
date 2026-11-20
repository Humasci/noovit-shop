import type { Metadata } from 'next';
import { FaqBrowser } from '@/components/faq/FaqBrowser';
import { getStoreProducts } from '@/lib/catalog/server';
import { JsonLd } from '@/components/seo/JsonLd';
import { pageLd, faqLd } from '@/lib/structured-data';
import { GENERAL_FAQS } from '@/data/content';

export const metadata: Metadata = {
  title: 'FAQ: Shipping, Subscriptions & Products | Noovit',
  description: 'Answers about Noovit supplements, subscriptions, shipping, returns and our 90-day money-back guarantee.',
  alternates: { canonical: '/faq' },
};

export default async function FAQPage() {
  return (
    <>
      <JsonLd data={[...pageLd({ path: '/faq', name: 'Frequently asked questions', crumbs: [['FAQ', '/faq']] }), faqLd(GENERAL_FAQS)]} />
      <FaqBrowser products={await getStoreProducts()} />
    </>
  );
}
