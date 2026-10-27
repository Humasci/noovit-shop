import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/admin/auth';
import { db } from '@/lib/db/server';
import { dbConfigured } from '@/lib/config';
import { getSettings } from '@/lib/settings';
import { portalLink, shareLink, statsByAffiliate, type Affiliate } from '@/lib/affiliates';
import {
  approvePendingCommissions, emailPartnerWelcome, recordPayout, regeneratePortalLink, updateAffiliate, voidCommission,
} from '@/app/admin/affiliate-actions';
import { CopyField } from '@/components/admin/CopyField';
import { Badge, Card, Flash, NotConfigured, PageTitle, Stat, Table, btnSm, btnSmOutline, date, inputCls, money, td } from '@/components/admin/ui';

const label = 'mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]';
const SOURCE: Record<string, string> = { code: 'Code at checkout', link: 'Share link', renewal: 'Renewal' };

interface CommissionRow {
  id: string;
  source: string;
  base_cents: number;
  rate_pct: number;
  amount_cents: number;
  status: string;
  void_reason: string | null;
  created_at: string;
  orders: { order_number: number } | null;
}

export default async function AffiliatePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ msg?: string }> }) {
  await requireAdmin('marketing');
  const [{ id }, { msg }] = await Promise.all([params, searchParams]);
  if (!dbConfigured()) return (<><PageTitle title="Partner" /><NotConfigured what="database" /></>);
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();

  const [{ data }, { data: commissions }, { data: payouts }, stats, settings] = await Promise.all([
    db().from('affiliates').select('*').eq('id', id).maybeSingle(),
    db().from('commissions').select('id, source, base_cents, rate_pct, amount_cents, status, void_reason, created_at, orders(order_number)').eq('affiliate_id', id).order('created_at', { ascending: false }).limit(200),
    db().from('affiliate_payouts').select('*').eq('affiliate_id', id).order('created_at', { ascending: false }),
    statsByAffiliate(id),
    getSettings(),
  ]);
  const a = data as Affiliate | null;
  if (!a) notFound();
  const s = stats.get(a.id);
  const rows = (commissions ?? []) as unknown as CommissionRow[];
  const hold = Number(settings.affiliate_hold_days || 30);

  return (
    <>
      <PageTitle title={a.name}>
        <Badge status={a.status} />
        <Link href="/admin/affiliates" className={btnSmOutline}>All partners</Link>
      </PageTitle>
      <Flash msg={msg} />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Clicks" value={String(a.clicks)} />
        <Stat label="Orders" value={String(s.orders)} sub={a.clicks ? `${((s.orders / a.clicks) * 100).toFixed(1)}% of clicks` : undefined} />
        <Stat label="Sales" value={money(s.sales)} />
        <Stat label="Owed now" value={money(s.approved)} sub={`${money(s.pending)} pending (${hold}-day hold)`} />
        <Stat label="Paid to date" value={money(s.paid)} />
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg">Share with {a.name.split(' ')[0]}</h2>
          <div className="space-y-4">
            <CopyField label="Code" value={a.code} />
            <CopyField label="Share link" value={shareLink(a.code)} />
            <CopyField label="Link to a product (example)" value={shareLink(a.code, '/products/magnesium-complex')} />
            <CopyField label="Their private dashboard" value={portalLink(a.portal_token)} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <form action={emailPartnerWelcome}><input type="hidden" name="id" value={a.id} /><button className={btnSm}>Email them their code & links</button></form>
            <form action={regeneratePortalLink}><input type="hidden" name="id" value={a.id} /><button className={btnSmOutline}>New dashboard link</button></form>
          </div>
          <p className="mt-3 text-xs text-[var(--color-muted)]">
            Any page works with the link: add <span className="font-mono">?to=/shop</span> or a product address. The dashboard shows them clicks, orders and earnings, with no customer
            details. Make a new link if it was shared by mistake.
          </p>
        </Card>

        <Card>
          <h2 className="mb-4 text-lg">Deal & details</h2>
          <form action={updateAffiliate} className="grid gap-4 sm:grid-cols-2">
            <input type="hidden" name="id" value={a.id} />
            <label><span className={label}>Name</span><input name="name" required defaultValue={a.name} className={`${inputCls} w-full`} /></label>
            <label><span className={label}>Email</span><input name="email" type="email" required defaultValue={a.email} className={`${inputCls} w-full`} /></label>
            <label><span className={label}>Platform</span><input name="platform" defaultValue={a.platform ?? ''} className={`${inputCls} w-full`} /></label>
            <label>
              <span className={label}>Status</span>
              <select name="status" defaultValue={a.status} className={`${inputCls} w-full`}>
                <option value="active">Active</option>
                <option value="paused">Paused (code and link stop working)</option>
              </select>
            </label>
            <label><span className={label}>Customer discount (%)</span><input name="customer_discount_pct" type="number" min={0} max={50} step={1} defaultValue={a.customer_discount_pct} className={`${inputCls} w-full`} /></label>
            <label><span className={label}>Commission (%)</span><input name="commission_pct" type="number" min={0} max={50} step="0.5" defaultValue={Number(a.commission_pct)} className={`${inputCls} w-full`} /></label>
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input type="checkbox" name="recurring" defaultChecked={a.recurring} /> Also pay commission on subscription renewals
            </label>
            <label className="sm:col-span-2"><span className={label}>Payout details (PayPal email, bank note)</span><input name="payout_details" defaultValue={a.payout_details ?? ''} className={`${inputCls} w-full`} /></label>
            <label className="sm:col-span-2"><span className={label}>Notes (staff only)</span><textarea name="notes" rows={2} defaultValue={a.notes ?? ''} className={`${inputCls} w-full`} /></label>
            <div className="sm:col-span-2"><button className={btnSm}>Save</button></div>
          </form>
          <p className="mt-3 text-xs text-[var(--color-muted)]">A new commission rate applies to future orders only. Changing the customer discount creates a new Stripe code with the same name.</p>
        </Card>
      </div>

      <Card className="mb-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-lg">Pay {a.name.split(' ')[0]}</h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Owed now: <b className="text-[var(--color-navy)]">{money(s.approved)}</b>
              {a.payout_details ? <> · Pay to: {a.payout_details}</> : ' · No payout details saved yet'}
            </p>
            <p className="mt-1 text-xs text-[var(--color-muted)]">Send the money by PayPal or bank first, then record it here to mark those commissions paid.</p>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            {s.pending > 0 && (
              <form action={approvePendingCommissions}>
                <input type="hidden" name="id" value={a.id} />
                <button className={btnSmOutline}>Approve pending now ({money(s.pending)})</button>
              </form>
            )}
            {s.approved > 0 && (
              <form action={recordPayout} className="flex flex-wrap items-end gap-2">
                <input type="hidden" name="id" value={a.id} />
                <input type="hidden" name="expected_cents" value={s.approved} />
                <input name="method" placeholder="PayPal / bank" className={`${inputCls} w-32`} />
                <input name="reference" placeholder="Reference (optional)" className={`${inputCls} w-44`} />
                <button className={btnSm}>Record payout of {money(s.approved)}</button>
              </form>
            )}
          </div>
        </div>
      </Card>

      <h2 className="mb-3 text-lg">Commissions</h2>
      <Table head={['Date', 'Order', 'Source', 'Order value', 'Rate', 'Commission', 'Status', '']} empty={!rows.length}>
        {rows.map((c) => (
          <tr key={c.id}>
            <td className={td}>{date(c.created_at)}</td>
            <td className={td}>
              {c.orders ? <Link href={`/admin/orders/${c.orders.order_number}`} className="font-semibold text-[var(--color-accent)]">#{c.orders.order_number}</Link> : '—'}
            </td>
            <td className={td}>{SOURCE[c.source] ?? c.source}</td>
            <td className={td}>{money(c.base_cents)}</td>
            <td className={td}>{Number(c.rate_pct)}%</td>
            <td className={`${td} font-semibold`}>{money(c.amount_cents)}</td>
            <td className={td}>
              <Badge status={c.status === 'void' ? 'cancelled' : c.status} />
              {c.void_reason && <p className="text-xs text-[var(--color-muted)]">{c.void_reason}</p>}
            </td>
            <td className={td}>
              {['pending', 'approved'].includes(c.status) && (
                <form action={voidCommission}>
                  <input type="hidden" name="affiliate_id" value={a.id} />
                  <input type="hidden" name="commission_id" value={c.id} />
                  <button className="text-xs font-semibold text-[var(--color-muted)] hover:text-red-600">Void</button>
                </form>
              )}
            </td>
          </tr>
        ))}
      </Table>

      {Boolean(payouts?.length) && (
        <>
          <h2 className="mb-3 mt-8 text-lg">Payouts</h2>
          <Table head={['Date', 'Amount', 'Method', 'Reference', 'Recorded by']}>
            {payouts!.map((p) => (
              <tr key={p.id}>
                <td className={td}>{date(p.created_at)}</td>
                <td className={`${td} font-semibold`}>{money(p.amount_cents)}</td>
                <td className={td}>{p.method ?? '—'}</td>
                <td className={td}>{p.reference ?? '—'}</td>
                <td className={td}>{p.paid_by ?? '—'}</td>
              </tr>
            ))}
          </Table>
        </>
      )}
    </>
  );
}
