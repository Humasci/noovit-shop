'use server';

import { randomUUID } from 'crypto';
import { revalidatePath, updateTag } from 'next/cache';
import { requireAdmin } from '@/lib/admin/auth';
import { db } from '@/lib/db/server';
import { stripe } from '@/lib/stripe/server';
import { stripeConfigured } from '@/lib/config';
import { syncProducts } from '@/lib/stripe/sync';
import { stripeProductId } from '@/lib/stripe/catalog';
import { CATALOG_TAG, loadCatalog } from '@/lib/catalog/server';
import { buildProduct, toProductData } from '@/lib/catalog/build';
import { DIETARY_TAGS, PRODUCT_FORMS, PRODUCT_TYPES, SEED_PRODUCTS } from '@/data/products';
import { Audience, DietaryTag, Product, ProductData, ProductStatus, Species } from '@/types';

export interface ProductInput {
  slug: string;
  status: ProductStatus;
  seoTitle: string;
  seoDescription: string;
  supplierSku: string;
  data: ProductData;
}

export interface ActionResult {
  ok: boolean;
  message: string;
  slug?: string;
  images?: string[];
}

const BUCKET = 'product-images';
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const IMAGE_TYPES: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

const text = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const list = <T,>(v: unknown, allowed: readonly T[]) => (Array.isArray(v) ? (v.filter((x) => allowed.includes(x)) as T[]) : []);

function refresh() {
  updateTag(CATALOG_TAG);
  revalidatePath('/admin/products', 'layout');
}

// Never trust the browser: rebuild every field from validated values.
function validate(input: ProductInput): { data: ProductData; error?: string } {
  const d = input.data ?? ({} as ProductData);
  const data: ProductData = {
    name: text(d.name, 100),
    shortBenefit: text(d.shortBenefit, 160),
    description: text(d.description, 2000),
    whoFor: text(d.whoFor, 1000),
    benefits: (Array.isArray(d.benefits) ? d.benefits : []).map((b) => text(b, 160)).filter(Boolean).slice(0, 12),
    ingredients: (Array.isArray(d.ingredients) ? d.ingredients : [])
      .map((i) => ({ name: text(i?.name, 120), amount: text(i?.amount, 40), ...(text(i?.description, 200) ? { description: text(i?.description, 200) } : {}) }))
      .filter((i) => i.name)
      .slice(0, 25),
    otherIngredients: text(d.otherIngredients, 500),
    dosage: text(d.dosage, 300),
    servings: Math.round(Number(d.servings)),
    form: PRODUCT_FORMS.includes(d.form) ? d.form : 'capsules',
    basePrice: Math.round(Number(d.basePrice) * 100) / 100,
    color: /^#[0-9a-fA-F]{6}$/.test(d.color) ? d.color : '#5C7FA8',
    productType: PRODUCT_TYPES.some((t) => t.value === d.productType) ? d.productType : 'supplements',
    dietaryTags: list<DietaryTag>(d.dietaryTags, DIETARY_TAGS.map((t) => t.value)),
    audiences: list<Audience>(d.audiences, ['women', 'men']),
    species: list<Species>(d.species, ['dog', 'cat']),
    ageRestricted: Boolean(d.ageRestricted),
    bestSeller: Boolean(d.bestSeller),
    rating: Math.min(5, Math.max(0, Number(d.rating) || 0)),
    reviewCount: Math.max(0, Math.round(Number(d.reviewCount) || 0)),
    extraFaqs: (Array.isArray(d.extraFaqs) ? d.extraFaqs : [])
      .map((f) => ({ q: text(f?.q, 200), a: text(f?.a, 1000) }))
      .filter((f) => f.q && f.a)
      .slice(0, 20),
  };

  if (!data.name) return { data, error: 'Name is required.' };
  if (!data.shortBenefit) return { data, error: 'Short benefit is required (shown on product cards).' };
  if (!data.dosage) return { data, error: 'Dosage / how to take is required.' };
  if (!(data.servings >= 1 && data.servings <= 1000)) return { data, error: 'Servings must be between 1 and 1000.' };
  // The cheapest tier is base price − $10, so anything under $15 would sell for under $5.
  if (!(data.basePrice >= 15 && data.basePrice <= 1000)) return { data, error: 'Base price must be between $15 and $1,000.' };
  if (data.productType === 'pets' && !data.species?.length) return { data, error: 'Choose Dogs and/or Cats for a pet product.' };
  return { data };
}

async function syncToStripe(product: Product) {
  if (!stripeConfigured()) return ' Stripe is not connected, so prices were not synced.';
  try {
    const s = await syncProducts(stripe(), [product]);
    const changed = s.pricesCreated + s.pricesReplaced;
    return changed ? ` Stripe updated (${changed} prices).` : ' Stripe already up to date.';
  } catch (e) {
    return ` Saved, but Stripe sync failed: ${e instanceof Error ? e.message : 'unknown error'}. Use "Sync all to Stripe" to retry.`;
  }
}

