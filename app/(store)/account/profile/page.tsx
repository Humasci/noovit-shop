import Link from 'next/link';
import { UserRound, Settings, ChevronRight } from 'lucide-react';
import { requireAccount, loadAccount } from '@/lib/account/data';
import { savedShipping } from '@/lib/account/stripe';
import { Card, Flash, Label, PageTitle, field } from '@/components/account/ui';
import { supportEmail } from '@/lib/settings';
import { saveName, saveAddress } from '../actions';

export const dynamic = 'force-dynamic';

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const email = await requireAccount();
  const [a, sp, support] = await Promise.all([loadAccount(email), searchParams, supportEmail()]);
  const saved = await savedShipping(a.stripeCustomerId);
  const last = a.orders.find((o) => o.shippingAddress);
  const ship = saved ?? (last ? { name: last.shippingName, address: last.shippingAddress } : null);
  const ad = ship?.address;
  return (
    <>
      <PageTitle icon={UserRound} title="Profile & address" />
      <Flash {...sp} />

      <Card>
        <h2 className="text-lg">Your details</h2>
        <form action={saveName} className="mt-4 grid gap-4 sm:grid-cols-2">
          <Label text="Name"><input name="name" required minLength={2} maxLength={80} defaultValue={a.name ?? ''} autoComplete="name" className={field} /></Label>
          <Label text="Email"><input value={email} readOnly disabled className={`${field} bg-[var(--color-soft)] text-[var(--color-muted)]`} /></Label>
          <div className="sm:col-span-2"><button className="btn btn-primary text-sm">Save name</button></div>
        </form>
        <p className="mt-4 text-xs text-[var(--color-muted)]">To change your email address, write to <a href={`mailto:${support}`} className="font-semibold underline">{support}</a> from the current one. We move your orders and subscriptions across.</p>
      </Card>

      <Card className="mt-4">
        <h2 className="text-lg">Shipping address</h2>
        {a.stripeCustomerId ? (
          <>
            <p className="mt-1 text-sm text-[var(--color-muted)]">Subscription orders ship here. Orders already being packed keep the address they were placed with.</p>
            <form action={saveAddress} className="mt-4 grid gap-4 sm:grid-cols-6" data-testid="address-form">
              <Label text="Full name" className="sm:col-span-6"><input name="ship_name" required defaultValue={ship?.name ?? a.name ?? ''} autoComplete="shipping name" className={field} /></Label>
              <Label text="Street address" className="sm:col-span-4"><input name="line1" required defaultValue={ad?.line1 ?? ''} autoComplete="shipping address-line1" className={field} /></Label>
              <Label text="Apt, suite (optional)" className="sm:col-span-2"><input name="line2" defaultValue={ad?.line2 ?? ''} autoComplete="shipping address-line2" className={field} /></Label>
              <Label text="City" className="sm:col-span-3"><input name="city" required defaultValue={ad?.city ?? ''} autoComplete="shipping address-level2" className={field} /></Label>
              <Label text="State" className="sm:col-span-1"><input name="state" required maxLength={2} pattern="[A-Za-z]{2}" placeholder="TX" defaultValue={ad?.state ?? ''} autoComplete="shipping address-level1" className={`${field} uppercase`} /></Label>
              <Label text="ZIP code" className="sm:col-span-2"><input name="zip" required pattern="\d{5}(-\d{4})?" inputMode="numeric" defaultValue={ad?.postal_code ?? ''} autoComplete="shipping postal-code" className={field} /></Label>
              <Label text="Phone for the carrier (optional)" className="sm:col-span-3"><input name="phone" type="tel" defaultValue={ad?.phone ?? ''} autoComplete="tel" className={field} /></Label>
              <div className="sm:col-span-6"><button className="btn btn-primary text-sm">Save address</button></div>
            </form>
            <p className="mt-4 text-xs text-[var(--color-muted)]">We ship within the United States only.</p>
          </>
        ) : (
          <p className="mt-2 text-sm text-[var(--color-muted)]">Your address is saved when you place your first order. After that you can change it here.</p>
        )}
      </Card>

      <Link href="/account/settings" className="mt-4 flex items-center justify-between rounded-2xl bg-[var(--color-soft)] p-5 text-sm font-semibold hover:bg-[var(--color-line)]">
        <span className="flex items-center gap-2.5"><Settings className="h-4 w-4 text-[var(--color-accent)]" aria-hidden /> Emails &amp; privacy: email settings, download or delete your data, sign out</span>
        <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
      </Link>
    </>
  );
}
