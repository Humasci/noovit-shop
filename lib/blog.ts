import 'server-only';
import { unstable_cache } from 'next/cache';
import { db } from '@/lib/db/server';
import { dbConfigured } from '@/lib/config';

export const BLOG_TAG = 'blog';

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string | null;
  author: string;
  status: 'draft' | 'published';
  publishedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  updatedAt: string;
}

interface PostRow {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover_image: string | null;
  author: string;
  status: 'draft' | 'published';
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  updated_at: string;
}

export const toPost = (r: PostRow): Post => ({
  slug: r.slug,
  title: r.title,
  excerpt: r.excerpt,
  body: r.body,
  coverImage: r.cover_image,
  author: r.author,
  status: r.status,
  publishedAt: r.published_at,
  seoTitle: r.seo_title,
  seoDescription: r.seo_description,
  updatedAt: r.updated_at,
});

export async function loadPosts(includeDrafts = false): Promise<Post[]> {
  if (!dbConfigured()) return [];
  let q = db().from('posts').select('*').order('published_at', { ascending: false, nullsFirst: true });
  if (!includeDrafts) q = q.eq('status', 'published').lte('published_at', new Date().toISOString());
  const { data, error } = await q;
  if (error) throw error;
  return (data as PostRow[]).map(toPost);
}

// Published posts only; revalidated hourly so scheduled posts appear on time.
export const getPublishedPosts = unstable_cache(() => loadPosts(false), ['posts-v1'], { tags: [BLOG_TAG], revalidate: 3600 });
