import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/admin/auth';
import { dbConfigured } from '@/lib/config';
import { loadPosts } from '@/lib/blog';
import { deletePost, savePost } from '@/app/admin/blog-actions';
import { Card, Flash, NotConfigured, PageTitle, btnSm, btnSmOutline, inputCls } from '@/components/admin/ui';

const label = 'mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]';

const HELP = `## Heading
Paragraph with **bold**, *italic* and a [link](/products/magnesium-complex).

- Bullet point
- Another point

> A quote

![Image description](https://…/photo.jpg)`;

export default async function EditPost({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ msg?: string }> }) {
  const me = await requireAdmin('content');
  const { slug } = await params;
  const { msg } = await searchParams;
  const isNew = slug === 'new';
  if (!dbConfigured()) return (<><PageTitle title="Post" /><NotConfigured what="The database" /></>);
  const post = isNew ? null : (await loadPosts(true)).find((p) => p.slug === slug);
  if (!isNew && !post) notFound();

  return (
    <>
      <Link href="/admin/blog" className="mb-2 inline-block text-sm text-[var(--color-blue)]">← All posts</Link>
      <PageTitle title={post?.title ?? 'New post'}>
        {post && (
          <Link href={`/admin/blog/${post.slug}/preview`} target="_blank" className={btnSmOutline}>Preview</Link>
        )}
      </PageTitle>
      <Flash msg={msg} />
      <form action={savePost} className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <input type="hidden" name="is_new" value={isNew ? '1' : '0'} />
        <div className="space-y-6">
          <Card>
            <label className="block">
              <span className={label}>Title</span>
              <input name="title" required defaultValue={post?.title} maxLength={160} className={`${inputCls} w-full text-base`} />
            </label>
            <label className="mt-4 block">
              <span className={label}>URL handle</span>
              {isNew ? (
                <input name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="e.g. magnesium-for-sleep" className={`${inputCls} w-full`} />
              ) : (
                <>
                  <input type="hidden" name="slug" value={post!.slug} />
                  <p className="text-sm text-[var(--color-muted)]">noovit.com/blog/{post!.slug}</p>
                </>
              )}
            </label>
            <label className="mt-4 block">
              <span className={label}>Excerpt</span>
              <textarea name="excerpt" rows={2} defaultValue={post?.excerpt} maxLength={400} placeholder="One or two sentences shown on the blog list and in Google." className={`${inputCls} w-full`} />
            </label>
            <label className="mt-4 block">
              <span className={label}>Article</span>
              <textarea name="body" rows={24} defaultValue={post?.body} placeholder={HELP} className={`${inputCls} w-full font-mono text-sm leading-relaxed`} />
            </label>
            <details className="mt-2 text-xs text-[var(--color-muted)]">
              <summary className="cursor-pointer">Formatting help</summary>
              <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-[var(--color-soft)] p-3">{HELP}</pre>
            </details>
          </Card>
          <Card>
            <h2 className="mb-3 text-lg">Search engine listing</h2>
            <input name="seo_title" defaultValue={post?.seoTitle ?? ''} placeholder="Page title (defaults to the post title)" className={`${inputCls} mb-2 w-full`} />
            <textarea name="seo_description" rows={2} defaultValue={post?.seoDescription ?? ''} placeholder="Meta description (defaults to the excerpt)" className={`${inputCls} w-full`} />
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <label className="block">
              <span className={label}>Status</span>
              <select name="status" defaultValue={post?.status ?? 'draft'} className={`${inputCls} w-full`}>
                <option value="draft">Draft — not public</option>
                <option value="published">Published</option>
              </select>
            </label>
            <label className="mt-3 block">
              <span className={label}>Publish date (optional)</span>
              <input name="published_at" type="datetime-local" defaultValue={post?.publishedAt?.slice(0, 16)} className={`${inputCls} w-full`} />
              <span className="mt-1 block text-xs text-[var(--color-muted)]">Set a future date to schedule. Leave empty to publish now.</span>
            </label>
            <label className="mt-3 block">
              <span className={label}>Author</span>
              <input name="author" defaultValue={post?.author ?? me.name} className={`${inputCls} w-full`} />
            </label>
            <button className={`${btnSm} mt-4 w-full py-3 text-sm`}>{isNew ? 'Create post' : 'Save'}</button>
          </Card>
          <Card>
            <h2 className="mb-3 text-lg">Cover image</h2>
            {post?.coverImage && <img src={post.coverImage} alt="" className="mb-3 aspect-[16/10] w-full rounded-xl object-cover" />}
            <input type="file" name="cover_file" accept="image/jpeg,image/png,image/webp" className="text-sm" />
            {post?.coverImage && (
              <label className="mt-2 flex items-center gap-2 text-sm">
                <input type="checkbox" name="remove_cover" /> Remove cover image
              </label>
            )}
          </Card>
        </div>
      </form>
      {post && (
        <form action={deletePost} className="mt-6">
          <input type="hidden" name="slug" value={post.slug} />
          <button className="text-sm text-red-600 underline">Delete this post</button>
        </form>
      )}
    </>
  );
}
