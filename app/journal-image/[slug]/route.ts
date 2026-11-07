import { getPublishedPosts } from '@/lib/blog';
import { shareCardPng } from '@/lib/share-card';

// 1200 × 630 social image for a Journal post (Open Graph / X cards), used when the post has no cover image.
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const post = (await getPublishedPosts()).find((p) => p.slug === slug);
  if (!post) return new Response('Not found', { status: 404 });
  const png = shareCardPng('NOOVIT JOURNAL', post.title, 'Sources cited · noovit.com/blog');
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400, s-maxage=604800' } });
}
