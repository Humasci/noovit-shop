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
  'magnesium-complex': {
    src: '/images/lifestyle/magnesium-sleep-anatomy.jpg',
    w: 1200,
    h: 1490,
    alt: 'A woman sitting on the edge of a bed in the evening, with her neck and upper-back muscles and brain shown as a translucent illustration',
    eyebrow: 'Evening wind-down',
    title: 'Where magnesium works',
    text: 'Magnesium is involved in muscle and nerve function. Magnesium Sleep+ gives 275 mg of elemental magnesium as glycinate, to support restful sleep and muscle relaxation.* Keep magnesium from supplements to 350 mg a day or less unless your doctor advises otherwise.',
    links: [
      { href: '/guides/magnesium-glycinate', label: 'Read our magnesium glycinate guide' },
      { href: 'https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/', label: 'NIH Office of Dietary Supplements: magnesium fact sheet' },
    ],
  },
  ashwagandha: {
    src: '/images/lifestyle/ashwagandha-calm-anatomy.jpg',
    w: 1200,
    h: 1490,
    alt: 'A man sitting at a desk with eyes closed, with his brain and his adrenal glands on top of the kidneys shown as a translucent illustration',
    eyebrow: 'Everyday calm',
    title: 'Stress, from head to adrenals',
    text: 'Your adrenal glands sit on top of your kidneys and release cortisol, a stress hormone. In 8–12 week trials, 240–600 mg of ashwagandha extract a day lowered perceived stress in stressed adults. Ashwagandha Calm+ gives 600 mg of KSM-66 per serving, to support stress resilience and calm.*',
    links: [
      { href: '/guides/ashwagandha', label: 'Read our ashwagandha guide' },
      { href: 'https://www.nccih.nih.gov/health/ashwagandha', label: 'NIH NCCIH: ashwagandha, usefulness and safety' },
    ],
  },
  creatine: {
    src: '/images/lifestyle/creatine-squat-anatomy.jpg',
    w: 1200,
    h: 1490,
    alt: 'A man in a goblet squat holding a kettlebell, with his leg, arm and shoulder muscles shown as a translucent illustration',
    eyebrow: 'Strength with training',
    title: 'Where creatine works',
    text: 'About 95% of your body’s creatine is stored in muscle, where it helps refuel short, intense efforts like lifting and sprinting. 5 g a day supports strength and power with resistance training.*',
    links: [
      { href: '/guides/creatine', label: 'Read our creatine guide' },
      { href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5469049/', label: 'The study: ISSN position stand on creatine (2017)' },
    ],
  },
  'lions-mane': {
    src: '/images/lifestyle/lions-mane-focus-anatomy.jpg',
    w: 1200,
    h: 1490,
    alt: 'A woman writing in a notebook, with her brain and a network of nerve cells shown as a translucent illustration',
    eyebrow: 'Focus',
    title: 'A mushroom for the mind',
    text: 'Lion’s mane is an edible mushroom that researchers are studying for focus and memory. Each serving gives 1,000 mg of lion’s mane mushroom, to support focus.* Our guide sets out what the studies show, including their limits.',
    links: [{ href: '/guides/lions-mane', label: 'Read our lion’s mane guide' }],
  },
};
