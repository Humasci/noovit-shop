// Draft guide: biotin (20 Nov 2026). To be merged into GUIDES in lib/guides.ts (same shape as the `Guide` interface).
// Every source below was opened and read (full text or PubMed abstract, as noted in the report). See TO VERIFY at the bottom.

export const BIOTIN_GUIDE = {
  slug: 'biotin',
  ingredient: 'Biotin',
  metaTitle: 'Biotin: Benefits, Dosage, Side Effects & Lab-Test Risk',
  metaDescription:
    'Does biotin help hair or nails? What studies show, the 30 mcg daily intake, side effects, and how high doses can skew thyroid and troponin blood tests.',
  published: '2026-11-20',
  updated: '2026-11-20',
  summary:
    'Biotin (vitamin B7) is an essential B vitamin. Adults need about 30 mcg a day, and most diets supply it [1][2]. In people without a deficiency, studies have not shown that biotin supplements grow hair, and the evidence for brittle nails comes from small, mostly uncontrolled studies [1][2][5]. High-dose supplements (5,000–10,000 mcg) can make some blood tests read falsely high or low, including thyroid and troponin tests, so tell your doctor and the lab if you take biotin [9][10][11].',
  quickFacts: [
    { label: 'What it is', value: 'A water-soluble B vitamin (B7) the body uses to process fats, carbohydrates and protein' },
    { label: 'Daily need (AI)', value: '30 mcg for adults; 35 mcg when breastfeeding' },
    { label: 'Upper limit', value: 'None set; data on harm from high intakes are too limited' },
    { label: 'Strongest evidence', value: 'Brittle nails, in small studies (limited)' },
    { label: 'Main risk', value: 'False blood test results at high doses' },
    { label: 'Tell your doctor if', value: 'You have a blood test, or take anticonvulsants' },
  ],
  whatItIs: [
    'Biotin, also called vitamin B7, is a water-soluble B vitamin. Humans cannot make it, so it has to come from food [16]. It works as a helper (cofactor) for four carboxylase enzymes that the body uses to make fatty acids, make glucose and break down some amino acids [16].',
    'Biotin is found in most foods at low levels, including milk, liver, grains, yeast, soy, nuts, egg yolk and some vegetables [16]. Gut bacteria also make biotin, but how much of it the body uses is unclear [16].',
    'A typical Western diet provides about 35–70 mcg a day, which is more than the adequate intake of 30 mcg [1][2]. In European surveys, average adult intakes ranged from 26 to 50 mcg a day [16].',
    'Raw egg white contains a protein called avidin that binds biotin and stops it from being absorbed. Cooking destroys this effect [16].',
    'Free biotin is absorbed in the small intestine, and at supplement doses it is completely absorbed [16]. The body stores only small amounts and clears the rest in urine [16].',
    'Supplement doses vary widely. Multivitamins usually contain 30–60 mcg, while products marketed for hair, skin and nails often contain 5,000–10,000 mcg (5–10 mg), more than 100 times the adequate intake [2].',
    'Deficiency is rare [16]. It has been seen in people fed by IV without added biotin, people who eat raw egg white regularly, people taking certain anticonvulsant medicines, and people with an inherited enzyme disorder called biotinidase deficiency [16][18]. Signs include thinning hair or hair loss, a scaly red rash, conjunctivitis and, in severe cases, nerve and muscle problems [16][18].',
    'There is no reliable single blood test for biotin status. Blood levels change from day to day, and researchers use urine markers instead [1][16].',
  ],
  benefits: [
    {
      title: 'Hair growth in people without a deficiency',
      evidence: 'Insufficient' as const,
      text:
        'No randomized trial has shown that biotin improves hair growth in healthy people [1][2]. In the only double-blind, placebo-controlled trial found by a 2024 review, women with diffuse hair loss took 10 mg a day (28 people) or placebo (18 people) for 4 weeks, and hair growth did not differ between the groups [2]. In a small open-label crossover study of 10 healthy men, 5 mg of biotin a day for 14 days did not significantly change the hair growth rate [4]. Two other studies, in people taking isotretinoin and in women after weight-loss surgery, were not blinded and did not show clear benefit [2]. A 2021 review in the Journal of the American Academy of Dermatology concluded that the evidence is insufficient to recommend biotin supplements in dermatology [3].',
    },
    {
      title: 'Hair loss caused by deficiency or rare hair conditions',
      evidence: 'Limited' as const,
      text:
        'A 2017 review found 18 published cases of biotin use for hair or nail problems. Every patient had an underlying cause, such as an inherited biotin enzyme disorder (10 cases) or uncombable hair syndrome (3 cases), and all improved with biotin [1]. In a 5-month-old infant with dietary biotin deficiency, hair regrew after 2 months of 1,000 mcg a day [1]. These are case reports, not controlled trials, and the authors stressed that such cases are uncommon [1].',
    },
    {
      title: 'Brittle nails',
      evidence: 'Limited' as const,
      text:
        'In a small Swiss study, nail thickness increased by 25% in 8 people with brittle nails who took biotin [7]. In a retrospective review of 35 people with brittle nails, 22 (63%) improved on daily biotin and 13 (37%) reported no change [6]. In a 4-month randomized, assessor-blinded trial of 50 people, 80% of those using a nail lacquer plus 10 mg of biotin a day had at least a 50% improvement in nail scores, compared with 53% using the lacquer alone (p = .05) [8]. Studies used 2,500–3,000 mcg a day [1]. Reviewers call the results promising but say larger controlled trials are needed [5].',
    },
  ],
  dosage: [
    'Adequate intake: adults need 30 mcg a day, including during pregnancy, and 35 mcg a day while breastfeeding [1]. There is not enough evidence to set a Recommended Dietary Allowance, so these are adequate intakes [1]. Most people get this from food [1][2].',
    'No upper limit has been set, because data on harm from high intakes are too limited [16]. That does not mean more is better: high doses have not been shown to help hair in healthy people [1][2].',
    'Studied doses: 2,500–3,000 mcg a day in brittle-nail studies, and 5,000–10,000 mcg a day in hair studies that found no clear benefit [1][2][4].',
    'Pregnancy: a study in pregnant women suggested that needs in late pregnancy may be 2–3 times the current adequate intake, but more research is needed to set a figure [16][17]. Ask your doctor or midwife before adding a separate supplement.',
    'Add up biotin from all your products. Multivitamins, prenatal vitamins and hair, skin and nail supplements can all contain it [12].',
    'Talk to your doctor before starting, especially if you take any medication, have a medical condition, or have blood tests coming up.',
  ],
  sideEffects: [
    'Biotin is generally well tolerated, even at doses up to 300 mg a day given for multiple sclerosis [14]. In a 4-month nail trial, 10 mg a day was well tolerated [8].',
    'The main risk is false lab results. Biotin is used inside many lab tests, and high blood levels can make results falsely high or falsely low, depending on how the test works [12][19].',
    'In 6 healthy adults who took 10 mg a day for 7 days, 9 of 23 biotin-based tests gave wrong results. Some thyroid and vitamin D results were falsely high, and some TSH, parathyroid hormone and heart-failure (NT-proBNP) results were falsely low [9].',
    'Falsely low TSH with falsely high thyroid hormones can look like an overactive thyroid. In one case, a man taking 10,000 mcg a day was treated with antithyroid drugs for 2 months before biotin was found to be the cause; his results returned to normal 5 days after stopping it [14].',
    'Biotin can make troponin results falsely low. Troponin is the test used to diagnose a heart attack, so a false result can delay diagnosis [10][11]. The FDA has reported one death linked to a falsely low troponin result caused by biotin [13].',
    'Other tests reported as affected include sex hormones, ferritin, vitamin B12, PSA, PTH, LH and FSH, depending on the lab equipment [15]. Many test makers have changed their tests to reduce the problem, but not all [11][15].',
  ],
  interactions: [
    'Lab tests: biotin is not a drug interaction in the usual sense, but it can distort tests that use biotin-streptavidin chemistry, including thyroid, hormone and troponin tests [11][12][19]. Tell your doctor and the lab about any biotin, multivitamin or hair, skin and nail supplement [13].',
    'Anticonvulsants: long-term use of seizure medicines can lower biotin levels [18]. People taking valproic acid had lower biotin and biotinidase levels in one study [1]. Ask your doctor before supplementing.',
    'Long-term antibiotics: these can disrupt gut bacteria and are linked to biotin deficiency [18].',
    'Isotretinoin: listed as a possible cause of acquired biotin deficiency [1].',
    'Raw egg white: eaten regularly, it can block biotin absorption. Cooked egg is not a concern [16].',
  ],
  avoidIf: [
    'You have a blood test coming up and have not told your doctor and the lab that you take biotin [13]',
    'You are being checked or treated for a thyroid condition, unless your doctor knows about your biotin use [14]',
    'You take anticonvulsant medicine and have not asked your doctor first [1][18]',
    'You are pregnant or breastfeeding and plan to take more than a prenatal vitamin provides, without asking your doctor or midwife',
    'You already take a multivitamin or prenatal vitamin with biotin and are adding a high-dose product without checking the total [2][12]',
  ],
  howToChoose: [
    'Match the dose to the goal. A multivitamin level (30–60 mcg) covers the adequate intake [1][2]. No study has shown that 5,000 or 10,000 mcg helps hair in people without a deficiency [1][2][4].',
    'If you want to try biotin for brittle nails, studies used 2,500–3,000 mcg a day, and the randomized trial ran for 4 months [1][8].',
    'Check every product you take for biotin, including multivitamins, prenatal vitamins and hair, skin and nail blends [12].',
    'Look for a label that tells you to inform your doctor before blood tests.',
    'Third-party tested, with a certificate of analysis available on request.',
    'No claims to cure hair loss or treat any disease. Under US law supplements cannot make those claims.',
  ],
  faqs: [
    {
      q: 'Does biotin help hair growth?',
      a: 'Only, as far as studies show, if hair loss is caused by a biotin deficiency or a rare condition [1]. In people without a deficiency, the one placebo-controlled trial found no difference in hair growth, and a small 2024 study in healthy men found no significant change [2][4].',
    },
    {
      q: 'Can you take too much biotin?',
      a: 'No upper limit has been set, and doses up to 300 mg a day have been well tolerated in multiple sclerosis studies [14][16]. The real problem with high doses is false blood test results, including thyroid and troponin tests [9][10].',
    },
    {
      q: 'Does biotin affect blood tests?',
      a: 'Yes. High doses can make some lab tests falsely high or falsely low [12]. In healthy adults taking 10 mg a day, 9 of 23 biotin-based tests were affected [9]. Falsely low troponin can delay a heart attack diagnosis, and the FDA has reported a death [11][13].',
    },
    {
      q: 'How long should I stop biotin before a blood test?',
      a: 'Ask your doctor; the FDA has said data are not available to set a time [13]. Reviews suggest at least 8 hours is likely enough after 5–10 mg or less, and many advise stopping at least 2 days before [2]. For thyroid tests, a case review advises 2–3 days [14].',
    },
    {
      q: 'When should I take biotin?',
      a: 'No study has compared times of day, so take it when it suits you. If you have a blood test coming up, ask your doctor whether to pause it first, and tell the lab you take it [2][13].',
    },
    {
      q: 'Does biotin help brittle nails?',
      a: 'Possibly. Small studies found thicker nails and fewer splits with 2,500–3,000 mcg a day, and a randomized trial found more improvement when 10 mg a day was added to a nail lacquer [1][7][8]. Larger controlled trials are still needed [5].',
    },
    {
      q: 'Who might be low in biotin?',
      a: 'Deficiency is rare [16]. It is more likely with long-term anticonvulsant or antibiotic use, IV feeding without biotin, regularly eating raw egg white, or an inherited biotinidase deficiency [16][18]. Needs may also rise in pregnancy [16][17].',
    },
  ],
  answers: {
    benefits:
      'Biotin helps the body use fats, carbohydrates and protein [16]. In case reports, it reversed hair loss caused by biotin deficiency, which is rare [1][16]. In people without one, the only placebo-controlled trial of 10 mg a day found no difference in hair growth [2]. Small studies of 2,500–3,000 mcg a day suggest it may help brittle nails [1][6][7].',
    dosage:
      'Adults need 30 mcg of biotin a day, including in pregnancy, and 35 mcg while breastfeeding [1]. Most diets provide 35–70 mcg a day [1][2]. No upper limit has been set [16]. Hair, skin and nail products often contain 5,000–10,000 mcg, more than 100 times what you need, with no proven extra benefit for hair [2].',
    timing:
      'Take biotin at any time of day; no study has compared times. Timing matters most before blood tests. After doses of 5–10 mg or less, at least 8 hours off is likely enough, and many experts advise stopping at least 2 days before [2]. For thyroid tests, 2–3 days is advised [14]. Always tell the lab [13].',
    sideEffects:
      'Biotin is well tolerated, even at doses up to 300 mg a day in multiple sclerosis studies [14]. The main risk is false lab results: in healthy adults taking 10 mg a day, 9 of 23 biotin-based tests were wrong [9]. Falsely low troponin can delay a heart attack diagnosis, and the FDA has reported one death [11][13].',
    compare:
      'Neither 5,000 nor 10,000 mcg of biotin has been shown to grow hair in people without a deficiency [2][4]. Both are far above the 30 mcg adults need [1]. Both can affect lab tests: 10 mg a day for a week caused wrong results in 9 of 23 biotin-based tests [9]. More is not better.',
  },
  dosageTable: {
    caption: 'Adequate intake (AI) of biotin per day from all sources, set by the US Institute of Medicine [1]',
    head: ['Group', 'Adequate intake per day'],
    rows: [
      ['Adults, 19 and over', '30 mcg'],
      ['Pregnancy', '30 mcg'],
      ['Breastfeeding', '35 mcg'],
      ['Teens, 14–18', '25 mcg'],
      ['Children, 9–13', '20 mcg'],
      ['Children, 4–8', '12 mcg'],
      ['Children, 1–3', '8 mcg'],
      ['Upper limit', 'Not set; too little data on harm from high intakes [16]'],
    ],
  },
  timing: {
    rows: [
      ['Daily use', 'Any time of day; no study has compared times'],
      ['Before a routine blood test', 'Tell your doctor and the lab [13]. At least 8 hours off is likely enough after 5–10 mg or less; many advise at least 2 days [2]'],
      ['Before a thyroid test', 'Stop at least 2–3 days before, if your doctor agrees [14]'],
      ['To be sure all effects are gone', 'In one study, interference had cleared 1 week after stopping 10 mg a day [9]'],
      ['Chest pain or emergency care', 'Tell staff you take biotin: it can make troponin results falsely low [10][11]'],
    ] as [string, string][],
  },
  compare: {
    title: 'Biotin 5,000 mcg vs 10,000 mcg: is more better?',
    head: ['', '5,000 mcg (5 mg)', '10,000 mcg (10 mg)'],
    rows: [
      { label: 'Amount per serving', values: ['About 167 times the adult AI of 30 mcg [1]', 'About 333 times the adult AI [9]'] },
      { label: 'Evidence for hair', values: ['No significant change in hair growth rate in 10 healthy men over 14 days [4]', 'No difference from placebo in women with diffuse hair loss over 4 weeks [2]'] },
      { label: 'Best for', values: ['No proven hair benefit without deficiency; brittle-nail studies used 2,500–3,000 mcg [1]', 'No proven hair benefit without deficiency; added to a nail lacquer in one brittle-nail trial [8]'] },
      { label: 'Main caution', values: ['Can affect lab tests; at least 8 hours off is likely enough before a test [2]', 'Wrong results in 9 of 23 biotin-based tests after 1 week [9]; falsely low troponin [10]'] },
    ],
    note: 'Neither dose has been shown to help hair in people without a deficiency. Whether a test is affected depends on the blood biotin level and the test used [10][19].',
  },
  intake: { recommended: '30 mcg a day for adults (adequate intake)', maximum: 'No upper limit set' },
  sources: [
    { label: 'Patel DP et al. Skin Appendage Disorders, 2017', title: 'A review of the use of biotin for hair loss', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5582478/' },
    { label: 'Yelich A et al. Journal of Clinical and Aesthetic Dermatology, 2024', title: 'Biotin for hair loss: teasing out the evidence', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11324195/' },
    { label: 'Thompson KG, Kim N. Journal of the American Academy of Dermatology, 2021', title: 'Dietary supplements in dermatology: a review of the evidence for zinc, biotin, vitamin D, nicotinamide, and Polypodium', url: 'https://pubmed.ncbi.nlm.nih.gov/32360756/' },
    { label: 'Valentim FO et al. Anais Brasileiros de Dermatologia, 2024', title: 'Efficacy of 5% topical minoxidil versus 5 mg oral biotin versus topical minoxidil and oral biotin on hair growth in men: randomized, crossover, clinical trial', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11221127/' },
    { label: 'Lipner SR, Scher RK. Journal of Dermatological Treatment, 2018', title: 'Biotin for the treatment of nail disease: what is the evidence?', url: 'https://pubmed.ncbi.nlm.nih.gov/29057689/' },
    { label: 'Hochman LG et al. Cutis, 1993', title: 'Brittle nails: response to daily biotin supplementation', url: 'https://pubmed.ncbi.nlm.nih.gov/8477615/' },
    { label: 'Colombo VE et al. Journal of the American Academy of Dermatology, 1990', title: 'Treatment of brittle fingernails and onychoschizia with biotin: scanning electron microscopy', url: 'https://pubmed.ncbi.nlm.nih.gov/2273113/' },
    { label: 'Chiavetta A et al. Dermatologic Therapy, 2019', title: 'Treatment of brittle nail with a hydroxypropyl chitosan-based lacquer, alone or in combination with oral biotin: a randomized, assessor-blinded trial', url: 'https://pubmed.ncbi.nlm.nih.gov/31344296/' },
    { label: 'Li D et al. JAMA, 2017', title: 'Association of biotin ingestion with performance of hormone and nonhormone assays in healthy adults', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5818818/' },
    { label: 'Frame IJ et al. American Journal of Clinical Pathology, 2019', title: 'Susceptibility of cardiac troponin assays to biotin interference', url: 'https://pubmed.ncbi.nlm.nih.gov/30715102/' },
    { label: 'US Food and Drug Administration', title: 'Biotin interference with troponin lab tests: assays subject to biotin interference', url: 'https://www.fda.gov/medical-devices/in-vitro-diagnostics/biotin-interference-troponin-lab-tests-assays-subject-biotin-interference' },
    { label: 'US Food and Drug Administration, 2020', title: 'Testing for biotin interference in in vitro diagnostic devices: guidance for industry (NLM archived copy)', url: 'https://collections.nlm.nih.gov/txt/nlm:nlmuid-9918231297106676-pdf' },
    { label: 'University of Utah Health Pharmacy Services, 2019', title: 'Biotin (vitamin B7) may interfere with laboratory test results leading to inaccurate interpretation (summary of the FDA safety communication of 5 November 2019)', url: 'https://pharmacyservices.utah.edu/alerts/2019/11/biotin-vitamin-b7-may-interfere-laboratory-test-results-leading-inaccurate' },
    { label: 'James A et al. Journal of Medical Case Reports, 2023', title: 'Biotin induced biochemical hyperthyroidism: a case report and review of the literature', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10304644/' },
    { label: 'Moerman A, Delanghe JR. Acta Clinica Belgica, 2022', title: 'Sense and nonsense concerning biotin interference in laboratory tests', url: 'https://pubmed.ncbi.nlm.nih.gov/32567529/' },
    { label: 'Solvik BS, Strand TA. Food & Nutrition Research, 2024', title: 'Biotin: a scoping review for Nordic Nutrition Recommendations 2023', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10845898/' },
    { label: 'Mock DM. Journal of Nutrition, 2017', title: 'Biotin: from nutrition to therapeutics', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5525106/' },
    { label: 'Cervantes A, Daley SF. StatPearls, 2025', title: 'Biotin deficiency', url: 'https://pubmed.ncbi.nlm.nih.gov/31613531/' },
    { label: 'Li D et al. Journal of Applied Laboratory Medicine, 2020', title: 'AACC guidance document on biotin interference in laboratory tests', url: 'https://pubmed.ncbi.nlm.nih.gov/32445355/' },
  ],
  relatedProducts: ['biotin-complex'],
  relatedGoals: ['hair-skin-nails'],
};

// TO VERIFY (for the owner; NIH ODS and the FDA safety communication pages were blocked from this session):
// - NIH ODS Biotin fact sheet (https://ods.od.nih.gov/factsheets/Biotin-HealthProfessional/) could not be opened, so it is
//   NOT cited. If you can open it, consider adding it as a source and checking: (a) the US Food and Nutrition Board set no UL
//   for biotin (the "No upper limit set" here rests on the Nordic/EFSA review [16], which says data are insufficient to set a
//   UL); (b) the Daily Value on US labels (believed to be 30 mcg; left out of the page); (c) food amounts in mcg per serving
//   (left out because no reachable source gave them).
// - The FDA safety communications themselves (28 Nov 2017; update 5 Nov 2019) could not be opened (fda.gov URL now 404s;
//   the archived copy is blocked). Facts from them (one death from a falsely low troponin; supplements with up to 650 times
//   the daily intake; "data are not available" on how long to stop before a test) are cited to the University of Utah
//   summary [13]. If you can open the FDA page, swap [13] for it. The FDA's 2020 industry guidance [12] (opened via NLM)
//   confirms the two communication dates and the falsely high/low mechanism.
// - Sources 3, 5, 6, 7, 8, 10, 15, 18, 19 were read as PubMed abstracts only (full text not reachable).
// - US adequate intakes (30 / 30 / 35 mcg) come from the Institute of Medicine table reproduced in Patel et al. [1].
//   EFSA uses 40 mcg for adults [16]; the page uses the US figure.
// - The compare table chose "5,000 vs 10,000 mcg" over "biotin vs collagen": no collagen-for-hair source was opened.
