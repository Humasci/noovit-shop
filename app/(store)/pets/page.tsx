import Link from 'next/link';
import type { Metadata } from 'next';
import { Check, Stethoscope, Scale, MapPin, FlaskConical, Ban, ShieldCheck, PawPrint } from 'lucide-react';
import { PetsShop } from '@/components/pets/PetsShop';
import { PetsWaitlist } from '@/components/pets/PetsWaitlist';
import { petProducts } from '@/data/products';
import { getStoreProducts } from '@/lib/catalog/server';
import { FAQSection, CommunitySection, SectionHeading } from '@/components/sections/Sections';
import { PET_IMAGES, PET_FAQS, VETS } from '@/data/content';

// Until pet products are published this is a waitlist page, kept out of search results.
export async function generateMetadata(): Promise<Metadata> {
  const live = petProducts(await getStoreProducts()).length > 0;
  return live
    ? {
        title: 'Noovit Pets — Supplements for Dogs & Cats',
        description: 'Probiotic, hip & joint, calming and skin & coat supplements for dogs and cats, dosed by weight.',
        alternates: { canonical: '/pets' },
      }
    : { title: 'Noovit Pets — Coming Soon', description: 'Soft chews for dogs from Noovit. Join the waitlist to hear when they launch.', robots: { index: false } };
}

const PET_TRUST = [
  { icon: Stethoscope, label: 'Vet Formulated' },
  { icon: Scale, label: 'Dosed by Weight' },
  { icon: MapPin, label: 'Made in the USA' },
  { icon: FlaskConical, label: 'Third-Party Tested' },
  { icon: Ban, label: 'No Artificial Colours' },
  { icon: ShieldCheck, label: 'Picky-Eater Guarantee' },
];

export default async function PetsPage({ searchParams }: { searchParams: Promise<{ species?: string }> }) {
  const [products, { species }] = await Promise.all([getStoreProducts(), searchParams]);
  // Until a pet product is published, the page is a "coming soon" waitlist without reviews or vet quotes.
  const live = petProducts(products).length > 0;
  return (
    <>
      <section className="relative overflow-hidden">
        <img src={PET_IMAGES.hero} alt="A cat and dog cuddling" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-pets-soft)] via-[var(--color-pets-soft)]/85 to-transparent" />
        <div className="container relative px-6 py-20 md:py-32">
          <div className="max-w-xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-pets)] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-navy)]">
              <PawPrint className="h-4 w-4" /> Noovit Pets
            </p>
            <h1 className="text-balance text-4xl md:text-6xl">Because they&apos;re family too.</h1>
            <p className="mt-5 text-lg text-[var(--color-ink)]/80">
              {live
                ? 'Vet-formulated supplements for dogs and cats — same clean standards as our human range, in chews they actually look forward to.'
                : 'Soft chews for dogs, made to the same clean standards as our human range. Launching soon.'}
            </p>
            {!live && <p className="mt-6 text-sm font-semibold text-[var(--color-pets-dark)]">Coming soon</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#pet-products" className="btn bg-[var(--color-pets)] text-[var(--color-navy)] hover:brightness-95">
                {live ? 'Shop Pets' : 'Join the waitlist'}
              </a>
              <Link href="/shop" className="btn bg-[var(--color-opal)] text-[var(--color-navy)] hover:bg-[var(--color-accent-light)]">Shop for Humans</Link>
            </div>
            {live && (
              <ul className="mt-6 flex flex-col gap-2 text-sm font-semibold sm:flex-row sm:gap-6">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[var(--color-pets)]" /> 90-day guarantee</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[var(--color-pets)]" /> One cart for the whole family</li>
              </ul>
            )}
          </div>
        </div>
      </section>

      {live && (
        <div className="border-y border-[var(--color-line)] bg-white py-6">
          <div className="container grid grid-cols-2 gap-4 px-6 sm:grid-cols-3 lg:grid-cols-6">
            {PET_TRUST.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center justify-center gap-2 text-sm font-bold text-[var(--color-navy)]">
                <Icon className="h-5 w-5 text-[var(--color-pets)]" /> {label}
              </div>
            ))}
          </div>
        </div>
      )}

      {live ? <PetsShop key={species} products={products} initialSpecies={species === 'dog' || species === 'cat' ? species : 'all'} /> : <PetsWaitlist />}

      {live && VETS.length > 0 && (
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
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-pets)] text-[var(--color-navy)]">
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
      )}

      {live && (
        <>
          <FAQSection faqs={PET_FAQS} title="Noovit Pets FAQ" />
          <CommunitySection images={PET_IMAGES.community} handle="@noovitpets" title="Meet the Noovit Pets pack" />
        </>
      )}

      <section className="section">
        <div className="container px-6">
          <div className="rounded-3xl bg-[var(--color-navy)] p-10 text-center text-white md:p-14">
            <h2 className="text-3xl text-white md:text-4xl">Shopping for yourself too?</h2>
            <p className="mt-3 text-white/70">Add human supplements to the same order and subscription.</p>
            <Link href="/shop" className="btn mt-6 bg-white text-[var(--color-navy)] hover:bg-[var(--color-accent-light)]">Shop Noovit</Link>
          </div>
        </div>
      </section>
    </>
  );
}
