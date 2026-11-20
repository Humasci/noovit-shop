'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { trackSignup } from '@/lib/analytics';

// At-home tests waitlist: stored as subscribers with source "tests-waitlist" and the kit slug (if any) in `goal`.
export function TestsWaitlist({ kit }: { kit?: string }) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  if (done) return <p className="mt-6 font-semibold text-[var(--color-navy)]">You&apos;re on the list. We&apos;ll email you when it launches.</p>;
  return (
    <form
      className="mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
      onSubmit={async (e) => {
        e.preventDefault();
        const company = String(new FormData(e.currentTarget).get('company') ?? '');
        const res = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, company, source: 'tests', kit }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) return void toast.error(data.error || 'Something went wrong. Please try again.');
        trackSignup('tests_waitlist');
        setDone(true);
      }}
    >
      <div className="flex flex-1 items-center gap-2 rounded bg-white px-4 focus-within:ring-2 focus-within:ring-[var(--color-accent)]">
        <Mail className="h-4 w-4 text-[var(--color-muted)]" />
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" aria-label="Email address" autoComplete="email" className="w-full bg-transparent py-3 focus:outline-none" />
      </div>
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <button className="btn btn-primary">Notify me</button>
    </form>
  );
}
