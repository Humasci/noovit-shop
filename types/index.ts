export type ProductType = 'supplements' | 'sports' | 'specialties' | 'pets';

export type Species = 'dog' | 'cat';

export type DietaryTag =
  | 'vegan'
  | 'gluten-free'
  | 'pregnancy-safe'
  | 'postpartum-safe'
  | 'low-fodmap'
  | 'sugar-free';

export type Audience = 'women' | 'men';

export interface Ingredient {
  name: string;
  amount: string;
  description?: string;
}

export interface FAQ {
  q: string;
  a: string;
}

export type ProductForm = 'capsules' | 'powder' | 'softgels' | 'chews';

export type ProductStatus = 'active' | 'out_of_stock' | 'hidden';

// The editable product fields, stored as JSON in products.data.
export interface ProductData {
  name: string;
  shortBenefit: string;
  description: string;
  whoFor: string;
  benefits: string[];
  ingredients: Ingredient[];
  otherIngredients: string;
  dosage: string;
  servings: number;
  form: ProductForm;
  basePrice: number;
  color: string;
  productType: ProductType;
  dietaryTags: DietaryTag[];
  audiences: Audience[];
  species?: Species[];
  ageRestricted?: boolean;
  bestSeller: boolean;
  // Placeholder display values, replaced by real figures once approved reviews exist.
  rating: number;
  reviewCount: number;
  extraFaqs: FAQ[];
}

export interface Product extends ProductData {
  id: string;
  slug: string;
  status: ProductStatus;
  images: string[];
  seoTitle?: string | null;
  seoDescription?: string | null;
  supplierSku?: string | null;
  hasRealReviews: boolean;
  faqs: FAQ[];
}

export type PurchaseMode = 'subscribe' | 'one-time';
export type Frequency = 30 | 60 | 90;

export interface PackOption {
  bottles: number;
  pricePerBottle: number;
}

export interface CartItem {
  key: string;
  product: Product;
  mode: PurchaseMode;
  frequency?: Frequency;
  bottles: number;
  pricePerBottle: number;
  quantity: number;
}

export interface Review {
  id: string;
  name: string;
  productSlug: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified?: boolean;
  image?: string;
}

export interface Expert {
  name: string;
  credentials: string;
  quote: string;
}
