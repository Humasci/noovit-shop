import Link from 'next/link';
import { Package, RefreshCw, FlaskConical, Mail, Truck, LogOut, ShieldCheck } from 'lucide-react';
import { accountEmail } from '@/lib/account/session';
import { loadAccount, type AccountOrder, type AccountSubscription } from '@/lib/account/data';
import { SignInForm } from '@/components/account/SignInForm';
import { dbConfigured } from '@/lib/config';
import { getStoreProducts } from '@/lib/catalog/server';
import { marketingFooter } from '@/lib/marketing/subscribers';
import { productPath, testPath, HUB_URL } from '@/lib/urls';
import { formatPrice } from '@/lib/utils/format';
import { supportEmail } from '@/lib/settings';

// Customer account (25 Nov): orders, tracking, subscriptions, test-kit status, email preferences. Passwordless: an
// emailed link sets a 30-day session (lib/account/session.ts). Lab results are never shown or stored here.
export const dynamic = 'force-dynamic';

const day = (iso: string | null) => (iso ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso)) : '');
const money = (cents: number) => formatPrice(cents / 100);

const ORDER_STATUS: Record<string, { label: string; tone: 'navy' | 'green' | 'muted' }> = {
  paid: { label: 'Order received', tone: 'navy' },
  fulfilling: { label: 'Being packed', tone: 'navy' },
  shipped: { label: 'Shipped', tone: 'green' },
  delivered: { label: 'Delivered', tone: 'green' },
  cancelled: { label: 'Cancelled', tone: 'muted' },
  refunded: { label: 'Refunded', tone: 'muted' },
  partially_refunded: { label: 'Partly refunded', tone: 'muted' },
};
const TONE = { navy: 'bg-[var(--color-navy)] text-white', green: 'bg-[var(--color-green)] text-white', muted: 'bg-[var(--color-soft)] text-[var(--color-muted)]' };
const every = (days: number) => (days % 30 === 0 ? (days === 30 ? 'Every month' : `Every ${days / 30} months`) : `Every ${days} days`);

