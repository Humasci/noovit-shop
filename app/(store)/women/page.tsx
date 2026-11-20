import type { Metadata } from 'next';
import { WOMEN_SECTIONS, WOMEN_GALLERY } from '@/lib/women';
import { WOMEN_IMAGES } from '@/data/content';
import { HealthHub } from '@/components/hub/HealthHub';

export const metadata: Metadata = {
  title: "Women's Health Supplements: Strength, Sleep, Menopause | Noovit",
  description: "Evidence-led supplements for women: creatine for strength, magnesium glycinate and ashwagandha for sleep and stress, plus support for perimenopause, energy and iron. Free US shipping.",
  alternates: { canonical: '/women' },
};

export default function WomenPage() {
  return (
    <HealthHub
      cfg={{
        crumb: "Women's Health",
        title: "Women's health, backed by evidence",
        intro: 'Strength, sleep, stress and the changes of midlife. Researched ingredients at clear doses, printed on the front of every bottle.',
        hero: { src: WOMEN_IMAGES.hub, alt: 'Four women dancing in a circle in a sunny garden', position: 'object-center' },
        sections: WOMEN_SECTIONS,
        gallery: WOMEN_GALLERY,
        galleryTitle: 'Strong at every age',
        footnote: 'Pregnant, breastfeeding, taking medication or managing a health condition? Talk to your doctor before starting a supplement.',
      }}
    />
  );
}
