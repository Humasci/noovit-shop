// "Perimenopause, Decoded": the starter kit email and the six weekly emails (24 Nov 2026).
// Facts come only from docs/programs/research/perimenopause-medical.md (M) and perimenopause-what-helps.md (W), as
// planned in docs/programs/perimenopause-outline.md. Products appear only in weeks 3, 5 and 6, with structure/function
// wording and an asterisk. Subjects stay neutral (no health condition in the inbox preview).
import { SITE_URL } from '@/lib/site';
import { productPath } from '@/lib/urls';
import { PROGRAM } from './perimenopause';

export interface ProgramEmail {
  step: number; // 1 = starter kit, 2–7 = weeks 1–6
  day: number; // days after sign-up
  subject: string;
  html: string;
}

const KIT = `${SITE_URL}${PROGRAM.path}/starter-kit`;
const btn = (href: string, label: string) =>
  `<p><a href="${href}" style="display:inline-block;background:#14213d;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold">${label}</a></p>`;
const h1 = (t: string) => `<h1 style="font-size:20px;margin:0 0 12px">${t}</h1>`;
const h2 = (t: string) => `<h2 style="font-size:16px;margin:20px 0 6px">${t}</h2>`;
const grade = (g: string) => `<span style="font-size:12px;color:#6b7280">(evidence: ${g})</span>`;
const action = (t: string) => `<p style="background:#e8e2f2;border-radius:12px;padding:12px 16px"><b>This week:</b> ${t}</p>`;
const NOT_ADVICE = `<p style="font-size:12px;color:#6b7280">Education, not medical advice. Talk to your doctor or pharmacist before starting a supplement, especially if you take medicines or hormone therapy. Sources are listed on <a href="${SITE_URL}${PROGRAM.path}#references">the program page</a>.</p>`;
const FDA = `<p style="font-size:12px;color:#6b7280">*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.</p>`;

