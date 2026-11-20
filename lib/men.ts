import { MEN_IMAGES } from '@/data/content';
import type { WomenSection } from '@/lib/women';

// Men's Health hub (/mens-health, owner 20 Nov). Creatine for Men and Magnesium for Men (same formulas as the core
// products, own labels) plus the shared range. Structure/function wording only; no testosterone or performance-enhancement claims.
export const MEN_SECTIONS: WomenSection[] = [
  {
    id: 'strength',
    title: 'Strength & training',
    intro: 'Creatine monohydrate is the most studied sports supplement there is: 5 g a day supports strength and power with training. Magnesium supports normal muscle function.',
    products: ['creatine-for-men', 'creatine-hydration', 'magnesium-for-men'],
    guides: [{ href: '/guides/creatine', label: 'Creatine: what the evidence says' }],
    image: MEN_IMAGES.creatine,
    imageAlt: 'A man drinking from a shaker, holding a tub of Noovit Creatine for Men',
    portrait: true,
    image2: { src: MEN_IMAGES.banner, alt: 'A man doing dumbbell curls in a gym', position: 'object-[45%_center]' },
    facts: [
      { eyebrow: 'The dose', big: '5 g', text: 'Creatine a day, the amount most studies use.', tone: 'dark' },
      { eyebrow: 'Benefit', text: 'Supports strength, power and lean muscle with training*', tone: 'light' },
      { eyebrow: 'Simple', big: '1', text: 'Ingredient: pure creatine monohydrate, unflavored.', tone: 'accent' },
    ],
  },
  {
    id: 'sleep-stress',
    title: 'Sleep, stress & recovery',
    intro: 'Magnesium glycinate in the evening and KSM-66® ashwagandha for busy days. Men need 400–420 mg of magnesium a day, and many get less from food.',
    products: ['magnesium-for-men', 'ashwagandha', 'sleep-calm-stack'],
    guides: [{ href: '/guides/magnesium', label: 'Magnesium: forms, doses and evidence' }, { href: '/guides/ashwagandha', label: 'Ashwagandha: what the research shows' }],
    image: MEN_IMAGES.magnesium,
    imageAlt: 'A man pouring capsules from a bottle of Noovit Magnesium for Men',
    portrait: true,
    image2: { src: MEN_IMAGES.magnesiumJar, alt: 'A jar of Noovit Magnesium for Men in mid-air', position: 'object-center' },
    facts: [
      { eyebrow: 'Magnesium', big: '275 mg', text: 'Elemental magnesium per serving, as gentle glycinate.', tone: 'dark' },
      { eyebrow: 'Daily need', big: '420 mg', text: 'Magnesium a day for men from age 31, food included (NIH).', tone: 'light' },
      { eyebrow: 'Ashwagandha', big: '600 mg', text: 'KSM-66® root extract, the dose used in the main studies.', tone: 'accent' },
      { eyebrow: 'Benefit', text: 'Supports muscle function, relaxation and restful sleep*', tone: 'light' },
    ],
  },
  {
    id: 'over-40',
    title: 'Over 40 and 50',
    intro: 'Muscle and strength decline faster with age. Creatine with strength training helps hold on to both, and magnesium and CoQ10 support normal muscle and energy.',
    products: ['creatine-for-men', 'magnesium-for-men', 'coq10', 'turmeric-complex'],
    guides: [{ href: '/guides/creatine', label: 'Creatine after 40' }, { href: '/guides/coq10', label: 'CoQ10: what the research shows' }],
    image: MEN_IMAGES.over50,
    imageAlt: 'Two men running on a track',
    portrait: true,
    facts: [
      { eyebrow: 'After 40', big: '40+', text: 'Muscle and strength fall faster, so training and protein matter more.', tone: 'dark' },
      { eyebrow: 'Research', big: '+1.4 kg', text: 'More lean mass with creatine plus training than training alone, in adults aged about 57–70.', tone: 'light' },
      { eyebrow: 'CoQ10', big: '200 mg', text: 'Per capsule, the most-studied ubiquinone form.', tone: 'accent' },
    ],
  },
  {
    id: 'focus-energy',
    title: 'Focus & energy',
    intro: "Lion's mane for focus and CoQ10 for cellular energy, at clear doses printed on the front.",
    products: ['lions-mane', 'coq10'],
    guides: [{ href: '/guides/lions-mane', label: "Lion's mane: the evidence" }, { href: '/guides/coq10', label: 'CoQ10: what the research shows' }],
    image: MEN_IMAGES.bike,
    imageAlt: 'A man training on an indoor bike',
    portrait: true,
    image2: { src: '/images/scenes/lions-mane.jpg', alt: "Noovit Lion's Mane on lion's mane mushrooms", position: 'object-center' },
    facts: [
      { eyebrow: 'Focus', big: '1,000 mg', text: "Lion's mane per serving, fruiting body and mycelium.", tone: 'dark' },
      { eyebrow: 'Benefit', text: 'Supports focus and normal energy levels*', tone: 'light' },
    ],
  },
  {
    id: 'joints',
    title: 'Joints & recovery',
    intro: 'Turmeric with glucosamine and chondroitin to support joint comfort as you keep moving. Contains shellfish.',
    products: ['turmeric-complex', 'zinc'],
    guides: [{ href: '/guides/turmeric', label: 'Turmeric: the evidence' }],
    image: MEN_IMAGES.run,
    imageAlt: 'A man running through a city park',
    portrait: true,
    facts: [
      { eyebrow: 'Turmeric', big: '900 mg', text: 'Turmeric root plus a 95% curcuminoid extract per serving.', tone: 'dark' },
      { eyebrow: 'Benefit', text: 'Supports joint comfort and a healthy inflammatory response*', tone: 'light' },
    ],
  },
];

// Hidden for now (owner, 20 Nov): no nav link, no homepage section, /men returns 404. Set true to show.
export const MEN_LIVE = false;

export const MEN_FEATURED = ['creatine-for-men', 'magnesium-for-men', 'lions-mane', 'coq10'];

// Masonry gallery on /mens-health: every men's photo the owner supplied (20 Nov), landscape ones in the wide slots.
export const MEN_GALLERY = [
  { src: MEN_IMAGES.creatine, alt: 'A man holding a tub of Noovit Creatine for Men' },
  { src: MEN_IMAGES.hub, alt: 'Men on rowing machines in a class' },
  { src: MEN_IMAGES.magnesiumJar, alt: 'A jar of Noovit Magnesium for Men in mid-air' },
  { src: MEN_IMAGES.over50, alt: 'Two men running on a track' },
  { src: MEN_IMAGES.community, alt: 'A man laughing as he laces his running shoes' },
  { src: MEN_IMAGES.banner, alt: 'A man doing dumbbell curls in a gym' },
  { src: MEN_IMAGES.magnesium, alt: 'A man pouring capsules from a bottle of Noovit Magnesium for Men' },
  { src: MEN_IMAGES.bike, alt: 'A man training on an indoor bike' },
  { src: MEN_IMAGES.run, alt: 'A man running through a city park' },
  { src: '/images/scenes/lions-mane.jpg', alt: "Noovit Lion's Mane on lion's mane mushrooms" },
  { src: '/images/scenes/magnesium.jpg', alt: 'Noovit Magnesium Sleep+ on capsules' },
  { src: '/images/scenes/coq10.jpg', alt: 'Noovit CoQ10 on golden softgels' },
];
