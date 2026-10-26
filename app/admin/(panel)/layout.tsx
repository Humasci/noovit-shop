import Link from 'next/link';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, Truck, Repeat, Users, Package, Star, Tag, LogOut, ExternalLink } from 'lucide-react';
import { requireAdmin, endSession } from '@/lib/admin/auth';
import { dbConfigured, stripeConfigured } from '@/lib/config';

export const metadata: Metadata = { title: 'Admin — Noovit', robots: { index: false } };

const NAV = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/fulfilment', label: 'Fulfilment', icon: Truck },
  { href: '/admin/subscriptions', label: 'Subscriptions', icon: Repeat },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/discounts', label: 'Discounts', icon: Tag },
];

async function logout() {
  'use server';
  await endSession();
  redirect('/admin/login');
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const missing = [!dbConfigured() && 'database', !stripeConfigured() && 'Stripe'].filter(Boolean);

  return (
    <div className="min-h-screen bg-[var(--color-soft)] md:flex">
      <aside className="border-b border-[var(--color-line)] bg-white md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/admin" className="text-xl font-extrabold text-[var(--color-navy)]">
            noovit<span className="text-[var(--color-blue)]">.</span> <span className="text-xs font-semibold text-[var(--color-muted)]">admin</span>
          </Link>
        </div>
        <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-[var(--color-navy)] hover:bg-[var(--color-soft)]">
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
        </nav>
        <div className="flex px-3 pb-3 md:absolute md:bottom-4 md:block md:w-60 md:pb-0">
          <Link href="/" target="_blank" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--color-muted)] hover:bg-[var(--color-soft)]">
            <ExternalLink className="h-4 w-4" /> View store
          </Link>
          <form action={logout}>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--color-muted)] hover:bg-[var(--color-soft)]">
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-5 md:p-8">
        {missing.length > 0 && (
          <p className="mb-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Not connected yet: <b>{missing.join(' and ')}</b>. Data will appear once the keys are added.
          </p>
        )}
        {children}
      </main>
    </div>
  );
}
