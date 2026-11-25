import Link from 'next/link';
import { FlaskConical, ShieldCheck } from 'lucide-react';
import { requireAccount, loadAccount } from '@/lib/account/data';
import { Badge, Card, Empty, PageTitle } from '@/components/account/ui';
import { day, orderStatus } from '@/lib/account/format';
import { HUB_URL, testPath } from '@/lib/urls';

export const dynamic = 'force-dynamic';

// Kit status only. Results are delivered by the lab on its own secure page; they are never shown or stored here.
export default async function TestsPage() {
  const email = await requireAccount();
  const a = await loadAccount(email);
  const kitOrders = a.orders.filter((o) => o.items.some((i) => i.isKit));
  return (
    <>
      <PageTitle icon={FlaskConical} title="At-home tests" sub="Where each kit is, from our door to the lab." />
      {kitOrders.length ? (
        <ul className="grid gap-4">
          {kitOrders.flatMap((o) => o.items.filter((i) => i.isKit).map((i, n) => {
            const st = orderStatus(o.status);
            return (
              <li key={`${o.id}-${n}`}>
                <Card className="text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-lg">{i.name}</h2>
                    <Badge tone={st.tone}>{st.label}</Badge>
                  </div>
                  <p className="mt-1 text-[var(--color-muted)]">Order <Link href={`/account/orders/${o.number}`} className="font-semibold underline">#{o.number}</Link> · {day(o.placed)}</p>
                  <ol className="mt-4 grid gap-2 text-[var(--color-muted)]">
                    <li>1. Your kit arrives with a prepaid return envelope.</li>
                    <li>2. Collect your sample at home and mail it back the same day.</li>
                    <li>3. The lab emails you when your results are ready, with a link to its secure results page.</li>
                  </ol>
                  <Link href={testPath(i.slug)} className="mt-4 inline-block font-semibold underline">How this test works</Link>
                </Card>
              </li>
            );
          }))}
        </ul>
      ) : (
        <Empty>
          {a.testsWaitlist !== null
            ? <>You&apos;re on the list{a.testsWaitlist ? ` for the ${a.testsWaitlist}` : ''}. We&apos;ll email you the day kits open. </>
            : <>Kits you order will show their status here. </>}
          <Link href={HUB_URL.tests} className="font-semibold text-[var(--color-navy)] underline">See the at-home tests</Link>
        </Empty>
      )}
      <p className="mt-4 flex items-start gap-2 text-xs text-[var(--color-muted)]"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> Your results stay with the lab. We never see them and they are never stored on this site.</p>
    </>
  );
}
