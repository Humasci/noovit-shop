import Link from 'next/link';
import type { Metadata } from 'next';

// Outside the store layout (unknown top-level URLs): a minimal page that still leads back to the shop.
export const metadata: Metadata = { title: 'Page not found — Noovit', robots: { index: false } };

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-logo text-3xl text-[var(--color-navy)]">noovit</p>
      <h1 className="mt-6 text-3xl">We couldn&apos;t find that page</h1>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="btn btn-primary">Shop all</Link>
        <Link href="/" className="btn btn-outline">Homepage</Link>
      </div>
    </main>
  );
}
