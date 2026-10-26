'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Lock } from 'lucide-react';
import { useCart, cartFrequency } from '@/lib/store/cart';
import { Frequency } from '@/types';

export function CheckoutButton() {
  const { items, setFrequency } = useCart();
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [autoRenewConsent, setAutoRenewConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const frequency = cartFrequency(items);
  const ageRestricted = items.some((i) => i.product.ageRestricted);
  const blocked = (frequency && !autoRenewConsent) || (ageRestricted && !ageConfirmed);

  const checkout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ slug: i.product.slug, mode: i.mode, bottles: i.bottles, frequency: i.frequency, quantity: i.quantity })),
          ageConfirmed,
          autoRenewConsent,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Could not start checkout.');
      window.location.href = data.url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not start checkout.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {frequency && (
        <>
          <label className="flex items-center justify-between gap-2 text-sm font-semibold">
            Subscription items arrive every
            <select
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value) as Frequency)}
              className="rounded-full border border-[var(--color-line)] bg-white px-3 py-1.5"
            >
              {[30, 60, 90].map((d) => (
                <option key={d} value={d}>{d} days</option>
              ))}
            </select>
          </label>
          <label className="flex items-start gap-2 text-xs text-[var(--color-muted)]">
            <input type="checkbox" checked={autoRenewConsent} onChange={(e) => setAutoRenewConsent(e.target.checked)} className="mt-0.5" />
            <span>
              I agree that my subscription renews automatically every {frequency} days and I&apos;ll be charged the price shown until I cancel.
              I can cancel anytime online. See{' '}
              <Link href="/policies/terms" className="underline">Terms</Link>.
            </span>
          </label>
        </>
      )}
      {ageRestricted && (
        <label className="flex items-start gap-2 text-xs text-[var(--color-muted)]">
          <input type="checkbox" checked={ageConfirmed} onChange={(e) => setAgeConfirmed(e.target.checked)} className="mt-0.5" />
          <span>I confirm I am 18 or older (required for Creatine).</span>
        </label>
      )}
      <button onClick={checkout} disabled={loading || Boolean(blocked) || items.length === 0} className="btn btn-primary w-full disabled:opacity-50">
        <Lock className="h-4 w-4" /> {loading ? 'Redirecting…' : 'Secure Checkout'}
      </button>
    </div>
  );
}
