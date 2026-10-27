'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingBag, Leaf, Star, FlaskConical, ShieldCheck, BadgeCheck, ChevronDown } from 'lucide-react';
import { useCart, cartCount } from '@/lib/store/cart';
import { useHydrated } from '@/lib/useHydrated';
import { Logo } from '@/components/layout/Logo';

// Top navigation: Shop and Pets open a dropdown of subcategories; About, Reviews, FAQ and Contact live in the footer.
interface NavItem {
  name: string;
  href: string;
  pets?: boolean;
  children?: { name: string; href: string }[];
}

const NAV: NavItem[] = [
  {
    name: 'Shop',
    href: '/shop',
    children: [
      { name: 'Shop all', href: '/shop' },
      { name: 'Best Sellers', href: '/shop?type=best-sellers' },
      { name: 'Supplements', href: '/shop?type=supplements' },
      { name: 'Sports', href: '/shop?type=sports' },
      { name: 'Specialties', href: '/shop?type=specialties' },
    ],
  },
  {
    name: 'Pets',
    href: '/pets',
    pets: true,
    children: [
      { name: 'All pets', href: '/pets' },
      { name: 'Dogs', href: '/pets?species=dog#pet-products' },
      { name: 'Cats', href: '/pets?species=cat#pet-products' },
    ],
  },
  { name: 'Journal', href: '/blog' },
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
          <nav className="hidden items-center gap-7 whitespace-nowrap text-sm font-semibold lg:flex">
            {NAV.map((n) => {
              const tone = n.pets ? 'text-[var(--color-pets)] hover:text-[var(--color-pets-dark)]' : 'hover:text-[var(--color-accent)]';
              if (!n.children) return <Link key={n.href} href={n.href} className={tone}>{n.name}</Link>;
              return (
                // Opens on hover and on keyboard focus (focus-within), no JavaScript needed.
                <div key={n.href} className="group relative">
                  <Link href={n.href} className={`flex items-center gap-1 py-2 ${tone}`} aria-haspopup="true">
                    {n.name} <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
                  </Link>
                  <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <ul className="min-w-48 rounded-2xl border border-[var(--color-line)] bg-white p-2 shadow-lg">
                      {n.children.map((c) => (
                        <li key={c.href}>
                          <Link
                            href={c.href}
                            onClick={(e) => e.currentTarget.blur()} // close the focus-opened menu after choosing
                            className={`block rounded-lg px-3 py-2 hover:bg-[var(--color-soft)] ${n.pets ? 'hover:text-[var(--color-pets-dark)]' : 'hover:text-[var(--color-accent)]'}`}>
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </nav>
          <button className="justify-self-start lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link href="/" className="justify-self-center text-[1.75rem] text-[var(--color-navy)] md:text-[2rem]">
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
          <nav className="animate-slide-in flex flex-col gap-4 border-t border-[var(--color-line)] px-6 py-5 font-semibold lg:hidden">
            {NAV.map((n) => (
              <div key={n.href}>
                <Link href={n.href} onClick={() => setMenuOpen(false)} className={n.pets ? 'text-[var(--color-pets)]' : ''}>
                  {n.name}
                </Link>
                {n.children && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {n.children.slice(1).map((c) => (
                      <Link key={c.href} href={c.href} onClick={() => setMenuOpen(false)} className="rounded-full bg-[var(--color-soft)] px-3 py-1 text-sm font-medium">
                        {c.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link href="/account" onClick={() => setMenuOpen(false)}>My Subscriptions</Link>
          </nav>
        )}
      </header>
    </>
  );
}
