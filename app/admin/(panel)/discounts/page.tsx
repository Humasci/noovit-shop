import { requireAdmin } from '@/lib/admin/auth';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/server';
import { stripeConfigured } from '@/lib/config';
import { createDiscount, deactivateDiscount } from '@/app/admin/actions';
import { Badge, Card, Flash, NotConfigured, PageTitle, Table, btnSm, btnSmOutline, date, inputCls, td } from '@/components/admin/ui';

const label = 'mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]';

function appliesTo(c: Stripe.Coupon | null) {
  if (!c) return '—';
  if (c.duration === 'forever') return 'Every payment';
  if (c.duration === 'repeating') return `First ${c.duration_in_months} months`;
  return 'First payment';
}

export default async function DiscountsPage({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  await requireAdmin('marketing');
  const { msg } = await searchParams;
  if (!stripeConfigured()) return (<><PageTitle title="Discounts" /><NotConfigured what="Stripe" /></>);

  const { data: codes } = await stripe().promotionCodes.list({ limit: 100, expand: ['data.promotion.coupon'] });

  return (
    <>
      <PageTitle title="Discounts" />
      <Flash msg={msg} />

      <Card className="mb-6">
        <h2 className="mb-4 text-lg">New discount code</h2>
        <form action={createDiscount} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label>
            <span className={label}>Code</span>
            <input name="code" required placeholder="e.g. WELCOME10" className={`${inputCls} w-full uppercase`} />
          </label>
          <label>
            <span className={label}>Type</span>
            <select name="kind" defaultValue="percent" className={`${inputCls} w-full`}>
              <option value="percent">Percentage off</option>
              <option value="amount">Fixed amount off ($)</option>
            </select>
          </label>
          <label>
            <span className={label}>Value</span>
            <input name="value" required type="number" min={0.01} step="0.01" placeholder="10" className={`${inputCls} w-full`} />
          </label>
          <label>
            <span className={label}>Applies to</span>
            <select name="duration" defaultValue="once" className={`${inputCls} w-full`}>
              <option value="once">First payment only</option>
              <option value="repeating">First N months (subscriptions)</option>
              <option value="forever">Every payment (subscriptions)</option>
            </select>
          </label>
          <label>
            <span className={label}>Months (if “first N months”)</span>
            <input name="duration_in_months" type="number" min={1} max={24} placeholder="3" className={`${inputCls} w-full`} />
          </label>
          <label>
            <span className={label}>Minimum order ($, optional)</span>
            <input name="minimum_amount" type="number" min={0} step="0.01" placeholder="50" className={`${inputCls} w-full`} />
          </label>
          <label>
            <span className={label}>Max uses (optional)</span>
            <input name="max_redemptions" type="number" min={1} className={`${inputCls} w-full`} />
          </label>
          <label>
            <span className={label}>Expires (optional)</span>
            <input name="expires_at" type="date" className={`${inputCls} w-full`} />
          </label>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" name="first_time_transaction" /> First-time customers only
          </label>
          <div className="sm:col-span-2 lg:col-span-4">
            <button className={btnSm}>Create code</button>
          </div>
        </form>
        <p className="mt-3 text-xs text-[var(--color-muted)]">
          Customers enter codes on the Stripe checkout page. Shipping is already free on every order, so there is no free-shipping code type. The newsletter promises 10% off
          the first order — create <b>WELCOME10</b> (10%, first payment only, first-time customers only) and set it in Settings.
        </p>
      </Card>

      <Table head={['Code', 'Discount', 'Applies to', 'Conditions', 'Used', 'Expires', 'Status', '']} empty={!codes.length}>
        {codes.map((c) => {
          const coupon = c.promotion.coupon as Stripe.Coupon | null;
          const conditions = [
            c.restrictions.minimum_amount ? `min $${(c.restrictions.minimum_amount / 100).toFixed(2)}` : null,
            c.restrictions.first_time_transaction ? 'first-time customers' : null,
          ].filter(Boolean);
          return (
            <tr key={c.id}>
              <td className={`${td} font-mono font-bold`}>{c.code}</td>
              <td className={td}>{coupon?.percent_off ? `${coupon.percent_off}%` : coupon?.amount_off ? `$${(coupon.amount_off / 100).toFixed(2)}` : '—'}</td>
              <td className={td}>{appliesTo(coupon)}</td>
              <td className={td}>{conditions.join(', ') || '—'}</td>
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
