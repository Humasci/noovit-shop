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
    <section className="section relative overflow-hidden bg-[#EEF1FB]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/art/cells-light-quiz.svg?v=1" alt="" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-70" />
      <div className="container relative px-6">
        <Quiz products={products} code={settings.newsletter_code} />
      </div>
    </section>
  );
}
