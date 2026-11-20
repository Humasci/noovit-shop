"""Extract Ahrefs Keywords Explorer tables from pages saved with "Webpage, Complete".
Usage: python3 -I scripts/ahrefs-extract.py name=path/to/page.htm [name=...]
Writes docs/seo/ahrefs/<name>.md per page, then rebuilds docs/seo/ahrefs/keywords-saved-pages.csv from every report file.
A ~59 KB file is the empty app shell ("HTML only" save): it is reported and skipped."""
import sys, re, html, csv, glob, os

OUT = 'docs/seo/ahrefs'
COLS = ['Keyword', 'Intents', 'Category', 'KD', 'SV', 'GSV', 'TP', 'GTP', 'CPC', 'CPS', 'Parent Topic', 'SF']

def num(v):
    m = re.fullmatch(r'([\d.]+)([KM]?)', (v or '').replace(',', '').replace('$', '').strip())
    return float(m.group(1)) * {'': 1, 'K': 1e3, 'M': 1e6}[m.group(2)] if m else 0

def extract(path):
    s = open(path, encoding='utf-8', errors='ignore').read()
    if '<table' not in s or '</table>' not in s:
        return None, None  # empty shell, or saved before the table finished loading
    text = html.unescape(re.sub(r'<[^>]+>', '\n', re.sub(r'<script.*?</script>|<style.*?</style>', '', s, flags=re.S)))
    total = next((l.strip() for l in text.split('\n') if re.fullmatch(r'[\d,]+ keywords', l.strip())), '')
    tb = s[s.index('<table'):s.index('</table>')]
    head = [' '.join(html.unescape(re.sub(r'<[^>]+>', ' ', h)).split()) for h in re.findall(r'<th[^>]*>(.*?)</th>', tb, flags=re.S)]
    if head.count('Keyword') > 1:
        head = head[:head.index('Keyword', head.index('Keyword') + 1)]
    rows = []
    for tr in re.findall(r'<tr[^>]*>(.*?)</tr>', tb, flags=re.S):
        tds = re.findall(r'<td[^>]*>(.*?)</td>', tr, flags=re.S)
        if len(tds) < len(head):
            continue
        cells = []
        for td in tds:
            td = re.sub(r'<svg.*?</svg>', '', td, flags=re.S)
            cells.append('; '.join(p for p in (html.unescape(x).strip() for x in re.split(r'<[^>]+>', td)) if p and p != '…'))
        r = {h: cells[k + 1] for k, h in enumerate(head) if h and k + 1 < len(cells)}  # rows carry one extra leading cell
        if r.get('Keyword'):
            rows.append(r)
    return total, rows

for arg in sys.argv[1:]:
    name, path = arg.split('=', 1)
    total, rows = extract(path)
    if not rows:
        print(f'EMPTY or not loaded (no keyword rows, {os.path.getsize(path) // 1024} KB): {name}; re-save once the table shows')
        continue
    lines = [f'# Ahrefs report: {name} (US, saved page, 20 Nov 2026)',
             f'Extracted from the saved page source, exact values. Report total: {total}; this page: {len(rows)} rows.',
             'SF = number of SERP features on the results page.', '',
             '| ' + ' | '.join(COLS) + ' |', '|' + '---|' * len(COLS)]
    lines += ['| ' + ' | '.join((r.get(c) or '–').replace('|', ';') for c in COLS) + ' |' for r in rows]
    open(f'{OUT}/{name}.md', 'w').write('\n'.join(lines) + '\n')
    print(f'{name}: {len(rows)} rows of {total}')

# Rebuild the combined CSV from every report file (highest-volume record wins; reports listed).
best = {}
for f in sorted(glob.glob(f'{OUT}/*.md')):
    rep = os.path.basename(f)[:-3]
    for line in open(f):
        if not line.startswith('| ') or line.startswith('| Keyword'):
            continue
        cells = [c.strip() for c in line.strip().strip('|').split(' | ')]
        if len(cells) != len(COLS):
            continue
        r = dict(zip(COLS, cells))
        k = r['Keyword']
        if k in best:
            best[k]['Report'] += '' if rep in best[k]['Report'] else f', {rep}'
            if num(r['SV']) > num(best[k]['SV']):
                best[k] = {**r, 'Report': best[k]['Report']}
        else:
            best[k] = {**r, 'Report': rep}
rows = sorted(best.values(), key=lambda r: -num(r['SV']))
with open(f'{OUT}/keywords-saved-pages.csv', 'w', newline='') as fh:
    w = csv.DictWriter(fh, COLS + ['Report'])
    w.writeheader()
    w.writerows({k: ('' if v == '–' else v) for k, v in r.items()} for r in rows)
print(len(rows), 'unique keywords in keywords-saved-pages.csv')
