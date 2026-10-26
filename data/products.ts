import { Product, ProductCategory } from '@/types';

export type ProductType = 'supplements' | 'sports' | 'specialties';
export type DietaryTag = 'vegan' | 'gluten-free' | 'sugar-free' | 'pregnancy-safe' | 'postpartum-safe';

export interface ExtendedProduct extends Product {
  productType: ProductType;
  dietaryTags: DietaryTag[];
}

export const products: ExtendedProduct[] = [
  // SUPPLEMENTS
  {
    id: '1',
    name: 'Multivitamin Daily Essentials',
    slug: 'multivitamin',
    tagline: 'Complete daily nutrition in one capsule',
    description: 'Comprehensive blend of essential vitamins and minerals for whole-body health.',
    longDescription: 'Our daily multivitamin provides a complete spectrum of vitamins and minerals to fill nutritional gaps in your diet. Formulated with bioavailable forms for maximum absorption.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop',
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop'],
    category: 'focus',
    productType: 'supplements',
    dietaryTags: ['gluten-free', 'sugar-free'],
    benefits: [
      'Fills nutritional gaps in your diet',
      'Supports immune system function',
      'Promotes energy and vitality',
      'Bioavailable forms for better absorption'
    ],
    ingredients: [
      { name: 'Vitamin A', amount: '5000 IU', description: 'As beta-carotene' },
      { name: 'Vitamin D3', amount: '2000 IU', description: 'For bone health' },
      { name: 'B-Complex', amount: '100mg', description: 'Full spectrum B vitamins' }
    ],
    dosage: 'Take 2 capsules daily with food',
    servingSize: '2 capsules',
    servingsPerContainer: 30,
    inStock: true,
    featured: true,
    scientificBacking: 'Formulated based on RDA guidelines for optimal daily nutrition.',
    subscriptionAvailable: true,
    subscriptionDiscount: 15,
  },
  {
    id: '2',
    name: 'Vitamin D3 + K2',
    slug: 'vitamin-d3-k2',
    tagline: 'Bone and immune support duo',
    description: 'Synergistic combination for optimal calcium absorption and bone health.',
    longDescription: 'Vitamin D3 and K2 work together to support bone density, cardiovascular health, and immune function. D3 helps absorb calcium while K2 directs it to bones.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&h=800&fit=crop',
    images: ['https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&h=800&fit=crop'],
    category: 'focus',
    productType: 'supplements',
    dietaryTags: ['gluten-free', 'sugar-free'],
    benefits: [
      'Supports bone density and strength',
      'Promotes cardiovascular health',
      'Enhances immune function',
      'Optimizes calcium utilization'
    ],
    ingredients: [
      { name: 'Vitamin D3', amount: '5000 IU', description: 'Cholecalciferol' },
      { name: 'Vitamin K2', amount: '100mcg', description: 'As MK-7' }
    ],
    dosage: 'Take 1 capsule daily with food',
    servingSize: '1 capsule',
    servingsPerContainer: 60,
    inStock: true,
    featured: true,
    scientificBacking: 'Research shows D3 and K2 work synergistically for bone and heart health.',
    subscriptionAvailable: true,
    subscriptionDiscount: 15,
  },
  {
    id: '3',
    name: 'Magnesium Glycinate',
    slug: 'magnesium',
    tagline: 'Calm your mind, relax your muscles',
    description: 'Highly absorbable magnesium for stress relief and muscle recovery.',
    longDescription: 'Our chelated magnesium glycinate is gentle on the stomach and highly bioavailable. Supports over 300 enzymatic processes, promotes relaxation, and aids muscle recovery.',
    price: 22.99,
    image: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&h=800&fit=crop',
    images: ['https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&h=800&fit=crop'],
    category: 'sleep',
    productType: 'supplements',
    dietaryTags: ['vegan', 'gluten-free', 'sugar-free'],
    benefits: [
      'Promotes relaxation and stress relief',
      'Supports muscle recovery',
      'Aids healthy sleep patterns',
      'Gentle on the stomach'
    ],
    ingredients: [
      { name: 'Magnesium Glycinate', amount: '400mg', description: 'Elemental magnesium' }
    ],
    dosage: 'Take 2 capsules daily, preferably in the evening',
    servingSize: '2 capsules',
    servingsPerContainer: 30,
    inStock: true,
    featured: false,
    scientificBacking: 'Magnesium glycinate shows superior absorption and reduced GI side effects.',
    subscriptionAvailable: true,
    subscriptionDiscount: 15,
  },
  {
    id: '4',
    name: 'Omega-3 Fish Oil',
    slug: 'omega-3',
    tagline: 'Heart and brain health from the sea',
    description: 'Triple-strength EPA + DHA for cardiovascular and cognitive support.',
    longDescription: 'Premium fish oil providing 1800mg of omega-3s per serving. Molecularly distilled for purity, tested for mercury and contaminants.',
    price: 32.99,
    image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&h=800&fit=crop',
    images: ['https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&h=800&fit=crop'],
    category: 'focus',
    productType: 'supplements',
    dietaryTags: ['gluten-free', 'sugar-free'],
    benefits: [
      'Supports heart and cardiovascular health',
      'Promotes brain function and mood',
      'Reduces inflammation',
      'Third-party tested for purity'
    ],
    ingredients: [
      { name: 'EPA', amount: '1000mg', description: 'Eicosapentaenoic acid' },
      { name: 'DHA', amount: '800mg', description: 'Docosahexaenoic acid' }
    ],
    dosage: 'Take 2 softgels daily with meals',
    servingSize: '2 softgels',
    servingsPerContainer: 30,
    inStock: true,
    featured: false,
    scientificBacking: 'Extensive research supports omega-3s for heart health and cognitive function.',
    subscriptionAvailable: true,
    subscriptionDiscount: 15,
  },
  {
    id: '5',
    name: 'Turmeric Curcumin Complex',
    slug: 'turmeric',
    tagline: 'Nature\'s most powerful anti-inflammatory',
    description: 'High-potency curcumin with BioPerine for maximum absorption.',
    longDescription: 'Our turmeric extract contains 95% curcuminoids with black pepper extract to enhance bioavailability by 2000%. Supports joint health and healthy inflammation response.',
    price: 26.99,
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&h=800&fit=crop',
    images: ['https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&h=800&fit=crop'],
    category: 'recovery',
    productType: 'supplements',
    dietaryTags: ['vegan', 'gluten-free', 'sugar-free'],
    benefits: [
      'Supports healthy inflammatory response',
      'Promotes joint comfort and mobility',
      'Powerful antioxidant properties',
      'Enhanced absorption with BioPerine'
    ],
    ingredients: [
      { name: 'Turmeric Extract', amount: '1500mg', description: '95% curcuminoids' },
      { name: 'BioPerine', amount: '10mg', description: 'Black pepper extract' }
    ],
    dosage: 'Take 2 capsules daily with food',
    servingSize: '2 capsules',
    servingsPerContainer: 30,
    inStock: true,
    featured: false,
    scientificBacking: 'Clinical studies show curcumin supports joint health and inflammation markers.',
    subscriptionAvailable: true,
    subscriptionDiscount: 15,
  },
  {
    id: '6',
    name: 'Ashwagandha KSM-66',
    slug: 'ashwagandha',
    tagline: 'Adaptogenic stress relief',
    description: 'Clinically-studied ashwagandha to reduce stress and support energy.',
    longDescription: 'KSM-66 is the most clinically studied ashwagandha extract. Supports stress response, promotes calm energy, and enhances physical performance.',
    price: 27.99,
    image: 'https://images.unsplash.com/photo-1612969308146-066d55f37ccf?w=800&h=800&fit=crop',
    images: ['https://images.unsplash.com/photo-1612969308146-066d55f37ccf?w=800&h=800&fit=crop'],
    category: 'focus',
    productType: 'supplements',
    dietaryTags: ['vegan', 'gluten-free', 'sugar-free'],
    benefits: [
      'Reduces stress and cortisol levels',
      'Supports calm, focused energy',
      'Enhances physical performance',
      'Promotes restful sleep'
    ],
    ingredients: [
      { name: 'KSM-66 Ashwagandha', amount: '600mg', description: 'Full-spectrum root extract' }
    ],
    dosage: 'Take 1 capsule twice daily',
    servingSize: '1 capsule',
    servingsPerContainer: 60,
    inStock: true,
    featured: false,
    scientificBacking: 'KSM-66 is backed by 24+ clinical studies showing stress reduction.',
    subscriptionAvailable: true,
    subscriptionDiscount: 15,
  },
  {
    id: '7',
    name: 'Zinc Immune Support',
    slug: 'zinc',
    tagline: 'Essential mineral for immune defense',
    description: 'Highly absorbable zinc picolinate for immune function and cellular health.',
    longDescription: 'Zinc is essential for immune function, wound healing, and DNA synthesis. Our zinc picolinate form offers superior absorption compared to other zinc supplements.',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop',
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop'],
    category: 'focus',
    productType: 'supplements',
    dietaryTags: ['vegan', 'gluten-free', 'sugar-free'],
    benefits: [
      'Supports immune system function',
      'Promotes skin health',
      'Aids cellular repair',
      'Highly bioavailable form'
    ],
    ingredients: [
      { name: 'Zinc Picolinate', amount: '50mg', description: 'Elemental zinc' }
    ],
    dosage: 'Take 1 capsule daily with food',
    servingSize: '1 capsule',
    servingsPerContainer: 90,
    inStock: true,
    featured: false,
    scientificBacking: 'Zinc picolinate demonstrates superior absorption in clinical trials.',
    subscriptionAvailable: true,
    subscriptionDiscount: 15,
  },
  {
    id: '8',
    name: 'Iron Complex',
    slug: 'iron',
    tagline: 'Gentle iron for energy and vitality',
    description: 'Non-constipating iron with vitamin C for optimal absorption.',
    longDescription: 'Our gentle iron formula uses ferrous bisglycinate, which is easy on the stomach. Combined with vitamin C to enhance absorption and support energy production.',
    price: 21.99,
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&h=800&fit=crop',
    images: ['https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&h=800&fit=crop'],
    category: 'energy',
    productType: 'supplements',
    dietaryTags: ['vegan', 'gluten-free', 'pregnancy-safe', 'postpartum-safe'],
    benefits: [
      'Supports healthy energy levels',
      'Gentle on the stomach',
      'Enhanced with vitamin C',
      'Non-constipating formula'
    ],
    ingredients: [
      { name: 'Iron Bisglycinate', amount: '28mg', description: 'Elemental iron' },
      { name: 'Vitamin C', amount: '60mg', description: 'For absorption' }
    ],
    dosage: 'Take 1 capsule daily with food',
    servingSize: '1 capsule',
    servingsPerContainer: 60,
    inStock: true,
    featured: false,
    scientificBacking: 'Bisglycinate chelate shows reduced GI side effects vs. other iron forms.',
    subscriptionAvailable: true,
    subscriptionDiscount: 15,
  },
  {
    id: '9',
    name: 'Probiotic 50 Billion',
    slug: 'probiotic',
    tagline: 'Digestive and immune health support',
    description: '10 probiotic strains to balance your gut microbiome.',
    longDescription: 'Our probiotic formula contains 50 billion CFU from 10 clinically-studied strains. Supports digestive health, immune function, and overall wellness.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&h=800&fit=crop',
    images: ['https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&h=800&fit=crop'],
    category: 'focus',
    productType: 'supplements',
    dietaryTags: ['gluten-free', 'sugar-free', 'pregnancy-safe'],
    benefits: [
      'Supports digestive health',
      'Promotes immune function',
      'Balances gut microbiome',
      'Shelf-stable formula'
    ],
    ingredients: [
      { name: 'Probiotic Blend', amount: '50 Billion CFU', description: '10 clinically-studied strains' }
    ],
    dosage: 'Take 1 capsule daily on an empty stomach',
    servingSize: '1 capsule',
    servingsPerContainer: 30,
    inStock: true,
    featured: false,
    scientificBacking: 'Multi-strain probiotics show benefits for gut and immune health.',
    subscriptionAvailable: true,
    subscriptionDiscount: 15,
  },
  {
    id: '10',
    name: 'Collagen Peptides',
    slug: 'collagen',
    tagline: 'Beauty and joint support from within',
    description: 'Grass-fed collagen for skin, hair, nails, and joints.',
    longDescription: 'Our hydrolyzed collagen peptides are sourced from grass-fed, pasture-raised cattle. Supports skin elasticity, joint comfort, and healthy aging.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&h=800&fit=crop',
    images: ['https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&h=800&fit=crop'],
    category: 'recovery',
    productType: 'supplements',
    dietaryTags: ['gluten-free', 'sugar-free'],
    benefits: [
      'Supports skin elasticity and hydration',
      'Promotes healthy hair and nails',
      'Supports joint comfort',
      'Grass-fed and pasture-raised'
    ],
    ingredients: [
      { name: 'Collagen Peptides', amount: '10,000mg', description: 'Type I & III collagen' }
    ],
    dosage: 'Mix 1 scoop in coffee, smoothie, or water',
    servingSize: '1 scoop (10g)',
    servingsPerContainer: 30,
    inStock: true,
    featured: false,
    scientificBacking: 'Studies show collagen peptides improve skin hydration and joint health.',
    subscriptionAvailable: true,
    subscriptionDiscount: 15,
  },
  {
    id: '11',
    name: "Lion's Mane Mushroom",
    slug: 'lions-mane',
    tagline: 'Cognitive enhancement from nature',
    description: 'Premium mushroom extract for focus, memory, and mental clarity.',
    longDescription: 'Organic Lion\'s Mane extract supports neurogenesis and cognitive function. Used for centuries in traditional medicine for brain health.',
    price: 34.99,
    originalPrice: 44.99,
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&h=800&fit=crop',
    images: ['https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&h=800&fit=crop'],
    category: 'focus',
    productType: 'supplements',
    dietaryTags: ['vegan', 'gluten-free', 'sugar-free'],
    benefits: [
      'Supports cognitive function',
      'Promotes nerve growth factor',
      'Enhances memory and focus',
      'Neuroprotective properties'
    ],
    ingredients: [
      { name: 'Organic Lion\'s Mane Extract', amount: '500mg', description: '30% polysaccharides' }
    ],
    dosage: 'Take 2 capsules daily with food',
    servingSize: '2 capsules',
    servingsPerContainer: 30,
    inStock: true,
    featured: true,
    scientificBacking: 'Research shows cognitive benefits and neuroprotective effects.',
    subscriptionAvailable: true,
    subscriptionDiscount: 15,
  },
  {
    id: '12',
    name: 'B-Complex Plus',
    slug: 'b-complex',
    tagline: 'Energy and metabolism support',
    description: 'Complete B-vitamin complex for energy production and vitality.',
    longDescription: 'Our B-Complex provides all eight essential B vitamins in their active, bioavailable forms. Supports energy metabolism, nervous system health, and cellular function.',
    price: 23.99,
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&h=800&fit=crop',
    images: ['https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&h=800&fit=crop'],
    category: 'energy',
    productType: 'supplements',
    dietaryTags: ['vegan', 'gluten-free', 'sugar-free'],
    benefits: [
      'Supports energy production',
      'Promotes nervous system health',
      'Active, bioavailable forms',
      'Aids stress response'
    ],
    ingredients: [
      { name: 'B1 (Thiamine)', amount: '100mg', description: 'As thiamine HCl' },
      { name: 'B2 (Riboflavin)', amount: '100mg', description: 'Active form' },
      { name: 'B12 (Methylcobalamin)', amount: '1000mcg', description: 'Methylated form' }
    ],
    dosage: 'Take 1 capsule daily with food',
    servingSize: '1 capsule',
    servingsPerContainer: 60,
    inStock: true,
    featured: false,
    scientificBacking: 'B vitamins are essential for cellular energy production.',
    subscriptionAvailable: true,
    subscriptionDiscount: 15,
  },
  {
    id: '13',
    name: 'Biotin Hair & Nails',
    slug: 'biotin',
    tagline: 'Strengthen hair, skin, and nails',
    description: 'High-potency biotin for healthy hair growth and nail strength.',
    longDescription: 'Our biotin supplement provides 10,000mcg per capsule to support keratin production. Promotes healthy hair growth, strong nails, and radiant skin.',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1612969308146-066d55f37ccf?w=800&h=800&fit=crop',
    images: ['https://images.unsplash.com/photo-1612969308146-066d55f37ccf?w=800&h=800&fit=crop'],
    category: 'focus',
    productType: 'supplements',
    dietaryTags: ['vegan', 'gluten-free', 'sugar-free'],
    benefits: [
      'Promotes healthy hair growth',
      'Strengthens nails',
      'Supports radiant skin',
      'High-potency formula'
    ],
    ingredients: [
      { name: 'Biotin', amount: '10,000mcg', description: 'Vitamin B7' }
    ],
    dosage: 'Take 1 capsule daily',
    servingSize: '1 capsule',
    servingsPerContainer: 120,
    inStock: true,
    featured: false,
    scientificBacking: 'Biotin supports keratin infrastructure for hair and nails.',
    subscriptionAvailable: true,
    subscriptionDiscount: 15,
  },
  {
    id: '14',
    name: 'Melatonin Sleep Support',
    slug: 'melatonin',
    tagline: 'Natural sleep aid for restful nights',
    description: 'Gentle melatonin to help you fall asleep and wake refreshed.',
    longDescription: 'Our melatonin formula supports natural sleep cycles without morning grogginess. Perfect for occasional sleeplessness and jet lag.',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop',
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop'],
    category: 'sleep',
    productType: 'supplements',
    dietaryTags: ['vegan', 'gluten-free', 'sugar-free'],
    benefits: [
      'Helps you fall asleep faster',
      'Supports sleep-wake cycles',
      'Non-habit forming',
      'No morning grogginess'
    ],
    ingredients: [
      { name: 'Melatonin', amount: '3mg', description: 'Sleep hormone' },
      { name: 'L-Theanine', amount: '100mg', description: 'Calming amino acid' }
    ],
    dosage: 'Take 1 capsule 30 minutes before bed',
    servingSize: '1 capsule',
    servingsPerContainer: 60,
    inStock: true,
    featured: true,
    scientificBacking: 'Clinically proven to reduce sleep onset time.',
    subscriptionAvailable: true,
    subscriptionDiscount: 15,
  },

  // SPORTS
  {
    id: '15',
    name: 'Creatine Monohydrate',
    slug: 'creatine',
    tagline: 'Power your performance',
    description: 'Pure creatine monohydrate for strength, power, and recovery.',
    longDescription: 'Pharmaceutical-grade creatine monohydrate. The most researched supplement for athletic performance. Unflavored and easy to mix.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&h=800&fit=crop',
    images: ['https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&h=800&fit=crop'],
    category: 'recovery',
    productType: 'sports',
    dietaryTags: ['vegan', 'gluten-free', 'sugar-free'],
    benefits: [
      'Increases strength and power',
      'Supports muscle growth',
      'Enhances performance',
      'Pharmaceutical-grade purity'
    ],
    ingredients: [
      { name: 'Creatine Monohydrate', amount: '5000mg', description: '99.9% pure' }
    ],
    dosage: 'Mix 1 scoop (5g) with water daily',
    servingSize: '1 scoop (5g)',
    servingsPerContainer: 60,
    inStock: true,
    featured: true,
    scientificBacking: 'The most extensively researched supplement for performance.',
    subscriptionAvailable: true,
    subscriptionDiscount: 15,
  },

  // SPECIALTIES
  {
    id: '16',
    name: 'Adaptogen Mushroom Blend',
    slug: 'mushroom-blend',
    tagline: 'Seven mushrooms for total wellness',
    description: 'Powerful blend of adaptogenic mushrooms for immunity and vitality.',
    longDescription: 'Our specialty mushroom powder combines seven organic mushrooms: Lion\'s Mane, Reishi, Cordyceps, Chaga, Turkey Tail, Maitake, and Shiitake. Supports immunity, energy, and overall wellness.',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&h=800&fit=crop',
    images: ['https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&h=800&fit=crop'],
    category: 'focus',
    productType: 'specialties',
    dietaryTags: ['vegan', 'gluten-free', 'sugar-free'],
    benefits: [
      'Comprehensive immune support',
      'Adaptogenic stress response',
      'Energy and vitality',
      'Seven organic mushrooms'
    ],
    ingredients: [
      { name: 'Mushroom Blend', amount: '2000mg', description: '7 organic mushroom extracts' }
    ],
    dosage: 'Mix 1 scoop in coffee, tea, or smoothie',
    servingSize: '1 scoop (2g)',
    servingsPerContainer: 30,
    inStock: true,
    featured: false,
    scientificBacking: 'Traditional use and modern research support mushroom health benefits.',
    subscriptionAvailable: true,
    subscriptionDiscount: 15,
  },
];

export const getProductBySlug = (slug: string): ExtendedProduct | undefined => {
  return products.find(p => p.slug === slug);
};

export const getProductsByCategory = (category: ProductCategory): ExtendedProduct[] => {
  return products.filter(p => p.category === category);
};

export const getProductsByType = (type: ProductType): ExtendedProduct[] => {
  return products.filter(p => p.productType === type);
};

export const getProductsByDietaryTag = (tag: DietaryTag): ExtendedProduct[] => {
  return products.filter(p => p.dietaryTags.includes(tag));
};

export const getFeaturedProducts = (): ExtendedProduct[] => {
  return products.filter(p => p.featured);
};

export const getAllProductTypes = (): ProductType[] => {
  return ['supplements', 'sports', 'specialties'];
};

export const getAllDietaryTags = (): DietaryTag[] => {
  return ['vegan', 'gluten-free', 'sugar-free', 'pregnancy-safe', 'postpartum-safe'];
};
