import { MEN_IMAGES } from '@/data/content';
import type { WomenSection } from '@/lib/women';

// Men's Health hub (/men, owner 20 Nov: one section per audience on the homepage). Same products as the main range,
// grouped for men. Structure/function wording only; no testosterone or performance-enhancement claims.
export const MEN_SECTIONS: WomenSection[] = [
  {
    id: 'strength',
    title: 'Strength & training',
    intro: 'Creatine monohydrate is the most studied sports supplement there is: 5 g a day supports strength and power with training. Magnesium supports normal muscle function.',
    products: ['creatine', 'creatine-hydration', 'magnesium-complex'],
    guides: [{ href: '/guides/creatine', label: 'Creatine: what the evidence says' }],
    image: MEN_IMAGES.run,
    imageAlt: 'A man running a road race',
  },
  {
    id: 'focus-energy',
    title: 'Focus & energy',
    intro: "Lion's mane for focus and CoQ10 for cellular energy, at clear doses printed on the front.",
    products: ['lions-mane', 'coq10'],
    guides: [{ href: '/guides/lions-mane', label: "Lion's mane: the evidence" }, { href: '/guides/coq10', label: 'CoQ10: what the research shows' }],
    image: MEN_IMAGES.trail,
    imageAlt: 'A man running on a mountain trail',
  },
  {
    id: 'sleep-stress',
    title: 'Sleep & stress',
    intro: 'Magnesium glycinate in the evening and KSM-66® ashwagandha for busy days.',
    products: ['magnesium-complex', 'ashwagandha', 'sleep-calm-stack'],
    guides: [{ href: '/guides/magnesium', label: 'Magnesium: forms, doses and evidence' }, { href: '/guides/ashwagandha', label: 'Ashwagandha: what the research shows' }],
  },
  {
    id: 'joints',
    title: 'Joints & recovery',
    intro: 'Turmeric with glucosamine and chondroitin to support joint comfort as you keep moving. Contains shellfish.',
    products: ['turmeric-complex', 'zinc'],
    guides: [{ href: '/guides/turmeric', label: 'Turmeric: the evidence' }],
  },
];

export const MEN_FEATURED = ['creatine', 'lions-mane', 'coq10', 'magnesium-complex'];

export const MEN_GALLERY = [
  { src: MEN_IMAGES.hub, alt: 'A man lifting a barbell' },
  { src: MEN_IMAGES.run, alt: 'A man running a road race' },
  { src: MEN_IMAGES.banner, alt: 'A runner sprinting at sunset' },
  { src: MEN_IMAGES.trail, alt: 'A man running on a mountain trail' },
];
