import { requireAdmin } from '@/lib/admin/auth';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db/server';
import { dbConfigured } from '@/lib/config';
import { addOrderNote, cancelOrder, refundOrder, setOrderTags } from '@/app/admin/order-actions';
import { can } from '@/lib/admin/permissions';
import { FulfilmentForm, FulfilmentRow } from '@/components/admin/FulfilmentForm';
import { Badge, Card, Flash, NotConfigured, PageTitle, btnSm, btnSmOutline, dateTime, inputCls, money } from '@/components/admin/ui';

interface Address {
  line1?: string;
  line2?: string | null;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export default async function OrderDetail({ params, searchParams }: { params: Promise<{ number: string }>; searchParams: Promise<{ msg?: string }> }) {
  const me = await requireAdmin('orders');
  const { number } = await params;
  const { msg } = await searchParams;
  if (!dbConfigured()) return (<><PageTitle title={`Order #${number}`} /><NotConfigured what="The database" /></>);
  if (!/^\d+$/.test(number)) notFound();

  const { data: o } = await db()
    .from('orders')
    .select('*, order_items(*), fulfilments(*), subscriptions(stripe_subscription_id, status, paused, frequency_days), order_notes(id, author, body, created_at)')
    .eq('order_number', Number(number))
    .maybeSingle();
  if (!o) notFound();

  const addr = (o.shipping_address ?? {}) as Address;
  const path = `/admin/orders/${number}`;
  const sub = o.subscriptions as { stripe_subscription_id: string; status: string; paused: boolean; frequency_days: number } | null;
  const canMoney = can(me.role, 'orders.money');
  const remaining = o.total_cents - (o.refunded_cents ?? 0);
  const shipped = (o.fulfilments as { status: string }[]).some((f) => ['shipped', 'delivered'].includes(f.status));
  const notes = [...(o.order_notes as { id: string; author: string; body: string; created_at: string }[])].sort((a, b) => a.created_at.localeCompare(b.created_at));
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

          <Card>
            <h2 className="mb-3 text-lg">Notes</h2>
            {notes.length === 0 && <p className="mb-3 text-sm text-[var(--color-muted)]">No notes yet. Notes are internal — customers never see them.</p>}
            <ul className="mb-4 space-y-3">
              {notes.map((n) => (
                <li key={n.id} className="rounded-xl bg-[var(--color-soft)] p-3 text-sm">
                  <p className="whitespace-pre-line">{n.body}</p>
                  <p className="mt-1 text-xs text-[var(--color-muted)]">{n.author} · {dateTime(n.created_at)}</p>
                </li>
              ))}
            </ul>
            <form action={addOrderNote} className="flex gap-2">
              <input type="hidden" name="id" value={o.id} />
              <input name="body" placeholder="Add an internal note…" maxLength={2000} className={`${inputCls} flex-1`} />
              <button className={btnSm}>Add</button>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-2 text-lg">Tags</h2>
            <form action={setOrderTags} className="flex gap-2">
              <input type="hidden" name="id" value={o.id} />
              <input name="tags" defaultValue={(o.tags ?? []).join(', ')} placeholder="e.g. vip, wholesale" className={`${inputCls} flex-1`} />
              <button className={btnSmOutline}>Save</button>
            </form>
          </Card>

          <Card>
            <h2 className="mb-3 text-lg">Customer</h2>
            <p className="font-semibold">{o.shipping_name ?? '—'}</p>
            <p className="text-sm">{o.email}</p>
            {o.customer_id && <Link href={`/admin/customers/${o.customer_id}`} className="text-sm text-[var(--color-accent)]">View customer →</Link>}
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
              <Link href="/admin/subscriptions" className="mt-2 inline-block text-sm text-[var(--color-accent)]">Manage subscriptions →</Link>
            </Card>
          )}

          <Card>
            <h2 className="mb-2 text-lg">Payment</h2>
            {o.stripe_payment_intent_id ? (
              <a href={`${stripeBase}/payments/${o.stripe_payment_intent_id}`} target="_blank" rel="noreferrer" className="text-sm text-[var(--color-accent)]">
                View in Stripe →
              </a>
            ) : (
              <p className="text-sm text-[var(--color-muted)]">No Stripe payment linked.</p>
            )}
            {(o.refunded_cents ?? 0) > 0 && <p className="mt-2 text-sm">Refunded: <b>{money(o.refunded_cents)}</b> of {money(o.total_cents)}</p>}
            {canMoney && o.stripe_payment_intent_id && remaining > 0 && o.status !== 'cancelled' && (
              <form action={refundOrder} className="mt-4 space-y-2 border-t border-[var(--color-line)] pt-4">
                <h3 className="text-sm">Refund</h3>
                <input type="hidden" name="id" value={o.id} />
                <div className="flex items-center gap-2">
                  <span className="text-sm">$</span>
                  <input name="amount" type="number" min="0.01" step="0.01" max={(remaining / 100).toFixed(2)} defaultValue={(remaining / 100).toFixed(2)} className={`${inputCls} w-28`} aria-label="Refund amount" />
                  <select name="reason" defaultValue="requested_by_customer" className={inputCls} aria-label="Reason">
                    <option value="requested_by_customer">Customer request</option>
                    <option value="duplicate">Duplicate</option>
                    <option value="fraudulent">Fraudulent</option>
                  </select>
                </div>
                <input name="note" placeholder="Note (optional)" className={`${inputCls} w-full`} />
                <button className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700">Refund</button>
              </form>
            )}
            {canMoney && o.status !== 'cancelled' && !shipped && (
              <form action={cancelOrder} className="mt-4 space-y-2 border-t border-[var(--color-line)] pt-4">
                <h3 className="text-sm">Cancel order</h3>
                <p className="text-xs text-[var(--color-muted)]">Stops fulfilment{o.stripe_payment_intent_id && remaining > 0 ? ` and refunds ${money(remaining)}` : ''}.</p>
                <input type="hidden" name="id" value={o.id} />
                <input name="note" placeholder="Reason (optional)" className={`${inputCls} w-full`} />
                {sub && (
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="cancel_subscription" /> Also cancel the subscription now
                  </label>
                )}
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="confirm" /> Yes, cancel this order
                </label>
                <button className={btnSmOutline}>Cancel order</button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
