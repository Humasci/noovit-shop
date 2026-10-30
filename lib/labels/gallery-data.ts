import { Product } from '@/types';

// Copy for the extra gallery images of the core products (lib/labels/gallery.ts draws them).
// Facts only: doses and forms from the label, comparisons from competitors' own labels
// (docs/research/COMPETITORS_CORE5.md). No disease claims, no named competitors.

export type GalleryVariant = 'highlights' | 'compare';

// Three callouts next to the bottle: a big value and a short caption.
export const HIGHLIGHTS: Record<string, [string, string][]> = {
  'magnesium-complex': [
    ['275 mg', 'elemental magnesium in every serving'],
    ['Glycinate', 'the gentle, well-absorbed form'],
    ['3 a day', 'after your evening meal'],
  ],
  ashwagandha: [
    ['600 mg', 'KSM-66® ashwagandha root extract'],
    ['5%', 'withanolides, standardised'],
    ['2 a day', 'the daily amount used in KSM-66 studies'],
  ],
  'lions-mane': [
    ['1,000 mg', "organic lion's mane in every serving"],
    ['Organic', 'fruiting body and mycelium'],
    ['2 a day', '30 servings per bottle'],
  ],
  creatine: [
    ['5 g', 'creatine monohydrate per scoop'],
    ['1', 'ingredient, and nothing else'],
    ['56', 'servings per tub, unflavoured'],
  ],
  coq10: [
    ['200 mg', 'coenzyme Q10 in every capsule'],
    ['Ubiquinone', 'the most-studied form of CoQ10'],
    ['1 a day', 'with a meal that contains some fat'],
  ],
};

// Dose comparison: ours against the typical range on competitors' labels.
export interface Comparison {
  heading: string;
  unit: string;
  ours: { label: string; value: number };
  typical: { label: string; low: number; high: number };
  footnote: string;
}
export const COMPARE: Record<string, Comparison> = {
  'magnesium-complex': {
    heading: '275 mg of elemental magnesium per serving',
    unit: 'mg',
    ours: { label: 'Noovit Magnesium Sleep+', value: 275 },
    typical: { label: 'Typical magnesium glycinate product', low: 120, high: 200 },
    footnote: 'Elemental magnesium per serving. Typical range from the labels of leading US magnesium glycinate products, October 2026.',
  },
  coq10: {
    heading: '200 mg of CoQ10 in every capsule',
    unit: 'mg',
    ours: { label: 'Noovit CoQ10', value: 200 },
    typical: { label: 'Many CoQ10 capsules', low: 100, high: 100 },
    footnote: 'CoQ10 per serving. Many leading US brands sell 100 mg capsules (labels checked October 2026).',
  },
};

export const galleryVariants = (p: Product): GalleryVariant[] => [
  ...(HIGHLIGHTS[p.slug] ? (['highlights'] as const) : []),
  ...(COMPARE[p.slug] ? (['compare'] as const) : []),
];

// Changes whenever the copy or colour does, so the image URL changes too.
export const galleryKey = (p: Product, v: GalleryVariant) =>
  JSON.stringify([v, p.name, p.color, v === 'highlights' ? HIGHLIGHTS[p.slug] : COMPARE[p.slug]]);
