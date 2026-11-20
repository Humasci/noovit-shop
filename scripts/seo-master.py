"""Build the SEO master spreadsheet: docs/seo/NOOVIT_SEO_MASTER.xlsx (+ CSV per tab in docs/seo/master/).
Sources: every Ahrefs table in docs/seo (screenshot transcriptions + saved pages) and data/seo-questions.json.
Re-run after adding Ahrefs data:  python3 scripts/seo-master.py
Tabs: Read me · Keywords · Topic clusters · Questions & answers · Related terms · Sources."""
import csv, glob, json, os, re
from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEO = os.path.join(ROOT, 'docs', 'seo')

# ---------- load keywords from every markdown table ----------
ALIASES = {'keyword': 'Keyword', 'intents': 'Intent', 'intent': 'Intent', 'category': 'Category', 'kd': 'KD', 'sv': 'SV',
           'gsv': 'GSV', 'tp': 'TP', 'gtp': 'GTP', 'cpc': 'CPC', 'cps': 'CPS', 'parent topic': 'Parent topic', 'sf': 'SF'}

def num(v):
    v = (v or '').replace(',', '').replace('$', '').replace('~', '').replace('†', '').strip()
    if re.fullmatch(r'0[–-]10', v):
        return 5.0
    m = re.fullmatch(r'([\d.]+)([KM]?)', v)
    return float(m.group(1)) * {'': 1, 'K': 1e3, 'M': 1e6}[m.group(2)] if m else None

def tables(path):
    head = None
    for line in open(path, encoding='utf-8'):
        line = line.rstrip('\n')
        if not line.startswith('|'):
            head = None
            continue
        cells = [c.strip() for c in line.strip().strip('|').split('|')]
        if head is None:
            head = [ALIASES.get(c.lower(), c) for c in cells]
            continue
        if set(line.replace('|', '').strip()) <= set('-: '):
            continue
        if 'Keyword' in head and len(cells) == len(head):
            yield dict(zip(head, cells))

SOURCES = sorted(glob.glob(os.path.join(SEO, 'ahrefs', '*.md'))) + [os.path.join(SEO, f) for f in (
    'ahrefs-2026-11-20-full.md', 'ahrefs-2026-11-20-raw.md', 'ahrefs-2026-11-20-related-part1.md', 'ahrefs-2026-11-20-related-part2.md')]
FIELDS = ['Intent', 'Category', 'KD', 'SV', 'GSV', 'TP', 'GTP', 'CPC', 'CPS', 'Parent topic', 'SF']
kw = {}
for src in SOURCES:
    if not os.path.exists(src):
        continue
    name = os.path.relpath(src, SEO)
    for r in tables(src):
        k = re.sub(r'\s+', ' ', r['Keyword'].lower()).strip().strip('*')
        if not k or k.startswith('(') or 'cut off' in k:
            continue
        cur = kw.setdefault(k, {'Keyword': k, 'Sources': []})
        if name not in cur['Sources']:
            cur['Sources'].append(name)
        for f in FIELDS:
            v = (r.get(f) or '').strip()
            if v and v not in ('–', '-', 'N/A', 'n/a', 'none') and not cur.get(f):
                cur[f] = v.replace(' | …', '').replace('…', '').strip(' ;')

