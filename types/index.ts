export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: ProductCategory;
  benefits: string[];
  ingredients: Ingredient[];
  dosage: string;
  servingSize: string;
  servingsPerContainer: number;
  inStock: boolean;
  featured: boolean;
  nutrition?: NutritionFact[];
  scientificBacking?: string;
  subscriptionAvailable: boolean;
  subscriptionDiscount?: number;
}

export type ProductCategory = 'focus' | 'energy' | 'sleep' | 'recovery' | 'nutrition';

export interface Ingredient {
  name: string;
  amount: string;
  description?: string;
}

export interface NutritionFact {
  name: string;
  amount: string;
  dailyValue?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  isSubscription: boolean;
}

export interface Cart {
  items: CartItem[];
  total: number;
  subtotal: number;
  discount: number;
}

export interface ShippingAddress {
  fullName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  shippingAddress?: ShippingAddress;
  subscriptions: Subscription[];
}

export interface Subscription {
  id: string;
  productId: string;
  frequency: 'monthly' | 'biweekly' | 'quarterly';
  nextDeliveryDate: Date;
  status: 'active' | 'paused' | 'cancelled';
}

export interface FilterOptions {
  categories: ProductCategory[];
  benefits: string[];
  priceRange: [number, number];
  inStockOnly: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  content: string;
  rating: number;
  productId?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  publishedDate: Date;
  author: string;
  readTime: number;
}
