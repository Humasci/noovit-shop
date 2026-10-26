'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { X, Minus, Plus, Truck, Trash2 } from 'lucide-react';
import { useCart, cartTotal, cartCount, lineTotal } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils/format';
import { ProductImage } from '@/components/product/ProductImage';
import { Product } from '@/types';
import { CheckoutButton } from './CheckoutButton';

export function CartDrawer({ suggestions }: { suggestions: Product[] }) {
  const { items, isOpen, close, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  if (!isOpen) return null;

  const count = cartCount(items);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={close} />
      <aside className="animate-drawer absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--color-line)] px-6 py-5">
          <h2 className="text-xl">
            Cart ({count} {count === 1 ? 'item' : 'items'})
          </h2>
          <button onClick={close} aria-label="Close cart">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 bg-[var(--color-soft)] py-3 text-sm font-semibold text-[var(--color-navy)]">
          <Truck className="h-4 w-4" /> You&apos;ve unlocked FREE SHIPPING
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="py-12 text-center">
              <p className="mb-6 text-[var(--color-muted)]">Your cart is empty.</p>
              <Link href="/shop" onClick={close} className="btn btn-primary">
                Shop Best Sellers
              </Link>
              <div className="mt-10 grid grid-cols-2 gap-4 text-left">
                {suggestions.map((p) => (
                  <Link key={p.id} href={`/products/${p.slug}`} onClick={close} className="text-sm font-semibold">
                    <ProductImage product={p} className="mb-2 aspect-square w-full rounded-xl" />
                    {p.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-[var(--color-line)]">
              {items.map((item) => (
                <li key={item.key} className="flex gap-4 py-4">
                  <ProductImage product={item.product} className="h-20 w-20 shrink-0 rounded-xl" />
                  <div className="flex-1">
                    <div className="flex justify-between gap-2">
                      <p className="font-bold">{item.product.name}</p>
                      <button onClick={() => removeItem(item.key)} aria-label="Remove">
                        <Trash2 className="h-4 w-4 text-[var(--color-muted)] hover:text-red-600" />
                      </button>
                    </div>
                    <p className="text-xs text-[var(--color-muted)]">
                      {item.bottles} {item.bottles === 1 ? 'bottle' : 'bottles'} ·{' '}
                      {item.mode === 'subscribe' ? `Delivered every ${item.frequency} days` : 'One-time purchase'}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-[var(--color-line)]">
                        <button className="px-3 py-1" onClick={() => updateQuantity(item.key, item.quantity - 1)} aria-label="Decrease">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                        <button className="px-3 py-1" onClick={() => updateQuantity(item.key, item.quantity + 1)} aria-label="Increase">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="font-bold">{formatPrice(lineTotal(item))}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[var(--color-line)] px-6 py-5">
            <div className="mb-4 flex justify-between text-lg font-bold">
              <span>Subtotal</span>
              <span>{formatPrice(cartTotal(items))}</span>
            </div>
            <CheckoutButton />
            <Link href="/cart" onClick={close} className="mt-3 block text-center text-sm font-semibold underline">
              View Cart
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
