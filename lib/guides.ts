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
  }
];

export const findGuide = (slug: string) => GUIDES.find((g) => g.slug === slug);

// Guides linked from a product page, by ingredient slug match.
export const guidesForProduct = (productSlug: string) => GUIDES.filter((g) => g.relatedProducts.includes(productSlug));
