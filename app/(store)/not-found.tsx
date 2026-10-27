import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Page not found — Noovit', robots: { index: false } };

export default function NotFound() {
  return (
    <section className="container px-6 py-24 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">404</p>
      <h1 className="mt-3 text-4xl md:text-5xl">We couldn&apos;t find that page</h1>
      <p className="mx-auto mt-4 max-w-md text-[var(--color-muted)]">It may have moved, or the link may be mistyped. Here are some good places to start.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="btn btn-primary">Shop all</Link>
        <Link href="/quiz" className="btn btn-outline">Take the quiz</Link>
        <Link href="/contact" className="btn btn-outline">Contact us</Link>
      </div>
    </section>
  );
}
