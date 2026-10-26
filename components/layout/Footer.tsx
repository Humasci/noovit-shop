import Link from 'next/link';
import { Instagram, Facebook, Lock } from 'lucide-react';
import { PAYMENT_METHODS } from '@/data/content';

const COLUMNS = [
  {
    title: 'Customer Support',
    links: [
      { name: 'Manage Subscriptions', href: '/account' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Delivery & Returns', href: '/policies/delivery-returns' },
      { name: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Our Products',
    links: [
      { name: 'Shop All', href: '/shop' },
      { name: 'Best Sellers', href: '/shop?type=best-sellers' },
      { name: 'Supplements', href: '/shop?type=supplements' },
      { name: 'Sports', href: '/shop?type=sports' },
    ],
  },
  {
    title: 'Info',
    links: [
      { name: 'Reviews', href: '/reviews' },
      { name: 'About Us', href: '/about' },
      { name: 'Privacy Policy', href: '/policies/privacy' },
      { name: 'Terms & Conditions', href: '/policies/terms' },
    ],
  },
];

function TikTok({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.8 5.8 0 1 0 5 5.7V9.1a7.4 7.4 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.3-1.6z" />
    </svg>
  );
}

export function SocialLinks({ className = '' }: { className?: string }) {
  return (
    <div className={`flex gap-4 ${className}`}>
      <a href="#" aria-label="Instagram"><Instagram className="h-5 w-5" /></a>
      <a href="#" aria-label="TikTok"><TikTok className="h-5 w-5" /></a>
      <a href="#" aria-label="Facebook"><Facebook className="h-5 w-5" /></a>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-[var(--color-navy)] text-white">
      <div className="container grid gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <Link href="/" className="text-3xl font-extrabold">
            noovit<span className="text-[#93c5fd]">.</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-white/70">Clean, science-driven supplements for everyday health.</p>
          <SocialLinks className="mt-5 text-white/80" />
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">{col.title}</h4>
            <ul className="space-y-2 text-sm text-white/70">
              {col.links.map((l) => (
                <li key={l.name}>
                  <Link href={l.href} className="hover:text-white">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-white/60 md:flex-row">
          <p>© {new Date().getFullYear()} Noovit. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="mr-2 flex items-center gap-1"><Lock className="h-3 w-3" /> Secure checkout</span>
            {PAYMENT_METHODS.map((m) => (
              <span key={m} className="rounded border border-white/20 px-2 py-1 text-[10px] font-semibold text-white/80">
                {m}
              </span>
            ))}
          </div>
        </div>
        <p className="container px-6 pb-6 text-[11px] leading-relaxed text-white/40">
          These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose,
          treat, cure, or prevent any disease. Consult your healthcare provider before use if you are pregnant, nursing, taking
          medication, or have a medical condition.
        </p>
      </div>
    </footer>
  );
}
