'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';

// Email-only sign-up for a free program (we never ask for symptoms: that would be consumer health data). No analytics
// event: program pages are health pages, so no tags run there (lib/tests.ts isSensitivePath).
export function ProgramSignup({ program, cta = 'Send me week 1', dark = false }: { program: string; cta?: string; dark?: boolean }) {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [state, setState] = useState<{ ok?: boolean; msg?: string; busy?: boolean }>({});
  return (
    <form
      className="mt-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setState({ busy: true });
        const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, company, source: 'program', program }) }).catch(() => null);
        const data = res ? await res.json().catch(() => ({})) : {};
        if (res?.ok) { setState({ ok: true, msg: data.message }); } else setState({ msg: data.error ?? 'Something went wrong. Please try again.' });
      }}
    >
      {state.ok ? (
        <p role="status" className={`rounded-2xl px-5 py-4 font-semibold ${dark ? 'bg-white/10 text-white' : 'bg-white text-[var(--color-navy)]'}`}>{state.msg}</p>
      ) : (
        <>
          <div className="flex max-w-md flex-col gap-3 sm:flex-row">
            <label className={`flex flex-1 items-center gap-2 rounded-full border px-4 ${dark ? 'border-white/30 bg-white' : 'border-[var(--color-line)] bg-white'}`}>
              <Mail aria-hidden className="h-4 w-4 text-[var(--color-muted)]" />
              <span className="sr-only">Email address</span>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" autoComplete="email" className="w-full bg-transparent py-3 text-[var(--color-ink)] focus:outline-none" />
            </label>
            <input value={company} onChange={(e) => setCompany(e.target.value)} name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            <button disabled={state.busy} className="btn btn-primary whitespace-nowrap disabled:opacity-60">{state.busy ? 'Sending…' : cta}</button>
          </div>
          {state.msg && <p role="alert" className="mt-2 text-sm text-red-700">{state.msg}</p>}
          <p className={`mt-3 text-xs ${dark ? 'text-white/70' : 'text-[var(--color-muted)]'}`}>Free. Email only, no health questions. Unsubscribe anytime.</p>
        </>
      )}
    </form>
  );
}
