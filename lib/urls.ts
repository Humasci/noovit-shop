// Public URL slugs (owner, 20 Nov: descriptive, keyword-led URLs before launch). Products keep their internal slug as
// their ID (database, Stripe, orders, labels, feeds IDs); only the web address changes. Old addresses redirect
// permanently (next.config.ts `redirects`).
export const PRODUCT_URL: Record<string, string> = {
  'magnesium-complex': 'magnesium-glycinate',
  ashwagandha: 'ashwagandha-ksm-66',
  'lions-mane': 'lions-mane-mushroom',
  creatine: 'creatine-monohydrate',
  coq10: 'coq10-200mg',
  'turmeric-complex': 'turmeric-glucosamine-chondroitin',
  'menopause-complex': 'menopause-supplement',
  'iron-complex': 'iron-bisglycinate',
  'collagen-complex': 'collagen-hyaluronic-acid',
  'biotin-complex': 'biotin-zinc-selenium',
  'magnesium-for-men': 'magnesium-glycinate-for-men',
};
const FROM_URL = Object.fromEntries(Object.entries(PRODUCT_URL).map(([k, v]) => [v, k]));

/** Web path of a product, from its internal slug. */
export const productPath = (slug: string) => `/products/${PRODUCT_URL[slug] ?? slug}`;
/** The URL segment for a product (for static params). */
export const productUrlSlug = (slug: string) => PRODUCT_URL[slug] ?? slug;
/** Internal slug from the URL segment (accepts either form). */
export const productSlugFromUrl = (segment: string) => FROM_URL[segment] ?? segment;

// Hubs and tests.
export const HUB_URL = { women: '/womens-health', men: '/mens-health', tests: '/at-home-tests' } as const;
export const testPath = (kitSlug: string) => `${HUB_URL.tests}/${kitSlug}`;

// Old → new redirects (301) for next.config.ts.
export const KIT_RENAMES: Record<string, string> = {
  'nutrient-check': 'iron-test',
  'perimenopause-check': 'perimenopause-test',
  'womens-wellness': 'womens-health-test',
  'thyroid-check': 'thyroid-test',
  'heart-metabolic': 'cholesterol-test',
  'stress-check': 'cortisol-test',
  'omega-3-index': 'omega-3-test',
  'mens-health-check': 'testosterone-test',
  'pet-urine-strips': 'pet-urine-test-strips',
  'pet-dna-test': 'pet-dna-test',
};
export const URL_REDIRECTS: { source: string; destination: string }[] = [
  { source: '/women', destination: HUB_URL.women },
  { source: '/men', destination: HUB_URL.men },
  { source: '/tests', destination: HUB_URL.tests },
  ...Object.entries(KIT_RENAMES).map(([o, n]) => ({ source: `/tests/${o}`, destination: testPath(n) })),
  ...Object.entries(PRODUCT_URL).map(([o, n]) => ({ source: `/products/${o}`, destination: `/products/${n}` })),
];
