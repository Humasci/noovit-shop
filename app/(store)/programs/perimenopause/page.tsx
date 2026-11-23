import Link from 'next/link';
import type { Metadata } from 'next';
import { ChevronDown } from 'lucide-react';
import { PROGRAM, WEEKS, FACTS, FAQS, REFERENCES } from '@/lib/programs/perimenopause';
import { HormoneWaves } from '@/components/programs/HormoneWaves';
import { ProgramSignup } from '@/components/programs/ProgramSignup';
import { MosaicField } from '@/components/brand/MosaicField';
import { JsonLd } from '@/components/seo/JsonLd';
import { pageLd, faqLd } from '@/lib/structured-data';

// "Perimenopause, Decoded" landing page (23 Nov). Public before launch (lib/public-early.ts); no tracking tags (health
// page). Education first: no product names on this page.
export const metadata: Metadata = {
  title: 'Perimenopause, Decoded: Free 6-Week Guide | Noovit',
  description: 'A free, evidence-based 6-week email guide to perimenopause: what’s changing, sleep, hot flashes, strength and bones, mood, and what to ask your doctor.',
  alternates: { canonical: PROGRAM.path },
};

export default function PerimenopauseProgramPage() {
  return (
    <>
      <JsonLd data={[...pageLd({ path: PROGRAM.path, name: PROGRAM.name, description: PROGRAM.tagline, crumbs: [['Women’s Health', '/womens-health'], [PROGRAM.name, PROGRAM.path]] }), faqLd(FAQS)]} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--lilac)]">
        <MosaicField cols={16} rows={10} tile={14} gap={4} anchor="top-right" maxOpacity={0.5} className="pointer-events-none absolute right-0 top-0 hidden md:block" />
        <div className="container relative grid gap-10 px-6 py-14 md:py-20 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <nav className="mb-4 text-xs text-[var(--color-muted)]">
              <Link href="/womens-health">Women’s Health</Link> / <span className="text-[var(--color-ink)]">Free program</span>
            </nav>
            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-navy)]">Free 6-week guide</span>
            <h1 className="mt-4 text-balance text-4xl text-[var(--color-navy)] md:text-5xl">Perimenopause, decoded.</h1>
            <p className="mt-4 max-w-xl text-lg text-[var(--color-ink)]/80">{PROGRAM.tagline} Plain English, every claim sourced.</p>
            <ProgramSignup program={PROGRAM.slug} />
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-[0_20px_40px_-24px_rgba(20,33,61,0.25)] sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">Why it can feel so unpredictable</p>
            <HormoneWaves className="mt-4 text-[var(--color-navy)]" />
          </div>
        </div>
      </section>

      {/* Is this for me */}
      <section className="section">
        <div className="container grid items-center gap-10 px-6 lg:grid-cols-[0.9fr_1.3fr] lg:gap-14">
          <img src="/images/women/menopause.jpg" alt="A smiling woman in her fifties drinking a glass of water at home" width={1067} height={1600} loading="lazy" className="aspect-[4/5] w-full rounded-3xl object-cover" />
          <div>
            <h2 className="text-3xl md:text-4xl">Is this for me?</h2>
            <p className="mt-4 text-[var(--color-ink)]/80">
              Perimenopause is the transition before your periods stop. It usually starts in your mid-to-late 40s. Menopause itself is one moment: 12 months after your last period. If your cycles, sleep, mood or temperature are changing, this guide explains what’s happening and what the evidence says helps.
            </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {FACTS.map((f) => (
              <div key={f.big} className="rounded-3xl bg-[var(--lilac)] p-6">
                <p className="font-display text-3xl text-[var(--color-navy)]">{f.big}</p>
                <p className="mt-2 text-sm text-[var(--color-ink)]/80">{f.text}</p>
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* What you get + weeks */}
      <section className="section bg-[var(--sage)]">
        <div className="container px-6">
          <h2 className="text-3xl md:text-4xl">What you’ll get</h2>
          <p className="mt-3 max-w-2xl text-[var(--color-ink)]/80">A printable starter kit with a 4-week symptom tracker and questions for your doctor, then one short email a week for six weeks. Each ends with one small, doable step.</p>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WEEKS.map((w) => (
              <li key={w.n} className="rounded-3xl border border-[var(--color-line)] bg-white p-6 shadow-[0_1px_2px_rgba(20,33,61,0.04),0_8px_24px_-12px_rgba(20,33,61,0.12)]">
                <span className="rounded-md bg-[var(--color-navy)] px-2 py-0.5 text-[11px] font-semibold tabular-nums text-white">Week {w.n}</span>
                <h3 className="mt-3 text-xl text-[var(--color-navy)]">{w.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-ink)]/80">{w.line}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Why trust it */}
      <section className="section">
        <div className="container grid gap-10 px-6 lg:grid-cols-2">
          <div>
            <img src="/images/women/womens-health-friend-circle.jpg" alt="Four women laughing and dancing in a circle in a summer garden" width={1600} height={1067} loading="lazy" className="mb-8 aspect-[16/9] w-full rounded-3xl object-cover" />
            <h2 className="text-3xl md:text-4xl">Evidence, not hype</h2>
            <p className="mt-4 text-[var(--color-ink)]/80">
              Every claim comes from a source we opened and read: position statements from The Menopause Society, ACOG and NIH guidance, and peer-reviewed trials. We grade the evidence (Moderate, Limited, Early or Insufficient) and include what didn’t work, not only what did.
            </p>
            <p className="mt-4 text-[var(--color-ink)]/80">It’s education, not medical advice. Your doctor is the right person for diagnosis and treatment, and week 6 helps you make that appointment count.</p>
          </div>
          <div className="self-end rounded-3xl bg-[var(--color-navy)] p-8 text-white">
            <h2 className="text-2xl text-white">Start with week 1</h2>
            <p className="mt-2 text-white/75">Your starter kit and the first email arrive by email.</p>
            <ProgramSignup program={PROGRAM.slug} dark />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-[var(--studio)]">
        <div className="container max-w-3xl px-6">
          <h2 className="text-3xl md:text-4xl">Questions</h2>
          <div className="mt-6 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
            {FAQS.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                  <span>{f.q}</span>
                  <ChevronDown aria-hidden className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-[var(--color-ink)]/85">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* References */}
      <section className="section">
        <div className="container max-w-3xl px-6">
          <h2 className="text-2xl">Key sources</h2>
          <ol className="mt-4 space-y-2 text-sm">
            {REFERENCES.map((r, i) => (
              <li key={r.url} className="grid grid-cols-[2rem_1fr] gap-2">
                <span className="tabular-nums text-[var(--color-muted)]">[{i + 1}]</span>
                <span>{r.label}. <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-navy)] underline underline-offset-2">{r.title}</a></span>
              </li>
            ))}
          </ol>
          <p className="mt-8 border-t border-[var(--color-line)] pt-6 text-xs text-[var(--color-muted)]">
            General information, not medical advice. If you have bleeding after 12 months without a period, bleeding between periods or after sex, much heavier periods than usual, or thoughts of self-harm (call or text 988), see a doctor promptly.
          </p>
        </div>
      </section>
    </>
  );
}
