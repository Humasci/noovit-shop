import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MosaicCorner } from '@/components/brand/MosaicCorner';

// One at-home test kit card (tests index, shop page, homepage). Plain data only (built by kitSummary in lib/tests),
// so client components can render it without pulling in the kit data.
export interface KitSummary { slug: string; name: string; short: string; markers: number; collection: string; sensitive?: boolean; color: string; line: string }

const CARD = 'group relative flex flex-col overflow-hidden rounded-3xl border border-[var(--color-line)] bg-white p-6 transition hover:border-[var(--color-navy)]';

export function KitCard({ kit: k }: { kit: KitSummary }) {
  const body = (
    <>
      {/* The kit corner shape in the service line's colour (owner, 25 Nov). */}
      <MosaicCorner color={k.color} className="transition-transform duration-300 group-hover:scale-105" />
      <p className="mb-2 flex items-center gap-2 pr-20 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]"><span aria-hidden className="h-2 w-2 rounded-[2px]" style={{ background: k.color }} /> {k.line}</p>
      <h3 className="pr-16 text-xl">{k.name}</h3>
      <p className="mt-2 flex-1 text-sm text-[var(--color-ink)]/80">{k.short}</p>
      <p className="mt-4 text-xs text-[var(--color-muted)]">Coming soon · {k.markers} {k.markers === 1 ? 'marker' : 'markers'} · {k.collection}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-navy)]">See what it measures <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
    </>
  );
  const href = `/at-home-tests/${k.slug}`;
  // Privacy-sensitive kits open with a full page load (plain <a>), so analytics tags from this page don't carry over.
  return k.sensitive ? <a href={href} className={CARD}>{body}</a> : <Link href={href} className={CARD}>{body}</Link>;
}
