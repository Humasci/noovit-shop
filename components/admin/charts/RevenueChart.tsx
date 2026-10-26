'use client';

import { useState } from 'react';
import { formatPrice } from '@/lib/utils/format';

export interface DayPoint {
  date: string;
  subscription: number;
  oneTime: number;
}

// Categorical slots 1–2 from the validated reference palette (light mode, white surface: all checks pass).
const SERIES = [
  { key: 'subscription' as const, label: 'Subscription', color: '#2a78d6' },
  { key: 'oneTime' as const, label: 'One-time', color: '#eb6834' },
];

const W = 800;
const H = 260;
const PAD = { top: 12, right: 8, bottom: 26, left: 52 };
const GAP = 2; // surface gap between stacked segments
const R = 4; // rounded data-end

const compact = (cents: number) => {
  const v = cents / 100;
  return v >= 1000 ? `$${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}K` : `$${Math.round(v)}`;
};

function niceMax(v: number) {
  if (v <= 0) return 10000;
  const exp = 10 ** Math.floor(Math.log10(v));
  const n = v / exp;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * exp;
}

// Rect with only the top corners rounded (the data end); square at the baseline.
function topRounded(x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, h, w / 2);
  return `M${x},${y + h}V${y + rr}Q${x},${y} ${x + rr},${y}H${x + w - rr}Q${x + w},${y} ${x + w},${y + rr}V${y + h}Z`;
}

const dayLabel = (d: string, long = false) =>
  new Date(`${d}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', ...(long ? { weekday: 'short' } : {}), timeZone: 'UTC' });

export function RevenueChart({ data }: { data: DayPoint[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const totals = data.map((d) => d.subscription + d.oneTime);
  const max = niceMax(Math.max(...totals, 0));
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const band = innerW / data.length;
  const barW = Math.max(2, Math.min(24, band * 0.7));
  const y = (v: number) => PAD.top + innerH - (v / max) * innerH;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);
  const labelEvery = Math.ceil(data.length / 7);
  const active = hover !== null ? data[hover] : null;

  return (
    <div className="relative">
      <div className="mb-3 flex gap-5 text-xs text-[var(--color-muted)]">
        {SERIES.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} /> {s.label}
          </span>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Net revenue per day, split into subscription and one-time orders">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="#e5e9f0" strokeWidth={1} />
            <text x={PAD.left - 8} y={y(t)} textAnchor="end" dominantBaseline="middle" fontSize={11} fill="#6b7280">
              {compact(t)}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const cx = PAD.left + band * i + band / 2;
          const x = cx - barW / 2;
          const dim = hover !== null && hover !== i;
          let base = y(0);
          const segments = SERIES.filter((s) => d[s.key] > 0);
          return (
            <g key={d.date} opacity={dim ? 0.45 : 1}>
              {segments.map((s, si) => {
                const h = Math.max(1, y(0) - y(d[s.key]) - (si > 0 ? GAP : 0));
                const top = base - h - (si > 0 ? GAP : 0);
                const isTop = si === segments.length - 1;
                const path = isTop ? topRounded(x, top, barW, h, R) : `M${x},${top}h${barW}v${h}h${-barW}Z`;
                base = top;
                return <path key={s.key} d={path} fill={s.color} />;
              })}
              {i % labelEvery === 0 && (
                <text x={cx} y={H - 8} textAnchor="middle" fontSize={11} fill="#6b7280">
                  {dayLabel(d.date)}
                </text>
              )}
              <rect
                x={PAD.left + band * i}
                y={PAD.top}
                width={band}
                height={innerH}
                fill="transparent"
                tabIndex={0}
                aria-label={`${dayLabel(d.date, true)}: ${formatPrice(totals[i] / 100)}`}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                className="outline-none"
              />
            </g>
          );
        })}
        <line x1={PAD.left} x2={W - PAD.right} y1={y(0)} y2={y(0)} stroke="#cbd2dc" strokeWidth={1} />
      </svg>
      {active && hover !== null && (
        <div
          className="pointer-events-none absolute top-8 z-10 min-w-40 rounded-xl border border-[var(--color-line)] bg-white p-3 text-xs shadow-lg"
          style={{
            left: `${((PAD.left + band * hover + band / 2) / W) * 100}%`,
            transform: hover > data.length / 2 ? 'translateX(calc(-100% - 12px))' : 'translateX(12px)',
          }}
        >
          <p className="mb-1 text-[var(--color-muted)]">{dayLabel(active.date, true)}</p>
          <p className="mb-1.5 text-sm font-bold text-[var(--color-navy)]">{formatPrice(totals[hover] / 100)}</p>
          {[...SERIES].reverse().map((s) => (
            <p key={s.key} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-[var(--color-muted)]">
                <span className="h-0.5 w-3" style={{ background: s.color }} /> {s.label}
              </span>
              <span className="font-semibold text-[var(--color-ink)]">{formatPrice(active[s.key] / 100)}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
