'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Star } from 'lucide-react';
import { Review } from '@/types';
import { Stars } from '@/components/ui/Stars';

const DISTRIBUTION = [86, 10, 3, 1, 0];

export function ReviewsModule({ reviews, total, rating = 4.8 }: { reviews: Review[]; total: number; rating?: number }) {
  const [score, setScore] = useState(5);
  const [showForm, setShowForm] = useState(false);

  return (
    <section id="write" className="section border-t border-[var(--color-line)]">
      <div className="container px-6">
        <div className="grid gap-10 md:grid-cols-[280px_1fr]">
          <div>
            <p className="text-5xl font-extrabold text-[var(--color-navy)]">{rating.toFixed(1)}</p>
            <Stars rating={rating} size={20} className="mt-2" />
            <p className="mt-1 text-sm text-[var(--color-muted)]">Based on {total.toLocaleString()} reviews</p>
            <div className="mt-5 space-y-1.5">
              {DISTRIBUTION.map((pct, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-3">{5 - i}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--color-line)]">
                    <div className="h-full bg-[var(--color-green)]" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-8 text-right text-[var(--color-muted)]">{pct}%</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowForm(!showForm)} className="btn btn-primary mt-6 w-full">
              Write a Review
            </button>
          </div>

          <div>
            {showForm && (
              <form
                className="animate-slide-in mb-10 space-y-4 rounded-2xl bg-[var(--color-soft)] p-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success('Thanks! Your review will appear once verified.');
                  setShowForm(false);
                }}
              >
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button type="button" key={i} onClick={() => setScore(i)} aria-label={`${i} stars`}>
                      <Star className={`h-7 w-7 ${i <= score ? 'fill-[var(--color-green)] text-[var(--color-green)]' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
                <input required placeholder="Review title" className="w-full rounded-xl border border-[var(--color-line)] px-4 py-3" />
                <textarea required rows={4} placeholder="Tell us about your experience" className="w-full rounded-xl border border-[var(--color-line)] px-4 py-3" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input required placeholder="Name" className="rounded-xl border border-[var(--color-line)] px-4 py-3" />
                  <input required type="email" placeholder="Email" className="rounded-xl border border-[var(--color-line)] px-4 py-3" />
                </div>
                <button className="btn btn-primary">Submit Review</button>
              </form>
            )}

            <div className="divide-y divide-[var(--color-line)]">
              {reviews.map((r) => (
                <article key={r.id} className="py-6 first:pt-0">
                  <div className="flex items-center justify-between">
                    <Stars rating={r.rating} size={14} />
                    <time className="text-xs text-[var(--color-muted)]">{r.date}</time>
                  </div>
                  <h3 className="mt-2 text-base">{r.title}</h3>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">{r.body}</p>
                  <p className="mt-2 text-xs font-bold">
                    {r.name} <span className="ml-1 font-semibold text-[var(--color-green)]">Verified Buyer</span>
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
