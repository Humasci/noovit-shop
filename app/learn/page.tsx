import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { BookOpen, Brain, Dumbbell, Moon } from 'lucide-react';

export default function LearnPage() {
  const articles = [
    {
      id: 1,
      title: 'The Science Behind Lion\'s Mane Mushroom',
      excerpt: 'Discover how this ancient mushroom supports cognitive function and neurogenesis.',
      category: 'Focus',
      icon: Brain,
      readTime: '5 min read',
    },
    {
      id: 2,
      title: 'Spirulina: The Complete Superfood Guide',
      excerpt: 'Learn about the nutritional powerhouse that\'s been sustaining communities for centuries.',
      category: 'Nutrition',
      icon: BookOpen,
      readTime: '7 min read',
    },
    {
      id: 3,
      title: 'Optimizing Your Sleep with Melatonin',
      excerpt: 'Understanding how melatonin works and how to use it effectively for better sleep.',
      category: 'Sleep',
      icon: Moon,
      readTime: '6 min read',
    },
    {
      id: 4,
      title: 'Creatine: Beyond Muscle Building',
      excerpt: 'The surprising cognitive and health benefits of creatine supplementation.',
      category: 'Recovery',
      icon: Dumbbell,
      readTime: '8 min read',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Wellness Library</h1>
            <p className="text-xl text-white/90">
              Evidence-based articles about supplements, nutrition, and optimizing your health naturally.
            </p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="section-padding">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {articles.map((article) => {
              const Icon = article.icon;
              return (
                <div key={article.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-[var(--color-primary)] rounded-lg">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-[var(--color-primary)]">
                        {article.category}
                      </span>
                      <span className="text-sm text-[var(--color-stone)]">•</span>
                      <span className="text-sm text-[var(--color-stone)]">{article.readTime}</span>
                    </div>

                    <h3 className="text-2xl font-bold mb-3">{article.title}</h3>
                    <p className="text-[var(--color-stone)] mb-6">{article.excerpt}</p>

                    <Button variant="outline" size="sm">
                      Read Article
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Categories */}
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Browse by Topic</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Cognitive Health', 'Nutrition', 'Sleep & Recovery', 'Performance'].map((topic) => (
                <button
                  key={topic}
                  className="px-6 py-3 rounded-lg bg-[var(--color-mist)] hover:bg-[var(--color-primary)] hover:text-white transition-all font-medium"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Wellness Journey?</h2>
          <p className="text-xl text-[var(--color-stone)] mb-8 max-w-2xl mx-auto">
            Explore our premium supplements backed by science and nature.
          </p>
          <Link href="/shop">
            <Button variant="primary" size="lg">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
