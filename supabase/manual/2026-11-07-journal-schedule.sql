-- Journal posts generated from content/journal/*.md by scripts/journal-sql.ts (12 posts).

-- Posts with a date are SCHEDULED: they go live on their own at that time (within an hour). Others load as drafts.

-- Existing post text is never overwritten; an existing unscheduled draft only gets its schedule.

-- SEO title and description always follow content/journal (edit them there, not in Admin).

-- To hold a post: Admin → Blog → set it to Draft. The medical reviewer should read each post before its date.

-- Mon, 07 Dec 2026 14:00:00 GMT
insert into posts (slug, title, excerpt, body, author, status, published_at, seo_title, seo_description)
values ($jr$creatine-for-women$jr$, $jr$Creatine for women: what the research shows$jr$, $jr$Creatine works in women too, but women have been studied far less than men, and some results are weaker. What the trials found for strength, muscle, older women and the brain, plus the water-weight question.$jr$, $jr$**Short answer:** creatine appears to help women build strength and exercise performance, much as it does men, especially alongside resistance training [1][2]. But women are under-studied [1], and in a large analysis the extra lean muscle seen in women was small and not statistically significant [3]. It's one of the best-researched supplements there is, just with fewer studies in women than you'd hope.

## Why this question keeps coming up

Most of the classic creatine research was done in young men. A 2021 review of creatine in women's health put it plainly: despite extensive research on creatine, use in women is understudied [1]. A 2025 review by some of the same authors added that early studies often ignored the menstrual cycle, and that research is only now catching up [2].

Both reviews are optimistic about creatine for women. Worth knowing: several of their authors are scientific advisors to a company that makes creatine, which the papers disclose [1][2].

## What the trials found

### Strength and performance

The 2021 review concluded that creatine appears effective for improving strength and exercise performance in women before menopause [1]. Large analyses that pooled men and women found the strength benefit did not depend on sex. A meta-analysis of 53 trials found improved upper-body strength regardless of age or sex [4].

### Lean muscle: smaller in women

A 2022 meta-analysis of 35 randomized trials found that creatine plus resistance training added about 1.1 kg more lean mass than placebo overall. Split by sex, men gained 1.46 kg more than placebo, while women gained 0.29 kg more, a difference that wasn't statistically significant [3]. This may partly reflect how few women were studied, but it's an honest reason to expect smaller muscle-size changes.

### After menopause

Muscle and bone both decline with age. The 2021 review reported that women after menopause may see benefits in muscle size and function at higher doses (about 0.3 g per kg of body weight a day), and favorable effects on bone when creatine is combined with resistance training [1]. A meta-analysis of older adults (men and women, average age 57–70) found creatine plus resistance training added 1.37 kg more lean mass than training alone [5]. This research is still early, and most of the benefit came when creatine was paired with training.

### Memory and mood

In a study of 128 young women, 20 g a day for 5 days improved memory scores, but only in vegetarians, not in meat-eaters, likely because vegetarians get little creatine from food [6]. The 2025 review describes possible benefits for mood and cognition as promising but still emerging [2].

## The water-weight question

Many women worry about looking "puffy". Here's what's known:

- **Loading** (about 20 g a day for 5–7 days) usually adds 1–3 kg in the first week, mostly water held *inside* muscle, not under the skin [7][8].
- **In longer studies** at normal doses, several found no increase in total body water [8].
- **Easy fix:** skip loading. Taking 3–5 g a day fills muscle stores in about 3–4 weeks with less early water gain (see [do you need a creatine loading phase?](/blog/creatine-loading-phase)).
- Randomized trials have not found that creatine increases body fat [8].

## How women typically take it

- **Dose:** 3–5 g of creatine monohydrate a day, the same as men [7].
- **Form:** monohydrate, the form used in almost all research [7].
- **Timing:** any time of day, consistently. Taking it with a meal or a shake is fine.
- **With training:** the clearest benefits came when creatine was combined with resistance training [3][5].

## Who should check with a doctor first

- **Pregnant or breastfeeding:** reviews describe early research in pregnancy as promising, but it isn't established [2]. Don't take creatine while pregnant or breastfeeding unless your doctor advises it.
- **Kidney disease** or reduced kidney function, or conditions such as diabetes or high blood pressure that affect the kidneys [7].
- **Under 18:** we sell creatine for adults only.

Creatine can raise creatinine on blood tests without harming the kidneys, so tell your doctor you take it [8]. More in our [creatine guide](/guides/creatine).

Our [Creatine](/products/creatine) is pure creatine monohydrate: 5 g per scoop, unflavored, 50 servings.

## Sources

1. Smith-Ryan AE et al. Nutrients, 2021. [Creatine supplementation in women's health: a lifespan perspective](https://pmc.ncbi.nlm.nih.gov/articles/PMC7998865/).
2. Smith-Ryan AE et al. Journal of the International Society of Sports Nutrition, 2025. [Creatine in women's health: bridging the gap from menstruation through pregnancy to menopause](https://pmc.ncbi.nlm.nih.gov/articles/PMC12086928/).
3. Delpino FM et al. Nutrition, 2022. [Influence of age, sex, and type of exercise on the efficacy of creatine supplementation on lean body mass: a systematic review and meta-analysis of randomized clinical trials](https://pubmed.ncbi.nlm.nih.gov/35986981/).
4. Lanhers C et al. Sports Medicine, 2017. [Creatine supplementation and upper limb strength performance: a systematic review and meta-analysis](https://pubmed.ncbi.nlm.nih.gov/27328852/).
5. Chilibeck PD et al. Open Access Journal of Sports Medicine, 2017. [Effect of creatine supplementation during resistance training on lean tissue mass and muscular strength in older adults: a meta-analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC5679696/).
6. Benton D, Donohoe R. British Journal of Nutrition, 2011. [The influence of creatine supplementation on the cognitive functioning of vegetarians and omnivores](https://pubmed.ncbi.nlm.nih.gov/21118604/).
7. Kreider RB et al. Journal of the International Society of Sports Nutrition, 2017. [International Society of Sports Nutrition position stand: safety and efficacy of creatine supplementation in exercise, sport, and medicine](https://pmc.ncbi.nlm.nih.gov/articles/PMC5469049/).
8. Antonio J et al. Journal of the International Society of Sports Nutrition, 2021. [Common questions and misconceptions about creatine supplementation: what does the scientific evidence really show?](https://pmc.ncbi.nlm.nih.gov/articles/PMC7871530/)
$jr$, 'Noovit', 'published', '2026-12-07T14:00:00.000Z', $jr$Creatine for Women: What the Research Shows | Noovit$jr$, $jr$Does creatine work for women? What trials show for strength, lean muscle, menopause and memory, and how to avoid water-weight gain.$jr$)
on conflict (slug) do update set
  status = case when posts.status = 'draft' and posts.published_at is null and excluded.published_at is not null then excluded.status else posts.status end,
  published_at = case when posts.status = 'draft' and posts.published_at is null and excluded.published_at is not null then excluded.published_at else posts.published_at end,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description;

-- Thu, 19 Nov 2026 14:00:00 GMT
insert into posts (slug, title, excerpt, body, author, status, published_at, seo_title, seo_description)
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
$jr$, 'Noovit', 'published', '2026-11-19T14:00:00.000Z', $jr$Do You Need a Creatine Loading Phase? | Noovit$jr$, $jr$A creatine loading phase fills muscle stores in about a week; 3 g a day reaches the same level in about 4 weeks. Doses, trade-offs and how to do either.$jr$)
on conflict (slug) do update set
  status = case when posts.status = 'draft' and posts.published_at is null and excluded.published_at is not null then excluded.status else posts.status end,
  published_at = case when posts.status = 'draft' and posts.published_at is null and excluded.published_at is not null then excluded.published_at else posts.published_at end,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description;

-- Wed, 25 Nov 2026 14:00:00 GMT
insert into posts (slug, title, excerpt, body, author, status, published_at, seo_title, seo_description)
values ($jr$does-creatine-cause-hair-loss$jr$, $jr$Does creatine cause hair loss? The one study behind the claim$jr$, $jr$The worry traces back to a single 2009 study that measured a hormone, not hair. In 2025, the first trial to measure hair itself found no difference. Here's what both found.$jr$, $jr$**Short answer:** there's no good evidence that it does. The idea comes from one small 2009 study that found a rise in a hormone linked to male-pattern baldness, but it never looked at hair [1]. That result has never been repeated [2]. In 2025, the first trial to actually measure hair found no difference between creatine and placebo after 12 weeks [3].

## Where the claim came from

In 2009, researchers in South Africa gave 20 college rugby players three weeks of creatine and, in a separate period, three weeks of placebo (a crossover design) [1]:

- **The dose:** a high loading dose of 25 g a day for 7 days, then 5 g a day for 14 days.
- **The finding:** DHT (dihydrotestosterone), a hormone made from testosterone, rose by 56% during loading and stayed about 40% higher during the lower-dose phase. Testosterone itself didn't change [1].
- **What it didn't measure:** hair. Nobody counted, photographed or examined anyone's hair [1].

DHT matters because it plays a role in male-pattern baldness in people who are genetically prone to it. That's why the study spread online as "creatine causes hair loss". But a rise in a blood hormone in 20 people over three weeks isn't the same as hair loss, and no other study has repeated the DHT result [2].

## The trial that measured hair

In 2025, researchers ran the first randomized trial designed to answer the question directly [3]:

- **Who:** 45 resistance-trained men aged 18–40; 38 completed the study.
- **What:** 5 g of creatine monohydrate a day, or 5 g of a placebo powder, for 12 weeks.
- **What they measured:** testosterone, free testosterone and DHT in blood, plus **hair density, follicle counts and hair thickness**, using a hair-pull test (trichogram) and a dermatology imaging system.

**Result:** no difference between the groups in DHT, the DHT-to-testosterone ratio, or any hair measure [3]. The authors concluded their findings provide strong evidence against the idea that creatine contributes to hair loss.

## What this means for you

- **At the usual 3–5 g a day,** the only trial that looked at hair found nothing to worry about [3].
- **The original worry came from a high loading dose** (25 g a day) [1]. If you're concerned, you can skip loading altogether: 3–5 g a day fills your muscles in about 3–4 weeks anyway (see [do you need a creatine loading phase?](/blog/creatine-loading-phase)).
- **The evidence is still limited.** One 12-week trial in young men is reassuring, not the final word. It didn't include women or people already losing their hair.
- **If your hair is thinning,** see a doctor or dermatologist. Hair loss has many causes, and a doctor can help work out which applies to you.

## Other common creatine questions

- **Kidneys:** in healthy people, studied doses haven't been shown to harm kidney function. Creatine can raise creatinine on blood tests, so tell your doctor you take it [2][4].
- **Weight gain:** the main known side effect, mostly water held inside muscle, especially during loading [2].

More in our [creatine guide](/guides/creatine).

Our [Creatine](/products/creatine) is pure creatine monohydrate, 5 g per scoop, for adults 18 and over.

## Sources

1. van der Merwe J et al. Clinical Journal of Sport Medicine, 2009. [Three weeks of creatine monohydrate supplementation affects dihydrotestosterone to testosterone ratio in college-aged rugby players](https://pubmed.ncbi.nlm.nih.gov/19741313/).
2. Antonio J et al. Journal of the International Society of Sports Nutrition, 2021. [Common questions and misconceptions about creatine supplementation: what does the scientific evidence really show?](https://pmc.ncbi.nlm.nih.gov/articles/PMC7871530/)
3. Lak M et al. Journal of the International Society of Sports Nutrition, 2025. [Does creatine cause hair loss? A 12-week randomized controlled trial](https://pubmed.ncbi.nlm.nih.gov/40265319/).
4. de Souza e Silva A et al. Journal of Renal Nutrition, 2019. [Effects of creatine supplementation on renal function: a systematic review and meta-analysis](https://pubmed.ncbi.nlm.nih.gov/31375416/).
$jr$, 'Noovit', 'published', '2026-11-25T14:00:00.000Z', $jr$Does Creatine Cause Hair Loss? The Evidence | Noovit$jr$, $jr$The creatine hair-loss worry comes from one 2009 study that never measured hair. A 2025 trial that did found no change in hair or DHT. The details.$jr$)
on conflict (slug) do update set
  status = case when posts.status = 'draft' and posts.published_at is null and excluded.published_at is not null then excluded.status else posts.status end,
  published_at = case when posts.status = 'draft' and posts.published_at is null and excluded.published_at is not null then excluded.published_at else posts.published_at end,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description;

-- Thu, 03 Dec 2026 14:00:00 GMT
insert into posts (slug, title, excerpt, body, author, status, published_at, seo_title, seo_description)
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
$jr$, 'Noovit', 'published', '2026-12-03T14:00:00.000Z', $jr$How Long Does Ashwagandha Take to Work? | Noovit$jr$, $jr$In trials, ashwagandha's effects on stress and sleep showed up after 8–10 weeks, not days. What each study measured, and how long it's safe to take.$jr$)
on conflict (slug) do update set
  status = case when posts.status = 'draft' and posts.published_at is null and excluded.published_at is not null then excluded.status else posts.status end,
  published_at = case when posts.status = 'draft' and posts.published_at is null and excluded.published_at is not null then excluded.published_at else posts.published_at end,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description;

-- Mon, 21 Dec 2026 14:00:00 GMT
insert into posts (slug, title, excerpt, body, author, status, published_at, seo_title, seo_description)
values ($jr$how-to-read-a-supplement-facts-label$jr$, $jr$How to read a Supplement Facts label$jr$, $jr$Serving size, "as" in brackets, % Daily Value, proprietary blends, plant parts and the asterisk disclaimer. A line-by-line guide to what US law requires on the panel, and what to check before you buy.$jr$, $jr$**Short answer:** start with the **serving size**, then read each ingredient's **amount per serving**, check whether it's the ingredient itself or a compound ("as" in brackets), look for **proprietary blends** that hide individual amounts, and note the **plant part** for herbs. The rules come from the FDA's labeling regulation for dietary supplements [1].

## A real example

Here's the panel from our own Magnesium Sleep+, simplified:

| Supplement Facts | |
|---|---|
| Serving Size: 3 Capsules | Servings Per Container: 30 |
| **Amount Per Serving** | **% Daily Value** |
| Magnesium (as Magnesium Glycinate) 275 mg | 65% |

Every line tells you something. Let's go through them.

## 1. Serving size

The **Serving Size** comes first, in a unit that fits the product: capsules, scoops, gummies [1]. Every amount below it is **per serving, not per capsule**. A product listing 275 mg in a 3-capsule serving gives about 92 mg per capsule. Always check how many units make a serving before comparing products.

**Servings Per Container** sits underneath, and tells you how long the bottle lasts [1].

## 2. "As" in brackets: the ingredient vs the compound

Amounts must show **the dietary ingredient itself**, not the compound it comes in. The source can be named in brackets with "as" or "from", such as "Calcium (as calcium carbonate)" [1].

This matters most for minerals. Magnesium is bound to another molecule, and the share of magnesium varies widely: magnesium oxide is about 60% magnesium, bisglycinate only about 14% [3][5]. So "275 mg magnesium (as glycinate)" means 275 mg of actual magnesium, which takes roughly 2 g of the glycinate compound. If a label lists a large number for a compound without the elemental amount, you can't tell how much mineral you're getting. More in [magnesium glycinate vs citrate vs oxide](/blog/magnesium-glycinate-vs-citrate-vs-oxide) and our [magnesium guide](/guides/magnesium).

## 3. % Daily Value

**% Daily Value (%DV)** compares the amount to a reference intake set by the FDA, rounded to the nearest whole percent [1]. For magnesium, the Daily Value is 420 mg, so 275 mg is 65% [2].

Ingredients with no Daily Value, such as herbs, mushrooms, creatine or CoQ10, get a symbol (often an asterisk or dagger) instead, with a footnote saying **"Daily Value not established"** [1]. That doesn't mean the dose is too high or too low, just that no official reference exists.

## 4. Proprietary blends

A **"Proprietary Blend"** (or a branded name like "Focus Matrix") lists its ingredients in **descending order by weight** and the **total weight of the blend**, but not how much of each ingredient it contains [1].

So a 500 mg blend of eight ingredients could contain 490 mg of the first and tiny amounts of the rest. If you want to match a product to the doses used in research, blends make that impossible. Prefer labels that list every ingredient with its own amount.

## 5. Plant part and extracts

For herbs and mushrooms, the label must say **which part** was used: root, leaf, fruiting body and so on [1]. This matters: ashwagandha root and leaf extracts were studied at different doses (see [KSM-66 vs Sensoril](/blog/ksm-66-vs-sensoril)), and lion's mane fruiting body and mycelium contain different compounds.

For a dried extract, the amount shown must be **the weight of the extract itself** [1]. Watch for marketing like "4,000 mg equivalent" next to a 500 mg 8:1 extract: the capsule still holds 500 mg.

## 6. Other ingredients

Ingredients that aren't listed in the panel, such as the capsule shell, fillers and flow agents, appear in an ingredient statement just below it, usually headed "Other ingredients" [1]. This is also where you'll typically find allergen information, such as "contains shellfish".

## 7. The asterisk and the FDA disclaimer

Supplements can make **structure/function claims**, such as "supports restful sleep". When they do, the claim must be linked, usually by an asterisk, to this exact disclaimer [4]:

> *This statement has not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.*

A supplement label that claims to treat or cure a disease is breaking the rules. Treat that as a red flag.

## A 30-second checklist

1. **Serving size:** how many capsules or scoops make the amounts shown?
2. **Each amount:** is it the ingredient itself (with "as ..." in brackets)?
3. **Dose:** does it match what studies used? Our ingredient [guides](/guides) list studied doses.
4. **Blends:** are any amounts hidden in a proprietary blend?
5. **Plant part:** is it named for herbs and mushrooms?
6. **Other ingredients and allergens:** anything you need to avoid?
7. **Claims:** only "supports" language, with the FDA disclaimer?

## Why we print the dose on the front

Every Noovit bottle shows the main dose per serving on the front, not just in the panel on the back, so you can see what you're getting at a glance. You can see each full panel on our [shop](/shop) pages.

## Sources

1. US Code of Federal Regulations, 21 CFR 101.36. [Nutrition labeling of dietary supplements](https://www.law.cornell.edu/cfr/text/21/101.36).
2. NIH Office of Dietary Supplements. [Magnesium: fact sheet for health professionals](https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/).
3. Schuster J et al. Nature and Science of Sleep, 2025. [Magnesium bisglycinate supplementation in healthy adults reporting poor sleep: a randomized, placebo-controlled trial](https://pmc.ncbi.nlm.nih.gov/articles/PMC12412596/).
4. US Code of Federal Regulations, 21 CFR 101.93. [Certain types of statements for dietary supplements](https://www.law.cornell.edu/cfr/text/21/101.93).
5. Blancquaert L et al. Nutrients, 2019. [Predicting and testing bioavailability of magnesium supplements](https://pmc.ncbi.nlm.nih.gov/articles/PMC6683096/).
$jr$, 'Noovit', 'published', '2026-12-21T14:00:00.000Z', $jr$How to Read a Supplement Facts Label (Line by Line) | Noovit$jr$, $jr$What every line of a Supplement Facts panel means: serving size, elemental amounts, % Daily Value, proprietary blends, plant parts and the FDA disclaimer.$jr$)
on conflict (slug) do update set
  status = case when posts.status = 'draft' and posts.published_at is null and excluded.published_at is not null then excluded.status else posts.status end,
  published_at = case when posts.status = 'draft' and posts.published_at is null and excluded.published_at is not null then excluded.published_at else posts.published_at end,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description;

-- Mon, 14 Dec 2026 14:00:00 GMT
insert into posts (slug, title, excerpt, body, author, status, published_at, seo_title, seo_description)
values ($jr$ksm-66-vs-sensoril$jr$, $jr$KSM-66 vs Sensoril: what's the difference?$jr$, $jr$Both are branded ashwagandha extracts with human trials behind them. One uses the root only, the other root and leaf, at very different doses. No trial has compared them head to head. Here's how they differ.$jr$, $jr$**Short answer:** KSM-66 and Sensoril are the two most-studied branded ashwagandha extracts. **KSM-66** is made from the **root only** and was usually studied at **600 mg a day**. **Sensoril** is made from **root and leaf** and was studied at lower doses, **125–500 mg a day**. Both have positive trials for stress, but **no trial has compared them directly**, so neither has been shown to be better [1][2][3].

## Side by side

| | KSM-66 | Sensoril |
|---|---|---|
| Plant part | Root only | Root and leaf |
| Made with | A water-based process | Water extraction |
| Standardized to | At least 5% withanolides | At least 10% withanolide glycosides |
| Typical dose in trials | 600 mg a day (often 300 mg twice a day) [1][4] | 125–500 mg a day [2][5] |
| Main trials | Stress and cortisol, sleep, strength [1][4][6] | Stress, strength, reaction time [2][5][7] |

Source for the extract descriptions: our [ashwagandha guide](/guides/ashwagandha), which lists every study.

## What the trials found

### KSM-66

- **Stress:** in a 60-day trial of 64 adults with chronic stress, 600 mg a day lowered perceived stress scores by 44% (versus 5.5% with placebo) and blood cortisol by 27.9% (versus 7.9%) [1].
- **Sleep:** in a 10-week trial of adults with insomnia, 300 mg twice a day cut the time to fall asleep from about 42 to 29 minutes, versus 42 to 34 minutes on placebo [4].
- **Strength:** in an 8-week trial of 57 young men starting weight training, 600 mg a day increased bench-press strength by 46.0 kg versus 26.4 kg on placebo [6].

### Sensoril

- **Stress:** in an 8-week trial of chronically stressed adults, 125–500 mg a day of the root-and-leaf extract improved stress measures compared with placebo [2].
- **Strength:** in a 12-week trial of 38 recreationally active men, 500 mg a day increased squat strength by 19.1 kg versus 10.0 kg, and bench press by 12.8 kg versus 8.0 kg [5].
- **Reaction time:** in a 14-day crossover study of 20 healthy men, 1,000 mg a day improved reaction times on several computer tests [7].

Most trials of both extracts were small, short and run in India, often with extract supplied by the manufacturer [1][8].

## Why the percentages can't be compared

KSM-66 says "5% withanolides"; Sensoril says "10% withanolide glycosides". It's tempting to think Sensoril is twice as strong. It isn't that simple:

- **They measure different groups of compounds**, with different lab methods.
- A 2024 analysis of the root-and-leaf extract measured each of its 10 main compounds at just 0.4–1% [2].
- The doses studied already account for each extract's makeup. That's why Sensoril trials used less.

So compare each extract at **the dose used in its own trials**, not by the percentage on the front.

## Root vs leaf: the safety angle

Root is the part traditionally used in Ayurveda. Safety data on leaf preparations are more limited [9]. Some European regulators have been cautious about ashwagandha in general; critics note their reviews didn't consistently separate root products from leaf products [9][10]. For most healthy adults, either extract at its studied dose has been well tolerated in short trials [1][2], but the safety cautions below apply to both.

## How to choose

1. **Pick a named extract**, so you can match it to the research.
2. **Check the dose matches that extract's trials:** about 600 mg a day for KSM-66, 125–500 mg for Sensoril.
3. **Check the plant part** on the label (root, or root and leaf).
4. **Give it time:** most trials measured results after 8 weeks or more. See [how long does ashwagandha take to work?](/blog/how-long-does-ashwagandha-take-to-work)

## Safety for both

Ashwagandha may be safe for up to 3 months; long-term safety isn't known. Avoid it if you're pregnant or breastfeeding. Talk to your doctor first if you have a thyroid condition or take thyroid medication, take sedatives, anti-seizure, diabetes, blood-pressure or immune-suppressing medicines, or have liver disease or an autoimmune condition. Rare but serious liver injury has been reported [11][12].

Our [Ashwagandha Calm+](/products/ashwagandha) uses KSM-66: 600 mg of root extract in two capsules a day. It also contains vitamins D3, B6 and B12, L-arginine, maca, Panax ginseng and shatavari, which weren't part of the KSM-66 trials, so read the full label.

## Sources

1. Chandrasekhar K et al. Indian Journal of Psychological Medicine, 2012. [A prospective, randomized double-blind, placebo-controlled study of safety and efficacy of a high-concentration full-spectrum extract of ashwagandha root in reducing stress and anxiety in adults](https://pmc.ncbi.nlm.nih.gov/articles/PMC3573577/).
2. Pandit S et al. Nutrients, 2024. [Effects of Withania somnifera extract in chronically stressed adults: a randomized controlled trial](https://pmc.ncbi.nlm.nih.gov/articles/PMC11085552/).
3. National Center for Complementary and Integrative Health (NCCIH). [Ashwagandha: usefulness and safety](https://www.nccih.nih.gov/health/ashwagandha).
4. Langade D et al. Cureus, 2019. [Efficacy and safety of ashwagandha (Withania somnifera) root extract in insomnia and anxiety: a double-blind, randomized, placebo-controlled study](https://pmc.ncbi.nlm.nih.gov/articles/PMC6827862/).
5. Ziegenfuss TN et al. Nutrients, 2018. [Effects of an aqueous extract of Withania somnifera on strength training adaptations and recovery: the STAR trial](https://pmc.ncbi.nlm.nih.gov/articles/PMC6266766/).
6. Wankhede S et al. Journal of the International Society of Sports Nutrition, 2015. [Examining the effect of Withania somnifera supplementation on muscle strength and recovery: a randomized controlled trial](https://pmc.ncbi.nlm.nih.gov/articles/PMC4658772/).
7. Pingali U et al. Pharmacognosy Research, 2014. [Effect of standardized aqueous extract of Withania somnifera on tests of cognitive and psychomotor performance in healthy human participants](https://pmc.ncbi.nlm.nih.gov/articles/PMC3897003/).
8. Salve J et al. Cureus, 2019. [Adaptogenic and anxiolytic effects of ashwagandha root extract in healthy adults: a double-blind, randomized, placebo-controlled clinical study](https://pmc.ncbi.nlm.nih.gov/articles/PMC6979308/).
9. Dutta A et al. Food Science & Nutrition, 2026. [Plant part-specific differences in ashwagandha (Withania somnifera): a comparative evaluation of root and leaf evidence for safety and regulation](https://pmc.ncbi.nlm.nih.gov/articles/PMC13635981/).
10. BfR (German Federal Institute for Risk Assessment), 2024. [Ashwagandha: food supplements with potential health risks](https://www.bfr.bund.de/cm/349/ashwagandha-food-supplements-with-potential-health-risks.pdf).
11. LiverTox (NIDDK, National Institutes of Health). [Ashwagandha](https://www.ncbi.nlm.nih.gov/books/NBK548536/).
12. Sharma AK et al. Journal of Alternative and Complementary Medicine, 2018. [Efficacy and safety of ashwagandha root extract in subclinical hypothyroid patients: a double-blind, randomized placebo-controlled trial](https://pubmed.ncbi.nlm.nih.gov/28829155/).
$jr$, 'Noovit', 'published', '2026-12-14T14:00:00.000Z', $jr$KSM-66 vs Sensoril: Ashwagandha Extracts Compared | Noovit$jr$, $jr$KSM-66 is a root-only ashwagandha extract studied at 600 mg; Sensoril uses root and leaf at 125–500 mg. How they differ, what trials found, and how to choose.$jr$)
on conflict (slug) do update set
  status = case when posts.status = 'draft' and posts.published_at is null and excluded.published_at is not null then excluded.status else posts.status end,
  published_at = case when posts.status = 'draft' and posts.published_at is null and excluded.published_at is not null then excluded.published_at else posts.published_at end,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description;

-- Thu, 10 Dec 2026 14:00:00 GMT
insert into posts (slug, title, excerpt, body, author, status, published_at, seo_title, seo_description)
values ($jr$lions-mane-fruiting-body-vs-mycelium$jr$, $jr$Lion's mane: fruiting body vs mycelium, and how to read the label$jr$, $jr$Fruiting body, mycelium, extract ratios, "mg equivalent", polysaccharides vs beta-glucans. What each term means, what the studies used, and what to check before you buy.$jr$, $jr$**Short answer:** most of the memory and mood trials used the **fruiting body**, the part of the mushroom you see and cook [1][2]. The **mycelium**, the root-like threads, is richer in a different group of compounds, and one small trial used a specially grown mycelium [3]. Either way, the label matters more than the marketing: look for the part used, the real amount per serving, and ideally a beta-glucan figure.

## The two parts, and what's in them

Lion's mane (*Hericium erinaceus*) has two main parts:

- **Fruiting body:** the shaggy white mushroom itself. It contains mainly **hericenones** [2][4].
- **Mycelium:** the network of threads that grows through wood or a growing medium. It contains mainly **erinacines** [2][4].

Lab studies suggest both groups of compounds can raise nerve growth factor in cells, but it isn't known whether they reach the human brain in useful amounts [1][2]. Erinacine levels also vary enormously: one 2024 analysis of 17 strains found erinacine A ranging from 0.23 to 42.16 mg per gram of mycelium [5]. Most labels state neither erinacines nor hericenones.

## What the studies used

| Study | Form | Daily amount | What it found |
|---|---|---|---|
| 30 adults aged 50–80 with mild cognitive impairment, 16 weeks [1] | Dried fruiting body | 3 g | Higher scores than placebo on a cognitive scale from week 8; faded within 4 weeks of stopping |
| 31 healthy adults over 50, 12 weeks [2] | Dried fruiting body | 3.2 g | Small gain on one cognitive test; two others unchanged |
| 30 women, 4 weeks [4] | Fruiting body in cookies | 2 g | Depression scores fell, but not significantly more than placebo |
| 49 people with mild Alzheimer's disease, 49 weeks [3] | Liquid-grown mycelium enriched with erinacine A | About 1,050 mg | Only a daily-living skills score differed significantly from placebo |

Most trials were small, and results in healthy young adults were mostly negative or mixed [12]. Our [lion's mane guide](/guides/lions-mane) grades the memory evidence as **Limited**.

## Mycelium on grain vs liquid-grown

Most mycelium sold in the US is grown on sterilized grain such as oats or rice. The mycelium can't be fully separated from the grain, so the whole mass is dried and milled, and part of what you get is leftover grain. That's different from **liquid-grown** mycelium, like the erinacine-enriched material in the Alzheimer's trial [3].

## How to read a lion's mane label

**1. The part used.** US rules require botanical labels to say which part of the plant or fungus is used [6]. Look for "fruiting body", "mycelium", or both.

**2. The real amount per serving.** Under US rules, the amount listed for an extract must be the weight of the extract itself [6].

**3. Extract ratios and "mg equivalent".** An 8:1 ratio means about 8 g of dried mushroom went into 1 g of extract. Some labels multiply this out, so 500 mg of an 8:1 extract becomes "4,000 mg equivalent". The capsule still holds 500 mg, and the ratio says nothing about how much of the active compounds survived [6].

**4. Beta-glucans, not just "polysaccharides".** Beta-glucans are fiber-like sugars in the mushroom's cell wall and the usual quality marker. Starch from grain is also a polysaccharide, so a "polysaccharides %" figure can include grain starch. The McCleary method (the Megazyme kit) measures starch separately and subtracts it, leaving only beta-glucan [7]. In a US test of 19 reishi mushroom supplements, 13 contained starch-like polysaccharides and only 5 matched their labels; the authors noted that starch should be excluded when measuring polysaccharides [8].

**5. A certificate of analysis.** A good brand will share test results on request.

**6. Doses aren't interchangeable.** A gram of concentrated extract, a gram of whole fruiting body and a gram of mycelium on grain are different things. Compare like with like.

## Safety

Trials of up to 49 weeks found it generally well tolerated, with mostly mild stomach upset [1][3]. Rare serious allergic reactions have been reported, so avoid it if you're allergic to mushrooms [9][10]. In lab tests, a compound from lion's mane reduced platelet clumping, so ask your doctor first if you take blood thinners or antiplatelet drugs, or have surgery coming up [11]. There isn't enough safety information for pregnancy or breastfeeding.

## Our lion's mane

Our [Lion's Mane](/products/lions-mane) contains 1,000 mg of organic lion's mane per serving, from both fruiting body and mycelium, and the label states both parts.

## Sources

1. Mori K et al. Phytotherapy Research, 2009. [Improving effects of the mushroom Yamabushitake (Hericium erinaceus) on mild cognitive impairment: a double-blind placebo-controlled clinical trial](https://pubmed.ncbi.nlm.nih.gov/18844328/).
2. Saitsu Y et al. Biomedical Research, 2019. [Improvement of cognitive functions by oral intake of Hericium erinaceus](https://www.jstage.jst.go.jp/article/biomedres/40/4/40_125/_article).
3. Li IC et al. Frontiers in Aging Neuroscience, 2020. [Prevention of early Alzheimer's disease by erinacine A-enriched Hericium erinaceus mycelia pilot double-blind placebo-controlled study](https://pmc.ncbi.nlm.nih.gov/articles/PMC7283924/).
4. Nagano M et al. Biomedical Research, 2010. [Reduction of depression and anxiety by 4 weeks Hericium erinaceus intake](https://www.jstage.jst.go.jp/article/biomedres/31/4/31_4_231/_article).
5. Liu M et al. Foods, 2024. [Isolation and evaluation of erinacine A contents in mycelia of Hericium erinaceus strains](https://pmc.ncbi.nlm.nih.gov/articles/PMC11172171/).
6. US Code of Federal Regulations, 21 CFR 101.36. [Nutrition labeling of dietary supplements](https://www.law.cornell.edu/cfr/text/21/101.36).
7. McCleary BV, Draga A. Journal of AOAC International, 2016. [Measurement of β-glucan in mushrooms and mycelial products](https://pubmed.ncbi.nlm.nih.gov/26957216/).
8. Wu DT et al. Scientific Reports, 2017. [Evaluation on quality consistency of Ganoderma lucidum dietary supplements collected in the United States](https://pmc.ncbi.nlm.nih.gov/articles/PMC5552695/).
9. LiverTox (NIDDK, National Institutes of Health). [Lion's Mane](https://www.ncbi.nlm.nih.gov/books/NBK599740/).
10. Nakatsugawa M et al. Internal Medicine, 2003. [Hericium erinaceum (yamabushitake) extract-induced acute respiratory distress syndrome monitored by serum surfactant proteins](https://pubmed.ncbi.nlm.nih.gov/14714963/).
11. Mori K et al. Phytomedicine, 2010. [Inhibitory effect of hericenone B from Hericium erinaceus on collagen-induced platelet aggregation](https://pubmed.ncbi.nlm.nih.gov/20637576/).
12. Docherty S et al. Nutrients, 2023. [The acute and chronic effects of lion's mane mushroom supplementation on cognitive function, stress and mood in young adults: a double-blind, parallel groups, pilot study](https://pmc.ncbi.nlm.nih.gov/articles/PMC10675414/).
$jr$, 'Noovit', 'published', '2026-12-10T14:00:00.000Z', $jr$Lion's Mane: Fruiting Body vs Mycelium | Noovit$jr$, $jr$Fruiting body or mycelium? What each part contains, what the lion's mane studies used, and how to read extract ratios, "mg equivalent" and beta-glucan figures.$jr$)
on conflict (slug) do update set
  status = case when posts.status = 'draft' and posts.published_at is null and excluded.published_at is not null then excluded.status else posts.status end,
  published_at = case when posts.status = 'draft' and posts.published_at is null and excluded.published_at is not null then excluded.published_at else posts.published_at end,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description;

-- Mon, 30 Nov 2026 14:00:00 GMT
insert into posts (slug, title, excerpt, body, author, status, published_at, seo_title, seo_description)
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
$jr$, 'Noovit', 'published', '2026-11-30T14:00:00.000Z', $jr$Can You Take Magnesium and Ashwagandha Together? | Noovit$jr$, $jr$Magnesium and ashwagandha have no known interaction, but the only trial that combined them found no extra benefit. Timing, doses, and who should check first.$jr$)
on conflict (slug) do update set
  status = case when posts.status = 'draft' and posts.published_at is null and excluded.published_at is not null then excluded.status else posts.status end,
  published_at = case when posts.status = 'draft' and posts.published_at is null and excluded.published_at is not null then excluded.published_at else posts.published_at end,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description;

-- Mon, 16 Nov 2026 14:00:00 GMT
insert into posts (slug, title, excerpt, body, author, status, published_at, seo_title, seo_description)
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
$jr$, 'Noovit', 'published', '2026-11-16T14:00:00.000Z', $jr$Magnesium Glycinate vs Citrate vs Oxide | Noovit$jr$, $jr$Glycinate, citrate or oxide? How much magnesium each gives, what absorption studies show, which ones loosen stools, and how to pick by goal.$jr$)
on conflict (slug) do update set
  status = case when posts.status = 'draft' and posts.published_at is null and excluded.published_at is not null then excluded.status else posts.status end,
  published_at = case when posts.status = 'draft' and posts.published_at is null and excluded.published_at is not null then excluded.published_at else posts.published_at end,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description;

-- Thu, 17 Dec 2026 14:00:00 GMT
insert into posts (slug, title, excerpt, body, author, status, published_at, seo_title, seo_description)
values ($jr$turmeric-vs-curcumin$jr$, $jr$Turmeric vs curcumin: what's on the label and why it matters$jr$, $jr$Turmeric is the spice; curcumin is its main active compound, and it makes up only about 3% of the powder. How to read "turmeric", "curcuminoids" and "95% extract" on a label, and what black pepper adds.$jr$, $jr$**Short answer:** **turmeric** is the yellow spice root; **curcumin** is its best-known active compound. Plain turmeric powder is only about **3% curcumin** by weight, so a gram of spice gives roughly 30 mg [1]. Most supplements use an extract **standardized to 95% curcuminoids**, and studies mostly used about **1,000 mg a day** of extract or curcuminoids [2][3]. When you compare products, look for the **mg of curcuminoids**, not just "mg of turmeric".

## Turmeric, curcumin, curcuminoids

- **Turmeric** (*Curcuma longa*) is a plant in the ginger family. Its underground stem is dried and ground into the spice used in curries [4].
- **Curcumin** is the compound that gives turmeric its yellow color [4].
- **Curcuminoids** are a group of three related compounds: curcumin, demethoxycurcumin and bisdemethoxycurcumin. A "95% curcuminoids" extract contains all three [5].

## The numbers that matter on a label

| On the label | What it gives you |
|---|---|
| 1,000 mg turmeric root powder | About 30 mg of curcumin (about 3%) [1] |
| 500 mg turmeric extract, 95% curcuminoids | About 475 mg of curcuminoids, roughly the amount in 15 g of turmeric powder |
| Curry powder | Usually much less curcumin than turmeric itself [1] |

So "1,000 mg turmeric" and "1,000 mg turmeric extract (95%)" are very different products. The second contains about 30 times more curcuminoids.

## Why black pepper is added

Curcumin on its own is **poorly absorbed**: it dissolves badly in water and is broken down quickly in the gut and liver, so very little reaches the blood [5]. Italian regulators put its oral bioavailability at about 1% [6].

**Piperine**, the compound that makes black pepper hot, is the most common add-on. In a small 1998 study, 20 mg of piperine taken with 2 g of curcumin raised blood curcumin levels by about **2,000% (20 times)** [7]. That single study is still the main human evidence behind the "20 times" claim.

Other "enhanced" forms use phospholipids (phytosomes), micelles or other carriers, and raised blood levels many times over in small studies [5][8]. But higher blood levels haven't been shown to mean better results: in a 2025 analysis, enhanced forms did not lower knee pain more than standard curcuminoids [9].

## What studies used, and found

- **Knee osteoarthritis:** a meta-analysis of 8 trials found that about 1,000 mg a day of turmeric extract or curcumin lowered pain scores by about 2 points on a visual pain scale compared with placebo, over 4–12 weeks. Trials were small and varied in quality [2].
- **Muscle soreness after exercise:** a meta-analysis of 10 trials found small drops in soreness and a muscle-damage marker [10].
- **Doses:** about 1,000 mg a day of curcuminoids or extract (range 1,000–1,500 mg), often split into 2–4 doses. Enhanced-absorption forms used less, for example 180–500 mg [2][3].

Doses are specific to the form: a dose studied for a phytosome product doesn't apply to a plain 95% extract.

## The safety caveat

Turmeric as a spice in food is not the concern. Supplements are different:

- **Liver injury is rare but can be serious.** LiverTox estimates roughly 1 in 10,000 to 1 in 100,000 people exposed. Most people recover after stopping, but some cases led to liver failure [11].
- **The risk appears higher with high doses and enhanced-absorption products, including those with piperine** [6][12]. In Italy's 2019 cases, two-thirds of people had taken high-strength curcumin with piperine [6].
- **Stop and see a doctor** if you notice yellowing of the skin or eyes, dark urine, unusual tiredness, nausea or loss of appetite [4].
- **Avoid it** if you have liver or gallbladder disease or gallstones [6]. **Talk to your doctor first** if you take blood thinners such as warfarin, diabetes medicines, or are pregnant [4][13].

Full details in our [turmeric guide](/guides/turmeric).

## Our turmeric

Our [Turmeric Complex](/products/turmeric-complex) combines 800 mg of turmeric root powder with 100 mg of a 95% curcuminoid extract, plus glucosamine, chondroitin, ginger, boswellia and BioPerine® black pepper extract. It **contains shellfish** (crab, lobster, crawfish), as the label states, so it isn't suitable if you have a shellfish allergy.

## Sources

1. Tayyem RF et al. Nutrition and Cancer, 2006. [Curcumin content of turmeric and curry powders](https://pubmed.ncbi.nlm.nih.gov/17044766/).
2. Daily JW et al. Journal of Medicinal Food, 2016. [Efficacy of turmeric extracts and curcumin for alleviating the symptoms of joint arthritis: a systematic review and meta-analysis of randomized clinical trials](https://pmc.ncbi.nlm.nih.gov/articles/PMC5003001/).
3. Kuptniratsaikul V et al. Clinical Interventions in Aging, 2014. [Efficacy and safety of Curcuma domestica extracts compared with ibuprofen in patients with knee osteoarthritis: a multicenter study](https://pmc.ncbi.nlm.nih.gov/articles/PMC3964021/).
4. National Center for Complementary and Integrative Health (NCCIH). [Turmeric: usefulness and safety](https://www.nccih.nih.gov/health/turmeric).
5. Jäger R et al. Nutrition Journal, 2014. [Comparative absorption of curcumin formulations](https://pmc.ncbi.nlm.nih.gov/articles/PMC3918227/).
6. Menniti-Ippolito F et al. Annali dell'Istituto Superiore di Sanità, 2020. [Turmeric (Curcuma longa L.) food supplements and hepatotoxicity: an integrated evaluation approach](https://annali.iss.it/index.php/anna/article/view/1146).
7. Shoba G et al. Planta Medica, 1998. [Influence of piperine on the pharmacokinetics of curcumin in animals and human volunteers](https://pubmed.ncbi.nlm.nih.gov/9619120/).
8. Schiborr C et al. Molecular Nutrition & Food Research, 2014. [The oral bioavailability of curcumin from micronized powder and liquid micelles is significantly increased in healthy humans and differs between sexes](https://pubmed.ncbi.nlm.nih.gov/24402825/).
9. Wai HS et al. BMC Complementary Medicine and Therapies, 2025. [Effect of turmeric products on knee osteoarthritis: a systematic review and network meta-analysis](https://pubmed.ncbi.nlm.nih.gov/40731001/).
10. Beba M et al. Phytotherapy Research, 2022. [The effect of curcumin supplementation on delayed-onset muscle soreness, inflammation, muscle strength, and joint flexibility: a systematic review and dose-response meta-analysis of randomized controlled trials](https://pubmed.ncbi.nlm.nih.gov/35574627/).
11. LiverTox (NIDDK, National Institutes of Health). [Turmeric](https://www.ncbi.nlm.nih.gov/books/NBK548561/).
12. Therapeutic Goods Administration (Australia), 2023. [Medicines containing turmeric or curcumin: risk of liver injury](https://www.tga.gov.au/safety/safety-alerts/medicines-containing-turmeric-or-curcumin-risk-liver-injury).
13. Medsafe (New Zealand), 2018. [Beware turmeric/curcumin containing products can interact with warfarin](https://www.medsafe.govt.nz/safety/ews/2018/Turmeric.asp).
$jr$, 'Noovit', 'published', '2026-12-17T14:00:00.000Z', $jr$Turmeric vs Curcumin: What's the Difference? | Noovit$jr$, $jr$Turmeric powder is only about 3% curcumin. What "95% curcuminoids" means, how black pepper boosts absorption, and what doses studies used.$jr$)
on conflict (slug) do update set
  status = case when posts.status = 'draft' and posts.published_at is null and excluded.published_at is not null then excluded.status else posts.status end,
  published_at = case when posts.status = 'draft' and posts.published_at is null and excluded.published_at is not null then excluded.published_at else posts.published_at end,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description;

-- Mon, 28 Dec 2026 14:00:00 GMT
insert into posts (slug, title, excerpt, body, author, status, published_at, seo_title, seo_description)
values ($jr$ubiquinol-vs-ubiquinone$jr$, $jr$Ubiquinol vs ubiquinone (CoQ10): does the form matter?$jr$, $jr$Ubiquinol is sold as the "active", better-absorbed CoQ10. But your body converts between the two forms, most research used ubiquinone, and how you take it may matter more. Here's the evidence.$jr$, $jr$**Short answer:** for most people, the form matters less than the label suggests. **Ubiquinone** is the form used in most CoQ10 research, including the largest heart trial, and it usually costs less [1][2]. **Ubiquinol** is often sold as better absorbed, but in a head-to-head study it **wasn't significantly better absorbed**, and your body converts one form into the other anyway [3]. Taking either **with a meal that contains fat** makes a bigger difference [2][4].

## Two forms of the same molecule

CoQ10 (coenzyme Q10) is a compound your body makes and uses to produce energy inside cells. It shuttles electrons in the chain of reactions that makes ATP, the cell's energy currency [5]. To do that job, it constantly switches between two states:

- **Ubiquinone:** the oxidized form (it has given up electrons).
- **Ubiquinol:** the reduced form (it's carrying electrons). This is the form that also acts as an antioxidant [5].

Your body moves CoQ10 back and forth between the two all the time. In a study of older adults, CoQ10 showed up in the blood **mostly as ubiquinol even when people swallowed ubiquinone** [3].

## What the absorption studies show

- **Head to head:** in a crossover study in healthy older adults that compared several CoQ10 products, ubiquinol was **not significantly better absorbed** than ubiquinone [3].
- **How it's dissolved matters:** CoQ10 crystals that aren't dispersed in oil were absorbed about **75% less** in one comparison. That's why oil-based softgels tend to do better than dry powders [2].
- **Fat helps:** CoQ10 is fat-soluble and is absorbed best with fat, so taking it with a meal is the simplest way to improve absorption, whatever the form [4].

## Which form did the trials use?

| Trial | Form | Daily dose |
|---|---|---|
| Heart failure, 2 years (the most-cited CoQ10 trial) [1] | Ubiquinone | 300 mg |
| Older adults, 4 years (with selenium) [6] | Ubiquinone | 200 mg |
| Statin muscle aches, confirmed by a blinded statin challenge [7] | Ubiquinol | 600 mg |

Most research used ubiquinone [2]. A few studies used ubiquinol, and one of the most careful statin trials found **no benefit** for muscle pain even at 600 mg of ubiquinol a day [7].

## So which should you buy?

- **Either form can raise blood CoQ10 levels.** Ubiquinone has the most research behind it and usually costs less [2][3].
- **Take it with a meal that contains some fat**, whichever form you choose [4].
- **Doses in trials:** mostly 100–300 mg a day [1][6].
- **Ubiquinol may suit you** if you'd rather pay more for the reduced form, but it hasn't been shown to work better [3].

## Safety

CoQ10 is well tolerated in trials. Mild stomach upset is the most common complaint [4]. **Warfarin:** CoQ10 is chemically similar to vitamin K and may reduce warfarin's effect, so don't start or stop it without your doctor [8][9]. **Cancer treatment:** as an antioxidant, it may make some treatments less effective; check with your oncologist [8]. **Statins** lower your body's CoQ10, but never stop a statin because of muscle pain without talking to your doctor [8]. More in our [CoQ10 guide](/guides/coq10).

Our [CoQ10](/products/coq10) is ubiquinone, 200 mg per capsule. Take one capsule a day with a meal that contains some fat.

## Sources

1. Mortensen SA et al. JACC: Heart Failure, 2014. [The effect of coenzyme Q10 on morbidity and mortality in chronic heart failure: results from Q-SYMBIO: a randomized double-blind trial](https://pubmed.ncbi.nlm.nih.gov/25282031/).
2. Mantle D, Dybring A. Antioxidants, 2020. [Bioavailability of coenzyme Q10: an overview of the absorption process and subsequent metabolism](https://pmc.ncbi.nlm.nih.gov/articles/PMC7278738/).
3. Pravst I et al. Nutrients, 2020. [Comparative bioavailability of different coenzyme Q10 formulations in healthy elderly individuals](https://pmc.ncbi.nlm.nih.gov/articles/PMC7146408/).
4. National Cancer Institute. [Coenzyme Q10 (PDQ®): health professional version](https://www.cancer.gov/about-cancer/treatment/cam/hp/coenzyme-q10-pdq).
5. Al Saadi T et al. Cochrane Database of Systematic Reviews, 2021. [Coenzyme Q10 for heart failure](https://pubmed.ncbi.nlm.nih.gov/35608922/).
6. Alehagen U et al. International Journal of Cardiology, 2013. [Cardiovascular mortality and N-terminal-proBNP reduced after combined selenium and coenzyme Q10 supplementation: a 5-year prospective randomized double-blind placebo-controlled trial among elderly Swedish citizens](https://pubmed.ncbi.nlm.nih.gov/22626835/).
7. Taylor BA et al. Atherosclerosis, 2015. [A randomized trial of coenzyme Q10 in patients with confirmed statin myopathy](https://pmc.ncbi.nlm.nih.gov/articles/PMC4298455/).
8. Memorial Sloan Kettering Cancer Center. [Coenzyme Q10 — About Herbs](https://www.mskcc.org/cancer-care/integrative-medicine/herbs/coenzyme-q10).
9. Spigset O. The Lancet, 1994. [Reduced effect of warfarin caused by ubidecarenone](https://pubmed.ncbi.nlm.nih.gov/7968059/).
$jr$, 'Noovit', 'published', '2026-12-28T14:00:00.000Z', $jr$Ubiquinol vs Ubiquinone: Which CoQ10 Form? | Noovit$jr$, $jr$Ubiquinol or ubiquinone? Your body converts between the two CoQ10 forms, and most trials used ubiquinone. What absorption studies show, and how to take either.$jr$)
on conflict (slug) do update set
  status = case when posts.status = 'draft' and posts.published_at is null and excluded.published_at is not null then excluded.status else posts.status end,
  published_at = case when posts.status = 'draft' and posts.published_at is null and excluded.published_at is not null then excluded.published_at else posts.published_at end,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description;

-- Mon, 23 Nov 2026 14:00:00 GMT
insert into posts (slug, title, excerpt, body, author, status, published_at, seo_title, seo_description)
values ($jr$when-to-take-magnesium-for-sleep$jr$, $jr$When to take magnesium for sleep, and how much$jr$, $jr$Sleep trials gave magnesium 30 to 60 minutes before bed, at about 250 mg. What those trials found, what to realistically expect, and the limits to stay under.$jr$, $jr$**Short answer:** in the evening. The most recent sleep trial gave **250 mg of magnesium 30–60 minutes before bed** [1]. Keep supplements at or below **350 mg a day** unless your doctor advises more [2]. Expect a small effect at best: in trials, magnesium nudged sleep scores rather than transforming them [1][3][4].

## When: in the evening, before bed

- **30–60 minutes before bed** is what the 2025 trial of magnesium bisglycinate used [1].
- **About 2 hours before bed** was used in a trial of magnesium L-threonate, a different form [5].
- **Split doses** also work: one older-adult trial gave 250 mg twice a day [6].

No trial has compared morning with evening doses for sleep, so evening timing comes from how the studies were run rather than proof that timing matters. Taking it after an evening meal can also help if magnesium upsets your stomach.

## How much: about 250 mg, under 350 mg

- **The dose studied for sleep:** 250 mg of elemental magnesium a day [1]. A trial in older adults with insomnia used 500 mg a day [6], above the upper limit below, so higher doses are a conversation for your doctor.
- **The upper limit:** 350 mg a day from supplements and medicines combined (food doesn't count). The limit is set because higher doses can cause diarrhea [2].
- **Count everything:** multivitamins, antacids and laxatives that contain magnesium all add to your total [2].
- **Read the elemental number:** the label must show the magnesium itself, not the weight of the whole compound. 250 mg of magnesium as bisglycinate takes about 1,800 mg of the compound [1][2].

## What the trials found

| Trial | Who | Dose | Result |
|---|---|---|---|
| 2025, 4 weeks [1] | 155 adults with self-reported poor sleep | 250 mg (bisglycinate), 30–60 min before bed | Insomnia score fell 3.9 points vs 2.3 with placebo: a small effect. Other sleep and mood questionnaires didn't change |
| 2012, 8 weeks [6] | 46 older adults with insomnia | 500 mg a day (oxide) | Better insomnia scores, sleep efficiency and time to fall asleep; total sleep time didn't change |
| 2021 meta-analysis [3] | 151 older adults, 3 trials | Various | Fell asleep about 17 minutes faster; total sleep time not significantly different; low-quality evidence |

A 2023 systematic review called the overall results contradictory [4]. So magnesium for sleep is graded **Limited** in our [magnesium guide](/guides/magnesium).

## How soon you might notice

In the 2025 trial, most of the improvement came within the **first two weeks** and then held steady. But both groups improved during those weeks, the placebo group included [1]. If nothing has changed after about a month of nightly use, magnesium probably isn't the answer for your sleep.

## Which form

Glycinate (bisglycinate) is the form usually chosen for evening use because it's less likely to loosen stools, and it's the form in the 2025 trial [1]. Citrate and oxide have more of a laxative effect [2]. The daily dose in that trial also contained about 1.5 g of glycine, the amino acid magnesium is bound to, so the trial can't fully separate the effect of the two [1]. Full comparison: [magnesium glycinate vs citrate vs oxide](/blog/magnesium-glycinate-vs-citrate-vs-oxide).

## Who should check with a doctor first

- **Kidney disease:** the kidneys clear excess magnesium, so it can build up [2].
- **Antibiotics** (tetracyclines, quinolones) or **osteoporosis drugs** (bisphosphonates): magnesium binds to them, so space the doses [2].
- **Diuretics** or long-term **acid reducers** (PPIs): these change magnesium levels [2].
- **Ongoing insomnia:** see a doctor. Poor sleep can have many causes worth checking.

Our [Magnesium Sleep+](/products/magnesium-complex) gives 275 mg of elemental magnesium as glycinate in three capsules, taken after an evening meal. Many people pair it with ashwagandha in the morning: that's our [Sleep & Calm Stack](/products/sleep-calm-stack).

## Sources

1. Schuster J et al. Nature and Science of Sleep, 2025. [Magnesium bisglycinate supplementation in healthy adults reporting poor sleep: a randomized, placebo-controlled trial](https://pmc.ncbi.nlm.nih.gov/articles/PMC12412596/).
2. NIH Office of Dietary Supplements. [Magnesium: fact sheet for health professionals](https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/).
3. Mah J, Pitre T. BMC Complementary Medicine and Therapies, 2021. [Oral magnesium supplementation for insomnia in older adults: a systematic review & meta-analysis](https://pubmed.ncbi.nlm.nih.gov/33865376/).
4. Arab A et al. Biological Trace Element Research, 2023. [The role of magnesium in sleep health: a systematic review of available literature](https://pubmed.ncbi.nlm.nih.gov/35184264/).
5. Hausenblas HA et al. Sleep Medicine: X, 2024. [Magnesium-L-threonate improves sleep quality and daytime functioning in adults with self-reported sleep problems: a randomized controlled trial](https://pmc.ncbi.nlm.nih.gov/articles/PMC11381753/).
6. Abbasi B et al. Journal of Research in Medical Sciences, 2012. [The effect of magnesium supplementation on primary insomnia in elderly: a double-blind placebo-controlled clinical trial](https://pmc.ncbi.nlm.nih.gov/articles/PMC3703169/).
$jr$, 'Noovit', 'published', '2026-11-23T14:00:00.000Z', $jr$When to Take Magnesium for Sleep, and How Much | Noovit$jr$, $jr$Sleep trials gave about 250 mg of magnesium 30–60 minutes before bed. What they found, how soon to expect a change, and the 350 mg supplement limit.$jr$)
on conflict (slug) do update set
  status = case when posts.status = 'draft' and posts.published_at is null and excluded.published_at is not null then excluded.status else posts.status end,
  published_at = case when posts.status = 'draft' and posts.published_at is null and excluded.published_at is not null then excluded.published_at else posts.published_at end,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description;
