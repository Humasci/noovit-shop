-- Journal drafts generated from content/journal/*.md by scripts/journal-sql.ts (4 posts).

-- Loads each post as a DRAFT. Posts that already exist (same slug) are not changed. Safe to re-run.

-- Then: Admin → Blog → open each draft, have the medical reviewer check it, set a publish date and publish.

insert into posts (slug, title, excerpt, body, author, status, seo_title, seo_description)
values ($jr$creatine-loading-phase$jr$, $jr$Do you need a creatine loading phase?$jr$, $jr$No. Loading fills your muscles in about a week; 3 to 5 grams a day gets you to the same place in about four. Here's the study behind that, and when loading might still make sense.$jr$, $jr$**Short answer:** no. Loading is a shortcut, not a requirement. Taking about 20 g a day for 5–7 days fills your muscles' creatine stores within a week. Taking 3–5 g a day gets them to the same level in about 3–4 weeks [1][2][3]. Once stores are full, the result is the same either way.

## The study behind it

The key experiment dates from 1996. Researchers measured creatine inside the thigh muscles of 31 men taking creatine in different ways [3]:

- **20 g a day for 6 days** raised muscle creatine by about **20%**.
- That level was **kept up with 2 g a day** for the next 30 days.
- When people stopped completely, levels drifted back to where they started over about 30 days.
- **3 g a day for 28 days** produced the **same 20% rise**, just more gradually.

The authors' conclusion: loading is a fast way to fill muscle stores, and 3 g a day is likely to be just as effective in the long run [3].

## The two ways to start

| | Loading | Steady daily dose |
|---|---|---|
| How much | About 0.3 g per kg of body weight a day (usually 20 g, split into four 5 g doses) for 5–7 days, then 3–5 g a day [1][2] | 3–5 g a day from day one (larger athletes may use 5–10 g) [1] |
| Muscles full in | About 1 week [1][3] | About 3–4 weeks [2][3] |
| Water weight | Often 1–3 kg in the first week, mostly water held inside muscle [1][2] | Less noticeable [2] |
| Stomach | Large single doses (above about 10 g) are more likely to cause bloating or diarrhea, so split them [2] | Rarely an issue at 3–5 g [2] |
| Uses up | Much more creatine in the first week | Less |

## When loading might make sense

- **You want the benefit sooner,** for example with a competition or a training block coming up in the next couple of weeks.
- **You don't mind the scale going up** by a kilo or two of water at first.

When it doesn't: if you're starting for the long haul, or the extra water weight bothers you, a steady 3–5 g a day is simpler and gets you to the same place.

Either way, creatine works best for short, repeated bursts of effort, and adds most when combined with resistance training [1][4].

## Practical tips

- **Mix it with anything:** water, juice or a shake. Taking it with carbohydrate (or carbohydrate and protein) may increase uptake into muscle, but hasn't clearly improved performance beyond creatine alone [1].
- **Timing matters less than consistency.** Take it every day, including rest days.
- **Coffee is probably fine.** One small 1996 study found that a high daily caffeine dose cancelled out the benefit of loading [5]. A 2022 review of 10 studies found mixed results: high daily caffeine *during loading* might blunt it, but a pre-workout coffee didn't cancel creatine's effect [6]. Moderate coffee is unlikely to matter.
- **Blood tests:** creatine can raise creatinine, the marker doctors use to estimate kidney function, without harming the kidneys. Tell your doctor you take it before a kidney blood test [2][7].

## Who should check with a doctor first

Talk to your doctor before taking creatine if you have **kidney disease** or reduced kidney function, or a condition that affects the kidneys such as diabetes or high blood pressure. In healthy people, studied doses haven't been shown to harm kidney function [1][8]. Creatine is for adults; we sell it for ages 18 and over. More in our [creatine guide](/guides/creatine).

## Our creatine

Our [Creatine](/products/creatine) is pure creatine monohydrate: 5 g of creatine per scoop, 50 servings per tub. The label gives both options: four scoops a day for the first 5 days if you want to load, then one or two a day. Note that loading uses 20 scoops in that first week, so a tub lasts about 5 weeks with loading, or up to 50 days at one scoop a day.

## Sources

1. Kreider RB et al. Journal of the International Society of Sports Nutrition, 2017. [International Society of Sports Nutrition position stand: safety and efficacy of creatine supplementation in exercise, sport, and medicine](https://pmc.ncbi.nlm.nih.gov/articles/PMC5469049/).
2. Antonio J et al. Journal of the International Society of Sports Nutrition, 2021. [Common questions and misconceptions about creatine supplementation: what does the scientific evidence really show?](https://pmc.ncbi.nlm.nih.gov/articles/PMC7871530/)
3. Hultman E et al. Journal of Applied Physiology, 1996. [Muscle creatine loading in men](https://pubmed.ncbi.nlm.nih.gov/8828669/).
4. Delpino FM et al. Nutrition, 2022. [Influence of age, sex, and type of exercise on the efficacy of creatine supplementation on lean body mass: a systematic review and meta-analysis of randomized clinical trials](https://pubmed.ncbi.nlm.nih.gov/35986981/).
5. Vandenberghe K et al. Journal of Applied Physiology, 1996. [Caffeine counteracts the ergogenic action of muscle creatine loading](https://pubmed.ncbi.nlm.nih.gov/8929583/).
6. Elosegui S et al. International Journal of Sport Nutrition and Exercise Metabolism, 2022. [Interaction between caffeine and creatine when used as concurrent ergogenic supplements: a systematic review](https://pubmed.ncbi.nlm.nih.gov/35016154/).
7. Jagim AR et al. Journal of the International Society of Sports Nutrition, 2012. [A buffered form of creatine does not promote greater changes in muscle creatine content, body composition, or training adaptations than creatine monohydrate](https://pmc.ncbi.nlm.nih.gov/articles/PMC3479057/).
8. de Souza e Silva A et al. Journal of Renal Nutrition, 2019. [Effects of creatine supplementation on renal function: a systematic review and meta-analysis](https://pubmed.ncbi.nlm.nih.gov/31375416/).
$jr$, 'Noovit', 'draft', $jr$Do You Need a Creatine Loading Phase? | Noovit$jr$, $jr$A creatine loading phase fills muscle stores in about a week; 3 g a day reaches the same level in about 4 weeks. Doses, trade-offs and how to do either.$jr$)
on conflict (slug) do nothing;

insert into posts (slug, title, excerpt, body, author, status, seo_title, seo_description)
values ($jr$how-long-does-ashwagandha-take-to-work$jr$, $jr$How long does ashwagandha take to work? What the trials measured$jr$, $jr$Most trials measured results after 8 to 10 weeks, and at the 4 to 5 week check-ins the differences from placebo were mostly not there yet. Here's the timeline, study by study.$jr$, $jr$**Short answer:** think in **weeks, not days**. In the main trials, the clear differences from placebo on stress, cortisol and sleep showed up at **8 to 10 weeks**. At the halfway check-ins (4 to 5 weeks), most measures weren't yet different from placebo, though a few sleep scores were [1][2][3]. A meta-analysis also found bigger sleep effects after 8 weeks or more [4].

## The timeline, study by study

### Stress and cortisol: 8 weeks

In a trial of 58 healthy adults, people took 250 mg or 600 mg of ashwagandha root extract a day, or placebo, with check-ins at weeks 4 and 8 [1].

- **At week 4**, the paper reports no significant difference from placebo on stress, cortisol, anxiety or sleep quality [1].
- **At week 8**, the 600 mg group's perceived stress score was 14.2 versus 16.6 on placebo, and morning cortisol was 10.9 versus 15.5 mcg/dL. The 250 mg group improved less, and its anxiety score was not significantly better than placebo [1].

A larger effect showed up in a 60-day trial of 64 adults with chronic stress: 600 mg a day of KSM-66 lowered perceived stress scores by 44% versus 5.5% with placebo, and serum cortisol by 27.9% versus 7.9%. Results were measured at the end of the 60 days [2].

### Sleep: some measures at 5 weeks, more at 10

In a trial of adults with insomnia, people took 300 mg of KSM-66 twice a day, or placebo, with check-ins at weeks 5 and 10 [3].

- **At week 5**, sleep efficiency (time asleep as a share of time in bed) and overall sleep-quality scores were already better than placebo. Time to fall asleep, the main outcome, wasn't yet significantly different [3].
- **At week 10**, time to fall asleep had dropped from about 42 to 29 minutes, versus 42 to 34 minutes on placebo, and sleep efficiency reached 83% versus 80%. Total sleep time was not significantly different [3].

A 2021 meta-analysis of 5 trials (400 adults) found a small overall improvement in sleep, larger in people with insomnia, at 600 mg a day or more, and with **8 weeks or more** of use [4].

### Anything sooner?

A 2026 trial in healthy, active adults reported lower weekly perceived stress after just **14 days** with a morning formula of 600 mg ashwagandha plus 300 mg rhodiola [5]. Because it combined two herbs and was short, it can't tell us how quickly ashwagandha alone works. The longer trials above are the better guide.

## What this means in practice

- **Give it 8 weeks** before deciding whether it's doing anything for you, taken daily at a studied dose.
- **Studied doses:** 240–600 mg of extract a day, with KSM-66 usually at 300 mg twice a day or 600 mg once [1][2][3][6].
- **Consistency matters more than timing.** Trials gave it once or twice a day, with water or milk [2][3]. We found no trial that compared morning with evening doses.
- **Judge it on what was measured:** stress ratings, cortisol and sleep scores moved gradually. It isn't a sedative you'd feel within an hour.

## How long can you take it?

NCCIH says ashwagandha may be safe when taken for up to **3 months**, and that there isn't enough information on longer use [7]. Most trials lasted 8 to 12 weeks. If you want to keep taking it beyond that, talk to your doctor.

Stop and see a doctor if you notice yellowing of the skin or eyes, itching, nausea, unusual tiredness or stomach pain. Rare but serious liver injury has been reported, with symptoms starting 2 to 12 weeks after people began taking it [8][9].

**Check with your doctor first** if you have a thyroid condition or take thyroid medication (ashwagandha can raise thyroid hormones), take sedatives, anti-seizure, diabetes, blood-pressure or immune-suppressing medicines, have an autoimmune condition or liver disease, or have surgery coming up. Don't take it if you're pregnant or breastfeeding [7][10]. Full details in our [ashwagandha guide](/guides/ashwagandha).

## Our product

[Ashwagandha Calm+](/products/ashwagandha) gives 600 mg of KSM-66 root extract in two capsules a day, the dose used in the main stress trials. It also contains vitamins D3, B6 and B12, L-arginine, maca, Panax ginseng and shatavari, which weren't part of those trials, so read the full label and check it with your doctor if you take any medication.

## Sources

1. Salve J et al. Cureus, 2019. [Adaptogenic and anxiolytic effects of ashwagandha root extract in healthy adults: a double-blind, randomized, placebo-controlled clinical study](https://pmc.ncbi.nlm.nih.gov/articles/PMC6979308/).
2. Chandrasekhar K et al. Indian Journal of Psychological Medicine, 2012. [A prospective, randomized double-blind, placebo-controlled study of safety and efficacy of a high-concentration full-spectrum extract of ashwagandha root in reducing stress and anxiety in adults](https://pmc.ncbi.nlm.nih.gov/articles/PMC3573577/).
3. Langade D et al. Cureus, 2019. [Efficacy and safety of ashwagandha root extract in insomnia and anxiety: a double-blind, randomized, placebo-controlled study](https://pmc.ncbi.nlm.nih.gov/articles/PMC6827862/).
4. Cheah KL et al. PLoS One, 2021. [Effect of ashwagandha (Withania somnifera) extract on sleep: a systematic review and meta-analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC8462692/).
5. Mastrofini GF et al. Journal of the International Society of Sports Nutrition, 2026. [Modulating stress and sleep through a multi-compound dietary supplement: a randomized, double-blind, placebo-controlled trial](https://pubmed.ncbi.nlm.nih.gov/42829807/).
6. Lopresti AL et al. Medicine, 2019. [An investigation into the stress-relieving and pharmacological actions of an ashwagandha (Withania somnifera) extract: a randomized, double-blind, placebo-controlled study](https://pmc.ncbi.nlm.nih.gov/articles/PMC6750292/).
7. National Center for Complementary and Integrative Health (NCCIH). [Ashwagandha: usefulness and safety](https://www.nccih.nih.gov/health/ashwagandha).
8. Björnsson HK et al. Liver International, 2020. [Ashwagandha-induced liver injury: a case series from Iceland and the US Drug-Induced Liver Injury Network](https://pmc.ncbi.nlm.nih.gov/articles/PMC8041491/).
9. LiverTox (NIDDK, National Institutes of Health). [Ashwagandha](https://www.ncbi.nlm.nih.gov/books/NBK548536/).
10. Sharma AK et al. Journal of Alternative and Complementary Medicine, 2018. [Efficacy and safety of ashwagandha root extract in subclinical hypothyroid patients: a double-blind, randomized placebo-controlled trial](https://pubmed.ncbi.nlm.nih.gov/28829155/).
$jr$, 'Noovit', 'draft', $jr$How Long Does Ashwagandha Take to Work? | Noovit$jr$, $jr$In trials, ashwagandha's effects on stress and sleep showed up after 8–10 weeks, not days. What each study measured, and how long it's safe to take.$jr$)
on conflict (slug) do nothing;

insert into posts (slug, title, excerpt, body, author, status, seo_title, seo_description)
values ($jr$magnesium-and-ashwagandha-together$jr$, $jr$Can you take magnesium and ashwagandha together?$jr$, $jr$No known interaction, popular as an evening pair, but only one trial has given both, and it didn't find the combination worked better. What the research says, and who should check first.$jr$, $jr$**Short answer:** for most healthy adults, yes. Neither NIH's magnesium fact sheet nor its ashwagandha page lists the other as an interaction [1][2]. But "safe to combine" is not the same as "works better together". Only one trial has given people both, as part of a five-ingredient routine, and the group taking everything did not do better than the group taking the ashwagandha formula alone [3].

Here's what each one has shown on its own, what that one trial found, and how people usually take them.

## What each does on its own

**Magnesium** is an essential mineral that adults need at 310–420 mg a day, and about half of Americans get less than that from food [1]. For sleep, the evidence is limited. In a 4-week trial of 155 adults with self-reported poor sleep, 250 mg of magnesium (as bisglycinate) before bed lowered insomnia scores by 3.9 points, versus 2.3 with placebo. That's a small effect, and other sleep and mood questionnaires didn't change [4]. More in our [magnesium guide](/guides/magnesium).

**Ashwagandha** is a root extract from Ayurvedic medicine. Its best evidence is for stress. In a 60-day trial of 64 adults with chronic stress, 600 mg a day of KSM-66 lowered perceived stress scores by 44% (versus 5.5% with placebo) and blood cortisol by 27.9% (versus 7.9%) [5]. For sleep, a meta-analysis of 5 trials found a small improvement, larger at 600 mg a day or more and after 8 weeks or more [6]. More in our [ashwagandha guide](/guides/ashwagandha).

## Has anyone tested them together?

We searched PubMed and found one randomized trial that gave both, published in October 2026 [3]. It split 103 healthy, active adults into four groups for two weeks:

| Group | Morning | Evening |
|---|---|---|
| Morning only | 600 mg ashwagandha + 300 mg rhodiola | Placebo |
| Evening only | Placebo | Magnesium L-threonate (145 mg magnesium) + L-theanine + apigenin |
| Both | Both formulas | Both formulas |
| Placebo | Placebo | Placebo |

Compared with placebo, the morning ashwagandha-and-rhodiola group improved on weekly perceived stress, sleep-related impairment and night-time waking (measured by a wearable). The study reports these benefits only for that group. The group taking both formulas scored worse than the morning-only group on overall sleep quality (the PSQI questionnaire), and its positive mood scores dipped [3].

What this does and doesn't tell us:

- It was short (two weeks) in healthy people who weren't very stressed or sleeping badly to begin with, which the authors note may hide effects [3].
- Each formula had other ingredients, so it can't show what magnesium plus ashwagandha alone would do.
- It doesn't suggest the pair is harmful. It just gives no evidence yet that combining them adds anything.

So if you take both, take each for its own reason, and judge each on its own.

## How people take them

- **Magnesium in the evening.** Sleep trials gave it 30–60 minutes before bed [4].
- **Ashwagandha once or twice a day.** Trials gave it once or twice daily, with water or milk, for 8–12 weeks [5][7]. Results were measured after 8–10 weeks, so don't expect much in the first few days.
- **Mind the magnesium total.** The upper limit from supplements is 350 mg a day for adults (food doesn't count). Add up your multivitamin, antacids and laxatives too [1].
- **Watch your stomach.** Both can upset it: magnesium can cause diarrhea, especially at higher doses, and ashwagandha can cause stomach upset, diarrhea and vomiting in some people [1][2]. Starting one at a time makes it easier to tell which is the cause.
- **Ashwagandha can cause drowsiness** in some people [2]. Take care with driving until you know how it affects you.

## Who should check with a doctor first

- **Thyroid conditions or thyroid medication:** ashwagandha can raise thyroid hormone levels [2][8].
- **Sedatives, sleep medicines or anti-seizure medicines:** ashwagandha may interact with them [2].
- **Medicines for diabetes, blood pressure, or that suppress the immune system:** ashwagandha may interact with these too [2].
- **Kidney disease:** the kidneys clear excess magnesium, so it can build up [1].
- **Antibiotics (tetracyclines, quinolones) or osteoporosis drugs (bisphosphonates):** magnesium binds to them, so space the doses [1].
- **Pregnancy or breastfeeding:** avoid ashwagandha [2].
- **Liver problems:** rare but serious liver injury has been linked to ashwagandha. Stop and see a doctor if you notice yellowing of the skin or eyes, itching, nausea, unusual tiredness or stomach pain [2][9][10].
- **Surgery coming up, an autoimmune condition, or hormone-sensitive prostate cancer:** NCCIH advises against ashwagandha [2].

NCCIH says ashwagandha may be safe for up to 3 months; long-term safety isn't known [2].

## If you want both in one order

Our [Sleep & Calm Stack](/products/sleep-calm-stack) pairs [Magnesium Sleep+](/products/magnesium-complex) (275 mg of magnesium as glycinate, taken after an evening meal) with [Ashwagandha Calm+](/products/ashwagandha) (600 mg of KSM-66, the dose used in the main stress trials, usually taken in the morning). Ashwagandha Calm+ also contains vitamins D3, B6 and B12, L-arginine, maca, Panax ginseng and shatavari, which weren't part of those trials, so read the full label and check it with your doctor if you take any medication.

## Sources

1. NIH Office of Dietary Supplements. [Magnesium: fact sheet for health professionals](https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/).
2. National Center for Complementary and Integrative Health (NCCIH). [Ashwagandha: usefulness and safety](https://www.nccih.nih.gov/health/ashwagandha).
3. Mastrofini GF et al. Journal of the International Society of Sports Nutrition, 2026. [Modulating stress and sleep through a multi-compound dietary supplement: a randomized, double-blind, placebo-controlled trial](https://pubmed.ncbi.nlm.nih.gov/42829807/).
4. Schuster J et al. Nature and Science of Sleep, 2025. [Magnesium bisglycinate supplementation in healthy adults reporting poor sleep: a randomized, placebo-controlled trial](https://pmc.ncbi.nlm.nih.gov/articles/PMC12412596/).
5. Chandrasekhar K et al. Indian Journal of Psychological Medicine, 2012. [A prospective, randomized double-blind, placebo-controlled study of safety and efficacy of a high-concentration full-spectrum extract of ashwagandha root in reducing stress and anxiety in adults](https://pmc.ncbi.nlm.nih.gov/articles/PMC3573577/).
6. Cheah KL et al. PLoS One, 2021. [Effect of ashwagandha (Withania somnifera) extract on sleep: a systematic review and meta-analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC8462692/).
7. Langade D et al. Cureus, 2019. [Efficacy and safety of ashwagandha root extract in insomnia and anxiety: a double-blind, randomized, placebo-controlled study](https://pmc.ncbi.nlm.nih.gov/articles/PMC6827862/).
8. Sharma AK et al. Journal of Alternative and Complementary Medicine, 2018. [Efficacy and safety of ashwagandha root extract in subclinical hypothyroid patients: a double-blind, randomized placebo-controlled trial](https://pubmed.ncbi.nlm.nih.gov/28829155/).
9. LiverTox (NIDDK, National Institutes of Health). [Ashwagandha](https://www.ncbi.nlm.nih.gov/books/NBK548536/).
10. Björnsson HK et al. Liver International, 2020. [Ashwagandha-induced liver injury: a case series from Iceland and the US Drug-Induced Liver Injury Network](https://pmc.ncbi.nlm.nih.gov/articles/PMC8041491/).
$jr$, 'Noovit', 'draft', $jr$Can You Take Magnesium and Ashwagandha Together? | Noovit$jr$, $jr$Magnesium and ashwagandha have no known interaction, but the only trial that combined them found no extra benefit. Timing, doses, and who should check first.$jr$)
on conflict (slug) do nothing;

insert into posts (slug, title, excerpt, body, author, status, seo_title, seo_description)
values ($jr$magnesium-glycinate-vs-citrate-vs-oxide$jr$, $jr$Magnesium glycinate vs citrate vs oxide: which form, for what?$jr$, $jr$The form changes how much magnesium you get per capsule, how well it's absorbed and whether it acts as a laxative. A plain comparison, with what the (thin) research actually shows.$jr$, $jr$**Short answer:** pick by goal. **Citrate** and **oxide** draw water into the bowel, so they suit people who want a laxative effect. **Glycinate** is the form most often chosen to get magnesium *without* that effect. Absorption differences between forms are real but smaller and less certain than marketing suggests: most studies are tiny and measure blood or urine levels, not how people feel [1][2].

## First: the number on the label

Supplements contain magnesium bound to another molecule (glycine, citric acid, oxygen). By law, the Supplement Facts panel must show the **elemental magnesium**, the magnesium itself, not the weight of the whole compound [1]. The share of magnesium varies a lot by form:

- **Oxide** is about 60% magnesium, so 414 mg of magnesium oxide gives about 250 mg of magnesium [3][4].
- **Bisglycinate** is only about 14% magnesium. In one trial, an 893 mg capsule provided 125 mg [5].
- **L-threonate** is about 7.5%, or 75 mg of magnesium per gram [6].

That's why a glycinate product needs more (or bigger) capsules for the same dose. Always compare products on the elemental number.

## The three main forms compared

| | Glycinate (bisglycinate) | Citrate | Oxide |
|---|---|---|---|
| Magnesium per gram of compound | Low (about 14%) [5] | — | High (about 60%) [3] |
| Dissolves | — | Well, even in water (55%) [7] | Barely [7] |
| Absorption in studies | Better than oxide in a 60-day trial; equal overall but double in poor absorbers in a small study [8][9] | Raised blood magnesium most in a 60-day trial [8] | About 4% absorbed in one study; no better than placebo in another [8][10] |
| Laxative effect | The form usually picked to avoid it (no large trial has tested this) | Yes, at higher doses [1] | Yes; used as a laxative [1][11] |
| Used in trials for | Sleep (250 mg) [5] | Migraine (600 mg, as dicitrate) [12] | Blood sugar, constipation, older-adult insomnia [4][11][13] |

**Glycinate.** Magnesium bound to two molecules of the amino acid glycine (also sold as bisglycinate or diglycinate) [9]. In a 12-person study of people who had part of their small intestine removed, it was absorbed about as well as oxide overall (23.5% vs 22.8%), but twice as well (23.5% vs 11.8%) in the four with the poorest absorption, and it was better tolerated [9]. In a 60-day trial of 46 healthy adults, an amino-acid chelate was absorbed better than oxide [8]. It was the form in a 2025 sleep trial, where 250 mg before bed produced a small improvement in insomnia scores [5].

**Citrate.** Dissolves well and was absorbed better than oxide in several small studies [7][8]. In the 60-day trial, it raised blood magnesium more than the chelate or oxide [8]. It has a laxative effect at higher doses [1].

**Oxide.** The most magnesium per gram, but it barely dissolves [3][10]. In the 60-day trial it did no better than placebo for blood levels [8]. Still, it's the form behind many blood-sugar trials [13] and the constipation trials, where poor absorption is the point: in a 28-day trial, 1.5 g a day improved constipation in 68% of people versus 12% on placebo [11]. That dose is far above the 350 mg upper limit and needs a doctor's guidance [1].

**How a tablet is made matters too.** Lab tests of 15 commercial magnesium products found very wide differences in how well they dissolved, even within the same form [3].

## What about other forms?

- **L-threonate (Magtein):** only about 7.5% magnesium, so 1–2 g gives about 75–150 mg. Small trials reported better scores on some sleep and memory measures; nobody has tested whether it beats cheaper forms [6][14].
- **Chloride:** dissolves well and was absorbed better than oxide in one comparison, but it's among the forms most often reported to cause diarrhea [1][10].
- **Malate:** we found no human study comparing its absorption with other forms.

A 2021 systematic review found only 14 studies comparing forms. Organic forms (like citrate) were generally absorbed better than inorganic ones (like oxide), absorption depended on the dose, and all forms could maintain normal levels in healthy people [2].

## How to choose

- **You want magnesium for sleep or general intake, without loose stools:** glycinate is the usual pick.
- **You want a laxative effect:** citrate or oxide, ideally with your doctor's advice on the dose.
- **You're comparing prices:** compare the cost per 100 mg of *elemental* magnesium, not per capsule.
- **Keep the total at or below 350 mg a day from supplements** (multivitamins, antacids and laxatives count; food doesn't), unless your doctor advises more [1].

## Safety notes

Diarrhea, nausea and cramps are the common side effects, mostly at high doses [1]. If you have **kidney disease**, don't take magnesium supplements unless your doctor prescribes them, because excess magnesium can build up [1]. Magnesium binds to some **antibiotics** (tetracyclines and quinolones) and **osteoporosis drugs** (bisphosphonates), so space the doses, and long-term **acid-reducing drugs** (PPIs) and some **diuretics** change magnesium levels [1]. More detail in our [magnesium guide](/guides/magnesium).

Our [Magnesium Sleep+](/products/magnesium-complex) uses magnesium glycinate: 275 mg of elemental magnesium in three capsules, taken after an evening meal.

## Sources

1. NIH Office of Dietary Supplements. [Magnesium: fact sheet for health professionals](https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/).
2. Pardo MR et al. Nutrition, 2021. [Bioavailability of magnesium food supplements: a systematic review](https://pubmed.ncbi.nlm.nih.gov/34111673/).
3. Blancquaert L et al. Nutrients, 2019. [Predicting and testing bioavailability of magnesium supplements](https://pmc.ncbi.nlm.nih.gov/articles/PMC6683096/).
4. Abbasi B et al. Journal of Research in Medical Sciences, 2012. [The effect of magnesium supplementation on primary insomnia in elderly: a double-blind placebo-controlled clinical trial](https://pmc.ncbi.nlm.nih.gov/articles/PMC3703169/).
5. Schuster J et al. Nature and Science of Sleep, 2025. [Magnesium bisglycinate supplementation in healthy adults reporting poor sleep: a randomized, placebo-controlled trial](https://pmc.ncbi.nlm.nih.gov/articles/PMC12412596/).
6. Hausenblas HA et al. Sleep Medicine: X, 2024. [Magnesium-L-threonate improves sleep quality and daytime functioning in adults with self-reported sleep problems: a randomized controlled trial](https://pmc.ncbi.nlm.nih.gov/articles/PMC11381753/).
7. Lindberg JS et al. Journal of the American College of Nutrition, 1990. [Magnesium bioavailability from magnesium citrate and magnesium oxide](https://pubmed.ncbi.nlm.nih.gov/2407766/).
8. Walker AF et al. Magnesium Research, 2003. [Mg citrate found more bioavailable than other Mg preparations in a randomised, double-blind study](https://pubmed.ncbi.nlm.nih.gov/14596323/).
9. Schuette SA et al. Journal of Parenteral and Enteral Nutrition, 1994. [Bioavailability of magnesium diglycinate vs magnesium oxide in patients with ileal resection](https://pubmed.ncbi.nlm.nih.gov/7815675/).
10. Firoz M, Graber M. Magnesium Research, 2001. [Bioavailability of US commercial magnesium preparations](https://pubmed.ncbi.nlm.nih.gov/11794633/).
11. Morishita D et al. American Journal of Gastroenterology, 2021. [Senna versus magnesium oxide for the treatment of chronic constipation: a randomized, placebo-controlled trial](https://pubmed.ncbi.nlm.nih.gov/32969946/).
12. Peikert A et al. Cephalalgia, 1996. [Prophylaxis of migraine with oral magnesium: results from a prospective, multi-center, placebo-controlled and double-blind randomized study](https://pubmed.ncbi.nlm.nih.gov/8792038/).
13. Veronese N et al. Nutrients, 2021. [Oral magnesium supplementation for treating glucose metabolism parameters in people with or at risk of diabetes: a systematic review and meta-analysis of double-blind randomized controlled trials](https://pmc.ncbi.nlm.nih.gov/articles/PMC8619199/).
14. Lopresti AL, Smith SJ. Frontiers in Nutrition, 2026. [The effects of magnesium L-threonate (Magtein) on cognitive performance and sleep quality in adults: a randomised, double-blind, placebo-controlled trial](https://pubmed.ncbi.nlm.nih.gov/41601871/).
$jr$, 'Noovit', 'draft', $jr$Magnesium Glycinate vs Citrate vs Oxide | Noovit$jr$, $jr$Glycinate, citrate or oxide? How much magnesium each gives, what absorption studies show, which ones loosen stools, and how to pick by goal.$jr$)
on conflict (slug) do nothing;
