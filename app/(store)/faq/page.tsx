import type { Metadata } from 'next';
import { FaqBrowser } from '@/components/faq/FaqBrowser';
import { getStoreProducts } from '@/lib/catalog/server';

export const metadata: Metadata = {
  title: 'FAQ — Shipping, Subscriptions & Products | Noovit',
  description: 'Answers about Noovit supplements, subscriptions, shipping, returns and our 90-day money-back guarantee.',
  alternates: { canonical: '/faq' },
};

export default async function FAQPage() {
  return <FaqBrowser products={await getStoreProducts()} />;
}
