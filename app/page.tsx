import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/product/ProductCard';
import { getFeaturedProducts } from '@/data/products';
import { Leaf, Award, ShieldCheck, Truck, CheckCircle } from 'lucide-react';

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();

  return (
    <div>
      {/* Simple Hero Section */}
      <section className="bg-white py-10 md:py-14 border-b border-[var(--color-mist)]">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-balance">
            Reward yourself with locally-made, science-driven nutrition.{' '}
            <span className="text-[var(--color-primary)]">You deserve better.</span>
          </h1>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-16 bg-[var(--color-cream)]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Our Supplements</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* In Better We Trust */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">In Better We Trust</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[
              { icon: Award, label: 'GMP Certified' },
              { icon: ShieldCheck, label: 'Third Party Tested' },
              { icon: Leaf, label: 'Nutritionist Formulated' },
              { icon: CheckCircle, label: 'Locally Produced in The US' },
              { icon: Truck, label: '90-Day Money-Back Guarantee' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-mist)] mb-3 mx-auto">
                  <item.icon className="w-8 h-8 text-[var(--color-primary)]" />
                </div>
                <p className="text-sm font-medium text-[var(--color-charcoal)]">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vouched For - Testimonials */}
      <section className="py-12 md:py-16 bg-[var(--color-cream)]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Vouched For</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah M.',
                product: "Lion's Mane Capsules",
                content: "This has completely transformed my focus at work. No more brain fog! I feel sharper and more productive throughout the day.",
                rating: 5,
                verified: true,
              },
              {
                name: 'Mike R.',
                product: 'Creatine Monohydrate',
                content: 'The creatine is pure and effective. Noticeable strength gains within weeks. Best quality I\'ve found.',
                rating: 5,
                verified: true,
              },
              {
                name: 'Emma L.',
                product: 'Melatonin',
                content: 'Finally sleeping through the night! This melatonin is gentle but effective. Game changer for my sleep quality.',
                rating: 5,
                verified: true,
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-sm text-[var(--color-charcoal)] mb-4">{testimonial.content}</p>
                <div className="border-t border-[var(--color-mist)] pt-4">
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  {testimonial.verified && (
                    <p className="text-xs text-[var(--color-primary)] flex items-center gap-1 mt-1">
                      <CheckCircle className="w-3 h-3" /> Verified Buyer
                    </p>
                  )}
                  <Link href="/shop" className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                    {testimonial.product}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
