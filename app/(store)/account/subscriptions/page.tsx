import Link from 'next/link';
import { RefreshCw, CreditCard, SkipForward, Pause, Play } from 'lucide-react';
import { requireAccount, loadAccount, type AccountSubscription } from '@/lib/account/data';
import { liveSubscription, type LiveSubscription } from '@/lib/account/stripe';
import { Badge, Card, Empty, Flash, Label, PageTitle, field } from '@/components/account/ui';
import { day, money, every, type Tone } from '@/lib/account/format';
import { subscriptionAction } from '../actions';

export const dynamic = 'force-dynamic';

const btn = 'inline-flex items-center gap-2 rounded-full border-[1.5px] border-[var(--color-navy)] px-4 py-2 text-sm font-semibold text-[var(--color-navy)] transition hover:bg-[var(--color-navy)] hover:text-white';

function Act({ id, action, children }: { id: string; action: string; children: React.ReactNode }) {
  return (
    <form action={subscriptionAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="action" value={action} />
      <button className={btn}>{children}</button>
    </form>
  );
}

function SubscriptionCard({ s, live }: { s: AccountSubscription; live: LiveSubscription | null }) {
  const pastDue = s.status === 'past_due' || s.status === 'unpaid';
  const skipping = s.paused && !!live?.resumesAt;
  const [state, tone]: [string, Tone] = s.cancelling ? [`Ends ${day(s.renews)}`, 'muted'] : skipping ? ['Skipping next order', 'amber'] : s.paused ? ['Paused', 'amber'] : pastDue ? ['Payment needed', 'amber'] : ['Active', 'green'];
  return (
    <li data-testid="account-subscription">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg">{s.items.length ? s.items.join(', ') : 'Subscription'}</h2>
          <Badge tone={tone}>{state}</Badge>
        </div>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          {every(s.frequencyDays)} · {money(s.amountCents)} · free shipping
          {live?.card ? ` · ${live.card.brand.charAt(0).toUpperCase()}${live.card.brand.slice(1)} ending ${live.card.last4}` : ''}
        </p>
        <p className="mt-1 text-sm font-semibold" data-testid="subscription-next">
          {s.cancelling
            ? `No more orders. You're covered until ${day(s.renews)}.`
            : skipping
              ? `The ${day(s.renews)} order is skipped. Deliveries pick up again after that.`
              : s.paused
                ? 'Paused: nothing ships and nothing is charged.'
                : pastDue
                  ? "Your last payment didn't go through. Update your card to keep your deliveries."
                  : `Next order: ${day(s.renews)}`}
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          {s.cancelling ? (
            <Act id={s.id} action="reactivate"><Play className="h-4 w-4" aria-hidden /> Keep my subscription</Act>
          ) : s.paused ? (
            <Act id={s.id} action="resume"><Play className="h-4 w-4" aria-hidden /> {skipping ? "Don't skip" : 'Resume'}</Act>
          ) : (
            <>
              {!pastDue && <Act id={s.id} action="skip"><SkipForward className="h-4 w-4" aria-hidden /> Skip next order</Act>}
              <Act id={s.id} action="pause"><Pause className="h-4 w-4" aria-hidden /> Pause</Act>
            </>
          )}
          <a href="/api/account/portal" className={btn}><CreditCard className="h-4 w-4" aria-hidden /> {pastDue ? 'Update card' : 'Card and invoices'}</a>
        </div>

        {!s.cancelling && (
          <details className="mt-5 border-t border-[var(--color-line)] pt-4">
            <summary className="cursor-pointer text-sm font-semibold text-[var(--color-muted)] underline">Cancel subscription</summary>
            <form action={subscriptionAction} className="mt-4 grid gap-4">
              <input type="hidden" name="id" value={s.id} />
              <input type="hidden" name="action" value="cancel" />
              <p className="text-sm text-[var(--color-muted)]">No fees and no calls. Nothing more is charged. Got too much on the shelf? Skipping or pausing keeps your price.</p>
              <Label text="Why are you cancelling? (optional, it helps us)">
                <select name="reason" className={field} defaultValue="other">
                  <option value="unused">I have too much / I don&apos;t use it enough</option>
                  <option value="too_expensive">It costs too much</option>
                  <option value="low_quality">It isn&apos;t working for me</option>
                  <option value="switched_service">I switched to another brand</option>
                  <option value="other">Other</option>
                </select>
              </Label>
              <Label text="Anything else? (optional)"><textarea name="comment" maxLength={500} rows={2} className={field} /></Label>
              <div><button className="rounded-full bg-red-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-800">Cancel my subscription</button></div>
            </form>
          </details>
        )}
      </Card>
    </li>
  );
}

export default async function SubscriptionsPage({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const email = await requireAccount();
  const [a, sp] = await Promise.all([loadAccount(email), searchParams]);
  const live = await Promise.all(a.subscriptions.map((s) => liveSubscription(s.stripeId)));
  return (
    <>
      <PageTitle icon={RefreshCw} title="Subscriptions" sub="Skip an order, pause, or cancel in one click. No fees, no phone calls." />
      <Flash {...sp} />
      {a.subscriptions.length ? (
        <>
          <ul className="grid gap-4">{a.subscriptions.map((s, n) => <SubscriptionCard key={s.id} s={s} live={live[n]} />)}</ul>
          <p className="mt-5 text-sm text-[var(--color-muted)]">
            Orders ship to the address in <Link href="/account/profile" className="font-semibold text-[var(--color-navy)] underline">Profile &amp; address</Link>. To change how often it arrives or swap a product, email us and we&apos;ll do it the same day.
          </p>
        </>
      ) : (
        <Empty>No active subscriptions. Subscribing saves $5 on every order, and you can skip or cancel any time. <Link href="/shop" className="font-semibold text-[var(--color-navy)] underline">Browse the shop</Link></Empty>
      )}
    </>
  );
}
