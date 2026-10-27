'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function StoreError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return (
    <section className="container px-6 py-24 text-center">
      <h1 className="text-4xl">Something went wrong</h1>
      <p className="mx-auto mt-4 max-w-md text-[var(--color-muted)]">Sorry, this page didn&apos;t load properly. Please try again. Your cart is safe.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button onClick={reset} className="btn btn-primary">Try again</button>
        <Link href="/" className="btn btn-outline">Go to the homepage</Link>
      </div>
    </section>
  );
}
