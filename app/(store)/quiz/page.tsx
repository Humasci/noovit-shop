import type { Metadata } from 'next';
import { getStoreProducts } from '@/lib/catalog/server';
import { getSettings } from '@/lib/settings';
import { Quiz } from '@/components/quiz/Quiz';

export const metadata: Metadata = {
  title: 'Supplement Quiz — Find Your Daily Plus | Noovit',
  description: 'Answer a few quick questions about your goals and routine and get three supplement suggestions that fit you.',
  alternates: { canonical: '/quiz' },
};

export default async function QuizPage() {
  const [products, settings] = await Promise.all([getStoreProducts(), getSettings()]);
  return (
    <section className="section bg-[var(--color-soft)]">
      <div className="container px-6">
        <Quiz products={products} code={settings.newsletter_code} />
      </div>
    </section>
  );
}
