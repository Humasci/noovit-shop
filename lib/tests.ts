// At-home test kits (owner, 20 Nov). Panels follow the published catalogues of the lab partners we're quoting:
// Choose Health (women's hormone panels), IHD Lab and Spot (iron/nutrient, thyroid, heart, cortisol), OmegaQuant
// (omega-3 index) and, for pets, CheckUp-style urine strips and DNA partners. Nothing is contracted yet, so every kit is
// "coming soon" with a waitlist, no price and no named lab. Copy: wellness screening, never diagnosis.
import { MEN_LIVE } from '@/lib/men';

export interface Marker { name: string; why: string; note: string }
export interface TestKit {
  slug: string;
  category: TestCategoryId;
  name: string;
  short: string;
  intro: string;
  markers: Marker[];
  collection: string;
  seoTitle: string;
  seoDescription: string;
  related?: { href: string; label: string }[];
  pets?: boolean;
  hidden?: boolean;
}
export type TestCategoryId = 'nutrients' | 'womens' | 'thyroid' | 'heart' | 'stress' | 'mens' | 'pets';

export const TEST_CATEGORIES: { id: TestCategoryId; name: string; line: string }[] = [
  { id: 'nutrients', name: 'Nutrients & energy', line: 'Iron stores, vitamin D, B12 and more.' },
  { id: 'womens', name: "Women's health", line: 'Hormones through perimenopause and beyond.' },
  { id: 'thyroid', name: 'Thyroid', line: 'The hormones behind energy and metabolism.' },
  { id: 'heart', name: 'Heart & metabolic', line: 'Cholesterol, blood sugar and inflammation.' },
  { id: 'stress', name: 'Stress', line: 'Cortisol and DHEA-S.' },
  { id: 'mens', name: "Men's health", line: 'Testosterone and related hormones.' },
  { id: 'pets', name: 'Pets', line: 'Simple checks for dogs and cats.' },
];

const m = (name: string, why: string, note: string): Marker => ({ name, why, note });

