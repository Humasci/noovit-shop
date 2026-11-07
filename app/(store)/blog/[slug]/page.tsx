import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPublishedPosts, type Post } from '@/lib/blog';
import { Article } from '@/components/blog/Article';
import { JsonLd } from '@/components/seo/JsonLd';
import { SITE_URL } from '@/lib/site';

const find = async (slug: string) => (await getPublishedPosts()).find((p) => p.slug === slug);
const shareImage = (post: Post) => post.coverImage || `${SITE_URL}/journal-image/${post.slug}`;

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
    // Every post gets a share image: its cover if it has one, else a generated title card (/journal-image/<slug>).
    openGraph: { type: 'article', title, description, url: `/blog/${post.slug}`, publishedTime: post.publishedAt ?? undefined, modifiedTime: post.updatedAt, images: [{ url: shareImage(post), width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description, images: [shareImage(post)] },
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
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Journal', item: `${SITE_URL}/blog` },
            { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
          ],
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          author: { '@type': 'Organization', name: post.author },
          publisher: { '@type': 'Organization', name: 'Noovit', url: SITE_URL, logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.svg` } },
          mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
          image: [shareImage(post)],
        }}
      />
      <Article post={post} />
      <div className="container max-w-3xl px-6 pb-16">
        <Link href="/blog" className="text-sm font-bold text-[var(--color-accent)]">← All articles</Link>
      </div>
    </>
  );
}
