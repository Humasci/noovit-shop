// "Perimenopause, Decoded" (owner, 23 Nov): free 6-week email program. Plan docs/programs/PERIMENOPAUSE.md, outline
// docs/programs/perimenopause-outline.md, research docs/programs/research/ (every fact here comes from an opened source).
// Education first: no product names on the landing page. Menopause Balance+ is left out of the program (owner, 23 Nov).

export const PROGRAM = {
  slug: 'perimenopause',
  path: '/programs/perimenopause',
  name: 'Perimenopause, Decoded',
  tagline: 'A free 6-week guide to what’s changing, what helps, and what to ask your doctor.',
  source: 'program-perimenopause',
};

export const WEEKS: { n: number; title: string; line: string }[] = [
  { n: 1, title: 'What perimenopause really is', line: 'The stages, the timeline, and why every woman’s experience is different.' },
  { n: 2, title: 'Your hormones, simply', line: 'Why levels swing instead of falling steadily, and when a blood test helps.' },
  { n: 3, title: 'Sleep and night sweats', line: 'The approach with the best evidence for insomnia, plus caffeine and alcohol timing.' },
  { n: 4, title: 'Hot flashes: what actually works', line: 'The treatments experts recommend, and the popular ones that weren’t shown to help.' },
  { n: 5, title: 'Strength, bones and energy', line: 'Why the years around your last period matter for bone, and what builds muscle.' },
  { n: 6, title: 'Mood, brain fog and your doctor', line: 'What’s common, when to get help, and how to make your appointment count.' },
];

export const FACTS: { big: string; text: string }[] = [
  { big: '4 years', text: 'Average length of perimenopause; it can last up to 10.' },
  { big: 'Up to 80%', text: 'Of women get hot flashes or night sweats during the transition.' },
  { big: '45+', text: 'After 45, one blood test usually can’t confirm perimenopause; symptoms and cycle changes tell more.' },
];

export const FAQS: { q: string; a: string }[] = [
  { q: 'Who is this for?', a: 'Women in their late 30s to 50s who notice changes in their periods, sleep, mood or temperature and want clear, evidence-based information. It’s also useful if you just want to know what’s ahead.' },
  { q: 'Is this medical advice?', a: 'No. It’s general education based on published research and guidance from The Menopause Society, ACOG and NIH. Talk to your doctor about your symptoms and options.' },
  { q: 'Do I need a blood test for perimenopause?', a: 'Usually not after 45. Hormone levels swing from day to day, so one result is a snapshot. Doctors usually go by your age, symptoms and period changes. Testing matters more if you’re under 45.' },
  { q: 'What does it cost?', a: 'Nothing. You get a printable starter kit and one short email a week for six weeks. Unsubscribe anytime.' },
  { q: 'Will you try to sell me things?', a: 'The program is mostly education. In a few emails we mention our own products only where the evidence fits, and we say how strong (or weak) that evidence is.' },
  { q: 'What do you do with my email?', a: 'We use it only to send the program and occasional Noovit emails. We never ask for your symptoms. See our privacy and consumer health data policies.' },
];

export const REFERENCES: { label: string; title: string; url: string }[] = [
  { label: 'The Menopause Society (NAMS), 2023', title: 'The 2023 nonhormone therapy position statement', url: 'https://depts.washington.edu/mbwc/content/page-files/NAMS_2023-nonhormone-therapy-position-statement_(1)22.pdf' },
  { label: 'The Menopause Society (NAMS), 2022', title: 'The 2022 hormone therapy position statement', url: 'https://menopause.org/wp-content/uploads/professional/nams-2022-hormone-therapy-position-statement.pdf' },
  { label: 'Harlow SD et al. Menopause, 2012', title: 'Executive summary of the Stages of Reproductive Aging Workshop + 10 (STRAW+10)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3340903/' },
  { label: 'Avis NE et al. JAMA Internal Medicine, 2015', title: 'Duration of menopausal vasomotor symptoms over the menopause transition (SWAN)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4433164/' },
  { label: 'Greendale GA et al. J Bone Miner Res, 2012', title: 'Bone mineral density loss in relation to the final menstrual period (SWAN)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3378821/' },
  { label: 'NICE NG23 (updated 2026)', title: 'Menopause: identification and management', url: 'https://www.nice.org.uk/guidance/ng23/chapter/Recommendations' },
  { label: 'HHS Office on Women’s Health', title: 'Menopause basics', url: 'https://womenshealth.gov/menopause/menopause-basics' },
  { label: 'ACOG', title: 'The menopause years (patient FAQ)', url: 'https://www.acog.org/womens-health/faqs/the-menopause-years' },
  { label: 'ACOG', title: 'Perimenopausal bleeding and bleeding after menopause', url: 'https://www.acog.org/womens-health/faqs/perimenopausal-bleeding-and-bleeding-after-menopause' },
  { label: 'McCurry SM et al. JAMA Internal Medicine, 2016', title: 'Telephone-based CBT for insomnia in perimenopausal and postmenopausal women (MsFLASH)', url: 'https://europepmc.org/article/MED/27213646' },
  { label: 'Watson SL et al. J Bone Miner Res, 2018', title: 'High-intensity resistance and impact training in postmenopausal women (LIFTMOR)', url: 'https://europepmc.org/article/MED/28975661' },
  { label: 'LeBoff MS et al. NEJM, 2022', title: 'Supplemental vitamin D and incident fractures in midlife and older adults (VITAL)', url: 'https://europepmc.org/article/MED/35939577' },
];
