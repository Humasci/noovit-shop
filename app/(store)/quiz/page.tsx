import type { Metadata } from 'next';
import { getStoreProducts } from '@/lib/catalog/server';
import { getSettings } from '@/lib/settings';
import { Quiz } from '@/components/quiz/Quiz';
import { JsonLd } from '@/components/seo/JsonLd';
import { pageLd } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'Supplement Quiz: Find What Fits Your Goals | Noovit',
  description: 'Answer a few quick questions about your goals and routine and get three supplement suggestions that fit you.',
  alternates: { canonical: '/quiz' },
};

export default async function QuizPage() {
  const [products, settings] = await Promise.all([getStoreProducts(), getSettings()]);
  return (
    <>
    <JsonLd data={pageLd({ path: '/quiz', name: 'Supplement quiz', crumbs: [['Supplement quiz', '/quiz']] })} />
    <section className="section relative overflow-hidden bg-[var(--color-soft)]">
      <div className="container relative px-6">
        <Quiz products={products} code={settings.newsletter_code} />
      </div>
    </section>
    </>
  );
}
