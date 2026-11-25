import type { Metadata } from 'next';
import { LogOut } from 'lucide-react';
import { accountEmail } from '@/lib/account/session';
import { dbConfigured } from '@/lib/config';
import { AccountNav } from '@/components/account/AccountNav';

export const metadata: Metadata = {
  title: 'Your Account | Noovit',
  description: 'See your Noovit orders, tracking and subscriptions. We email you a secure sign-in link, no password needed.',
  robots: { index: false, follow: true },
};

// Signed in: the account area with its menu. Signed out: just the page (the sign-in form; sub-pages redirect to it).
export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const email = dbConfigured() ? await accountEmail() : null;
  if (!email) return children;
  return (
    <div className="container px-6 py-10 lg:grid lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-12 lg:py-14">
      <aside className="mb-8 lg:mb-0">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">Your account</p>
        <AccountNav />
        <div className="mt-5 hidden border-t border-[var(--color-line)] pt-4 lg:block">
          <p className="truncate text-xs text-[var(--color-muted)]" title={email}>{email}</p>
          <form action="/api/account/sign-out" method="post">
            <button className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold underline"><LogOut className="h-4 w-4" aria-hidden /> Sign out</button>
          </form>
        </div>
      </aside>
      <div className="min-w-0 max-w-3xl">{children}</div>
    </div>
  );
}
