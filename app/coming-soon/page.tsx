import type { Metadata } from 'next';
import { Logo } from '@/components/layout/Logo';
import { WaitlistForm } from './WaitlistForm';
import { Analytics } from '@/components/analytics/Analytics';
import { getSettings } from '@/lib/settings';
import { LEGAL_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Noovit — coming soon',
  description: 'Evidence-graded supplements. Join the list to hear when we launch.',
  robots: { index: false, follow: false },
};

// Shown to the public while pre-launch mode is on (lib/launch.ts).
export default async function ComingSoon() {
  const settings = await getSettings();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-canvas)] px-6 py-16 text-center">
      <p className="text-5xl text-[var(--color-navy)] md:text-6xl">
        <Logo />
      </p>
      <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">Coming soon</p>
      <h1 className="mt-3 max-w-xl text-balance text-3xl md:text-4xl">Evidence-graded supplements, with nothing to hide.</h1>
      <p className="mt-4 max-w-md text-[var(--color-muted)]">
        Studied doses, honest labels and clear evidence for every ingredient. Join the list and we&rsquo;ll email you the day we open.
      </p>
      <WaitlistForm />
      <p className="mt-16 text-xs text-[var(--color-muted)]">© {new Date().getFullYear()} {LEGAL_NAME}</p>
      {/* Tag Manager here too, so waitlist traffic is measured before launch. */}
      <Analytics ids={{ gtm: settings.gtm_id, ga4: settings.ga4_id, meta: settings.meta_pixel_id, tiktok: settings.tiktok_pixel_id }} />
    </main>
  );
}
