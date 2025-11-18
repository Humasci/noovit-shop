'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/store/cart';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils/format';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { items, total, subtotal, discount, removeItem, updateQuantity, toggleSubscription } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-[var(--color-stone)] mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-[var(--color-stone)] mb-8">
            Add some products to get started!
          </p>
          <Link href="/shop">
            <Button variant="primary" size="lg">
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.isSubscription}`} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="w-24 h-24 flex-shrink-0 bg-[var(--color-mist)] rounded-lg flex items-center justify-center">
                    <div className="text-4xl">📦</div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Link href={`/products/${item.product.slug}`}>
                          <h3 className="font-semibold text-lg hover:text-[var(--color-primary)] transition-colors">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-[var(--color-stone)]">{item.product.tagline}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-[var(--color-stone)] hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Subscription Badge */}
                    {item.isSubscription && (
                      <div className="inline-block mb-3">
                        <span className="px-3 py-1 bg-[var(--color-primary)] text-white text-xs font-medium rounded-full">
                          Subscription - Save {item.product.subscriptionDiscount}%
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border-2 border-[var(--color-mist)] rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-[var(--color-mist)] transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-1 font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-[var(--color-mist)] transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Subscription Toggle */}
                        {item.product.subscriptionAvailable && (
                          <button
                            onClick={() => toggleSubscription(item.product.id)}
                            className="text-sm text-[var(--color-primary)] hover:underline"
                          >
                            {item.isSubscription ? 'Remove subscription' : 'Add subscription'}
                          </button>
                        )}
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-xl font-bold">
                          {formatPrice(
                            (item.isSubscription && item.product.subscriptionDiscount
                              ? item.product.price * (1 - item.product.subscriptionDiscount / 100)
                              : item.product.price) * item.quantity
                          )}
                        </p>
                        {item.isSubscription && item.product.subscriptionDiscount && (
                          <p className="text-sm text-[var(--color-stone)] line-through">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[var(--color-stone)]">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-[var(--color-primary)]">
                    <span>Subscription Savings</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[var(--color-stone)]">
                  <span>Shipping</span>
                  <span className="text-[var(--color-primary)]">Free</span>
                </div>

                <div className="border-t border-[var(--color-mist)] pt-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-3xl font-bold">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <Link href="/checkout">
                <Button variant="primary" size="lg" fullWidth icon={<ArrowRight className="w-5 h-5" />}>
                  Proceed to Checkout
                </Button>
              </Link>

              <Link href="/shop">
                <Button variant="outline" size="md" fullWidth className="mt-3">
                  Continue Shopping
                </Button>
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-[var(--color-mist)]">
                <div className="space-y-3 text-sm text-[var(--color-stone)]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full"></div>
                    <span>Free shipping on orders over $50</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full"></div>
                    <span>30-day money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full"></div>
                    <span>Secure checkout with Stripe</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
