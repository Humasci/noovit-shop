import { Product, ProductCategory } from '@/types';

export const products: Product[] = [
  {
    id: '1',
    name: "Lion's Mane Capsules",
    slug: 'lions-mane-capsules',
    tagline: 'Enhance focus and mental clarity naturally',
    description: 'Premium Lion\'s Mane mushroom extract to support cognitive function, memory, and focus.',
    longDescription: 'Our Lion\'s Mane capsules contain organic mushroom extract standardized to contain powerful nootropic compounds. Used for centuries in traditional medicine, Lion\'s Mane supports neurogenesis, enhances cognitive performance, and promotes mental clarity without any jitters or crashes.',
    price: 34.99,
    originalPrice: 44.99,
    image: '/products/lions-mane.jpg',
    images: ['/products/lions-mane.jpg', '/products/lions-mane-2.jpg', '/products/lions-mane-3.jpg'],
    category: 'focus',
    benefits: [
      'Supports cognitive function and mental clarity',
      'Promotes nerve growth factor production',
      'Enhances memory and concentration',
      'Natural neuroprotective properties',
      'May reduce brain fog and mental fatigue'
    ],
    ingredients: [
      {
        name: 'Organic Lion\'s Mane Extract',
        amount: '500mg',
        description: 'Standardized to 30% polysaccharides'
      },
      {
        name: 'Hericenones & Erinacines',
        amount: '150mg',
        description: 'Active nootropic compounds'
      }
    ],
    dosage: 'Take 2 capsules daily with food',
    servingSize: '2 capsules',
    servingsPerContainer: 30,
    inStock: true,
    featured: true,
    scientificBacking: 'Backed by research showing improved cognitive performance and neuroprotective benefits in multiple clinical studies.',
    subscriptionAvailable: true,
    subscriptionDiscount: 15,
  },
  {
    id: '2',
    name: 'Spirulina',
    slug: 'spirulina',
    tagline: 'Nutrient-dense superfood for daily vitality',
    description: 'Pure spirulina powder packed with protein, vitamins, and antioxidants to fuel your body.',
    longDescription: 'Our premium spirulina is sourced from pristine waters and contains one of nature\'s most complete nutrient profiles. Rich in plant-based protein, B vitamins, iron, and powerful antioxidants, spirulina supports energy production, immune function, and overall wellness.',
    price: 29.99,
    image: '/products/spirulina.jpg',
    images: ['/products/spirulina.jpg', '/products/spirulina-2.jpg'],
    category: 'nutrition',
    benefits: [
      'Complete plant-based protein source',
      'Rich in essential vitamins and minerals',
      'Powerful antioxidant and anti-inflammatory',
      'Supports immune system function',
      'Boosts energy and endurance naturally'
    ],
    ingredients: [
      {
        name: 'Organic Spirulina',
        amount: '3000mg per serving',
        description: '100% pure Arthrospira platensis'
      }
    ],
    dosage: 'Mix 1 teaspoon (3g) in water, smoothie, or juice',
    servingSize: '1 teaspoon (3g)',
    servingsPerContainer: 83,
    inStock: true,
    featured: true,
    scientificBacking: 'Research demonstrates spirulina\'s antioxidant properties and ability to support immune function and cardiovascular health.',
    subscriptionAvailable: true,
    subscriptionDiscount: 15,
  },
  {
    id: '3',
    name: 'Moringa',
    slug: 'moringa',
    tagline: 'Ancient superfood for modern wellness',
    description: 'Nutrient-rich moringa leaf powder to support energy, immunity, and overall health.',
    longDescription: 'Known as the "miracle tree," moringa is one of the most nutrient-dense plants on Earth. Our organic moringa powder contains vitamins A, C, and E, calcium, potassium, and protein. This ancient superfood supports inflammation response, provides sustained energy, and promotes overall vitality.',
    price: 27.99,
    image: '/products/moringa.jpg',
    images: ['/products/moringa.jpg', '/products/moringa-2.jpg'],
    category: 'nutrition',
    benefits: [
      'Exceptionally high in vitamins and minerals',
      'Supports healthy inflammatory response',
      'Provides natural, sustained energy',
      'Rich in antioxidants',
      'Supports healthy blood sugar levels'
    ],
    ingredients: [
      {
        name: 'Organic Moringa Leaf Powder',
        amount: '2000mg per serving',
        description: '100% pure Moringa oleifera leaves'
      }
    ],
    dosage: 'Mix 1 teaspoon in beverages or food',
    servingSize: '1 teaspoon (2g)',
    servingsPerContainer: 125,
    inStock: true,
    featured: false,
    scientificBacking: 'Studies show moringa\'s rich nutritional profile and potential to support metabolic health and reduce oxidative stress.',
    subscriptionAvailable: true,
    subscriptionDiscount: 15,
  },
  {
    id: '4',
    name: 'Melatonin',
    slug: 'melatonin',
    tagline: 'Natural sleep support for restful nights',
    description: 'Pure melatonin to help you fall asleep faster and wake up refreshed.',
    longDescription: 'Our melatonin supplement provides a gentle, natural way to support your sleep-wake cycle. Perfect for those dealing with occasional sleeplessness, jet lag, or irregular sleep schedules. Each serving delivers an optimal dose to help you fall asleep naturally without morning grogginess.',
    price: 19.99,
    image: '/products/melatonin.jpg',
    images: ['/products/melatonin.jpg', '/products/melatonin-2.jpg'],
    category: 'sleep',
    benefits: [
      'Helps you fall asleep faster',
      'Supports natural sleep-wake cycles',
      'Non-habit forming',
      'No morning grogginess',
      'Perfect for jet lag and shift work'
    ],
    ingredients: [
      {
        name: 'Melatonin',
        amount: '3mg',
        description: 'Natural sleep hormone'
      },
      {
        name: 'L-Theanine',
        amount: '100mg',
        description: 'Calming amino acid'
      }
    ],
    dosage: 'Take 1 capsule 30 minutes before bedtime',
    servingSize: '1 capsule',
    servingsPerContainer: 60,
    inStock: true,
    featured: true,
    scientificBacking: 'Clinically proven to reduce sleep onset time and improve sleep quality without dependency.',
    subscriptionAvailable: true,
    subscriptionDiscount: 15,
  },
  {
    id: '5',
    name: 'Creatine',
    slug: 'creatine',
    tagline: 'Fuel performance and accelerate recovery',
    description: 'Pure creatine monohydrate to enhance strength, power, and muscle recovery.',
    longDescription: 'Our pharmaceutical-grade creatine monohydrate is one of the most researched and effective supplements for athletic performance. It supports ATP production for explosive power, enhances muscle growth, and accelerates recovery. Unflavored and easy to mix, it\'s perfect for any fitness goal.',
    price: 24.99,
    image: '/products/creatine.jpg',
    images: ['/products/creatine.jpg', '/products/creatine-2.jpg'],
    category: 'recovery',
    benefits: [
      'Increases strength and power output',
      'Supports muscle growth and recovery',
      'Enhances high-intensity performance',
      'Supports cognitive function',
      'Pharmaceutical-grade purity'
    ],
    ingredients: [
      {
        name: 'Creatine Monohydrate',
        amount: '5000mg (5g)',
        description: '99.9% pure micronized creatine'
      }
    ],
    dosage: 'Mix 1 scoop (5g) with water or beverage daily',
    servingSize: '1 scoop (5g)',
    servingsPerContainer: 60,
    inStock: true,
    featured: true,
    scientificBacking: 'The most extensively researched supplement with hundreds of studies confirming its safety and effectiveness.',
    subscriptionAvailable: true,
    subscriptionDiscount: 15,
  },
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.slug === slug);
};

export const getProductsByCategory = (category: ProductCategory): Product[] => {
  return products.filter(p => p.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(p => p.featured);
};
