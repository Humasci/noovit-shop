'use client';

import React, { useState, useMemo } from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { products } from '@/data/products';
import { ProductCategory } from '@/types';
import { Filter } from 'lucide-react';

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const categories: Array<{ value: ProductCategory | 'all'; label: string }> = [
    { value: 'all', label: 'All Products' },
    { value: 'focus', label: 'Focus & Cognition' },
    { value: 'energy', label: 'Energy' },
    { value: 'sleep', label: 'Sleep Support' },
    { value: 'recovery', label: 'Recovery' },
    { value: 'nutrition', label: 'Nutrition' },
  ];

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return products;
    }
    return products.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Header */}
      <section className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop All Products</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Premium natural supplements to support your wellness journey
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </h3>
                <button
                  className="lg:hidden text-[var(--color-primary)]"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? 'Hide' : 'Show'}
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Category Filter */}
                <div>
                  <h4 className="font-medium mb-3 text-[var(--color-charcoal)]">Category</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.value}
                        onClick={() => setSelectedCategory(category.value)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                          selectedCategory === category.value
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'bg-[var(--color-mist)] text-[var(--color-charcoal)] hover:bg-[var(--color-primary-light)] hover:text-white'
                        }`}
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Count */}
                <div className="pt-4 border-t border-[var(--color-mist)]">
                  <p className="text-sm text-[var(--color-stone)]">
                    Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-[var(--color-stone)]">
                  No products found in this category.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
