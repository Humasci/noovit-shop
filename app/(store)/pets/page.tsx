import Link from 'next/link';
import type { Metadata } from 'next';
import { Check, Stethoscope, Scale, MapPin, FlaskConical, Ban, ShieldCheck, PawPrint } from 'lucide-react';
import { PetsShop } from '@/components/pets/PetsShop';
import { PetsWaitlist } from '@/components/pets/PetsWaitlist';
import { petProducts } from '@/data/products';
import { getStoreProducts } from '@/lib/catalog/server';
import { FAQSection, CommunitySection, SectionHeading } from '@/components/sections/Sections';
import { MasonryGallery } from '@/components/hub/MasonryGallery';
import { PET_IMAGES, PET_FAQS, VETS } from '@/data/content';
import { JsonLd } from '@/components/seo/JsonLd';
import { pageLd, faqLd } from '@/lib/structured-data';
import { TEST_KITS } from '@/lib/tests';

// Until pet products are published this is the at-home kits waitlist page (indexed; supplements come later).
export async function generateMetadata(): Promise<Metadata> {
  const live = petProducts(await getStoreProducts()).length > 0;
  return live
    ? {
        title: 'Noovit Pets — Supplements for Dogs & Cats',
        description: 'Probiotic, hip & joint, calming and skin & coat supplements for dogs and cats, dosed by weight.',
        alternates: { canonical: '/pets' },
      }
    : {
        // Indexed (20 Nov): the at-home kit pages are real content, like the human test pages.
        title: 'Noovit Pets: At-Home Health Tests for Dogs & Cats',
        description: 'At-home urine test strips and DNA health tests for dogs and cats are coming to Noovit Pets. What each test checks, and the waitlist.',
        alternates: { canonical: '/pets' },
      };
}

const PET_TRUST = [
  { icon: Stethoscope, label: 'Simple Ingredients' },
  { icon: Scale, label: 'Dosed by Weight' },
  { icon: MapPin, label: 'Free US Shipping' },
  { icon: FlaskConical, label: 'Clear Labels' },
  { icon: Ban, label: 'No Artificial Colors' },
  { icon: ShieldCheck, label: 'Picky-Eater Guarantee' },
];

export default async function PetsPage({ searchParams }: { searchParams: Promise<{ species?: string }> }) {
  const [products, { species }] = await Promise.all([getStoreProducts(), searchParams]);
  // Until a pet product is published, the page is a "coming soon" waitlist without reviews or vet quotes.
  const live = petProducts(products).length > 0;
  return (
    <>
      <JsonLd data={[...pageLd({ path: '/pets', name: 'Noovit Pets', crumbs: [['Noovit Pets', '/pets']], items: TEST_KITS.filter((k) => k.pets).map((k) => ({ name: k.name, path: `/at-home-tests/${k.slug}` })) }), ...(live ? [faqLd(PET_FAQS)] : [])]} />
      <section className="relative overflow-hidden">
        <img src={PET_IMAGES.hero} alt="A woman relaxing on a sofa with her dog" className="absolute inset-0 h-full w-full object-cover object-right" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-pets-soft)] via-[var(--color-pets-soft)]/85 to-transparent" />
        <div className="container relative px-6 py-20 md:py-32">
          <div className="max-w-xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-pets)] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-navy)]">
              <PawPrint className="h-4 w-4" /> Noovit Pets
            </p>
            <h1 className="text-balance text-4xl md:text-6xl">Because they&apos;re family too.</h1>
            <p className="mt-5 text-lg text-[var(--color-ink)]/80">
              {live
                ? 'Supplements for dogs and cats, dosed by body weight, in chews they actually look forward to.'
                : 'At-home health checks for dogs and cats: simple urine wellness strips and DNA health tests, with clear guidance on when to call your vet.'}
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

      {!live && (
        // Pets starts with at-home checks (owner, 20 Nov); supplements follow once there is warehouse space.
        <section className="section">
          <div className="container px-6">
            <SectionHeading eyebrow="What's coming" title="Know more about their health, at home" />
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { img: PET_IMAGES.urine, alt: 'A cat and a small dog sitting in a meadow', title: 'Urine wellness strips', href: '/at-home-tests/pet-urine-test-strips', text: 'Check pH, protein, glucose and blood at home in minutes. A result outside the range is your cue to call the vet.', tag: 'First' },
                { img: PET_IMAGES.dna, alt: 'A vet holding a small fluffy dog', title: 'DNA health tests', href: '/at-home-tests/pet-dna-test', text: 'A cheek swab for breed and inherited health risks, from trusted testing partners.', tag: 'First' },
                { img: PET_IMAGES.supplements, alt: 'A woman playing with her dog and cat at home', title: 'Supplements', text: 'Joint and gut chews for dogs, and more for cats, made to the same clear-label standards as our human range.', tag: 'Later' },
              ].map((c) => (
                <div key={c.title} className="overflow-hidden rounded-3xl bg-[var(--color-pets-soft)]">
                  <img src={c.img} alt={c.alt} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                  <div className="p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-pets-dark)]">{c.tag}</p>
                    <h3 className="mt-2 text-xl">{c.href ? <Link href={c.href} className="hover:underline">{c.title}</Link> : c.title}</h3>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-[var(--color-muted)]">At-home checks are screening tools, not a diagnosis. Always talk to your vet about results or symptoms.</p>
          </div>
        </section>
      )}

      <MasonryGallery
        title="For dogs, cats and the people who love them"
        images={[
          // Order matters: slot 1 large, 3 tall, 6 wide (MasonryGallery), so landscape photos go to 1 and 6.
          { src: PET_IMAGES.hero, alt: 'A woman relaxing on a sofa with her dog' },
          { src: PET_IMAGES.care, alt: 'A shar-pei puppy resting its head on a hand' },
          { src: PET_IMAGES.teaser, alt: 'A dog and a cat side by side' },
          { src: PET_IMAGES.dna, alt: 'A vet holding a small fluffy dog' },
          { src: PET_IMAGES.urine, alt: 'A cat and a small dog sitting in a meadow' },
          { src: PET_IMAGES.supplements, alt: 'A woman playing with her dog and cat at home' },
        ]}
      />

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
