import Link from 'next/link';
import type { Metadata } from 'next';
import { getPublishedPosts } from '@/lib/blog';
import { postDate } from '@/components/blog/Article';

export async function generateMetadata(): Promise<Metadata> {
  const posts = await getPublishedPosts();
  return {
    title: 'Journal — Supplement & Wellness Guides | Noovit',
    description: 'Science-backed guides on supplements, sleep, gut health, nutrition and pet wellness from the Noovit team.',
    alternates: { canonical: '/blog' },
    // An empty journal is thin content: keep it out of search until the first article is published.
    ...(posts.length ? {} : { robots: { index: false } }),
  };
}

export default async function BlogIndex() {
  const posts = await getPublishedPosts();
  return (
    <>
      <section className="bg-[var(--color-soft)] py-16 text-center">
        <div className="container px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">Noovit Journal</p>
          <h1 className="mt-3 text-4xl md:text-5xl">Guides for feeling your best</h1>
          <p className="mt-3 text-[var(--color-muted)]">Practical, evidence-based reads on supplements, sleep, gut health and more.</p>
        </div>
      </section>
      <section className="section">
        <div className="container px-6">
          {posts.length === 0 ? (
            <p className="text-center text-[var(--color-muted)]">New articles are on the way.</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="group">
                  <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-[var(--color-soft)]">
                    {p.coverImage && <img src={p.coverImage} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />}
                  </div>
                  <p className="mt-4 text-xs text-[var(--color-muted)]">{postDate(p.publishedAt)}</p>
                  <h2 className="mt-1 text-xl group-hover:text-[var(--color-accent)]">{p.title}</h2>
                  {p.excerpt && <p className="mt-2 text-sm text-[var(--color-muted)]">{p.excerpt}</p>}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
