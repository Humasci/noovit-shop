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
  // Topic guides (not a single ingredient) override the page title and section headings.
  h1?: string;
  sectionTitles?: Partial<Record<'what' | 'benefits' | 'dosage' | 'sideEffects' | 'interactions' | 'avoid' | 'choose' | 'faq', string>>;
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
  {
    slug: 'ashwagandha',
    ingredient: 'Ashwagandha',
    metaTitle: 'Ashwagandha: Benefits, Dosage, Side Effects & Safety',
    metaDescription:
      'What the research says about ashwagandha for stress and sleep, KSM-66 vs Sensoril, studied doses (240–600 mg), liver and thyroid risks, and who should avoid it.',
    published: '2026-10-30',
    updated: '2026-10-30',
    summary:
      'Ashwagandha is an herb from Ayurvedic medicine, usually taken as a root or root-and-leaf extract. Several small trials found that 240–600 mg of extract a day for 8–12 weeks lowered stress scores and cortisol and modestly improved sleep [1][6][9]. Rare but serious liver injury has been reported, it can raise thyroid hormones, and it should not be used in pregnancy [1][17][19][21].',
    quickFacts: [
      { label: 'What it is', value: 'A root (or root-and-leaf) extract of Withania somnifera' },
      { label: 'Typical dose in studies', value: '240–600 mg of extract per day for 8–12 weeks' },
      { label: 'Strongest evidence', value: 'Lower perceived stress and cortisol (moderate)' },
      { label: 'Main risks', value: 'Rare liver injury; can raise thyroid hormones' },
      { label: 'Avoid if', value: 'Pregnant, breastfeeding, thyroid or liver disease' },
    ],
    whatItIs: [
      'Ashwagandha (Withania somnifera), also called Indian ginseng or winter cherry, is an evergreen shrub in the nightshade family. It grows in India, Africa and the Middle East and has been used in Ayurvedic medicine for thousands of years [1][21][22].',
      'Its main active compounds are thought to be withanolides, a group of steroid-like substances, along with alkaloids. Which compounds cause the effects seen in studies, and at what dose, is not yet known [1][22].',
      'Supplements use the root, the leaf, or both. The plant part and the extraction method change what ends up in the capsule, so results from one product do not automatically apply to another [22].',
      'KSM-66 is a root-only extract made with a water-based process and standardized to at least 5% withanolides. It is the most-studied branded extract, usually taken as 300 mg twice a day (600 mg a day) [2][10][11].',
      'Sensoril is a water extract of the root and leaf, labeled at no less than 10% withanolide glycosides. Trials used lower doses than KSM-66: 125–500 mg a day [5][12][24].',
      'Plain root powder is the traditional form. A WHO monograph lists 3–6 g of dried root a day [21]. It is not standardized, and most modern trials used extracts instead.',
      'Withanolide percentages are not directly comparable between brands, because companies measure different groups of compounds with different methods. A 2024 analysis of the root-and-leaf extract, for example, measured each of its 10 main compounds at 0.4–1% [5].',
    ],
    benefits: [
      {
        title: 'Stress and cortisol',
        evidence: 'Moderate',
        text:
          'In a 60-day randomized, placebo-controlled trial of 64 adults with chronic stress, 600 mg a day of KSM-66 lowered perceived stress scores by 44% versus 5.5% with placebo, and serum cortisol by 27.9% versus 7.9% [2]. Other 8-week trials found similar results with 250–600 mg of root extract and 125–500 mg of a root-and-leaf extract [3][5]. A 2024 meta-analysis of 9 trials (558 people) found perceived stress scores about 4.7 points lower than with placebo [6]. However, a 2025 meta-analysis of 488 people found that cortisol fell by about 1.2 µg/dL while the change in perceived stress was not statistically significant [7]. Most trials were small, short and run in India, often with extract supplied by the manufacturer [2][3][11].',
      },
      {
        title: 'Sleep',
        evidence: 'Moderate',
        text:
          'A 2021 meta-analysis of 5 randomized trials (400 adults) found a small but significant improvement in overall sleep (standardized mean difference −0.59). The effect was larger in people with insomnia, at 600 mg a day or more, and after 8 weeks or more [9]. In one trial, 60 adults with insomnia took 300 mg of KSM-66 twice a day for 10 weeks. Time to fall asleep dropped from about 42 to 29 minutes, versus 42 to 34 minutes with placebo, and sleep efficiency rose to 83% versus 80%. Total sleep time was not significantly different [10].',
      },
      {
        title: 'Anxiety scores',
        evidence: 'Limited',
        text:
          'A 2022 meta-analysis of 12 trials (1,002 people) found lower anxiety scores with ashwagandha, but rated the certainty of the evidence as low, and results varied widely between studies [8]. In a 60-day trial of 60 stressed adults, 240 mg a day of an extract called Shoden lowered Hamilton Anxiety scores by 41% versus 24% with placebo [4]. NCCIH describes the evidence on anxiety as unclear [1]. Most trials enrolled stressed adults rather than people with diagnosed anxiety disorders [2][4].',
      },
      {
        title: 'Strength with resistance training',
        evidence: 'Limited',
        text:
          'In an 8-week trial, 57 men aged 18–50 with little weight-training experience took 600 mg of KSM-66 or placebo a day. Bench-press strength rose by 46.0 kg versus 26.4 kg, leg-extension strength by 14.5 kg versus 9.8 kg, and arm muscle size by 8.6 cm² versus 5.3 cm² [11]. In a 12-week trial of 38 recreationally active men, 500 mg a day of Sensoril increased squat strength by 19.1 kg versus 10.0 kg and bench press by 12.8 kg versus 8.0 kg, with no other differences in body composition [12]. NCCIH says there is not yet enough evidence on athletic performance [1].',
      },
      {
        title: 'Testosterone and sperm quality (men)',
        evidence: 'Limited',
        text:
          'In a 16-week crossover trial of overweight men aged 40–70 (57 enrolled, 43 completed), an extract providing 21 mg of withanolide glycosides a day for 8 weeks raised testosterone 14.7% and DHEA-S 18% more than placebo, but fatigue, vigor and sexual well-being did not differ [13]. In the strength trial above, testosterone rose by 96.2 ng/dL versus 18.0 ng/dL with placebo [11], while in another trial the rise in men was not significant compared with placebo [4]. In a pilot trial of 46 men with low sperm counts, 675 mg a day for 90 days raised sperm count by 167% (from 9.6 to 25.6 million/mL) and motility by 57%, with little change on placebo [14]. A 2018 review found only one randomized trial on male fertility and called the data too limited to be conclusive [15].',
      },
      {
        title: 'Memory and reaction time',
        evidence: 'Early',
        text:
          'In a 14-day crossover study of 20 healthy men, 1,000 mg a day of a root-and-leaf extract improved reaction times on several computer tests, but not finger tapping [24]. NCCIH finds not enough evidence to say whether ashwagandha helps cognitive function, blood sugar, menopause or female fertility [1].',
      },
    ],
    dosage: [
      'Trials used 240–600 mg of extract a day: 600 mg of KSM-66 (often 300 mg twice a day), 125–500 mg of Sensoril, or 240 mg of Shoden [2][4][5][10].',
      'Doses are specific to each extract. Because extracts differ, use the dose studied for the extract you buy rather than converting between them [22].',
      'Trials gave it once or twice a day, with water or milk, for 8–12 weeks [2][4][10][12]. Results were measured after 8–10 weeks, and sleep benefits were larger after 8 weeks or more [9], so do not expect much in the first few days.',
      'There is no official recommended intake or upper limit. NCCIH says it may be safe for up to 3 months, and long-term safety is unknown [1]. Germany’s Federal Institute for Risk Assessment (BfR) says no safe intake level has been established [22].',
      'Talk to your doctor before starting, especially if you take any medication or have a medical condition.',
    ],
    sideEffects: [
      'In trials of up to about 3 months, side effects were usually mild and similar to placebo [1][2][6]. Reported side effects include drowsiness, stomach upset, nausea, diarrhea, vomiting, headache, dizziness and skin rashes [1][22].',
      'Liver injury is rare but can be serious. LiverTox, the NIH database on drug-induced liver injury, notes that ashwagandha has been implicated in cases of clinically apparent liver injury [16]. In 5 cases from Iceland and the US, jaundice and itching began 2–12 weeks after starting it. None developed liver failure, and liver tests returned to normal within 1–5 months in the 4 people who were followed up [17].',
      'In an Indian series of 8 people who took single-ingredient ashwagandha, 3 who already had chronic liver disease developed acute-on-chronic liver failure and died [18]. Stop taking it and see a doctor if you notice yellowing of the skin or eyes, itching, nausea, unusual tiredness or stomach pain [17].',
      'Ashwagandha can raise thyroid hormones. In an 8-week trial of 50 adults with subclinical hypothyroidism, 600 mg a day raised T3 and T4 and lowered TSH compared with placebo [19]. In a small trial of a root-and-leaf extract in people with bipolar disorder, T4 rose by 7–24% in all 3 people tested [20], and a case of thyrotoxicosis (an overactive thyroid) has been reported [21].',
      'It may also affect sex hormones, cortisol, blood sugar and the immune system [1][21][22].',
      'Some European regulators are more cautious than US agencies. Denmark banned ashwagandha in food supplements from 2023, after a 2020 risk assessment by the Technical University of Denmark concluded that a safe intake level could not be set [21][23]. In 2024, Germany’s BfR and the Netherlands’ RIVM advised consumers against ashwagandha supplements, citing liver case reports, hormone and thyroid effects, and gaps in safety data [21][22]. Critics point out that these assessments did not consistently separate root products from leaf products [23].',
    ],
    interactions: [
      'Thyroid hormone medication (for example levothyroxine): ashwagandha can raise thyroid hormone levels, so the effects may add up [1][19].',
      'Sedatives (for example benzodiazepines and sleep medicines) and anti-seizure medicines: may interact, and drowsiness is a known side effect [1].',
      'Immunosuppressants (for example after an organ transplant or for autoimmune disease): ashwagandha may stimulate the immune system and work against them [1][21][22].',
      'Diabetes medicines: ashwagandha may affect blood sugar. Monitor your levels and talk to your doctor [1][22].',
      'Blood-pressure medicines: may interact. Monitor your blood pressure and talk to your doctor [1][22].',
      'Other supplements: combination products make it harder to tell what caused a side effect. In one liver-injury case, rhodiola was a possible cause along with ashwagandha [17][22].',
    ],
    avoidIf: [
      'You are pregnant. Ashwagandha has traditionally been used to induce abortion, and its effects in pregnancy have not been studied [1][21][22]',
      'You are breastfeeding, or for children (not enough safety data) [1][22]',
      'You have an overactive thyroid (hyperthyroidism) or another thyroid disorder, or take thyroid medication [1][19]',
      'You have an autoimmune disease [1]',
      'You have liver disease, now or in the past [18][22]',
      'You have surgery planned (stop beforehand, as your doctor advises) [1]',
      'You have hormone-sensitive prostate cancer, because it may raise testosterone [1]',
    ],
    howToChoose: [
      'A named, standardized extract (such as KSM-66, Sensoril or Shoden) with the plant part and withanolide percentage on the label, so you can match it to the research.',
      'A dose that matches studies of that extract: about 600 mg a day for KSM-66, 125–500 mg for Sensoril, or 240 mg for Shoden [2][4][5].',
      'Plant part stated. Root is the traditional part used, and safety data on leaf preparations are more limited [23].',
      'Third-party tested, with a certificate of analysis for identity, heavy metals and microbes available on request.',
      'Single-ingredient products make it easier to know what you are taking and to trace any side effect [22].',
      'No claims to treat anxiety, insomnia, infertility or thyroid disease. Under US law supplements cannot make those claims.',
    ],
    faqs: [
      {
        q: 'What does ashwagandha do?',
        a: 'In trials, ashwagandha extracts mainly lowered perceived stress scores and cortisol and modestly improved sleep, usually over 8–12 weeks [2][6][9]. Evidence for anxiety, strength and testosterone is more limited [1][8].',
      },
      {
        q: 'How long does ashwagandha take to work?',
        a: 'Most trials measured results after 8–10 weeks of daily use [2][3][10]. In a meta-analysis, sleep benefits were larger after at least 8 weeks [9].',
      },
      {
        q: 'Is it safe to take ashwagandha every day?',
        a: 'Daily use for up to about 3 months appears safe for most healthy adults, but long-term safety is unknown [1]. Rare liver injury and changes in thyroid hormones have been reported [17][19].',
      },
      {
        q: 'Which is better, KSM-66 or Sensoril?',
        a: 'Neither has been shown to be better, and we found no trial comparing them directly. KSM-66 is a root-only extract studied mostly at 600 mg a day; Sensoril is a root-and-leaf extract studied at 125–500 mg a day [2][5].',
      },
      {
        q: 'Should I take ashwagandha in the morning or at night?',
        a: 'Trials gave it once or twice a day, and we found none that tested which time works best [4][10]. Because it can cause drowsiness, some people prefer the evening [1].',
      },
      {
        q: 'Does ashwagandha increase testosterone?',
        a: 'Small trials in men found testosterone rose about 15% more than with placebo, but another found no significant difference [4][13]. NCCIH calls the evidence limited [1].',
      },
      {
        q: 'Can ashwagandha affect your thyroid?',
        a: 'Yes. Trials found it can raise the thyroid hormones T3 and T4 [19][20]. Avoid it if you have an overactive thyroid, and talk to your doctor if you take thyroid medication [1].',
      },
      {
        q: 'Why is ashwagandha banned in some countries?',
        a: 'Denmark banned it in food supplements from 2023 because its experts could not set a safe intake level, citing hormone, thyroid and pregnancy concerns [23]. Risk assessors in Germany and the Netherlands advised consumers against it in 2024 [21][22].',
      },
    ],
    sources: [
      { label: 'National Center for Complementary and Integrative Health (NCCIH)', title: 'Ashwagandha: usefulness and safety', url: 'https://www.nccih.nih.gov/health/ashwagandha' },
      { label: 'Chandrasekhar K et al. Indian Journal of Psychological Medicine, 2012', title: 'A prospective, randomized double-blind, placebo-controlled study of safety and efficacy of a high-concentration full-spectrum extract of ashwagandha root in reducing stress and anxiety in adults', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3573577/' },
      { label: 'Salve J et al. Cureus, 2019', title: 'Adaptogenic and anxiolytic effects of ashwagandha root extract in healthy adults: a double-blind, randomized, placebo-controlled clinical study', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6979308/' },
      { label: 'Lopresti AL et al. Medicine, 2019', title: 'An investigation into the stress-relieving and pharmacological actions of an ashwagandha (Withania somnifera) extract: a randomized, double-blind, placebo-controlled study', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6750292/' },
      { label: 'Pandit S et al. Nutrients, 2024', title: 'Effects of Withania somnifera extract in chronically stressed adults: a randomized controlled trial', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11085552/' },
      { label: 'Arumugam V et al. Explore, 2024', title: 'Effects of ashwagandha (Withania somnifera) on stress and anxiety: a systematic review and meta-analysis', url: 'https://pubmed.ncbi.nlm.nih.gov/39348746/' },
      { label: 'Albalawi AA. Nutrition and Health, 2025', title: 'Dual impact of ashwagandha: significant cortisol reduction but no effects on perceived stress. A systematic review and meta-analysis', url: 'https://pubmed.ncbi.nlm.nih.gov/40746175/' },
      { label: 'Akhgarjand C et al. Phytotherapy Research, 2022', title: 'Does ashwagandha supplementation have a beneficial effect on the management of anxiety and stress? A systematic review and meta-analysis of randomized controlled trials', url: 'https://pubmed.ncbi.nlm.nih.gov/36017529/' },
      { label: 'Cheah KL et al. PLoS One, 2021', title: 'Effect of ashwagandha (Withania somnifera) extract on sleep: a systematic review and meta-analysis', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8462692/' },
      { label: 'Langade D et al. Cureus, 2019', title: 'Efficacy and safety of ashwagandha (Withania somnifera) root extract in insomnia and anxiety: a double-blind, randomized, placebo-controlled study', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6827862/' },
      { label: 'Wankhede S et al. Journal of the International Society of Sports Nutrition, 2015', title: 'Examining the effect of Withania somnifera supplementation on muscle strength and recovery: a randomized controlled trial', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4658772/' },
      { label: 'Ziegenfuss TN et al. Nutrients, 2018', title: 'Effects of an aqueous extract of Withania somnifera on strength training adaptations and recovery: the STAR trial', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6266766/' },
      { label: 'Lopresti AL et al. American Journal of Men’s Health, 2019', title: 'A randomized, double-blind, placebo-controlled, crossover study examining the hormonal and vitality effects of ashwagandha (Withania somnifera) in aging, overweight males', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6438434/' },
      { label: 'Ambiye VR et al. Evidence-Based Complementary and Alternative Medicine, 2013', title: 'Clinical evaluation of the spermatogenic activity of the root extract of ashwagandha (Withania somnifera) in oligospermic males: a pilot study', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3863556/' },
      { label: 'Durg S et al. Phytomedicine, 2018', title: 'Withania somnifera (Indian ginseng) in male infertility: an evidence-based systematic review and meta-analysis', url: 'https://pubmed.ncbi.nlm.nih.gov/30466985/' },
      { label: 'LiverTox (NIDDK, National Institutes of Health), updated 2024', title: 'Ashwagandha', url: 'https://www.ncbi.nlm.nih.gov/books/NBK548536/' },
      { label: 'Björnsson HK et al. Liver International, 2020', title: 'Ashwagandha-induced liver injury: a case series from Iceland and the US Drug-Induced Liver Injury Network', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8041491/' },
      { label: 'Philips CA et al. Hepatology Communications, 2023', title: 'Ashwagandha-induced liver injury: a case series from India and literature review', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10531359/' },
      { label: 'Sharma AK et al. Journal of Alternative and Complementary Medicine, 2018', title: 'Efficacy and safety of ashwagandha root extract in subclinical hypothyroid patients: a double-blind, randomized placebo-controlled trial', url: 'https://pubmed.ncbi.nlm.nih.gov/28829155/' },
      { label: 'Gannon JM et al. Journal of Ayurveda and Integrative Medicine, 2014', title: 'Subtle changes in thyroid indices during a placebo-controlled study of an extract of Withania somnifera in persons with bipolar disorder', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4296437/' },
      { label: 'RIVM (Netherlands National Institute for Public Health and the Environment), 2024', title: 'Risk assessment of herbal preparations containing Withania somnifera (Ashwagandha). RIVM letter report 2024-0029', url: 'https://www.rivm.nl/bibliotheek/rapporten/2024-0029.pdf' },
      { label: 'BfR (German Federal Institute for Risk Assessment), 2024', title: 'Ashwagandha: food supplements with potential health risks. Communication 39/2024', url: 'https://www.bfr.bund.de/cm/349/ashwagandha-food-supplements-with-potential-health-risks.pdf' },
      { label: 'Dutta A et al. Food Science & Nutrition, 2026', title: 'Plant part-specific differences in ashwagandha (Withania somnifera): a comparative evaluation of root and leaf evidence for safety and regulation', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC13635981/' },
      { label: 'Pingali U et al. Pharmacognosy Research, 2014', title: 'Effect of standardized aqueous extract of Withania somnifera on tests of cognitive and psychomotor performance in healthy human participants', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3897003/' },
    ],
    relatedProducts: ['ashwagandha'],
    relatedGoals: ['sleep-stress'],
  },
  {
    slug: 'glp-1-nutrition',
    ingredient: 'GLP-1 nutrition',
    h1: 'Nutrition on GLP-1 medications: protein, fiber, hydration and supplements',
    sectionTitles: {
      what: 'How GLP-1 medications change eating',
      benefits: 'What the evidence says, nutrient by nutrient',
      dosage: 'Daily targets',
      sideEffects: 'Managing common side effects with food',
      interactions: 'Supplements and your medication',
      avoid: 'When to talk to your doctor first',
      choose: 'Choosing supplements while on a GLP-1',
      faq: 'FAQ',
    },
    metaTitle: 'Nutrition on GLP-1 Drugs: Protein, Fiber & Supplements',
    metaDescription:
      'What to eat on semaglutide or tirzepatide: protein and fiber targets, fluids, food tips for nausea and constipation, and which supplements have real evidence.',
    published: '2026-10-30',
    updated: '2026-10-30',
    summary:
      'GLP-1 medications such as semaglutide and tirzepatide cut appetite so much that people often eat 16% to 39% fewer calories, which makes it harder to get enough protein, fiber, fluids, vitamins and minerals [4]. A 2025 joint advisory from four US nutrition and obesity societies puts protein plus strength training, nutrient-dense food and managing stomach side effects at the center of care [4]. Supplements can fill specific gaps, but none replaces the medication or a balanced diet, and any change to your treatment belongs with your prescriber.',
    quickFacts: [
      { label: 'Medications covered', value: 'Semaglutide (Ozempic, Wegovy) and tirzepatide (Mounjaro, Zepbound)' },
      { label: 'Typical weight loss in trials', value: 'About 15% (semaglutide) to 21% (tirzepatide) over 68–72 weeks' },
      { label: 'Lean mass share of weight lost', value: 'About 25% to 40% in body-scan substudies' },
      { label: 'Protein target proposed', value: '1.2–1.6 g/kg/day, or 80–120 g/day, plus strength training' },
      { label: 'Most common side effects', value: 'Nausea, diarrhea, vomiting, constipation' },
      { label: 'Talk to your doctor first if', value: 'Kidney disease, pregnancy, eating disorder history, severe vomiting' },
    ],
    whatItIs: [
      'GLP-1 is a gut hormone that helps regulate appetite and how much you eat. Semaglutide copies its action, and tirzepatide acts on both the GLP-1 and GIP receptors. Both reach brain areas involved in appetite and slow the rate at which the stomach empties, so you feel full sooner and for longer [5][6].',
      'In the STEP 1 trial of 1,961 adults without diabetes, weekly semaglutide 2.4 mg led to an average 14.9% weight loss over 68 weeks, compared with 2.4% on placebo [1]. In SURMOUNT-1 (2,539 adults), tirzepatide led to 15.0%, 19.5% and 20.9% weight loss at 5, 10 and 15 mg over 72 weeks, compared with 3.1% on placebo [2].',
      'Not all of that weight is fat. In a STEP 1 body-scan (DXA) substudy, 8.3 kg of the average 13.6 kg lost was fat and 5.3 kg (38%) was lean mass, which includes muscle, organs and water [4]. In the SURMOUNT-1 DXA substudy of 160 people, about 74% of the weight lost on tirzepatide was fat and 26% was lean mass, a ratio similar to placebo [3].',
      'Because people eat much less, the advisory warns that intakes below about 1,200 kcal a day for women and 1,800 kcal a day for men make it hard to meet vitamin and mineral needs from food alone [4]. That is why what you eat matters more, not less, on these medications.',
    ],
    benefits: [
      {
        title: 'Protein and strength training to protect muscle',
        evidence: 'Moderate',
        text:
          'The 2025 joint advisory notes that the general protein RDA is 0.8 g/kg/day, and that higher targets of 1.2–1.6 g/kg/day have been proposed during active weight loss; an absolute target of 80–120 g/day is a practical alternative [4]. It is unclear whether to use your current, adjusted or lean body weight for the math, so a dietitian can help. The advisory is clear that extra protein alone is likely not enough: structured resistance (strength) training is the best-established way to help preserve lean mass while losing weight [4].',
      },
      {
        title: 'Fiber for regularity',
        evidence: 'Limited',
        text:
          'Constipation affected 24% of people on semaglutide 2.4 mg and 11% to 17% on tirzepatide in trials [5][6]. The advisory recommends adequate fluids and a gradual increase in fiber from foods such as fruits, vegetables, prunes and other dried fruit, with fiber supplements as an option if food is not enough [4]. Fiber has not been tested in trials specifically in people on GLP-1 medications, and very high-fiber foods can worsen fullness and nausea in the first days of treatment [4].',
      },
      {
        title: 'Hydration',
        evidence: 'Limited',
        text:
          'Both drug labels warn that nausea, vomiting and diarrhea can lead to dehydration, and there are reports of acute kidney injury, sometimes needing dialysis, mostly in people with these stomach side effects [5][6]. Eating less also means less water from food, which normally supplies about 20% of total water [7]. Drinking enough fluids is a standard recommendation in the labels and the advisory rather than something tested in its own trial [4][6].',
      },
      {
        title: 'Vitamin B12',
        evidence: 'Limited',
        text:
          'There is no trial showing that semaglutide or tirzepatide themselves cause B12 deficiency. The advisory lists B12 among nutrients that may fall short when food intake drops sharply, alongside iron, calcium, magnesium, zinc and vitamins A, D, E, K, B1 and C [4]. The well-documented drug link is with metformin, a diabetes medicine that can reduce B12 absorption and lower blood levels [9]. If you also take metformin or eat few animal foods, ask whether your B12 should be checked.',
      },
      {
        title: 'Micronutrients when eating much less (multivitamin)',
        evidence: 'Limited',
        text:
          'GLP-1 users eat 16% to 39% fewer calories, and the advisory warns this can lead to low intakes of several vitamins and minerals [4]. It recommends nutrient-dense, minimally processed foods first, and says supplements such as vitamin D, calcium, B12 or a multivitamin-mineral can be considered proactively for at-risk nutrients, at appropriate doses and tailored to the person [4]. This is expert consensus; no trial has yet tested multivitamins in people on GLP-1 medications.',
      },
      {
        title: 'Nausea: ginger',
        evidence: 'Limited',
        text:
          'Ginger has not been studied in people taking GLP-1 medications. The evidence comes from other kinds of nausea: a meta-analysis of 12 trials in 1,278 pregnant women found ginger improved nausea compared with placebo but did not significantly reduce vomiting [12]. NIH’s complementary health center calls the evidence for chemotherapy and post-surgery nausea uncertain [13]. The advisory lists ginger or peppermint tea as a reasonable food-based option [4].',
      },
      {
        title: 'Constipation: magnesium',
        evidence: 'Limited',
        text:
          'Magnesium works as a laxative by drawing water into the bowel. In a 28-day trial of 90 adults with chronic constipation, 1.5 g a day of magnesium oxide improved symptoms in 68.3% of people, compared with 11.7% on placebo [11]. The advisory names magnesium citrate as effective and well tolerated for GLP-1-related constipation [4]. These laxative doses are well above the 350 mg upper limit for supplemental magnesium, which is set because of diarrhea [10]. Magnesium glycinate is usually sold as a gentler form; it has not been tested as a laxative, so do not expect it to relieve constipation the way oxide or citrate can. None of these has been trialed specifically with GLP-1 medications.',
      },
      {
        title: 'Hair shedding and biotin',
        evidence: 'Insufficient',
        text:
          'Hair loss was reported in 3% of people on semaglutide 2.4 mg and 4% to 5% on tirzepatide, compared with 1% on placebo [5][6]. On the tirzepatide label it was linked to weight reduction and was more common in women (7.1%) than men (0.5%) [6]. This pattern fits telogen effluvium, a temporary shedding triggered by stressors such as crash dieting, low protein intake and iron deficiency [14]. Biotin helped hair only in people with a true deficiency or rare conditions; there are no controlled trials showing benefit in healthy people [15][16]. High-dose biotin can also distort some lab tests, including troponin tests used to diagnose heart attacks [17].',
      },
    ],
    dosage: [
      'Protein: 1.2–1.6 g per kg of body weight a day has been proposed during active weight loss, or 80–120 g a day as a simpler target. Avoid going below 0.4–0.5 g/kg, and avoid staying at 2 g/kg or more long term [4]. Eat protein foods first at each meal, and favor fish, eggs, Greek yogurt, cottage cheese, beans, lentils and nuts [4].',
      'Strength training: pair protein with a structured resistance or mixed (resistance plus aerobic) program. Aerobic exercise alone does less to protect lean mass during rapid weight loss [4].',
      'Fiber: the US Dietary Guidelines goal is 14 g per 1,000 calories, so about 17–21 g a day if you eat 1,200–1,500 kcal [8]. Increase it slowly, and go easy on high-fiber foods in the first few days after starting or raising your dose if you feel nauseous [4].',
      'Fluids: total water needs average about 2.7 L a day for women and 3.7 L for men, with about 20% normally coming from food [7]. Since you are eating less, plan on more from drinks: roughly 2.2 L (women) and 3 L (men) as a starting point, and more in heat, with exercise, or with vomiting or diarrhea. If you have heart or kidney disease, ask your doctor what fluid amount is right for you.',
      'Vitamins and minerals: if your intake is below about 1,200 kcal (women) or 1,800 kcal (men) a day, ask your care team about a multivitamin-mineral, and about vitamin D, calcium or B12 based on your diet and labs [4].',
    ],
    sideEffects: [
      'Nausea: eat a small breakfast, then small meals every 3–4 hours, and sip fluids through the day. Nausea is often worse in the morning or after long gaps without food [4]. Avoid large, fatty meals, and try ginger or peppermint tea [4].',
      'Constipation: build up fluids and fiber from foods such as fruit, vegetables and prunes. High-protein or high-fat foods slow the stomach further and may need to be limited for a while [4]. If food is not enough, ask your clinician about magnesium citrate, fiber supplements or other laxatives [4].',
      'Reflux and heartburn: eat smaller portions, avoid lying down soon after eating, and keep alcohol to a minimum, since it can worsen nausea and reflux on GLP-1 therapy [4].',
      'Low appetite: choose low-volume, nutrient-dense foods such as smoothies with fruit and yogurt, protein drinks, cottage cheese and soups. Set a reminder to eat if you forget [4].',
      'Diarrhea: avoid large or high-fat meals, and replace fluids. Fiber powders can add bulk to stools [4].',
      'In trials, nausea affected 44% of people on semaglutide 2.4 mg and 25% to 29% on tirzepatide, diarrhea 30% and 19% to 23%, and vomiting 24% and 8% to 13% [5][6]. These effects are most common when starting or increasing the dose and usually ease on a stable dose [4].',
    ],
    interactions: [
      'Both medications slow stomach emptying, which can change how quickly oral medicines are absorbed. The labels advise caution, and monitoring for medicines with a narrow safety margin such as warfarin [5][6]. Ask your pharmacist whether the timing of any pill or supplement matters.',
      'Birth control pills: the tirzepatide label advises switching to a non-oral method, or adding a barrier method, for 4 weeks after starting and for 4 weeks after each dose increase [6].',
      'Magnesium and other minerals: some medicines bind to minerals in the gut. Ask your pharmacist how to space a magnesium, calcium or multivitamin supplement from your other medicines.',
      'Biotin: tell your doctor and lab before blood tests if you take biotin, because it can cause incorrect results [17].',
      'Supplements marketed as “GLP-1 boosters”, “GLP-1 support” or “natural Ozempic” are not a replacement for a prescribed GLP-1 medication. The FDA does not approve supplements before they are sold, and a product marketed to treat or prevent a disease is legally a drug, not a supplement [18].',
      'Never stop, skip or change your GLP-1 dose to make room for a supplement, or because of side effects, without talking to your prescriber.',
    ],
    avoidIf: [
      'You have kidney disease: talk to your doctor before taking magnesium, because the kidneys clear excess magnesium and toxicity risk rises when they do not work well [10]. Dehydration on GLP-1s can also strain the kidneys [5][6].',
      'You are pregnant, planning a pregnancy or breastfeeding: semaglutide may cause fetal harm, and the label advises stopping at least 2 months before a planned pregnancy [5]. Ask your doctor about any supplement.',
      'You have a history of an eating disorder: the advisory recommends referral to an eating disorder specialist, and calls a restrictive eating disorder a general contraindication to GLP-1 use [4].',
      'You have severe or ongoing vomiting or diarrhea, or cannot keep fluids down: contact your care team promptly because of the risk of dehydration and kidney injury [5][6].',
      'You have severe stomach pain that will not go away, sometimes felt through to the back, with or without vomiting (a possible sign of pancreatitis), or upper stomach pain, fever, yellowing of the skin or eyes, or clay-colored stools (possible gallbladder problems): call your healthcare provider right away [5].',
      'You take metformin, insulin, blood thinners or other prescription medicines: check with your pharmacist before adding supplements.',
    ],
    howToChoose: [
      'Visible doses: every ingredient should be listed with its amount. Avoid “proprietary blends” that hide doses.',
      'Third-party testing: look for a product tested by an independent lab, with a certificate of analysis available on request.',
      'Sensible amounts: a multivitamin near 100% of the Daily Value is usually enough. Supplemental magnesium has an upper limit of 350 mg a day for adults unless a doctor advises more [10].',
      'Form that fits the goal: magnesium oxide or citrate if your clinician suggests it for constipation; a gentler form such as glycinate if you want magnesium without a laxative effect [4][10][11].',
      'Be wary of “natural Ozempic”, “GLP-1 booster” or “GLP-1 support” claims. Under federal law, health claims must be backed by competent and reliable scientific evidence, generally human trials [19], and supplements cannot claim to treat or prevent disease [18].',
      'Never buy semaglutide or tirzepatide from websites or products sold as supplements or “for research use only”. The FDA warns these can contain the wrong ingredient or the wrong amount, and advises buying only from state-licensed pharmacies [20].',
    ],
    faqs: [
      {
        q: 'How much protein should I eat on Ozempic, Wegovy or Zepbound?',
        a: 'Expert guidance suggests 1.2–1.6 g per kg of body weight a day during active weight loss, or about 80–120 g a day, combined with strength training [4]. Ask a dietitian which body weight to use for your target.',
      },
      {
        q: 'Do GLP-1 medications cause muscle loss?',
        a: 'Some of the weight lost is lean mass. In trial body-scan substudies it was about 38% with semaglutide and about 26% with tirzepatide, similar to other large weight losses [3][4]. Adequate protein plus resistance training is the main way to help preserve it [4].',
      },
      {
        q: 'Should I take a multivitamin on a GLP-1?',
        a: 'It may help if you eat much less than usual, especially below about 1,200 kcal (women) or 1,800 kcal (men) a day. The 2025 joint advisory says a multivitamin-mineral, vitamin D, calcium or B12 can be considered based on individual needs [4]. Ask your care team.',
      },
      {
        q: 'What helps nausea on semaglutide or tirzepatide?',
        a: 'Small, regular meals, avoiding large or fatty meals, sipping fluids, and ginger or peppermint tea [4]. Ginger has evidence for pregnancy nausea but has not been studied with GLP-1 medications [12]. If nausea is severe, your prescriber can adjust your plan.',
      },
      {
        q: 'Which magnesium is best for constipation on a GLP-1?',
        a: 'Magnesium citrate and oxide have a laxative effect; oxide improved chronic constipation in a placebo-controlled trial [11], and the advisory names citrate for GLP-1-related constipation [4]. Glycinate is marketed as a gentler form and has not been tested as a laxative, so it is not the form to pick for constipation. Check with your doctor first if you have kidney disease [10].',
      },
      {
        q: 'Why is my hair falling out on a GLP-1, and will biotin help?',
        a: 'Hair shedding was reported in 3% to 5% of people in trials, and the tirzepatide label links it to weight reduction [5][6]; rapid weight loss and low protein can trigger temporary shedding called telogen effluvium [14]. Biotin only helps if you are deficient [15][16]. Eating enough protein and checking iron levels with your doctor are better first steps.',
      },
      {
        q: 'How much water should I drink on a GLP-1?',
        a: 'A reasonable starting point is about 2.2 L of drinks a day for women and 3 L for men, more if you exercise, it is hot, or you have vomiting or diarrhea [7]. Dehydration from stomach side effects can harm the kidneys [5][6].',
      },
      {
        q: 'Can supplements replace GLP-1 medications?',
        a: 'No. No supplement has been shown to work like semaglutide or tirzepatide, and supplements are not approved by the FDA to treat obesity or any disease [18]. Products sold as “natural Ozempic” should not replace a prescribed medication.',
      },
    ],
    sources: [
      { label: 'Wilding JPH et al. New England Journal of Medicine, 2021', title: 'Once-weekly semaglutide in adults with overweight or obesity (STEP 1)', url: 'https://pubmed.ncbi.nlm.nih.gov/33567185/' },
      { label: 'Jastreboff AM et al. New England Journal of Medicine, 2022', title: 'Tirzepatide once weekly for the treatment of obesity (SURMOUNT-1)', url: 'https://pubmed.ncbi.nlm.nih.gov/35658024/' },
      { label: 'Look M et al. Diabetes, Obesity and Metabolism, 2025', title: 'Body composition changes during weight reduction with tirzepatide in the SURMOUNT-1 study of adults with obesity or overweight', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11965027/' },
      { label: 'Mozaffarian D et al. American Journal of Clinical Nutrition, 2025', title: 'Nutritional priorities to support GLP-1 therapy for obesity: a joint Advisory from the American College of Lifestyle Medicine, the American Society for Nutrition, the Obesity Medicine Association, and The Obesity Society', url: 'https://doi.org/10.1016/j.ajcnut.2025.04.023' },
      { label: 'US Food and Drug Administration, revised 08/2025', title: 'WEGOVY (semaglutide) injection: prescribing information', url: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2025/215256s024lbl.pdf' },
      { label: 'US Food and Drug Administration, revised 03/2024', title: 'ZEPBOUND (tirzepatide) injection: prescribing information', url: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2024/217806s003lbl.pdf' },
      { label: 'National Academies (Institute of Medicine), 2004', title: 'Report sets dietary intake levels for water, salt, and potassium to maintain health and reduce chronic disease risk', url: 'https://www.nationalacademies.org/news/report-sets-dietary-intake-levels-for-water-salt-and-potassium-to-maintain-health-and-reduce-chronic-disease-risk' },
      { label: 'US Departments of Agriculture and Health and Human Services, 2020', title: 'Dietary Guidelines for Americans, 2020–2025 (Appendix 1: daily nutritional goals)', url: 'https://www.dietaryguidelines.gov/sites/default/files/2021-03/Dietary_Guidelines_for_Americans-2020-2025.pdf' },
      { label: 'NIH Office of Dietary Supplements', title: 'Vitamin B12: fact sheet for health professionals', url: 'https://ods.od.nih.gov/factsheets/VitaminB12-HealthProfessional/' },
      { label: 'NIH Office of Dietary Supplements', title: 'Magnesium: fact sheet for health professionals', url: 'https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/' },
      { label: 'Morishita D et al. American Journal of Gastroenterology, 2021', title: 'Senna versus magnesium oxide for the treatment of chronic constipation: a randomized, placebo-controlled trial', url: 'https://pubmed.ncbi.nlm.nih.gov/32969946/' },
      { label: 'Viljoen E et al. Nutrition Journal, 2014', title: 'A systematic review and meta-analysis of the effect and safety of ginger in the treatment of pregnancy-associated nausea and vomiting', url: 'https://pubmed.ncbi.nlm.nih.gov/24642205/' },
      { label: 'National Center for Complementary and Integrative Health (NIH)', title: 'Ginger: usefulness and safety', url: 'https://www.nccih.nih.gov/health/ginger' },
      { label: 'Hughes EC et al. StatPearls (NCBI Bookshelf), 2024', title: 'Telogen effluvium', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430848/' },
      { label: 'Patel DP et al. Skin Appendage Disorders, 2017', title: 'A review of the use of biotin for hair loss', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5582478/' },
      { label: 'NIH Office of Dietary Supplements', title: 'Biotin: fact sheet for health professionals', url: 'https://ods.od.nih.gov/factsheets/Biotin-HealthProfessional/' },
      { label: 'US Food and Drug Administration', title: 'Biotin interference with troponin lab tests: assays subject to biotin interference', url: 'https://www.fda.gov/medical-devices/in-vitro-diagnostics/biotin-interference-troponin-lab-tests-assays-subject-biotin-interference' },
      { label: 'US Food and Drug Administration', title: 'Questions and answers on dietary supplements', url: 'https://www.fda.gov/food/information-consumers-using-dietary-supplements/questions-and-answers-dietary-supplements' },
      { label: 'Federal Trade Commission, 2022', title: 'Health products compliance guidance', url: 'https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance' },
      { label: 'US Food and Drug Administration', title: 'FDA’s concerns with unapproved GLP-1 drugs used for weight loss', url: 'https://www.fda.gov/drugs/drug-alerts-and-statements/fdas-concerns-unapproved-glp-1-drugs-used-weight-loss' },
    ],
    relatedProducts: [],
    relatedGoals: [],
  },
  {
    slug: 'magnesium',
    ingredient: 'Magnesium',
    metaTitle: 'Magnesium: Benefits, Forms, Dosage & Side Effects',
    metaDescription:
      'Magnesium glycinate vs citrate vs oxide, what trials show for sleep, cramps, blood pressure and migraine, the 350 mg supplement limit, and drug interactions.',
    published: '2026-10-30',
    updated: '2026-10-30',
    summary:
      'Magnesium is an essential mineral that adults need at 310–420 mg a day, and about half of Americans get less than they need from food [1]. In trials, supplements modestly lowered blood pressure (about 2 mmHg) and helped constipation at laxative doses, while results for sleep were small and mixed, and they did not help most leg cramps [3][5][9][11][18]. Keep supplemental magnesium at or below 350 mg a day unless a doctor advises more, and check with your doctor first if you have kidney disease [1].',
    quickFacts: [
      { label: 'What it is', value: 'An essential mineral used by more than 300 enzyme systems' },
      { label: 'Daily need (RDA)', value: '310–320 mg (women), 400–420 mg (men)' },
      { label: 'Upper limit from supplements', value: '350 mg a day for adults (food not counted)' },
      { label: 'Strongest evidence', value: 'Small blood-pressure reduction (moderate)' },
      { label: 'Main risk', value: 'Diarrhea; toxic build-up with kidney disease' },
      { label: 'Avoid if', value: 'Kidney disease, unless your doctor advises it' },
    ],
    whatItIs: [
      'Magnesium is a mineral the body uses in more than 300 enzyme systems, including those for muscle and nerve function, blood sugar control, blood pressure, energy production and bone. An adult body holds about 25 g, 50% to 60% of it in bone. Less than 1% is in the blood, so a normal blood test does not rule out low body stores [1].',
      'The RDA is 400 mg for men aged 19–30 and 420 mg from age 31, and 310 mg for women aged 19–30 and 320 mg from age 31 (350–360 mg in pregnancy). The Daily Value on labels is 420 mg [1].',
      'Food sources include pumpkin seeds (156 mg per ounce), chia seeds (111 mg per ounce), almonds (80 mg per ounce), boiled spinach (78 mg per ½ cup), cashews (74 mg), black beans (60 mg per ½ cup), edamame, peanut butter, whole grains and soymilk. Tap and mineral water can add anywhere from 1 to more than 120 mg per liter. The body absorbs about 30% to 40% of the magnesium in food [1].',
      'Elemental vs compound weight: supplements contain magnesium bound to another molecule, such as glycine, citrate or oxide. The Supplement Facts panel must list the elemental magnesium, not the weight of the whole compound [1]. Magnesium oxide is about 60% magnesium by weight, so 414 mg of oxide provides about 250 mg of magnesium [2][4]. Magnesium bisglycinate is only about 14% magnesium: in one trial, an 893 mg capsule provided 125 mg [3]. Magnesium L-threonate is about 7.5%, or 75 mg per gram [7]. That is why 2,500 mg of a glycinate compound gives only a few hundred milligrams of magnesium, and why the elemental figure is the number to compare.',
      'Glycinate and bisglycinate are usually the same thing: magnesium bound to two molecules of the amino acid glycine (also called a chelate). It is sometimes listed as diglycinate [3][23].',
      'Forms compared: the comparison data are thin. Most studies are small, short and measure blood or urine magnesium after a dose rather than any health outcome. A 2021 systematic review found only 14 studies comparing forms. Overall, organic forms (such as citrate) were absorbed better than inorganic ones (such as oxide), absorption depended on the dose, and all forms could maintain normal levels in healthy people [24]. How a tablet is made also matters: lab tests of 15 commercial products found very wide differences in how well they dissolved [2].',
      'Glycinate (bisglycinate): in a 12-person study of people who had part of their small intestine removed, absorption was about equal to oxide overall (23.5% vs 22.8%), but double that of oxide (23.5% vs 11.8%) in the 4 people with the poorest absorption, and it was better tolerated by all [23]. In a 60-day trial of 46 healthy adults, an amino-acid chelate was absorbed better than oxide [20]. It is the form most often chosen to avoid a laxative effect, though no large trial has compared its gut tolerance with citrate.',
      'Citrate: dissolves well even in water (55%, while oxide barely dissolves) and was absorbed better than oxide in several small studies [20][22]. In the 60-day trial, citrate raised blood magnesium more than the chelate or oxide [20]. It has a laxative effect at higher doses [1].',
      'Oxide: the most magnesium per gram (about 60%), but poorly soluble, with fractional absorption of only about 4% in one study [2][21]. In the 60-day trial it did no better than placebo [20]. Still, it was the main form used in many blood-sugar trials and in the constipation trials, where poor absorption is the point [12][18].',
      'Chloride: dissolves well and was absorbed about as well as lactate and aspartate, and better than oxide [21]. It is among the forms most often reported to cause diarrhea [1].',
      'L-threonate (Magtein): only about 7.5% magnesium, so 1–2 g provides about 75–150 mg [7]. Small trials reported better scores on memory tests and some sleep measures [7][8]. Whether it beats cheaper forms in people has not been tested.',
      'Malate: we found no human study comparing its absorption with other forms. A mouse study that included malate found that citrate raised muscle and brain magnesium at every dose tested [26], and in fibromyalgia, magnesium with malic acid made little or no difference to pain [25].',
      'Magnesium is also the active ingredient in some laxatives and antacids. Milk of magnesia provides 500 mg of magnesium per tablespoon, and this counts toward your total if you also take a supplement [1].',
    ],
    benefits: [
      {
        title: 'Blood pressure',
        evidence: 'Moderate',
        text:
          'A meta-analysis of 34 double-blind, placebo-controlled trials (2,028 adults) found that a median 368 mg a day for a median of 3 months lowered systolic blood pressure by 2.00 mmHg and diastolic by 1.78 mmHg compared with placebo. About 300 mg a day for 1 month was enough to raise blood magnesium and lower blood pressure [11]. An earlier Cochrane review of 12 trials in 545 people with high blood pressure found only a 2.2 mmHg drop in diastolic pressure [1]. In 2022 the FDA allowed a qualified health claim that diets with adequate magnesium may reduce the risk of high blood pressure, while noting that the evidence is inconsistent and inconclusive [1].',
      },
      {
        title: 'Sleep',
        evidence: 'Limited',
        text:
          'In a 4-week trial of 155 adults aged 18–65 with self-reported poor sleep, 250 mg of magnesium (as bisglycinate) taken before bed lowered Insomnia Severity Index scores by 3.9 points versus 2.3 with placebo. The effect was small (Cohen’s d 0.2), and other mood and sleep questionnaires did not change [3]. In older adults with insomnia, an 8-week trial of 46 people found that 500 mg of magnesium a day (as oxide) improved insomnia scores, sleep efficiency and time to fall asleep, but not total sleep time [4]. A 2021 meta-analysis of 3 trials in 151 older adults found people fell asleep 17 minutes faster than with placebo. Total sleep time rose by 16 minutes, which was not statistically significant, and the authors rated the evidence low to very low quality [5]. A 2023 systematic review called the trial results contradictory [6]. Two small trials of magnesium L-threonate (1–2 g a day for 3–6 weeks) found better scores on some sleep questionnaires and ring-tracker measures, but the larger one found no difference in tracker-measured sleep [7][8].',
      },
      {
        title: 'Blood sugar and insulin sensitivity',
        evidence: 'Limited',
        text:
          'A 2021 meta-analysis of 25 double-blind trials, mostly using magnesium oxide for a median of 12–14 weeks, found lower fasting glucose in people with diabetes (standardized mean difference −0.43) and in people at high risk of diabetes (−0.34). In the high-risk group, insulin resistance (HOMA-IR) also improved slightly. HbA1c, a measure of long-term blood sugar, did not change, and results varied widely between studies [12]. The American Diabetes Association says there is not enough evidence to recommend magnesium for blood sugar control [1]. People with diabetes lose more magnesium in their urine, so low levels are more common [1].',
      },
      {
        title: 'Migraine',
        evidence: 'Limited',
        text:
          'In a 12-week trial of 81 adults with migraine, 600 mg of magnesium a day (as trimagnesium dicitrate) cut attack frequency by 41.6% versus 15.8% with placebo. Diarrhea affected 18.6% of people taking it [13]. The American Academy of Neurology and American Headache Society rated magnesium "probably effective" for migraine prevention in 2012 [14], while a 2018 systematic review of 5 trials rated it "possibly effective" [15]. Doses used for migraine are above the 350 mg upper limit, so use them only under a doctor’s supervision [1].',
      },
      {
        title: 'Constipation (oxide and citrate)',
        evidence: 'Limited',
        text:
          'Magnesium oxide and citrate draw water into the bowel and work as osmotic laxatives [1]. In a 28-day trial of 90 adults with chronic constipation, 1.5 g a day of magnesium oxide improved symptoms in 68.3% of people versus 11.7% with placebo [18]. In a smaller 28-day trial of 34 women, 1.5 g a day improved symptoms in 70.6% versus 25.0% [19]. Both trials were in Japan, and these doses are well above the 350 mg upper limit, which is set because of diarrhea [1]. Glycinate is not intended for this purpose.',
      },
      {
        title: 'Anxiety and stress',
        evidence: 'Limited',
        text:
          'A 2017 systematic review of 18 studies found that about half reported less anxiety with magnesium in people prone to anxiety, such as those with mild anxiety or premenstrual symptoms. It found no effect on postpartum anxiety, rated the quality of the evidence as poor, and found no study that measured stress with a validated scale [16]. In an 8-week trial of 264 stressed adults with low-normal blood magnesium, stress scores fell by 42% with 300 mg of magnesium a day and 45% with magnesium plus vitamin B6, but there was no placebo group, so the effect of magnesium itself is unclear [17].',
      },
      {
        title: 'Muscle cramps',
        evidence: 'Insufficient',
        text:
          'A 2020 Cochrane review of 11 trials (735 people) concluded that magnesium is unlikely to provide clinically meaningful relief for typical leg cramps in older adults. The weekly cramp count changed by only 0.18 cramps compared with placebo (5 trials, 307 people) [9]. In a 4-week trial of 94 adults with nightly leg cramps, cramps fell by 3.4 a week with magnesium oxide and 3.0 a week with placebo, a difference that was not significant [10]. Results for cramps in pregnancy were conflicting, and no trials have tested exercise-related cramps [9].',
      },
    ],
    dosage: [
      'Start with food. Adults need 310–420 mg a day in total, and diets rich in seeds, nuts, beans, leafy greens and whole grains can supply most of it [1].',
      'Upper limit: for adults the UL is 350 mg a day from supplements and medicines combined. It does not include magnesium from food, and it is set to avoid diarrhea [1]. For children it is 65 mg (ages 1–3) and 110 mg (ages 4–8) [1]. Europe uses a lower limit of 250 mg a day [2].',
      'Studied doses: 250 mg a day for sleep, 300–370 mg a day for blood pressure, and 600 mg a day for migraine, where the higher dose needs medical supervision [1][3][11][13].',
      'Timing: sleep trials gave magnesium 30–60 minutes before bed, or 2 hours before bed for threonate [3][7]. One trial split the dose into 250 mg twice a day [4].',
      'Time to effect: in the bisglycinate sleep trial, most of the improvement came within the first 14 days [3]. Blood-pressure effects appeared after about a month [11], and migraine results were measured after 9–12 weeks [13].',
      'Read the elemental amount, not the compound weight, and add up magnesium from all your supplements, antacids and laxatives [1].',
      'Talk to your doctor before starting, especially if you take any medication or have a medical condition.',
    ],
    sideEffects: [
      'Magnesium from food is not a concern in healthy people, because the kidneys remove the excess [1].',
      'Supplements can cause diarrhea, nausea and stomach cramps, especially at high doses. Carbonate, chloride, gluconate and oxide are the forms most often reported to cause diarrhea [1]. In the Cochrane cramp review, stomach side effects such as diarrhea affected 11% to 37% of people taking oral magnesium, compared with 10% to 14% on placebo [9].',
      'In a 4-week trial of 250 mg of magnesium as bisglycinate, 93% of people reported no side effects [3]. Threonate was well tolerated in its trials [7][8].',
      'Magnesium toxicity is rare and mostly linked to very high doses of laxatives or antacids (usually above 5,000 mg a day). Symptoms include low blood pressure, nausea, vomiting, facial flushing, lethargy, muscle weakness, trouble breathing and an irregular heartbeat. Deaths have been reported, including a toddler and an older man. The risk is much higher if your kidneys do not work well [1].',
      'Signs of low magnesium include loss of appetite, nausea, fatigue and weakness, followed by numbness, tingling, muscle cramps and abnormal heart rhythms. Deficiency is uncommon in healthy people [1].',
    ],
    interactions: [
      'Bisphosphonates for osteoporosis (for example alendronate): magnesium can reduce their absorption. Take magnesium at least 2 hours before or after them [1].',
      'Tetracycline antibiotics (for example doxycycline) and quinolone antibiotics (for example ciprofloxacin and levofloxacin): magnesium binds to them. Take the antibiotic at least 2 hours before, or 4–6 hours after, a magnesium supplement [1].',
      'Proton pump inhibitors (for example esomeprazole and lansoprazole): taken for more than a year, they can cause low magnesium. In cases the FDA reviewed, supplements often raised levels, but 25% of people had to stop the PPI. Your doctor may check your magnesium levels [1].',
      'Diuretics: loop diuretics (for example furosemide) and thiazides (for example hydrochlorothiazide) increase magnesium loss in urine. Potassium-sparing diuretics (for example spironolactone and amiloride) reduce it, so magnesium can build up [1].',
      'Magnesium-containing laxatives and antacids (for example milk of magnesia): these add to your total intake and can push you well past the upper limit [1].',
      'High-dose zinc: 142 mg a day of zinc from supplements interfered with magnesium absorption in one study [1].',
    ],
    avoidIf: [
      'You have kidney disease or reduced kidney function, unless your doctor prescribes it. The kidneys clear excess magnesium, and toxicity risk rises when they do not work well [1]',
      'You take a bisphosphonate or a tetracycline or quinolone antibiotic and cannot space the doses as described above [1]',
      'You take a potassium-sparing diuretic, or already use magnesium laxatives or antacids, without checking your total intake with your doctor [1]',
      'You are considering doses above 350 mg a day (for example for migraine or constipation) without medical supervision [1]',
      'You are buying for a child: the upper limit is much lower (65–110 mg a day under age 9) [1]',
      'You are pregnant or breastfeeding: magnesium needs rise slightly, but ask your doctor before adding a supplement [1]',
    ],
    howToChoose: [
      'Elemental magnesium stated per serving, with the compound named (for example "magnesium (as magnesium bisglycinate)"). Compare products on the elemental number, not the compound weight [1].',
      'A dose at or below 350 mg of elemental magnesium a day, including any multivitamin, unless your doctor advises more [1].',
      'Form that fits the goal: oxide or citrate if you want a laxative effect, and glycinate or another chelate if you want magnesium without one [1][18][23].',
      'Third-party tested, with a certificate of analysis available on request. Lab tests of 15 commercial magnesium products found very wide differences in how well they dissolved [2].',
      '"Magnesium complex" or "proprietary blend" labels that do not list each form and amount make it hard to know what you are getting.',
      'No claims to cure insomnia, anxiety, migraine, diabetes or high blood pressure. Under US law supplements cannot make those claims.',
    ],
    faqs: [
      {
        q: 'What does magnesium do for your body?',
        a: 'Magnesium supports more than 300 enzyme systems, including those for muscle and nerve function, blood sugar, blood pressure, energy and bone [1]. In trials, supplements modestly lowered blood pressure and helped constipation at laxative doses; effects on sleep were small [3][11][18].',
      },
      {
        q: 'Which form of magnesium is best?',
        a: 'It depends on the goal, and there are few head-to-head studies. Dissolvable forms such as citrate, chloride and lactate are absorbed better than oxide [1][21][22]. Glycinate is often chosen to avoid loose stools, while oxide and citrate are used as laxatives [1][23].',
      },
      {
        q: 'Is magnesium glycinate or citrate better?',
        a: 'No trial has compared them directly for absorption in healthy people. In one 60-day trial, citrate and an amino-acid chelate were both absorbed better than oxide, with citrate raising blood levels most [20]. Citrate is more likely to loosen stools [1].',
      },
      {
        q: 'Does magnesium help you sleep?',
        a: 'Possibly a little. In a 4-week trial, 250 mg as bisglycinate improved insomnia scores slightly more than placebo [3]. In older adults, a meta-analysis found people fell asleep about 17 minutes faster, but the evidence was low quality [5].',
      },
      {
        q: 'How much magnesium should I take a day?',
        a: 'Adults need 310–420 mg a day in total from food and supplements [1]. Supplements and medicines combined should stay at or below 350 mg a day unless a doctor advises more [1].',
      },
      {
        q: 'Does magnesium help leg cramps?',
        a: 'For most people, no. A Cochrane review found that magnesium is unlikely to meaningfully reduce typical leg cramps in older adults [9]. Evidence in pregnancy is conflicting [9].',
      },
      {
        q: 'Is it safe to take magnesium every day?',
        a: 'For most healthy adults, daily magnesium at or below 350 mg is considered safe; the most common side effect is diarrhea [1]. People with kidney disease should only take it under medical advice [1].',
      },
      {
        q: 'Who is most likely to be low in magnesium?',
        a: 'Older adults, people with type 2 diabetes, people with digestive conditions such as Crohn’s or celiac disease, and people with alcohol dependence [1]. Long-term use of PPIs or loop and thiazide diuretics can also lower magnesium [1].',
      },
    ],
    sources: [
      { label: 'NIH Office of Dietary Supplements', title: 'Magnesium: fact sheet for health professionals', url: 'https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/' },
      { label: 'Blancquaert L et al. Nutrients, 2019', title: 'Predicting and testing bioavailability of magnesium supplements', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6683096/' },
      { label: 'Schuster J et al. Nature and Science of Sleep, 2025', title: 'Magnesium bisglycinate supplementation in healthy adults reporting poor sleep: a randomized, placebo-controlled trial', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12412596/' },
      { label: 'Abbasi B et al. Journal of Research in Medical Sciences, 2012', title: 'The effect of magnesium supplementation on primary insomnia in elderly: a double-blind placebo-controlled clinical trial', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3703169/' },
      { label: 'Mah J, Pitre T. BMC Complementary Medicine and Therapies, 2021', title: 'Oral magnesium supplementation for insomnia in older adults: a systematic review & meta-analysis', url: 'https://pubmed.ncbi.nlm.nih.gov/33865376/' },
      { label: 'Arab A et al. Biological Trace Element Research, 2023', title: 'The role of magnesium in sleep health: a systematic review of available literature', url: 'https://pubmed.ncbi.nlm.nih.gov/35184264/' },
      { label: 'Hausenblas HA et al. Sleep Medicine: X, 2024', title: 'Magnesium-L-threonate improves sleep quality and daytime functioning in adults with self-reported sleep problems: a randomized controlled trial', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11381753/' },
      { label: 'Lopresti AL, Smith SJ. Frontiers in Nutrition, 2026', title: 'The effects of magnesium L-threonate (Magtein) on cognitive performance and sleep quality in adults: a randomised, double-blind, placebo-controlled trial', url: 'https://pubmed.ncbi.nlm.nih.gov/41601871/' },
      { label: 'Garrison SR et al. Cochrane Database of Systematic Reviews, 2020', title: 'Magnesium for skeletal muscle cramps', url: 'https://pubmed.ncbi.nlm.nih.gov/32956536/' },
      { label: 'Roguin Maor N et al. JAMA Internal Medicine, 2017', title: 'Effect of magnesium oxide supplementation on nocturnal leg cramps: a randomized clinical trial', url: 'https://pubmed.ncbi.nlm.nih.gov/28241153/' },
      { label: 'Zhang X et al. Hypertension, 2016', title: 'Effects of magnesium supplementation on blood pressure: a meta-analysis of randomized double-blind placebo-controlled trials', url: 'https://pubmed.ncbi.nlm.nih.gov/27402922/' },
      { label: 'Veronese N et al. Nutrients, 2021', title: 'Oral magnesium supplementation for treating glucose metabolism parameters in people with or at risk of diabetes: a systematic review and meta-analysis of double-blind randomized controlled trials', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8619199/' },
      { label: 'Peikert A et al. Cephalalgia, 1996', title: 'Prophylaxis of migraine with oral magnesium: results from a prospective, multi-center, placebo-controlled and double-blind randomized study', url: 'https://pubmed.ncbi.nlm.nih.gov/8792038/' },
      { label: 'Holland S et al. Neurology, 2012', title: 'Evidence-based guideline update: NSAIDs and other complementary treatments for episodic migraine prevention in adults', url: 'https://pubmed.ncbi.nlm.nih.gov/22529203/' },
      { label: 'von Luckner A, Riederer F. Headache, 2018', title: 'Magnesium in migraine prophylaxis: is there an evidence-based rationale? A systematic review', url: 'https://pubmed.ncbi.nlm.nih.gov/29131326/' },
      { label: 'Boyle NB et al. Nutrients, 2017', title: 'The effects of magnesium supplementation on subjective anxiety and stress: a systematic review', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5452159/' },
      { label: 'Pouteau E et al. PLoS One, 2018', title: 'Superiority of magnesium and vitamin B6 over magnesium alone on severe stress in healthy adults with low magnesemia: a randomized, single-blind clinical trial', url: 'https://pubmed.ncbi.nlm.nih.gov/30562392/' },
      { label: 'Morishita D et al. American Journal of Gastroenterology, 2021', title: 'Senna versus magnesium oxide for the treatment of chronic constipation: a randomized, placebo-controlled trial', url: 'https://pubmed.ncbi.nlm.nih.gov/32969946/' },
      { label: 'Mori S et al. Journal of Neurogastroenterology and Motility, 2019', title: 'A randomized double-blind placebo-controlled trial on the effect of magnesium oxide in patients with chronic constipation', url: 'https://pubmed.ncbi.nlm.nih.gov/31587548/' },
      { label: 'Walker AF et al. Magnesium Research, 2003', title: 'Mg citrate found more bioavailable than other Mg preparations in a randomised, double-blind study', url: 'https://pubmed.ncbi.nlm.nih.gov/14596323/' },
      { label: 'Firoz M, Graber M. Magnesium Research, 2001', title: 'Bioavailability of US commercial magnesium preparations', url: 'https://pubmed.ncbi.nlm.nih.gov/11794633/' },
      { label: 'Lindberg JS et al. Journal of the American College of Nutrition, 1990', title: 'Magnesium bioavailability from magnesium citrate and magnesium oxide', url: 'https://pubmed.ncbi.nlm.nih.gov/2407766/' },
      { label: 'Schuette SA et al. Journal of Parenteral and Enteral Nutrition, 1994', title: 'Bioavailability of magnesium diglycinate vs magnesium oxide in patients with ileal resection', url: 'https://pubmed.ncbi.nlm.nih.gov/7815675/' },
      { label: 'Pardo MR et al. Nutrition, 2021', title: 'Bioavailability of magnesium food supplements: a systematic review', url: 'https://pubmed.ncbi.nlm.nih.gov/34111673/' },
      { label: 'Ferreira I et al. Medwave, 2019', title: 'Magnesium and malic acid supplement for fibromyalgia', url: 'https://pubmed.ncbi.nlm.nih.gov/31150373/' },
      { label: 'Ates M et al. Biological Trace Element Research, 2019', title: 'Dose-dependent absorption profile of different magnesium compounds', url: 'https://pubmed.ncbi.nlm.nih.gov/30761462/' },
    ],
    relatedProducts: ['magnesium-complex'],
    relatedGoals: ['sleep-stress', 'muscle-performance'],
  },
  {
    slug: 'coq10',
    ingredient: 'CoQ10',
    metaTitle: 'CoQ10: Benefits, Dosage, Side Effects & Interactions',
    metaDescription:
      'What research says about CoQ10 for heart health, statin aches, migraine and energy, ubiquinol vs ubiquinone, studied doses (100–300 mg) and the warfarin risk.',
    published: '2026-10-30',
    updated: '2026-10-30',
    summary:
      'CoQ10 (coenzyme Q10) is a vitamin-like compound your body makes and uses to produce energy in cells; levels in most organs fall after about age 20 [17]. The most-cited trial, in people with heart failure, found fewer major heart events over 2 years with 300 mg a day, but reviews still call the evidence inconclusive, and results for statin muscle aches, blood pressure and energy are mixed or null [1][2][3]. It is well tolerated, but it may reduce the effect of warfarin and may not be compatible with some cancer treatments [1][23].',
    quickFacts: [
      { label: 'What it is', value: 'A fat-soluble compound the body makes and uses for cell energy' },
      { label: 'Typical dose in studies', value: '100–300 mg per day, with a meal that contains fat' },
      { label: 'Strongest evidence', value: 'Heart failure outcomes in one large trial (limited)' },
      { label: 'Main risk', value: 'May reduce the effect of warfarin' },
      { label: 'Avoid if', value: 'On warfarin or cancer treatment without your doctor’s OK; pregnant' },
    ],
    whatItIs: [
      'Coenzyme Q10 (CoQ10), also called ubiquinone or ubidecarenone, is a fat-soluble substance made by the body. It is found in the highest amounts in the heart, liver, kidneys and pancreas [1]. Inside mitochondria, the energy factories of cells, it shuttles electrons in the chain of reactions that makes ATP, the cell’s energy currency, and it also works as an antioxidant [3].',
      'Levels fall with age. In a study of human organs from people aged 1 day to 81 years, CoQ10 in most organs peaked at about age 20 and then declined steadily [17]. Statins (cholesterol drugs such as simvastatin and atorvastatin) also lower blood levels of CoQ10, because they block a step the body uses to make it [23][27].',
      'Food supplies only a little. Meat, fish, nuts and some oils are the richest sources, and the average diet provides only about 3–6 mg a day [22]. Supplements typically provide 100–200 mg per serving.',
      'CoQ10 comes in two forms. Ubiquinone is the oxidized form used in most research, including the large heart failure trial [2][21]. Ubiquinol is the reduced form, often sold as more absorbable. The body converts one into the other: in a crossover study in older adults, CoQ10 appeared in the blood mostly as ubiquinol even when people swallowed ubiquinone [20].',
      'It is measured in milligrams (mg). CoQ10 is not a vitamin, and there is no recommended daily intake, because the body normally makes what it needs.',
    ],
    benefits: [
      {
        title: 'Heart function in people with heart failure',
        evidence: 'Limited',
        text:
          'In Q-SYMBIO, 420 people with moderate to severe heart failure took 100 mg of CoQ10 3 times a day (300 mg) or placebo on top of their usual treatment for 2 years [2]. Symptoms, walking distance and a heart-strain blood marker did not change at 16 weeks. Over 2 years, 15% of the CoQ10 group had a major heart event versus 26% on placebo, and 10% versus 18% died from any cause [2]. A 2021 Cochrane review rated this finding as moderate-quality evidence, but noted that it rests on one trial, that most other studies were small and at risk of bias, and concluded there is no convincing evidence to support or refute CoQ10 for heart failure [3]. A 2024 meta-analysis of 33 trials reached more positive conclusions [4]. NCCIH calls the evidence inconclusive [1]. These results come from people under medical care; CoQ10 is not a substitute for heart failure treatment.',
      },
      {
        title: 'Muscle aches on statins',
        evidence: 'Limited',
        text:
          'Results conflict. A 2015 meta-analysis of 6 trials (302 people) found no significant effect on muscle pain or on creatine kinase, a muscle-damage marker [5]. A 2018 meta-analysis of 12 trials (575 people) found lower scores for muscle pain, weakness, cramps and tiredness, but no change in creatine kinase [6]. In one of the most careful trials, 41 people whose muscle pain was confirmed by a blinded statin challenge took 600 mg of ubiquinol a day or placebo with simvastatin for 8 weeks. Blood CoQ10 quadrupled, but pain did not improve [7]. NCCIH says the overall evidence does not support CoQ10 for statin muscle pain [1].',
      },
      {
        title: 'Blood pressure',
        evidence: 'Insufficient',
        text:
          'A 2016 Cochrane review could pool only 2 well-run trials (50 people). CoQ10 did not significantly change blood pressure: systolic was 3.7 mmHg lower and diastolic 2.0 mmHg lower than placebo, both within the range of chance. The reviewers concluded, with moderate-quality evidence, that it has no clinically significant effect [8]. An older 2007 meta-analysis reported drops of up to 17 mmHg systolic, but 8 of its 12 studies had no placebo group [9]. NCCIH says CoQ10 probably does not have a meaningful effect on blood pressure [1].',
      },
      {
        title: 'Migraine frequency',
        evidence: 'Limited',
        text:
          'In a 3-month randomized, placebo-controlled trial of 42 people with migraine, 100 mg 3 times a day (300 mg) cut attack frequency by at least half in 47.6% of people, versus 14.4% on placebo; the difference showed in the third month [10]. A 2021 meta-analysis of 6 trials (371 adults) found about 1.5 fewer attacks a month than control, shorter attacks, and no change in pain severity [11]. A 2012 guideline from the American Academy of Neurology and the American Headache Society rated CoQ10 as “possibly effective” (Level C) for preventing episodic migraine [12]. Trials were small, and doses ranged widely [11].',
      },
      {
        title: 'Fatigue and exercise',
        evidence: 'Limited',
        text:
          'A 2022 meta-analysis of 13 trials (1,126 people) found a small to moderate reduction in fatigue scores with CoQ10 (Hedges’ g −0.40), with larger effects at higher doses and longer use [14]. Exercise performance is less clear. A 2025 meta-analysis of 24 trials in healthy adults found that CoQ10 reliably raised blood levels but had at most modest, inconsistent effects on performance, and rated the certainty as very low to low [15]. In a small crossover study, 17 healthy adults took 100 mg, 300 mg or placebo for 8 days; at 300 mg they felt less tired and kept more of their sprint speed during a long, fatiguing cycling task [13].',
      },
      {
        title: 'Sperm quality (men)',
        evidence: 'Limited',
        text:
          'A 2025 meta-analysis of 9 randomized trials (781 men with unexplained infertility) found that CoQ10 raised sperm concentration by about 10 million/mL, total motility by about 5 percentage points and semen volume by 0.17 mL compared with control. The odds of a clinical pregnancy were also higher, though the estimate was imprecise (odds ratio 6.0, 95% CI 2.0 to 18.4), and sperm shape improved only with more than 3 months of use [16]. Several trials combined CoQ10 with other antioxidants [16]. NCCIH considers the research on male infertility too limited for conclusions [1].',
      },
      {
        title: 'Healthy aging and falling levels',
        evidence: 'Early',
        text:
          'CoQ10 levels in most organs decline after about age 20 [17], which is the main reason it is marketed for aging. A falling level does not by itself prove that a supplement helps. In KiSel-10, 443 healthy Swedes aged 70–88 took 200 mg of CoQ10 plus 200 µg of selenium a day, or placebo, for 4 years. Cardiovascular deaths were 5.9% versus 12.6% over about 5 years [18]. CoQ10 was not tested alone, the study was small, the maker of the study products helped fund it, and the authors call the findings hypothesis-generating [19].',
      },
    ],
    dosage: [
      'Most trials used 100–300 mg a day: 300 mg (100 mg 3 times a day) in the heart failure and migraine trials, and 200 mg a day in the older-adult trial [2][10][19]. Studies of statin muscle aches and sperm quality used a range of doses, up to 600 mg of ubiquinol [7][16].',
      'Take it with a meal that contains some fat. CoQ10 is fat-soluble and is absorbed best with fat, which is also why oil-based softgels tend to be absorbed better than dry powder [23].',
      'Absorption from a single dose is limited. Above about 100 mg a day, splitting the dose between two meals may give higher blood levels than taking it all at once [21].',
      'Blood levels peak about 6 hours after a dose and take 1–2 weeks of daily use to level off [21]. In trials, benefits took longer: the migraine effect appeared in the third month, sperm changes were measured after 3 months or more, and heart failure symptoms had not changed by 16 weeks [2][10][16].',
      'There is no official recommended intake or upper limit; NIH’s Office of Dietary Supplements has not set one. A 2006 risk assessment by authors from a supplement trade association found strong evidence of safety up to 1,200 mg a day [24].',
      'Talk to your doctor before starting, especially if you take any medication or have a medical condition.',
    ],
    sideEffects: [
      'No serious side effects have been reported in trials. The most common are mild: digestive upset, nausea, diarrhea, loss of appetite and trouble sleeping [1][23][27].',
      'Less often reported: heartburn, headache, dizziness, rash, irritability, fatigue and sensitivity to light [23].',
      'In a review of many trials, stomach complaints were no more common at 1,200 mg a day than at 60 mg, which suggests they are often not caused by CoQ10 itself [24]. Raised liver enzymes have been reported with 300 mg a day over long periods, without liver damage [23].',
      'Trouble sleeping has been reported at 100 mg a day or more [23]. If that happens, taking it with breakfast or lunch rather than dinner may help.',
    ],
    interactions: [
      'Warfarin: CoQ10 is chemically similar to vitamin K and may reduce warfarin’s effect, raising the risk of clots [1][23][27]. Case reports describe a weaker warfarin response after starting CoQ10 [26]. A small 4-week crossover trial in 24 people on stable warfarin found no change in INR or warfarin dose with 100 mg a day [25], but because of the case reports, do not start or stop CoQ10 on warfarin without your doctor, and expect your INR to be checked more often.',
      'Blood-pressure medicines (for example ACE inhibitors, ARBs, beta-blockers, calcium channel blockers and diuretics): some older studies reported lower blood pressure with CoQ10, although the best-quality trials found no meaningful effect [8][9]. Check your blood pressure if you combine them.',
      'Insulin and other diabetes medicines: CoQ10 may interact with insulin [1]. A 2026 review of meta-analyses found fasting blood sugar about 5 mg/dL lower with CoQ10 [28]. Monitor your blood sugar and tell your doctor.',
      'Chemotherapy and radiation: as an antioxidant, CoQ10 may make some cancer treatments less effective [1][27]. In mice, it reduced the effect of radiation on tumors, and in a study of 1,134 women with breast cancer, using antioxidant supplements, including CoQ10, before and during chemotherapy was linked to more recurrences [23]. Do not take it during cancer treatment unless your oncologist agrees.',
      'Statins: these lower your body’s CoQ10 levels [23][27]. Raising blood levels with a supplement has not consistently eased statin muscle aches [5][7]. Never stop a statin because of muscle pain without talking to your doctor.',
      'Theophylline (an asthma and lung medicine): CoQ10 has been reported to slow its clearance, which can lead to side effects [27].',
    ],
    avoidIf: [
      'You take warfarin, unless your doctor agrees and checks your INR [1][23]',
      'You are having chemotherapy or radiation, unless your oncologist agrees [1][23]',
      'You take insulin or other diabetes medicines, or blood-pressure medicines, without monitoring and your doctor’s advice [1][28]',
      'You are pregnant or breastfeeding, or for children (not enough safety data)',
      'You have heart failure or another heart condition and would use it instead of prescribed treatment. Talk to your cardiologist; it is not a replacement for medication [3]',
      'You have surgery planned (tell your surgeon about all supplements you take)',
    ],
    howToChoose: [
      'Dose stated in mg per serving, ideally 100–200 mg, to match the doses used in research [2][19].',
      'Ubiquinone is the form used in most trials and usually costs less [2][21]. Ubiquinol is not proven to work better: in a head-to-head study it was not significantly better absorbed than ubiquinone, and the body converts between the two forms [20].',
      'An oil-based softgel, or a capsule taken with a fatty meal. How the CoQ10 is dissolved can matter more than the form: CoQ10 crystals that are not dispersed in oil were absorbed about 75% less in one comparison [21].',
      'Be skeptical of “3x absorption” claims. These usually compare a product with plain powder taken without food, and many absorption studies are funded by manufacturers [21].',
      'Third-party tested (for example USP Verified or NSF Contents Certified), with a certificate of analysis available on request.',
      'No claims to treat heart failure, high blood pressure or migraine, or to replace statins or other medication. Under US law supplements cannot make those claims.',
    ],
    faqs: [
      {
        q: 'What is CoQ10 good for?',
        a: 'CoQ10 helps cells make energy. In trials it was linked to fewer heart events in people with heart failure and fewer migraine attacks, with smaller or mixed results for fatigue and sperm quality [2][11][14][16]. Trials found no meaningful effect on blood pressure [8].',
      },
      {
        q: 'Is ubiquinol better than ubiquinone?',
        a: 'Not clearly. In a head-to-head study in older adults, ubiquinol was not significantly better absorbed, and the body turns ubiquinone into ubiquinol after you swallow it [20]. Most positive trials used ubiquinone [2][21].',
      },
      {
        q: 'Should I take CoQ10 if I am on a statin?',
        a: 'Statins lower CoQ10 levels, but trials disagree on whether a supplement eases statin muscle aches, and a careful trial found no benefit [5][6][7]. It is generally safe to try with your doctor’s agreement; do not stop your statin on your own.',
      },
      {
        q: 'How much CoQ10 should I take a day?',
        a: 'Studies mostly used 100–300 mg a day, taken with meals [2][10]. There is no official recommended dose or upper limit; follow the label and your doctor’s advice.',
      },
      {
        q: 'When is the best time to take CoQ10?',
        a: 'With a meal that contains fat, because it is fat-soluble [23]. Since it can cause trouble sleeping in some people [23], morning or midday may suit you better than evening.',
      },
      {
        q: 'Can I take CoQ10 with warfarin?',
        a: 'Only with your doctor’s approval. CoQ10 may reduce warfarin’s effect, and case reports describe this, although a small trial found no change in INR [1][25][26]. Your INR should be checked more often.',
      },
      {
        q: 'How long does CoQ10 take to work?',
        a: 'Blood levels level off in 1–2 weeks [21], but trial benefits took longer: about 3 months for migraine and sperm quality [10][16]. In heart failure, symptoms had not changed by 16 weeks [2].',
      },
      {
        q: 'Does CoQ10 lower blood pressure?',
        a: 'Probably not meaningfully. A Cochrane review found no clinically significant effect [8], and NCCIH agrees [1]. Do not use it in place of blood-pressure medication.',
      },
    ],
    sources: [
      { label: 'National Center for Complementary and Integrative Health (NCCIH)', title: 'Coenzyme Q10', url: 'https://www.nccih.nih.gov/health/coenzyme-q10' },
      { label: 'Mortensen SA et al. JACC: Heart Failure, 2014', title: 'The effect of coenzyme Q10 on morbidity and mortality in chronic heart failure: results from Q-SYMBIO: a randomized double-blind trial', url: 'https://pubmed.ncbi.nlm.nih.gov/25282031/' },
      { label: 'Al Saadi T et al. Cochrane Database of Systematic Reviews, 2021', title: 'Coenzyme Q10 for heart failure', url: 'https://pubmed.ncbi.nlm.nih.gov/35608922/' },
      { label: 'Xu J et al. BMC Cardiovascular Disorders, 2024', title: 'Efficacy and safety of coenzyme Q10 in heart failure: a meta-analysis of randomized controlled trials', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11515203/' },
      { label: 'Banach M et al. Mayo Clinic Proceedings, 2015', title: 'Effects of coenzyme Q10 on statin-induced myopathy: a meta-analysis of randomized controlled trials', url: 'https://pubmed.ncbi.nlm.nih.gov/25440725/' },
      { label: 'Qu H et al. Journal of the American Heart Association, 2018', title: 'Effects of coenzyme Q10 on statin-induced myopathy: an updated meta-analysis of randomized controlled trials', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6404871/' },
      { label: 'Taylor BA et al. Atherosclerosis, 2015', title: 'A randomized trial of coenzyme Q10 in patients with confirmed statin myopathy', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4298455/' },
      { label: 'Ho MJ et al. Cochrane Database of Systematic Reviews, 2016', title: 'Blood pressure lowering efficacy of coenzyme Q10 for primary hypertension', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6486033/' },
      { label: 'Rosenfeldt FL et al. Journal of Human Hypertension, 2007', title: 'Coenzyme Q10 in the treatment of hypertension: a meta-analysis of the clinical trials', url: 'https://pubmed.ncbi.nlm.nih.gov/17287847/' },
      { label: 'Sándor PS et al. Neurology, 2005', title: 'Efficacy of coenzyme Q10 in migraine prophylaxis: a randomized controlled trial', url: 'https://pubmed.ncbi.nlm.nih.gov/15728298/' },
      { label: 'Sazali S et al. BMJ Open, 2021', title: 'Coenzyme Q10 supplementation for prophylaxis in adult patients with migraine: a meta-analysis', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7786797/' },
      { label: 'Holland S et al. Neurology, 2012 (American Academy of Neurology and American Headache Society)', title: 'Evidence-based guideline update: NSAIDs and other complementary treatments for episodic migraine prevention in adults', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3335449/' },
      { label: 'Mizuno K et al. Nutrition, 2008', title: 'Antifatigue effects of coenzyme Q10 during physical fatigue', url: 'https://pubmed.ncbi.nlm.nih.gov/18272335/' },
      { label: 'Tsai IC et al. Frontiers in Pharmacology, 2022', title: 'Effectiveness of coenzyme Q10 supplementation for reducing fatigue: a systematic review and meta-analysis of randomized controlled trials', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9449413/' },
      { label: 'Deng H et al. British Journal of Nutrition, 2025', title: 'Coenzyme Q10 supplementation increases blood concentrations but shows limited and inconsistent effects on exercise performance: a systematic review and meta-analysis', url: 'https://pubmed.ncbi.nlm.nih.gov/41457257/' },
      { label: 'Bakri S et al. World Journal of Men’s Health, 2025', title: 'Efficacy and safety of coenzyme Q10 in idiopathic male infertility: a systematic review and meta-analysis of randomized trials', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC13646325/' },
      { label: 'Kalén A et al. Lipids, 1989', title: 'Age-related changes in the lipid compositions of rat and human tissues', url: 'https://pubmed.ncbi.nlm.nih.gov/2779364/' },
      { label: 'Alehagen U et al. International Journal of Cardiology, 2013', title: 'Cardiovascular mortality and N-terminal-proBNP reduced after combined selenium and coenzyme Q10 supplementation: a 5-year prospective randomized double-blind placebo-controlled trial among elderly Swedish citizens', url: 'https://pubmed.ncbi.nlm.nih.gov/22626835/' },
      { label: 'Alehagen U et al. PLoS One, 2018', title: 'Still reduced cardiovascular mortality 12 years after supplementation with selenium and coenzyme Q10 for four years', url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0193120' },
      { label: 'Pravst I et al. Nutrients, 2020', title: 'Comparative bioavailability of different coenzyme Q10 formulations in healthy elderly individuals', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7146408/' },
      { label: 'Mantle D, Dybring A. Antioxidants, 2020', title: 'Bioavailability of coenzyme Q10: an overview of the absorption process and subsequent metabolism', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7278738/' },
      { label: 'Pravst I et al. Critical Reviews in Food Science and Nutrition, 2010', title: 'Coenzyme Q10 contents in foods and fortification strategies', url: 'https://pubmed.ncbi.nlm.nih.gov/20301015/' },
      { label: 'National Cancer Institute, updated 2024', title: 'Coenzyme Q10 (PDQ®): health professional version', url: 'https://www.cancer.gov/about-cancer/treatment/cam/hp/coenzyme-q10-pdq' },
      { label: 'Hathcock JN, Shao A. Regulatory Toxicology and Pharmacology, 2006', title: 'Risk assessment for coenzyme Q10 (ubiquinone)', url: 'https://pubmed.ncbi.nlm.nih.gov/16814438/' },
      { label: 'Engelsen J et al. Ugeskrift for Læger, 2003', title: 'Effect of coenzyme Q10 and Ginkgo biloba on warfarin dosage in patients on long-term warfarin treatment: a randomized, double-blind, placebo-controlled cross-over trial', url: 'https://pubmed.ncbi.nlm.nih.gov/12772396/' },
      { label: 'Spigset O. The Lancet, 1994', title: 'Reduced effect of warfarin caused by ubidecarenone', url: 'https://pubmed.ncbi.nlm.nih.gov/7968059/' },
      { label: 'Memorial Sloan Kettering Cancer Center', title: 'Coenzyme Q10 — About Herbs', url: 'https://www.mskcc.org/cancer-care/integrative-medicine/herbs/coenzyme-q10' },
      { label: 'Musazadeh V et al. Endocrinology, Diabetes & Metabolism, 2026', title: 'Effects of coenzyme Q10 supplementation on glycemic control biomarkers: an umbrella review of meta-analyses of randomised controlled trials', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC13093519/' },
    ],
    relatedProducts: ['coq10'],
    relatedGoals: ['energy'],
  },
  {
    slug: 'creatine',
    ingredient: 'Creatine',
    metaTitle: 'Creatine: Benefits, Dosage, Side Effects & Safety',
    metaDescription:
      'What the research says about creatine for strength, muscle and memory, monohydrate vs other forms, 3–5 g dosing vs loading, kidney safety and hair-loss myths.',
    published: '2026-10-30',
    updated: '2026-10-30',
    summary:
      'Creatine is a compound your body makes and gets from meat and fish, and creatine monohydrate is the most-studied sports supplement. Combined with resistance training, 3–5 g a day reliably adds strength and about 1 kg of extra lean mass over several weeks, including in older adults [1][5][6]. Early evidence suggests small memory benefits, and it has not harmed kidney function in healthy people at studied doses, though it can raise creatinine on blood tests [2][8][18].',
    quickFacts: [
      { label: 'What it is', value: 'A compound made from amino acids that recycles energy (ATP) in muscle and brain' },
      { label: 'Typical dose in studies', value: '3–5 g a day, or 20 g a day for 5–7 days to load faster' },
      { label: 'Strongest evidence', value: 'Strength and lean mass with resistance training (moderate)' },
      { label: 'Main side effect', value: 'Weight gain of about 1–3 kg, mostly water, during loading' },
      { label: 'Avoid if', value: 'Kidney disease, bipolar disorder, pregnant, or under 18' },
    ],
    whatItIs: [
      'Creatine is made in the body, mainly in the liver and kidneys, from the amino acids arginine and glycine. Most of it is stored in muscle, where it is bound to phosphate as phosphocreatine. Phosphocreatine rapidly regenerates ATP, the cell’s energy currency, during short, intense efforts such as lifting or sprinting [1].',
      'You need about 1–3 g a day to maintain your stores. About half comes from the diet and the rest is made by the body. Red meat and fish are the main food sources: a pound (454 g) of raw beef or salmon provides about 1–2 g [1].',
      'A normal diet keeps muscle creatine stores about 60–80% full. Supplements raise muscle creatine and phosphocreatine by about 20–40%. Vegetarians and vegans start with lower stores, so they may respond more [1].',
      'Creatine monohydrate is creatine bound to one water molecule; it is about 88% creatine by weight. It is the form used in almost all research, and it has been classified as generally recognized as safe (GRAS) by the FDA [2][22].',
      'Other forms, such as creatine hydrochloride (HCl), creatine ethyl ester and buffered creatine (sold as Kre-Alkalyn), are marketed as better absorbed or gentler. Head-to-head trials have not shown any of them to beat monohydrate [22]. In a 28-day trial of 36 trained adults, buffered creatine at the label dose (1.5 g a day) or at monohydrate doses did not raise muscle creatine, strength or lean mass more than monohydrate, and caused no fewer side effects [19]. In a 7-week trial of 30 men, creatine ethyl ester raised blood creatine less than monohydrate, raised creatinine more, and gave no extra gains [20]. In an 8-week trial of 40 young adults, creatine HCl worked about as well as monohydrate, with no added benefit [21].',
      'Creatine is not a steroid or a hormone. It has a different chemical structure from anabolic steroids and works through the muscle’s energy system [2].',
      'Creatine and creatinine are not the same. Creatinine is the waste product your body makes when it breaks down creatine. Doctors measure it in blood to estimate kidney function, which is why taking creatine can make kidney test results look worse when kidneys are fine [2].',
    ],
    benefits: [
      {
        title: 'Strength and power with resistance training',
        evidence: 'Moderate',
        text:
          'The International Society of Sports Nutrition (ISSN) calls creatine monohydrate the most effective nutritional supplement available for increasing high-intensity exercise capacity during training, with loading improving repeated high-intensity performance by about 10–20% [1]. A 2017 meta-analysis of 53 randomized, placebo-controlled trials (1,138 people) found a small-to-moderate improvement in upper-body strength (effect size 0.32), including bench press, in efforts lasting under 3 minutes. The benefit did not depend on age, sex, dose or training program [4]. Creatine helps most with short, repeated bursts, not long endurance exercise [1].',
      },
      {
        title: 'Lean mass with resistance training',
        evidence: 'Moderate',
        text:
          'A 2022 meta-analysis of 35 randomized trials (1,192 people) found that creatine added 1.10 kg more lean mass than placebo when combined with resistance training. Without exercise, the difference was 0.03 kg, which was not significant [5]. Men gained 1.46 kg more lean mass than with placebo; in women the 0.29 kg difference was not significant [5]. Part of the early gain is water held inside muscle cells, and randomized trials have not found that creatine increases body fat [2].',
      },
      {
        title: 'Muscle and strength in older adults',
        evidence: 'Moderate',
        text:
          'Muscle mass and strength decline with age (sarcopenia). A 2017 meta-analysis of 22 trials in 721 adults with a mean age of 57–70 found that creatine plus resistance training 2–3 days a week for 7–52 weeks added 1.37 kg more lean mass than training alone, and improved chest-press (SMD 0.35) and leg-press (SMD 0.24) strength [6]. An earlier meta-analysis of 357 older adults also found a better result on a 30-second chair-stand test, a measure of everyday function [7]. Most of the benefit comes when creatine is paired with training [2].',
      },
      {
        title: 'Memory and cognition',
        evidence: 'Limited',
        text:
          'A 2024 meta-analysis of 16 randomized trials (492 adults) found a small improvement in memory (SMD 0.31, rated moderate certainty) and faster attention and processing speed (low certainty), but no significant effect on overall cognition or executive function [8]. A 2023 meta-analysis of 8 trials in healthy people first reported a memory benefit, but after a statistical error was corrected the overall effect was no longer significant (SMD 0.19); the benefit in adults aged 66–76 remained (SMD 0.80), based on few studies [9][10]. An earlier review found no change on cognitive tests in young, rested people [11]. Brain creatine rises less than muscle creatine, and the best dose for the brain is unknown [8][13].',
      },
      {
        title: 'Cognition under sleep loss, and in vegetarians',
        evidence: 'Limited',
        text:
          'In a randomized crossover trial of 15 young adults kept awake overnight for about 21 hours, a single large dose (0.35 g/kg, about 24.5 g for a 70 kg person) improved memory test scores by 10.3% and processing speed by 17.7% versus placebo [13]. In another trial, 19 people who took 20 g a day for 7 days before 24 hours without sleep held up better on reaction time, balance and mood tests than those on placebo [14]. In 128 young women, 20 g a day for 5 days improved memory only in vegetarians, not meat-eaters [12]. These studies were small and used doses well above the usual 3–5 g [12][13][14].',
      },
      {
        title: 'Mood (as an add-on to antidepressants)',
        evidence: 'Limited',
        text:
          'In an 8-week randomized trial of 52 women with major depression all taking the antidepressant escitalopram, adding creatine (3 g a day in week 1, then 5 g a day) lowered depression scores faster than placebo. By week 8, 52% on creatine were in remission versus 26% on placebo, though 8 of 25 on creatine dropped out [15]. A 2025 meta-analysis of 11 trials (1,093 people) found an average improvement of about 2.2 points on the Hamilton depression scale, below the 3 points usually considered clinically meaningful, and rated the evidence very low certainty [16]. In a small open study, 2 people with bipolar depression developed hypomania or mania [17]. Creatine is not a replacement for depression treatment.',
      },
    ],
    dosage: [
      'Daily dose: 3–5 g of creatine monohydrate a day. Larger athletes may use 5–10 g [1]. This fills muscle stores over about 3–4 weeks: 3 g a day for 28 days raised muscle creatine by about 20%, the same as a loading phase [3].',
      'Loading (optional): about 0.3 g per kg of body weight a day, usually 20 g split into four 5 g doses, for 5–7 days, then 3–5 g a day [1][2]. Loading fills stores within a week but is not required, and it causes more short-term water weight [2].',
      'Split doses above 10 g. Taking more than about 10 g at once is more likely to upset the stomach [2].',
      'Timing and food: it can be mixed into water, juice or a shake. Taking it with carbohydrate, or carbohydrate and protein, may increase uptake into muscle, but has not clearly improved performance more than creatine alone [1].',
      'Take it every day, including rest days. After stopping, muscle stores return to baseline in about 4–6 weeks [1][3].',
      'Upper limit: there is no official upper limit. Studies have used up to 30 g a day for up to 5 years without clear evidence of harm, but 3–5 g is all most people need [1].',
      'Talk to your doctor before starting, especially if you take any medication or have a medical condition.',
    ],
    sideEffects: [
      'Weight gain is the only consistently reported side effect [1]. Loading usually adds about 1–3 kg in a week, mostly water held inside muscle. In longer studies of 5–10 weeks, several found no increase in total body water [2].',
      'Stomach upset, bloating or diarrhea can occur, mainly with single doses above about 10 g [2].',
      'Kidneys: in healthy people, creatine at recommended doses has not been shown to harm kidney function [1][2]. A 2019 meta-analysis concluded it did not cause kidney damage at the doses and durations studied [18]. The often-quoted 1998 case of kidney problems involved a person with existing kidney disease who was also taking the transplant drug cyclosporine [2].',
      'Blood tests: creatine can raise serum creatinine, the marker doctors use to estimate kidney function, without any kidney harm. In one trial, creatinine rose by 0.1–0.2 mg/dL and stayed in the normal range [19]. Tell your doctor you take creatine before kidney blood tests, so a higher result is not misread.',
      'Cramps and dehydration: controlled studies do not support these concerns. In 72 college football players, those taking creatine had fewer cramps and fewer cases of heat illness or dehydration than those on placebo [2].',
      'Hair loss: this concern comes from a 2009 study of 20 college rugby players, in which a high loading dose (25 g a day for 7 days, then 5 g a day for 14 days) raised DHT, a hormone linked to male-pattern baldness, by 56%. Testosterone did not change, and hair was not measured [23]. The result was never replicated, and no study has reported hair loss from creatine [2]. In a 12-week randomized trial of 38 resistance-trained men taking 5 g a day, DHT, hair density and hair thickness did not differ from placebo [24].',
      'Creatine supplements made in water-based formats, such as gummies and ready-to-drink liquids, can break down into creatinine before you take them, so the label dose may not be what you get [2][29].',
    ],
    interactions: [
      'Medicines that can affect the kidneys (for example high-dose or long-term NSAIDs such as ibuprofen or naproxen, lithium, some diuretics, or cyclosporine): talk to your doctor first, as a precaution. The one well-known kidney case involved a person with kidney disease taking cyclosporine [2].',
      'Antidepressants: creatine has been studied as an add-on to an SSRI (escitalopram) without extra side effects [15]. Do not add it to depression treatment without your prescriber, and avoid it if you have bipolar disorder, because of reported switches to mania [17].',
      'Caffeine: a 1996 study of 9 men found that a high daily caffeine dose (5 mg/kg) cancelled out the 10–23% strength gain from creatine loading [27]. A 2022 review of 10 studies found mixed results: creatine did not weaken the effect of a pre-exercise caffeine dose, but high daily caffeine during loading might blunt creatine’s effect [28]. Moderate coffee intake is unlikely to matter for most people.',
      'Blood tests: creatine can raise creatinine and lower your estimated kidney function (eGFR) on lab reports. Tell your doctor and lab that you take it [2][19].',
    ],
    avoidIf: [
      'You have kidney disease, or reduced kidney function, unless your doctor approves it [1]',
      'You have diabetes, high blood pressure or another condition that affects the kidneys, without checking with your doctor first',
      'You have bipolar disorder, because of reported switches to hypomania or mania [17]',
      'You are pregnant or breastfeeding (not enough safety data)',
      'You are under 18, unless a doctor recommends it. The American Academy of Pediatrics discourages performance-enhancing supplements in young athletes, and evidence in teens is limited [25][26]',
      'You are being treated for depression, without talking to your prescriber [15][17]',
    ],
    howToChoose: [
      'Creatine monohydrate. It is the form with substantial evidence for absorption, effectiveness and safety. Other forms cost more and have not been shown to work better [19][20][21][22].',
      'A 5 g serving (one scoop) of creatine monohydrate, with the dose clearly stated on the label. Avoid “proprietary blends” that hide how much creatine you get.',
      'Plain powder is the most reliable format. Micronized creatine is the same monohydrate ground finer so it mixes more easily. Creapure is a branded monohydrate made in Germany; some non-German raw materials have been found to contain contaminants such as dicyandiamide (up to 5.4%) and extra creatinine (up to 1.3%) [2].',
      'Be cautious with gummies. In 2024, a supplement company had 12 creatine gummy brands tested; 6 did not meet their label claim, and some contained a small fraction of the stated creatine, with signs it had broken down into creatinine [29]. Many gummies also provide well under 3–5 g per serving.',
      'Third-party tested, with a certificate of analysis available on request. If you compete in tested sport, look for a sport-specific certification such as NSF Certified for Sport.',
      'No claims to treat depression, sarcopenia, dementia or any disease. Under US law supplements cannot make those claims.',
    ],
    faqs: [
      {
        q: 'What does creatine do?',
        a: 'It increases the muscle’s stores of phosphocreatine, which recycles energy during short, intense efforts [1]. With resistance training, that translates into more strength and about 1 kg more lean mass than training alone [4][5].',
      },
      {
        q: 'How much creatine should I take a day?',
        a: '3–5 g of creatine monohydrate a day is enough for most adults [1]. You can load with 20 g a day (split into four doses) for 5–7 days to fill your muscles faster, but it is not required [2][3].',
      },
      {
        q: 'Do I need a loading phase?',
        a: 'No. Loading fills muscle stores within about a week, while 3 g a day reaches the same level in about 4 weeks [3]. Skipping loading means less water weight at the start [2].',
      },
      {
        q: 'Is creatine bad for your kidneys?',
        a: 'In healthy people, studies at recommended doses have not found kidney harm [1][18]. It can raise creatinine on blood tests without kidney damage, so tell your doctor you take it [2][19]. If you have kidney disease, do not take it without your doctor’s approval.',
      },
      {
        q: 'Does creatine cause hair loss?',
        a: 'There is no good evidence that it does. The idea comes from one small 2009 study that found higher DHT levels but did not measure hair [23], and a 2025 randomized trial found no change in DHT or hair growth with 5 g a day for 12 weeks [24].',
      },
      {
        q: 'Does creatine make you gain weight or look bloated?',
        a: 'Many people gain about 1–3 kg in the first week of loading, mostly water inside the muscles [2]. Creatine has not been shown to increase body fat, and starting at 3–5 g a day without loading reduces the early jump [2].',
      },
      {
        q: 'Does creatine help your brain?',
        a: 'Early evidence suggests small improvements in memory, possibly more in older adults, vegetarians and people who are sleep-deprived [8][10][12][13]. The trials were small, and the best dose for the brain is not known.',
      },
      {
        q: 'Which form of creatine is best?',
        a: 'Creatine monohydrate. Trials comparing it with buffered creatine, creatine ethyl ester and creatine HCl found none of them worked better, and ethyl ester worked worse [19][20][21][22].',
      },
    ],
    sources: [
      { label: 'Kreider RB et al. Journal of the International Society of Sports Nutrition, 2017', title: 'International Society of Sports Nutrition position stand: safety and efficacy of creatine supplementation in exercise, sport, and medicine', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5469049/' },
      { label: 'Antonio J et al. Journal of the International Society of Sports Nutrition, 2021', title: 'Common questions and misconceptions about creatine supplementation: what does the scientific evidence really show?', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7871530/' },
      { label: 'Hultman E et al. Journal of Applied Physiology, 1996', title: 'Muscle creatine loading in men', url: 'https://pubmed.ncbi.nlm.nih.gov/8828669/' },
      { label: 'Lanhers C et al. Sports Medicine, 2017', title: 'Creatine supplementation and upper limb strength performance: a systematic review and meta-analysis', url: 'https://pubmed.ncbi.nlm.nih.gov/27328852/' },
      { label: 'Delpino FM et al. Nutrition, 2022', title: 'Influence of age, sex, and type of exercise on the efficacy of creatine supplementation on lean body mass: a systematic review and meta-analysis of randomized clinical trials', url: 'https://pubmed.ncbi.nlm.nih.gov/35986981/' },
      { label: 'Chilibeck PD et al. Open Access Journal of Sports Medicine, 2017', title: 'Effect of creatine supplementation during resistance training on lean tissue mass and muscular strength in older adults: a meta-analysis', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5679696/' },
      { label: 'Devries MC, Phillips SM. Medicine & Science in Sports & Exercise, 2014', title: 'Creatine supplementation during resistance training in older adults: a meta-analysis', url: 'https://pubmed.ncbi.nlm.nih.gov/24576864/' },
      { label: 'Xu C et al. Frontiers in Nutrition, 2024', title: 'The effects of creatine supplementation on cognitive function in adults: a systematic review and meta-analysis', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11275561/' },
      { label: 'Prokopidis K et al. Nutrition Reviews, 2023', title: 'Effects of creatine supplementation on memory in healthy individuals: a systematic review and meta-analysis of randomized controlled trials', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9999677/' },
      { label: 'Prokopidis K et al. Nutrition Reviews, 2023 (author’s reply with corrected analysis)', title: 'Author’s reply: Letter to the Editor: Double counting due to inadequate statistics leads to false-positive findings in “Effects of creatine supplementation on memory in healthy individuals”', url: 'https://pubmed.ncbi.nlm.nih.gov/36644912/' },
      { label: 'Avgerinos KI et al. Experimental Gerontology, 2018', title: 'Effects of creatine supplementation on cognitive function of healthy individuals: a systematic review of randomized controlled trials', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6093191/' },
      { label: 'Benton D, Donohoe R. British Journal of Nutrition, 2011', title: 'The influence of creatine supplementation on the cognitive functioning of vegetarians and omnivores', url: 'https://pubmed.ncbi.nlm.nih.gov/21118604/' },
      { label: 'Gordji-Nejad A et al. Scientific Reports, 2024', title: 'Single dose creatine improves cognitive performance and induces changes in cerebral high energy phosphates during sleep deprivation', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10902318/' },
      { label: 'McMorris T et al. Psychopharmacology, 2006', title: 'Effect of creatine supplementation and sleep deprivation, with mild exercise, on cognitive and psychomotor performance, mood state, and plasma concentrations of catecholamines and cortisol', url: 'https://pubmed.ncbi.nlm.nih.gov/16416332/' },
      { label: 'Lyoo IK et al. American Journal of Psychiatry, 2012', title: 'A randomized, double-blind placebo-controlled trial of oral creatine monohydrate augmentation for enhanced response to a selective serotonin reuptake inhibitor in women with major depressive disorder', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4624319/' },
      { label: 'Eckert I et al. British Journal of Nutrition, 2025', title: 'Creatine supplementation for treating symptoms of depression: a systematic review and meta-analysis', url: 'https://pubmed.ncbi.nlm.nih.gov/41189312/' },
      { label: 'Roitman S et al. Bipolar Disorders, 2007', title: 'Creatine monohydrate in resistant depression: a preliminary study', url: 'https://pubmed.ncbi.nlm.nih.gov/17988366/' },
      { label: 'de Souza e Silva A et al. Journal of Renal Nutrition, 2019', title: 'Effects of creatine supplementation on renal function: a systematic review and meta-analysis', url: 'https://pubmed.ncbi.nlm.nih.gov/31375416/' },
      { label: 'Jagim AR et al. Journal of the International Society of Sports Nutrition, 2012', title: 'A buffered form of creatine does not promote greater changes in muscle creatine content, body composition, or training adaptations than creatine monohydrate', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3479057/' },
      { label: 'Spillane M et al. Journal of the International Society of Sports Nutrition, 2009', title: 'The effects of creatine ethyl ester supplementation combined with heavy resistance training on body composition, muscle performance, and serum and muscle creatine levels', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2649889/' },
      { label: 'Eghbali E et al. Physiological Research, 2024', title: 'Supplementing with which form of creatine (hydrochloride or monohydrate) alongside resistance training can have more impacts on anabolic/catabolic hormones, strength and body composition?', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11629957/' },
      { label: 'Kreider RB et al. Nutrients, 2022', title: 'Bioavailability, efficacy, safety, and regulatory status of creatine and related compounds: a critical review', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8912867/' },
      { label: 'van der Merwe J et al. Clinical Journal of Sport Medicine, 2009', title: 'Three weeks of creatine monohydrate supplementation affects dihydrotestosterone to testosterone ratio in college-aged rugby players', url: 'https://pubmed.ncbi.nlm.nih.gov/19741313/' },
      { label: 'Lak M et al. Journal of the International Society of Sports Nutrition, 2025', title: 'Does creatine cause hair loss? A 12-week randomized controlled trial', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12020143/' },
      { label: 'Jagim AR, Kerksick CM. Nutrients, 2021', title: 'Creatine supplementation in children and adolescents', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7922146/' },
      { label: 'LaBotz M et al. (American Academy of Pediatrics). Pediatrics, 2016', title: 'Use of performance-enhancing substances', url: 'https://pubmed.ncbi.nlm.nih.gov/27354458/' },
      { label: 'Vandenberghe K et al. Journal of Applied Physiology, 1996', title: 'Caffeine counteracts the ergogenic action of muscle creatine loading', url: 'https://pubmed.ncbi.nlm.nih.gov/8929583/' },
      { label: 'Elosegui S et al. International Journal of Sport Nutrition and Exercise Metabolism, 2022', title: 'Interaction between caffeine and creatine when used as concurrent ergogenic supplements: a systematic review', url: 'https://pubmed.ncbi.nlm.nih.gov/35016154/' },
      { label: 'NutraIngredients, 2024', title: 'NOW raises red flags after creatine gummy testing', url: 'https://www.nutraingredients.com/Article/2024/03/01/NOW-raises-red-flags-after-creatine-gummy-testing' },
    ],
    relatedProducts: ['creatine'],
    relatedGoals: ['muscle-performance', 'brain-focus'],
  },
  {
    slug: 'lions-mane',
    ingredient: "Lion's mane",
    metaTitle: 'Lion’s Mane: Benefits, Dosage, Side Effects & Forms',
    metaDescription:
      'What research says about lion’s mane for memory, focus and mood, fruiting body vs mycelium on grain, beta-glucan testing, studied doses and side effects.',
    published: '2026-10-30',
    updated: '2026-10-30',
    summary:
      'Lion’s mane (Hericium erinaceus) is an edible mushroom studied for memory, focus and mood. A few small trials found modest gains on cognitive tests in older adults taking 1–3.2 g a day for 12–49 weeks, and the effect faded within 4 weeks of stopping [1][2][3]. Trials in healthy young adults were mostly negative or mixed [4][5], claims about nerve growth come from lab and animal work [11][12], and products vary widely, so the form you buy matters.',
    quickFacts: [
      { label: 'What it is', value: 'An edible mushroom (Hericium erinaceus), sold as fruiting body, mycelium or extract' },
      { label: 'Typical dose in studies', value: '1–3.2 g of dried fruiting body a day, for 4–16 weeks' },
      { label: 'Strongest evidence', value: 'Small gains on memory tests in older adults (limited)' },
      { label: 'Main risk', value: 'Rare allergic reactions; mild stomach upset' },
      { label: 'Avoid if', value: 'Allergic to mushrooms, pregnant or breastfeeding' },
    ],
    whatItIs: [
      'Lion’s mane (Hericium erinaceus), also called yamabushitake in Japan or bearded tooth mushroom, is an edible mushroom that grows on hardwood trees. It is eaten as food in East Asia and used in traditional Chinese medicine [2][17].',
      'Two groups of compounds get most of the attention. Hericenones are found mainly in the fruiting body, the part you see and cook. Erinacines are found mainly in the mycelium, the root-like threads that grow through wood or a growing medium [2][8][13]. Lab studies suggest both can raise nerve growth factor (NGF) in cells, but it is not known whether they reach the human brain in useful amounts [1][8].',
      'Erinacine content varies hugely from strain to strain. In one 2024 analysis of 17 strains grown the same way, erinacine A ranged from 0.23 to 42.16 mg per gram of mycelium [13]. Most labels state neither erinacines nor hericenones.',
      'Fruiting body powder is the dried, ground mushroom. It is the form used in most trials on memory and mood [1][2][8]. Fruiting body extracts are made by steeping the mushroom in hot water, alcohol or both, then drying the liquid. They are more concentrated and are labeled with a ratio such as 8:1 or 10:1 [5].',
      'Mycelium on grain (often labeled “myceliated grain” or “mycelial biomass”) is grown on sterilized oats or rice. The mycelium cannot be fully separated from the grain, so the whole mass is dried and milled, and part of what you buy is leftover grain. This is different from liquid-grown mycelium, such as the erinacine-enriched mycelium used in a 2020 Alzheimer’s pilot trial [3].',
      'Why beta-glucan matters more than “polysaccharides”: beta-glucans are fiber-like sugars in the mushroom cell wall, and they are the usual quality marker. Starch from grain is also a polysaccharide, so a total “polysaccharides %” number can count grain starch along with mushroom material. The beta-glucan method published by McCleary and Draga (sold as the Megazyme kit) measures starch separately and subtracts it, leaving only beta-glucan [14]. In a US test of 19 reishi mushroom supplements, 13 (68%) contained starch-like polysaccharides and only 5 matched their labels; the authors noted that starch should be excluded when measuring polysaccharides [15].',
      'Extract ratios and “mg equivalent”: an 8:1 ratio means about 8 g of dried mushroom went into 1 g of extract. Some labels multiply this out, so 500 mg of an 8:1 extract becomes “4,000 mg equivalent.” Under US rules, the amount listed for a dried extract must be the weight of the extract itself [16]. The ratio also says nothing about how much beta-glucan or hericenone survived processing.',
    ],
    benefits: [
      {
        title: 'Memory in older adults with mild cognitive impairment',
        evidence: 'Limited',
        text:
          'In a 16-week randomized, placebo-controlled trial of 30 Japanese adults aged 50–80 with mild cognitive impairment, taking 3 g a day of dried fruiting body powder (four 250 mg tablets three times a day) led to higher scores than placebo on a 30-point cognitive scale at weeks 8, 12 and 16 [1]. At week 16, 10 of 14 people on lion’s mane (71%) had improved by 3 points or more, compared with 1 of 15 on placebo (7%). Scores dropped significantly within 4 weeks of stopping [1]. This is one small trial using a scale mostly used in East Asia, and it has not been repeated in a larger study.',
      },
      {
        title: 'Thinking skills in early Alzheimer’s disease (erinacine-enriched mycelium)',
        evidence: 'Limited',
        text:
          'A 49-week pilot trial randomized 49 people with mild Alzheimer’s disease to 3 capsules a day of liquid-grown mycelium enriched with erinacine A (about 1,050 mg of mycelium, 5 mg/g erinacine A) or placebo; 41 finished [3]. MMSE scores rose from 21.8 to 23.2 within the lion’s mane group, but the difference from placebo was not statistically significant. A daily-living skills score (IADL) was the only cognitive measure that differed significantly between groups (6.7 versus 5.0) [3]. The study was small, made many comparisons, and five authors were paid by the company that made the product [3].',
      },
      {
        title: 'Daily use in healthy middle-aged and older adults',
        evidence: 'Limited',
        text:
          'In a 12-week trial of 31 healthy adults over 50 (average age about 61), 3.2 g a day of fruiting body powder raised MMSE scores to 30.0 out of 30 versus 29.5 on placebo, a small but significant difference. Two other memory tests showed no difference [2]. Because almost everyone started near the top score, there was little room to improve. A 2026 preprint (not yet peer reviewed) of 109 adults aged 40–75 with self-reported memory complaints found that 2 g a day of fruiting body and mycelium for 8 weeks modestly improved one visual attention and working memory task, along with self-rated sleep and mood. It was funded by a supplement ingredient company and reported p-values but no effect sizes [7].',
      },
      {
        title: 'Quick focus boost in healthy young adults',
        evidence: 'Insufficient',
        text:
          'Single doses have not shown a reliable effect. In a crossover trial of 18 healthy adults (average age 23), a 3 g dose of a 10:1 fruiting body extract did not improve overall cognitive or mood scores 90 minutes later; one hand-dexterity task improved while an attention task got worse [5]. In a trial of 41–43 adults aged 18–45, 1.8 g a day made people faster on the Stroop test 60 minutes after the first dose (688 ms versus 738 ms at baseline), but they recalled fewer words right after, and after 28 days the placebo group did better on delayed word recall [4]. A 1 g dose of fruiting body in 40 adults sped up some reaction times within the group but showed no clear difference from placebo [6].',
      },
      {
        title: 'Mood, anxiety and stress',
        evidence: 'Limited',
        text:
          'In a 4-week trial, 30 women (average age about 40) ate cookies providing 2 g a day of fruiting body powder or placebo cookies. Depression scores (CES-D) fell from 13.9 to 10.3 in the lion’s mane group, but the change was not significantly different from placebo (15.1 to 12.6), and sleep quality did not change [8]. In an 8-week study of 77 adults with overweight on a diet, 1.5 g a day of a mostly mycelium product was linked to lower depression and anxiety scores in people who had symptoms, but there was no placebo, only a no-supplement group [9]. In the 28-day young-adult trial, stress ratings trended lower than with placebo (p = 0.051), with no difference on the Perceived Stress Scale [4]. A 2025 systematic review called the clinical evidence limited [10].',
      },
      {
        title: 'Nerve growth factor and nerve repair',
        evidence: 'Early',
        text:
          'In human brain-derived cells, a lion’s mane extract increased production of nerve growth factor, a protein that helps nerve cells survive and grow. Mice fed a diet with 5% lion’s mane powder for 7 days had more NGF gene activity in the hippocampus [12]. Animal studies of erinacine-enriched mycelium suggest possible effects in models of stroke, Parkinson’s and Alzheimer’s disease, but the authors of that review caution that animal results are hard to translate to people [11]. No human trial has shown that lion’s mane regrows nerves or brain cells.',
      },
    ],
    dosage: [
      'Trials of dried fruiting body used 1–3.2 g a day: 3 g in the mild cognitive impairment trial, 3.2 g in healthy older adults, 2 g in the mood trial, 1.8 g in young adults and 1 g in a single-dose study [1][2][4][6][8]. The Alzheimer’s pilot used about 1,050 mg a day of erinacine-enriched mycelium [3].',
      'Doses are not interchangeable between forms. A gram of concentrated extract is not the same as a gram of whole mushroom, and a gram of mycelium on grain contains less mushroom than either. Match the dose to the form that was studied.',
      'Trials gave it as tablets, capsules or food, often split over the day; the largest daily dose was taken as 1 g three times a day [1]. We found no trial comparing times of day or taking it with versus without food.',
      'In the mild cognitive impairment trial, differences from placebo appeared at 8 weeks and grew to 16 weeks, then faded within 4 weeks of stopping [1]. Plan on at least 8–12 weeks of daily use before judging it.',
      'There is no official recommended intake or upper limit, and the NIH Office of Dietary Supplements has no fact sheet for it. Trials lasted up to 49 weeks [3].',
      'Talk to your doctor before starting, especially if you take any medication or have a medical condition.',
    ],
    sideEffects: [
      'In trials it was generally well tolerated. In the mild cognitive impairment trial, 7 people on lion’s mane and 6 on placebo reported mild stomach discomfort or diarrhea, and blood tests showed no harmful changes [1].',
      'In the 49-week Alzheimer’s pilot, 3 people on lion’s mane and 1 on placebo dropped out because of side effects, including stomach discomfort, nausea and skin rash [3].',
      'LiverTox, the NIH database on drug-induced liver injury, says lion’s mane is generally regarded as safe and has not been linked to liver enzyme rises or liver injury [17].',
      'Allergic reactions are rare but can be serious. A 63-year-old man in Japan developed acute respiratory distress syndrome (severe lung inflammation) after taking a lion’s mane extract; a lab test showed a strong immune reaction to it, and he recovered with steroids and a ventilator [18]. Stop taking it and get medical help if you develop a rash, trouble breathing, cough or swelling.',
      'Side effects are often not reported well in mushroom trials, so the safety profile is not fully established [10].',
    ],
    interactions: [
      'No interaction with a drug has been shown in people. The concerns below are theoretical and based on lab and animal studies.',
      'Diabetes medicines (for example metformin, insulin and sulfonylureas such as glipizide): in diabetic rats, a water extract of lion’s mane lowered blood glucose and raised insulin over 28 days [20]. If you take diabetes medicine, monitor your blood sugar and talk to your doctor.',
      'Anticoagulants and antiplatelets (for example warfarin, apixaban, clopidogrel and aspirin): hericenone B from lion’s mane reduced platelet clumping in lab tests with rabbit and human platelets [19]. Whether this matters at supplement doses is unknown, but ask your doctor before combining them, and before surgery.',
      'Other supplements: lion’s mane is often sold in blends with other mushrooms and nootropics, which makes it harder to know what you are taking and to trace a side effect.',
    ],
    avoidIf: [
      'You are allergic to mushrooms, or have reacted to a mushroom supplement before [18]',
      'You are pregnant or breastfeeding, or for children (not studied)',
      'You take diabetes medicine, unless your doctor agrees and you monitor your blood sugar [20]',
      'You take a blood thinner, have a bleeding disorder or have surgery planned, unless your doctor agrees [19]',
      'You are taking it to replace treatment for memory loss or dementia. See a doctor about memory problems',
    ],
    howToChoose: [
      'Fruiting body stated on the label. Most memory and mood trials used fruiting body powder or extract [1][2][8]. US rules require botanical labels to say which part was used [16].',
      'A beta-glucan percentage, ideally tested with the Megazyme (McCleary) method, rather than only “polysaccharides %” [14]. Ask for a certificate of analysis that lists beta-glucan and starch (alpha-glucan) separately.',
      'Be cautious with “myceliated grain”, “mycelial biomass”, “full spectrum” or “fermented rice” in the ingredients. These usually mean mycelium grown on grain, and a high polysaccharide figure can include grain starch [14][15].',
      'Real weight, not just “mg equivalent”. Look for the actual milligrams of extract per serving and its ratio [16].',
      'Third-party tested for identity, heavy metals and microbes, with a certificate of analysis available on request.',
      'No claims to treat dementia, Alzheimer’s, depression or nerve damage. Under US law supplements cannot make those claims.',
    ],
    faqs: [
      {
        q: 'What does lion’s mane do?',
        a: 'In small trials, 1–3 g a day of the fruiting body modestly improved scores on memory tests in older adults over 12–16 weeks [1][2]. Studies on mood are mixed, and single doses did not reliably sharpen focus in young adults [4][5][8].',
      },
      {
        q: 'How long does lion’s mane take to work?',
        a: 'In the mild cognitive impairment trial, differences from placebo appeared after 8 weeks of daily use, and the benefit faded within 4 weeks of stopping [1]. Expect to take it for at least 2–3 months before judging.',
      },
      {
        q: 'Is fruiting body or mycelium better?',
        a: 'Most trials on memory and mood used the fruiting body [1][2][8]. Erinacines are concentrated in mycelium and one small Alzheimer’s pilot used liquid-grown, erinacine-enriched mycelium [3], but most mycelium sold in the US is grown on grain and contains leftover grain starch.',
      },
      {
        q: 'Why does beta-glucan matter more than “polysaccharides %”?',
        a: 'Starch from grain is also a polysaccharide, so a polysaccharide figure can count filler along with mushroom. Beta-glucan, measured with a method that subtracts starch, reflects actual mushroom cell-wall material [14][15].',
      },
      {
        q: 'What does 8:1 or “4,000 mg equivalent” mean?',
        a: 'It means roughly 8 g of dried mushroom went into 1 g of extract, so 500 mg of extract is marketed as “4,000 mg equivalent.” The real amount in the capsule is 500 mg, and the ratio does not tell you how much beta-glucan it contains [16].',
      },
      {
        q: 'Is lion’s mane safe to take every day?',
        a: 'Daily use for up to 49 weeks was well tolerated in trials, with mostly mild stomach upset [1][3]. LiverTox has not linked it to liver injury, but rare serious allergic reactions have been reported [17][18].',
      },
      {
        q: 'Can lion’s mane regrow nerves or brain cells?',
        a: 'Not that we know. Lab and mouse studies found it can raise nerve growth factor [12], but no human study has shown nerve or brain cell regrowth [11].',
      },
      {
        q: 'Does lion’s mane help anxiety or depression?',
        a: 'The evidence is limited. Small studies found lower depression and anxiety scores, but in the only placebo-controlled trial the change was not significantly different from placebo [8][9][10].',
      },
    ],
    sources: [
      { label: 'Mori K et al. Phytotherapy Research, 2009', title: 'Improving effects of the mushroom Yamabushitake (Hericium erinaceus) on mild cognitive impairment: a double-blind placebo-controlled clinical trial', url: 'https://pubmed.ncbi.nlm.nih.gov/18844328/' },
      { label: 'Saitsu Y et al. Biomedical Research, 2019', title: 'Improvement of cognitive functions by oral intake of Hericium erinaceus', url: 'https://www.jstage.jst.go.jp/article/biomedres/40/4/40_125/_article' },
      { label: 'Li IC et al. Frontiers in Aging Neuroscience, 2020', title: 'Prevention of early Alzheimer’s disease by erinacine A-enriched Hericium erinaceus mycelia pilot double-blind placebo-controlled study', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7283924/' },
      { label: 'Docherty S et al. Nutrients, 2023', title: 'The acute and chronic effects of lion’s mane mushroom supplementation on cognitive function, stress and mood in young adults: a double-blind, parallel groups, pilot study', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10675414/' },
      { label: 'Surendran G et al. Frontiers in Nutrition, 2025', title: 'Acute effects of a standardised extract of Hericium erinaceus (Lion’s Mane mushroom) on cognition and mood in healthy younger adults: a double-blind randomised placebo-controlled study', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12018234/' },
      { label: 'La Monica MB et al. Nutrients, 2023', title: 'Acute effects of naturally occurring guayusa tea and Nordic lion’s mane extracts on cognitive performance', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10745489/' },
      { label: 'Daoust J et al. medRxiv preprint (not peer reviewed), 2026', title: 'A randomized, double-blind, placebo-controlled study evaluating the impact of Hericium erinaceus (Lion’s Mane) on cognitive performance and subjective wellbeing', url: 'https://www.medrxiv.org/content/10.64898/2026.04.13.26350781v1' },
      { label: 'Nagano M et al. Biomedical Research, 2010', title: 'Reduction of depression and anxiety by 4 weeks Hericium erinaceus intake', url: 'https://www.jstage.jst.go.jp/article/biomedres/31/4/31_4_231/_article' },
      { label: 'Vigna L et al. Evidence-Based Complementary and Alternative Medicine, 2019', title: 'Hericium erinaceus improves mood and sleep disorders in patients affected by overweight or obesity: could circulating pro-BDNF and BDNF be potential biomarkers?', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6500611/' },
      { label: 'Menon A et al. Frontiers in Nutrition, 2025', title: 'Benefits, side effects, and uses of Hericium erinaceus as a supplement: a systematic review', url: 'https://www.frontiersin.org/journals/nutrition/articles/10.3389/fnut.2025.1641246/full' },
      { label: 'Li IC et al. Behavioural Neurology, 2018', title: 'Neurohealth properties of Hericium erinaceus mycelia enriched with erinacines', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5987239/' },
      { label: 'Mori K et al. Biological & Pharmaceutical Bulletin, 2008', title: 'Nerve growth factor-inducing activity of Hericium erinaceus in 1321N1 human astrocytoma cells', url: 'https://pubmed.ncbi.nlm.nih.gov/18758067/' },
      { label: 'Liu M et al. Foods, 2024', title: 'Isolation and evaluation of erinacine A contents in mycelia of Hericium erinaceus strains', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11172171/' },
      { label: 'McCleary BV, Draga A. Journal of AOAC International, 2016', title: 'Measurement of β-glucan in mushrooms and mycelial products', url: 'https://pubmed.ncbi.nlm.nih.gov/26957216/' },
      { label: 'Wu DT et al. Scientific Reports, 2017', title: 'Evaluation on quality consistency of Ganoderma lucidum dietary supplements collected in the United States', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5552695/' },
      { label: 'US Code of Federal Regulations, 21 CFR 101.36', title: 'Nutrition labeling of dietary supplements', url: 'https://www.law.cornell.edu/cfr/text/21/101.36' },
      { label: 'LiverTox (NIDDK, National Institutes of Health), 2024', title: 'Lion’s Mane', url: 'https://www.ncbi.nlm.nih.gov/books/NBK599740/' },
      { label: 'Nakatsugawa M et al. Internal Medicine, 2003', title: 'Hericium erinaceum (yamabushitake) extract-induced acute respiratory distress syndrome monitored by serum surfactant proteins', url: 'https://pubmed.ncbi.nlm.nih.gov/14714963/' },
      { label: 'Mori K et al. Phytomedicine, 2010', title: 'Inhibitory effect of hericenone B from Hericium erinaceus on collagen-induced platelet aggregation', url: 'https://pubmed.ncbi.nlm.nih.gov/20637576/' },
      { label: 'Liang B et al. BMC Complementary and Alternative Medicine, 2013', title: 'Antihyperglycemic and antihyperlipidemic activities of aqueous extract of Hericium erinaceus in experimental diabetic rats', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3852124/' },
    ],
    relatedProducts: [], // link 'lions-mane' once Supliful's beta-glucan COA backs the label (see TODO)
    relatedGoals: ['brain-focus'],
  },
  {
    slug: 'methylene-blue',
    ingredient: 'Methylene blue',
    h1: 'Methylene blue: what the evidence shows, the risks, and who must avoid it',
    sectionTitles: {
      what: 'What is methylene blue?',
      benefits: 'What the human evidence shows',
      dosage: 'Doses used in studies (not a recommendation)',
      sideEffects: 'Side effects and safety',
      interactions: 'Drug interactions: the serotonin syndrome warning',
      avoid: 'Who should not take methylene blue',
      choose: 'Product grade, labels and talking to your doctor',
      faq: 'FAQ',
    },
    metaTitle: 'Methylene Blue: Evidence, Risks, SSRIs & G6PD Safety',
    metaDescription:
      'Methylene blue is a dye and a prescription drug. What the memory research shows, why it is risky with SSRIs or G6PD deficiency, and what to ask your doctor.',
    published: '2026-10-30',
    updated: '2026-10-30',
    summary:
      'Methylene blue is a blue dye that is also an FDA-approved prescription drug, given intravenously for a blood disorder called methemoglobinemia [1]. It is now sold online as a "nootropic", but the human evidence for memory is one small single-dose brain-scan study, and large Alzheimer’s trials of a related compound found no benefit [5][8][9]. It can cause serious, sometimes fatal serotonin syndrome with many antidepressants, and it is not safe with G6PD deficiency or in pregnancy [1][2].',
    quickFacts: [
      { label: 'What it is', value: 'A synthetic dye and a prescription drug (ProvayBlue, given by IV)' },
      { label: 'Approved use', value: 'Acquired methemoglobinemia, 1 mg/kg by IV, in hospital' },
      { label: 'Dose in memory studies', value: 'A single oral dose of 260–280 mg (about 4 mg/kg)' },
      { label: 'Strongest evidence', value: 'Small, short-term brain-scan changes (early)' },
      { label: 'Main risks', value: 'Serotonin syndrome with antidepressants; hemolysis with G6PD deficiency' },
      { label: 'Avoid if', value: 'On SSRIs, SNRIs, MAOIs or opioids; G6PD deficiency; pregnant or breastfeeding' },
    ],
    whatItIs: [
      'Methylene blue (methylthioninium chloride) is a synthetic thiazine dye. It was first made as a textile dye in the 1870s and is still used as a laboratory stain [15]. In medicine, the FDA approved ProvayBlue, a 0.5% (5 mg/mL) injection, in 2016 to treat acquired methemoglobinemia in children and adults [1]. Methemoglobinemia is a condition in which hemoglobin cannot carry oxygen properly. The approved dose is 1 mg/kg given into a vein over 5–30 minutes, with a possible second dose an hour later [1].',
      'In the body, methylene blue is converted to leucomethylene blue, which turns methemoglobin back into normal hemoglobin [1]. It also crosses easily into the brain and, at low doses in lab and animal studies, acts on cytochrome oxidase, an enzyme in the energy-producing mitochondria of cells. This is the basis of the "brain energy" and memory claims [11].',
      'Methylene blue has a "hormetic" dose response: in animal studies, low doses (about 1–4 mg/kg) improved memory, the effect was gone by 10 mg/kg, and much higher doses were harmful [11]. More is not better.',
      'Published reports describe it as a potent, reversible inhibitor of monoamine oxidase A (MAO-A), the enzyme that breaks down serotonin. This is why it behaves like an MAOI antidepressant when combined with other drugs that raise serotonin [1][3].',
      'Taken by mouth, methylene blue is well absorbed. In a study of 16 healthy volunteers, about 72% of a 500 mg oral dose reached the bloodstream compared with an IV dose [12]. Its half-life is about 24 hours, and about 40% leaves the body unchanged in urine, which turns it blue or green [1].',
      'Methylene blue has become popular with biohackers and wellness influencers, mostly as "drops" sold online for focus, energy and longevity [15]. Many are labeled as a 1% solution, which would be 10 mg per mL. These products are not the same as ProvayBlue, and they are different from the modified compounds tested in Alzheimer’s trials [15].',
    ],
    benefits: [
      {
        title: 'Short-term memory and attention in healthy adults',
        evidence: 'Early',
        text:
          'In a randomized, double-blind, placebo-controlled study, 26 healthy adults (13 per group, aged 22–62) took a single oral dose of 280 mg of USP-grade methylene blue (about 4 mg/kg) or a blue food dye placebo. One hour later, brain scans (fMRI) showed more activity in areas used for attention and short-term memory, and correct answers on a memory-retrieval task rose by about 7% in the methylene blue group (P = .01). However, the difference between methylene blue and placebo over time was not statistically significant (P = .09), and reaction times did not change [5]. A companion study from the same team (28 adults, same dose) found changes in brain blood flow and connectivity, not memory performance [6]. The authors called it a small proof-of-concept study: one dose, no blood levels measured, and no long-term data [5].',
      },
      {
        title: 'Memory of fear extinction (with exposure therapy)',
        evidence: 'Limited',
        text:
          'In a double-blind trial, 42 adults with marked claustrophobia did one exposure session in an enclosed chamber and then took 260 mg of USP methylene blue (split into 3 doses over about a day) or placebo. One month later, people whose fear had dropped well during the session had lower peak fear with methylene blue than placebo (10.7 vs 29.8 on a 0–100 scale). People whose session went poorly tended to do worse on methylene blue (33.0 vs 17.4, not statistically significant), and the authors warned it may harm extinction after an unsuccessful session [7]. Most participants were young female students, and this was a single-session study [7].',
      },
      {
        title: 'Alzheimer’s disease (LMTM / TRx0237)',
        evidence: 'Insufficient',
        text:
          'LMTM (leuco-methylthioninium bis(hydromethanesulfonate), code name TRx0237) is a modified, better-absorbed form of methylene blue developed for Alzheimer’s disease. In a 15-month phase 3 trial of 891 people with mild to moderate Alzheimer’s, 75 mg or 125 mg twice a day did not slow decline on memory (ADAS-Cog) or daily-living (ADCS-ADL) scores compared with a 4 mg twice-daily control [8]. In an 18-month phase 3 trial of 800 people with mild Alzheimer’s, 100 mg twice a day showed no difference from the 4 mg control on any primary or secondary outcome in the randomized analysis [9]. Later positive claims come from non-randomized subgroup comparisons that the authors said need a new trial to test [9]. In a third trial, LUCIDITY, the company reported that its low-dose "control" unexpectedly appeared to have an effect, so it switched to a different analysis [10]. None of these products is the methylene blue sold as drops [15].',
      },
      {
        title: 'Energy, mitochondria and longevity',
        evidence: 'Early',
        text:
          'Claims that methylene blue boosts cellular energy or slows aging come from lab and animal studies showing effects on mitochondrial enzymes such as cytochrome oxidase [11]. In a 2012 review of this work, the researchers themselves said its usefulness as a nootropic in human volunteers was still to be determined [11]. We found no controlled human trial showing that methylene blue improves energy, fatigue or aging in healthy people.',
      },
    ],
    dosage: [
      'There is no established safe or effective dose of methylene blue for focus, energy or memory, and no upper intake level from the NIH Office of Dietary Supplements. The doses below describe what studies used; they are not a recommendation.',
      'Approved medical use: 1 mg/kg by IV over 5–30 minutes for methemoglobinemia, given in hospital, with at most two doses [1].',
      'Memory and brain-scan studies: a single oral dose of 280 mg of USP-grade methylene blue (about 4 mg/kg), with testing 1 hour later [5][6]. The fear-extinction trial used 260 mg split into 3 doses over about a day [7].',
      'Alzheimer’s trials used LMTM, a different compound, at 8–250 mg a day for 15–18 months, with no benefit in the randomized comparisons [8][9].',
      'A pharmacology study gave a single 500 mg oral dose to healthy volunteers to measure absorption [12].',
      'For comparison, a 1% drop product contains 10 mg per mL, so 1 mL is about a twenty-eighth of the 280 mg dose used in the memory study. No published trial has tested these low daily doses for cognition.',
      'Higher is riskier. Drug labeling reports low blood pressure, wheezing and reduced oxygen at single IV doses of 3 mg/kg or more, a range of toxic symptoms at cumulative doses of 7 mg/kg or more, and severe hemolysis and death at 20 mg/kg or more [1].',
      'If you are thinking about taking methylene blue, talk to your doctor first, and tell them about every medicine and supplement you take.',
    ],
    sideEffects: [
      'Blue or blue-green urine is expected and harmless in itself. Every participant who took methylene blue in the 280 mg brain-scan study reported it [5]. It can also stain the skin, tongue, teeth and body fluids blue, and it stains clothes and surfaces [1].',
      'In patients given the IV drug, the most common side effects (over 2%) were headache, low potassium, diarrhea, low magnesium, muscle jerks (myoclonus), nausea and seizure-like episodes [1]. Other reported effects include dizziness, confusion, blurred vision, palpitations, high blood pressure, sensitivity to light (phototoxicity) and allergic reactions, including anaphylaxis [1].',
      'Serotonin syndrome is the most serious risk for people on antidepressants and some other drugs (see Interactions). Symptoms include agitation, confusion, fast heart rate, sweating, fever, tremor, muscle stiffness or jerking, and diarrhea. Some reported cases were fatal [1]. Get emergency care if these appear.',
      'In people with G6PD deficiency, methylene blue can cause severe hemolysis (destruction of red blood cells) and severe anemia, and it may not even work for its approved use [1]. Hemolysis can also occur in people without G6PD deficiency, and the anemia can appear a day or more later [1].',
      'Methylene blue can make pulse oximeters read oxygen levels falsely low, and it can affect urine dipstick tests that use a blue indicator [1].',
      'The approved label advises not driving or using machinery until any confusion, dizziness or vision changes have passed [1].',
      'In animal studies, high oral doses caused birth defects and pregnancy loss, it was genotoxic in some lab tests, and it caused pancreatic tumors in male rats in a 2-year study [1].',
    ],
    interactions: [
      'Serotonergic antidepressants: SSRIs (for example sertraline, escitalopram, fluoxetine, paroxetine), SNRIs (for example venlafaxine, duloxetine), MAOIs (for example phenelzine, selegiline) and clomipramine. Combining them with methylene blue can cause serious or fatal serotonin syndrome. This is an FDA boxed warning on the prescription drug [1].',
      'In 2011 the FDA issued safety communications on this interaction. Most reported cases involved IV methylene blue during parathyroid surgery at 1–8 mg/kg in people taking SSRIs, SNRIs or clomipramine, and the FDA recommended it generally not be given to people on serotonergic drugs except for urgent or life-threatening conditions [2]. The FDA said it was not known whether oral doses or IV doses below 1 mg/kg carry the same risk [2]. That is not the same as saying they are safe.',
      'Lower and oral doses have been linked to cases too. A review found that an IV dose of 0.75 mg/kg reaches blood levels high enough to block MAO-A [3]. Serotonin syndrome has been reported with repeated IV doses of 50 mg (about 0.74 mg/kg each) in a woman taking paroxetine [16] and after an oral urinary-pain product containing methylene blue in a person on several serotonergic drugs [4]. A review of 50 published cases found that all involved serotonergic antidepressants, and one person died [4].',
      'Other drugs that raise serotonin: bupropion, buspirone, mirtazapine, the antibiotic linezolid, opioids (for example tramadol, fentanyl, meperidine), the cough suppressant dextromethorphan, and migraine medicines. The label advises avoiding these, and not starting serotonergic drugs for 72 hours after a dose of the prescription drug [1].',
      'Supplements that may affect serotonin, such as St. John’s wort, 5-HTP or SAMe, are not listed on the label, but taking them together raises the same concern. Ask your pharmacist.',
      'Chloroquine (an antimalarial) raised blood plasma levels of methylene blue in a pharmacology study [12].',
      'Surgery and anesthesia: methylene blue can interfere with oxygen monitors and anesthesia-depth monitors [1]. Tell your surgical team if you take it.',
    ],
    avoidIf: [
      'You take an antidepressant (SSRI, SNRI, MAOI or clomipramine), bupropion, buspirone, mirtazapine, linezolid, opioids, migraine medicines or dextromethorphan, unless your prescriber says otherwise [1][2]',
      'You have G6PD deficiency, or you don’t know your status and have family roots in Africa, Asia, the Mediterranean or the Middle East. About 1 in 10 African American men has it, and many people never have symptoms [1][13]',
      'You are pregnant, trying to become pregnant, or breastfeeding. The drug label warns of possible fetal harm and advises stopping breastfeeding for up to 8 days after a dose [1]',
      'You have kidney or liver disease, which raise blood levels or slow clearance [1]',
      'You have had an allergic reaction to methylene blue or other thiazine dyes [1]',
      'For children and teenagers (outside medical use)',
      'You have surgery planned (tell your surgeon and anesthetist) [1]',
    ],
    howToChoose: [
      'Start with a conversation, not a purchase. Tell your doctor or pharmacist exactly why you want to try it, and bring the product and a full list of your medicines and supplements, including any antidepressant, pain or migraine medicine, cough syrup and herbal products.',
      'Questions to ask your doctor: Do any of my medicines interact with methylene blue? Should I be tested for G6PD deficiency first? Is it safe with my kidney or liver function? Is there a better-studied option for what I want to improve?',
      'Regulatory status is unclear. Methylene blue is an FDA-approved prescription drug [1]. Under US law, an ingredient approved as a drug generally cannot be sold as a dietary supplement unless it was marketed as a supplement or food first [14]. NPR reported in 2025 that it is unclear whether methylene blue meets the definition of a supplement, that most products are not in the federal supplement label registry, and that the FDA did not answer questions about how it is sold without a prescription [15].',
      'Grade matters. Industrial-grade and chemical-grade methylene blue sold as a dye or stain can contain more than 8–11% contaminants, and even pharmaceutical (USP) grade contains small amounts of impurities such as arsenic, cadmium, mercury and lead [11]. Researchers advise against giving dye-grade methylene blue to people [11]. Never use aquarium, lab-stain or fabric-dye products. All the human studies above used USP-grade material [5][7].',
      'Red flags on the label or website: "for research use only" or "not for human consumption" on a product clearly marketed for people; no strength in mg per mL or per dose; no batch number or certificate of analysis showing USP-grade identity, purity and heavy-metal testing; and no warning about antidepressants, G6PD deficiency and pregnancy.',
      'Claims to avoid: "treats" or "prevents" Alzheimer’s, dementia, depression, long COVID or any disease, or promises like "anti-aging" and "mitochondrial reset". The Alzheimer’s trials were negative and used a different compound [8][9]. Under US law a supplement cannot claim to treat or prevent disease [14].',
    ],
    faqs: [
      {
        q: 'What is methylene blue used for?',
        a: 'Medically, it is a prescription drug given by IV in hospital for methemoglobinemia, a blood disorder that stops hemoglobin from carrying oxygen [1]. It is also a lab stain and dye, and it is sold online for focus and energy, uses that have little human evidence [5][15].',
      },
      {
        q: 'Does methylene blue improve memory?',
        a: 'One small study of 26 healthy adults found more brain activity and about 7% more correct memory answers 1 hour after a single 280 mg dose, but the difference versus placebo was not statistically significant [5]. Large Alzheimer’s trials of a related compound found no benefit [8][9].',
      },
      {
        q: 'Can I take methylene blue with an SSRI or other antidepressant?',
        a: 'Not without your prescriber’s approval. The prescription drug carries an FDA boxed warning for serious or fatal serotonin syndrome with SSRIs, SNRIs, MAOIs and opioids [1]. The FDA has said the risk at oral or lower doses is unknown, and a case has been reported after an oral product [2][4].',
      },
      {
        q: 'Is methylene blue safe?',
        a: 'At the approved IV dose it is given in hospitals, with monitoring [1]. Taken on your own, it can be dangerous if you use serotonergic medicines, have G6PD deficiency, or are pregnant, and the safety of long-term daily use has not been studied [1][13].',
      },
      {
        q: 'Why does methylene blue turn urine blue or green?',
        a: 'About 40% of a dose leaves the body unchanged in urine, so the dye colors it blue or green [1]. This is expected; all participants in one study reported it [5]. It can also stain the tongue, skin and clothes.',
      },
      {
        q: 'Is methylene blue a dietary supplement?',
        a: 'Its status is unclear. It is an FDA-approved prescription drug, and drug ingredients generally cannot be sold as supplements unless they were sold as foods or supplements first [1][14]. NPR reported in 2025 that the FDA did not explain how it is sold without a prescription [15].',
      },
      {
        q: 'What is the difference between USP-grade and industrial methylene blue?',
        a: 'USP (pharmaceutical) grade is made to a purity standard for medical use. Industrial and dye grades can contain more than 8–11% contaminants, including heavy metals, and should never be swallowed [11].',
      },
      {
        q: 'Who should not take methylene blue?',
        a: 'People taking antidepressants or other serotonergic drugs, people with G6PD deficiency, pregnant or breastfeeding women, and people with kidney or liver disease or an allergy to thiazine dyes [1][13]. Talk to your doctor first.',
      },
    ],
    sources: [
      { label: 'US Food and Drug Administration, revised 02/2024', title: 'PROVAYBLUE (methylene blue) injection: prescribing information', url: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2024/204630Orig1s023correctedlbl.pdf' },
      { label: 'Managed Healthcare Executive, November 2011', title: 'FDA warns methylene blue, linezolid may cause serotonin syndrome when co-administered with certain psychiatric medications', url: 'https://www.managedhealthcareexecutive.com/view/fda-warns-methylene-blue-linezolid-may-cause-serotonin-syndrome-when-co-administered-certain' },
      { label: 'Gillman PK. Journal of Psychopharmacology, 2011', title: 'CNS toxicity involving methylene blue: the exemplar for understanding and predicting drug interactions that precipitate serotonin toxicity', url: 'https://pubmed.ncbi.nlm.nih.gov/20142303/' },
      { label: 'Zuschlag ZD et al. Psychosomatics, 2018', title: 'Serotonin toxicity and urinary analgesics: a case report and systematic literature review of methylene blue-induced serotonin syndrome', url: 'https://pubmed.ncbi.nlm.nih.gov/30104021/' },
      { label: 'Rodriguez P et al. Radiology, 2016', title: 'Multimodal randomized functional MR imaging of the effects of methylene blue in the human brain', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5084971/' },
      { label: 'Rodriguez P et al. Brain Imaging and Behavior, 2017', title: 'Methylene blue modulates functional connectivity in the human brain', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5018244/' },
      { label: 'Telch MJ et al. American Journal of Psychiatry, 2014', title: 'Post-session administration of USP methylene blue facilitates the retention of pathological fear extinction and contextual memory in phobic adults', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4467026/' },
      { label: 'Gauthier S et al. Lancet, 2016', title: 'Efficacy and safety of tau-aggregation inhibitor therapy in patients with mild or moderate Alzheimer’s disease: a randomised, controlled, double-blind, parallel-arm, phase 3 trial', url: 'https://pubmed.ncbi.nlm.nih.gov/27863809/' },
      { label: 'Wilcock GK et al. Journal of Alzheimer’s Disease, 2018', title: 'Potential of low dose leuco-methylthioninium bis(hydromethanesulphonate) (LMTM) monotherapy for treatment of mild Alzheimer’s disease: cohort analysis as modified primary outcome in a phase III clinical trial', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5734125/' },
      { label: 'Alzheimer’s Disease International, October 2022', title: 'TauRx reports top line results of their Phase 3 study LUCIDITY', url: 'https://www.alzint.org/news-events/news/taurx-reports-top-line-results-of-their-phase-3-study-lucidity/' },
      { label: 'Rojas JC et al. Progress in Neurobiology, 2012', title: 'Neurometabolic mechanisms for memory enhancement and neuroprotection of methylene blue', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3265679/' },
      { label: 'Walter-Sack I et al. European Journal of Clinical Pharmacology, 2009', title: 'High absolute bioavailability of methylene blue given as an aqueous oral formulation', url: 'https://pubmed.ncbi.nlm.nih.gov/18810398/' },
      { label: 'MedlinePlus Genetics (National Library of Medicine)', title: 'Glucose-6-phosphate dehydrogenase deficiency', url: 'https://medlineplus.gov/genetics/condition/glucose-6-phosphate-dehydrogenase-deficiency/' },
      { label: 'US Food and Drug Administration', title: 'Questions and answers on dietary supplements', url: 'https://www.fda.gov/food/information-consumers-using-dietary-supplements/questions-and-answers-dietary-supplements' },
      { label: 'Boden S. NPR (via WFAE), December 2025', title: 'What’s behind the wellness claims for the synthetic dye methylene blue?', url: 'https://www.wfae.org/health/2025-12-15/whats-behind-the-wellness-claims-for-the-synthetic-dye-methylene-blue' },
      { label: 'Snyder M et al. Cancer Control, 2017', title: 'Serotonin syndrome complicating treatment of ifosfamide neurotoxicity with methylene blue', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5937239/' },
    ],
    relatedProducts: [],
    relatedGoals: ['brain-focus'],
  },
];

export const findGuide = (slug: string) => GUIDES.find((g) => g.slug === slug);

// Guides linked from a product page, by ingredient slug match.
export const guidesForProduct = (productSlug: string) => GUIDES.filter((g) => g.relatedProducts.includes(productSlug));
