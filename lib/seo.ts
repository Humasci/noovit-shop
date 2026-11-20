import type { Product } from '@/types';
import { labelSubtitle } from '@/lib/labels/svg';

// What the product is, in the words people search for ("Magnesium Glycinate 275 mg"). Used in Shopping feed titles,
// image alt text and the Product structured data. Products not listed fall back to the label subtitle.
export const PRODUCT_SPECS: Record<string, string> = {
  'magnesium-complex': 'Magnesium Glycinate 275 mg',
  ashwagandha: 'KSM-66 Ashwagandha 600 mg with Vitamins D3, B6 & B12',
  'lions-mane': "Lion's Mane Mushroom 1,000 mg",
  creatine: 'Creatine Monohydrate Powder 5 g',
  'creatine-for-women': 'Creatine for Women, Monohydrate Powder 5 g',
  'creatine-for-men': 'Creatine for Men, Monohydrate Powder 5 g',
  'magnesium-for-men': 'Magnesium Glycinate for Men 275 mg',
  'creatine-hydration': 'Creatine Monohydrate 5 g with Electrolytes, Lemon',
  coq10: 'CoQ10 Ubiquinone 200 mg',
  'turmeric-complex': 'Turmeric Curcumin with Glucosamine & Chondroitin',
  'iron-complex': 'Iron Bisglycinate 20 mg with Vitamin C',
  'collagen-complex': 'Collagen with Hyaluronic Acid & Vitamin C',
  'biotin-complex': 'Biotin 5,000 mcg with Zinc & Selenium',
  'menopause-complex': 'Menopause Supplement with Black Cohosh & Sage',
  'sleep-calm-stack': 'Magnesium Glycinate + KSM-66 Ashwagandha',
};
export const productSpec = (p: Product) => PRODUCT_SPECS[p.slug] ?? (p.bundleItems?.length ? '' : labelSubtitle(p));

// Search titles and descriptions for product pages. People search for the ingredient and dose ("magnesium glycinate
// 275 mg"), not our product names, so the title leads with that. Order of precedence: what staff type in Admin
// (seo_title / seo_description) > this map > a title built from the product's headline. Keep titles under ~60
// characters and descriptions under ~155, with structure/function wording only.
const PRODUCT_SEO: Record<string, { title: string; description: string }> = {
  'magnesium-complex': {
    title: 'Magnesium Glycinate 275 mg for Sleep | Noovit',
    description: 'Magnesium Sleep+ gives 275 mg of elemental magnesium as gentle, well-absorbed glycinate per serving. 90 capsules. Free US shipping, 90-day guarantee.',
  },
  ashwagandha: {
    title: 'KSM-66 Ashwagandha 600 mg Capsules | Noovit',
    description: 'KSM-66® ashwagandha root extract at 600 mg, the dose used in the main stress studies, plus D3, B vitamins, maca and ginseng. Free US shipping.',
  },
  'lions-mane': {
    title: "Lion's Mane Capsules, 1,000 mg Mushroom | Noovit",
    description: "Lion's mane mushroom: 1,000 mg of fruiting body and mycelium per serving. Free US shipping, subscribe & save, 90-day guarantee.",
  },
  creatine: {
    title: 'Creatine Monohydrate Powder, 5 g Unflavored | Noovit',
    description: 'Pure creatine monohydrate: 5 g per scoop, 50 servings (281 g). One ingredient, unflavored, mixes into any drink. For adults 18+. Free US shipping.',
  },
  'creatine-for-women': {
    title: 'Creatine for Women: Pure Monohydrate, 5 g | Noovit',
    description: 'Creatine for women: pure creatine monohydrate, 5 g per scoop, 50 servings. Unflavored. Supports strength and lean muscle.* Adults 18+. Free US shipping.',
  },
  coq10: {
    title: 'CoQ10 200 mg Capsules (Ubiquinone) | Noovit',
    description: 'CoQ10 at 200 mg per serving, within the 100–300 mg range used in studies. Free US shipping, subscribe & save, 90-day guarantee.',
  },
  'turmeric-complex': {
    title: 'Turmeric and Glucosamine with Chondroitin | Noovit',
    description: 'Turmeric Complex: 800 mg turmeric root plus 100 mg of 95% curcuminoid extract, with glucosamine and chondroitin. Contains shellfish. Free US shipping.',
  },
  'sleep-calm-stack': {
    title: 'Magnesium and Ashwagandha Stack (KSM-66) | Noovit',
    description: 'Sleep & Calm Stack: Magnesium Sleep+ (275 mg as glycinate) and Ashwagandha Calm+ (KSM-66®, 600 mg), together for less. Free US shipping.',
  },
  // Ahrefs keyword plan (20 Nov): drafts get keyword titles ready for launch.
  'creatine-for-men': {
    title: 'Creatine for Men: Pure Monohydrate, 5 g | Noovit',
    description: 'Creatine for men: pure creatine monohydrate, 5 g per scoop, 50 servings. Unflavored. Supports strength, power and lean muscle with training.* Free US shipping.',
  },
  'magnesium-for-men': {
    title: 'Magnesium Glycinate for Men, 275 mg | Noovit',
    description: 'Magnesium glycinate for men: 275 mg elemental magnesium per serving, the gentle form. Supports muscle function, sleep and recovery.* Free US shipping.',
  },
  'creatine-hydration': {
    title: 'Creatine with Electrolytes: Creatine Hydration+ | Noovit',
    description: '5 g creatine monohydrate with sodium, potassium and magnesium in one lemon drink, sweetened with stevia. For adults 18+. Free US shipping.',
  },
  'menopause-complex': {
    title: 'Menopause Supplement: Black Cohosh, Sage, D3 & B6 | Noovit',
    description: 'Menopause Balance+: black cohosh, sage, vitamin D3 and B6 to support balance through menopause.* Every amount listed. Free US shipping.',
  },
  'iron-complex': {
    title: 'Iron Bisglycinate: Gentle Iron Supplement | Noovit',
    description: 'Gentle iron as bisglycinate with vitamin C. Test your ferritin first; take iron only if you need it. Free US shipping, 90-day guarantee.',
  },
  'collagen-complex': {
    title: 'Collagen with Hyaluronic Acid & Vitamin C | Noovit',
    description: 'Collagen Glow+: collagen with hyaluronic acid and vitamin C to support skin, hair and nails.* Every amount listed. Free US shipping.',
  },
  'biotin-complex': {
    title: 'Biotin Supplement with Zinc & Selenium | Noovit',
    description: 'High-strength biotin with zinc and selenium to support hair, skin and nails.* Every amount listed. Free US shipping, 90-day guarantee.',
  },
};

export function productSeo(p: Product) {
  const preset = PRODUCT_SEO[p.slug];
  const built = p.tagline && `${p.name}: ${p.tagline} | Noovit`.length <= 65 ? `${p.name}: ${p.tagline} | Noovit` : `${p.name} | Noovit`;
  // Short product descriptions get the store promise added, so search snippets aren't thin (Google shows ~155 chars).
  const tail = ' Free US shipping, 90-day money-back guarantee.';
  const fallback = p.description.length < 110 && p.description.length + tail.length <= 160 ? p.description + tail : p.description;
  return {
    title: p.seoTitle || preset?.title || built,
    description: p.seoDescription || preset?.description || fallback,
  };
}
