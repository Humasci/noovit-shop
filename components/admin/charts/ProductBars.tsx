'use client';

import { useState } from 'react';
import { formatPrice } from '@/lib/utils/format';

export interface ProductBar {
  slug: string;
  name: string;
  revenue: number;
  units: number;
  orders: number;
}

// One series, so one colour (categorical slot 1) for every bar; value at the tip, details on hover/focus.
const COLOR = '#2a78d6';

export function ProductBars({ rows, total }: { rows: ProductBar[]; total: number }) {
  const [hover, setHover] = useState<string | null>(null);
  const max = Math.max(...rows.map((r) => r.revenue), 1);
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => {
        const active = hover === r.slug;
        return (
          <li
            key={r.slug}
            tabIndex={0}
            onPointerEnter={() => setHover(r.slug)}
            onPointerLeave={() => setHover(null)}
            onFocus={() => setHover(r.slug)}
            onBlur={() => setHover(null)}
            className="grid grid-cols-[minmax(8rem,12rem)_1fr] items-center gap-3 rounded-lg px-1 py-0.5 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            aria-label={`${r.name}: ${formatPrice(r.revenue / 100)}, ${r.units} bottles, ${r.orders} orders`}
          >
            <span className="truncate text-sm text-[var(--color-ink)]" title={r.name}>{r.name}</span>
            <span className="flex items-center gap-2">
              <span
                className="h-3.5 rounded-r-[4px] transition-opacity"
                style={{ width: `${Math.max(1, (r.revenue / max) * 100)}%`, maxWidth: 'calc(100% - 7rem)', background: COLOR, opacity: hover && !active ? 0.45 : 1 }}
              />
              <span className="whitespace-nowrap text-xs font-semibold text-[var(--color-ink)]">
                {formatPrice(r.revenue / 100)}
                {active && (
                  <span className="ml-2 font-normal text-[var(--color-muted)]">
                    {r.units} bottles · {r.orders} orders · {total ? Math.round((r.revenue / total) * 100) : 0}%
                  </span>
                )}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
