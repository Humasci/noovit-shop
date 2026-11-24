import Link from 'next/link';
import type { Metadata } from 'next';
import { PROGRAM } from '@/lib/programs/perimenopause';
import { PrintButton } from '@/components/programs/PrintButton';

// Printable starter kit for "Perimenopause, Decoded" (24 Nov), linked from the day-1 email. Four A4/Letter pages; the
// browser's "Save as PDF" makes the PDF. Facts from docs/programs/research (STRAW+10, ACOG, OWH, NAMS); no brand names.
// No tracking tags (every /programs/* page is a sensitive path).
export const metadata: Metadata = {
  title: 'Starter kit: Perimenopause, Decoded | Noovit',
  description: 'A printable 4-page starter kit: the stages in plain words, a 4-week symptom tracker, what helps, and questions for your doctor.',
  alternates: { canonical: `${PROGRAM.path}/starter-kit` },
  robots: { index: false },
};

// Typical ages for the average woman (Santoro: early transition ~47, late ~49, final period ~51); they vary widely.
const STAGES: { name: string; age: string; text: string; peri: boolean }[] = [
  { name: 'Before', age: '', text: 'Regular cycles.', peri: false },
  { name: 'Early transition', age: '~47', text: 'Cycle length starts to vary by 7 days or more, again and again.', peri: true },
  { name: 'Late transition', age: '~49', text: 'Gaps of 60 days or more between periods. Usually lasts 1 to 3 years.', peri: true },
  { name: 'Menopause', age: '~51', text: 'One point in time: 12 months in a row with no period.', peri: true },
  { name: 'After', age: '', text: 'Postmenopause: everything after that point.', peri: false },
];

const TRACK = ['Sleep', 'Hot flashes', 'Mood', 'Energy', 'Bleeding', 'Notes'];

const HELPS: [string, string, string][] = [
  ['CBT for insomnia (CBT-I)', 'Better sleep; 84% vs 43% insomnia-free in one trial of midlife women', 'Moderate'],
  ['CBT or clinical hypnosis', 'Fewer, less bothersome hot flashes', 'Moderate'],
  ['Strength training', 'More muscle and strength', 'Moderate'],
  ['Supervised high-intensity lifting', 'Spine bone density up in one trial', 'Limited'],
  ['Last coffee ~9 hours before bed', 'Caffeine cut sleep by about 45 minutes in a review of 24 studies', 'Moderate'],
  ['Less alcohol in the evening', 'Alcohol breaks up the second half of the night', 'Moderate'],
  ['Layers, a fan, a cool bedroom', 'Comfort steps; not tested as treatment', 'Not tested'],
  ['Herbal remedies (black cohosh, soy, red clover)', 'Mixed results; The Menopause Society does not recommend them for hot flashes', 'Insufficient'],
];

const QUESTIONS = [
  'Is this perimenopause, or could something else explain my symptoms?',
  'Which treatments suit me: hormone therapy, non-hormone prescriptions, CBT or hypnosis?',
  'What are the benefits and risks for me, given my age and health history?',
  'Do I need any tests? (Usually not after 45; more often under 45.)',
  'What should I do for my bones and heart in these years?',
  'Could any of my medicines or supplements be affecting how I feel?',
];

