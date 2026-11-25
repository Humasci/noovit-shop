'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, RefreshCw, FlaskConical, UserRound, Settings } from 'lucide-react';

const LINKS = [
  { href: '/account', label: 'Overview', short: 'Home', icon: LayoutDashboard },
  { href: '/account/orders', label: 'Orders', short: 'Orders', icon: Package },
  { href: '/account/subscriptions', label: 'Subscriptions', short: 'Subscriptions', icon: RefreshCw },
  { href: '/account/tests', label: 'At-home tests', short: 'Tests', icon: FlaskConical },
  { href: '/account/profile', label: 'Profile & address', short: 'Profile', icon: UserRound },
  { href: '/account/settings', label: 'Emails & privacy', short: 'Settings', icon: Settings },
];
const isActive = (pathname: string, href: string) => (href === '/account' ? pathname === href : pathname.startsWith(href));

// Desktop: the side menu.
export function AccountNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Account" className="grid gap-1">
      {LINKS.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${active ? 'bg-[var(--color-navy)] text-white' : 'text-[var(--color-navy)] hover:bg-[var(--color-soft)]'}`}
          >
            <Icon className="h-4 w-4" aria-hidden /> {label}
          </Link>
        );
      })}
    </nav>
  );
}

// Phones and tablets: a bar fixed to the bottom of the screen, app style. Five tabs; "Emails & privacy" is reached
// from the Profile tab (which stays lit there), so the labels stay readable.
export function AccountBottomNav() {
  const pathname = usePathname();
  const tabs = LINKS.filter((l) => l.href !== '/account/settings');
  return (
    <nav aria-label="Account" data-testid="account-bottom-nav" className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-line)] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <ul className="mx-auto grid max-w-xl grid-cols-5">
        {tabs.map(({ href, short, icon: Icon }) => {
          const active = isActive(pathname, href) || (href === '/account/profile' && pathname.startsWith('/account/settings'));
          return (
            <li key={href}>
              <Link href={href} aria-current={active ? 'page' : undefined} className={`flex min-h-[58px] flex-col items-center justify-center gap-1 px-0.5 text-[10.5px] font-semibold leading-none ${active ? 'text-[var(--color-navy)]' : 'text-[var(--color-muted)]'}`}>
                <span className={`flex h-7 w-12 items-center justify-center rounded-full transition ${active ? 'bg-[var(--color-navy)] text-white' : ''}`}><Icon className="h-[18px] w-[18px]" aria-hidden /></span>
                {short}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
