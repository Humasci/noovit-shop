// Ingredient guides: "<ingredient>: benefits, uses, dosage & side effects" pages at /guides/<slug>.
// Built for search (people-also-ask questions, AI overviews): a short answer first, evidence graded honestly,
// every claim tied to a numbered source. Text may cite sources as [1], [2] … (1-based into `sources`).
// Keep claims within FDA structure/function rules; these pages inform, they don't sell.

export type Evidence = 'Moderate' | 'Limited' | 'Early' | 'Insufficient';

export interface GuideSource {
  label: string; // "Kim JY et al. Hypertension Research, 2008"
  title: string;
  url: string;
}

export interface Guide {
  slug: string;
  ingredient: string;
  metaTitle: string;
  metaDescription: string;
  published: string; // YYYY-MM-DD
  updated: string;
  summary: string; // 2–3 sentence direct answer shown first
  quickFacts: { label: string; value: string }[];
  whatItIs: string[];
  benefits: { title: string; evidence: Evidence; text: string }[];
  dosage: string[];
  sideEffects: string[];
  interactions: string[];
  avoidIf: string[];
  howToChoose: string[];
  faqs: { q: string; a: string }[];
  sources: GuideSource[];
  relatedProducts: string[]; // product slugs, shown as "From our range" when active
  relatedGoals: string[]; // goal page slugs
  reviewer?: { name: string; credentials: string; url?: string }; // a real, consenting medical reviewer
}

