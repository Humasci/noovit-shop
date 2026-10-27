'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { Award, FlaskConical, GraduationCap, MapPin, ShieldCheck, ChevronDown, BadgeCheck, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { FAQ, Review } from '@/types';
import { IMAGES, SUBSCRIPTION_PERKS } from '@/data/content';
import { Stars } from '@/components/ui/Stars';
import { SocialLinks } from '@/components/layout/Footer';
import { brandify } from '@/components/brand/Brand';

export function SectionHeading({ eyebrow, title, sub, center = true }: { eyebrow?: string; title: string; sub?: string; center?: boolean }) {
  return (
    <div className={`mb-10 ${center ? 'mx-auto max-w-2xl text-center' : ''}`}>
      {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">{brandify(eyebrow)}</p>}
      <h2 className="text-balance text-3xl md:text-4xl">{brandify(title)}</h2>
      {sub && <p className="mt-3 text-[var(--color-muted)]">{brandify(sub)}</p>}
    </div>
  );
}

export const TRUST_ITEMS = [
  { icon: Award, label: 'GMP Certified' },
  { icon: FlaskConical, label: 'Third Party Tested' },
  { icon: GraduationCap, label: 'Evidence-Based Doses' },
  { icon: MapPin, label: 'Made in the USA' },
  { icon: ShieldCheck, label: '90-Day Money-Back Guarantee' },
];

export function TrustSection() {
  return (
    <section className="section bg-[var(--color-soft)]">
      <div className="container px-6">
        <SectionHeading
          eyebrow="Why Noovit"
          title="Quality you can check, not just trust"
          sub="Made in certified facilities and tested by independent labs, with forms and doses chosen from published research."
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {TRUST_ITEMS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center rounded-2xl bg-white p-6 text-center">
              <Icon className="mb-3 h-9 w-9 text-[var(--color-accent)]" strokeWidth={1.5} />
              <p className="text-sm font-bold text-[var(--color-navy)]">{label}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/shop" className="btn btn-primary">Shop All</Link>
        </div>
      </div>
    </section>
  );
}

// Real, approved reviews only (see lib/reviews.ts); renders nothing until there are some.
export function ReviewsSection({ title = 'What customers say', reviews }: { title?: string; reviews: Review[] }) {
  if (!reviews.length) return null;
  return (
    <section className="section">
      <div className="container px-6">
        <SectionHeading eyebrow="Reviews" title={title} />
        <div className="no-scrollbar -mx-6 flex snap-x gap-5 overflow-x-auto px-6 pb-2">
          {reviews.map((r) => {
            return (
              <article key={r.id} className="w-80 shrink-0 snap-start rounded-2xl border border-[var(--color-line)] p-6">
                <Stars rating={r.rating} />
                <h3 className="mt-3 text-base">{brandify(r.title)}</h3>
                <p className="mt-2 text-sm text-[var(--color-muted)]">{brandify(r.body)}</p>
                <div className="mt-5 flex items-center justify-between text-sm">
                  <span>
                    <span className="font-bold">{r.name}</span>
                    {r.verified && (
                      <span className="ml-2 inline-flex items-center gap-1 text-xs text-[var(--color-green)]">
                        <BadgeCheck className="h-3.5 w-3.5" /> Verified Buyer
                      </span>
                    )}
                  </span>
                  <Link href={`/products/${r.productSlug}`} className="text-xs font-bold text-[var(--color-accent)]">
                    View Product
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="btn btn-primary">Shop All</Link>
          <Link href="/reviews#write" className="btn btn-outline">Leave a Review</Link>
        </div>
      </div>
    </section>
  );
}

export function FAQSection({ faqs, title = 'Frequently asked questions', showButtons = true }: { faqs: FAQ[]; title?: string; showButtons?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  return (
    <section className="section">
      <div className="container max-w-3xl px-6">
        <SectionHeading eyebrow="FAQ" title={title} />
        <div className="divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
          {faqs.map((f, i) => (
            <div key={f.q}>
              <button
                className="flex w-full items-center justify-between gap-4 py-5 text-left font-bold"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                aria-controls={`${id}-${i}`}
              >
                <span>{brandify(f.q)}</span>
                <ChevronDown aria-hidden className={`h-5 w-5 shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              <p id={`${id}-${i}`} hidden={open !== i} className="animate-slide-in pb-5 text-[var(--color-muted)]">{brandify(f.a)}</p>
            </div>
          ))}
        </div>
        {showButtons && (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn btn-primary">Contact Us</Link>
            <Link href="/faq" className="btn btn-outline">Product FAQs</Link>
          </div>
        )}
      </div>
    </section>
  );
}

export function CommunitySection({
  images = IMAGES.community,
  handle = '@noovit',
  title = 'Join the Noovit community',
}: {
  images?: string[];
  handle?: string;
  title?: string;
}) {
  return (
    <section className="section bg-[var(--color-soft)]">
      <div className="container px-6">
        <SectionHeading eyebrow={handle} title={title} sub="Tag us to be featured." />
        <div className="no-scrollbar -mx-6 flex snap-x gap-4 overflow-x-auto px-6">
          {images.map((src, i) => (
            <div key={i} className="aspect-[2/3] w-56 shrink-0 snap-start overflow-hidden rounded-2xl md:w-auto md:flex-1">
              <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
        <SocialLinks className="mt-8 justify-center text-[var(--color-navy)]" />
      </div>
    </section>
  );
}

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  return (
    <section className="section">
      <div className="container px-6">
        <div className="grid overflow-hidden rounded-3xl bg-[var(--color-navy)] text-white md:grid-cols-2">
          <div className="p-10 md:p-14">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent-light)]">Newsletter</p>
            <h2 className="text-3xl text-white md:text-4xl">10% off your first order</h2>
            <p className="mt-3 text-white/70">Sign up for nutrition tips, early access to launches, and member-only offers.</p>
            <form
              className="mt-6 flex flex-col gap-3 sm:flex-row"
              onSubmit={async (e) => {
                e.preventDefault();
                const company = String(new FormData(e.currentTarget).get('company') ?? '');
                const res = await fetch('/api/newsletter', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email, company }),
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) return void toast.error(data.error || 'Something went wrong. Please try again.');
                toast.success(data.message);
                localStorage.setItem('noovit-subscribed', '1');
                setEmail('');
              }}
            >
              <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 focus-within:ring-2 focus-within:ring-[var(--color-accent)]">
                <Mail className="h-4 w-4 text-[var(--color-muted)]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  aria-label="Email address"
                  autoComplete="email"
                  className="w-full bg-transparent py-3 text-[var(--color-ink)] focus:outline-none"
                />
              </div>
              <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
              <button className="btn bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]">Get 10% Off</button>
            </form>
          </div>
          <img src={IMAGES.nutrition} alt="" className="hidden h-full w-full object-cover md:block" />
        </div>
      </div>
    </section>
  );
}

export function SubscriptionPerks() {
  return (
    <section className="section">
      <div className="container px-6">
        <SectionHeading eyebrow="Subscribe & Save" title="Stay consistent. Save every month." sub="Change or cancel anytime." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SUBSCRIPTION_PERKS.map((p) => (
            <div key={p.title} className="overflow-hidden rounded-2xl border border-[var(--color-line)]">
              <img src={p.image} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
              <div className="p-5">
                <h3 className="text-lg">{p.title}</h3>
                <p className="mt-1 text-sm text-[var(--color-muted)]">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/shop" className="btn btn-primary">Start Your Journey</Link>
        </div>
      </div>
    </section>
  );
}
