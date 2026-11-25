'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, RefreshCw, FlaskConical, UserRound, Settings } from 'lucide-react';

const LINKS = [
  { href: '/account', label: 'Overview', icon: LayoutDashboard },
  { href: '/account/orders', label: 'Orders', icon: Package },
  { href: '/account/subscriptions', label: 'Subscriptions', icon: RefreshCw },
  { href: '/account/tests', label: 'At-home tests', icon: FlaskConical },
  { href: '/account/profile', label: 'Profile & address', icon: UserRound },
  { href: '/account/settings', label: 'Emails & privacy', icon: Settings },
];

// Side menu on desktop, a scrolling row of pills on phones.
export function AccountNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Account" className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 lg:mx-0 lg:grid lg:gap-1 lg:overflow-visible lg:px-0 lg:pb-0">
      {LINKS.map(({ href, label, icon: Icon }) => {
        const active = href === '/account' ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`flex shrink-0 items-center gap-2.5 rounded-full px-4 py-2 text-sm font-medium transition lg:rounded-xl lg:px-3.5 lg:py-2.5 ${active ? 'bg-[var(--color-navy)] text-white' : 'bg-[var(--color-soft)] text-[var(--color-navy)] hover:bg-[var(--color-line)] lg:bg-transparent'}`}
          >
            <Icon className="h-4 w-4" aria-hidden /> {label}
          </Link>
        );
      })}
    </nav>
  );
}
