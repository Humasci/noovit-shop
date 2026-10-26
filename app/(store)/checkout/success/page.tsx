import Link from 'next/link';
import type { Metadata } from 'next';
import { CheckCircle2 } from 'lucide-react';
import { stripe } from '@/lib/stripe/server';
import { stripeConfigured } from '@/lib/config';
import { formatPrice } from '@/lib/utils/format';
import { ClearCart } from '@/components/cart/ClearCart';

export const metadata: Metadata = { title: 'Order confirmed — Noovit', robots: { index: false } };

async function loadSession(id: string | undefined) {
  if (!id || !stripeConfigured()) return null;
  try {
    const session = await stripe().checkout.sessions.retrieve(id, { expand: ['line_items'] });
    return session.status === 'complete' ? session : null;
  } catch {
    return null;
  }
}

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const session = await loadSession((await searchParams).session_id);

  if (!session) {
    return (
      <div className="container max-w-xl px-6 py-24 text-center">
        <h1 className="text-3xl">We couldn&apos;t find that order</h1>
        <p className="mt-3 text-[var(--color-muted)]">If you completed a payment, check your email for a confirmation.</p>
        <Link href="/shop" className="btn btn-primary mt-8">Back to Shop</Link>
      </div>
    );
  }

  const firstName = session.customer_details?.name?.split(' ')[0];

  return (
    <div className="container max-w-2xl px-6 py-20">
      <ClearCart />
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-[var(--color-green)]" />
        <h1 className="mt-4 text-4xl">Thank you{firstName ? `, ${firstName}` : ''}!</h1>
        <p className="mt-3 text-[var(--color-muted)]">
          Your order is confirmed. We&apos;ve sent a receipt to <b>{session.customer_details?.email}</b> and will email tracking as soon as it ships.
        </p>
      </div>

      <div className="mt-10 rounded-3xl bg-[var(--color-soft)] p-8">
        <ul className="divide-y divide-[var(--color-line)]">
          {session.line_items?.data.map((li) => (
            <li key={li.id} className="flex justify-between gap-4 py-3 text-sm">
              <span>
                <span className="font-semibold">{li.description}</span> × {li.quantity}
              </span>
              <span>{formatPrice(li.amount_total / 100)}</span>
            </li>
          ))}
        </ul>
        {(session.total_details?.amount_discount ?? 0) > 0 && (
          <div className="mt-3 flex justify-between text-sm">
            <span>Discount</span>
            <span>−{formatPrice(session.total_details!.amount_discount / 100)}</span>
          </div>
        )}
        {(session.total_details?.amount_tax ?? 0) > 0 && (
          <div className="mt-3 flex justify-between text-sm">
            <span>Tax</span>
            <span>{formatPrice(session.total_details!.amount_tax / 100)}</span>
          </div>
        )}
        <div className="mt-4 flex justify-between border-t border-[var(--color-line)] pt-4 text-lg font-bold">
          <span>Total paid</span>
          <span>{formatPrice((session.amount_total ?? 0) / 100)}</span>
        </div>
        {session.mode === 'subscription' && (
          <p className="mt-4 text-sm text-[var(--color-muted)]">
            Your subscription is active. Manage, pause or cancel anytime from{' '}
            <Link href="/account" className="font-semibold text-[var(--color-blue)] underline">My Subscriptions</Link>.
          </p>
        )}
      </div>

      <div className="mt-10 text-center">
        <Link href="/shop" className="btn btn-outline">Continue Shopping</Link>
      </div>
    </div>
  );
}
