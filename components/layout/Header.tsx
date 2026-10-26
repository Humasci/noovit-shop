'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingBag, Leaf, Star, FlaskConical, ShieldCheck, BadgeCheck } from 'lucide-react';
import { useCart, cartCount } from '@/lib/store/cart';
import { TRUST_BAR } from '@/data/content';

const NAV = [
  { name: 'Shop', href: '/shop' },
  { name: 'Pets', href: '/pets' },
  { name: 'About Us', href: '/about' },
  { name: 'Reviews', href: '/reviews' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact Us', href: '/contact' },
];

const TRUST_ICONS = [Leaf, Star, FlaskConical, ShieldCheck, BadgeCheck];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.open);

  useEffect(() => setMounted(true), []);
  const count = mounted ? cartCount(items) : 0;

  return (
    <>
      <div className="bg-[var(--color-navy)] py-2 text-white">
        <div className="no-scrollbar flex justify-start gap-8 overflow-x-auto px-4 text-xs font-medium md:justify-center">
          {TRUST_BAR.map((label, i) => {
            const Icon = TRUST_ICONS[i];
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
        <div className="container grid grid-cols-3 items-center px-4 py-4 md:px-6">
          <nav className="hidden gap-6 text-sm font-semibold lg:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={n.href === '/pets' ? 'text-[var(--color-pets)] hover:text-[var(--color-pets-dark)]' : 'hover:text-[var(--color-blue)]'}
              >
                {n.name}
              </Link>
            ))}
          </nav>
          <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link href="/" className="justify-self-center text-2xl font-extrabold tracking-tight text-[var(--color-navy)]">
            noovit<span className="text-[var(--color-blue)]">.</span>
          </Link>

          <div className="flex items-center justify-self-end gap-5 text-sm font-semibold">
            <Link href="/account" className="hidden hover:text-[var(--color-blue)] sm:block">
              My Subscriptions
            </Link>
            <button onClick={openCart} className="relative" aria-label="Open cart">
              <ShoppingBag className="h-6 w-6" />
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-blue)] text-[10px] font-bold text-white">
                {count}
              </span>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="animate-slide-in flex flex-col gap-4 border-t border-[var(--color-line)] px-6 py-5 font-semibold lg:hidden">
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