export const GUIDES: Guide[] = [
  {
    slug: 'nattokinase',
    ingredient: 'Nattokinase',
    metaTitle: 'Nattokinase: Benefits, Dosage, Side Effects & Interactions',
    metaDescription:
      'What nattokinase is, what the research says about blood pressure and circulation, typical doses (2,000 FU), side effects, and who should avoid it. Evidence-graded, with sources.',
    published: '2026-10-28',
    updated: '2026-10-28',
    summary:
      'Nattokinase is an enzyme made when soybeans are fermented into natto. Small trials suggest it may modestly lower blood pressure and affect clotting markers, but a 3-year trial found no effect on artery thickening, and it can increase bleeding risk, especially with blood thinners [1][2][3][6].',
    quickFacts: [
      { label: 'What it is', value: 'An enzyme from fermented soybeans (natto)' },
      { label: 'Typical dose in studies', value: '2,000 FU per day (about 100 mg)' },
      { label: 'Strongest evidence', value: 'Small blood-pressure reduction (limited)' },
      { label: 'Main risk', value: 'Bleeding, especially with blood thinners' },
      { label: 'Avoid if', value: 'On anticoagulants, before surgery, pregnant' },
    ],
    whatItIs: [
      'Nattokinase is a protein-digesting enzyme (a serine protease) produced by the bacterium Bacillus subtilis var. natto when it ferments cooked soybeans into natto, a traditional Japanese food [4].',
      'In lab studies it breaks down fibrin, the protein that forms the mesh of blood clots, which is why it is studied for circulation and heart health [4]. Supplements list its strength in fibrinolytic units (FU) rather than milligrams.',
      'It is not the same as vitamin K2. Natto is rich in vitamin K2, but nattokinase supplements are often processed to remove it [8].',
    ],
    benefits: [
      {
        title: 'Blood pressure',
        evidence: 'Limited',
        text:
          'In an 8-week randomized, placebo-controlled trial of 86 adults with high-normal or stage 1 high blood pressure, 2,000 FU a day lowered systolic blood pressure by about 5.6 mmHg and diastolic by about 2.8 mmHg compared with placebo [1]. However, a larger 3-year trial found no effect on blood pressure [2].',
      },
      {
        title: 'Clotting and circulation markers',
        evidence: 'Early',
        text:
          'In a small crossover study of 12 healthy young men, a single 2,000 FU dose increased markers of clot breakdown and anticoagulation for several hours [3]. These are lab markers, not proof of fewer clots, strokes or heart attacks.',
      },
      {
        title: 'Artery health (atherosclerosis)',
        evidence: 'Insufficient',
        text:
          'The NAPS trial followed about 265 healthy adults for a median of 3 years and found no difference between nattokinase and placebo in the progression of carotid artery wall thickness or stiffness [2].',
      },
      {
        title: 'Natto in the diet',
        evidence: 'Limited',
        text:
          'In a 16-year study of about 29,000 Japanese adults, people who ate the most natto had a lower risk of dying from cardiovascular disease [5]. This is an observational link: it cannot show that natto, or nattokinase supplements, caused the difference.',
      },
    ],
    dosage: [
      'Most human studies used 2,000 FU per day, roughly 100 mg of nattokinase, often split into one or two doses [1][2][3].',
      'There is no official recommended intake. Choose products that state the activity in FU, and do not exceed the label dose.',
      'Talk to your doctor before starting, especially if you take any medication or have a medical condition.',
    ],
    sideEffects: [
      'In trials, nattokinase was generally well tolerated over 8 weeks to 3 years [1][2].',
      'The main concern is bleeding. Case reports describe serious bleeding in people taking nattokinase, including a fatal abdominal bleed in a 92-year-old woman with atrial fibrillation [6][7].',
      'People allergic to soy or natto may react to it.',
    ],
    interactions: [
      'Anticoagulants and antiplatelets (for example warfarin, apixaban, rivaroxaban, clopidogrel and aspirin): may increase the risk of bleeding [6][8].',
      'NSAIDs such as ibuprofen and naproxen, and other supplements that affect clotting (such as fish oil or ginkgo): may add to the bleeding risk.',
      'Never use nattokinase to replace a prescribed blood thinner. A blood clot was reported in a patient who switched from warfarin to nattokinase [8].',
      'Blood-pressure medication: effects may add up. Monitor your blood pressure and talk to your doctor.',
    ],
    avoidIf: [
      'You take a blood thinner or antiplatelet medicine',
      'You have a bleeding disorder, recent bleeding, stomach ulcers or a history of stroke',
      'You have surgery or dental work planned (stop beforehand, as your doctor advises)',
      'You are pregnant or breastfeeding, or for children (not studied)',
      'You are allergic to soy or natto',
    ],
    howToChoose: [
      'Activity listed in FU per capsule (most products contain 2,000 FU).',
      'Third-party tested, with a certificate of analysis available on request.',
      'Vitamin K2 removed or stated, which matters if you have ever taken warfarin.',
      'No claims to "dissolve clots", "prevent strokes" or replace medication. Under US law supplements cannot make those claims.',
    ],
    faqs: [
      {
        q: 'What is nattokinase used for?',
        a: 'People mainly take nattokinase for heart and circulation support. The best human evidence is a small blood-pressure reduction in one 8-week trial; a larger 3-year trial found no effect on blood pressure or artery thickening [1][2].',
      },
      {
        q: 'Is nattokinase safe?',
        a: 'It was well tolerated in clinical trials, but it can increase bleeding risk. It is not suitable with blood thinners, before surgery, with bleeding disorders, or during pregnancy. In 2012 Health Canada declined to authorize it, citing unresolved safety concerns including bleeding risk [8].',
      },
      {
        q: 'Can I take nattokinase with aspirin or blood thinners?',
        a: 'Not without your doctor’s approval. Combining nattokinase with anticoagulants, antiplatelets or aspirin may increase the risk of serious bleeding [6][8].',
      },
      {
        q: 'How much nattokinase should I take?',
        a: 'Studies used 2,000 FU (about 100 mg) a day [1][2]. There is no official recommended dose; follow the product label and your doctor’s advice.',
      },
      {
        q: 'Is nattokinase the same as vitamin K2?',
        a: 'No. Both come from natto, but nattokinase is an enzyme and vitamin K2 is a vitamin involved in blood clotting and bone health. Many nattokinase supplements remove the vitamin K2 [8].',
      },
      {
        q: 'Can I get nattokinase from food?',
        a: 'Only from natto, the fermented soybean dish. Other soy foods do not contain it, because the enzyme is made during fermentation [4].',
      },
    ],
    sources: [
      { label: 'Kim JY et al. Hypertension Research, 2008', title: 'Effects of nattokinase on blood pressure: a randomized, controlled trial', url: 'https://pubmed.ncbi.nlm.nih.gov/18971533/' },
      { label: 'NAPS trial. Clinical Hemorheology and Microcirculation, 2021', title: 'Nattokinase atherothrombotic prevention study (NAPS): a randomized controlled trial', url: 'https://journals.sagepub.com/doi/10.3233/CH-211147' },
      { label: 'Kurosawa Y et al. Scientific Reports, 2015', title: 'A single-dose of oral nattokinase potentiates thrombolysis and anti-coagulation profiles', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4479826/' },
      { label: 'Chen H et al. Biomarker Insights, 2018', title: 'Nattokinase: a promising alternative in prevention and treatment of cardiovascular diseases', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6043915/' },
      { label: 'Nagata C et al. American Journal of Clinical Nutrition, 2017', title: 'Dietary soy and natto intake and cardiovascular disease mortality in Japanese adults: the Takayama study', url: 'https://pubmed.ncbi.nlm.nih.gov/27927636/' },
      { label: 'Memorial Sloan Kettering Cancer Center', title: 'Nattokinase — About Herbs', url: 'https://www.mskcc.org/cancer-care/integrative-medicine/herbs/nattokinase' },
      { label: 'Ramachandran L et al. Cureus, 2021', title: 'Nattokinase-associated hemoperitoneum in an elderly woman', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8723721/' },
      { label: 'Drugs.com (Natural Products monograph)', title: 'Nattokinase: uses, side effects and warnings', url: 'https://drugs.com/npp/nattokinase.html' },
    ],
    relatedProducts: [],
    relatedGoals: [],
  },
];

export const findGuide = (slug: string) => GUIDES.find((g) => g.slug === slug);

// Guides linked from a product page, by ingredient slug match.
export const guidesForProduct = (productSlug: string) => GUIDES.filter((g) => g.relatedProducts.includes(productSlug));
