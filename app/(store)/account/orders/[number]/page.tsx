import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Check, Truck, FileText, MapPin, LifeBuoy } from 'lucide-react';
import { requireAccount, loadOrder } from '@/lib/account/data';
import { getStoreProducts } from '@/lib/catalog/server';
import { Reorder, type ReorderLine } from '@/components/account/Reorder';
import { Badge, Card, Flash, Label, field } from '@/components/account/ui';
import { day, money, orderStatus, ORDER_STEPS } from '@/lib/account/format';
import { orderHelp } from '../../actions';
import { testPath } from '@/lib/urls';

export const dynamic = 'force-dynamic';

export default async function OrderPage({ params, searchParams }: { params: Promise<{ number: string }>; searchParams: Promise<{ ok?: string; err?: string }> }) {
  const email = await requireAccount();
  const [{ number }, sp] = await Promise.all([params, searchParams]);
  const o = /^\d{1,12}$/.test(number) ? await loadOrder(email, Number(number)) : null;
  if (!o) notFound();

  const st = orderStatus(o.status);
  const products = new Map((await getStoreProducts()).map((p) => [p.slug, p]));
  const lines: ReorderLine[] = o.items.flatMap((i) => { const product = products.get(i.slug); return product && !i.isKit ? [{ product, bottles: i.bottles, quantity: i.quantity }] : []; });
  const a = o.shippingAddress;
  const hasPayment = Boolean(o.stripeInvoiceId || o.stripePaymentIntentId);

  return (
    <>
      <Link href="/account/orders" className="inline-flex items-center gap-1.5 text-sm font-semibold underline"><ArrowLeft className="h-4 w-4" aria-hidden /> All orders</Link>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl">Order #{o.number}</h1>
        <Badge tone={st.tone}>{st.label}</Badge>
      </div>
      <p className="mt-1 mb-6 text-sm text-[var(--color-muted)]">Placed {day(o.placed)}{o.kind === 'subscription_renewal' ? ' · subscription renewal' : o.kind === 'subscription_initial' ? ' · first subscription order' : ''}</p>
      <Flash {...sp} />

      {st.step >= 0 && (
        <Card>
          <ol className="grid grid-cols-4 gap-2" aria-label="Order progress">
            {ORDER_STEPS.map((label, n) => {
              const done = n <= st.step;
              return (
                <li key={label} className="text-center text-xs font-semibold" aria-current={n === st.step ? 'step' : undefined}>
                  <span className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full ${done ? 'bg-[var(--color-green)] text-white' : 'bg-[var(--color-soft)] text-[var(--color-muted)]'}`}>{done ? <Check className="h-4 w-4" aria-hidden /> : n + 1}</span>
                  <span className={`mt-2 block ${done ? 'text-[var(--color-navy)]' : 'text-[var(--color-muted)]'}`}>{label}</span>
                </li>
              );
            })}
          </ol>
          {o.shipments.filter((s) => s.trackingUrl || s.trackingNumber).map((s, n) => (
            <p key={n} className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[var(--color-line)] pt-4 text-sm">
              <Truck className="h-4 w-4 text-[var(--color-accent)]" aria-hidden />
              <span>{s.carrier ?? 'Carrier'}{s.trackingNumber ? ` · ${s.trackingNumber}` : ''}{s.shippedAt ? ` · shipped ${day(s.shippedAt)}` : ''}</span>
              {s.trackingUrl && <a href={s.trackingUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline">Track package</a>}
            </p>
          ))}
          {st.step < 2 && <p className="mt-5 border-t border-[var(--color-line)] pt-4 text-sm text-[var(--color-muted)]">Orders usually ship within 2 to 5 business days. The tracking link appears here and in your shipping email.</p>}
        </Card>
      )}

      <Card className="mt-4">
        <h2 className="text-lg">Items</h2>
        <ul className="mt-2 divide-y divide-[var(--color-line)] text-sm">
          {o.items.map((i, n) => {
            const product = products.get(i.slug);
            return (
              <li key={n} className="flex items-center justify-between gap-3 py-3">
                <span>
                  <span className="font-semibold">{i.name}</span>
                  <span className="block text-xs text-[var(--color-muted)]">
                    {i.bottles > 1 ? `${i.bottles}-pack · ` : ''}Qty {i.quantity}{i.mode === 'subscribe' ? ' · Subscription' : ''}
                  </span>
                </span>
                <span className="flex items-center gap-4">
                  {i.isKit ? <Link href={testPath(i.slug)} className="text-xs font-semibold underline">About this kit</Link> : product ? <Reorder lines={[{ product, bottles: i.bottles, quantity: 1 }]} /> : null}
                  <span className="w-16 text-right font-semibold">{money(i.unitCents * i.quantity)}</span>
                </span>
              </li>
            );
          })}
        </ul>
        <dl className="mt-2 grid gap-1.5 border-t border-[var(--color-line)] pt-4 text-sm">
          <div className="flex justify-between"><dt className="text-[var(--color-muted)]">Subtotal</dt><dd>{money(o.subtotalCents)}</dd></div>
          {o.discountCents > 0 && <div className="flex justify-between"><dt className="text-[var(--color-muted)]">Discount</dt><dd>−{money(o.discountCents)}</dd></div>}
          <div className="flex justify-between"><dt className="text-[var(--color-muted)]">Shipping</dt><dd>{o.shippingCents ? money(o.shippingCents) : 'Free'}</dd></div>
          {o.taxCents > 0 && <div className="flex justify-between"><dt className="text-[var(--color-muted)]">Tax</dt><dd>{money(o.taxCents)}</dd></div>}
          <div className="flex justify-between text-base font-semibold"><dt>Total</dt><dd>{money(o.totalCents)}</dd></div>
        </dl>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          {lines.length > 1 && <Reorder lines={lines} label="Buy it all again" variant="button" />}
          {hasPayment && <a href={`/account/orders/${o.number}/receipt`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold underline"><FileText className="h-4 w-4" aria-hidden /> Receipt</a>}
        </div>
      </Card>

      {(o.shippingName || a) && (
        <Card className="mt-4 text-sm">
          <h2 className="flex items-center gap-2 text-lg"><MapPin className="h-4 w-4 text-[var(--color-accent)]" aria-hidden /> Shipped to</h2>
          <address className="mt-2 not-italic leading-relaxed text-[var(--color-muted)]">
            {o.shippingName}<br />
            {a?.line1}{a?.line2 ? `, ${a.line2}` : ''}<br />
            {a?.city}{a?.state ? `, ${a.state}` : ''} {a?.postal_code}
          </address>
        </Card>
      )}

      <Card className="mt-4">
        <details>
          <summary className="flex cursor-pointer items-center gap-2 text-lg font-semibold"><LifeBuoy className="h-4 w-4 text-[var(--color-accent)]" aria-hidden /> Get help with this order</summary>
          <form action={orderHelp} className="mt-4 grid gap-4">
            <input type="hidden" name="number" value={o.number} />
            <Label text="What happened?">
              <select name="topic" required className={field} defaultValue="">
                <option value="" disabled>Choose one</option>
                <option value="missing">It hasn&apos;t arrived</option>
                <option value="damaged">Damaged or wrong item</option>
                <option value="refund">I&apos;d like a refund (90-day first-bottle guarantee)</option>
                <option value="address">Change the address</option>
                <option value="other">Something else</option>
              </select>
            </Label>
            <Label text="Tell us a little more">
              <textarea name="message" required minLength={5} maxLength={2000} rows={4} className={field} />
            </Label>
            <div><button className="btn btn-primary text-sm">Send to support</button></div>
            <p className="text-xs text-[var(--color-muted)]">We reply by email, usually within one business day. 90-day first-bottle guarantee on every product.</p>
          </form>
        </details>
      </Card>
    </>
  );
}
