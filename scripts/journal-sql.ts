// Turns the Journal posts in content/journal/*.md into one SQL file. A post with `publishAt` in its front matter is
// SCHEDULED (status published, published_at in the future: the blog and sitemap pick it up within an hour of that time);
// without it, it loads as a draft. Post text already in the database is never overwritten, so edits made in Admin are
// kept; an existing unscheduled draft only gets its schedule applied. SEO title/description always follow the repo files.
// Hold a post: Admin → Blog → set it back to Draft (don't re-run the SQL afterwards, or it will be rescheduled).
// Usage: npx tsx scripts/journal-sql.ts <output.sql>
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { SEED_PRODUCTS } from '@/data/products';

const DIR = 'content/journal';
const out = process.argv[2];
if (!out) throw new Error('Usage: npx tsx scripts/journal-sql.ts <output.sql>');

export interface JournalPost { slug: string; title: string; excerpt: string; seoTitle: string; seoDescription: string; publishAt: string | null; body: string }

export function parsePost(text: string): JournalPost {
  const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error('Missing front matter');
  const meta: Record<string, string> = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"(.*)"$/, '$1');
  }
  for (const k of ['slug', 'title', 'excerpt', 'seoTitle', 'seoDescription']) if (!meta[k]) throw new Error(`Missing ${k}`);
  if (meta.publishAt && Number.isNaN(Date.parse(meta.publishAt))) throw new Error(`Bad publishAt in ${meta.slug}`);
  return { slug: meta.slug, title: meta.title, excerpt: meta.excerpt, seoTitle: meta.seoTitle, seoDescription: meta.seoDescription, publishAt: meta.publishAt || null, body: m[2].trim() + '\n' };
}

// Dollar quoting keeps apostrophes and Markdown intact; the tag must not occur in the text.
const q = (s: string) => {
  if (s.includes('$jr$')) throw new Error('Text contains the quote tag $jr$');
  return `$jr$${s}$jr$`;
};

const posts = readdirSync(DIR).filter((f) => f.endsWith('.md')).sort().map((f) => parsePost(readFileSync(`${DIR}/${f}`, 'utf8')));

// SEO checks (fail the run so problems never reach the database): title and description lengths Google displays,
// one H1 only (the post title; the body starts at ##), slug style, and internal links that exist and are live by the
// post's own publish date. Product links to items hidden in the seed catalog are warnings: check they're active live.
const errors: string[] = [], warnings: string[] = [];
const GUIDE_SLUGS = new Set([...readFileSync('lib/guides.ts', 'utf8').matchAll(/^\s{4}slug: '([a-z0-9-]+)'/gm)].map((m) => m[1]));
const productStatus = (slug: string) => SEED_PRODUCTS.find((x) => x.slug === slug)?.status;
const when = new Map(posts.map((p) => [p.slug, p.publishAt ? Date.parse(p.publishAt) : Infinity]));
for (const p of posts) {
  const e = (m: string) => errors.push(`${p.slug}: ${m}`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug) || p.slug.length > 60) e('slug must be short, lowercase, hyphenated');
  if (p.seoTitle.length > 60) e(`SEO title is ${p.seoTitle.length} chars (max 60)`);
  if (p.seoDescription.length < 120 || p.seoDescription.length > 160) e(`SEO description is ${p.seoDescription.length} chars (120-160)`);
  if (p.excerpt.length > 240) e(`excerpt is ${p.excerpt.length} chars (max 240)`);
  if (/^# /m.test(p.body)) e('body has an H1; the post title is the only H1, start sections at ##');
  if (!/\]\(\/guides\/[a-z0-9-]+\)/.test(p.body)) e('no link to an ingredient guide');
  if (!/^## Sources/m.test(p.body)) e('no Sources section');
  for (const [, kind, slug] of p.body.matchAll(/\]\(\/(blog|guides|products)\/([a-z0-9-]+)\)/g)) {
    if (kind === 'guides' && !GUIDE_SLUGS.has(slug)) e(`links to missing guide /guides/${slug}`);
    if (kind === 'blog' && !(when.get(slug)! < (when.get(p.slug) ?? Infinity))) e(`links to /blog/${slug}, which isn't live before this post`);
    if (kind === 'products') {
      const st = productStatus(slug);
      if (!st) e(`links to unknown product /products/${slug}`);
      else if (st === 'hidden') warnings.push(`${p.slug}: links to /products/${slug}, hidden in the seed catalog; make sure it's active in Admin before ${p.publishAt?.slice(0, 10) ?? 'publishing'}`);
    }
  }
}
for (const w of warnings) console.warn(`WARN ${w}`);
if (errors.length) { console.error(errors.map((x) => `SEO ${x}`).join('\n')); process.exit(1); }
const sql = [
  `-- Journal posts generated from content/journal/*.md by scripts/journal-sql.ts (${posts.length} posts).`,
  '-- Posts with a date are SCHEDULED: they go live on their own at that time (within an hour). Others load as drafts.',
  '-- Existing post text is never overwritten; an existing unscheduled draft only gets its schedule.',
  '-- SEO title and description always follow content/journal (edit them there, not in Admin).',
  '-- To hold a post: Admin → Blog → set it to Draft. The medical reviewer should read each post before its date.',
  ...posts.map((p) => {
    const status = p.publishAt ? 'published' : 'draft';
    const at = p.publishAt ? `'${new Date(p.publishAt).toISOString()}'` : 'null';
    return `-- ${p.publishAt ? new Date(p.publishAt).toUTCString() : 'draft'}\ninsert into posts (slug, title, excerpt, body, author, status, published_at, seo_title, seo_description)\nvalues (${q(p.slug)}, ${q(p.title)}, ${q(p.excerpt)}, ${q(p.body)}, 'Noovit', '${status}', ${at}, ${q(p.seoTitle)}, ${q(p.seoDescription)})\non conflict (slug) do update set\n  status = case when posts.status = 'draft' and posts.published_at is null and excluded.published_at is not null then excluded.status else posts.status end,\n  published_at = case when posts.status = 'draft' and posts.published_at is null and excluded.published_at is not null then excluded.published_at else posts.published_at end,\n  seo_title = excluded.seo_title, seo_description = excluded.seo_description;`;
  }),
].join('\n\n') + '\n';
writeFileSync(out, sql);
console.log(`${out}: ${posts.map((p) => p.slug).join(', ')}`);
