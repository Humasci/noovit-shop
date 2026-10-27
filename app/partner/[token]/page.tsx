import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db/server';
import { dbConfigured } from '@/lib/config';
import { getSettings } from '@/lib/settings';
import { REF_DAYS, shareLink, statsByAffiliate, type Affiliate } from '@/lib/affiliates';
import { Logo } from '@/components/layout/Logo';
import { CopyField } from '@/components/admin/CopyField';
import { Badge, date, money } from '@/components/admin/ui';

// Private partner dashboard, reached by the unguessable link in the partner's welcome email.
export const metadata: Metadata = { title: 'Partner dashboard — Noovit', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

const SOURCE: Record<string, string> = { code: 'Code', link: 'Link', renewal: 'Renewal' };
const STATUS: Record<string, string> = { pending: 'pending', approved: 'approved', paid: 'paid', void: 'cancelled' };

export default async function PartnerDashboard({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[0-9a-f]{64}$/.test(token) || !dbConfigured()) notFound();
  const { data } = await db().from('affiliates').select('*').eq('portal_token', token).maybeSingle();
  const a = data as Affiliate | null;
  if (!a) notFound();

  const [stats, { data: rows }, settings] = await Promise.all([
    statsByAffiliate(a.id),
    db().from('commissions').select('source, base_cents, amount_cents, status, created_at').eq('affiliate_id', a.id).order('created_at', { ascending: false }).limit(100),
    getSettings(),
  ]);
  const s = stats.get(a.id);
  const hold = Number(settings.affiliate_hold_days || 30);
  const tiles = [
    ['Clicks', String(a.clicks)],
    ['Orders', String(s.orders)],
    ['Sales', money(s.sales)],
    ['Pending', money(s.pending)],
    ['Ready to pay', money(s.approved)],
    ['Paid to you', money(s.paid)],
  ];

  return (
    <main className="min-h-screen bg-[var(--color-soft)] px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <p className="text-2xl text-[var(--color-navy)]"><Logo /> <span className="text-sm font-semibold text-[var(--color-muted)]">partners</span></p>
        <h1 className="mt-6 text-3xl">Hi {a.name.split(' ')[0]}</h1>
        {a.status === 'paused' && <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">Your partnership is paused, so your code and link aren&apos;t active right now.</p>}
        <p className="mt-2 text-[var(--color-muted)]">
          {a.customer_discount_pct > 0 && <>Your audience gets {a.customer_discount_pct}% off their order with your code. </>}
          You earn {Number(a.commission_pct)}% of each order you refer{a.recurring ? ', including subscription renewals' : ''}.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {tiles.map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-[var(--color-line)] bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">{label}</p>
              <p className="mt-1 text-xl font-bold text-[var(--color-navy)]">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 rounded-2xl border border-[var(--color-line)] bg-white p-5 sm:grid-cols-2">
          <CopyField label="Your code" value={a.code} />
          <CopyField label="Your link" value={shareLink(a.code)} />
          <p className="text-xs text-[var(--color-muted)] sm:col-span-2">
            Your link remembers visitors for {REF_DAYS} days and applies your code automatically. To link to a product, add <span className="font-mono">?to=</span> and the product
            address, e.g. <span className="font-mono">{shareLink(a.code, '/products/magnesium-complex')}</span>. Commissions are approved {hold} days after the order (after any
            returns) and then paid out. Please disclose the partnership in your posts (#ad).
          </p>
        </div>

        <h2 className="mb-3 mt-8 text-lg">Your orders</h2>
        <div className="overflow-x-auto rounded-2xl border border-[var(--color-line)] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--color-line)] bg-[var(--color-soft)] text-xs uppercase tracking-wider text-[var(--color-muted)]">
              <tr>{['Date', 'Via', 'Order value', 'Your commission', 'Status'].map((h) => <th key={h} className="whitespace-nowrap px-4 py-3 font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-line)]">
              {(rows ?? []).length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-[var(--color-muted)]">No orders yet. Share your link to get started.</td></tr>}
              {(rows ?? []).map((c, i) => (
                <tr key={i}>
                  <td className="whitespace-nowrap px-4 py-3">{date(c.created_at)}</td>
                  <td className="whitespace-nowrap px-4 py-3">{SOURCE[c.source] ?? c.source}</td>
                  <td className="whitespace-nowrap px-4 py-3">{money(c.base_cents)}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold">{money(c.amount_cents)}</td>
                  <td className="whitespace-nowrap px-4 py-3"><Badge status={STATUS[c.status] ?? c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-xs text-[var(--color-muted)]">Questions about your partnership? Reply to your welcome email.</p>
      </div>
    </main>
  );
}
