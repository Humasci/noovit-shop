import { renderMarkdown } from '@/lib/markdown';
import { Post } from '@/lib/blog';

export const postDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unpublished';

export function Article({ post }: { post: Post }) {
  return (
    <article className="container max-w-3xl px-6 py-12">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-blue)]">Noovit Journal</p>
      <h1 className="mt-3 text-balance text-4xl md:text-5xl">{post.title}</h1>
      <p className="mt-4 text-sm text-[var(--color-muted)]">
        {post.author} · {postDate(post.publishedAt)}
      </p>
      {post.coverImage && <img src={post.coverImage} alt="" className="mt-8 aspect-[16/9] w-full rounded-3xl object-cover" />}
      {/* Markdown is rendered with raw HTML and unsafe URLs stripped (lib/markdown.ts). */}
      <div className="prose-noovit mt-10" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }} />
      <p className="mt-12 border-t border-[var(--color-line)] pt-6 text-xs text-[var(--color-muted)]">
        This article is for general information only and isn&apos;t medical advice. Talk to your healthcare provider before starting a supplement.
      </p>
    </article>
  );
}
