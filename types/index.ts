export type ProductType = 'supplements' | 'sports' | 'specialties';

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

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortBenefit: string;
  description: string;
  whoFor: string;
  benefits: string[];
  ingredients: Ingredient[];
  otherIngredients: string;
  dosage: string;
  servings: number;
  form: 'capsules' | 'powder' | 'softgels';
  basePrice: number;
  color: string;
  productType: ProductType;
  dietaryTags: DietaryTag[];
  audiences: Audience[];
  bestSeller: boolean;
  rating: number;
  reviewCount: number;
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
  image?: string;
}

export interface Expert {
  name: string;
  credentials: string;
  quote: string;
}
