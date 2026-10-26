import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/admin/auth';
import { loadPosts } from '@/lib/blog';
import { Article } from '@/components/blog/Article';

export default async function PreviewPost({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin('content');
  const { slug } = await params;
  const post = (await loadPosts(true)).find((p) => p.slug === slug);
  if (!post) notFound();
  return (
    <div className="rounded-3xl bg-white">
      <p className="rounded-t-3xl bg-amber-50 px-6 py-2 text-center text-xs font-semibold text-amber-900">
        Preview — {post.status === 'published' ? 'published' : 'draft, not visible to customers'}
      </p>
      <Article post={post} />
    </div>
  );
}
