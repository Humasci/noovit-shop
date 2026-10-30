'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, ShoppingBag, Leaf, Star, FlaskConical, ShieldCheck, BadgeCheck, ChevronDown, PawPrint, User } from 'lucide-react';
import { useCart, cartCount } from '@/lib/store/cart';
import { useHydrated } from '@/lib/useHydrated';
import { Logo } from '@/components/layout/Logo';
import { brandify } from '@/components/brand/Brand';
import { GOAL_PAGES } from '@/lib/goals';

// Top navigation: Shop (with categories), Best Sellers, Journal and the quiz. Pets is a separate button on the right
// (and listed in the mobile menu); About, Reviews, FAQ and Contact live in the footer.
interface NavItem {
  name: string;
  href: string;
  pets?: boolean;
  children?: { name: string; href: string }[];
  goals?: boolean; // dropdown also lists the "Shop by goal" pages
}

const GOAL_LINKS = GOAL_PAGES.map((g) => ({ name: g.name, href: `/goals/${g.slug}` }));

const NAV: NavItem[] = [
  {
    name: 'Shop',
    href: '/shop',
    children: [
      { name: 'Shop all', href: '/shop' },
      { name: 'Supplements', href: '/shop?type=supplements' },
      { name: 'Sports', href: '/shop?type=sports' },
      { name: 'Specialties', href: '/shop?type=specialties' },
    ],
    goals: true,
  },
  { name: 'Best Sellers', href: '/shop?type=best-sellers' },
  { name: 'Journal', href: '/blog' },
  { name: 'Take the quiz', href: '/quiz' },
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
];

const TRUST_ICONS = [Leaf, Star, FlaskConical, ShieldCheck, BadgeCheck];

export function Header({ trustBar, announcement }: { trustBar: string[]; announcement?: { text: string; href: string } }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const onPets = pathname.startsWith('/pets');
  const [menuPath, setMenuPath] = useState(pathname);
  // Close the mobile menu on navigation and on Escape.
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.open);

  const count = useHydrated() ? cartCount(items) : 0;

  return (
    <>
      {announcement?.text && (
        <div className="bg-[var(--color-accent)] px-4 py-2 text-center text-sm font-semibold text-white">
          {announcement.href ? (
            <Link href={announcement.href} className="underline-offset-4 hover:underline">{brandify(announcement.text)} →</Link>
          ) : (
            brandify(announcement.text)
          )}
        </div>
      )}
      {/* Light, quiet trust line (minimal direction): no dark bar above the header. */}
      <div className="border-b border-[var(--color-line)] py-1.5 text-[var(--color-muted)]" role="region" aria-label="Why shop with Noovit">
        <div tabIndex={0} className="no-scrollbar flex justify-start gap-8 overflow-x-auto px-4 text-[11px] font-medium tracking-wide md:justify-center">
          {trustBar.map((label, i) => {
            const Icon = TRUST_ICONS[i % TRUST_ICONS.length];
            return (
              <span key={label} className="flex shrink-0 items-center gap-1.5">
                <Icon className="h-3 w-3 text-[var(--color-accent)]" aria-hidden />
                {brandify(label)}
              </span>
            );
          })}
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[var(--color-canvas)]/95 backdrop-blur">
        <div className="container grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-4 md:px-6">
          <nav aria-label="Main" className="hidden items-center gap-6 whitespace-nowrap font-logo text-[15px] font-medium lg:flex">
            {NAV.filter((n) => !n.pets).map((n) => {
              const tone = n.pets ? 'text-[var(--color-pets)] hover:text-[var(--color-pets-dark)]' : 'hover:text-[var(--color-accent)]';
              if (!n.children) return <Link key={n.href} href={n.href} className={tone}>{n.name}</Link>;
              return (
                // Opens on hover and on keyboard focus (focus-within), no JavaScript needed.
                // Escape closes it (WCAG 1.4.13) by moving focus back to the top-level link.
                <div
                  key={n.href}
                  className="group relative"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') (e.currentTarget.querySelector('a') as HTMLElement | null)?.blur();
                  }}
                >
                  <Link href={n.href} className={`flex items-center gap-1 py-2 ${tone}`}>
                    {n.name} <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
                  </Link>
                  <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div className="flex gap-2 rounded-2xl border border-[var(--color-line)] bg-white p-2 shadow-lg">
                      {[
                        { title: n.goals ? 'Categories' : '', links: n.children },
                        ...(n.goals ? [{ title: 'Shop by goal', links: GOAL_LINKS }] : []),
                      ].map((col) => (
                        <div key={col.title || 'links'} className={col.links.length > 6 ? 'min-w-[25rem]' : 'min-w-44'}>
                          {col.title && <p className="px-3 pb-1 pt-2 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">{col.title}</p>}
                          <ul className={col.links.length > 6 ? 'grid grid-cols-2 gap-x-2 whitespace-nowrap' : ''}>
                            {col.links.map((c) => (
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
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>
          <button
            className="-m-2.5 justify-self-start p-2.5 lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link href="/" className="justify-self-center text-[1.75rem] text-[var(--color-navy)] md:text-[2rem]">
            <Logo />
          </Link>

          <div className="flex items-center justify-self-end gap-5 text-sm font-semibold">
            {/* Noovit Pets sits apart from the human range as its own button; on the Pets pages it leads back to the human shop. */}
            {onPets ? (
              <Link
                href="/shop"
                className="hidden items-center gap-1.5 rounded bg-[var(--color-opal)] px-4 py-1.5 font-logo text-[15px] font-medium text-[var(--color-navy)] transition-colors hover:bg-[var(--color-accent-light)] lg:flex"
              >
                <User className="h-4 w-4" /> Humans
              </Link>
            ) : (
              <Link
                href="/pets"
                className="hidden items-center gap-1.5 rounded bg-[var(--color-pets)] px-4 py-1.5 font-logo text-[15px] font-medium text-[var(--color-navy)] transition-colors hover:brightness-95 lg:flex"
              >
                <PawPrint className="h-4 w-4" /> Pets
              </Link>
            )}
            <Link href="/account" className="hidden font-logo text-[15px] font-medium hover:text-[var(--color-accent)] sm:block">
              My Subscriptions
            </Link>
            <button onClick={openCart} className="relative -m-2 p-2" aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}>
              <ShoppingBag className="h-6 w-6" aria-hidden />
              {count > 0 && (
                <span aria-hidden className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav id="mobile-menu" aria-label="Main" className="animate-slide-in flex flex-col gap-4 border-t border-[var(--color-line)] px-6 py-5 font-logo text-lg font-medium lg:hidden">
            {NAV.map((n) => (
              <div key={n.href}>
                <Link href={n.href} onClick={() => setMenuOpen(false)} className={n.pets ? 'text-[var(--color-pets)]' : ''}>
                  {n.name}
                </Link>
                {n.children && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {n.children.slice(1).map((c) => (
                      <Link key={c.href} href={c.href} onClick={() => setMenuOpen(false)} className="rounded bg-[var(--color-soft)] px-3 py-1 text-sm font-medium">
                        {c.name}
                      </Link>
                    ))}
                  </div>
                )}
                {n.goals && (
                  <>
                    <p className="mt-4 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">Shop by goal</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {GOAL_LINKS.map((c) => (
                        <Link key={c.href} href={c.href} onClick={() => setMenuOpen(false)} className="rounded bg-[var(--color-soft)] px-3 py-1 text-sm font-medium">
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </>
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
