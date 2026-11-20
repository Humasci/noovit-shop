import Link from 'next/link';
import type { Product } from '@/types';
import { ProductImage } from '@/components/product/ProductImage';
import { AddStackButton } from '@/components/stacks/AddStackButton';
import { productPath } from '@/lib/urls';
import { heroDose } from '@/lib/labels/svg';
import { formatPrice } from '@/lib/utils/format';

// "Evidence file" folder card (owner, 20 Nov; after a file-folder layout the owner liked, in Noovit's style): a tabbed cream
// folder, an index number, the group shot on a darker panel with corner ticks, and a numbered spec list with dashed rules.
const Tick = ({ className }: { className: string }) => <span aria-hidden className={`absolute h-3 w-3 border-[var(--color-navy)]/30 ${className}`} />;

export function StackFolder({ stack, parts, index, isNew = false, compact = false }: { stack: Product; parts: Product[]; index: number; isNew?: boolean; compact?: boolean }) {
  const separately = parts.reduce((s, p) => s + p.basePrice, 0);
  const save = separately - stack.basePrice;
  const n = String(index).padStart(2, '0');
  return (
    <article className="relative pt-9">
      {/* folder tab */}
      <div aria-hidden className="absolute left-0 top-0 h-10 w-56 rounded-t-2xl bg-[#E6DED1] [clip-path:polygon(0_0,82%_0,100%_100%,0_100%)]" />
      <p className="absolute left-6 top-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-navy)]">
        <span aria-hidden className="h-1.5 w-1.5 bg-[var(--color-orange)]" /> Stack {n}
      </p>
      <div className="rounded-[1.75rem] rounded-tl-none bg-[#E6DED1] p-5 sm:p-8">
        <div className={`grid gap-6 ${compact ? 'md:grid-cols-[1fr_1.1fr]' : 'lg:grid-cols-[1fr_1.1fr]'} lg:gap-10`}>
          <div className="relative rounded-2xl bg-[var(--studio)] p-5">
            <Tick className="left-2 top-2 border-l border-t" /><Tick className="right-2 top-2 border-r border-t" />
            <Tick className="bottom-2 left-2 border-b border-l" /><Tick className="bottom-2 right-2 border-b border-r" />
            <div className="flex items-start gap-4">
              <span className="font-mono text-xs text-[var(--color-muted)]">[ {index} ]</span>
              <h3 className="font-display text-2xl text-[var(--color-navy)] sm:text-3xl">
                <Link href={productPath(stack.slug)} className="hover:underline">{stack.name}</Link>
                {isNew && <sup className="ml-2 bg-[var(--color-orange)] px-1.5 py-0.5 align-top font-mono text-[10px] tracking-wider text-white">[ NEW ]</sup>}
              </h3>
            </div>
            <Link href={productPath(stack.slug)} aria-label={stack.name} className="mt-2 block">
              <ProductImage product={stack} sizes="(min-width: 1024px) 40vw, 90vw" className="mx-auto aspect-square w-full max-w-md bg-transparent" />
            </Link>
          </div>
          <div className="flex flex-col">
            <p className="text-[var(--color-ink)]">{stack.description}</p>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-navy)]">In this stack</p>
            <ol className="mt-2">
              {parts.map((p, i) => {
                const d = heroDose(p);
                return (
                  <li key={p.slug} className="grid grid-cols-[3rem_1fr_auto] items-baseline gap-3 border-b border-dashed border-[var(--color-navy)]/25 py-2.5 text-sm">
                    <span className="font-mono text-xs text-[var(--color-muted)]">1.{i + 1}</span>
                    <Link href={productPath(p.slug)} className="font-semibold text-[var(--color-navy)] hover:underline">{p.name}</Link>
                    <span className="text-right text-[var(--color-ink)]/80">{d ? `${d.value} ${d.unit} ${d.line.toLowerCase()}` : p.tagline}</span>
                  </li>
                );
              })}
            </ol>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-navy)]">What it supports</p>
            <ol className="mt-2">
              {stack.benefits.map((b, i) => (
                <li key={b} className="grid grid-cols-[3rem_1fr] gap-3 border-b border-dashed border-[var(--color-navy)]/25 py-2.5 text-sm">
                  <span className="font-mono text-xs text-[var(--color-muted)]">2.{i + 1}</span>
                  <span>{b}{/^Supports/.test(b) ? '*' : ''}</span>
                </li>
              ))}
            </ol>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-display text-3xl text-[var(--color-navy)]">{formatPrice(stack.basePrice)}</p>
                {save > 0 && <p className="text-sm text-[var(--color-muted)]">{formatPrice(separately)} bought separately · you save {formatPrice(save)}</p>}
              </div>
              <AddStackButton stack={stack} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
