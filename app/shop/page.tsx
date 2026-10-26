'use client';

import React, { useState, useMemo } from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { products, ProductType, DietaryTag, getAllProductTypes, getAllDietaryTags } from '@/data/products';

type SortOption = 'default' | 'name-asc' | 'name-desc' | 'price-low' | 'price-high';

export default function ShopPage() {
  const [selectedType, setSelectedType] = useState<ProductType | 'all'>('all');
  const [selectedDietaryTags, setSelectedDietaryTags] = useState<DietaryTag[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('default');

  const productTypes = [
    { value: 'all' as const, label: 'All Products' },
    { value: 'supplements' as const, label: 'Supplements' },
    { value: 'sports' as const, label: 'Sports' },
    { value: 'specialties' as const, label: 'Specialties' },
  ];

  const dietaryOptions: Array<{ value: DietaryTag; label: string }> = [
    { value: 'vegan', label: 'Vegan' },
    { value: 'gluten-free', label: 'Gluten-free' },
    { value: 'pregnancy-safe', label: 'Pregnancy-safe' },
    { value: 'postpartum-safe', label: 'Postpartum-safe' },
    { value: 'sugar-free', label: 'Sugar-free' },
  ];

  const sortOptions: Array<{ value: SortOption; label: string }> = [
    { value: 'default', label: 'All' },
    { value: 'name-asc', label: 'Alphabetically, A-Z' },
    { value: 'name-desc', label: 'Alphabetically, Z-A' },
    { value: 'price-low', label: 'Price, Low to High' },
    { value: 'price-high', label: 'Price, High to Low' },
  ];

  const toggleDietaryTag = (tag: DietaryTag) => {
    setSelectedDietaryTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by product type
    if (selectedType !== 'all') {
      filtered = filtered.filter(p => p.productType === selectedType);
    }

    // Filter by dietary tags (AND logic - must have all selected tags)
    if (selectedDietaryTags.length > 0) {
      filtered = filtered.filter(p =>
        selectedDietaryTags.every(tag => p.dietaryTags.includes(tag))
      );
    }

    // Sort
    if (sortBy === 'name-asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [selectedType, selectedDietaryTags, sortBy]);

  // Group products by type for display
  const groupedProducts = useMemo(() => {
    const groups: Record<ProductType, typeof filteredAndSortedProducts> = {
      supplements: [],
      sports: [],
      specialties: [],
    };

    filteredAndSortedProducts.forEach(product => {
      groups[product.productType].push(product);
    });

    return groups;
  }, [filteredAndSortedProducts]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero with headline */}
      <section className="bg-[var(--color-cream)] py-10 md:py-12 border-b border-[var(--color-mist)]">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Reward yourself with locally-made, science-driven nutrition.{' '}
            <span className="text-[var(--color-primary)]">You deserve better.</span>
          </h1>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="bg-white border-b border-[var(--color-mist)] py-4">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Product Type Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-[var(--color-stone)] mr-2">Product Type:</span>
              {productTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedType === type.value
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-[var(--color-mist)] text-[var(--color-charcoal)] hover:bg-[var(--color-primary-light)] hover:text-white'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[var(--color-stone)]">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-1.5 border border-[var(--color-mist)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dietary Filters */}
          <div className="flex flex-wrap gap-2 mt-4 items-center">
            <span className="text-sm font-medium text-[var(--color-stone)] mr-2">For Every Body:</span>
            {dietaryOptions.map(option => (
              <button
                key={option.value}
                onClick={() => toggleDietaryTag(option.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedDietaryTags.includes(option.value)
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-mist)] text-[var(--color-charcoal)] hover:bg-[var(--color-primary-light)] hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="container mx-auto px-6 py-12">
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-[var(--color-stone)]">
              No products match your search criteria.
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Supplements */}
            {groupedProducts.supplements.length > 0 && (
              <section>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  Supplements ({groupedProducts.supplements.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {groupedProducts.supplements.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {/* Sports */}
            {groupedProducts.sports.length > 0 && (
              <section>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  Sports ({groupedProducts.sports.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {groupedProducts.sports.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {/* Specialties */}
            {groupedProducts.specialties.length > 0 && (
              <section>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  Specialties ({groupedProducts.specialties.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {groupedProducts.specialties.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
