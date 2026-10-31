import Link from 'next/link';
import { ProductEvidence } from '@/lib/evidence';

// "Vs placebo" bars for each key trial: active group in the product colour, placebo in grey, values as text beside
// the bars (identity never by colour alone: the legend and labels name both groups). One scale per result.
export function EvidenceTrials({ evidence, color, guideSlug }: { evidence: ProductEvidence; color: string; guideSlug?: string }) {
  return (
    <div className="space-y-7">
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-[var(--color-muted)]" aria-hidden>
        <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-[2px]" style={{ background: color }} /> {evidence.arm}</span>
        <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-[2px] bg-[#b8bec7]" /> Placebo</span>
      </div>
      {evidence.trials.map((t) => (
        <div key={t.title}>
          <h3 className="text-base">{t.title}</h3>
          <p className="mt-0.5 text-xs text-[var(--color-muted)]">{t.design}</p>
          <dl className="mt-3 space-y-4">
            {t.results.map((r) => {
              const max = Math.max(r.ours, r.placebo);
              const fmt = (v: number) => `${v}${r.unit === '%' ? '%' : ' min'}`;
              return (
                <div key={r.label}>
                  <dt className="text-sm text-[var(--color-ink)]">{r.label}</dt>
                  <dd className="mt-1.5 space-y-1.5" aria-label={`${evidence.arm}: ${fmt(r.ours)}; placebo: ${fmt(r.placebo)}`}>
                    {[
                      { v: r.ours, fill: color, who: evidence.arm },
                      { v: r.placebo, fill: '#b8bec7', who: 'Placebo' },
                    ].map((b) => (
                      <div key={b.who} className="flex items-center gap-2" aria-hidden>
                        <span className="h-3.5 rounded-r-[4px]" style={{ width: `${Math.max(2, (b.v / max) * 72)}%`, background: b.fill }} />
                        <span className="text-xs font-semibold text-[var(--color-navy)]">{fmt(b.v)}</span>
                      </div>
                    ))}
                  </dd>
                </div>
              );
            })}
          </dl>
          {t.note && <p className="mt-2 text-xs text-[var(--color-muted)]">{t.note}</p>}
          <a href={t.source.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs text-[var(--color-accent)] hover:underline">
            {t.source.label}
          </a>
        </div>
      ))}
      <p className="text-xs leading-relaxed text-[var(--color-muted)]">{evidence.caveat}</p>
      {guideSlug && (
        <Link href={`/guides/${guideSlug}`} className="inline-block text-sm font-semibold text-[var(--color-accent)] hover:underline">
          Read the full guide: every study, dose and evidence grade →
        </Link>
      )}
    </div>
  );
}

export function EvidenceTimeline({ evidence }: { evidence: ProductEvidence }) {
  return (
    <ol className="space-y-4">
      {evidence.timeline.map((s) => (
        <li key={s.when} className="grid grid-cols-[6.5rem_1fr] gap-3 text-sm">
          <span className="font-semibold text-[var(--color-navy)]">{s.when}</span>
          <span className="text-[var(--color-ink)]">{s.text}</span>
        </li>
      ))}
    </ol>
  );
}
