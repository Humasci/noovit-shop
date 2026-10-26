'use server';

import { redirect } from 'next/navigation';
import { revalidatePath, updateTag } from 'next/cache';
import { requireAdmin } from '@/lib/admin/auth';
import { db } from '@/lib/db/server';
import { BLOG_TAG } from '@/lib/blog';
import { deleteImage, uploadImage } from '@/lib/storage';

const str = (f: FormData, k: string, max: number) => String(f.get(k) ?? '').trim().slice(0, max);
const back = (path: string, msg: string): never => redirect(`${path}?msg=${encodeURIComponent(msg)}`);

export async function savePost(f: FormData) {
  const me = await requireAdmin('content');
  const isNew = f.get('is_new') === '1';
  const slug = str(f, 'slug', 100).toLowerCase();
  const path = isNew ? '/admin/blog/new' : `/admin/blog/${slug}`;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) back(path, 'URL handle may only use lowercase letters, numbers and single hyphens.');
  const title = str(f, 'title', 160);
  if (!title) back(path, 'Title is required.');
  const status = f.get('status') === 'published' ? 'published' : 'draft';
  const publishDate = str(f, 'published_at', 30);

  const { data: existing } = await db().from('posts').select('published_at, cover_image').eq('slug', slug).maybeSingle();
  if (isNew && existing) back(path, 'A post with that URL handle already exists.');
  if (!isNew && !existing) back('/admin/blog', 'Post not found.');

  const publishedAt =
    status === 'published' ? (publishDate ? new Date(publishDate).toISOString() : existing?.published_at ?? new Date().toISOString()) : existing?.published_at ?? null;

  let cover = existing?.cover_image ?? null;
  const file = f.get('cover_file');
  if (file instanceof File && file.size > 0) {
    const { url, error } = await uploadImage(`blog/${slug}`, file);
    if (error) back(path, error);
    if (cover) await deleteImage(cover);
    cover = url!;
  }
  if (f.get('remove_cover') === 'on' && cover) {
    await deleteImage(cover);
    cover = null;
  }

  const row = {
    slug,
    title,
    excerpt: str(f, 'excerpt', 400),
    body: str(f, 'body', 100_000),
    author: str(f, 'author', 80) || me.name,
    status,
    published_at: publishedAt,
    cover_image: cover,
    seo_title: str(f, 'seo_title', 120) || null,
    seo_description: str(f, 'seo_description', 320) || null,
  };
  const { error } = isNew ? await db().from('posts').insert(row) : await db().from('posts').update(row).eq('slug', slug);
  if (error) back(path, error.message);
  updateTag(BLOG_TAG);
  revalidatePath('/admin/blog', 'layout');
  back(`/admin/blog/${slug}`, status === 'published' ? 'Post published.' : 'Draft saved.');
}

export async function deletePost(f: FormData) {
  await requireAdmin('content');
  const slug = String(f.get('slug') ?? '');
  const { data } = await db().from('posts').delete().eq('slug', slug).select('cover_image').maybeSingle();
  if (data?.cover_image) await deleteImage(data.cover_image);
  updateTag(BLOG_TAG);
  back('/admin/blog', 'Post deleted.');
}
