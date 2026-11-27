// llms.txt (20 Nov): a plain-text index of our evidence pages for AI crawlers and assistants (llmstxt.org convention).
// Lists only public, indexable pages; pre-launch it returns the short notice so nothing is advertised early.
import { GUIDES } from '@/lib/guides';
import { SITE_URL } from '@/lib/site';
import { siteLive } from '@/lib/launch';
import { PUBLIC_EARLY_GUIDES } from '@/lib/public-early';
import { getStoreProducts } from '@/lib/catalog/server';
import { getPublishedPosts } from '@/lib/blog';
import { TEST_KITS } from '@/lib/tests';
import { productPath } from '@/lib/urls';

export const revalidate = 3600;

export async function GET() {
  const head = `# Noovit\n\n> Evidence-led US wellness brand (supplements, at-home health tests coming soon): researched ingredients at clear doses, printed on the front of every bottle. Our ingredient guides grade the evidence (Moderate, Limited, Early, Insufficient), include null results and cite every source.\n`;
  if (!siteLive()) {
    // Pre-launch: only the guides that are public early.
    const early = GUIDES.filter((g) => PUBLIC_EARLY_GUIDES.includes(g.slug)).map((g) => `- [${g.metaTitle}](${SITE_URL}/guides/${g.slug}): ${g.metaDescription}`);
    return new Response([head, '## Ingredient guides', ...early, '', 'The shop opens soon.'].join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
  const [products, posts] = await Promise.all([getStoreProducts(), getPublishedPosts().catch(() => [])]);
  const lines = [
    head,
    '## Ingredient guides',
    ...GUIDES.map((g) => `- [${g.metaTitle}](${SITE_URL}/guides/${g.slug}): ${g.metaDescription}`),
    '',
    '## Journal (evidence explainers)',
    ...posts.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug})${p.excerpt ? `: ${p.excerpt}` : ''}`),
    '',
    '## Products',
    ...products.filter((p) => p.status === 'active').map((p) => `- [${p.name}](${SITE_URL}${productPath(p.slug)}): ${p.description}`),
    '',
    '## At-home tests (coming soon)',
    ...TEST_KITS.map((k) => `- [${k.name}](${SITE_URL}/at-home-tests/${k.slug}): ${k.short}`),
    '',
    '## Policies',
    `- [Delivery & returns](${SITE_URL}/policies/delivery-returns): free US shipping, 90-day first-bottle guarantee (refund on the first bottle of any product, opened or not)`,
    `- [FAQ](${SITE_URL}/faq)`,
    '',
    'These statements have not been evaluated by the Food and Drug Administration. Our products are not intended to diagnose, treat, cure, or prevent any disease.',
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