# ---------- clusters: first matching rule wins ----------
# (cluster, regex, pillar page, supporting pages, page status)
CLUSTERS = [
    ('Out of scope', r'recipe|grow|kit uk|egypt|kuwait|japan|walmart|gnc|podcast|nearby|news$|for kids|children|18 year old boy|sleep apnea|adhd', '—', '', 'skip'),
    ('Competitor brands', r'pure encapsulations|solaray|nature\'?s bounty|nature made|thorne|doctor\'?s best|womaness|estroven', 'Comparison content only (never brand names in our titles/ads)', '', 'n/a'),
    ('Pets: at-home tests', r'(dog|cat|pet).*(test|strip|ph|uti)|urine ph', '/at-home-tests/pet-urine-test-strips', '/pets; /blog/cat-urine-ph (new); /blog/dog-uti-test-at-home (new)', 'exists + new articles'),
    ('Pets: joints', r'(dog|cat|pet).*(glucosamine|joint)|glucosamine for cats|cosequin|dasuquin', '/blog/cosequin-vs-dasuquin (new)', '/blog/glucosamine-for-cats (new); /pets', 'new'),
    ('At-home tests: women\'s health', r'(menopause|perimenopause|fsh|hormone|women\'?s health).*(test|kit)', '/at-home-tests/perimenopause-test', '/at-home-tests/womens-health-test', 'exists'),
    ('At-home tests: heart & metabolic', r'a1c|hba1c|cholesterol test|apob', '/at-home-tests/cholesterol-test', '/at-home-tests/a1c-test', 'exists'),
    ('At-home tests: nutrients', r'(ferritin|iron|vitamin d|b12|magnesium|vitamin deficiency|omega).*(test|kit)|need magnesium', '/at-home-tests/iron-test', '/at-home-tests/vitamin-d-test; /at-home-tests/omega-3-test; /blog/can-you-test-magnesium-at-home', 'exists'),
    ('At-home tests: other', r'(thyroid|tsh|cortisol|testosterone|blood|health|lab).*(test|kit)|at home (blood|health|lab)', '/at-home-tests', 'kit pages', 'exists'),
    ('Iron', r'ferritin|iron', '/products/iron-bisglycinate (draft)', '/blog/low-ferritin-symptoms', 'draft product'),
    ('Magnesium glycinate (head term)', r'^(magnesium glycinate|magnesium glycinate (supplement|supplements|capsules|tablets|pills)|magnesium glycinate supplement capsules)$', '/products/magnesium-glycinate', '/guides/magnesium-glycinate (new pillar); /guides/magnesium', 'exists'),
    ('Magnesium forms compared', r'magnesium.*\b(vs|versus|or|difference|compared)\b|bisglycinate|threonate|malate|gluconate|types of magnesium', '/blog/magnesium-glycinate-vs-citrate-vs-oxide', '/blog/magnesium-bisglycinate-vs-glycinate (new); /blog/magnesium-glycinate-vs-threonate; /guides/magnesium (forms table)', 'exists + 1 new'),
    ('Menopause supplements', r'(?=.*magnesium)(?=.*(menopause|perimenopause))', '/goals/menopause', '/blog/magnesium-glycinate-for-women', 'exists'),
    ('Magnesium glycinate: women & men', r'(?=.*magnesium)(?=.*\b(women|woman|female|men|man|male)\b)', '/blog/magnesium-glycinate-for-women', '/mens-health (FAQ, when live)', 'exists'),
    ('Magnesium glycinate: dosage', r'(?=.*magnesium)(?=.*(how much|dosage|dose|per day|too much|500|200-400|\bmg\b))|0mg magnesium', '/guides/magnesium-glycinate', '/blog/when-to-take-magnesium-for-sleep', 'new pillar'),
    ('Magnesium glycinate: timing', r'(?=.*magnesium)(?=.*(when|time|morning|night|before bed))', '/blog/when-to-take-magnesium-for-sleep', '/guides/magnesium-glycinate', 'exists'),
    ('Magnesium glycinate: sleep', r'(?=.*magnesium)(?=.*sleep)', '/products/magnesium-glycinate', '/blog/when-to-take-magnesium-for-sleep; /guides/magnesium-glycinate', 'exists'),
    ('Magnesium glycinate: safety & side effects', r'(?=.*magnesium)(?=.*(side effect|safe|kidney|liver|cause|symptom|adverse|diarrh))', '/guides/magnesium-glycinate', '/guides/magnesium', 'new pillar'),
    ('Magnesium glycinate: formats', r'(?=.*magnesium)(?=.*(powder|gumm|capsule|liquid|drink|tablet))', '/blog/magnesium-glycinate-capsules-powder-gummies (new)', '/products/magnesium-glycinate', 'new'),
    ('Magnesium glycinate: buying', r'best magnesium|pure magnesium|magnesium glycinate (supplement|usp)', '/products/magnesium-glycinate', '/blog/best-magnesium-glycinate (new, neutral checklist)', 'exists + new'),
    ('Magnesium glycinate: benefits & basics', r'magnesium', '/guides/magnesium-glycinate', '/products/magnesium-glycinate; /guides/magnesium', 'new pillar'),
    ('Creatine for women 40+ & menopause', r'creatine.*(menopause|perimenopause|over \d0|older|60|70)', '/blog/creatine-for-women-over-40 (new)', '/products/creatine-for-women', 'new'),
    ('Creatine for women', r'creatine.*(women|woman|female|her\b|ladies|girl)|(women|woman).*creatine', '/products/creatine-for-women', '/blog/creatine-for-women', 'exists (activate product)'),
    ('Creatine', r'creatine', '/products/creatine-monohydrate', '/guides/creatine; /products/creatine-hydration', 'exists'),
    ('Biotin', r'biotin', '/products/biotin-zinc-selenium (draft)', '/blog/biotin-for-hair (new)', 'draft product + new'),
    ('Perimenopause supplements', r'perimenopause', '/goals/menopause', '/blog/best-supplements-for-perimenopause (new); /womens-health#midlife', 'exists + new'),
    ('Menopause supplements', r'menopause|post menopause', '/goals/menopause', '/products/menopause-supplement (draft); /blog/best-supplements-for-perimenopause (new)', 'exists'),
    ('Lion\'s mane', r'lion', '/products/lions-mane-mushroom', '/guides/lions-mane; /blog/lions-mane-fruiting-body-vs-mycelium; /blog/best-lions-mane-supplement (new)', 'exists'),
    ('Ashwagandha', r'ashwagandha|ksm', '/products/ashwagandha-ksm-66', '/guides/ashwagandha; /blog/ashwagandha-for-women; /blog/ashwagandha-with-maca', 'exists'),
    ('CoQ10', r'coq10|ubiquin', '/products/coq10-200mg', '/blog/ubiquinol-vs-ubiquinone', 'exists'),
    ('Joints & turmeric', r'turmeric|glucosamine|chondroitin|joint', '/products/turmeric-glucosamine-chondroitin', '/goals/joints-mobility; /guides/turmeric', 'exists'),
    ('Collagen', r'collagen', '/products/collagen-hyaluronic-acid (draft)', '/goals/hair-skin-nails', 'draft product'),
    ('Men\'s health', r'\bmen\b|men\'s', '/mens-health (hidden)', '/at-home-tests/testosterone-test (hidden)', 'hidden'),
    ('Women\'s health', r'women|woman|female', '/womens-health', '/blog/best-supplements-for-women (new)', 'exists + new'),
    ('Other', r'.', '—', '', 'review'),
]
CL = [(n, re.compile(rx), p, s, st) for n, rx, p, s, st in CLUSTERS]

