import type { Product } from '@/types';

// Search titles and descriptions for product pages. People search for the ingredient and dose ("magnesium glycinate
// 275 mg"), not our product names, so the title leads with that. Order of precedence: what staff type in Admin
// (seo_title / seo_description) > this map > a title built from the product's headline. Keep titles under ~60
// characters and descriptions under ~155, with structure/function wording only.
const PRODUCT_SEO: Record<string, { title: string; description: string }> = {
  'magnesium-complex': {
    title: 'Magnesium Glycinate 275 mg — Magnesium Sleep+ | Noovit',
    description: 'Magnesium Sleep+ gives 275 mg of elemental magnesium as gentle, well-absorbed glycinate per serving. 90 capsules. Free US shipping, 90-day guarantee.',
  },
  ashwagandha: {
    title: 'KSM-66 Ashwagandha 600 mg — Ashwagandha Calm+ | Noovit',
    description: 'KSM-66® ashwagandha root extract at 600 mg, the dose used in the main stress studies, plus D3, B vitamins, maca and ginseng. Free US shipping.',
  },
  'lions-mane': {
    title: "Lion's Mane Mushroom 1,000 mg Capsules | Noovit",
    description: "Organic lion's mane mushroom: 1,000 mg of fruiting body and mycelium per serving. Free US shipping, subscribe & save, 90-day guarantee.",
  },
  creatine: {
    title: 'Creatine Monohydrate Powder, 5 g per Scoop | Noovit',
    description: 'Pure creatine monohydrate: 5 g per scoop, 50 servings (281 g). One ingredient, unflavored, mixes into any drink. For adults 18+. Free US shipping.',
  },
  coq10: {
    title: 'CoQ10 200 mg Capsules | Noovit',
    description: 'CoQ10 at 200 mg per serving, within the 100–300 mg range used in studies. Free US shipping, subscribe & save, 90-day guarantee.',
  },
  'turmeric-complex': {
    title: 'Turmeric Curcumin with Glucosamine & Chondroitin | Noovit',
    description: 'Turmeric Complex: 800 mg turmeric root plus 100 mg of 95% curcuminoid extract, with glucosamine and chondroitin. Contains shellfish. Free US shipping.',
  },
  'sleep-calm-stack': {
    title: 'Magnesium Glycinate + KSM-66 Ashwagandha Stack | Noovit',
    description: 'Sleep & Calm Stack: Magnesium Sleep+ (275 mg as glycinate) and Ashwagandha Calm+ (KSM-66®, 600 mg), together for less. Free US shipping.',
  },
};

export function productSeo(p: Product) {
  const preset = PRODUCT_SEO[p.slug];
  const built = p.tagline && `${p.name}: ${p.tagline} | Noovit`.length <= 65 ? `${p.name}: ${p.tagline} | Noovit` : `${p.name} | Noovit`;
  return {
    title: p.seoTitle || preset?.title || built,
    description: p.seoDescription || preset?.description || p.description,
  };
}
