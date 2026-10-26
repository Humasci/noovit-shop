'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Star } from 'lucide-react';
import { Review } from '@/types';
import { products } from '@/data/products';
import { Stars } from '@/components/ui/Stars';

const PLACEHOLDER_DISTRIBUTION = [86, 10, 3, 1, 0];

interface ApiReview {
  id: string;
  product_slug: string;
  name: string;
  rating: number;
  title: string;
  body: string;
  verified_buyer: boolean;
  created_at: string;
}

const inputClass = 'w-full rounded-xl border border-[var(--color-line)] bg-white px-4 py-3';

export function ReviewsModule({
  reviews: placeholders,
  total: placeholderTotal,
  rating: placeholderRating = 4.8,
  productSlug,
}: {
  reviews: Review[];
  total: number;
  rating?: number;
  productSlug?: string;
}) {
  const [real, setReal] = useState<Review[]>([]);
  const [score, setScore] = useState(5);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/reviews${productSlug ? `?slug=${productSlug}` : ''}`)
      .then((r) => r.json())
      .then((d: { reviews: ApiReview[] }) =>
        setReal(
          d.reviews.map((r) => ({
            id: r.id,
            name: r.name,
            productSlug: r.product_slug,
            rating: r.rating,
            title: r.title,
            body: r.body,
            date: r.created_at.slice(0, 10),
            verified: r.verified_buyer,
          }))
        )
      )
      .catch(() => {});
  }, [productSlug]);

  // Once real, approved reviews exist they replace the placeholders entirely.
  const usingReal = real.length > 0;
  const reviews = usingReal ? real : placeholders;
  const total = usingReal ? real.length : placeholderTotal;
  const rating = usingReal ? real.reduce((s, r) => s + r.rating, 0) / real.length : placeholderRating;
  const distribution = usingReal
    ? [5, 4, 3, 2, 1].map((n) => Math.round((real.filter((r) => r.rating === n).length / real.length) * 100))
    : PLACEHOLDER_DISTRIBUTION;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setSubmitting(true);
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...Object.fromEntries(form), slug: productSlug ?? form.get('slug'), rating: score }),
    });
    const data = await res.json().catch(() => ({}));
    setSubmitting(false);
    if (!res.ok) return toast.error(data.error || 'Could not submit your review.');
    toast.success('Thanks! Your review will appear once approved.');
    setShowForm(false);
  };

  return (
    <section id="write" className="section border-t border-[var(--color-line)]">
      <div className="container px-6">
        <div className="grid gap-10 md:grid-cols-[280px_1fr]">
          <div>
            <p className="text-5xl font-extrabold text-[var(--color-navy)]">{rating.toFixed(1)}</p>
            <Stars rating={rating} size={20} className="mt-2" />
            <p className="mt-1 text-sm text-[var(--color-muted)]">Based on {total.toLocaleString()} reviews</p>
            <div className="mt-5 space-y-1.5">
              {distribution.map((pct, i) => (
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
              <form onSubmit={submit} className="animate-slide-in mb-10 space-y-4 rounded-2xl bg-[var(--color-soft)] p-6">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button type="button" key={i} onClick={() => setScore(i)} aria-label={`${i} stars`}>
                      <Star className={`h-7 w-7 ${i <= score ? 'fill-[var(--color-green)] text-[var(--color-green)]' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
                {!productSlug && (
                  <select name="slug" required defaultValue="" className={inputClass}>
                    <option value="" disabled>Which product?</option>
                    {products.map((p) => (
                      <option key={p.slug} value={p.slug}>{p.name}</option>
                    ))}
                  </select>
                )}
                <input name="title" required maxLength={120} placeholder="Review title" className={inputClass} />
                <textarea name="body" required maxLength={2000} rows={4} placeholder="Tell us about your experience" className={inputClass} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input name="name" required maxLength={80} placeholder="Name" className={inputClass} />
                  <input name="email" required type="email" placeholder="Email (not shown)" className={inputClass} />
                </div>
                <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
                <button disabled={submitting} className="btn btn-primary disabled:opacity-50">
                  {submitting ? 'Submitting…' : 'Submit Review'}
                </button>
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
                    {r.name}
                    {r.verified !== false && <span className="ml-1 font-semibold text-[var(--color-green)]">Verified Buyer</span>}
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
