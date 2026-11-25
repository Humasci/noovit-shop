import Link from 'next/link';
import { Package, RefreshCw, FlaskConical, Mail, CalendarClock, ChevronRight } from 'lucide-react';
import { accountEmail } from '@/lib/account/session';
import { loadAccount } from '@/lib/account/data';
import { SignInForm } from '@/components/account/SignInForm';
import { OrderRow } from '@/components/account/OrderRow';
import { Card, Empty } from '@/components/account/ui';
import { day, money, every } from '@/lib/account/format';
import { dbConfigured } from '@/lib/config';
import { supportEmail } from '@/lib/settings';
import { HUB_URL } from '@/lib/urls';

// Customer account (25 Nov). Passwordless: an emailed link sets a 30-day session (lib/account/session.ts).
// Signed out: the sign-in form. Signed in: the overview; the rest lives in the sub-pages (menu in layout.tsx).
export const dynamic = 'force-dynamic';

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ expired?: string }> }) {
  const { expired } = await searchParams;
  const email = dbConfigured() ? await accountEmail() : null;

  if (!email) {
    const support = await supportEmail();
    return (
      <div className="container max-w-xl px-6 py-20">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">Your account</p>
        <h1 className="mt-2 text-center text-4xl">Sign in</h1>
        <p className="mt-3 text-center text-[var(--color-muted)]">Enter the email you ordered or signed up with. We&apos;ll send you a secure link. No password to remember.</p>
        {expired && <p className="mt-6 rounded-xl bg-amber-50 p-3 text-center text-sm text-amber-800">That link has expired. Request a new one below.</p>}
        <SignInForm />
        <ul className="mt-12 grid grid-cols-2 gap-4 text-sm font-semibold">
          {([[Package, 'Orders and tracking'], [RefreshCw, 'Skip, pause or cancel subscriptions'], [FlaskConical, 'Test kit status'], [Mail, 'Address and email settings']] as const).map(([Icon, text]) => (
            <li key={text} className="flex items-center gap-3 rounded-2xl bg-[var(--color-soft)] p-4"><Icon className="h-5 w-5 shrink-0 text-[var(--color-accent)]" aria-hidden /> {text}</li>
          ))}
        </ul>
        <p className="mt-8 text-center text-sm text-[var(--color-muted)]">Need help? <a href={`mailto:${support}`} className="font-semibold text-[var(--color-navy)] underline">{support}</a></p>
      </div>
    );
  }

  const a = await loadAccount(email);
  const next = a.subscriptions.filter((s) => !s.paused && !s.cancelling && s.renews).sort((x, y) => (x.renews! < y.renews! ? -1 : 1))[0];
  const inTransit = a.orders.filter((o) => ['paid', 'fulfilling', 'shipped'].includes(o.status));
  const recent = (inTransit.length ? inTransit : a.orders).slice(0, 2);

  return (
    <>
      <h1 className="text-4xl">{a.name ? `Hi, ${a.name.split(' ')[0]}` : 'Welcome back'}</h1>
      <p className="mt-1 text-sm text-[var(--color-muted)]" data-testid="account-email">Signed in as {email}</p>

      <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
        {[
          { href: '/account/orders', icon: Package, n: a.orders.length, label: a.orders.length === 1 ? 'Order' : 'Orders' },
          { href: '/account/subscriptions', icon: RefreshCw, n: a.subscriptions.length, label: a.subscriptions.length === 1 ? 'Subscription' : 'Subscriptions' },
          { href: '/account/tests', icon: FlaskConical, n: a.orders.filter((o) => o.items.some((i) => i.isKit)).length, label: 'Test kits' },
        ].map(({ href, icon: Icon, n, label }) => (
          <Link key={href} href={href} className="group rounded-2xl bg-[var(--color-soft)] p-3.5 transition hover:bg-[var(--color-line)] sm:p-5">
            <Icon className="h-5 w-5 text-[var(--color-accent)]" aria-hidden />
            <p className="mt-2 text-2xl font-semibold text-[var(--color-navy)] sm:mt-3 sm:text-3xl">{n}</p>
            <p className="flex items-center justify-between text-xs text-[var(--color-muted)] sm:text-sm">{label} <ChevronRight className="hidden h-4 w-4 transition group-hover:translate-x-0.5 sm:block" aria-hidden /></p>
          </Link>
        ))}
      </div>

      {next && (
        <Card className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-accent)]" aria-hidden />
            <div>
              <p className="font-semibold">Next delivery: {day(next.renews)}</p>
              <p className="mt-0.5 text-sm text-[var(--color-muted)]">{next.items.join(', ') || 'Subscription'} · {every(next.frequencyDays).toLowerCase()} · {money(next.amountCents)}</p>
            </div>
          </div>
          <Link href="/account/subscriptions" className="btn btn-outline text-sm">Skip or change</Link>
        </Card>
      )}

      <section className="mt-10">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl">{inTransit.length ? 'On the way' : 'Recent orders'}</h2>
          {a.orders.length > 0 && <Link href="/account/orders" className="text-sm font-semibold underline">All orders</Link>}
        </div>
        <div className="mt-4">
          {recent.length ? (
            <ul className="grid gap-4">{recent.map((o) => <OrderRow key={o.id} o={o} />)}</ul>
          ) : (
            <Empty>No orders yet. When you order, it shows up here with its tracking link. <Link href="/shop" className="font-semibold text-[var(--color-navy)] underline">Browse the shop</Link></Empty>
          )}
        </div>
      </section>

      {(a.testsWaitlist !== null || a.program) && (
        <section className="mt-10 grid gap-4">
          {a.testsWaitlist !== null && (
            <Card className="text-sm">
              <span className="font-semibold">At-home tests:</span> you&apos;re on the list{a.testsWaitlist ? ` for the ${a.testsWaitlist}` : ''}. We&apos;ll email you the day kits open.{' '}
              <Link href={HUB_URL.tests} className="font-semibold underline">See the tests</Link>
            </Card>
          )}
          {a.program && (
            <Card className="text-sm">
              <span className="font-semibold">Perimenopause, Decoded:</span> {a.program.done ? 'program complete.' : `email ${a.program.sent} of ${a.program.total} sent.`}{' '}
              <Link href="/programs/perimenopause/starter-kit" className="font-semibold underline">Open the starter kit</Link>
            </Card>
          )}
        </section>
      )}
    </>
  );
}
