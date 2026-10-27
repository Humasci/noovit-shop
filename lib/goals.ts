// "Shop by goal" pages: /goals/<slug>. Each maps to a quiz goal, so products are matched with the quiz's own weights.
export interface GoalPage {
  slug: string;
  goal: string; // quiz goal id (lib/quiz.ts GOALS)
  name: string; // menu label
  title: string; // page H1
  intro: string;
  seoTitle: string;
  seoDescription: string;
}

export const GOAL_PAGES: GoalPage[] = [
  {
    slug: 'sleep-stress', goal: 'sleep', name: 'Sleep & Stress', title: 'Supplements for sleep & stress',
    intro: 'Wind down, sleep deeper and handle busy days with calm. Magnesium, ashwagandha and more, at researched doses.',
    seoTitle: 'Sleep & Stress Supplements — Magnesium, Ashwagandha | Noovit',
    seoDescription: 'Clean supplements to support restful sleep and everyday calm: magnesium complex, ashwagandha and more. Free US shipping, 90-day guarantee.',
  },
  {
    slug: 'gut-health', goal: 'gut', name: 'Gut Health', title: 'Supplements for gut health',
    intro: 'Support comfortable digestion and a balanced gut with probiotic strains and prebiotic fiber.',
    seoTitle: 'Gut Health Supplements — Probiotics & Prebiotics | Noovit',
    seoDescription: 'Probiotic and gut health supplements for comfortable digestion and a balanced microbiome. Free US shipping, subscribe & save.',
  },
  {
    slug: 'joints-mobility', goal: 'joints', name: 'Joints & Mobility', title: 'Supplements for joints & mobility',
    intro: 'Keep moving comfortably with glucosamine, chondroitin, MSM, turmeric and collagen.',
    seoTitle: 'Joint Supplements — Glucosamine, Turmeric, Collagen | Noovit',
    seoDescription: 'Joint and mobility supplements with glucosamine, chondroitin, MSM, turmeric and collagen. Free US shipping, 90-day guarantee.',
  },
  {
    slug: 'energy', goal: 'energy', name: 'Energy', title: 'Supplements for everyday energy',
    intro: 'Support normal energy levels with the vitamins and minerals your body relies on, from vitamin D3 to iron and magnesium.',
    seoTitle: 'Energy Supplements — Vitamin D3, Iron, Magnesium | Noovit',
    seoDescription: 'Supplements that support normal energy levels: vitamin D3 & K2, iron, magnesium, multivitamin and more. Free US shipping.',
  },
  {
    slug: 'brain-focus', goal: 'brain', name: 'Brain & Focus', title: 'Supplements for brain & focus',
    intro: 'Support clear thinking and focus with functional mushrooms and the nutrients your brain uses every day.',
    seoTitle: 'Brain & Focus Supplements — Mushroom Blend | Noovit',
    seoDescription: 'Brain and focus supplements including a functional mushroom blend with lion’s mane. Free US shipping, 90-day guarantee.',
  },
  {
    slug: 'immunity', goal: 'immunity', name: 'Immunity', title: 'Supplements for immune support',
    intro: 'Zinc, vitamin D3 and probiotics to support a normal, healthy immune system all year round.',
    seoTitle: 'Immune Support Supplements — Zinc, Vitamin D3 | Noovit',
    seoDescription: 'Immune support supplements with zinc, vitamin D3 & K2 and probiotics. Free US shipping, subscribe & save.',
  },
  {
    slug: 'hair-skin-nails', goal: 'beauty', name: 'Hair, Skin & Nails', title: 'Supplements for hair, skin & nails',
    intro: 'Collagen, biotin and zinc to support healthy-looking hair, skin and nails from within.',
    seoTitle: 'Hair, Skin & Nails Supplements — Collagen, Biotin | Noovit',
    seoDescription: 'Beauty supplements with collagen, hyaluronic acid, biotin and zinc for hair, skin and nails. Free US shipping.',
  },
  {
    slug: 'menopause', goal: 'menopause', name: 'Menopause', title: 'Supplements for menopause',
    intro: 'Support for the common symptoms of a natural life stage, plus the nutrients women need more of after 40.',
    seoTitle: 'Menopause Supplements — Women 40+ | Noovit',
    seoDescription: 'Menopause support supplements for women, with black cohosh and essential nutrients for life after 40. Free US shipping.',
  },
  {
    slug: 'muscle-performance', goal: 'muscle', name: 'Muscle & Performance', title: 'Supplements for muscle & performance',
    intro: 'Creatine and magnesium for training, strength and recovery. Simple, single-purpose formulas.',
    seoTitle: 'Muscle & Performance Supplements — Creatine | Noovit',
    seoDescription: 'Sports supplements for strength and recovery: micronized creatine monohydrate and magnesium. Free US shipping.',
  },
];

export const findGoal = (slug: string) => GOAL_PAGES.find((g) => g.slug === slug);
