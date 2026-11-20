// Women's Health hub (/women, owner 19 Nov: the most prominent category on the human side).
// Sections by need/life stage; each lists products in order and shows only the ones on sale (hidden drop out).
// Copy follows FDA structure/function rules: "supports", never treats/relieves; no hormone-balancing claims.
import { WOMEN_IMAGES } from '@/data/content';

export interface WomenSection {
  id: string;
  title: string;
  intro: string;
  products: string[];
  guides: { href: string; label: string }[];
  image?: string;
  imageAlt?: string;
  portrait?: boolean; // portrait photo: shown taller instead of cropped to 16:10
  // Fact and benefit tiles in the section's bento grid (owner, 20 Nov: "products, images, facts"). Benefit claims carry *.
  facts?: { eyebrow: string; big?: string; text: string; tone?: 'dark' | 'light' | 'accent' }[];
}

export const WOMEN_SECTIONS: WomenSection[] = [
  {
    id: 'strength',
    image: WOMEN_IMAGES.strength,
    imageAlt: 'A smiling woman holding out a tub of Noovit Creatine for Her',
    portrait: true,
    title: 'Strength at every age',
    intro: 'Creatine is one of the most studied supplements there is, and research in women shows gains in strength and lean muscle alongside resistance training. It matters more with every decade.',
    facts: [
      { eyebrow: 'The dose', big: '5 g', text: 'Creatine a day, the amount most studies use.', tone: 'dark' },
      { eyebrow: 'Benefit', text: 'Supports strength and lean muscle alongside training*', tone: 'light' },
      { eyebrow: 'Simple', big: '1', text: 'Ingredient: pure creatine monohydrate, unflavored.', tone: 'accent' },
    ],
    products: ['creatine-for-women', 'creatine-hydration'],
    guides: [{ href: '/guides/creatine', label: 'Creatine: what the evidence says' }, { href: '/blog/creatine-for-women', label: 'Creatine for women' }],
  },
  {
    id: 'sleep-stress',
    image: WOMEN_IMAGES.sleep,
    imageAlt: 'A woman holding supplement capsules and a glass of water',
    title: 'Sleep & everyday stress',
    intro: 'Magnesium glycinate in the evening and KSM-66® ashwagandha for busy days. Taken together or on their own.',
    facts: [
      { eyebrow: 'Magnesium', big: '275 mg', text: 'Elemental magnesium per serving, as gentle glycinate.', tone: 'dark' },
      { eyebrow: 'Did you know', big: '44%', text: 'Of US women get less magnesium than they need (USDA, NHANES 2015–2018).', tone: 'light' },
      { eyebrow: 'Ashwagandha', big: '600 mg', text: 'KSM-66® root extract, the dose used in the main studies.', tone: 'accent' },
      { eyebrow: 'Benefit', text: 'Supports relaxation, everyday calm and restful sleep*', tone: 'light' },
    ],
    products: ['magnesium-complex', 'ashwagandha', 'sleep-calm-stack'],
    guides: [
      { href: '/guides/magnesium', label: 'Magnesium: forms, doses and evidence' },
      { href: '/guides/ashwagandha', label: 'Ashwagandha: what the research shows' },
      { href: '/blog/magnesium-and-ashwagandha-together', label: 'Magnesium and ashwagandha together' },
    ],
  },
  {
    id: 'midlife',
    image: WOMEN_IMAGES.midlife,
    imageAlt: 'A smiling woman in her fifties drinking water',
    title: 'Perimenopause & menopause',
    intro: 'A natural life stage, with changing needs: muscle and bone, sleep, and the nutrients women need more of after 40.',
    facts: [
      { eyebrow: 'After 40', big: '40+', text: 'Muscle and bone change faster, so strength and nutrients matter more.', tone: 'dark' },
      { eyebrow: 'Benefit', text: 'Supports balance through menopause*', tone: 'light' },
      { eyebrow: 'Pair it', big: '5 g', text: 'Creatine alongside strength training supports muscle at every age*', tone: 'accent' },
    ],
    products: ['menopause-complex', 'creatine-for-women', 'magnesium-complex', 'vitamin-d3-k2'],
    guides: [{ href: '/guides/creatine', label: 'Creatine after 40' }],
  },
  {
    id: 'energy',
    image: WOMEN_IMAGES.energy,
    imageAlt: 'A woman holding a capsule',
    title: 'Energy, iron & focus',
    intro: 'Low iron is common in women who menstruate. Iron, vitamin D and B vitamins all play a part in normal energy.',
    facts: [
      { eyebrow: 'Test first', big: 'Ferritin', text: 'Your iron stores. Worth checking before you take iron.', tone: 'dark' },
      { eyebrow: 'Focus', big: '1,000 mg', text: "Lion's mane per serving, fruiting body and mycelium.", tone: 'accent' },
      { eyebrow: 'Benefit', text: 'Supports normal energy levels*', tone: 'light' },
    ],
    products: ['iron-complex', 'lions-mane', 'coq10', 'multivitamin'],
    guides: [{ href: '/tests/nutrient-check', label: 'At-home Nutrient Check (coming soon)' }, { href: '/guides/lions-mane', label: "Lion's mane: the evidence" }],
  },
  {
    id: 'beauty',
    title: 'Hair, skin & nails',
    intro: 'Collagen and biotin to support hair, skin and nails from within.',
    facts: [
      { eyebrow: 'Benefit', text: 'Supports skin, hair and nails from within*', tone: 'light' },
      { eyebrow: 'Formula', big: '+ C', text: 'Collagen with hyaluronic acid and vitamin C.', tone: 'dark' },
    ],
    products: ['collagen-complex', 'biotin-complex'],
    guides: [],
  },
];

// Homepage banner picks (first four on sale).
export const WOMEN_FEATURED = ['creatine-for-women', 'magnesium-complex', 'ashwagandha', 'menopause-complex', 'iron-complex', 'collagen-complex'];

// Masonry gallery on /women: every women's photo the owner supplied (20 Nov), plus the Gemini product scenes.
export const WOMEN_GALLERY = [
  { src: '/images/women/creatine-for-her-scene.jpg', alt: 'A smiling woman holding out a tub of Noovit Creatine for Her' },
  { src: '/images/women/best-supplements-for-women.jpg', alt: 'Three women in sportswear' },
  { src: '/images/women/collagen-menopause-scene.jpg', alt: 'Noovit Collagen Glow+ and Menopause Balance+ bottles on pink' },
  { src: '/images/women/menopause.jpg', alt: 'A smiling woman drinking a glass of water' },
  { src: '/images/women/magnesium-glycinate-for-women.jpg', alt: 'A woman holding capsules and a glass of water' },
  { src: '/images/women/creatine-for-women.jpg', alt: 'Women in a dance fitness class' },
  { src: '/images/women/ashwagandha-for-women.jpg', alt: 'Women lying down and relaxing' },
  { src: '/images/women/iron-collagen-scene.jpg', alt: 'Noovit Iron Complex and Collagen Glow+ bottles on peach' },
  { src: '/images/women/biotin-menopause-scene.jpg', alt: 'Noovit Biotin Complex and Menopause Balance+ bottles on pink' },
  { src: '/images/women/womens-health-supplements.jpg', alt: 'A woman holding a capsule' },
  { src: '/images/women/magnesium-glycinate-for-women-2.jpg', alt: 'A woman holding a softgel' },
  { src: '/images/women/womens-health-friend-circle.jpg', alt: 'Four women dancing in a circle in a garden' },
];
