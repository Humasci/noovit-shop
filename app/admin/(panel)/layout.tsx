import Link from 'next/link';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import {
  LayoutDashboard, ShoppingCart, Truck, Repeat, Users, Package, Star, Tag, LogOut, ExternalLink, Mail, ShoppingBag, Settings,
  Layers, FileText, Home, BarChart3, UserCog, UserCircle,
} from 'lucide-react';
import { requireAdmin, endSession } from '@/lib/admin/auth';
import { can, Permission } from '@/lib/admin/permissions';
import { dbConfigured, stripeConfigured } from '@/lib/config';

export const metadata: Metadata = { title: 'Admin — Noovit', robots: { index: false } };

const NAV: { group: string; items: { href: string; label: string; icon: typeof Home; perm: Permission }[] }[] = [
  {
    group: 'Sales',
    items: [
      { href: '/admin', label: 'Overview', icon: LayoutDashboard, perm: 'overview' },
      { href: '/admin/orders', label: 'Orders', icon: ShoppingCart, perm: 'orders' },
      { href: '/admin/fulfilment', label: 'Fulfilment', icon: Truck, perm: 'fulfilment' },
      { href: '/admin/subscriptions', label: 'Subscriptions', icon: Repeat, perm: 'subscriptions' },
      { href: '/admin/customers', label: 'Customers', icon: Users, perm: 'customers' },
      { href: '/admin/reports', label: 'Reports', icon: BarChart3, perm: 'reports' },
    ],
  },
  {
    group: 'Catalog',
    items: [
      { href: '/admin/products', label: 'Products', icon: Package, perm: 'products' },
      { href: '/admin/collections', label: 'Collections', icon: Layers, perm: 'products' },
      { href: '/admin/reviews', label: 'Reviews', icon: Star, perm: 'reviews' },
    ],
  },
  {
    group: 'Marketing',
    items: [
      { href: '/admin/discounts', label: 'Discounts', icon: Tag, perm: 'marketing' },
      { href: '/admin/subscribers', label: 'Subscribers', icon: Mail, perm: 'marketing' },
      { href: '/admin/abandoned', label: 'Abandoned carts', icon: ShoppingBag, perm: 'marketing' },
    ],
  },
  {
    group: 'Online store',
    items: [
      { href: '/admin/content', label: 'Homepage', icon: Home, perm: 'content' },
      { href: '/admin/blog', label: 'Blog', icon: FileText, perm: 'content' },
      { href: '/admin/settings', label: 'Settings', icon: Settings, perm: 'settings' },
      { href: '/admin/staff', label: 'Staff', icon: UserCog, perm: 'staff' },
    ],
  },
];

async function logout() {
  'use server';
  await endSession();
  redirect('/admin/login');
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const me = await requireAdmin();
  const missing = [!dbConfigured() && 'database', !stripeConfigured() && 'Stripe'].filter(Boolean);

  return (
    <div className="min-h-screen bg-[var(--color-soft)] md:flex">
      <aside className="border-b border-[var(--color-line)] bg-white md:sticky md:top-0 md:flex md:h-screen md:w-60 md:shrink-0 md:flex-col md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/admin" className="font-logo text-xl font-bold text-[var(--color-navy)]">
            noovit<span className="text-[var(--color-blue)]">.</span> <span className="text-xs font-semibold text-[var(--color-muted)]">admin</span>
          </Link>
        </div>
        <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:overflow-y-auto">
          {NAV.map(({ group, items }) => {
            const visible = items.filter((i) => can(me.role, i.perm));
            if (!visible.length) return null;
            return (
              <div key={group} className="flex gap-1 md:mb-3 md:flex-col">
                <p className="hidden px-3 pb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-muted)] md:block">{group}</p>
                {visible.map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href} className="flex shrink-0 items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-semibold text-[var(--color-navy)] hover:bg-[var(--color-soft)]">
                    <Icon className="h-4 w-4" /> {label}
                  </Link>
                ))}
              </div>
            );
          })}
        </nav>
        <div className="flex px-3 pb-3 md:block md:border-t md:border-[var(--color-line)] md:pt-3">
          <Link href="/admin/account" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--color-muted)] hover:bg-[var(--color-soft)]">
            <UserCircle className="h-4 w-4" /> {me.name}
          </Link>
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
