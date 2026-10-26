import Link from 'next/link';
import type { Metadata } from 'next';
import { Check, Stethoscope, Scale, MapPin, FlaskConical, Ban, ShieldCheck, PawPrint } from 'lucide-react';
import { PetsShop } from '@/components/pets/PetsShop';
import { ReviewsSection, FAQSection, CommunitySection, SectionHeading } from '@/components/sections/Sections';
import { Stars } from '@/components/ui/Stars';
import { PET_IMAGES, PET_REVIEWS, PET_FAQS, VETS } from '@/data/content';

export const metadata: Metadata = {
  title: 'Noovit Pets — Vet-Formulated Supplements for Dogs & Cats',
  description: 'Vet-formulated probiotic, hip & joint, calming and skin & coat supplements for dogs and cats. Dosed by weight, made in the USA.',
};

const PET_TRUST = [
  { icon: Stethoscope, label: 'Vet Formulated' },
  { icon: Scale, label: 'Dosed by Weight' },
  { icon: MapPin, label: 'Made in the USA' },
  { icon: FlaskConical, label: 'Third-Party Tested' },
  { icon: Ban, label: 'No Artificial Colours' },
  { icon: ShieldCheck, label: 'Picky-Eater Guarantee' },
];

export default function PetsPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <img src={PET_IMAGES.hero} alt="A cat and dog cuddling" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-pets-soft)] via-[var(--color-pets-soft)]/85 to-transparent" />
        <div className="container relative px-6 py-20 md:py-32">
          <div className="max-w-xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-pets)] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white">
              <PawPrint className="h-4 w-4" /> Noovit Pets
            </p>
            <h1 className="text-balance text-4xl md:text-6xl">Because they&apos;re family too.</h1>
            <p className="mt-5 text-lg text-[var(--color-ink)]/80">
              Vet-formulated supplements for dogs and cats — same clean standards as our human range, in chews they actually look forward to.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm font-semibold">
              <Stars size={14} /> Loved by pet parents
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#pet-products" className="btn bg-[var(--color-pets)] text-white hover:bg-[var(--color-pets-dark)]">
                Shop Pets
              </a>
              <Link href="/shop" className="btn btn-outline">Shop for Humans</Link>
            </div>
            <ul className="mt-6 flex flex-col gap-2 text-sm font-semibold sm:flex-row sm:gap-6">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[var(--color-pets)]" /> 90-day guarantee</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[var(--color-pets)]" /> One cart for the whole family</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="border-y border-[var(--color-line)] bg-white py-6">
        <div className="container grid grid-cols-2 gap-4 px-6 sm:grid-cols-3 lg:grid-cols-6">
          {PET_TRUST.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center justify-center gap-2 text-sm font-bold text-[var(--color-navy)]">
              <Icon className="h-5 w-5 text-[var(--color-pets)]" /> {label}
            </div>
          ))}
        </div>
      </div>

      <PetsShop />

      <section className="section">
        <div className="container grid gap-12 px-6 lg:grid-cols-[1fr_2fr]">
          <div>
            <SectionHeading eyebrow="Vet formulated" title="Developed with veterinarians" center={false} />
            <p className="-mt-6 text-[var(--color-muted)]">
              Every Noovit Pets formula is designed with veterinary professionals and dosed by body weight — never a scaled-down human product.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {VETS.map((v, i) => (
              <div key={i} className="rounded-2xl bg-[var(--color-pets-soft)] p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-pets)] text-white">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <p className="mt-4 font-bold">{v.name}</p>
                <p className="text-xs font-semibold text-[var(--color-pets-dark)]">{v.credentials}</p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">&ldquo;{v.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ReviewsSection title="Happy pets, happy parents" reviews={PET_REVIEWS} />
      <FAQSection faqs={PET_FAQS} title="Noovit Pets FAQ" />
      <CommunitySection images={PET_IMAGES.community} handle="@noovitpets" title="Meet the Noovit Pets pack" />

      <section className="section">
        <div className="container px-6">
          <div className="rounded-3xl bg-[var(--color-navy)] p-10 text-center text-white md:p-14">
            <h2 className="text-3xl text-white md:text-4xl">Shopping for yourself too?</h2>
            <p className="mt-3 text-white/70">Add human supplements to the same order and subscription.</p>
            <Link href="/shop" className="btn mt-6 bg-white text-[var(--color-navy)] hover:bg-[#93c5fd]">Shop Noovit</Link>
          </div>
        </div>
      </section>
    </>
  );
}
