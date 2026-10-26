'use client';

import Link from 'next/link';
import { Minus, Plus, Trash2, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useCart, cartTotal, lineTotal } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils/format';
import { ProductImage } from '@/components/product/ProductImage';
import { CheckoutButton } from '@/components/cart/CheckoutButton';
import { useHydrated } from '@/lib/useHydrated';

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCart();
  const hydrated = useHydrated();
  if (!hydrated) return <div className="min-h-[60vh]" />;

  if (items.length === 0) {
    return (
      <div className="container px-6 py-24 text-center">
        <h1 className="text-4xl">Your cart is empty</h1>
        <Link href="/shop" className="btn btn-primary mt-8">Shop Best Sellers</Link>
      </div>
    );
  }

  return (
    <div className="container grid gap-10 px-6 py-12 lg:grid-cols-[1fr_380px]">
      <div>
        <h1 className="mb-8 text-4xl">Your Cart</h1>
        <ul className="divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
          {items.map((item) => (
            <li key={item.key} className="flex gap-5 py-6">
              <Link href={`/products/${item.product.slug}`}>
                <ProductImage product={item.product} className="h-28 w-28 rounded-2xl" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-4">
                  <div>
                    <Link href={`/products/${item.product.slug}`} className="text-lg font-bold">{item.product.name}</Link>
                    <p className="text-sm text-[var(--color-muted)]">
                      {item.bottles} {item.bottles === 1 ? 'bottle' : 'bottles'} × {formatPrice(item.pricePerBottle)}
                    </p>
                    <p className="text-sm text-[var(--color-muted)]">
                      {item.mode === 'subscribe' ? `Subscription · every ${item.frequency} days` : 'One-time purchase'}
                    </p>
                  </div>
                  <span className="font-bold">{formatPrice(lineTotal(item))}</span>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-full border border-[var(--color-line)]">
                    <button className="px-3 py-2" onClick={() => updateQuantity(item.key, item.quantity - 1)} aria-label="Decrease">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button className="px-3 py-2" onClick={() => updateQuantity(item.key, item.quantity + 1)} aria-label="Increase">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.key)} className="flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-red-600">
                    <Trash2 className="h-4 w-4" /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <aside className="h-fit rounded-3xl bg-[var(--color-soft)] p-8 lg:sticky lg:top-24">
        <h2 className="text-2xl">Order Summary</h2>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(cartTotal(items))}</dd></div>
          <div className="flex justify-between"><dt>Shipping</dt><dd className="font-semibold text-[var(--color-green)]">Free</dd></div>
          <div className="flex justify-between border-t border-[var(--color-line)] pt-3 text-lg font-bold">
            <dt>Total</dt><dd>{formatPrice(cartTotal(items))}</dd>
          </div>
          <p className="text-xs text-[var(--color-muted)]">Taxes and discount codes are applied at checkout.</p>
        </dl>
        <div className="mt-6">
          <CheckoutButton />
        </div>
        <ul className="mt-6 space-y-2 text-sm text-[var(--color-muted)]">
          <li className="flex items-center gap-2"><Truck className="h-4 w-4" /> Free shipping on every order</li>
          <li className="flex items-center gap-2"><RotateCcw className="h-4 w-4" /> 90-day money-back guarantee</li>
          <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Secure checkout</li>
        </ul>
      </aside>
    </div>
  );
}
