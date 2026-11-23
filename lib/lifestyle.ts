// Lifestyle images per product (23 Nov): the see-through-anatomy visuals from design/briefs/ANATOMY_VISUALS.md.
// Shown on the product page below the buy box, never in the product-photo slot (photos must show what customers get).
// Captions follow the brief: structure/function wording with an asterisk, nothing beyond our evidence.
// `links`: our guide plus the source behind the caption, so readers can check the evidence themselves.
export const LIFESTYLE: Record<string, { src: string; alt: string; eyebrow: string; title: string; text: string; links?: { href: string; label: string }[]; w?: number; h?: number }> = {
  'creatine-for-women': {
    src: '/images/women/creatine-for-her-strength-anatomy.jpg',
    alt: 'A woman standing hands on hips, with her arm and shoulder muscles and brain shown as a translucent illustration',
    eyebrow: 'Strength at every age',
    title: 'Where creatine works',
    text: 'About 95% of your body’s creatine is stored in muscle, where it helps refuel short, intense efforts. 5 g a day supports strength with resistance training.* Early research also looks at memory; more studies in women are needed.',
    links: [
      { href: '/guides/creatine', label: 'Read our creatine guide' },
      { href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5469049/', label: 'The study: ISSN position stand on creatine (2017)' },
    ],
  },
  'turmeric-complex': {
    src: '/images/lifestyle/turmeric-joints-anatomy.jpg',
    w: 1200,
    h: 1490,
    alt: 'A woman kneeling to tend a potted herb, with her knee joints and hand bones shown as a translucent illustration',
    eyebrow: 'Everyday movement',
    title: 'Made for the joints you use',
    text: 'Turmeric Complex pairs 800 mg turmeric root and 100 mg of 95% curcuminoids with glucosamine and chondroitin, to support joint comfort.* Contains shellfish (glucosamine).',
    links: [{ href: '/guides/turmeric', label: 'Read our turmeric guide' }],
  },
  'iron-complex': {
    src: '/images/lifestyle/iron-blood-anatomy.jpg',
    w: 1200,
    h: 1490,
    alt: 'A woman walking up white stairs, with the blood vessels in her arms and chest shown as a translucent illustration with red blood cells',
    eyebrow: 'Energy, from the inside',
    title: 'Where iron goes',
    text: 'Most of your body’s iron sits in hemoglobin, inside red blood cells, which carry oxygen around the body. Gentle iron bisglycinate supports normal energy levels and red blood cell formation.* Check your iron with your doctor before taking a supplement.',
    links: [
      { href: 'https://ods.od.nih.gov/factsheets/Iron-Consumer/', label: 'NIH Office of Dietary Supplements: iron fact sheet' },
      { href: '/at-home-tests/iron-test', label: 'Our at-home Iron & Nutrient Check (coming soon)' },
    ],
  },
};
