// Snapshots the outside pages listed in data/advisor-sources.json into data/advisor-snapshots.json (plain text,
// split into ~900-character passages) so the AI advisor can quote them without fetching anything at answer time.
// Usage: npm run advisor:snapshot   (then commit data/advisor-snapshots.json)
import { readFileSync, writeFileSync } from 'fs';

interface Source { url: string; title: string; publisher?: string }
const { sources } = JSON.parse(readFileSync('data/advisor-sources.json', 'utf8')) as { sources: Source[] };

const decode = (s: string) => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&rsquo;|&lsquo;/g, "'").replace(/&ldquo;|&rdquo;/g, '"').replace(/&mdash;/g, '—').replace(/&ndash;/g, '–').replace(/&#\d+;/g, ' ');
function extract(html: string): string[] {
  const clean = html.replace(/<(script|style|noscript|svg|header|footer|nav|form|aside)[\s\S]*?<\/\1>/gi, ' ');
  const main = clean.match(/<main[\s\S]*?<\/main>/i) ?? clean.match(/<article[\s\S]*?<\/article>/i);
  const fromMain = main ? split(main[0]) : [];
  // Some sites (e.g. NIH ODS) wrap little in <main>: fall back to the whole page.
  return fromMain.length >= 3 ? fromMain : split(clean);
}
function split(h: string) {
  const blocks = h.split(/<\/(p|li|h[1-6]|tr|div)>/i).map((b) => decode(b.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()).filter((b) => b.length > 40);
  const chunks: string[] = [];
  let cur = '';
  for (const b of blocks) {
    if ((cur + ' ' + b).length > 900 && cur) { chunks.push(cur); cur = ''; }
    cur = cur ? `${cur} ${b}` : b;
  }
  if (cur) chunks.push(cur);
  return chunks.slice(0, 60);
}

(async () => {
  const out = [];
  for (const s of sources) {
    try {
      const res = await fetch(s.url, { headers: { 'User-Agent': 'NoovitAdvisorSnapshot/1.0 (+https://noovit.com)' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      if (/security service to protect itself|Attention Required|cf-browser-verification/i.test(html)) throw new Error('blocked by the site (bot protection); try from your own computer');
      const chunks = extract(html);
      if (chunks.length < 2) throw new Error('no readable text found');
      out.push({ ...s, chunks });
      console.log(`✓ ${s.url} (${chunks.length} passages)`);
    } catch (err) {
      console.log(`✗ ${s.url}: ${(err as Error).message}`);
    }
  }
  writeFileSync('data/advisor-snapshots.json', JSON.stringify({ fetchedAt: new Date().toISOString(), sources: out }, null, 1));
})();
