import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/server';
import { stripeConfigured } from '@/lib/config';
import { createDiscount, deactivateDiscount } from '@/app/admin/actions';
import { Badge, Card, Flash, NotConfigured, PageTitle, Table, btnSm, btnSmOutline, date, inputCls, td } from '@/components/admin/ui';

export default async function DiscountsPage({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  const { msg } = await searchParams;
  if (!stripeConfigured()) return (<><PageTitle title="Discounts" /><NotConfigured what="Stripe" /></>);

  const { data: codes } = await stripe().promotionCodes.list({ limit: 100, expand: ['data.promotion.coupon'] });

  return (
    <>
      <PageTitle title="Discounts" />
      <Flash msg={msg} />

      <Card className="mb-6">
        <h2 className="mb-3 text-lg">New discount code</h2>
        <form action={createDiscount} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <input name="code" required placeholder="CODE (e.g. WELCOME10)" className={`${inputCls} uppercase lg:col-span-2`} />
          <input name="percent_off" required type="number" min={1} max={100} placeholder="% off" className={inputCls} />
          <select name="duration" defaultValue="once" className={inputCls} aria-label="Applies to">
            <option value="once">First payment only</option>
            <option value="forever">Every payment (subscriptions)</option>
          </select>
          <input name="max_redemptions" type="number" min={1} placeholder="Max uses (optional)" className={inputCls} />
          <input name="expires_at" type="date" className={inputCls} aria-label="Expires" />
          <button className={`${btnSm} lg:col-span-6 lg:justify-self-start`}>Create code</button>
        </form>
        <p className="mt-3 text-xs text-[var(--color-muted)]">Customers enter codes on the Stripe checkout page. The newsletter promises 10% off the first order — create WELCOME10 for that.</p>
      </Card>

      <Table head={['Code', 'Discount', 'Applies to', 'Used', 'Expires', 'Status', '']} empty={!codes.length}>
        {codes.map((c) => {
          const coupon = c.promotion.coupon as Stripe.Coupon | null;
          return (
            <tr key={c.id}>
              <td className={`${td} font-mono font-bold`}>{c.code}</td>
              <td className={td}>{coupon?.percent_off ? `${coupon.percent_off}%` : coupon?.amount_off ? `$${(coupon.amount_off / 100).toFixed(2)}` : '—'}</td>
              <td className={td}>{coupon?.duration === 'forever' ? 'Every payment' : coupon?.duration === 'once' ? 'First payment' : coupon?.duration}</td>
              <td className={td}>
                {c.times_redeemed}
                {c.max_redemptions ? ` / ${c.max_redemptions}` : ''}
              </td>
              <td className={td}>{c.expires_at ? date(new Date(c.expires_at * 1000).toISOString()) : 'Never'}</td>
              <td className={td}><Badge status={c.active ? 'active' : 'cancelled'} /></td>
              <td className={td}>
                {c.active && (
                  <form action={deactivateDiscount}>
                    <input type="hidden" name="id" value={c.id} />
                    <button className={btnSmOutline}>Deactivate</button>
                  </form>
                )}
              </td>
            </tr>
          );
        })}
      </Table>
    </>
  );
}