def cluster(k):
    for n, rx, p, s, st in CL:
        if rx.search(k):
            return n, p, s, st

QUESTION = re.compile(r'^(what|how|is|are|can|does|do|when|why|which|should|who|will)\b|\?|\b(vs|versus)\b|best time')

def tier(kd, sv):
    if kd is None:
        return 'LT (long tail: FAQ/heading)' if (sv or 0) >= 50 else 'LT (low volume)'
    if kd <= 10: return 'P1 act now'
    if kd <= 25: return 'P2 next'
    if kd <= 50: return 'P3 build up'
    return 'P4 long game'

rows = []
for k, r in kw.items():
    c, pillar, support, status = cluster(k)
    kd, sv = num(r.get('KD')), num(r.get('SV'))
    t = 'Skip' if c in ('Out of scope', 'Competitor brands') else tier(kd, sv)
    is_q = bool(QUESTION.search(k))
    if c == 'Out of scope': action = 'Skip: off-topic or not our market'
    elif c == 'Competitor brands': action = 'Comparison article at most; never use the brand in titles or ads'
    elif is_q: action = 'Answer under a question heading (40–60 words) + FAQ entry'
    elif r.get('Intent', '').find('T') >= 0 or 'best' in k: action = 'Commercial: product page / buying checklist'
    else: action = 'Cover in the pillar page copy'
    rows.append({**r, 'Cluster': c, 'Priority': t, 'KD_n': kd, 'SV_n': sv or 0, 'TP_n': num(r.get('TP')) or 0,
                 'Question?': 'Yes' if is_q else '', 'Target page': pillar, 'Supporting pages': support,
                 'Page status': status, 'Action': action})
