import Link from 'next/link';
import { Check } from 'lucide-react';
import type { Product } from '@/types';
import { ProductImage } from '@/components/product/ProductImage';
import { AddStackButton } from '@/components/stacks/AddStackButton';
import { productPath } from '@/lib/urls';
import { heroDose } from '@/lib/labels/svg';
import { formatPrice } from '@/lib/utils/format';

// Stack "folder" card (owner, 20 Nov: file-folder idea, restyled in our look). White card on the site's line colour,
// a folder tab and top edge in the stack's label colour, the studio group shot on the studio cream it was shot on,
// each part with its own label-colour tile (the cross's tile shape), and pill badges like the product cards.
const eyebrow = 'text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]';

export function StackFolder({ stack, parts, index, isNew = false, compact = false }: { stack: Product; parts: Product[]; index: number; isNew?: boolean; compact?: boolean }) {
  const separately = parts.reduce((s, p) => s + p.basePrice, 0);
  const save = separately - stack.basePrice;
  return (
    <article className="relative pt-8">
      {/* folder tab in the stack's colour */}
      <div className="absolute left-0 top-0 flex h-9 items-center gap-2 rounded-t-2xl px-5 text-[11px] font-semibold uppercase tracking-wider text-white" style={{ background: `color-mix(in srgb, ${stack.color} 70%, #000)` }}>
        {stack.name}
      </div>
      <div className="overflow-hidden rounded-3xl rounded-tl-none border border-[var(--color-line)] bg-white" style={{ borderTop: `4px solid ${stack.color}` }}>
        <div className={`grid gap-6 p-5 sm:p-8 ${compact ? 'md:grid-cols-[1fr_1.1fr]' : 'lg:grid-cols-[1fr_1.1fr]'} lg:gap-10`}>
          <Link href={productPath(stack.slug)} aria-label={stack.name} className="block rounded-2xl bg-[var(--studio)] p-4">
            <ProductImage product={stack} sizes="(min-width: 1024px) 40vw, 90vw" className="mx-auto aspect-square w-full max-w-md bg-transparent" />
          </Link>
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              {isNew && <span className="rounded-full bg-[var(--color-navy)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">New</span>}
              {save > 0 && <span className="rounded-full bg-[var(--sage)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-navy)]">Save {formatPrice(save)}</span>}
              {stack.ageRestricted && <span className="rounded-full border border-[var(--color-line)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-navy)]">18+</span>}
            </div>
            <h3 className="mt-3 font-display text-2xl text-[var(--color-navy)] sm:text-3xl">
              <Link href={productPath(stack.slug)} className="hover:text-[var(--color-accent)]">{stack.name}</Link>
            </h3>
            <p className="mt-2 text-[var(--color-muted)]">{stack.description}</p>

            <p className={`mt-6 ${eyebrow}`}>In this stack</p>
            <ul className="mt-2 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
              {parts.map((p) => {
                const d = heroDose(p);
                return (
                  <li key={p.slug} className="flex items-center gap-3 py-3 text-sm">
                    <span aria-hidden className="h-3.5 w-3.5 shrink-0 rounded-[4px]" style={{ background: p.color }} />
                    <Link href={productPath(p.slug)} className="font-semibold text-[var(--color-navy)] hover:text-[var(--color-accent)]">{p.name}</Link>
                    <span className="ml-auto text-right text-[var(--color-muted)]">{d ? `${d.value} ${d.unit} ${d.line.toLowerCase()}` : p.tagline}</span>
                  </li>
                );
              })}
            </ul>

            <p className={`mt-6 ${eyebrow}`}>What it supports</p>
            <ul className="mt-2 space-y-2">
              {stack.benefits.map((b) => (
                <li key={b} className="flex gap-2.5 text-sm text-[var(--color-ink)]">
                  <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" />
                  <span>{b}{/^Supports/.test(b) ? '*' : ''}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
              <div>
                <p className="font-display text-3xl text-[var(--color-navy)]">{formatPrice(stack.basePrice)}</p>
                {save > 0 && <p className="text-sm text-[var(--color-muted)]">{formatPrice(separately)} if bought separately</p>}
              </div>
              <AddStackButton stack={stack} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
