import { requireAdmin } from '@/lib/admin/auth';
import { db } from '@/lib/db/server';
import { dbConfigured } from '@/lib/config';
import { subscriptionAction } from '@/app/admin/actions';
import { Badge, FilterLinks, Flash, NotConfigured, PageTitle, Table, btnSmOutline, date, money, td } from '@/components/admin/ui';

const STATUSES = ['active', 'past_due', 'paused', 'canceled'];

function Action({ id, action, label }: { id: string; action: string; label: string }) {
  return (
    <form action={subscriptionAction}>
      <input type="hidden" name="stripe_subscription_id" value={id} />
      <input type="hidden" name="action" value={action} />
      <button className={btnSmOutline}>{label}</button>
    </form>
  );
}

export default async function SubscriptionsPage({ searchParams }: { searchParams: Promise<{ status?: string; msg?: string }> }) {
  await requireAdmin('subscriptions');
  const { status, msg } = await searchParams;
  if (!dbConfigured()) return (<><PageTitle title="Subscriptions" /><NotConfigured what="The database" /></>);

  let query = db()
    .from('subscriptions')
    .select('*, customers(email, name)')
    .order('created_at', { ascending: false })
    .limit(200);
  if (status === 'paused') query = query.eq('paused', true);
  else if (status && STATUSES.includes(status)) query = query.eq('status', status);
  const { data } = await query;

  return (
    <>
      <PageTitle title="Subscriptions" />
      <Flash msg={msg} />
      <div className="mb-4">
        <FilterLinks base="/admin/subscriptions" param="status" current={status} options={STATUSES} />
      </div>
      <Table head={['Customer', 'Status', 'Every', 'Amount', 'Next renewal', 'Started', 'Actions']} empty={!data?.length}>
        {data?.map((s) => {
          const c = s.customers as { email: string; name: string | null } | null;
          const live = s.status !== 'canceled';
          return (
            <tr key={s.id}>
              <td className={td}>
                <div className="font-semibold">{c?.name ?? '—'}</div>
                <div className="text-xs text-[var(--color-muted)]">{c?.email}</div>
              </td>
              <td className={td}>
                <div className="flex flex-wrap gap-1">
                  <Badge status={s.paused ? 'paused' : s.status} />
                  {s.cancel_at_period_end && live && <Badge status="cancelling" />}
                </div>
              </td>
              <td className={td}>{s.frequency_days} days</td>
              <td className={td}>{money(s.amount_cents)}</td>
              <td className={td}>{live ? date(s.current_period_end) : '—'}</td>
              <td className={td}>{date(s.created_at)}</td>
              <td className={td}>
                {live && (
                  <div className="flex gap-2">
                    {s.paused ? <Action id={s.stripe_subscription_id} action="resume" label="Resume" /> : <Action id={s.stripe_subscription_id} action="pause" label="Pause" />}
                    {s.cancel_at_period_end ? (
                      <Action id={s.stripe_subscription_id} action="reactivate" label="Undo cancel" />
                    ) : (
                      <Action id={s.stripe_subscription_id} action="cancel" label="Cancel at period end" />
                    )}
                  </div>
                )}
              </td>
            </tr>
          );
        })}
      </Table>
    </>
  );
}
