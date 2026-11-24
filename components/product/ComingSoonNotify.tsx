'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { trackSignup } from '@/lib/analytics';

// "Coming soon" mode (owner, 24 Nov): products can be browsed but not bought yet. Visitors leave an email and join the
// launch list (source "launch-waitlist"); the product they asked about is kept with it.
export function ComingSoonNotify({ product, compact = false }: { product?: string; compact?: boolean }) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  if (done) return <p className="rounded-lg bg-[var(--color-soft)] p-4 text-center font-semibold text-[var(--color-navy)]">You&apos;re on the list. We&apos;ll email you the day orders open.</p>;
  return (
    <form
      className={compact ? 'flex gap-2' : 'space-y-2'}
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        const company = String(new FormData(e.currentTarget).get('company') ?? '');
        const res = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, company, source: 'launch', product }),
        });
        const data = await res.json().catch(() => ({}));
        setBusy(false);
        if (!res.ok) return void toast.error(data.error || 'Something went wrong. Please try again.');
        trackSignup('launch_waitlist');
        setDone(true);
      }}
    >
      <div className="flex flex-1 items-center gap-2 rounded border border-[var(--color-line)] bg-white px-4 focus-within:ring-2 focus-within:ring-[var(--color-accent)]">
        <Mail className="h-4 w-4 shrink-0 text-[var(--color-muted)]" aria-hidden />
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" aria-label="Email address" autoComplete="email" className="w-full bg-transparent py-3 focus:outline-none" />
      </div>
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <button disabled={busy} className={`btn btn-primary ${compact ? 'shrink-0 px-5' : 'w-full py-4'} disabled:opacity-60`}>Notify me</button>
    </form>
  );
}
