import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPublishedPosts } from '@/lib/blog';
import { Article } from '@/components/blog/Article';
import { JsonLd } from '@/components/seo/JsonLd';
import { SITE_URL } from '@/lib/site';

const find = async (slug: string) => (await getPublishedPosts()).find((p) => p.slug === slug);

export async function generateStaticParams() {
  return (await getPublishedPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await find((await params).slug);
  if (!post) return {};
  const title = post.seoTitle || `${post.title} — Noovit`;
  const description = post.seoDescription || post.excerpt;
  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: 'article', title, description, publishedTime: post.publishedAt ?? undefined, ...(post.coverImage ? { images: [{ url: post.coverImage }] } : {}) },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const post = await find((await params).slug);
  if (!post) notFound();
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          author: { '@type': 'Organization', name: post.author },
          publisher: { '@type': 'Organization', name: 'Noovit', url: SITE_URL },
          mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
          ...(post.coverImage ? { image: [post.coverImage] } : {}),
        }}
      />
      <Article post={post} />
      <div className="container max-w-3xl px-6 pb-16">
        <Link href="/blog" className="text-sm font-bold text-[var(--color-blue)]">← All articles</Link>
      </div>
    </>
  );
}
