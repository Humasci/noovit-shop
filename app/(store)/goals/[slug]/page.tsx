import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getStoreProducts } from '@/lib/catalog/server';
import { productsForGoal } from '@/lib/quiz';
import { GOAL_PAGES, findGoal } from '@/lib/goals';
import { ProductCard } from '@/components/product/ProductCard';
import { TrustSection } from '@/components/sections/Sections';

export function generateStaticParams() {
  return GOAL_PAGES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const goal = findGoal((await params).slug);
  if (!goal) return {};
  return { title: goal.seoTitle, description: goal.seoDescription, alternates: { canonical: `/goals/${goal.slug}` } };
}

export default async function GoalPage({ params }: { params: Promise<{ slug: string }> }) {
  const goal = findGoal((await params).slug);
  if (!goal) notFound();
  const items = productsForGoal(await getStoreProducts(), goal.goal);

  return (
    <>
      <section className="bg-[var(--color-soft)]">
        <div className="container px-6 py-14 md:py-20">
          <nav className="mb-4 text-xs text-[var(--color-muted)]">
            <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / <span className="text-[var(--color-ink)]">{goal.name}</span>
          </nav>
          <h1 className="max-w-2xl text-balance text-3xl sm:text-4xl md:text-5xl">{goal.title}</h1>
          <p className="mt-4 max-w-xl text-lg text-[var(--color-ink)]/80">{goal.intro}</p>
          <nav aria-label="Other goals" className="mt-8 flex flex-wrap gap-2">
            {GOAL_PAGES.map((g) => (
              <Link
                key={g.slug}
                href={`/goals/${g.slug}`}
                aria-current={g.slug === goal.slug ? 'page' : undefined}
                className={`rounded px-4 py-2 text-sm font-semibold ${g.slug === goal.slug ? 'bg-[var(--color-navy)] text-white' : 'bg-white hover:bg-white/70'}`}
              >
                {g.name}
              </Link>
            ))}
          </nav>
        </div>
      </section>
      <section className="section">
        <div className="container px-6">
          {items.length === 0 ? (
            <p className="text-center text-[var(--color-muted)]">New products for this goal are on the way.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
          <div className="mx-auto mt-14 max-w-xl rounded-3xl bg-[var(--color-soft)] p-8 text-center">
            <h2 className="text-2xl">Not sure which one is right for you?</h2>
            <p className="mt-2 text-[var(--color-muted)]">Take the 2-minute quiz for suggestions based on your goals, diet and life stage.</p>
            <Link href="/quiz" className="btn btn-primary mt-5">Take the quiz</Link>
          </div>
        </div>
      </section>
      <TrustSection />
      <p className="container px-6 pb-10 text-center text-xs text-[var(--color-muted)]">
        *These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease.
      </p>
    </>
  );
}
