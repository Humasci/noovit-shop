'use client';

import { useStoreConfig } from '@/components/store/StoreConfig';
import { formatPrice } from '@/lib/utils/format';

export function AutoDiscountNote({ subtotal }: { subtotal: number }) {
  const { autoDiscount } = useStoreConfig();
  if (!autoDiscount || subtotal <= 0) return null;
  const remaining = autoDiscount.thresholdCents / 100 - subtotal;
  const pct = Math.min(100, (subtotal / (autoDiscount.thresholdCents / 100)) * 100);
  return (
    <div className="rounded-xl bg-[var(--color-soft)] p-3 text-sm">
      {remaining > 0 ? (
        <p>
          Spend <b>{formatPrice(remaining)}</b> more to get <b>{autoDiscount.percent}% off</b> automatically.
        </p>
      ) : (
        <p className="font-semibold text-[var(--color-green)]">
          {autoDiscount.percent}% off applied at checkout. (Can&apos;t be combined with other codes.)
        </p>
      )}
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
        <div className="h-full bg-[var(--color-green)] transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