export const PROGRAM_EMAILS: ProgramEmail[] = [
  {
    step: 1,
    day: 1,
    subject: 'Your printable starter kit',
    html: `${h1('Your starter kit is ready')}
      <p>Here's the kit we promised: four printable pages to use alongside the next six weeks.</p>
      <ul>
        <li><b>What's happening:</b> the stages of the transition, in plain words.</li>
        <li><b>A 4-week tracker:</b> sleep, hot flashes and night sweats, mood, energy and bleeding, one line a day.</li>
        <li><b>What helps:</b> the options with good evidence, and the popular ones that weren't shown to work.</li>
        <li><b>Talk to your doctor:</b> questions to ask, and the signs that mean you should go sooner.</li>
      </ul>
      ${btn(KIT, 'Open the starter kit')}
      <p>Print it, or save it as a PDF from your browser. Start the tracker today: a few weeks of notes make a doctor's appointment far more useful.</p>
      <p>Week 1 arrives in two days.</p>
      ${NOT_ADVICE}`,
  },
  {
    step: 2,
    day: 3,
    subject: 'Week 1: the basics, in plain words',
    html: `${h1('What perimenopause really is (and isn’t)')}
      <p><b>Perimenopause is a transition, not a day.</b> It starts when your cycles first become irregular and ends 12 months after your final period. It lasts about four years on average, and up to ten.</p>
      <p><b>Menopause is a single point:</b> 12 months in a row with no period. After that, you're postmenopausal.</p>
      ${h2('Everyone’s version is different')}
      <p>Some women notice very little. Others have months of broken sleep. In the large US SWAN study, up to 80% of women had hot flashes or night sweats at some point in the transition. Sleep changes, mood changes, heavier or lighter periods and a foggy memory are all common.</p>
      <p>That variety is why a simple record of your own symptoms is so useful: it shows the pattern that's yours, not an average.</p>
      ${action('track seven days with the tracker in your <a href="' + KIT + '">starter kit</a>. One line a day is enough.')}
      <p>Next week: what your hormones are actually doing, and when a blood test helps.</p>
      ${NOT_ADVICE}`,
  },
  {
    step: 3,
    day: 10,
    subject: 'Week 2: what your hormones are doing',
    html: `${h1('Your hormones, simply')}
      <p><b>They swing, they don't fall in a straight line.</b> In the transition, estrogen can be low one month and high the next. Progesterone drops because ovulation becomes less regular: some months the ovaries release an egg, other months they don't.</p>
      <p>In SWAN, estrogen began falling about two years before the final period and settled about two years after. But women followed different patterns: some had a rise first, some a slow decline, some barely any change.</p>
      ${h2('Do you need a blood test?')}
      <p><b>Usually not if you're 45 or over.</b> US government guidance says your doctor can usually tell from your age, your symptoms and changes in your periods; blood hormone tests are not usually needed. UK guidance (NICE) says the same, because one result can't capture levels that swing from week to week.</p>
      <p><b>Testing matters more under 45</b>, or when the picture isn't clear. That's a conversation for your doctor.</p>
      ${action('note any change in your cycle: shorter, longer, heavier, lighter or skipped.')}
      <p>We're building an at-home Perimenopause Check for women who want a clearer picture. You'll hear about it first.</p>
      ${NOT_ADVICE}`,
  },
  {
    step: 4,
    day: 17,
    subject: 'Week 3: better nights',
    html: `${h1('Sleep, night sweats and a busy mind')}
      ${h2('The approach with the best evidence: CBT for insomnia')}
      <p>CBT-I is a short, structured program that retrains sleep habits. In a trial of 106 women aged 40 to 65 with insomnia and hot flashes, six phone sessions over eight weeks helped a lot: at 24 weeks, 84% were in the no-insomnia range, against 43% with education alone. ${grade('Moderate')} It didn't reduce the number of hot flashes, but sleep improved anyway. Ask your doctor, or look for a CBT-I program or app.</p>
      ${h2('Two simple changes')}
      <ul>
        <li><b>Caffeine:</b> a review of 24 studies found it cut sleep by about 45 minutes. The authors suggest your last coffee about nine hours before bed. ${grade('Moderate')}</li>
        <li><b>Alcohol:</b> it helps you fall asleep, then breaks up the second half of the night. ${grade('Moderate')}</li>
      </ul>
      ${action('move your last coffee earlier, and log your sleep in the tracker.')}
      ${h2('What about magnesium?')}
      <p>Studies of magnesium and sleep are small and low quality: in three trials of older adults, people fell asleep about 17 minutes faster, but total sleep didn't change significantly. ${grade('Limited')} If you'd like to try it, our <a href="${SITE_URL}${productPath('magnesium-complex')}">Magnesium Sleep+</a> gives 275 mg of magnesium as glycinate per serving and supports relaxation and sleep.* Keep magnesium from supplements at or under 350 mg a day unless your doctor advises otherwise, and check first if you have kidney disease.</p>
      ${FDA}
      ${NOT_ADVICE}`,
  },
  {
    step: 5,
    day: 24,
    subject: 'Week 4: what actually works for hot flashes',
    html: `${h1('Hot flashes: what actually works')}
      <p>Frequent hot flashes last a median of 7.4 years, so it's worth knowing which options are proven.</p>
      ${h2('Options your doctor can offer')}
      <ul>
        <li><b>Hormone therapy</b> is the most effective treatment. For most healthy women under 60, or within 10 years of menopause, The Menopause Society says the benefits outweigh the risks. It isn't right for everyone, so it's a decision to make with your doctor.</li>
        <li><b>Non-hormone prescriptions:</b> the FDA has approved three for moderate to severe hot flashes, and doctors also use some other medicines. Your doctor will explain which suits you, including any monitoring needed.</li>
      </ul>
      ${h2('Without medicine')}
      <ul>
        <li><b>CBT and clinical hypnosis</b> are on The Menopause Society's list of non-hormone options with good evidence. In one trial, 12 weeks of hypnosis cut hot flashes by 74%, against 17% with a comparison program. ${grade('Moderate')}</li>
        <li><b>Layers, a fan, a cooler bedroom:</b> sensible comfort steps, though not tested as treatments.</li>
      </ul>
      ${h2('What the evidence doesn’t support')}
      <p>Research on herbal remedies such as black cohosh, soy and red clover is mixed, and The Menopause Society does not recommend them for hot flashes. ${grade('Insufficient')}</p>
      ${action('note when hot flashes happen and anything that seems to set them off.')}
      ${NOT_ADVICE}`,
  },
  {
    step: 6,
    day: 31,
    subject: 'Week 5: strength, bones and energy',
    html: `${h1('Strength, bones and energy')}
      <p><b>Bone loss is fastest from about a year before your final period to two years after</b>: around 2.5% a year at the spine. What you do in these years counts.</p>
      ${h2('Strength training')}
      <p>Lifting builds muscle at any age. ${grade('Moderate')} For bone, a key trial (LIFTMOR) had postmenopausal women with low bone mass do supervised, high-intensity lifting twice a week for eight months: spine density rose 2.9%, against a 1.2% fall in the home-exercise group. ${grade('Limited')} The sessions were closely supervised, so start with a qualified trainer.</p>
      ${h2('Food first')}
      <ul>
        <li><b>Protein:</b> expert groups advise at least 1.0 to 1.2 g per kg of body weight a day for people over 65, more if active. There's no agreed figure for midlife yet.</li>
        <li><b>Vitamin D and calcium:</b> get enough from food and sun. In the large VITAL trial, vitamin D supplements didn't reduce fractures in adults who weren't low in it.</li>
        <li><b>Iron:</b> heavy or long periods can lower iron. Get checked before taking iron, and see a doctor about heavy bleeding in its own right.</li>
      </ul>
      ${action('book two strength sessions this week, even short ones.')}
      ${h2('Creatine, if you lift')}
      <p>Adding creatine to strength training gave more strength and lean mass in older adults. ${grade('Moderate')} It didn't change bone density in a two-year trial of postmenopausal women. Our <a href="${SITE_URL}${productPath('creatine-for-women')}">Creatine for Her</a> gives 5 g of creatine monohydrate per scoop and supports strength and lean muscle with resistance training.*</p>
      ${FDA}
      ${NOT_ADVICE}`,
  },
  {
    step: 7,
    day: 38,
    subject: 'Week 6: mood, focus and your appointment',
    html: `${h1('Mood, brain fog and your doctor’s appointment')}
      ${h2('Mood')}
      <p>Perimenopause is a window of higher risk for low mood and depression, especially if you've had depression before. If your mood is low most days for two weeks or more, talk to your doctor. <b>If you ever have thoughts of harming yourself, call or text 988</b> (the Suicide &amp; Crisis Lifeline), any time.</p>
      ${h2('Brain fog')}
      <p>About 60% of women notice memory problems in the transition. SWAN found a temporary dip in processing speed and verbal memory that recovered after menopause.</p>
      ${h2('Make your appointment count')}
      <ul>
        <li>Bring your tracker: a few weeks of notes say more than "I'm not sleeping".</li>
        <li>Ask: Is this perimenopause? Which options suit me, hormonal and non-hormonal? Do I need any tests? What about my bones and heart?</li>
        <li>Mention every medicine and supplement you take.</li>
      </ul>
      ${h2('See a doctor sooner if you have')}
      <ul>
        <li>Any bleeding after 12 months without a period.</li>
        <li>Bleeding between periods or after sex, or periods much heavier than usual.</li>
        <li>Severe low mood.</li>
      </ul>
      ${btn(KIT, 'Print your questions and tracker')}
      <p>That's the end of the six weeks. Thank you for reading. Our <a href="${SITE_URL}/guides">evidence guides</a> go deeper on many of these topics, and you can join the waitlist for our at-home <a href="${SITE_URL}/at-home-tests/perimenopause-test">Perimenopause Check</a>.</p>
      <p><b>Reply and tell us what helped.</b> We read every message.</p>
      ${NOT_ADVICE}`,
  },
];

// The next email for someone who has had `lastStep` emails and joined `days` days ago (one per run, so a missed day
// catches up the next day instead of sending two at once).
export function nextProgramEmail(lastStep: number, days: number) {
  const next = PROGRAM_EMAILS.find((e) => e.step === lastStep + 1);
  return next && days >= next.day ? next : null;
}
