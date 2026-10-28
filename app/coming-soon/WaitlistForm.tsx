'use client';

import { useState } from 'react';
import { trackSignup } from '@/lib/analytics';

export function WaitlistForm() {
  const [state, setState] = useState<{ status: 'idle' | 'sending' | 'done' | 'error'; message?: string }>({ status: 'idle' });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState({ status: 'sending' });
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.get('email'), company: form.get('company'), source: 'launch' }),
    }).catch(() => null);
    const data = await res?.json().catch(() => ({}));
    if (res?.ok) trackSignup('launch_waitlist');
    setState(res?.ok ? { status: 'done', message: data.message } : { status: 'error', message: data?.error ?? 'Something went wrong. Please try again.' });
  }

  if (state.status === 'done') return <p role="status" className="mt-8 font-semibold text-[var(--color-accent)]">{state.message}</p>;
  return (
    <form onSubmit={submit} className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <label htmlFor="waitlist-email" className="sr-only">Email address</label>
      <input id="waitlist-email" name="email" type="email" required autoComplete="email" placeholder="Your email" className="min-w-0 flex-1 rounded border border-[var(--color-line)] bg-white px-4 py-3" />
      {/* Honeypot: hidden from people, filled in by bots. */}
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <button type="submit" disabled={state.status === 'sending'} className="btn btn-primary whitespace-nowrap">
        {state.status === 'sending' ? 'Joining…' : 'Join the list'}
      </button>
      {state.status === 'error' && <p role="alert" className="text-sm text-red-700 sm:basis-full">{state.message}</p>}
    </form>
  );
}
