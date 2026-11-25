'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail, CalendarClock, CreditCard, FileText, XCircle } from 'lucide-react';
import { MosaicLoader } from '@/components/brand/MosaicLoader';

const FEATURES = [
  { icon: CalendarClock, text: 'Change delivery frequency' },
  { icon: CreditCard, text: 'Update card and address' },
  { icon: FileText, text: 'View invoices' },
  { icon: XCircle, text: 'Cancel anytime' },
];

function Account() {
  const expired = useSearchParams().get('expired');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/account/portal-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}));
    setStatus(res.ok ? { type: 'ok', text: data.message } : { type: 'error', text: data.error || 'Something went wrong.' });
    setLoading(false);
  };

  return (
    <div className="container max-w-xl px-6 py-20">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">Your account</p>
      <h1 className="mt-2 text-center text-4xl">Manage your subscription</h1>
      <p className="mt-3 text-center text-[var(--color-muted)]">
        Enter the email you ordered with and we&apos;ll send you a secure link. No password to remember.
      </p>

      {expired && (
        <p className="mt-6 rounded-xl bg-amber-50 p-3 text-center text-sm text-amber-800">That link has expired — request a new one below.</p>
      )}

      <form onSubmit={submit} className="mt-8 flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded border bg-white border-[var(--color-line)] px-4 focus-within:ring-2 focus-within:ring-[var(--color-accent)]">
          <Mail className="h-4 w-4 text-[var(--color-muted)]" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-label="Email address you subscribed with"
            autoComplete="email"
            className="w-full py-3 focus:outline-none"
          />
        </div>
        <button disabled={loading} className="btn btn-primary disabled:opacity-50">{loading ? <><MosaicLoader size={18} color="#fff" label="Sending" /> Sending…</> : 'Email me a link'}</button>
      </form>

      {status && (
        <p className={`mt-4 text-center text-sm ${status.type === 'ok' ? 'text-[var(--color-green)]' : 'text-red-600'}`}>{status.text}</p>
      )}

      <ul className="mt-12 grid grid-cols-2 gap-4">
        {FEATURES.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-3 rounded-2xl bg-[var(--color-soft)] p-4 text-sm font-semibold">
            <Icon className="h-5 w-5 shrink-0 text-[var(--color-accent)]" /> {text}
          </li>
        ))}
      </ul>
      <p className="mt-8 text-center text-sm text-[var(--color-muted)]">
        Placed a one-time order? Your tracking link is in your shipping email. Anything else: <a href="mailto:hello@noovit.com" className="font-semibold text-[var(--color-navy)] underline">hello@noovit.com</a>
      </p>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense>
      <Account />
    </Suspense>
  );
}
