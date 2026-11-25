import { Settings, Mail, Download, Trash2, LogOut } from 'lucide-react';
import { requireAccount, loadAccount } from '@/lib/account/data';
import { Card, Flash, Label, PageTitle, field } from '@/components/account/ui';
import { emailPreference, deleteRequest } from '../actions';

export const dynamic = 'force-dynamic';

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const email = await requireAccount();
  const [a, sp] = await Promise.all([loadAccount(email), searchParams]);
  const on = a.newsletter === 'subscribed';
  return (
    <>
      <PageTitle icon={Settings} title="Emails & privacy" />
      <Flash {...sp} />

      <Card>
        <h2 className="flex items-center gap-2 text-lg"><Mail className="h-4 w-4 text-[var(--color-accent)]" aria-hidden /> Emails from us</h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]" data-testid="email-state">
          {on ? 'You get our emails: new guides, launches and offers.' : "You're not on our email list."} Order, shipping and subscription emails always reach you.
        </p>
        <form action={emailPreference} className="mt-4">
          <input type="hidden" name="want" value={on ? 'off' : 'on'} />
          <button className="btn btn-outline text-sm">{on ? 'Unsubscribe' : 'Send me guides and offers'}</button>
        </form>
      </Card>

      <Card className="mt-4">
        <h2 className="flex items-center gap-2 text-lg"><Download className="h-4 w-4 text-[var(--color-accent)]" aria-hidden /> Your data</h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">Download everything we hold about you: orders, subscriptions and email settings. Card details are held by Stripe, our payment processor, never by us. Lab results stay with the lab.</p>
        <a href="/account/data" className="btn btn-outline mt-4 inline-flex text-sm">Download my data</a>
      </Card>

      <Card className="mt-4">
        <details>
          <summary className="flex cursor-pointer items-center gap-2 text-lg font-semibold"><Trash2 className="h-4 w-4 text-[var(--color-accent)]" aria-hidden /> Delete my data</summary>
          <p className="mt-3 text-sm text-[var(--color-muted)]">We remove your name, email and address from our records. Order totals are kept without personal details, as tax law requires. This can&apos;t be undone. Cancel any subscription first.</p>
          <form action={deleteRequest} className="mt-4 grid gap-4 sm:max-w-sm">
            <Label text="Type your email address to confirm"><input name="confirm" type="email" required autoComplete="off" className={field} /></Label>
            <div><button className="rounded-full bg-red-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-800">Request deletion</button></div>
          </form>
        </details>
      </Card>

      <form action="/api/account/sign-out" method="post" className="mt-8">
        <button className="inline-flex items-center gap-1.5 text-sm font-semibold underline"><LogOut className="h-4 w-4" aria-hidden /> Sign out</button>
      </form>
    </>
  );
}
