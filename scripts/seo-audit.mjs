// SEO audit: crawls every URL in the sitemap and checks title (25–60 chars), description (70–160), canonical, Open Graph,
// Twitter card, one H1, JSON-LD and image alt text; flags duplicate titles/descriptions.
// Usage: build with SITE_LIVE=true, run next start -p 3100 with SITE_LIVE=true, then node scripts/seo-audit.mjs [baseUrl]
const B = process.argv[2] || 'http://localhost:3100';
const sm = await (await fetch(B + '/sitemap.xml')).text();
const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replace(/^https?:\/\/[^/]+/, ''));
const extra = ['/cart', '/account', '/products/creatine-for-women', '/pets', '/blog', '/mens-health', '/products/does-not-exist'];
const rows = []; const titles = new Map(); const descs = new Map();
const dec = s => s?.replace(/&amp;/g,'&').replace(/&#x27;|&#39;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
for (const u of [...new Set([...urls, ...extra])]) {
  const r = await fetch(B + u, { redirect: 'manual' });
  const h = await r.text();
  const head = h.split('</head>')[0];
  const g = re => dec(head.match(re)?.[1]);
  const title = g(/<title>([^<]*)<\/title>/);
  const desc = g(/<meta name="description" content="([^"]*)"/);
  const canon = g(/<link rel="canonical" href="([^"]*)"/);
  const robots = g(/<meta name="robots" content="([^"]*)"/) || r.headers.get('x-robots-tag');
  const ogi = g(/<meta property="og:image" content="([^"]*)"/);
  const ogt = g(/<meta property="og:title" content="([^"]*)"/);
  const tw = g(/<meta name="twitter:card" content="([^"]*)"/);
  const h1s = (h.match(/<h1[\s>]/g) || []).length;
  const ld = [...h.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m => { try { const j = JSON.parse(m[1]); const t = x => Array.isArray(x) ? x.flatMap(t) : x['@graph'] ? t(x['@graph']) : [x['@type']]; return t(j).join('+'); } catch { return 'BADJSON'; } });
  const imgsNoAlt = [...h.matchAll(/<img\b[^>]*>/g)].filter(m => !/\balt="[^"]/.test(m[0]) && !/aria-hidden="true"|alt=""/.test(m[0])).length;
  const issues = [];
  if (r.status !== 200) issues.push('status ' + r.status);
  if (!title) issues.push('no title'); else if (title.length > 60) issues.push(`title ${title.length}`); else if (title.length < 25) issues.push(`title short ${title.length}`);
  if (!desc) issues.push('no desc'); else if (desc.length > 160) issues.push(`desc ${desc.length}`); else if (desc.length < 70) issues.push(`desc short ${desc.length}`);
  if (r.status === 200 && !robots?.includes('noindex')) {
    if (!canon) issues.push('no canonical'); else if (canon.replace(/^https?:\/\/[^/]+/, '') !== (u === '/' ? '' : u) && canon.replace(/^https?:\/\/[^/]+/, '') !== u) issues.push('canonical→' + canon);
    if (!ogi) issues.push('no og:image');
    if (!ogt) issues.push('no og:title');
    if (!tw) issues.push('no twitter');
    if (h1s !== 1) issues.push(`h1×${h1s}`);
    if (!ld.length) issues.push('no JSON-LD');
  }
  if (imgsNoAlt) issues.push(`img no alt ×${imgsNoAlt}`);
  if (title) titles.set(title, [...(titles.get(title) || []), u]);
  if (desc) descs.set(desc, [...(descs.get(desc) || []), u]);
  rows.push({ u, title, robots, ld: ld.join(','), issues });
}
for (const r of rows) console.log(`${r.issues.length ? '✗' : '✓'} ${r.u} | ${r.title} | ${r.robots || ''} | LD:${r.ld} ${r.issues.length ? '| ' + r.issues.join('; ') : ''}`);
for (const [t, us] of titles) if (us.length > 1) console.log('DUP TITLE', t, us.join(' '));
for (const [t, us] of descs) if (us.length > 1) console.log('DUP DESC', us.join(' '));
console.log('pages', rows.length);
