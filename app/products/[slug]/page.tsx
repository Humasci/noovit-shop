'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { getProductBySlug } from '@/data/products';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils/format';
import { ShoppingCart, Check, Minus, Plus, Package, Shield, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ProductPage() {
  const params = useParams();
  const product = getProductBySlug(params.slug as string);
  const [quantity, setQuantity] = useState(1);
  const [isSubscription, setIsSubscription] = useState(false);
  const addItem = useCart((state) => state.addItem);

  if (!product) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-[var(--color-stone)] mb-6">
          Sorry, we couldn&apos;t find the product you&apos;re looking for.
        </p>
        <Link href="/shop">
          <Button variant="primary">Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity, isSubscription);
    toast.success(`${product.name} added to cart!`);
  };

  const currentPrice = isSubscription && product.subscriptionDiscount
    ? product.price * (1 - product.subscriptionDiscount / 100)
    : product.price;

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <div className="container mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <Link href="/" className="text-[var(--color-stone)] hover:text-[var(--color-primary)]">
            Home
          </Link>
          <span className="mx-2 text-[var(--color-stone)]">/</span>
          <Link href="/shop" className="text-[var(--color-stone)] hover:text-[var(--color-primary)]">
            Shop
          </Link>
          <span className="mx-2 text-[var(--color-stone)]">/</span>
          <span className="text-[var(--color-charcoal)]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="aspect-square flex items-center justify-center bg-[var(--color-mist)] rounded-xl">
              <div className="text-9xl">📦</div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-2">
              <span className="inline-block px-3 py-1 bg-[var(--color-primary)] text-white text-sm font-medium rounded-full uppercase tracking-wide">
                {product.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>
            <p className="text-xl text-[var(--color-stone)] mb-6">{product.tagline}</p>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-[var(--color-charcoal)]">
                  {formatPrice(currentPrice)}
                </span>
                {product.originalPrice && !isSubscription && (
                  <span className="text-xl text-[var(--color-stone)] line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              <p className="text-sm text-[var(--color-stone)]">
                {product.servingSize} • {product.servingsPerContainer} servings
              </p>
            </div>

            {/* Subscription Option */}
            {product.subscriptionAvailable && (
              <div className="mb-6 bg-gradient-to-r from-[var(--color-mist)] to-white rounded-xl p-4 border-2 border-[var(--color-primary-light)]">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSubscription}
                    onChange={() => setIsSubscription(!isSubscription)}
                    className="mt-1 mr-3"
                  />
                  <div>
                    <p className="font-semibold text-[var(--color-charcoal)]">
                      Subscribe & Save {product.subscriptionDiscount}%
                    </p>
                    <p className="text-sm text-[var(--color-stone)]">
                      Get it delivered monthly and save on every order. Cancel anytime.
                    </p>
                  </div>
                </label>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-[var(--color-mist)] rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-[var(--color-mist)] transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-[var(--color-mist)] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleAddToCart}
              disabled={!product.inStock}
              icon={<ShoppingCart className="w-5 h-5" />}
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>

            {/* Quick Info */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg">
                <Package className="w-6 h-6 text-[var(--color-primary)] mx-auto mb-2" />
                <p className="text-xs text-[var(--color-stone)]">Free Shipping</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <Shield className="w-6 h-6 text-[var(--color-primary)] mx-auto mb-2" />
                <p className="text-xs text-[var(--color-stone)]">Third-Party Tested</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <Truck className="w-6 h-6 text-[var(--color-primary)] mx-auto mb-2" />
                <p className="text-xs text-[var(--color-stone)]">Ships in 1-2 days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold mb-4">About This Product</h2>
              <p className="text-[var(--color-stone)] mb-6">{product.longDescription}</p>

              <h3 className="text-xl font-semibold mb-3">Dosage</h3>
              <p className="text-[var(--color-stone)] mb-6">{product.dosage}</p>

              {product.scientificBacking && (
                <>
                  <h3 className="text-xl font-semibold mb-3">Scientific Backing</h3>
                  <p className="text-[var(--color-stone)]">{product.scientificBacking}</p>
                </>
              )}
            </div>

            {/* Benefits & Ingredients */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Benefits</h2>
              <ul className="space-y-2 mb-8">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                    <span className="text-[var(--color-stone)]">{benefit}</span>
                  </li>
                ))}
              </ul>

              <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
              <div className="space-y-3">
                {product.ingredients.map((ingredient, index) => (
                  <div key={index} className="border-l-2 border-[var(--color-primary)] pl-4">
                    <p className="font-semibold text-[var(--color-charcoal)]">
                      {ingredient.name} - {ingredient.amount}
                    </p>
                    {ingredient.description && (
                      <p className="text-sm text-[var(--color-stone)]">{ingredient.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
