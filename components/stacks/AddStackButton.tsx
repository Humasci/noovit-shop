'use client';

import { useCart } from '@/lib/store/cart';
import { packOptions } from '@/data/products';
import type { Product } from '@/types';
import Link from 'next/link';
import { useStoreConfig } from '@/components/store/StoreConfig';
import { productPath } from '@/lib/urls';

// One tap: the stack as a one-time purchase (subscribe options live on its product page).
export function AddStackButton({ stack, label = 'Add the stack' }: { stack: Product; label?: string }) {
  const { addItem, open } = useCart();
  const [single] = packOptions(stack, 'one-time');
  const { ordersOpen } = useStoreConfig();
  // Coming soon mode: the stack's page has the "Notify me" form.
  if (!ordersOpen) return <Link href={productPath(stack.slug)} className="btn btn-outline">Coming soon: notify me</Link>;
  return (
    <button type="button" onClick={() => { addItem({ product: stack, mode: 'one-time', ...single }); open?.(); }} className="btn btn-primary">
      {label}
    </button>
  );
}
