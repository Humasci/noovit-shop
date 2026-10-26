import { Expert, FAQ, Review } from '@/types';

export const TRUST_BAR = ['Clean Ingredients', 'Five Star Reviews', 'Science-Driven', '90-Day Guarantee', 'Nutritionist Approved'];

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

// PLACEHOLDER: replace with real customer reviews before launch — publishing invented reviews is illegal (FTC 16 CFR 465).
export const REVIEWS: Review[] = [
  { id: 'r1', name: 'Hannah W.', productSlug: 'magnesium-complex', rating: 5, title: 'Sleeping through the night again', body: 'I take two after dinner and I am out within the hour. Waking up far less groggy than before.', date: '2026-09-14' },
  { id: 'r2', name: 'Marcus T.', productSlug: 'creatine', rating: 5, title: 'Clean and mixes instantly', body: 'No grit, no taste, no fillers. Lifts have gone up steadily over two months.', date: '2026-09-02' },
  { id: 'r3', name: 'Priya S.', productSlug: 'probiotic-complex', rating: 5, title: 'Bloating finally under control', body: 'Within two weeks my stomach felt calmer. I have tried a lot of probiotics and this is the one I am sticking with.', date: '2026-08-27' },
  { id: 'r4', name: 'Claire D.', productSlug: 'menopause-complex', rating: 5, title: 'Fewer night sweats', body: 'Noticeably fewer hot flushes after the first month and my mood feels steadier.', date: '2026-08-19' },
  { id: 'r5', name: 'James R.', productSlug: 'glucosamine-complex', rating: 5, title: 'Back to running', body: 'Knees feel much better on long runs. Easy subscription too.', date: '2026-08-08' },
  { id: 'r6', name: 'Sofia L.', productSlug: 'marine-collagen-complex', rating: 5, title: 'Nails stopped breaking', body: 'My nails are stronger and my skin looks more hydrated. Capsules are small and easy to take.', date: '2026-07-30' },
];

// PLACEHOLDER: replace with your actual advisory panel (names, credentials, consent to be featured).
export const EXPERTS: Expert[] = [
  { name: 'Advisor Name', credentials: 'Registered Nutritionist, MSc', quote: 'Simple, well-dosed formulas you can actually stick to.' },
  { name: 'Advisor Name', credentials: 'Registered Dietitian', quote: 'Clear labels and forms the body can absorb.' },
  { name: 'Advisor Name', credentials: 'Sports Nutritionist', quote: 'Single-ingredient creatine done properly.' },
  { name: 'Advisor Name', credentials: "Women's Health Nutritionist", quote: 'Thoughtful support for every life stage.' },
  { name: 'Advisor Name', credentials: 'Clinical Nutritionist, PhD', quote: 'Evidence first, marketing second.' },
];

export const GENERAL_FAQS: FAQ[] = [
  { q: 'Why should I trust Noovit with my health?', a: 'Every formula is designed with qualified nutritionists, made in GMP-certified facilities, and third-party tested for purity and potency.' },
  { q: 'Do you offer a money-back guarantee?', a: 'Yes. You have 90 days to try any product. If it is not for you, we will refund you in full.' },
  { q: 'Where are your products made?', a: 'In GMP-certified facilities in the United States.' },
  { q: 'When will my order ship?', a: 'Orders placed before 2pm on business days ship the same day. Delivery usually takes 2–5 business days.' },
  { q: 'How do I track my order?', a: 'You will receive a tracking link by email as soon as your order ships.' },
  { q: 'Can I change or cancel my subscription?', a: 'Yes — anytime from My Subscriptions, with no fees. Prefer to pause? Contact us and we will pause it for you.' },
  { q: 'How can I contact customer service?', a: 'Email hello@noovit.com or use our contact form. We reply within one business day.' },
];

export const SUBSCRIPTION_PERKS = [
  { title: 'Nutritionist Access', text: 'Message our nutrition team any time for advice on your routine.', image: IMAGES.nutrition },
  { title: 'Save Every Month', text: 'Up to 33% off every delivery, with free shipping.', image: IMAGES.savings },
  { title: 'Priority Support', text: 'Subscribers jump the queue for help with orders and changes.', image: IMAGES.support },
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

// PLACEHOLDER: replace with real customer reviews before launch.
export const PET_REVIEWS: Review[] = [
  { id: 'p1', name: 'Emma & Biscuit', productSlug: 'dog-probiotic-chews', rating: 5, title: 'No more upset tummy', body: 'Biscuit has a sensitive stomach and these sorted him out within a week. He thinks they are treats.', date: '2026-09-20' },
  { id: 'p2', name: 'Dan & Luna', productSlug: 'dog-hip-joint-chews', rating: 5, title: 'Our 11-year-old is bouncing again', body: 'Luna is taking the stairs again and is keen on longer walks. Huge difference.', date: '2026-09-11' },
  { id: 'p3', name: 'Rachel & Miso', productSlug: 'cat-probiotic-powder', rating: 5, title: 'Even my picky cat eats it', body: 'Unflavoured, so Miso does not notice it in her food. Litter box is much better.', date: '2026-08-30' },
  { id: 'p4', name: 'Tom & Archie', productSlug: 'dog-calming-chews', rating: 5, title: 'Fireworks night was calm', body: 'Gave two an hour before and Archie actually slept through it.', date: '2026-08-12' },
];

// PLACEHOLDER: replace with your real veterinary advisors.
export const VETS: Expert[] = [
  { name: 'Vet Advisor Name', credentials: 'DVM, Small Animal Practice', quote: 'Simple formulas at sensible doses, sized by weight.' },
  { name: 'Vet Advisor Name', credentials: 'DVM, Veterinary Nutritionist', quote: 'Ingredients chosen for pets, not borrowed from human products.' },
  { name: 'Vet Advisor Name', credentials: 'DVM, Feline Medicine', quote: 'Cats need their own formulas — and something they will actually eat.' },
];

export const PET_FAQS: FAQ[] = [
  { q: 'Are Noovit Pets products vet formulated?', a: 'Yes. Every pet formula is developed with veterinarians and dosed by body weight.' },
  { q: 'How long until I see results?', a: 'Most pet parents notice a difference in 2–4 weeks with daily use. Joint and coat support can take 6–8 weeks.' },
  { q: 'Can I give human supplements to my pet?', a: 'No — some human ingredients (like xylitol) are dangerous for pets, and doses differ. Use formulas made for pets.' },
  { q: 'What if my pet won’t eat it?', a: 'Our 90-day guarantee covers picky eaters too. Contact us for a full refund.' },
  { q: 'Can I add pet products to my existing subscription?', a: 'Yes — one cart, one checkout, one subscription for the whole family.' },
];

export const PAYMENT_METHODS =['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay', 'Google Pay', 'Shop Pay'];