function Sheet({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="kit-page mx-auto mb-8 max-w-[52rem] rounded-3xl border border-[var(--color-line)] bg-white p-8 sm:p-10">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">Perimenopause, Decoded · Starter kit · Page {n} of 4</p>
      <h2 className="mt-2 text-3xl text-[var(--color-navy)]">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function StarterKitPage() {
  return (
    <div className="bg-[var(--lilac)] py-10">
      {/* Print only the kit: everything else on the page (header, footer, widgets) is hidden. */}
      <style>{`@media print {
        body * { visibility: hidden !important; }
        #kit, #kit * { visibility: visible !important; }
        #kit { position: absolute; left: 0; top: 0; width: 100%; }
        .kit-page { break-after: page; border: 0 !important; border-radius: 0 !important; margin: 0 !important; max-width: none !important; }
        .no-print { display: none !important; }
        .kit-row { height: 20px !important; }
        .kit-page { padding: 0 !important; }
        .kit-page th { white-space: nowrap; }
        @page { margin: 14mm; }
      }`}</style>
      <div className="no-print container mb-8 flex max-w-[52rem] flex-wrap items-center justify-between gap-4 px-6">
        <p className="text-sm text-[var(--color-ink)]/80">
          <Link href={PROGRAM.path} className="underline">Perimenopause, Decoded</Link> · Print it, or choose “Save as PDF” in the print window.
        </p>
        <PrintButton />
      </div>

      <div id="kit" className="px-4">
        <Sheet n={1} title="What’s happening">
          <p className="text-[var(--color-ink)]/85">Perimenopause is the transition before your last period. It usually starts in your mid-to-late 40s and lasts about four years on average, up to ten. You can still get pregnant during it.</p>
          <div className="mt-6">
            <div className="mb-2 grid grid-cols-[2.5rem_1fr_6rem] text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              <span />
              <span>Stage</span>
              <span className="text-right">Typical age</span>
            </div>
            {[STAGES.slice(0, 1), STAGES.slice(1, 4), STAGES.slice(4)].map((group, gi) => (
              <div key={gi} className={gi === 1 ? 'relative my-1 rounded-2xl bg-[var(--lilac)] py-1' : ''}>
                {gi === 1 && <span className="absolute -top-2.5 right-3 rounded-full bg-[var(--color-navy)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">Perimenopause</span>}
                {group.map((st) => {
                  const i = STAGES.indexOf(st);
                  return (
                    <div key={st.name} className="grid grid-cols-[2.5rem_1fr_6rem] items-start py-2.5">
                      <span className="relative flex justify-center">
                        {i < STAGES.length - 1 && <span aria-hidden className="absolute left-1/2 top-6 h-[calc(100%+1.25rem)] w-px -translate-x-1/2 bg-[var(--color-navy)]/25" />}
                        <span className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums ${st.peri ? 'bg-[var(--color-navy)] text-white' : 'border border-[var(--color-navy)]/40 bg-white text-[var(--color-navy)]'}`}>{i + 1}</span>
                      </span>
                      <span className="pr-3">
                        <span className="block font-semibold text-[var(--color-navy)]">{st.name}</span>
                        <span className="block text-sm text-[var(--color-ink)]/80">{st.text}</span>
                      </span>
                      <span className="pr-3 text-right text-sm font-semibold tabular-nums text-[var(--color-navy)]">{st.age}</span>
                    </div>
                  );
                })}
              </div>
            ))}
            <p className="mt-2 text-xs text-[var(--color-muted)]">Ages are averages; many women start earlier or later. Perimenopause ends 12 months after the final period.</p>
          </div>
          <h3 className="mt-8 text-xl">Hormones swing, they don’t fall in a straight line</h3>
          <p className="mt-2 text-[var(--color-ink)]/85">Estrogen can be low one month and high the next. Progesterone drops because ovulation becomes less regular. That is why one blood test often doesn’t tell the whole story, and why your own record of symptoms is so useful.</p>
          <p className="mt-4 text-sm text-[var(--color-muted)]">Stage definitions: STRAW+10 (Harlow et al., 2012). Timing: Santoro (2016); HHS Office on Women’s Health; ACOG.</p>
        </Sheet>

        <Sheet n={2} title="4-week tracker">
          <p className="text-sm text-[var(--color-ink)]/80">One line a day. Rate sleep, mood and energy from 1 (bad) to 5 (great). Note hot flashes or night sweats (how many) and any bleeding.</p>
          {[1, 2, 3, 4].map((w) => (
            <table key={w} className="mt-3 w-full table-fixed border-collapse text-xs">
              <caption className="mb-0.5 text-left text-xs font-semibold text-[var(--color-navy)]">Week {w}</caption>
              <thead>
                <tr>
                  <th className="w-12 border border-[var(--color-line)] px-1 py-0.5 text-left font-semibold">Day</th>
                  {TRACK.map((t) => <th key={t} className={`border border-[var(--color-line)] px-1 py-0.5 text-left font-semibold ${t === 'Notes' ? 'w-1/3' : ''}`}>{t}</th>)}
                </tr>
              </thead>
              <tbody>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                  <tr key={d}>
                    <td className="kit-row h-6 border border-[var(--color-line)] px-1">{d}</td>
                    {TRACK.map((t) => <td key={t} className="border border-[var(--color-line)]" />)}
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </Sheet>

        <Sheet n={3} title="What helps, and how good the evidence is">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left">
                <th className="border-b border-[var(--color-line)] py-2 pr-3 font-semibold">Option</th>
                <th className="border-b border-[var(--color-line)] py-2 pr-3 font-semibold">What the research found</th>
                <th className="border-b border-[var(--color-line)] py-2 font-semibold">Evidence</th>
              </tr>
            </thead>
            <tbody>
              {HELPS.map(([o, f, g]) => (
                <tr key={o} className="align-top">
                  <td className="border-b border-[var(--color-line)] py-2 pr-3 font-semibold text-[var(--color-navy)]">{o}</td>
                  <td className="border-b border-[var(--color-line)] py-2 pr-3 text-[var(--color-ink)]/85">{f}</td>
                  <td className="border-b border-[var(--color-line)] py-2 whitespace-nowrap">{g}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-sm text-[var(--color-ink)]/85"><b>Treatments your doctor can offer:</b> hormone therapy (the most effective option for hot flashes; for most healthy women under 60 or within 10 years of menopause, the benefits outweigh the risks), FDA-approved non-hormone prescriptions, and referral for CBT or hypnosis.</p>
          <p className="mt-3 text-xs text-[var(--color-muted)]">Grades: Moderate = consistent trials; Limited = one or few trials; Insufficient = not enough good evidence. Sources: The Menopause Society 2022 and 2023 position statements; McCurry 2016; Watson 2018 (LIFTMOR); caffeine and alcohol reviews. Full list on the program page.</p>
        </Sheet>

        <Sheet n={4} title="Talk to your doctor">
          <h3 className="text-xl">Questions to ask</h3>
          <ul className="mt-3 space-y-2">
            {QUESTIONS.map((q) => (
              <li key={q} className="flex gap-3"><span className="mt-1 h-4 w-4 shrink-0 rounded border border-[var(--color-navy)]" aria-hidden /> {q}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-[var(--color-ink)]/85">Bring this tracker, and a list of every medicine and supplement you take.</p>
          <div className="mt-8 rounded-2xl border-2 border-[#C4458F] p-5">
            <h3 className="text-xl text-[#9b2b46]">See a doctor sooner if you have</h3>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-[var(--color-ink)]/90">
              <li>Any bleeding after 12 months without a period.</li>
              <li>Bleeding or spotting between periods or after sex.</li>
              <li>Periods much heavier, or lasting longer, than usual.</li>
              <li>Periods stopping before age 40.</li>
              <li>Low mood most days for two weeks or more. <b>If you have thoughts of harming yourself, call or text 988</b> (Suicide &amp; Crisis Lifeline).</li>
            </ul>
          </div>
          <p className="mt-6 text-xs text-[var(--color-muted)]">Education, not medical advice. Sources: ACOG; HHS Office on Women’s Health; NICE NG23. noovit.com{PROGRAM.path}</p>
        </Sheet>
      </div>
    </div>
  );
}