function Section({ icon: Icon, title, children }: { icon: typeof Package; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="flex items-center gap-2.5 text-2xl"><Icon className="h-5 w-5 text-[var(--color-accent)]" aria-hidden /> {title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
const Empty = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl bg-[var(--color-soft)] p-6 text-sm text-[var(--color-muted)]">{children}</div>
);

function OrderCard({ o, buyable }: { o: AccountOrder; buyable: Set<string> }) {
  const st = ORDER_STATUS[o.status] ?? { label: o.status, tone: 'muted' as const };
  const tracked = o.shipments.filter((s) => s.trackingUrl || s.trackingNumber);
  return (
    <li className="rounded-2xl border border-[var(--color-line)] bg-white p-5" data-testid="account-order">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-semibold">Order #{o.number} <span className="font-normal text-[var(--color-muted)]">· {day(o.placed)}</span></p>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${TONE[st.tone]}`}>{st.label}</span>
      </div>
      <ul className="mt-3 divide-y divide-[var(--color-line)] text-sm">
        {o.items.map((i, n) => (
          <li key={n} className="flex items-center justify-between gap-3 py-2">
            <span>
              {i.name}
              {i.bottles > 1 ? ` (${i.bottles}-pack)` : ''}
              {i.quantity > 1 ? ` × ${i.quantity}` : ''}
              {i.mode === 'subscribe' && <span className="ml-2 text-xs text-[var(--color-muted)]">Subscription</span>}
            </span>
            {i.isKit ? (
              <Link href={testPath(i.slug)} className="shrink-0 text-xs font-semibold underline">About this kit</Link>
            ) : buyable.has(i.slug) ? (
              <Link href={productPath(i.slug)} className="shrink-0 text-xs font-semibold underline">Buy again</Link>
            ) : null}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
        <span className="text-[var(--color-muted)]">Total {money(o.totalCents)}</span>
        {tracked.length > 0 ? (
          <span className="flex flex-wrap gap-3">
            {tracked.map((s, n) =>
              s.trackingUrl ? (
                <a key={n} href={s.trackingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-[var(--color-navy)] underline">
                  <Truck className="h-4 w-4" aria-hidden /> Track {tracked.length > 1 ? `package ${n + 1}` : 'package'}
                </a>
              ) : (
                <span key={n} className="inline-flex items-center gap-1.5"><Truck className="h-4 w-4" aria-hidden /> {s.carrier ?? 'Tracking'}: {s.trackingNumber}</span>
              )
            )}
          </span>
        ) : o.status === 'paid' || o.status === 'fulfilling' ? (
          <span className="text-[var(--color-muted)]">Tracking appears here when it ships</span>
        ) : null}
      </div>
    </li>
  );
}

function SubscriptionCard({ s, canManage }: { s: AccountSubscription; canManage: boolean }) {
  const state = s.paused ? 'Paused' : s.cancelling ? `Ends ${day(s.renews)}` : s.status === 'past_due' || s.status === 'unpaid' ? 'Payment needed' : 'Active';
  return (
    <li className="rounded-2xl border border-[var(--color-line)] bg-white p-5" data-testid="account-subscription">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-semibold">{s.items.length ? s.items.join(', ') : 'Subscription'}</p>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${state === 'Active' ? TONE.green : state === 'Payment needed' ? 'bg-amber-100 text-amber-900' : TONE.muted}`}>{state}</span>
      </div>
      <p className="mt-2 text-sm text-[var(--color-muted)]">
        {every(s.frequencyDays)} · {money(s.amountCents)}
        {!s.paused && !s.cancelling && s.renews ? ` · Next order ${day(s.renews)}` : ''}
      </p>
      {canManage && (
        <a href="/api/account/portal" className="btn btn-outline mt-4 inline-flex text-sm">Manage: skip, change card or cancel</a>
      )}
    </li>
  );
}

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ expired?: string }> }) {
  const { expired } = await searchParams;
  const SUPPORT_EMAIL = await supportEmail();
  const email = dbConfigured() ? await accountEmail() : null;

  if (!email) {
    return (
      <div className="container max-w-xl px-6 py-20">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">Your account</p>
        <h1 className="mt-2 text-center text-4xl">Sign in</h1>
        <p className="mt-3 text-center text-[var(--color-muted)]">Enter the email you ordered or signed up with. We&apos;ll send you a secure link. No password to remember.</p>
        {expired && <p className="mt-6 rounded-xl bg-amber-50 p-3 text-center text-sm text-amber-800">That link has expired. Request a new one below.</p>}
        <SignInForm />
        <ul className="mt-12 grid grid-cols-2 gap-4 text-sm font-semibold">
          {[[Package, 'Orders and tracking'], [RefreshCw, 'Manage subscriptions'], [FlaskConical, 'Test kit status'], [Mail, 'Email preferences']].map(([Icon, text]) => {
            const I = Icon as typeof Package;
            return <li key={text as string} className="flex items-center gap-3 rounded-2xl bg-[var(--color-soft)] p-4"><I className="h-5 w-5 shrink-0 text-[var(--color-accent)]" aria-hidden /> {text as string}</li>;
          })}
        </ul>
        <p className="mt-8 text-center text-sm text-[var(--color-muted)]">Need help? <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-[var(--color-navy)] underline">{SUPPORT_EMAIL}</a></p>
      </div>
    );
  }

  const [a, products, footer] = await Promise.all([loadAccount(email), getStoreProducts(), marketingFooter(email)]);
  const buyable = new Set(products.map((p) => p.slug));
  const kitOrders = a.orders.filter((o) => o.items.some((i) => i.isKit));

  return (
    <div className="container max-w-3xl px-6 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">Your account</p>
          <h1 className="mt-2 text-4xl">{a.name ? `Hi, ${a.name.split(' ')[0]}` : 'Welcome back'}</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]" data-testid="account-email">Signed in as {email}</p>
        </div>
        <form action="/api/account/sign-out" method="post">
          <button className="inline-flex items-center gap-1.5 text-sm font-semibold underline"><LogOut className="h-4 w-4" aria-hidden /> Sign out</button>
        </form>
      </div>

      <Section icon={Package} title="Orders">
        {a.orders.length ? (
          <ul className="grid gap-4">{a.orders.map((o) => <OrderCard key={o.id} o={o} buyable={buyable} />)}</ul>
        ) : (
          <Empty>No orders yet. When you order, it shows up here with its tracking link. <Link href="/shop" className="font-semibold text-[var(--color-navy)] underline">Browse the shop</Link></Empty>
        )}
      </Section>

      <Section icon={RefreshCw} title="Subscriptions">
        {a.subscriptions.length ? (
          <ul className="grid gap-4">{a.subscriptions.map((s) => <SubscriptionCard key={s.id} s={s} canManage={a.hasStripeCustomer} />)}</ul>
        ) : (
          <Empty>No active subscriptions. Subscribing saves $5 on every order, and you can skip or cancel any time.</Empty>
        )}
      </Section>

      <Section icon={FlaskConical} title="At-home tests">
        {kitOrders.length ? (
          <ul className="grid gap-3">
            {kitOrders.map((o) => (
              <li key={o.id} className="rounded-2xl border border-[var(--color-line)] bg-white p-5 text-sm">
                <p className="font-semibold">{o.items.filter((i) => i.isKit).map((i) => i.name).join(', ')}</p>
                <p className="mt-1 text-[var(--color-muted)]">Order #{o.number} · {(ORDER_STATUS[o.status] ?? { label: o.status }).label}. The lab emails you when your results are ready, with a link to its secure results page.</p>
              </li>
            ))}
          </ul>
        ) : (
          <Empty>
            {a.testsWaitlist !== null
              ? <>You&apos;re on the list{a.testsWaitlist ? ` for the ${a.testsWaitlist}` : ''}. We&apos;ll email you the day kits open. </>
              : <>Kits you order will show their status here. </>}
            <Link href={HUB_URL.tests} className="font-semibold text-[var(--color-navy)] underline">See the at-home tests</Link>
          </Empty>
        )}
        <p className="mt-3 flex items-start gap-2 text-xs text-[var(--color-muted)]"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> Your results stay with the lab. We never see them and they are never stored on this site.</p>
      </Section>

      <Section icon={Mail} title="Emails">
        <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5 text-sm">
          {a.program && (
            <p className="mb-3">
              <span className="font-semibold">Perimenopause, Decoded:</span>{' '}
              {a.program.done ? 'program complete.' : `email ${a.program.sent} of ${a.program.total} sent.`}{' '}
              <Link href="/programs/perimenopause/starter-kit" className="font-semibold underline">Open the starter kit</Link>
            </p>
          )}
          {a.newsletter === 'subscribed' ? (
            <p>You get our emails (guides, launches, offers). <a href={footer.unsubscribeUrl} className="font-semibold underline">Unsubscribe</a></p>
          ) : (
            <p className="text-[var(--color-muted)]">You&apos;re not on our email list. Order and shipping emails still reach you.</p>
          )}
        </div>
      </Section>

      <p className="mt-12 text-center text-sm text-[var(--color-muted)]">
        Something wrong with an order? <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-[var(--color-navy)] underline">{SUPPORT_EMAIL}</a> · 90-day money-back guarantee
      </p>
    </div>
  );
}