const KITS: TestKit[] = [
  {
    slug: 'iron-test',
    category: 'nutrients',
    name: 'Iron & Nutrient Check',
    short: 'Ferritin, iron, vitamin D, B12, folate and magnesium.',
    intro: 'Test first, then supplement. One finger-prick sample checks your iron stores and the nutrients most often low.',
    markers: [
      m('Ferritin', 'Your body’s iron stores. Low iron is common in women who menstruate.', 'Inflammation and infection can push ferritin up, so a normal result can hide low stores.'),
      m('Iron (serum)', 'The iron circulating in your blood right now.', 'Changes through the day and after meals; read it together with ferritin.'),
      m('Vitamin D (25-OH)', 'The standard measure of your vitamin D status.', 'Levels change with the seasons, so the time of year matters.'),
      m('Vitamin B12', 'Needed for healthy blood and nerves. Worth knowing on a plant-based diet or after 50.', 'A doctor may add other tests if results are borderline.'),
      m('Folate', 'Important for healthy cells, and before and during pregnancy.', 'Blood folate reflects recent intake more than long-term status.'),
      m('Magnesium (serum)', 'A quick check for clearly low blood magnesium.', 'Less than 1% of the body’s magnesium is in serum, so a normal result doesn’t rule out low stores.'),
    ],
    collection: 'Finger-prick sample at home',
    seoTitle: 'Iron Test at Home: Ferritin, Vitamin D & B12 | Noovit',
    seoDescription: 'An at-home finger-prick test for iron stores (ferritin), iron, vitamin D, B12, folate and magnesium is coming. What each marker shows and why test first.',
    related: [{ href: '/guides/magnesium', label: 'Magnesium guide' }, { href: '/womens-health#energy', label: "Women's Health: energy & iron" }],
  },
  {
    slug: 'perimenopause-test',
    category: 'womens',
    name: 'Perimenopause Check',
    short: 'FSH, LH, estradiol, progesterone and TSH.',
    intro: 'A snapshot of the hormones that shift through perimenopause, plus thyroid, which can cause similar changes.',
    markers: [
      m('FSH', 'Follicle-stimulating hormone; it tends to rise as the ovaries slow down.', 'It swings from month to month in perimenopause, so one result is a snapshot.'),
      m('LH', 'Luteinizing hormone, which works with FSH in the cycle.', 'Best read alongside FSH and where you are in your cycle.'),
      m('Estradiol', 'The main form of estrogen.', 'Levels rise and fall through the cycle and in perimenopause.'),
      m('Progesterone', 'Rises after ovulation; often falls earlier in perimenopause.', 'Timing in your cycle matters; the kit instructions explain when to test.'),
      m('TSH', 'Thyroid-stimulating hormone. Thyroid changes can mimic perimenopause.', 'An abnormal TSH needs follow-up with a doctor.'),
    ],
    collection: 'Finger-prick sample at home',
    seoTitle: 'Menopause & Perimenopause Test at Home (FSH) | Noovit',
    seoDescription: 'An at-home perimenopause hormone test (FSH, LH, estradiol, progesterone and TSH) is coming. What each hormone can and can’t tell you, and when to test.',
    related: [{ href: '/womens-health#midlife', label: "Women's Health: perimenopause & menopause" }],
  },
  {
    slug: 'womens-health-test',
    category: 'womens',
    name: "Women's Wellness Panel",
    short: 'Hormones plus vitamin D, cholesterol, hs-CRP and HbA1c.',
    intro: 'The Perimenopause Check plus the heart, metabolic and vitamin D markers worth knowing from your 40s.',
    markers: [
      m('FSH, LH, estradiol, progesterone', 'The hormones that change through perimenopause.', 'One result is a snapshot; patterns over time tell you more.'),
      m('TSH', 'Thyroid screening.', 'An abnormal TSH needs follow-up with a doctor.'),
      m('Vitamin D (25-OH)', 'Bone and muscle health.', 'Changes with the seasons.'),
      m('Cholesterol panel', 'Total, LDL and HDL cholesterol and triglycerides.', 'Heart risk rises after menopause, so a baseline helps.'),
      m('hs-CRP', 'A general marker of inflammation.', 'A recent cold or injury can raise it.'),
      m('HbA1c', 'Your average blood sugar over about three months.', 'Not a substitute for a diabetes diagnosis by a doctor.'),
    ],
    collection: 'Finger-prick sample at home',
    seoTitle: "Women's Health Test at Home: Hormones & More | Noovit",
    seoDescription: "An at-home women's wellness panel is coming: FSH, LH, estradiol, progesterone, TSH, vitamin D, cholesterol, hs-CRP and HbA1c from one finger-prick sample.",
    related: [{ href: '/womens-health', label: "Women's Health" }],
  },
  {
    slug: 'thyroid-test',
    category: 'thyroid',
    name: 'Thyroid Check',
    short: 'TSH, free T4, free T3 and TPO antibodies.',
    intro: 'The full thyroid picture: the signal from the brain, the hormones themselves, and antibodies.',
    markers: [
      m('TSH', 'The brain’s signal to the thyroid; the first-line screening test.', 'Out-of-range results need confirming with a doctor.'),
      m('Free T4', 'The main hormone the thyroid makes.', 'Read together with TSH.'),
      m('Free T3', 'The active form of thyroid hormone.', 'Some medicines and illness affect it.'),
      m('TPO antibodies', 'Antibodies against the thyroid.', 'Raised antibodies are a reason to talk to your doctor.'),
    ],
    collection: 'Finger-prick sample at home',
    seoTitle: 'Thyroid Test at Home: TSH, Free T4, Free T3 | Noovit',
    seoDescription: 'An at-home thyroid test (TSH, free T4, free T3 and TPO antibodies) is coming. What each marker shows and when to follow up with your doctor.',
  },
  {
    slug: 'cholesterol-test',
    category: 'heart',
    name: 'Heart & Metabolic Check',
    short: 'Cholesterol, ApoB, HbA1c and hs-CRP.',
    intro: 'Your cholesterol panel, ApoB, average blood sugar and inflammation, without a clinic visit.',
    markers: [
      m('Cholesterol panel', 'Total, LDL and HDL cholesterol and triglycerides.', 'Fasting may be recommended for triglycerides; the kit explains.'),
      m('ApoB', 'Counts the particles that carry cholesterol.', 'Increasingly used alongside LDL.'),
      m('HbA1c', 'Average blood sugar over about three months.', 'Not a diagnosis; talk to your doctor about raised results.'),
      m('hs-CRP', 'A general marker of inflammation.', 'A recent cold or injury can raise it.'),
    ],
    collection: 'Finger-prick sample at home',
    seoTitle: 'Cholesterol Test at Home: Lipids, ApoB & A1c | Noovit',
    seoDescription: 'An at-home heart and metabolic test is coming: cholesterol panel, ApoB, HbA1c and hs-CRP from one finger-prick sample. What each marker means.',
    related: [{ href: '/guides/coq10', label: 'CoQ10 guide' }],
  },
  {
    slug: 'cortisol-test',
    category: 'stress',
    name: 'Stress & Cortisol Check',
    short: 'Cortisol and DHEA-S.',
    intro: 'Cortisol, the main stress hormone, and DHEA-S, its counterbalance, from one morning sample.',
    markers: [
      m('Cortisol', 'The main stress hormone; it peaks in the morning and falls through the day.', 'Timing matters, so collect at the time the kit says. One sample is a snapshot.'),
      m('DHEA-S', 'An adrenal hormone often read alongside cortisol.', 'Falls naturally with age.'),
    ],
    collection: 'Finger-prick sample at home, in the morning',
    seoTitle: 'Cortisol Test at Home: Stress & Cortisol Check | Noovit',
    seoDescription: 'An at-home cortisol test (cortisol and DHEA-S) is coming. Why the time of day matters, what one sample can show, and when to talk to your doctor.',
    related: [{ href: '/guides/ashwagandha', label: 'Ashwagandha guide' }, { href: '/guides/magnesium', label: 'Magnesium guide' }],
  },
  {
    slug: 'vitamin-d-test',
    category: 'nutrients',
    name: 'Vitamin D Test',
    short: 'Vitamin D (25-OH) from a finger-prick sample.',
    intro: 'The standard measure of your vitamin D status, so you know whether to supplement and how much.',
    markers: [m('Vitamin D (25-OH)', 'The standard blood measure of vitamin D status.', 'Levels change with the seasons; retest at a similar time of year.')],
    collection: 'Finger-prick sample at home',
    seoTitle: 'Vitamin D Test at Home (25-OH) | Noovit',
    seoDescription: 'An at-home vitamin D test (25-OH) is coming. What your result means, why the season matters, and why test before you take vitamin D.',
    related: [{ href: '/at-home-tests/iron-test', label: 'Iron & Nutrient Check (includes vitamin D)' }],
  },
  {
    slug: 'a1c-test',
    category: 'heart',
    name: 'A1c Test Kit',
    short: 'HbA1c: your average blood sugar over about three months.',
    intro: 'HbA1c shows your average blood sugar over the past two to three months, from one finger-prick sample.',
    markers: [m('HbA1c', 'Average blood sugar over about three months.', 'A screen, not a diagnosis. Talk to your doctor about any raised result.')],
    collection: 'Finger-prick blood spot at home',
    seoTitle: 'A1c Test Kit: HbA1c Test at Home | Noovit',
    seoDescription: 'An at-home A1c test kit (HbA1c) is coming: your average blood sugar over about three months from one finger-prick sample. What it shows and its limits.',
    related: [{ href: '/at-home-tests/cholesterol-test', label: 'Heart & Metabolic Check (includes HbA1c)' }],
  },
  {
    slug: 'omega-3-test',
    category: 'nutrients',
    name: 'Omega-3 Index',
    short: 'EPA and DHA in your red blood cells.',
    intro: 'Measures the omega-3 fats (EPA and DHA) built into your red blood cells over recent months.',
    markers: [m('Omega-3 index', 'EPA + DHA as a share of the fats in red blood cell membranes.', 'Reflects the past few months of diet; the 8% target is a common reference from the test makers.')],
    collection: 'Finger-prick blood spot at home',
    seoTitle: 'Omega-3 Index Test at Home | Noovit',
    seoDescription: 'An at-home omega-3 index test is coming: EPA and DHA in your red blood cells from one finger-prick blood spot. What the result reflects and its limits.',
  },
  {
    slug: 'testosterone-test',
    category: 'mens',
    name: "Men's Health Check",
    short: 'Total and free testosterone, SHBG and estradiol.',
    intro: 'The main male hormones from one morning sample.',
    markers: [
      m('Total testosterone', 'The main male hormone.', 'Highest in the morning; collect when the kit says.'),
      m('Free testosterone', 'The unbound, active share.', 'Calculated with SHBG.'),
      m('SHBG', 'The protein that carries testosterone.', 'Affects how much testosterone is free.'),
      m('Estradiol', 'Men make some estrogen too.', 'Read alongside testosterone.'),
    ],
    collection: 'Finger-prick sample at home, in the morning',
    seoTitle: "Testosterone Test at Home: Men's Health Check | Noovit",
    seoDescription: "An at-home men's hormone test is coming: total and free testosterone, SHBG and estradiol from one finger-prick sample.",
    hidden: !MEN_LIVE,
  },
  {
    slug: 'pet-urine-test-strips',
    category: 'pets',
    pets: true,
    name: 'Pet Urine Wellness Strips',
    short: 'pH, protein, glucose, blood and more, for dogs and cats.',
    intro: 'Dip-and-read strips you use at home in minutes. A result outside the range is your cue to call the vet.',
    markers: [
      m('pH', 'How acidic or alkaline the urine is.', 'Diet and time since eating change it; one reading isn’t enough.'),
      m('Protein', 'Protein in urine can be worth a vet check.', 'Strips are a screen, not a diagnosis.'),
      m('Glucose', 'Sugar in urine.', 'Any positive result is a reason to see your vet.'),
      m('Blood', 'Traces of blood.', 'See your vet, especially with straining or frequent peeing.'),
      m('Leukocytes and nitrite', 'Screen for signs your vet may want to look into.', 'False negatives happen; symptoms always need a vet.'),
    ],
    collection: 'Urine sample at home (litter or collection pole)',
    seoTitle: 'Dog & Cat Urine Test Strips at Home | Noovit Pets',
    seoDescription: 'At-home urine wellness strips for dogs and cats are coming: pH, protein, glucose, blood, leukocytes and nitrite. How to read them and when to call the vet.',
    related: [{ href: '/pets', label: 'Noovit Pets' }],
  },
  {
    slug: 'pet-dna-test',
    category: 'pets',
    pets: true,
    name: 'Pet DNA Health Test',
    short: 'Breed and inherited health risks, from a cheek swab.',
    intro: 'A simple cheek swab for breed ancestry and known inherited health conditions, from trusted testing partners.',
    markers: [
      m('Breed ancestry', 'Your dog’s or cat’s breed mix.', 'Accuracy varies by partner and breed.'),
      m('Inherited health risks', 'Known genetic conditions for which there are tests.', 'A risk result is a conversation for your vet, not a diagnosis.'),
    ],
    collection: 'Cheek swab at home',
    seoTitle: 'Dog & Cat DNA Health Test | Noovit Pets',
    seoDescription: 'A cheek-swab DNA test for breed ancestry and inherited health risks in dogs and cats is coming to Noovit Pets. What it can tell you and its limits.',
    related: [{ href: '/pets', label: 'Noovit Pets' }],
  },
];

export const TEST_KITS = KITS.filter((k) => !k.hidden);
export const findKit = (slug: string) => TEST_KITS.find((k) => k.slug === slug);
export const kitsIn = (c: TestCategoryId) => TEST_KITS.filter((k) => k.category === c);
export const TEST_CATEGORY_LIST = TEST_CATEGORIES.filter((c) => kitsIn(c.id).length > 0);
