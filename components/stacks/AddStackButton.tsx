'use client';

import { useCart } from '@/lib/store/cart';
import { packOptions } from '@/data/products';
import type { Product } from '@/types';

// One tap: the stack as a one-time purchase (subscribe options live on its product page).
export function AddStackButton({ stack, label = 'Add the stack' }: { stack: Product; label?: string }) {
  const { addItem, open } = useCart();
  const [single] = packOptions(stack, 'one-time');
  return (
    <button type="button" onClick={() => { addItem({ product: stack, mode: 'one-time', ...single }); open?.(); }} className="btn btn-primary">
      {label}
    </button>
  );
}
