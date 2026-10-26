'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingBag, Leaf, Star, FlaskConical, ShieldCheck, BadgeCheck } from 'lucide-react';
import { useCart, cartCount } from '@/lib/store/cart';
import { useHydrated } from '@/lib/useHydrated';
import { Logo } from '@/components/layout/Logo';

const NAV = [
  { name: 'Shop', href: '/shop' },
  { name: 'Pets', href: '/pets' },
  { name: 'About Us', href: '/about' },
  { name: 'Reviews', href: '/reviews' },
  { name: 'Journal', href: '/blog' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact Us', href: '/contact' },
];

const TRUST_ICONS = [Leaf, Star, FlaskConical, ShieldCheck, BadgeCheck];

export function Header({ trustBar, announcement }: { trustBar: string[]; announcement?: { text: string; href: string } }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.open);

  const count = useHydrated() ? cartCount(items) : 0;

  return (
    <>
      {announcement?.text && (
        <div className="bg-[var(--color-accent)] px-4 py-2 text-center text-sm font-semibold text-white">
          {announcement.href ? (
            <Link href={announcement.href} className="underline-offset-4 hover:underline">{announcement.text} →</Link>
          ) : (
            announcement.text
          )}
        </div>
      )}
      <div className="bg-[var(--color-navy)] py-2 text-white">
        <div className="no-scrollbar flex justify-start gap-8 overflow-x-auto px-4 text-xs font-medium md:justify-center">
          {trustBar.map((label, i) => {
            const Icon = TRUST_ICONS[i % TRUST_ICONS.length];
            return (
              <span key={label} className="flex shrink-0 items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" />
                {label}
              </span>
            );
          })}
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-white/95 backdrop-blur">
        <div className="container grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-4 md:px-6">
          <nav className="hidden gap-5 whitespace-nowrap text-sm font-semibold xl:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={n.href === '/pets' ? 'text-[var(--color-pets)] hover:text-[var(--color-pets-dark)]' : 'hover:text-[var(--color-accent)]'}
              >
                {n.name}
              </Link>
            ))}
          </nav>
          <button className="justify-self-start xl:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link href="/" className="justify-self-center text-[1.65rem] text-[var(--color-navy)]">
            <Logo />
          </Link>

          <div className="flex items-center justify-self-end gap-5 text-sm font-semibold">
            <Link href="/account" className="hidden hover:text-[var(--color-accent)] sm:block">
              My Subscriptions
            </Link>
            <button onClick={openCart} className="relative" aria-label="Open cart">
              <ShoppingBag className="h-6 w-6" />
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] font-bold text-white">
                {count}
              </span>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="animate-slide-in flex flex-col gap-4 border-t border-[var(--color-line)] px-6 py-5 font-semibold xl:hidden">
            {[...NAV, { name: 'My Subscriptions', href: '/account' }].map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setMenuOpen(false)}>
                {n.name}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