rows.sort(key=lambda r: (-r['SV_n'], r['Keyword']))

# ---------- questions ----------
QS = json.load(open(os.path.join(ROOT, 'data', 'seo-questions.json'), encoding='utf-8'))
for q in QS:
    rx, ex = re.compile(q['match']), re.compile(q['exclude']) if q.get('exclude') else None
    hits = [r for r in rows if rx.search(r['Keyword']) and not (ex and ex.search(r['Keyword'])) and r['Priority'] != 'Skip']
    q['_hits'] = hits
    q['_sv'] = sum(r['SV_n'] for r in hits)
    kds = [r['KD_n'] for r in hits if r['KD_n'] is not None]
    q['_kd'] = min(kds) if kds else None
QS.sort(key=lambda q: -q['_sv'])

# ---------- cluster summary + related terms ----------
ENTITIES = {
    'Magnesium glycinate: benefits & basics': 'elemental magnesium; glycine; chelate; RDA 310–420 mg; upper limit 350 mg; NIH Office of Dietary Supplements; muscle and nerve function; blood pressure; sleep quality; insomnia severity index',
    'Magnesium glycinate: dosage': 'elemental vs compound weight; ~14% magnesium; 350 mg upper limit; RDA by age and sex; Supplement Facts; split dose',
    'Magnesium glycinate: safety & side effects': 'diarrhea; nausea; cramps; kidney disease; hypermagnesemia; tetracycline; quinolone; bisphosphonates; antacids; laxatives',
    'Magnesium glycinate: timing': '30–60 minutes before bed; with food; consistency; antibiotic spacing (2 h before / 4–6 h after)',
    'Magnesium glycinate: sleep': 'insomnia; sleep onset; Schuster 2025 RCT; older adults meta-analysis; glycine; not a sedative',
    'Magnesium forms compared': 'citrate; oxide (~60% Mg, ~4% absorbed); bisglycinate = glycinate; diglycinate; L-threonate (Magtein, ~7.5% Mg); malate; gluconate; chloride; absorption; laxative effect',
    'Creatine for women': 'creatine monohydrate; 3–5 g/day; loading phase; water weight; resistance training; lean mass; ISSN position stand; GRAS; creatinine',
    'Creatine for women 40+ & menopause': 'sarcopenia; bone; resistance training; perimenopause; estrogen; lean mass; Chilibeck 2017; Smith-Ryan 2021/2025',
    'Biotin': '30 mcg adequate intake; biotin deficiency; hair loss causes; FDA lab-test interference; troponin; thyroid tests',
    'Menopause supplements': 'black cohosh; sage; vitamin D; calcium; hot flashes; The Menopause Society; hormone therapy; liver warning',
    'Perimenopause supplements': 'FSH; irregular periods; ferritin; magnesium; vitamin D; sleep; strength training; hormone-balancing claims',
    'Lion\'s mane': 'Hericium erinaceus; fruiting body; mycelium; beta-glucans; hericenones; erinacines; 1–3 g/day trials',
    'At-home tests: nutrients': 'ferritin; serum iron; 25-OH vitamin D; B12; serum magnesium (<1% of body Mg); CLIA-certified lab; finger-prick',
}
clus = {}
for r in rows:
    c = clus.setdefault(r['Cluster'], {'Cluster': r['Cluster'], 'Pillar page': r['Target page'], 'Supporting pages': r['Supporting pages'],
                                       'Page status': r['Page status'], 'n': 0, 'sv': 0, 'easy': []})
    c['n'] += 1
    c['sv'] += r['SV_n']
    if r['Priority'].startswith('P1'):
        c['easy'].append(r)
