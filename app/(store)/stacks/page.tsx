import type { Metadata } from 'next';
import Link from 'next/link';
import { getStoreProducts } from '@/lib/catalog/server';
import { StackFolder } from '@/components/stacks/StackFolder';
import { stackParts } from '@/lib/stacks';
import { JsonLd } from '@/components/seo/JsonLd';
import { pageLd } from '@/lib/structured-data';
import { productPath } from '@/lib/urls';

export const metadata: Metadata = {
  title: 'Supplement Stacks: Pairs That Work Together | Noovit',
  description: 'Two supplements that work well together, priced below buying them separately: strength, focus, calm, sleep, joints and gut. Free US shipping.',
  alternates: { canonical: '/stacks' },
};

// Stacks newer than this are tagged [ NEW ].
const NEW_STACKS = new Set(['strength-stack', 'her-strength-stack', 'men-strength-stack', 'focus-stack', 'calm-focus-stack', 'glow-stack']);

export default async function StacksPage() {
  const all = await getStoreProducts();
  const stacks = all.filter((p) => p.status === 'active' && p.bundleItems?.length);
  return (
    <>
      <JsonLd data={pageLd({ path: '/stacks', name: 'Supplement stacks', description: metadata.description ?? undefined, crumbs: [['Shop', '/shop'], ['Stacks', '/stacks']], items: stacks.map((s) => ({ name: s.name, path: productPath(s.slug) })) })} />
      <section className="container px-6 pb-6 pt-12 md:pt-16">
        <nav className="mb-4 text-xs text-[var(--color-muted)]"><Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / <span className="text-[var(--color-ink)]">Stacks</span></nav>
        <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-navy)]"><span aria-hidden className="h-1.5 w-1.5 bg-[var(--color-orange)]" /> Noovit stacks</p>
        <h1 className="mt-3 max-w-3xl text-balance font-display text-4xl font-light text-[var(--color-navy)] md:text-6xl">Pairs that work together, for less</h1>
        <p className="mt-4 max-w-2xl text-lg text-[var(--color-ink)]/80">Each stack is two of our formulas that suit the same goal, priced below buying them one at a time. Same bottles, same clearly labeled doses.</p>
      </section>
      <section className="container space-y-12 px-6 pb-20">
        {stacks.map((s, i) => <StackFolder key={s.slug} stack={s} parts={stackParts(s, all)} index={i + 1} isNew={NEW_STACKS.has(s.slug)} />)}
        <p className="text-xs text-[var(--color-muted)]">*These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease.</p>
      </section>
    </>
  );
}
