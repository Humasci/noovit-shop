// Lifestyle images per product (23 Nov): the see-through-anatomy visuals from design/briefs/ANATOMY_VISUALS.md.
// Shown on the product page below the buy box, never in the product-photo slot (photos must show what customers get).
// Captions follow the brief: structure/function wording with an asterisk, nothing beyond our evidence.
export const LIFESTYLE: Record<string, { src: string; alt: string; eyebrow: string; title: string; text: string }> = {
  'creatine-for-women': {
    src: '/images/women/creatine-for-her-strength-anatomy.jpg',
    alt: 'A woman standing hands on hips, with her arm and shoulder muscles and brain shown as a translucent illustration',
    eyebrow: 'Strength at every age',
    title: 'Where creatine works',
    text: 'About 95% of your body’s creatine is stored in muscle, where it helps refuel short, intense efforts. 5 g a day supports strength with resistance training.* Early research also looks at memory; more studies in women are needed.',
  },
};
