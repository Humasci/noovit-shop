import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/product/ProductCard';
import { getFeaturedProducts } from '@/data/products';
import { Leaf, Award, ShieldCheck, Truck } from 'lucide-react';

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[var(--color-cream)] via-[var(--color-mist)] to-[var(--color-earth-light)] overflow-hidden">
        <div className="container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
              Clarity Through{' '}
              <span className="text-[var(--color-primary)]">Nature</span>
            </h1>
            <p className="text-xl md:text-2xl text-[var(--color-stone)] mb-8 max-w-2xl">
              Science-backed supplements to enhance focus, energy, and wellness—naturally and effectively.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop">
                <Button variant="primary" size="lg">Shop Now</Button>
              </Link>
              <Link href="/learn">
                <Button variant="secondary" size="lg">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
          <div className="text-[20rem] text-[var(--color-primary)]">🌿</div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-mist)] mb-4">
                <Leaf className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Pure Ingredients</h3>
              <p className="text-sm text-[var(--color-stone)]">
                100% natural, clean ingredients with full transparency
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-mist)] mb-4">
                <Award className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Science-Backed</h3>
              <p className="text-sm text-[var(--color-stone)]">
                Research-proven formulas for real results
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-mist)] mb-4">
                <ShieldCheck className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Third-Party Tested</h3>
              <p className="text-sm text-[var(--color-stone)]">
                Independently verified for purity and potency
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-mist)] mb-4">
                <Truck className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
              <p className="text-sm text-[var(--color-stone)]">
                On all orders over $50
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-[var(--color-cream)]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Products</h2>
            <p className="text-lg text-[var(--color-stone)] max-w-2xl mx-auto">
              Our most popular supplements, carefully formulated to support your wellness goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Link href="/shop">
              <Button variant="secondary" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Shop by Goal</h2>
            <p className="text-lg text-[var(--color-stone)] max-w-2xl mx-auto">
              Find the perfect supplements for your specific needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Focus', emoji: '🧠', category: 'focus', color: 'var(--color-sage)' },
              { name: 'Energy', emoji: '⚡', category: 'energy', color: 'var(--color-accent)' },
              { name: 'Sleep', emoji: '😴', category: 'sleep', color: 'var(--color-primary-dark)' },
              { name: 'Recovery', emoji: '💪', category: 'recovery', color: 'var(--color-clay)' },
            ].map((goal) => (
              <Link
                key={goal.category}
                href={`/shop?category=${goal.category}`}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-mist)] to-white p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-6xl mb-4">{goal.emoji}</div>
                <h3 className="text-2xl font-semibold mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                  {goal.name}
                </h3>
                <p className="text-sm text-[var(--color-stone)]">
                  Enhance your {goal.name.toLowerCase()}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-[var(--color-primary)] text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What Our Customers Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah M.',
                role: 'Software Developer',
                content: "Lion's Mane has completely transformed my focus at work. No more brain fog!",
                rating: 5,
              },
              {
                name: 'Mike R.',
                role: 'Fitness Enthusiast',
                content: 'The creatine is pure and effective. Noticeable strength gains within weeks.',
                rating: 5,
              },
              {
                name: 'Emma L.',
                role: 'Graduate Student',
                content: 'Finally sleeping through the night with the melatonin. Game changer!',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="mb-4 italic">&quot;{testimonial.content}&quot;</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-white/70">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-[var(--color-cream)] to-[var(--color-earth-light)]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Optimize Your Wellness?
          </h2>
          <p className="text-xl text-[var(--color-stone)] mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers on their journey to better health.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button variant="primary" size="lg">
                Start Shopping
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="secondary" size="lg">
                Our Story
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
