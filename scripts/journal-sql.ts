// Turns the Journal posts in content/journal/*.md into one SQL file. A post with `publishAt` in its front matter is
// SCHEDULED (status published, published_at in the future: the blog and sitemap pick it up within an hour of that time);
// without it, it loads as a draft. Post text already in the database is never overwritten, so edits made in Admin are
// kept; an existing unscheduled draft only gets its schedule applied.
// Hold a post: Admin → Blog → set it back to Draft (don't re-run the SQL afterwards, or it will be rescheduled).
// Usage: npx tsx scripts/journal-sql.ts <output.sql>
import { readdirSync, readFileSync, writeFileSync } from 'fs';

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
const sql = [
  `-- Journal posts generated from content/journal/*.md by scripts/journal-sql.ts (${posts.length} posts).`,
  '-- Posts with a date are SCHEDULED: they go live on their own at that time (within an hour). Others load as drafts.',
  '-- Existing post text is never overwritten; an existing unscheduled draft only gets its schedule.',
  '-- To hold a post: Admin → Blog → set it to Draft. The medical reviewer should read each post before its date.',
  ...posts.map((p) => {
    const status = p.publishAt ? 'published' : 'draft';
    const at = p.publishAt ? `'${new Date(p.publishAt).toISOString()}'` : 'null';
    return `-- ${p.publishAt ? new Date(p.publishAt).toUTCString() : 'draft'}\ninsert into posts (slug, title, excerpt, body, author, status, published_at, seo_title, seo_description)\nvalues (${q(p.slug)}, ${q(p.title)}, ${q(p.excerpt)}, ${q(p.body)}, 'Noovit', '${status}', ${at}, ${q(p.seoTitle)}, ${q(p.seoDescription)})\non conflict (slug) do update set status = excluded.status, published_at = excluded.published_at\n  where posts.status = 'draft' and posts.published_at is null and excluded.published_at is not null;`;
  }),
].join('\n\n') + '\n';
writeFileSync(out, sql);
console.log(`${out}: ${posts.map((p) => p.slug).join(', ')}`);
