import { Expert, FAQ } from '@/types';

export const TRUST_BAR = ['Every Dose Clearly Labeled', 'Free US Shipping', 'Evidence-Graded Guides', '90-Day Guarantee', 'Cancel Anytime'];

export const IMAGES = {
  // Sports lifestyle (Unsplash License, free): sprinter by Jorge Alberto Vega Barrera; runner by Sherise Van Dyk.
  sport: 'https://images.unsplash.com/photo-1744060204728-f68e434a3edf?w=1200&q=80&fit=crop',
  run: 'https://images.unsplash.com/photo-1560073742-bc295f81c3c0?w=1200&q=80&fit=crop',
  // More sports photos, Unsplash License: Alora Griffiths (woman training), Ryan Fleischer (winter run), Sage Friedman (trail run).
  // Owner (18 Nov): fit, energetic people only, never tired, resting or unflattering shots.
  womanTrain: 'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?w=1200&q=80&fit=crop',
  womanRun: 'https://images.unsplash.com/photo-1765250251997-daf44e3c0268?w=1200&q=80&fit=crop',
  trailRun: 'https://images.unsplash.com/photo-1522040942177-269680274214?w=1200&q=80&fit=crop',
  hero: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=1920&q=80&fit=crop',
  approach: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200&q=80&fit=crop',
  nutrition: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80&fit=crop',
  savings: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80&fit=crop',
  support: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&fit=crop',
  results: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&fit=crop',
  // Sports people, women and men (all Unsplash License, see above).
  community: [
    'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?w=600&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1560073742-bc295f81c3c0?w=600&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1765250251997-daf44e3c0268?w=600&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1744060204728-f68e434a3edf?w=600&h=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1522040942177-269680274214?w=600&h=600&q=80&fit=crop',
  ],
};



export const GENERAL_FAQS: FAQ[] = [
  { q: 'Why should I trust Noovit with my health?', a: 'Every ingredient and amount is printed on the label, with no proprietary blends. Our guides grade the evidence honestly, including studies that found no effect. We publish quality documents on product pages as we receive them.' },
  { q: 'Do you offer a money-back guarantee?', a: 'Yes. You have 90 days to try any product. If it is not for you, we will refund you in full.' },
  { q: 'Where are your products made?', a: 'By our contract manufacturing partner. We will list the facility certifications and batch test results on each product page as soon as we have the paperwork.' },
  { q: 'When will my order ship?', a: 'Orders usually ship within 1–2 business days, and delivery takes 2–5 business days after dispatch.' },
  { q: 'How do I track my order?', a: 'You will receive a tracking link by email as soon as your order ships.' },
  { q: 'Can I change or cancel my subscription?', a: 'Yes — anytime from My Account, with no fees. You can also skip the next order or pause there.' },
  { q: 'How can I contact customer service?', a: 'Use our contact form or email us. We reply within one business day.' },
];

export const SUBSCRIPTION_PERKS = [
  { title: 'Never Run Out', text: 'Your next supply arrives automatically, every 30, 60 or 90 days.', image: IMAGES.nutrition },
  { title: 'Save on Every Delivery', text: 'Subscriber pricing on every order, with free shipping.', image: IMAGES.savings },
  { title: 'Full Control', text: 'Skip, change or cancel online anytime. No fees, no phone calls.', image: IMAGES.support },
  { title: 'Better Results', text: 'Consistency is what makes supplements work. We make it automatic.', image: IMAGES.results },
];

const u = (id: string, w = 1200, h?: number) => `https://images.unsplash.com/${id}?w=${w}${h ? `&h=${h}` : ''}&q=80&fit=crop`;

// Owner-supplied photos (20 Nov), web-sized in public/images/women and public/images/pets, named as the owner named them.
export const WOMEN_IMAGES = {
  hub: '/images/women/womens-health-friend-circle.jpg',
  banner: '/images/women/best-supplements-for-women.jpg',
  strength: '/images/women/creatine-for-her-scene.jpg', // Gemini scene with the real Creatine for Her label (20 Nov)
  sleep: '/images/women/magnesium-glycinate-for-women.jpg',
  calm: '/images/women/ashwagandha-for-women.jpg',
  midlife: '/images/women/menopause.jpg',
  energy: '/images/women/womens-health-supplements.jpg',
};

// Men's Health (owner's photos, 20 Nov; file names are the owner's). The tub, jar and bottle in three of them carry our
// Creatine for Men / Magnesium for Men labels (wrapped onto the photo; masters in design/men-2026-11/).
export const MEN_IMAGES = {
  hub: '/images/men/best-supplements-for-men.jpg', // rowing class
  banner: '/images/men/creatine-for-men.jpg', // dumbbell curl
  creatine: '/images/men/best-creatine-for-men.jpg', // holding Creatine for Men
  magnesium: '/images/men/mens-supplements.jpg', // pouring Magnesium for Men
  magnesiumJar: '/images/men/best-magnesium-glycinate-supplement-for-men.jpg', // Magnesium for Men in mid-air
  runners: '/images/men/mens-health-test-and-supplements.jpg', // two men running on a track
  bike: '/images/men/magnesium-glycinate-for-men-over-50.jpg', // indoor cycling
  run: '/images/men/noovit-mens-health.jpg', // city run
  community: '/images/men/noovit-community.jpg', // laughing, lacing shoes
};

export const PET_IMAGES = {
  hero: '/images/pets/pet-health-at-home-test-kits.jpg',
  teaser: '/images/pets/pets-at-home-health-tests.jpg',
  urine: '/images/pets/pets-urine-test-strips.jpg',
  dna: '/images/pets/dog-health-test.jpg',
  supplements: '/images/pets/best-pets-supplements.jpg',
  care: '/images/pets/pet-care-shar-pei.jpg',
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


// Real, consenting advisors only (name, credentials, photo).
// While empty, the panels show labelled placeholders (data/placeholders.ts) if Settings allows, else hide.
// The first advisor is the lead reviewer: their name appears on every guide, Journal post and product research panel
// listed in REVIEW_LOG, with the date they reviewed it, and links to their profile (/experts/<slug>).
export const ADVISORS: Expert[] = [];

// What the lead reviewer has actually reviewed, and when (YYYY-MM-DD). Only listed pages say "Reviewed by".
// Keys: 'guide:<guide slug>' (also shown on the matching product pages) and 'blog:<post slug>'.
export const REVIEW_LOG: Record<string, string> = {};
export const VETS: Expert[] = [];

export const PET_FAQS: FAQ[] = [
  { q: 'How are Noovit Pets products dosed?', a: 'By body weight, with the amount for your pet printed on the label. Check with your vet before starting a supplement.' },
  { q: 'How long should we try it?', a: 'Give a supplement several weeks of daily use. If you have any concern about your pet, talk to your vet.' },
  { q: 'Can I give human supplements to my pet?', a: 'No — some human ingredients (like xylitol) are dangerous for pets, and doses differ. Use formulas made for pets.' },
  { q: 'What if my pet won’t eat it?', a: 'Our 90-day guarantee covers picky eaters too. Contact us for a full refund.' },
  { q: 'Can I add pet products to my existing subscription?', a: 'Yes — one cart, one checkout, one subscription for the whole family.' },
];

export const PAYMENT_METHODS = ['Visa', 'Mastercard', 'Amex', 'Apple Pay', 'Google Pay']; // what Stripe Checkout shows (no PayPal / Shop Pay)
