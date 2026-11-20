import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MEN_SECTIONS, MEN_GALLERY, MEN_LIVE } from '@/lib/men';
import { MEN_IMAGES } from '@/data/content';
import { HealthHub } from '@/components/hub/HealthHub';

export const metadata: Metadata = {
  title: "Men's Health Supplements: Strength, Focus, Sleep | Noovit",
  description: "Evidence-led men's health supplements: creatine for strength, lion's mane and CoQ10 for focus and energy, magnesium and ashwagandha for sleep.",
  alternates: { canonical: '/mens-health' },
};

export default function MenPage() {
  if (!MEN_LIVE) notFound();
  return (
    <HealthHub
      cfg={{
        path: '/mens-health',
        crumb: "Men's Health",
        title: "Men's health, backed by evidence",
        intro: 'Strength, focus, sleep and recovery. Researched ingredients at clear doses, printed on the front of every bottle.',
        hero: { src: MEN_IMAGES.hub, alt: 'A man lifting a barbell in a gym', position: 'object-[65%_35%]' },
        sections: MEN_SECTIONS,
        gallery: MEN_GALLERY,
        galleryTitle: 'Built for training and everyday life',
      }}
    />
  );
}
