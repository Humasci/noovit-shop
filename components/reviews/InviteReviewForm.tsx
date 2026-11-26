'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

// One review form on the invite page (/review). Name is prefilled; email comes from the invite on the server.
export function InviteReviewForm({ token, slug, productName, firstName }: { token: string; slug: string; productName: string; firstName: string }) {
  const [rating, setRating] = useState(0);
  const [state, setState] = useState<{ ok?: boolean; error?: string }>({});
  const [busy, setBusy] = useState(false);
  const field = 'w-full rounded-xl border border-[var(--color-line)] bg-white px-4 py-3';

  if (state.ok) return <p className="rounded-2xl bg-[var(--color-soft)] p-6 font-semibold" data-testid="invite-review-done">Thank you! Your review of {productName} is in. It appears on the site after a quick check.</p>;

  return (
    <form
      className="rounded-2xl border border-[var(--color-line)] bg-white p-6"
      data-testid="invite-review-form"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!rating) return setState({ error: 'Please choose a star rating.' });
        const f = new FormData(e.currentTarget);
        setBusy(true);
        const res = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, slug, rating, name: f.get('name'), title: f.get('title'), body: f.get('body') }),
        }).catch(() => null);
        const data = (await res?.json().catch(() => ({}))) ?? {};
        setBusy(false);
        setState(res?.ok ? { ok: true } : { error: data.error || 'Something went wrong. Please try again.' });
      }}
    >
      <h2 className="text-xl">{productName}</h2>
      <div className="mt-3 flex gap-1" role="radiogroup" aria-label={`Your rating for ${productName}`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} star${n > 1 ? 's' : ''}`} onClick={() => setRating(n)} className="p-0.5">
            <Star className={`h-7 w-7 ${n <= rating ? 'fill-[var(--color-accent)] text-[var(--color-accent)]' : 'text-[var(--color-line)]'}`} aria-hidden />
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-3">
        <input name="name" required maxLength={80} defaultValue={firstName} placeholder="Name shown with your review" aria-label="Name shown with your review" className={field} />
        <input name="title" required maxLength={120} placeholder="Headline" aria-label="Headline" className={field} />
        <textarea name="body" required maxLength={2000} rows={4} placeholder="How did it go?" aria-label="Your review" className={field} />
      </div>
      {state.error && <p className="mt-3 text-sm text-red-600">{state.error}</p>}
      <button disabled={busy} className="btn btn-primary mt-4 disabled:opacity-50">{busy ? 'Sending…' : 'Post my review'}</button>
    </form>
  );
}
