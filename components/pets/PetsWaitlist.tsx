'use client';

import { useState } from 'react';
import { Mail, PawPrint } from 'lucide-react';
import toast from 'react-hot-toast';

// Shown on /pets while no pet products are on sale. Sign-ups are stored as subscribers with source "pets-waitlist".
export function PetsWaitlist() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  return (
    <section id="pet-products" className="section">
      <div className="container px-6">
        <div className="mx-auto max-w-2xl rounded-3xl bg-[var(--color-pets-soft)] p-10 text-center md:p-14">
          <PawPrint className="mx-auto h-10 w-10 text-[var(--color-pets)]" />
          <h2 className="mt-4 text-3xl md:text-4xl">Noovit Pets is coming soon</h2>
          <p className="mt-3 text-[var(--color-muted)]">
            Soft chews for dogs (hip &amp; joint, calming, digestion, skin &amp; coat) are on the way. Join the waitlist and we&apos;ll email you the day they launch.
          </p>
          {done ? (
            <p className="mt-6 font-semibold text-[var(--color-pets-dark)]">You&apos;re on the list — we&apos;ll be in touch.</p>
          ) : (
            <form
              className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
              onSubmit={async (e) => {
                e.preventDefault();
                const company = String(new FormData(e.currentTarget).get('company') ?? '');
                const res = await fetch('/api/newsletter', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email, company, source: 'pets' }),
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) return void toast.error(data.error || 'Something went wrong. Please try again.');
                setDone(true);
              }}
            >
              <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-4">
                <Mail className="h-4 w-4 text-[var(--color-muted)]" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className="w-full bg-transparent py-3 outline-none" />
              </div>
              <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
              <button className="btn bg-[var(--color-pets)] text-white hover:bg-[var(--color-pets-dark)]">Notify me</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
