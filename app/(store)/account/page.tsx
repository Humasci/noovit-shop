import Link from 'next/link';
import { Package, RefreshCw, FlaskConical, Mail, CalendarClock, ChevronRight, BellRing, X } from 'lucide-react';
import { notifyRemove } from './actions';
import { Flash } from '@/components/account/ui';
import { accountEmail } from '@/lib/account/session';
import { loadAccount } from '@/lib/account/data';
import { SignInForm } from '@/components/account/SignInForm';
import { OrderRow } from '@/components/account/OrderRow';
import { Card, Empty } from '@/components/account/ui';
import { day, money, every } from '@/lib/account/format';
import { dbConfigured } from '@/lib/config';
import { googleConfigured } from '@/lib/account/google';
import { supportEmail } from '@/lib/settings';
import { HUB_URL } from '@/lib/urls';

// Customer account (25 Nov). Passwordless: an emailed link sets a 30-day session (lib/account/session.ts).
// Signed out: the sign-in form. Signed in: the overview; the rest lives in the sub-pages (menu in layout.tsx).
export const dynamic = 'force-dynamic';

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ expired?: string; google?: string; ok?: string; err?: string }> }) {
  const { expired, google, ok, err } = await searchParams;
  const email = dbConfigured() ? await accountEmail() : null;

  if (!email) {
    const support = await supportEmail();
    return (
      <div className="container max-w-xl px-6 py-20">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">Your account</p>
        <h1 className="mt-2 text-center text-4xl">Sign in</h1>
        <p className="mt-3 text-center text-[var(--color-muted)]">Enter the email you ordered or signed up with. We&apos;ll send you a secure link. No password to remember.</p>
        {expired && <p className="mt-6 rounded-xl bg-amber-50 p-3 text-center text-sm text-amber-800">That link has expired. Request a new one below.</p>}
        {google === 'failed' && <p className="mt-6 rounded-xl bg-amber-50 p-3 text-center text-sm text-amber-800">Google sign-in didn&apos;t complete. Try again, or use the email link below.</p>}
        {googleConfigured() && (
          <>
            {/* A plain link (not next/link): it leaves the site for Google. Button follows Google's branding rules. */}
            <a href="/api/account/google" data-testid="google-sign-in" className="mt-8 flex w-full items-center justify-center gap-3 rounded-full border border-[#747775] bg-white px-5 py-3 text-[15px] font-medium text-[#1f1f1f] transition hover:bg-[#f8fafd]">
              <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              Continue with Google
            </a>
            <p className="mt-6 flex items-center gap-3 text-xs uppercase tracking-widest text-[var(--color-muted)]"><span className="h-px flex-1 bg-[var(--color-line)]" /> or by email <span className="h-px flex-1 bg-[var(--color-line)]" /></p>
          </>
        )}
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
      <Flash ok={ok} err={err} />
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

      {a.waiting.length > 0 && (
        <section className="mt-10" data-testid="notify-list">
          <h2 className="flex items-center gap-2.5 text-2xl"><BellRing className="h-5 w-5 text-[var(--color-accent)]" aria-hidden /> Your Notify me list</h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">We&apos;ll email you the day each one can be ordered.</p>
          <ul className="mt-4 divide-y divide-[var(--color-line)] rounded-2xl border border-[var(--color-line)] bg-white">
            {a.waiting.map((w) => (
              <li key={`${w.kind}-${w.slug}`} className="flex items-center justify-between gap-3 px-5 py-3.5 text-sm">
                <Link href={w.href} className="font-semibold hover:underline">{w.name}</Link>
                <span className="flex items-center gap-3">
                  <span className="hidden text-xs text-[var(--color-muted)] sm:inline">{w.kind === 'kit' ? 'At-home test' : 'Supplement'}</span>
                  <form action={notifyRemove}>
                    <input type="hidden" name="kind" value={w.kind} />
                    <input type="hidden" name="slug" value={w.slug} />
                    <button aria-label={`Remove ${w.name}`} className="rounded-full p-1.5 text-[var(--color-muted)] hover:bg-[var(--color-soft)] hover:text-[var(--color-navy)]"><X className="h-4 w-4" aria-hidden /></button>
                  </form>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(a.program || (a.testsWaitlist !== null && !a.waiting.some((w) => w.kind === 'kit'))) && (
        <section className="mt-10 grid gap-4">
          {a.testsWaitlist !== null && !a.waiting.some((w) => w.kind === 'kit') && (
            <Card className="text-sm">
              <span className="font-semibold">At-home tests:</span> you&apos;re on the list. We&apos;ll email you the day kits open.{' '}
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
