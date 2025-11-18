import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Leaf, Target, Users, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Our Mission: Clarity Through Nature
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              At Noovit, we believe that optimal wellness comes from nature—enhanced by science.
              We're committed to providing pure, effective supplements that help you achieve your best self, naturally.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">Our Story</h2>
            <div className="prose prose-lg max-w-none text-[var(--color-stone)]">
              <p className="mb-6">
                Noovit was born from a simple frustration: finding supplements that were both effective
                and transparent. Too many products in the wellness industry make bold claims without the
                science to back them up, or worse, hide what&apos;s really inside.
              </p>
              <p className="mb-6">
                We set out to change that. Every product we create starts with rigorous research into
                ingredients that have proven benefits. We source only the highest-quality, sustainably
                harvested botanicals and compounds. And we test everything—not just once, but repeatedly
                through independent third-party labs.
              </p>
              <p className="mb-6">
                Our name, Noovit, comes from &quot;new vitality&quot;—a fresh approach to wellness that
                respects both ancient wisdom and modern science. Whether you&apos;re looking to enhance your
                focus, boost your energy, improve your sleep, or support your overall health, we&apos;re here
                to provide supplements you can trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding bg-[var(--color-cream)]">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center">What We Stand For</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-primary)] mb-4">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Purity First</h3>
              <p className="text-[var(--color-stone)]">
                100% natural ingredients with zero fillers, artificial colors, or unnecessary additives.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-primary)] mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Science-Backed</h3>
              <p className="text-[var(--color-stone)]">
                Every ingredient is supported by peer-reviewed research and clinical studies.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-primary)] mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Transparency</h3>
              <p className="text-[var(--color-stone)]">
                Complete ingredient disclosure and third-party testing results for every batch.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-primary)] mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Customer-Centric</h3>
              <p className="text-[var(--color-stone)]">
                Your wellness journey is our priority. We&apos;re here to support you every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Standards */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">Our Quality Standards</h2>

            <div className="space-y-6">
              <div className="border-l-4 border-[var(--color-primary)] pl-6">
                <h3 className="text-xl font-semibold mb-2">Premium Sourcing</h3>
                <p className="text-[var(--color-stone)]">
                  We partner with certified organic farms and sustainable suppliers who share our
                  commitment to quality and environmental responsibility.
                </p>
              </div>

              <div className="border-l-4 border-[var(--color-primary)] pl-6">
                <h3 className="text-xl font-semibold mb-2">Third-Party Testing</h3>
                <p className="text-[var(--color-stone)]">
                  Every batch undergoes rigorous testing by independent laboratories to verify purity,
                  potency, and safety. We test for heavy metals, pesticides, and microbial contamination.
                </p>
              </div>

              <div className="border-l-4 border-[var(--color-primary)] pl-6">
                <h3 className="text-xl font-semibold mb-2">GMP Certified Facilities</h3>
                <p className="text-[var(--color-stone)]">
                  Our supplements are manufactured in FDA-registered, GMP-certified facilities that
                  adhere to the highest industry standards.
                </p>
              </div>

              <div className="border-l-4 border-[var(--color-primary)] pl-6">
                <h3 className="text-xl font-semibold mb-2">Sustainable Practices</h3>
                <p className="text-[var(--color-stone)]">
                  From eco-friendly packaging to carbon-neutral shipping, we&apos;re committed to
                  minimizing our environmental impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-[var(--color-cream)] to-[var(--color-earth-light)]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Join the Noovit Community
          </h2>
          <p className="text-xl text-[var(--color-stone)] mb-8 max-w-2xl mx-auto">
            Experience the difference that pure, science-backed supplements can make in your life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button variant="primary" size="lg">
                Shop Products
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
