'use client';

import { useRef } from 'react';
import { useDialog } from '@/lib/useDialog';
import Link from 'next/link';
import { X, Minus, Plus, Truck, Trash2 } from 'lucide-react';
import { useCart, cartTotal, cartCount, lineTotal } from '@/lib/store/cart';
import { cartPairings, swappableStack } from '@/lib/stacks';
import { formatPrice } from '@/lib/utils/format';
import { ProductImage } from '@/components/product/ProductImage';
import { Product } from '@/types';
import { CheckoutButton } from './CheckoutButton';
import { AutoDiscountNote } from './AutoDiscountNote';
import { packOptions } from '@/data/products';
import { productPath } from '@/lib/urls';

export function CartDrawer({ suggestions, catalog = [] }: { suggestions: Product[]; catalog?: Product[] }) {
  const { items, isOpen, close, updateQuantity, removeItem } = useCart();
  const panel = useRef<HTMLElement>(null);
  useDialog(panel, isOpen, close);

  if (!isOpen) return null;

  const count = cartCount(items);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={close} aria-hidden />
      <aside
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        tabIndex={-1}
        className="animate-drawer absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl outline-none"
      >
        <div className="flex items-center justify-between border-b border-[var(--color-line)] px-6 py-5">
          <h2 id="cart-title" className="text-xl">
            Cart ({count} {count === 1 ? 'item' : 'items'})
          </h2>
          <button onClick={close} aria-label="Close cart" className="-m-2 p-2">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 bg-[var(--color-soft)] py-3 text-sm font-semibold text-[var(--color-navy)]">
          <Truck className="h-4 w-4" /> Free US shipping on every order
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="py-12 text-center">
              <p className="mb-6 text-[var(--color-muted)]">Your cart is empty.</p>
              <Link href="/shop" onClick={close} className="btn btn-primary">
                Shop Best Sellers
              </Link>
              <div className="mt-10 grid grid-cols-2 gap-4 text-left">
                {suggestions.slice(0, 4).map((p) => (
                  <Link key={p.id} href={productPath(p.slug)} onClick={close} className="text-sm font-semibold">
                    <ProductImage product={p} sizes="160px" className="mb-2 aspect-square w-full rounded-xl" />
                    {p.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-[var(--color-line)]">
              {items.map((item) => (
                <li key={item.key} className="flex gap-4 py-4">
                  <ProductImage product={item.product} sizes="80px" className="h-20 w-20 shrink-0 rounded-xl" />
                  <div className="flex-1">
                    <div className="flex justify-between gap-2">
                      <p className="font-bold">{item.product.name}</p>
                      <button onClick={() => removeItem(item.key)} aria-label={`Remove ${item.product.name}`} className="-m-2 p-2">
                        <Trash2 className="h-4 w-4 text-[var(--color-muted)] hover:text-red-600" />
                      </button>
                    </div>
                    <p className="text-xs text-[var(--color-muted)]">
                      {item.product.bundleItems?.length ? `Bundle (${item.product.bundleItems.length} bottles)` : `${item.bottles} ${item.bottles === 1 ? 'bottle' : 'bottles'}`} ·{' '}
                      {item.mode === 'subscribe' ? `Delivered every ${item.frequency} days` : 'One-time purchase'}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded border border-[var(--color-line)]">
                        <button className="px-3 py-2.5" onClick={() => updateQuantity(item.key, item.quantity - 1)} aria-label={`Decrease quantity of ${item.product.name}`}>
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold" aria-live="polite">{item.quantity}</span>
                        <button className="px-3 py-2.5" onClick={() => updateQuantity(item.key, item.quantity + 1)} aria-label={`Increase quantity of ${item.product.name}`}>
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
          {items.length > 0 && <StackSwap catalog={catalog} />}
          {items.length > 0 && <PairsWellWith suggestions={suggestions} catalog={catalog} />}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[var(--color-line)] px-6 py-5">
            <div className="mb-3 flex justify-between text-lg font-bold">
              <span>Subtotal</span>
              <span>{formatPrice(cartTotal(items))}</span>
            </div>
            <div className="mb-3">
              <AutoDiscountNote subtotal={cartTotal(items)} />
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

// Upsell (20 Nov): every part of a live stack is in the cart as single bottles, so offer the stack for less.
function StackSwap({ catalog }: { catalog: Product[] }) {
  const { items, addItem, removeItem } = useCart();
  const stack = swappableStack(items.map((i) => ({ slug: i.product.slug, mode: i.mode, bottles: i.bottles })), catalog);
  if (!stack) return null;
  const parts = stack.bundleItems!.map((b) => items.find((i) => i.product.slug === b.slug && i.mode === 'one-time' && i.bottles === 1)!);
  const separately = parts.reduce((s, i) => s + i.pricePerBottle, 0);
  const save = separately - stack.basePrice;
  if (save <= 0) return null;
  const swap = () => {
    for (const i of parts) removeItem(i.key);
    const [single] = packOptions(stack, 'one-time');
    addItem({ product: stack, mode: 'one-time', ...single });
  };
  return (
    <div className="mt-2 rounded-2xl bg-[var(--studio)] p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-navy)]">Save with a stack</p>
      <p className="mt-1 text-sm">These are the <b>{stack.name}</b>: get both for {formatPrice(stack.basePrice)} and save {formatPrice(save)}.</p>
      <button onClick={swap} className="mt-3 rounded-full bg-[var(--color-navy)] px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">Switch to the stack</button>
    </div>
  );
}

// Cross-sell (20 Nov): partners of what's in the cart first (lib/stacks PAIRINGS), then best sellers; one tap to add.
function PairsWellWith({ suggestions, catalog }: { suggestions: Product[]; catalog: Product[] }) {
  const { items, addItem } = useCart();
  const picks = cartPairings(items.map((i) => i.product.slug), catalog, suggestions).filter((p) => !p.bundleItems?.length).slice(0, 2);
  if (!picks.length) return null;
  return (
    <div className="mt-2 border-t border-[var(--color-line)] pt-4">
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">Pairs well with</p>
      <ul className="space-y-3">
        {picks.map((p) => {
          const [single] = packOptions(p, 'one-time');
          return (
            <li key={p.slug} className="flex items-center gap-3">
              <ProductImage product={p} sizes="56px" className="h-14 w-14 shrink-0 rounded-lg" />
              <div className="flex-1 text-sm">
                <p className="font-semibold">{p.name}</p>
                <p className="text-xs text-[var(--color-muted)]">{formatPrice(single.pricePerBottle)}</p>
              </div>
              <button
                onClick={() => addItem({ product: p, mode: 'one-time', ...single })}
                aria-label={`Add ${p.name} to cart`}
                className="rounded border-[1.5px] border-[var(--color-navy)] px-3 py-2 text-xs font-bold uppercase tracking-wide text-[var(--color-navy)] transition-colors hover:bg-[var(--color-accent)] hover:text-white"
              >
                Add to Cart
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
