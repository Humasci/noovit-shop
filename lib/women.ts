// Women's Health hub (/women, owner 19 Nov: the most prominent category on the human side).
// Sections by need/life stage; each lists products in order and shows only the ones on sale (hidden drop out).
// Copy follows FDA structure/function rules: "supports", never treats/relieves; no hormone-balancing claims.
export interface WomenSection {
  id: string;
  title: string;
  intro: string;
  products: string[];
  guides: { href: string; label: string }[];
}

export const WOMEN_SECTIONS: WomenSection[] = [
  {
    id: 'strength',
    title: 'Strength at every age',
    intro: 'Creatine is one of the most studied supplements there is, and research in women shows gains in strength and lean muscle alongside resistance training. It matters more with every decade.',
    products: ['creatine-for-women', 'creatine-hydration'],
    guides: [{ href: '/guides/creatine', label: 'Creatine: what the evidence says' }, { href: '/blog/creatine-for-women', label: 'Creatine for women' }],
  },
  {
    id: 'sleep-stress',
    title: 'Sleep & everyday stress',
    intro: 'Magnesium glycinate in the evening and KSM-66® ashwagandha for busy days. Taken together or on their own.',
    products: ['magnesium-complex', 'ashwagandha', 'sleep-calm-stack'],
    guides: [
      { href: '/guides/magnesium', label: 'Magnesium: forms, doses and evidence' },
      { href: '/guides/ashwagandha', label: 'Ashwagandha: what the research shows' },
      { href: '/blog/magnesium-and-ashwagandha-together', label: 'Magnesium and ashwagandha together' },
    ],
  },
  {
    id: 'midlife',
    title: 'Perimenopause & menopause',
    intro: 'A natural life stage, with changing needs: muscle and bone, sleep, and the nutrients women need more of after 40.',
    products: ['menopause-complex', 'creatine-for-women', 'magnesium-complex', 'vitamin-d3-k2'],
    guides: [{ href: '/guides/creatine', label: 'Creatine after 40' }],
  },
  {
    id: 'energy',
    title: 'Energy, iron & focus',
    intro: 'Low iron is common in women who menstruate. Iron, vitamin D and B vitamins all play a part in normal energy.',
    products: ['iron-complex', 'lions-mane', 'coq10', 'multivitamin'],
    guides: [{ href: '/tests/nutrient-check', label: 'At-home Nutrient Check (coming soon)' }, { href: '/guides/lions-mane', label: "Lion's mane: the evidence" }],
  },
  {
    id: 'beauty',
    title: 'Hair, skin & nails',
    intro: 'Collagen and biotin to support hair, skin and nails from within.',
    products: ['collagen-complex', 'biotin-complex'],
    guides: [],
  },
];

// Homepage banner picks (first four on sale).
export const WOMEN_FEATURED = ['creatine-for-women', 'magnesium-complex', 'ashwagandha', 'menopause-complex', 'iron-complex', 'collagen-complex'];
