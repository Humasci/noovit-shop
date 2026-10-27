import { Expert, FAQ } from '@/types';

export const TRUST_BAR = ['Clean Ingredients', 'Free US Shipping', 'Science-Driven', '90-Day Guarantee', 'Cancel Anytime'];

export const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=1920&q=80&fit=crop',
  approach: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200&q=80&fit=crop',
  nutrition: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80&fit=crop',
  savings: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80&fit=crop',
  support: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&fit=crop',
  results: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&fit=crop',
  community: [
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=900&q=80&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=900&q=80&fit=crop',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=900&q=80&fit=crop',
    'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&h=900&q=80&fit=crop',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=900&q=80&fit=crop',
  ],
};



export const GENERAL_FAQS: FAQ[] = [
  { q: 'Why should I trust Noovit with my health?', a: 'Every formula uses ingredient forms and doses from published research, is made in GMP-certified facilities, and is third-party tested for purity and potency.' },
  { q: 'Do you offer a money-back guarantee?', a: 'Yes. You have 90 days to try any product. If it is not for you, we will refund you in full.' },
  { q: 'Where are your products made?', a: 'In GMP-certified facilities in the United States.' },
  { q: 'When will my order ship?', a: 'Orders usually ship within 1–2 business days, and delivery takes 2–5 business days after dispatch.' },
  { q: 'How do I track my order?', a: 'You will receive a tracking link by email as soon as your order ships.' },
  { q: 'Can I change or cancel my subscription?', a: 'Yes — anytime from My Subscriptions, with no fees. Prefer to pause? Contact us and we will pause it for you.' },
  { q: 'How can I contact customer service?', a: 'Use our contact form or email us. We reply within one business day.' },
];

export const SUBSCRIPTION_PERKS = [
  { title: 'Never Run Out', text: 'Your next supply arrives automatically, every 30, 60 or 90 days.', image: IMAGES.nutrition },
  { title: 'Save on Every Delivery', text: 'Subscriber pricing on every order, with free shipping.', image: IMAGES.savings },
  { title: 'Full Control', text: 'Skip, change or cancel online anytime. No fees, no phone calls.', image: IMAGES.support },
  { title: 'Better Results', text: 'Consistency is what makes supplements work. We make it automatic.', image: IMAGES.results },
];

const u = (id: string, w = 1200, h?: number) => `https://images.unsplash.com/${id}?w=${w}${h ? `&h=${h}` : ''}&q=80&fit=crop`;

export const PET_IMAGES = {
  hero: u('photo-1450778869180-41d0601e046e', 1920),
  dog: u('photo-1543466835-00a7907e9de1', 900),
  cat: u('photo-1514888286974-6c03e2ca1dba', 900),
  community: [
    u('photo-1548199973-03cce0bbc87b', 600, 900),
    u('photo-1574158622682-e40e69881006', 600, 900),
    u('photo-1583511655857-d19b40a7a54e', 600, 900),
    u('photo-1592194996308-7b43878e84a6', 600, 900),
    u('photo-1517849845537-4d257902454a', 600, 900),
  ],
};


// Real, consenting veterinary advisors only. Empty hides the panel.
export const VETS: Expert[] = [];

export const PET_FAQS: FAQ[] = [
  { q: 'Are Noovit Pets products vet formulated?', a: 'Yes. Every pet formula is developed with veterinarians and dosed by body weight.' },
  { q: 'How long until I see results?', a: 'Most pet parents notice a difference in 2–4 weeks with daily use. Joint and coat support can take 6–8 weeks.' },
  { q: 'Can I give human supplements to my pet?', a: 'No — some human ingredients (like xylitol) are dangerous for pets, and doses differ. Use formulas made for pets.' },
  { q: 'What if my pet won’t eat it?', a: 'Our 90-day guarantee covers picky eaters too. Contact us for a full refund.' },
  { q: 'Can I add pet products to my existing subscription?', a: 'Yes — one cart, one checkout, one subscription for the whole family.' },
];

export const PAYMENT_METHODS =['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay', 'Google Pay', 'Shop Pay'];
