import type { Metadata } from 'next';
import Link from 'next/link';
import { TestsWaitlist } from '@/components/tests/TestsWaitlist';

// Honest landing page for the planned at-home Nutrient Check (owner, 19 Nov). Nothing is for sale yet and the lab
// partner isn't chosen, so the page says so and collects a waitlist. Facts: NIH ODS fact sheets (linked below).
export const metadata: Metadata = {
  title: 'At-Home Iron & Nutrient Test: Ferritin, Vitamin D, B12 | Noovit',
  description: 'An at-home finger-prick test for iron stores (ferritin), vitamin D, B12, magnesium and folate is coming. What each marker shows, its limits, and why test first.',
  alternates: { canonical: '/tests/nutrient-check' },
};

const MARKERS: [string, string, string][] = [
  ['Vitamin D (25-OH)', 'The standard measure of your vitamin D status.', 'Levels change with the seasons, so the time of year matters when you compare results.'],
  ['Ferritin', 'Your body’s iron stores. Low iron is common in women who menstruate.', 'Inflammation and infection can push ferritin up, so a normal result can hide low stores.'],
  ['Vitamin B12', 'Needed for healthy blood and nerves. Worth knowing on a plant-based diet or after 50.', 'Blood B12 is a useful first look; a doctor may add other tests if results are borderline.'],
  ['Magnesium (serum)', 'A quick check for clearly low blood magnesium.', 'Less than 1% of the body’s magnesium is in blood serum, so a normal result doesn’t rule out low stores.'],
  ['Folate', 'Important for healthy cells, and before and during pregnancy.', 'Blood folate reflects recent intake more than long-term status.'],
];

export default function NutrientCheckPage() {
  return (
    <>
      <section className="bg-[var(--studio)]">
        <div className="container px-6 py-14 md:py-20">
          <nav className="mb-4 text-xs text-[var(--color-muted)]">
            <Link href="/">Home</Link> / <span className="text-[var(--color-ink)]">Nutrient Check</span>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-navy)]/70">Coming soon</p>
          <h1 className="mt-3 max-w-2xl text-balance text-4xl text-[var(--color-navy)] md:text-5xl">At-home iron &amp; nutrient test</h1>
          <p className="mt-5 max-w-xl text-lg text-[var(--color-ink)]/80">
            Test first, then supplement. We&apos;re building an at-home finger-prick test for your iron stores (ferritin), vitamin D, B12, magnesium and folate. We&apos;re choosing a US lab partner now. Join the list and we&apos;ll email you when it&apos;s ready.
          </p>
          <TestsWaitlist />
        </div>
      </section>

      <section className="section">
        <div className="container max-w-4xl px-6">
          <h2 className="text-3xl md:text-4xl">What it will measure, and its limits</h2>
          <p className="mt-3 text-[var(--color-ink)]/80">No single blood test tells the whole story. Here is what each marker can and can&apos;t show.</p>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-line)]">
                  <th className="py-3 pr-4 font-semibold">Marker</th>
                  <th className="py-3 pr-4 font-semibold">Why it matters</th>
                  <th className="py-3 font-semibold">Good to know</th>
                </tr>
              </thead>
              <tbody>
                {MARKERS.map(([m, why, limit]) => (
                  <tr key={m} className="border-b border-[var(--color-line)] align-top">
                    <td className="py-3 pr-4 font-semibold text-[var(--color-navy)]">{m}</td>
                    <td className="py-3 pr-4">{why}</td>
                    <td className="py-3 text-[var(--color-ink)]/80">{limit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="mt-14 text-3xl md:text-4xl">Why test before you supplement</h2>
          <ul className="mt-5 list-disc space-y-2 pl-5 text-[var(--color-ink)]/85">
            <li>More isn&apos;t better. Iron and vitamin D can build up and cause harm at high doses.</li>
            <li>A result gives you a starting point, so a retest a few months later shows whether anything changed.</li>
            <li>Tiredness has many causes. A low result is a reason to talk to your doctor, who can look for the cause.</li>
          </ul>
          <p className="mt-6 text-sm text-[var(--color-muted)]">
            The test will be a wellness screen, not a diagnosis. Results outside the normal range should always be discussed with a doctor.
            Sources: NIH Office of Dietary Supplements fact sheets on{' '}
            <a className="underline" href="https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/" target="_blank" rel="noopener noreferrer">magnesium</a>,{' '}
            <a className="underline" href="https://ods.od.nih.gov/factsheets/Iron-HealthProfessional/" target="_blank" rel="noopener noreferrer">iron</a>,{' '}
            <a className="underline" href="https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/" target="_blank" rel="noopener noreferrer">vitamin D</a>,{' '}
            <a className="underline" href="https://ods.od.nih.gov/factsheets/VitaminB12-HealthProfessional/" target="_blank" rel="noopener noreferrer">vitamin B12</a> and{' '}
            <a className="underline" href="https://ods.od.nih.gov/factsheets/Folate-HealthProfessional/" target="_blank" rel="noopener noreferrer">folate</a>.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/guides/magnesium" className="btn btn-outline">Read the magnesium guide</Link>
            <Link href="/women" className="btn btn-outline">Women&apos;s Health</Link>
          </div>
        </div>
      </section>
    </>
  );
}
