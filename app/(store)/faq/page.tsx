import type { Metadata } from 'next';
import { FaqBrowser } from '@/components/faq/FaqBrowser';
import { getStoreProducts } from '@/lib/catalog/server';

export const metadata: Metadata = { title: 'FAQ — Noovit', description: 'Answers about Noovit products, subscriptions, shipping and returns.' };

export default async function FAQPage() {
  return <FaqBrowser products={await getStoreProducts()} />;
}
