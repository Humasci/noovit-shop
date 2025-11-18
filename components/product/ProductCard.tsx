'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils/format';
import { Button } from '@/components/ui/Button';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/lib/store/cart';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCart((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, false);
    toast.success(`${product.name} added to cart!`);
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-[var(--color-mist)]">
          <div className="w-full h-full flex items-center justify-center text-[var(--color-stone)]">
            {/* Placeholder for product image */}
            <div className="text-6xl">📦</div>
          </div>

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-3 right-3 bg-[var(--color-primary)] text-white px-3 py-1 rounded-full text-sm font-semibold">
              -{discountPercentage}%
            </div>
          )}

          {/* Featured Badge */}
          {product.featured && (
            <div className="absolute top-3 left-3 bg-[var(--color-accent)] text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Star className="w-3 h-3" fill="white" />
              Featured
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-5">
          {/* Category */}
          <div className="text-xs uppercase tracking-wider text-[var(--color-primary)] font-medium mb-2">
            {product.category}
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-lg mb-2 text-[var(--color-charcoal)] group-hover:text-[var(--color-primary)] transition-colors">
            {product.name}
          </h3>

          {/* Tagline */}
          <p className="text-sm text-[var(--color-stone)] mb-4 line-clamp-2">
            {product.tagline}
          </p>

          {/* Price & CTA */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[var(--color-charcoal)]">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-[var(--color-stone)] line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              {product.subscriptionAvailable && (
                <span className="text-xs text-[var(--color-primary)] mt-1">
                  Save {product.subscriptionDiscount}% with subscription
                </span>
              )}
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleAddToCart}
              icon={<ShoppingCart className="w-4 h-4" />}
              className="!px-4"
            >
              Add
            </Button>
          </div>

          {/* Stock Status */}
          {!product.inStock && (
            <div className="mt-3 text-xs text-red-600 font-medium">
              Out of Stock
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
