'use client';

// Last-resort fallback when the root layout itself fails; it has to render its own <html>.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-US">
      <body style={{ fontFamily: 'system-ui, sans-serif', textAlign: 'center', padding: '96px 24px', color: '#14213d' }}>
        <h1>Something went wrong</h1>
        <p>Sorry, the page didn&apos;t load. Please try again in a moment.</p>
        <button onClick={reset} style={{ marginTop: 24, padding: '12px 28px', borderRadius: 999, border: 0, background: '#14213d', color: '#fff', fontWeight: 600 }}>
          Try again
        </button>
      </body>
    </html>
  );
}