export async function saveProduct(input: ProductInput, isNew: boolean): Promise<ActionResult> {
  await requireAdmin();
  const slug = text(input.slug, 80).toLowerCase();
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return { ok: false, message: 'URL handle may only use lowercase letters, numbers and single hyphens.' };
  const status: ProductStatus = ['active', 'out_of_stock', 'hidden'].includes(input.status) ? input.status : 'hidden';
  const { data, error } = validate(input);
  if (error) return { ok: false, message: error };

  const row = {
    data,
    status,
    seo_title: text(input.seoTitle, 120) || null,
    seo_description: text(input.seoDescription, 320) || null,
    supplier_sku: text(input.supplierSku, 80) || null,
  };

  if (isNew) {
    const { data: last } = await db().from('products').select('sort_order').order('sort_order', { ascending: false }).limit(1).maybeSingle();
    const { error: insertError } = await db().from('products').insert({ slug, ...row, sort_order: (last?.sort_order ?? 0) + 10 });
    if (insertError) {
      return { ok: false, message: insertError.code === '23505' ? 'A product with that URL handle already exists.' : insertError.message };
    }
  } else {
    const { data: updated, error: updateError } = await db().from('products').update(row).eq('slug', slug).select('images').maybeSingle();
    if (updateError) return { ok: false, message: updateError.message };
    if (!updated) return { ok: false, message: 'Product not found.' };
  }

  refresh();
  const { data: saved } = await db().from('products').select('*').eq('slug', slug).single();
  const stripeNote = await syncToStripe(buildProduct(saved));
  return { ok: true, slug, message: `${isNew ? 'Product created' : 'Saved'}.${stripeNote}` };
}

export async function syncAllProducts(): Promise<ActionResult> {
  await requireAdmin();
  if (!stripeConfigured()) return { ok: false, message: 'Stripe is not connected.' };
  try {
    const s = await syncProducts(stripe(), await loadCatalog(), { archiveMissing: true });
    return {
      ok: true,
      message: `Stripe synced: ${s.productsCreated} products created, ${s.productsUpdated} updated, ${s.pricesCreated + s.pricesReplaced} prices changed, ${s.pricesUnchanged} unchanged.`,
    };
  } catch (e) {
    return { ok: false, message: `Stripe sync failed: ${e instanceof Error ? e.message : 'unknown error'}` };
  }
}

export async function importLaunchCatalog(): Promise<ActionResult> {
  await requireAdmin();
  const rows = SEED_PRODUCTS.map((p, i) => ({ slug: p.slug, data: toProductData(p), status: p.status, sort_order: i * 10 }));
  const { data, error } = await db().from('products').upsert(rows, { onConflict: 'slug', ignoreDuplicates: true }).select('slug');
  if (error) return { ok: false, message: error.message };
  refresh();
  return { ok: true, message: `Imported ${data?.length ?? 0} products.` };
}

async function currentImages(slug: string) {
  const { data } = await db().from('products').select('images').eq('slug', slug).maybeSingle();
  return data ? ((data.images as string[]) ?? []) : null;
}

async function saveImages(slug: string, images: string[]): Promise<ActionResult> {
  const { error } = await db().from('products').update({ images }).eq('slug', slug);
  if (error) return { ok: false, message: error.message };
  refresh();
  if (stripeConfigured()) {
    await stripe()
      .products.update(stripeProductId(slug), { images: images.slice(0, 8) })
      .catch(() => {}); // Stripe copy is cosmetic (checkout thumbnails); the next sync fixes it.
  }
  return { ok: true, message: 'Images updated.', images };
}

export async function uploadProductImage(slug: string, form: FormData): Promise<ActionResult> {
  await requireAdmin();
  const images = await currentImages(slug);
  if (!images) return { ok: false, message: 'Save the product before adding images.' };
  const file = form.get('file');
  if (!(file instanceof File)) return { ok: false, message: 'No file received.' };
  const ext = IMAGE_TYPES[file.type];
  if (!ext) return { ok: false, message: `${file.name}: use JPG, PNG or WebP.` };
  if (file.size > MAX_IMAGE_BYTES) return { ok: false, message: `${file.name} is over 4 MB.` };

  const path = `${slug}/${randomUUID()}.${ext}`;
  const { error } = await db().storage.from(BUCKET).upload(path, file, { contentType: file.type, cacheControl: '31536000' });
  if (error) return { ok: false, message: `Upload failed: ${error.message}` };
  const { data } = db().storage.from(BUCKET).getPublicUrl(path);
  return saveImages(slug, [...images, data.publicUrl]);
}

export async function removeProductImage(slug: string, url: string): Promise<ActionResult> {
  await requireAdmin();
  const images = await currentImages(slug);
  if (!images?.includes(url)) return { ok: false, message: 'Image not found.' };
  const marker = `/${BUCKET}/`;
  if (url.includes(marker)) await db().storage.from(BUCKET).remove([url.slice(url.indexOf(marker) + marker.length)]);
  return saveImages(slug, images.filter((u) => u !== url));
}

export async function moveProductImage(slug: string, index: number, direction: -1 | 1): Promise<ActionResult> {
  await requireAdmin();
  const images = await currentImages(slug);
  const target = index + direction;
  if (!images || index < 0 || target < 0 || index >= images.length || target >= images.length) return { ok: false, message: 'Cannot move image.' };
  const next = [...images];
  [next[index], next[target]] = [next[target], next[index]];
  return saveImages(slug, next);
}