csum = sorted(clus.values(), key=lambda c: -c['sv'])

# ---------- write workbook ----------
wb = Workbook()
H = Font(bold=True, color='FFFFFF')
FILL = PatternFill('solid', fgColor='1F2A44')
TIER_FILL = {'P1': 'D8F0DF', 'P2': 'FFF3C4', 'P3': 'FDE2C4', 'P4': 'F8D0D0', 'LT': 'EEF1F6', 'Sk': 'E6E6E6'}

def sheet(title, header, data, widths, first=False):
    ws = wb.active if first else wb.create_sheet()
    ws.title = title
    ws.append(header)
    for c in ws[1]:
        c.font, c.fill, c.alignment = H, FILL, Alignment(vertical='center', wrap_text=True)
    for row in data:
        ws.append(row)
    for i, w in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(i)].width = w
    ws.freeze_panes = 'B2'
    ws.auto_filter.ref = ws.dimensions
    for row in ws.iter_rows(min_row=2):
        for c in row:
            c.alignment = Alignment(vertical='top', wrap_text=True)
    os.makedirs(os.path.join(SEO, 'master'), exist_ok=True)
    with open(os.path.join(SEO, 'master', re.sub(r'\W+', '-', title.lower()).strip('-') + '.csv'), 'w', newline='', encoding='utf-8') as fh:
        w = csv.writer(fh)
        w.writerow(header)
        w.writerows(data)
    return ws

n_q = sum(1 for r in rows if r['Question?'])
readme = [
    ['Noovit SEO master', 'Built by scripts/seo-master.py from every Ahrefs export in docs/seo (screenshots + saved pages) and data/seo-questions.json. Re-run the script after adding data; do not edit numbers by hand.'],
    ['Totals', f'{len(rows)} keywords · {len(csum)} topic clusters · {len(QS)} questions with draft answers · {n_q} question-style keywords'],
    ['Priority tiers', 'P1 act now = KD 0–10 · P2 next = KD 11–25 · P3 build up = KD 26–50 · P4 long game = KD 51+ · LT = no KD yet (use as FAQ or heading) · Skip = off-topic or competitor brand'],
    ['Columns', 'KD keyword difficulty · SV US monthly searches · TP traffic potential (traffic the #1 page gets) · GSV/GTP global · CPC cost per click · CPS clicks per search · SF number of SERP features'],
    ['Rich snippets', 'Featured snippets and AI answers quote pages that answer the question in the first 40–60 words under a heading phrased as the question, with numbers and a source. Each question has that answer drafted. Google shows FAQ rich results only for well-known government/health sites since 2023, but the FAQPage markup still helps AI tools read the page.'],
    ['Rules', 'Structure/function wording only (supports, never treats); every claim sourced; benefit claims carry * to the FDA disclaimer; answers marked "verify" need the source checked before publishing; never put competitor brand names in our titles or ads.'],
    ['Next step', 'Build the new pillar /guides/magnesium-glycinate and add the answers as question headings + FAQ on each target page (see the Questions tab).'],
]
sheet('Read me', ['Item', 'Detail'], readme, [22, 140], first=True)

kh = ['Keyword', 'Cluster', 'Priority', 'KD', 'SV', 'TP', 'GSV', 'GTP', 'CPC', 'CPS', 'SF', 'Intent', 'Question?', 'Parent topic',
      'Target page', 'Supporting pages', 'Page status', 'Action', 'Category', 'Source files']
def n(v):
    x = num(v)
    return '' if x is None else (int(x) if x == int(x) else x)
