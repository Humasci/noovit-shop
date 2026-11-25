'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/types';
import { packOptions } from '@/data/products';
import { useCart } from '@/lib/store/cart';
import { useStoreConfig } from '@/components/store/StoreConfig';
import { productPath } from '@/lib/urls';

export interface ReorderLine { product: Product; bottles: number; quantity: number }

// Puts past items back in the cart at today's one-time price (opens the cart). In coming-soon mode it links to the
// product page instead, where the Notify-me box is.
export function Reorder({ lines, label = 'Buy again', variant = 'link' }: { lines: ReorderLine[]; label?: string; variant?: 'link' | 'button' }) {
  const addItem = useCart((s) => s.addItem);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const { ordersOpen } = useStoreConfig();
  if (!lines.length) return null;
  const cls = variant === 'button' ? 'btn btn-primary inline-flex items-center gap-2 text-sm' : 'shrink-0 text-xs font-semibold underline';
  if (!ordersOpen) {
    return lines.length === 1 ? <Link href={productPath(lines[0].product.slug)} className={cls}>View product</Link> : null;
  }
  const add = () => {
    for (const l of lines) {
      const options = packOptions(l.product, 'one-time');
      const pack = options.find((o) => o.bottles === l.bottles) ?? options[0];
      if (!pack) continue;
      addItem({ product: l.product, mode: 'one-time', bottles: pack.bottles, pricePerBottle: pack.pricePerBottle });
      const key = `${l.product.id}-one-time-${pack.bottles}`;
      const inCart = useCart.getState().items.find((i) => i.key === key)?.quantity ?? 1;
      if (l.quantity > 1 && inCart < l.quantity) updateQuantity(key, l.quantity);
    }
  };
  return (
    <button type="button" onClick={add} className={cls}>
      {variant === 'button' && <ShoppingCart className="h-4 w-4" aria-hidden />} {label}
    </button>
  );
}
