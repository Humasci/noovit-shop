// Turns the Journal posts in content/journal/*.md into one SQL file that loads them as DRAFTS (Admin → Blog → review
// → publish). Existing posts with the same slug are left alone, so edits made in Admin are never overwritten.
// Usage: npx tsx scripts/journal-sql.ts <output.sql>
import { readdirSync, readFileSync, writeFileSync } from 'fs';

const DIR = 'content/journal';
const out = process.argv[2];
if (!out) throw new Error('Usage: npx tsx scripts/journal-sql.ts <output.sql>');

export interface JournalPost { slug: string; title: string; excerpt: string; seoTitle: string; seoDescription: string; body: string }

export function parsePost(text: string): JournalPost {
  const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error('Missing front matter');
  const meta: Record<string, string> = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"(.*)"$/, '$1');
  }
  for (const k of ['slug', 'title', 'excerpt', 'seoTitle', 'seoDescription']) if (!meta[k]) throw new Error(`Missing ${k}`);
  return { slug: meta.slug, title: meta.title, excerpt: meta.excerpt, seoTitle: meta.seoTitle, seoDescription: meta.seoDescription, body: m[2].trim() + '\n' };
}

// Dollar quoting keeps apostrophes and Markdown intact; the tag must not occur in the text.
const q = (s: string) => {
  if (s.includes('$jr$')) throw new Error('Text contains the quote tag $jr$');
  return `$jr$${s}$jr$`;
};

const posts = readdirSync(DIR).filter((f) => f.endsWith('.md')).sort().map((f) => parsePost(readFileSync(`${DIR}/${f}`, 'utf8')));
const sql = [
  `-- Journal drafts generated from content/journal/*.md by scripts/journal-sql.ts (${posts.length} posts).`,
  '-- Loads each post as a DRAFT. Posts that already exist (same slug) are not changed. Safe to re-run.',
  '-- Then: Admin → Blog → open each draft, have the medical reviewer check it, set a publish date and publish.',
  ...posts.map((p) =>
    `insert into posts (slug, title, excerpt, body, author, status, seo_title, seo_description)\nvalues (${q(p.slug)}, ${q(p.title)}, ${q(p.excerpt)}, ${q(p.body)}, 'Noovit', 'draft', ${q(p.seoTitle)}, ${q(p.seoDescription)})\non conflict (slug) do nothing;`),
].join('\n\n') + '\n';
writeFileSync(out, sql);
console.log(`${out}: ${posts.map((p) => p.slug).join(', ')}`);
