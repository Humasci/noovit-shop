import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db/server';
import { dbConfigured } from '@/lib/config';
import { refundOrder } from '@/app/admin/actions';
import { FulfilmentForm, FulfilmentRow } from '@/components/admin/FulfilmentForm';
import { Badge, Card, Flash, NotConfigured, PageTitle, dateTime, money } from '@/components/admin/ui';

interface Address {
  line1?: string;
  line2?: string | null;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export default async function OrderDetail({ params, searchParams }: { params: Promise<{ number: string }>; searchParams: Promise<{ msg?: string }> }) {
  const { number } = await params;
  const { msg } = await searchParams;
  if (!dbConfigured()) return (<><PageTitle title={`Order #${number}`} /><NotConfigured what="The database" /></>);
  if (!/^\d+$/.test(number)) notFound();

  const { data: o } = await db()
    .from('orders')
    .select('*, order_items(*), fulfilments(*), subscriptions(stripe_subscription_id, status, paused, frequency_days)')
    .eq('order_number', Number(number))
    .maybeSingle();
  if (!o) notFound();

  const addr = (o.shipping_address ?? {}) as Address;
  const path = `/admin/orders/${number}`;
  const sub = o.subscriptions as { stripe_subscription_id: string; status: string; paused: boolean; frequency_days: number } | null;
  const stripeBase = process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') ? 'https://dashboard.stripe.com/test' : 'https://dashboard.stripe.com';

  return (
    <>
      <PageTitle title={`Order #${o.order_number}`}>
        <Badge status={o.status} />
        <span className="text-sm text-[var(--color-muted)]">{dateTime(o.created_at)}</span>
      </PageTitle>
      <Flash msg={msg} />

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card>
            <h2 className="mb-3 text-lg">Items</h2>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-[var(--color-line)]">
                {(o.order_items as { id: string; product_name: string; bottles: number; quantity: number; purchase_mode: string; frequency_days: number | null; unit_amount_cents: number; supplier_sku: string | null }[]).map((i) => (
                  <tr key={i.id}>
                    <td className="py-2">
                      <div className="font-semibold">{i.product_name}</div>
                      <div className="text-xs text-[var(--color-muted)]">
                        {i.bottles} {i.bottles === 1 ? 'bottle' : 'bottles'} · {i.purchase_mode === 'subscribe' ? `every ${i.frequency_days} days` : 'one-time'}
                        {i.supplier_sku ? ` · SKU ${i.supplier_sku}` : ' · no supplier SKU'}
                      </div>
                    </td>
                    <td className="py-2 text-right">× {i.quantity}</td>
                    <td className="py-2 text-right font-semibold">{money(i.unit_amount_cents * i.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <dl className="mt-4 space-y-1 border-t border-[var(--color-line)] pt-4 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(o.subtotal_cents)}</dd></div>
              {o.discount_cents > 0 && <div className="flex justify-between"><dt>Discount</dt><dd>−{money(o.discount_cents)}</dd></div>}
              <div className="flex justify-between"><dt>Tax</dt><dd>{money(o.tax_cents)}</dd></div>
              <div className="flex justify-between"><dt>Shipping</dt><dd>{o.shipping_cents ? money(o.shipping_cents) : 'Free'}</dd></div>
              <div className="flex justify-between text-base font-bold"><dt>Total</dt><dd>{money(o.total_cents)}</dd></div>
            </dl>
          </Card>

          <Card>
            <h2 className="mb-3 text-lg">Fulfilment</h2>
            <div className="space-y-5">
              {(o.fulfilments as (FulfilmentRow & { shipped_at: string | null; submitted_at: string | null; error: string | null })[]).map((f) => (
                <div key={f.id}>
                  <p className="mb-2 flex items-center gap-2 text-sm">
                    <Badge status={f.status} /> via <b>{f.supplier}</b>
                    {f.submitted_at && <span className="text-[var(--color-muted)]">· submitted {dateTime(f.submitted_at)}</span>}
                    {f.shipped_at && <span className="text-[var(--color-muted)]">· shipped {dateTime(f.shipped_at)}</span>}
                  </p>
                  {f.error && <p className="mb-2 text-sm text-red-600">{f.error}</p>}
                  <FulfilmentForm f={f} returnTo={path} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-3 text-lg">Customer</h2>
            <p className="font-semibold">{o.shipping_name ?? '—'}</p>
            <Link href={`/admin/orders?q=${encodeURIComponent(o.email)}`} className="text-sm text-[var(--color-blue)]">{o.email}</Link>
            <h3 className="mb-1 mt-4 text-sm">Ship to</h3>
            <p className="text-sm leading-relaxed text-[var(--color-muted)]">
              {addr.line1}<br />
              {addr.line2 && <>{addr.line2}<br /></>}
              {addr.city}, {addr.state} {addr.postal_code}<br />
              {addr.country}
            </p>
            <p className="mt-4 text-xs text-[var(--color-muted)]">Age confirmed: {o.age_confirmed ? 'yes' : 'n/a'}</p>
          </Card>

          {sub && (
            <Card>
              <h2 className="mb-2 text-lg">Subscription</h2>
              <p className="text-sm">
                <Badge status={sub.paused ? 'paused' : sub.status} /> every {sub.frequency_days} days
              </p>
              <Link href="/admin/subscriptions" className="mt-2 inline-block text-sm text-[var(--color-blue)]">Manage subscriptions →</Link>
            </Card>
          )}

          <Card>
            <h2 className="mb-2 text-lg">Payment</h2>
            {o.stripe_payment_intent_id ? (
              <a href={`${stripeBase}/payments/${o.stripe_payment_intent_id}`} target="_blank" rel="noreferrer" className="text-sm text-[var(--color-blue)]">
                View in Stripe →
              </a>
            ) : (
              <p className="text-sm text-[var(--color-muted)]">No Stripe payment linked.</p>
            )}
            {o.status !== 'refunded' && o.stripe_payment_intent_id && (
              <form action={refundOrder} className="mt-4 space-y-2 border-t border-[var(--color-line)] pt-4">
                <input type="hidden" name="id" value={o.id} />
                <input type="hidden" name="returnTo" value={path} />
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="confirm" /> Refund {money(o.total_cents)} in full
                </label>
                <button className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700">Refund order</button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
