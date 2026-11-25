'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { MosaicLoader } from '@/components/brand/MosaicLoader';

// Passwordless sign-in: posts the email, the server emails a 30-minute link.
export function SignInForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/account/sign-in', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) }).catch(() => null);
    const data = (await res?.json().catch(() => ({}))) ?? {};
    setStatus(res?.ok ? { type: 'ok', text: data.message } : { type: 'error', text: data.error || 'Something went wrong. Please try again.' });
    setLoading(false);
  };

  return (
    <>
      <form onSubmit={submit} className="mt-8 flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-5 focus-within:ring-2 focus-within:ring-[var(--color-accent)]">
          <Mail className="h-4 w-4 text-[var(--color-muted)]" aria-hidden />
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" aria-label="Your email address" autoComplete="email" className="w-full bg-transparent py-3 focus:outline-none" />
        </div>
        <button disabled={loading} className="btn btn-primary disabled:opacity-50">
          {loading ? <><MosaicLoader size={18} color="#fff" label="Sending" /> Sending…</> : 'Email me a sign-in link'}
        </button>
      </form>
      {status && <p role="status" className={`mt-4 text-center text-sm ${status.type === 'ok' ? 'text-[var(--color-green)]' : 'text-red-600'}`}>{status.text}</p>}
    </>
  );
}
