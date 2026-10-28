'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft, Check } from 'lucide-react';
import { Product } from '@/types';
import { packOptions, asLowAs } from '@/data/products';
import { useCart } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils/format';
import { labelSubtitle } from '@/lib/labels/svg';
import { DIETS, GOALS, SYMPTOMS, QuizAnswers, recommend } from '@/lib/quiz';
import { ProductImage } from '@/components/product/ProductImage';
import { MosaicLoader } from '@/components/brand/MosaicLoader';

type Step = 'intro' | 'sex' | 'age' | 'goals' | 'symptoms' | 'activity' | 'diet' | 'pregnant' | 'medication' | 'email' | 'calculating' | 'results';

const MAX_GOALS = 3;

function Option({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex items-center justify-between gap-3 rounded-2xl border-2 px-5 py-4 text-left font-semibold transition-colors ${
        selected ? 'border-[var(--color-accent-dark)] bg-[var(--color-accent-dark)] text-white' : 'border-[var(--color-line)] bg-white hover:border-[var(--color-opal)]'
      }`}
    >
      {children}
      {selected && <Check className="h-4 w-4 shrink-0" />}
    </button>
  );
}

export function Quiz({ products, code }: { products: Product[]; code: string }) {
  const [step, setStep] = useState<Step>('intro');
  // Each new question moves focus to its heading, so screen readers announce it.
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstStep = useRef(true);
  useEffect(() => {
    if (firstStep.current) {
      firstStep.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);
  const [history, setHistory] = useState<Step[]>([]);
  const [a, setA] = useState<QuizAnswers>({ goals: [], symptoms: [], diet: [] });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false); // marketing consent is opt-in, never pre-ticked
  const [joined, setJoined] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.open);

  const female = a.sex !== 'male';
  const flow: Step[] = ['sex', 'age', 'goals', 'symptoms', 'activity', 'diet', ...(female ? (['pregnant'] as Step[]) : []), 'medication', 'email'];
  const index = flow.indexOf(step);
  const recs = useMemo(() => recommend(products, a), [products, a]);

  const go = (next: Step) => {
    setHistory((h) => [...h, step]);
    setStep(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const next = () => go(flow[index + 1] ?? 'calculating');
  const back = () => {
    const prev = history.at(-1);
    if (!prev) return;
    setHistory((h) => h.slice(0, -1));
    setStep(prev);
  };
  const toggle = (key: 'goals' | 'symptoms' | 'diet', id: string, max = 99) =>
    setA((s) => {
      const has = s[key].includes(id);
      if (!has && s[key].length >= max) {
        toast(`Pick up to ${max}.`);
        return s;
      }
      return { ...s, [key]: has ? s[key].filter((x) => x !== id) : [...s[key], id] };
    });
  const single = <K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) => {
    setA((s) => ({ ...s, [key]: value }));
    setTimeout(next, 150);
  };

  const finish = async (withEmail: boolean) => {
    go('calculating');
    if (withEmail && email) {
      try {
        const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, source: 'quiz' }) });
        setJoined(res.ok);
      } catch {
        /* the plan still shows */
      }
    }
    setTimeout(() => setStep('results'), 1800);
  };

  // Adds each recommendation once; clicking again just reopens the cart instead of doubling the plan.
  const [planAdded, setPlanAdded] = useState(false);
  const addPlan = () => {
    const inCart = new Set(useCart.getState().items.filter((i) => i.mode === 'subscribe').map((i) => i.product.slug));
    for (const { product } of recs) {
      if (inCart.has(product.slug)) continue;
      const [sub] = packOptions(product, 'subscribe');
      addItem({ product, mode: 'subscribe', ...sub, frequency: 30 });
    }
    setPlanAdded(true);
    openCart();
  };

  const heading = (t: string, sub?: string) => (
    <div className="mb-8 text-center">
      <h1 ref={headingRef} tabIndex={-1} className="text-balance text-3xl outline-none md:text-4xl">{t}</h1>
      {sub && <p className="mt-3 text-[var(--color-muted)]">{sub}</p>}
    </div>
  );
  const nextBtn = (disabled = false, labelText = 'Continue') => (
    <div className="mt-8 flex justify-center">
      <button onClick={next} disabled={disabled} className="btn btn-primary min-w-48 disabled:opacity-40">{labelText}</button>
    </div>
  );

  if (step === 'intro') {
    return (
      <div className="mx-auto max-w-2xl py-10 text-center">
        <div className="mb-6 flex justify-center"><MosaicLoader size={44} label="noovit" /></div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">2-minute quiz</p>
        <h1 className="mt-3 text-balance text-4xl md:text-5xl">Find your daily plus</h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-[var(--color-muted)]">
          Answer a few questions about your goals and routine, and we&apos;ll suggest the three supplements that fit you best.
        </p>
        {code && <p className="mt-4 text-sm font-semibold text-[var(--color-pets-dark)]">Bonus: get {code.replace(/\D/g, '') || '10'}% off your first order when you finish.</p>}
        <button onClick={() => go('sex')} className="btn btn-primary mt-8 min-w-56">Start the quiz</button>
        <p className="mx-auto mt-6 max-w-md text-xs text-[var(--color-muted)]">
          This quiz gives general wellness suggestions, not medical advice. Always check with your doctor before starting supplements if you take medication, are pregnant or have a medical condition.
        </p>
      </div>
    );
  }

  if (step === 'calculating') {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-5 text-center">
        <MosaicLoader size={60} label="Building your plan" />
        <p className="font-semibold">Building your plan…</p>
      </div>
    );
  }

  if (step === 'results') {
    const total = recs.reduce((sum, r) => sum + packOptions(r.product, 'subscribe')[0].pricePerBottle, 0);
    return (
      <div className="py-6">
        {heading(name ? `${name.split(' ')[0]}, here's your plan` : "Here's your plan", 'Picked from your goals and answers. Take them together as a daily routine.')}
        {a.medication === 'yes' && (
          <p className="mx-auto mb-8 max-w-2xl rounded-2xl bg-amber-50 px-5 py-4 text-sm text-amber-900">
            You mentioned taking medication. Please check these suggestions with your doctor or pharmacist before you start, as some supplements can interact with medicines.
          </p>
        )}
        {recs.length === 0 ? (
          <p className="text-center text-[var(--color-muted)]">We couldn&apos;t find a match with those filters. <Link href="/shop" className="font-semibold underline">Browse the full range</Link>.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {recs.map(({ product, reasons }, i) => {
              const [single] = packOptions(product, 'one-time');
              return (
                <div key={product.slug} className="flex flex-col rounded-3xl border border-[var(--color-line)] bg-white p-4">
                  <Link href={`/products/${product.slug}`} className="relative block overflow-hidden rounded-2xl">
                    <ProductImage product={product} sizes="(min-width: 768px) 30vw, 90vw" className="aspect-square w-full" />
                    {i === 0 && <span className="absolute left-3 top-3 rounded-full bg-[var(--color-navy)] px-3 py-1 text-xs font-bold text-white">Best match</span>}
                  </Link>
                  <h2 className="mt-4 text-xl">{product.name}</h2>
                  <p className="text-sm text-[var(--color-muted)]">{labelSubtitle(product)}</p>
                  {reasons.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {reasons.map((r) => (
                        <li key={r} className="rounded-full bg-[var(--color-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--color-accent-dark)]">For: {r}</li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-3 flex-1 text-sm">{product.shortBenefit}</p>
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        addItem({ product, mode: 'one-time', ...single });
                        toast.success(`${product.name} added`);
                      }}
                      className="rounded border-[1.5px] border-[var(--color-navy)] px-4 py-1.5 text-sm font-bold text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-white"
                    >
                      Add one bottle
                    </button>
                    <span className="text-sm text-[var(--color-muted)]">as low as <b className="text-[var(--color-navy)]">{formatPrice(asLowAs(product))}</b></span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {recs.length > 0 && (
          <div className="mx-auto mt-10 max-w-xl rounded-3xl bg-[var(--color-navy)] p-8 text-center text-white">
            <h2 className="text-2xl text-white">Start your plan</h2>
            <p className="mt-2 text-white/75">All {recs.length} on subscription, delivered every 30 days — {formatPrice(total)} a month. Change or cancel anytime.</p>
            <button onClick={addPlan} className="btn mt-5 bg-white text-[var(--color-navy)] hover:bg-[var(--color-accent-light)]">
              {planAdded ? '✓ In your cart — view cart' : 'Add my plan to cart'}
            </button>
            {code && (joined ? (
              <p className="mt-4 text-sm text-white/85">Your {code} code is on its way to your inbox — or use <b className="text-white">{code}</b> at checkout.</p>
            ) : (
              <p className="mt-4 text-sm text-white/85">Use <b className="text-white">{code}</b> at checkout for money off your first order.</p>
            ))}
          </div>
        )}
        <div className="mt-8 flex justify-center gap-4 text-sm font-semibold">
          <button onClick={() => { setA({ goals: [], symptoms: [], diet: [] }); setHistory([]); setStep('sex'); }} className="underline">Retake the quiz</button>
          <Link href="/shop" className="underline">Browse everything</Link>
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-[var(--color-muted)]">
          These suggestions are general wellness information based on your answers, not medical advice, and are not intended to diagnose, treat, cure, or prevent any disease.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-6">
      {/* Progress: one tile per question, filled in orange as you go */}
      <div className="mb-8 flex items-center gap-3">
        <button onClick={back} aria-label="Back" className="rounded p-2 hover:bg-[var(--color-soft)]"><ArrowLeft className="h-5 w-5" /></button>
        <div className="flex flex-1 gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={flow.length} aria-valuenow={index + 1} aria-label={`Question ${index + 1} of ${flow.length}`}>
          {flow.map((s, i) => (
            <span key={s} className={`h-2.5 flex-1 rounded-[3px] transition-colors duration-500 ${i <= index ? 'bg-[var(--color-orange)]' : 'bg-[var(--color-line)]'}`} style={{ opacity: i <= index ? 0.45 + (0.55 * (i + 1)) / flow.length : 1 }} />
          ))}
        </div>
        <span className="w-12 text-right text-xs font-semibold text-[var(--color-muted)]">{index + 1}/{flow.length}</span>
      </div>

      {step === 'sex' && (
        <>
          {heading('What is your sex?', 'Some nutrient needs differ between bodies.')}
          <div className="grid gap-3 sm:grid-cols-3">
            {([['female', 'Female'], ['male', 'Male'], ['other', 'Prefer not to say']] as const).map(([v, l]) => (
              <Option key={v} selected={a.sex === v} onClick={() => single('sex', v)}>{l}</Option>
            ))}
          </div>
        </>
      )}

      {step === 'age' && (
        <>
          {heading('How old are you?')}
          <div className="grid gap-3 sm:grid-cols-2">
            {(['18-29', '30-44', '45-59', '60+'] as const).map((v) => (
              <Option key={v} selected={a.age === v} onClick={() => single('age', v)}>{v.replace('-', '–')}</Option>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-[var(--color-muted)]">Noovit products are for adults 18 and over.</p>
        </>
      )}

      {step === 'goals' && (
        <>
          {heading('What would you like to improve?', `Pick up to ${MAX_GOALS}.`)}
          <div className="grid gap-3 sm:grid-cols-2">
            {GOALS.filter((g) => !g.female || female).map((g) => (
              <Option key={g.id} selected={a.goals.includes(g.id)} onClick={() => toggle('goals', g.id, MAX_GOALS)}>{g.label}</Option>
            ))}
          </div>
          {nextBtn(a.goals.length === 0)}
        </>
      )}

      {step === 'symptoms' && (
        <>
          {heading('Anything you notice day to day?', 'Choose all that apply, or none.')}
          <div className="grid gap-3 sm:grid-cols-2">
            {SYMPTOMS.filter((s) => !s.female || female).map((s) => (
              <Option key={s.id} selected={a.symptoms.includes(s.id)} onClick={() => toggle('symptoms', s.id)}>{s.label}</Option>
            ))}
          </div>
          {nextBtn(false, a.symptoms.length ? 'Continue' : 'None of these')}
        </>
      )}

      {step === 'activity' && (
        <>
          {heading('How active are you?')}
          <div className="grid gap-3">
            {([['low', 'Mostly sitting', 'Desk days, little exercise'], ['moderate', 'Moderately active', 'Walks or workouts a few times a week'], ['high', 'Very active', 'Training hard 4+ times a week']] as const).map(([v, l, d]) => (
              <Option key={v} selected={a.activity === v} onClick={() => single('activity', v)}>
                <span>{l}<span className="block text-sm font-normal opacity-75">{d}</span></span>
              </Option>
            ))}
          </div>
        </>
      )}

      {step === 'diet' && (
        <>
          {heading('Any dietary preferences?', 'We will only suggest products that fit.')}
          <div className="grid gap-3 sm:grid-cols-3">
            {DIETS.map((d) => (
              <Option key={d.id} selected={a.diet.includes(d.id)} onClick={() => toggle('diet', d.id)}>{d.label}</Option>
            ))}
          </div>
          {nextBtn(false, a.diet.length ? 'Continue' : 'No preference')}
        </>
      )}

      {step === 'pregnant' && (
        <>
          {heading('Are you pregnant or breastfeeding?', 'We’ll narrow our suggestions. Please check with your doctor or midwife before taking any supplement.')}
          <div className="grid gap-3 sm:grid-cols-3">
            {([['pregnant', 'Pregnant'], ['breastfeeding', 'Breastfeeding'], ['no', 'Neither']] as const).map(([v, l]) => (
              <Option key={v} selected={a.pregnant === v} onClick={() => single('pregnant', v)}>{l}</Option>
            ))}
          </div>
        </>
      )}

      {step === 'medication' && (
        <>
          {heading('Do you take any prescription medication?', 'So we can remind you to check with your doctor.')}
          <div className="grid gap-3 sm:grid-cols-2">
            {([['yes', 'Yes'], ['no', 'No']] as const).map(([v, l]) => (
              <Option key={v} selected={a.medication === v} onClick={() => single('medication', v)}>{l}</Option>
            ))}
          </div>
        </>
      )}

      {step === 'email' && (
        <>
          {heading('Almost there!', code ? `Join the list to get your ${code} code by email, plus tips and member offers.` : 'Join the list for tips and member offers.')}
          <form
            className="mx-auto grid max-w-md gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              finish(consent);
            }}
          >
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="First name" aria-label="First name" autoComplete="given-name" className="rounded border border-[var(--color-line)] bg-white px-5 py-3" />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" aria-label="Email address" autoComplete="email" className="rounded border border-[var(--color-line)] bg-white px-5 py-3" />
            <label className="flex items-start gap-2 text-xs text-[var(--color-muted)]">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
              Email me my welcome code, tips and offers from Noovit. Unsubscribe anytime.
            </label>
            <button disabled={!consent} className="btn btn-primary mt-2 disabled:opacity-40">See my plan</button>
          </form>
          <div className="mt-4 text-center">
            <button onClick={() => finish(false)} className="text-sm font-semibold text-[var(--color-muted)] underline">Skip and see my plan</button>
          </div>
        </>
      )}
    </div>
  );
}
