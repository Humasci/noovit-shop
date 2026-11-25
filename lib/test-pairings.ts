// Tests <-> supplements (owner, 21 Nov: "correlate and link supplements, and combine them with tests").
// Each kit lists the supplements people commonly look at alongside that marker. Copy rule: a test result is a
// snapshot, never a diagnosis, and we never say a supplement fixes a result or treats a condition. Out-of-range results
// and medication users go to a doctor first. Only active products show (hidden ones appear when they go live).
// Deliberately no pairing: cholesterol and hs-CRP (would read as drug or disease claims, 21 Nov audit), thyroid (ashwagandha can raise thyroid hormones), kidney and liver (safety first), A1c,
// AMH, PSA, and the STI test (sensitive: no cross-selling on that page or from it).
export const KIT_SUPPLEMENTS: Record<string, string[]> = {
  'vitamin-d-test': ['vitamin-d3-k2'],
  'iron-test': ['magnesium-complex', 'iron-complex', 'vitamin-d3-k2', 'multivitamin'], // magnesium is on this panel; iron etc. show once live
  'b12-test': ['multivitamin'],
  'womens-health-test': ['magnesium-complex', 'creatine-for-women', 'iron-complex', 'vitamin-d3-k2', 'multivitamin'],
  'perimenopause-test': ['menopause-complex', 'magnesium-complex'],
  'cortisol-test': ['ashwagandha', 'magnesium-complex', 'l-theanine', 'sleep-calm-stack'],
  'testosterone-test': ['creatine-for-men', 'magnesium-for-men', 'zinc'],
};

// Why the pairing makes sense, in plain words (shown on the kit page).
export const KIT_PAIR_NOTE: Record<string, string> = {
  'vitamin-d-test': 'Know your level before you supplement, then retest after about 3 months to see where you are.',
  'iron-test': 'Iron is one supplement you shouldn’t take on a guess: too much can be harmful, so if your ferritin is low, decide on iron with your doctor. The panel also measures magnesium, vitamin D and B12, so you can choose only what you need.',
  'b12-test': 'Low B12 is more common with age, plant-based diets and some medicines. A result helps you decide whether a supplement is worth it.',
  'womens-health-test': 'See your iron, vitamin D and B12 first, then choose only what you need.',
  'perimenopause-test': 'Hormones swing in perimenopause, so a result is a snapshot. Many women look at these alongside it.',
  'cortisol-test': 'Curious how stress shows up in your body? These are the supplements people most often pair with a cortisol check.',
  'testosterone-test': 'Training, sleep and minerals all play a part. These are the products men most often pair with a hormone check.',
};

export const supplementsForKit = (kit: string) => KIT_SUPPLEMENTS[kit] ?? [];
// Kits that pair with a product (or with any part of a stack).
export const kitsForProduct = (slug: string, parts: string[] = []) =>
  Object.entries(KIT_SUPPLEMENTS).filter(([, s]) => s.includes(slug) || parts.some((p) => s.includes(p))).map(([k]) => k);
