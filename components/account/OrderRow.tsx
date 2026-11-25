import Link from 'next/link';
import { ChevronRight, Truck } from 'lucide-react';
import type { AccountOrder } from '@/lib/account/data';
import { day, money, orderStatus } from '@/lib/account/format';
import { Badge } from './ui';

// One order in a list: number, date, items in a line, status, tracking, link to the detail page.
export function OrderRow({ o }: { o: AccountOrder }) {
  const st = orderStatus(o.status);
  const track = o.shipments.find((s) => s.trackingUrl);
  return (
    <li className="rounded-2xl border border-[var(--color-line)] bg-white p-5" data-testid="account-order">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link href={`/account/orders/${o.number}`} className="font-semibold hover:underline">
          Order #{o.number} <span className="font-normal text-[var(--color-muted)]">· {day(o.placed)}</span>
        </Link>
        <Badge tone={st.tone}>{st.label}</Badge>
      </div>
      <p className="mt-2 text-sm text-[var(--color-muted)]">
        {o.items.map((i) => `${i.name}${i.bottles > 1 ? ` (${i.bottles}-pack)` : ''}${i.quantity > 1 ? ` × ${i.quantity}` : ''}`).join(', ')} · {money(o.totalCents)}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold">
        {track?.trackingUrl && (
          <a href={track.trackingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 underline"><Truck className="h-4 w-4" aria-hidden /> Track package</a>
        )}
        <Link href={`/account/orders/${o.number}`} className="inline-flex items-center gap-0.5 underline">Order details <ChevronRight className="h-4 w-4" aria-hidden /></Link>
      </div>
    </li>
  );
}
