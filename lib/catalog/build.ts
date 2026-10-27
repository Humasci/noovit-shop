import { FAQ, Product, ProductData, ProductStatus } from '@/types';

const COMMON_FAQS: FAQ[] = [
  { q: 'Is it gluten free?', a: 'Yes. Every Noovit formula is made without gluten-containing ingredients.' },
  { q: 'Is it dairy and lactose free?', a: 'Yes, unless the label states otherwise.' },
  { q: 'What is your return policy?', a: 'Try it for 90 days. If you are not happy, contact us for a full refund — even on an empty bottle.' },
  { q: 'When will my order ship?', a: 'Orders usually ship within 1–2 business days, with tracking by email.' },
];

const PET_FAQS: FAQ[] = [
  { q: 'Is it safe for puppies and kittens?', a: 'Most of our pet formulas are suitable from 12 weeks. Check with your vet first for young, pregnant or nursing pets.' },
  { q: 'Can I give it with medication?', a: 'Please check with your veterinarian before combining supplements with any medication.' },
  { q: 'What if my pet won’t eat it?', a: 'Our 90-day guarantee covers picky eaters too — contact us for a full refund.' },
  { q: 'When will my order ship?', a: 'Orders usually ship within 1–2 business days, with tracking by email.' },
];

export interface ProductRow {
  slug: string;
  data: ProductData;
  status?: ProductStatus;
  images?: string[] | null;
  seo_title?: string | null;
  seo_description?: string | null;
  supplier_sku?: string | null;
}

export interface RealRating {
  rating: number;
  count: number;
}

export function buildProduct(row: ProductRow, real?: RealRating): Product {
  const pets = row.data.productType === 'pets';
  return {
    ...row.data,
    id: row.slug,
    slug: row.slug,
    status: row.status ?? 'active',
    images: row.images ?? [],
    seoTitle: row.seo_title ?? null,
    seoDescription: row.seo_description ?? null,
    supplierSku: row.supplier_sku ?? null,
    // Ratings come only from approved reviews, never from stored or seed values.
    rating: real ? Math.round(real.rating * 10) / 10 : 0,
    reviewCount: real ? real.count : 0,
    hasRealReviews: Boolean(real),
    faqs: [
      ...(row.data.extraFaqs ?? []),
      { q: pets ? 'How much should I give?' : 'How do I take it?', a: row.data.dosage },
      ...(pets ? PET_FAQS : COMMON_FAQS),
    ],
  };
}

// Inverse of buildProduct, for saving.
export function toProductData(p: Product): ProductData {
  return {
    name: p.name,
    shortBenefit: p.shortBenefit,
    description: p.description,
    whoFor: p.whoFor,
    benefits: p.benefits,
    ingredients: p.ingredients,
    otherIngredients: p.otherIngredients,
    dosage: p.dosage,
    servings: p.servings,
    form: p.form,
    basePrice: p.basePrice,
    color: p.color,
    productType: p.productType,
    dietaryTags: p.dietaryTags,
    audiences: p.audiences,
    species: p.species,
    ageRestricted: p.ageRestricted,
    bestSeller: p.bestSeller,
    rating: p.rating,
    reviewCount: p.reviewCount,
    extraFaqs: p.extraFaqs,
    ...(p.bundleItems?.length ? { bundleItems: p.bundleItems } : {}),
  };
}

// Attaches each bundle's component products so mockups can draw the actual bottles.
export function withBundleComponents(products: Product[]): Product[] {
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  return products.map((p) => {
    if (!p.bundleItems?.length) return p;
    const parts = p.bundleItems.map((b) => bySlug.get(b.slug)).filter((x): x is Product => Boolean(x) && !x!.bundleItems?.length);
    return parts.length ? { ...p, bundleComponents: parts } : p;
  });
}
