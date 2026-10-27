import { Expert, Review } from '@/types';

// Example trust content, shown only as a pre-launch guide (Settings → "Show placeholder trust content")
// and always labelled as a placeholder on the page. Never present these as real: publishing invented
// reviews or endorsements is illegal (FTC 16 CFR 465 and 255). Real reviews come from the admin
// (Reviews); real advisors go in data/content.ts (ADVISORS / VETS), with their consent.

// What to collect: first name + last initial, product, star rating, a specific outcome in their words,
// and whether they bought it (the "Verified Buyer" badge is only shown for matched orders).
export const PLACEHOLDER_REVIEWS: Review[] = [
  { id: 'r1', name: 'Hannah W.', productSlug: 'magnesium-complex', rating: 5, title: 'Sleeping through the night again', body: 'I take two after dinner and I am out within the hour. Waking up far less groggy than before.', date: '2026-09-14' },
  { id: 'r2', name: 'Marcus T.', productSlug: 'creatine', rating: 5, title: 'Clean and mixes instantly', body: 'No grit, no taste, no fillers. Lifts have gone up steadily over two months.', date: '2026-09-02' },
  { id: 'r3', name: 'Priya S.', productSlug: 'probiotic-complex', rating: 5, title: 'Bloating finally under control', body: 'Within two weeks my stomach felt calmer. I have tried a lot of probiotics and this is the one I am sticking with.', date: '2026-08-27' },
  { id: 'r4', name: 'Claire D.', productSlug: 'menopause-complex', rating: 5, title: 'Fewer night sweats', body: 'Noticeably fewer hot flushes after the first month and my mood feels steadier.', date: '2026-08-19' },
  { id: 'r5', name: 'James R.', productSlug: 'glucosamine-complex', rating: 5, title: 'Back to running', body: 'Knees feel much better on long runs. Easy subscription too.', date: '2026-08-08' },
  { id: 'r6', name: 'Sofia L.', productSlug: 'collagen-complex', rating: 5, title: 'Nails stopped breaking', body: 'My nails are stronger and my skin looks more hydrated. Capsules are small and easy to take.', date: '2026-07-30' },
];

// What to collect: full name, credential (RD, RDN, MSc, PhD), a short quote about a product or approach,
// a photo, written consent to be featured, and disclosure if they are paid.
export const PLACEHOLDER_EXPERTS: Expert[] = [
  { name: 'Advisor Name', credentials: 'Registered Nutritionist, MSc', quote: 'Simple, well-dosed formulas you can actually stick to.' },
  { name: 'Advisor Name', credentials: 'Registered Dietitian', quote: 'Clear labels and forms the body can absorb.' },
  { name: 'Advisor Name', credentials: 'Sports Nutritionist', quote: 'Single-ingredient creatine done properly.' },
  { name: 'Advisor Name', credentials: "Women's Health Nutritionist", quote: 'Thoughtful support for every life stage.' },
  { name: 'Advisor Name', credentials: 'Clinical Nutritionist, PhD', quote: 'Evidence first, marketing second.' },
];

export const PLACEHOLDER_PET_REVIEWS: Review[] = [
  { id: 'p1', name: 'Emma & Biscuit', productSlug: 'dog-probiotic-chews', rating: 5, title: 'No more upset tummy', body: 'Biscuit has a sensitive stomach and these sorted him out within a week. He thinks they are treats.', date: '2026-09-20' },
  { id: 'p2', name: 'Dan & Luna', productSlug: 'dog-hip-joint-chews', rating: 5, title: 'Our 11-year-old is bouncing again', body: 'Luna is taking the stairs again and is keen on longer walks. Huge difference.', date: '2026-09-11' },
  { id: 'p3', name: 'Rachel & Miso', productSlug: 'cat-probiotic-powder', rating: 5, title: 'Even my picky cat eats it', body: 'Unflavoured, so Miso does not notice it in her food. Litter box is much better.', date: '2026-08-30' },
  { id: 'p4', name: 'Tom & Archie', productSlug: 'dog-calming-chews', rating: 5, title: 'Fireworks night was calm', body: 'Gave two an hour before and Archie actually slept through it.', date: '2026-08-12' },
];

export const PLACEHOLDER_VETS: Expert[] = [
  { name: 'Vet Advisor Name', credentials: 'DVM, Small Animal Practice', quote: 'Simple formulas at sensible doses, sized by weight.' },
  { name: 'Vet Advisor Name', credentials: 'DVM, Veterinary Nutritionist', quote: 'Ingredients chosen for pets, not borrowed from human products.' },
  { name: 'Vet Advisor Name', credentials: 'DVM, Feline Medicine', quote: 'Cats need their own formulas — and something they will actually eat.' },
];
