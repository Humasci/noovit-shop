'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { requireAdmin } from '@/lib/admin/auth';
import { db } from '@/lib/db/server';
import { CATALOG_TAG, loadCatalog } from '@/lib/catalog/server';
import { deleteImage, uploadImage } from '@/lib/storage';

export interface CollectionInput {
  slug: string;
  title: string;
  description: string;
  status: 'active' | 'hidden';
  productSlugs: string[];
  seoTitle: string;
  seoDescription: string;
}

export interface CollectionResult {
  ok: boolean;
  message: string;
  slug?: string;
  image?: string | null;
}

const text = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

function refresh() {
  updateTag(CATALOG_TAG);
  revalidatePath('/admin/collections', 'layout');
}

export async function saveCollection(input: CollectionInput, isNew: boolean): Promise<CollectionResult> {
  await requireAdmin('products');
  const slug = text(input.slug, 80).toLowerCase();
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return { ok: false, message: 'URL handle may only use lowercase letters, numbers and single hyphens.' };
  const title = text(input.title, 100);
  if (!title) return { ok: false, message: 'Title is required.' };

  const known = new Set((await loadCatalog()).map((p) => p.slug));
  const productSlugs = [...new Set((Array.isArray(input.productSlugs) ? input.productSlugs : []).filter((s) => typeof s === 'string' && known.has(s)))].slice(0, 100);

  const row = {
    title,
    description: text(input.description, 2000),
    status: input.status === 'active' ? 'active' : 'hidden',
    product_slugs: productSlugs,
    seo_title: text(input.seoTitle, 120) || null,
    seo_description: text(input.seoDescription, 320) || null,
  };

  if (isNew) {
    const { error } = await db().from('collections').insert({ slug, ...row });
    if (error) return { ok: false, message: error.code === '23505' ? 'A collection with that URL handle already exists.' : error.message };
  } else {
    const { data, error } = await db().from('collections').update(row).eq('slug', slug).select('slug').maybeSingle();
    if (error) return { ok: false, message: error.message };
    if (!data) return { ok: false, message: 'Collection not found.' };
  }
  refresh();
  return { ok: true, slug, message: isNew ? 'Collection created.' : 'Saved.' };
}

export async function setCollectionImage(slug: string, form: FormData): Promise<CollectionResult> {
  await requireAdmin('products');
  const { data: current } = await db().from('collections').select('image').eq('slug', slug).maybeSingle();
  if (!current) return { ok: false, message: 'Save the collection first.' };
  const { url, error } = await uploadImage(`collections/${slug}`, form.get('file'));
  if (error) return { ok: false, message: error };
  if (current.image) await deleteImage(current.image);
  await db().from('collections').update({ image: url }).eq('slug', slug);
  refresh();
  return { ok: true, message: 'Image updated.', image: url };
}

export async function removeCollectionImage(slug: string): Promise<CollectionResult> {
  await requireAdmin('products');
  const { data: current } = await db().from('collections').select('image').eq('slug', slug).maybeSingle();
  if (current?.image) await deleteImage(current.image);
  await db().from('collections').update({ image: null }).eq('slug', slug);
  refresh();
  return { ok: true, message: 'Image removed.', image: null };
}

export async function deleteCollection(slug: string): Promise<CollectionResult> {
  await requireAdmin('products');
  const { data } = await db().from('collections').delete().eq('slug', slug).select('image').maybeSingle();
  if (data?.image) await deleteImage(data.image);
  refresh();
  return { ok: true, message: 'Collection deleted.' };
}