ws = sheet('Keywords', kh, [[r['Keyword'], r['Cluster'], r['Priority'], n(r.get('KD')), n(r.get('SV')), n(r.get('TP')), n(r.get('GSV')), n(r.get('GTP')),
                             n(r.get('CPC')), n(r.get('CPS')), n(r.get('SF')), r.get('Intent', ''), r['Question?'], r.get('Parent topic', ''),
                             r['Target page'], r['Supporting pages'], r['Page status'], r['Action'], r.get('Category', ''), '; '.join(r['Sources'])] for r in rows],
           [42, 30, 16, 6, 9, 9, 9, 9, 7, 6, 5, 10, 9, 30, 36, 44, 18, 40, 30, 40])
for row in ws.iter_rows(min_row=2):
    f = TIER_FILL.get(str(row[2].value)[:2])
    if f:
        row[2].fill = PatternFill('solid', fgColor=f)

def fmt(n):
    return f'{n / 1000:.1f}K' if n >= 1000 else str(int(n))

sheet('Topic clusters', ['Cluster', 'Pillar page', 'Supporting pages', 'Page status', 'Keywords', 'Total US searches/month', 'Easiest wins (P1, by volume)', 'Questions in cluster'],
      [[c['Cluster'], c['Pillar page'], c['Supporting pages'], c['Page status'], c['n'], fmt(c['sv']),
        '; '.join(f"{r['Keyword']} ({fmt(r['SV_n'])}, KD {int(r['KD_n'])})" for r in sorted(c['easy'], key=lambda r: -r['SV_n'])[:6]),
        '; '.join(q['q'] for q in QS if q['cluster'] == c['Cluster'])] for c in csum],
      [32, 40, 50, 18, 9, 12, 70, 70])

sheet('Questions & answers', ['Question', 'Cluster', 'Searches/month (all wordings)', 'Lowest KD', 'Short answer (40–60 words, snippet/LLM-ready)', 'Words',
                              'Answer format', 'Target page', 'Heading to use (H2/H3)', 'Markup', 'Source', 'Wordings covered (top 12 by volume)', 'Status'],
      [[q['q'], q['cluster'], fmt(q['_sv']), '' if q['_kd'] is None else int(q['_kd']), q['a'], len(q['a'].split()), q['format'], q['page'], q['heading'],
        'FAQPage on the page + answer directly under the heading', q['source'],
        '; '.join(f"{r['Keyword']} ({r.get('SV', '')})" for r in sorted(q['_hits'], key=lambda r: -r['SV_n'])[:12]),
        'Verify source before publishing' if 'verify' in q['source'].lower() else 'Draft: ready to add'] for q in QS],
      [40, 26, 12, 8, 70, 7, 22, 34, 34, 22, 40, 70, 18])

rel = []
for c in csum:
    if c['Cluster'] in ('Out of scope', 'Other'):
        continue
    terms = [r for r in rows if r['Cluster'] == c['Cluster'] and r['Priority'] != 'Skip']
    rel.append([c['Cluster'], c['Pillar page'], '; '.join(r['Keyword'] for r in terms[:40]),
                ENTITIES.get(c['Cluster'], ''),
                '; '.join(sorted({r.get('Parent topic', '') for r in terms if r.get('Parent topic')})[:15])])
sheet('Related terms', ['Cluster', 'Pillar page', 'Variant keywords to work into headings and copy (by volume)', 'Entities and facts to mention (for AI answers)', 'Ahrefs parent topics'],
      rel, [30, 36, 90, 70, 50])

srcs = [[os.path.relpath(s, SEO), sum(1 for r in rows if os.path.relpath(s, SEO) in r['Sources'])] for s in SOURCES if os.path.exists(s)]
sheet('Sources', ['File (docs/seo/…)', 'Keywords taken from it'], srcs, [60, 20])

out = os.path.join(SEO, 'NOOVIT_SEO_MASTER.xlsx')
wb.save(out)
print(f'{out}: {len(rows)} keywords, {len(csum)} clusters, {len(QS)} questions')
for c in csum[:12]:
    print(f"  {c['Cluster']}: {c['n']} kw, {fmt(c['sv'])}/mo, P1 {len(c['easy'])}")
