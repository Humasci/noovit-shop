import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MosaicField } from '@/components/brand/MosaicField';

// One at-home test kit card (tests index and shop page). Plain data only, so client components can render it too.
export interface KitSummary { slug: string; name: string; short: string; markers: number; collection: string; sensitive?: boolean }
export const kitSummary = (k: { slug: string; name: string; short: string; markers: unknown[]; collection: string; sensitive?: boolean }): KitSummary =>
  ({ slug: k.slug, name: k.name, short: k.short, markers: k.markers.length, collection: k.collection, sensitive: k.sensitive });

const CARD = 'group relative flex flex-col overflow-hidden rounded-3xl border border-[var(--color-line)] bg-white p-6 transition hover:border-[var(--color-navy)]';

export function KitCard({ kit: k }: { kit: KitSummary }) {
  const body = (
    <>
      <MosaicField cols={6} rows={5} tile={10} gap={3} anchor="top-right" color="var(--color-navy)" maxOpacity={0.55} animate={false} seed={k.slug.length} className="pointer-events-none absolute right-0 top-0 transition-opacity duration-300 group-hover:opacity-0" />
      <MosaicField cols={6} rows={5} tile={10} gap={3} anchor="top-right" maxOpacity={0.95} animate={false} seed={k.slug.length} className="pointer-events-none absolute right-0 top-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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
