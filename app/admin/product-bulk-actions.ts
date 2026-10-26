'use server';

import { redirect } from 'next/navigation';
import { revalidatePath, updateTag } from 'next/cache';
import { requireAdmin } from '@/lib/admin/auth';
import { db } from '@/lib/db/server';
import { stripe } from '@/lib/stripe/server';
import { stripeConfigured } from '@/lib/config';
import { syncProducts } from '@/lib/stripe/sync';
import { CATALOG_TAG, loadCatalog } from '@/lib/catalog/server';
import { parseCsv } from '@/lib/csv';
import { ProductData, ProductStatus } from '@/types';

const back = (msg: string): never => redirect(`/admin/products?msg=${encodeURIComponent(msg)}`);
const STATUSES: ProductStatus[] = ['active', 'out_of_stock', 'hidden'];

function refresh() {
  updateTag(CATALOG_TAG);
  revalidatePath('/admin/products', 'layout');
}

export async function bulkUpdateProducts(f: FormData) {
  await requireAdmin('products');
  const slugs = f.getAll('slugs').map(String).filter(Boolean);
  const action = String(f.get('action') ?? '');
  if (!slugs.length) back('Select at least one product.');

  if (action.startsWith('status:')) {
    const status = action.slice(7) as ProductStatus;
    if (!STATUSES.includes(status)) back('Invalid status.');
    const { error } = await db().from('products').update({ status }).in('slug', slugs);
    if (error) back(error.message);
  } else if (action === 'bestseller:on' || action === 'bestseller:off') {
    const { data: rows } = await db().from('products').select('slug, data').in('slug', slugs);
    for (const r of rows ?? []) {
      await db().from('products').update({ data: { ...(r.data as ProductData), bestSeller: action.endsWith('on') } }).eq('slug', r.slug);
    }
  } else if (action.startsWith('collection-add:') || action.startsWith('collection-remove:')) {
    const [verb, collection] = action.split(':');
    const { data: c } = await db().from('collections').select('product_slugs').eq('slug', collection).maybeSingle();
    if (!c) back('Collection not found.');
    const current: string[] = c!.product_slugs ?? [];
    const next = verb === 'collection-add' ? [...current, ...slugs.filter((s) => !current.includes(s))] : current.filter((s) => !slugs.includes(s));
    await db().from('collections').update({ product_slugs: next }).eq('slug', collection);
  } else {
    back('Choose an action.');
  }
  refresh();
  back(`Updated ${slugs.length} product${slugs.length === 1 ? '' : 's'}.`);
}

// Updates existing products only (matched by slug). Blank cells leave a field unchanged.
export async function importProductsCsv(f: FormData) {
  await requireAdmin('products');
  const file = f.get('file');
  if (!(file instanceof File) || file.size === 0) back('Choose a CSV file to import.');
  if (file instanceof File && file.size > 2 * 1024 * 1024) back('CSV is larger than 2 MB.');

  const [header, ...rows] = parseCsv(await (file as File).text());
  if (!header?.includes('slug')) back('The first row must be the header, including a “slug” column. Export a CSV first to get the right format.');
  const col = (row: string[], name: string) => {
    const i = header.indexOf(name);
    return i >= 0 ? (row[i] ?? '').trim() : '';
  };

  const { data: existing } = await db().from('products').select('slug, data, status, supplier_sku, seo_title, seo_description');
  const bySlug = new Map((existing ?? []).map((r) => [r.slug as string, r]));
  const errors: string[] = [];
  const priceChanged = new Set<string>();
  let updated = 0;

  for (const [n, row] of rows.entries()) {
    const line = n + 2;
    const slug = col(row, 'slug');
    const current = bySlug.get(slug);
    if (!current) {
      errors.push(`row ${line}: unknown slug “${slug}”`);
      continue;
    }
    const data = { ...(current.data as ProductData) };
    const patch: Record<string, unknown> = {};

    const name = col(row, 'name');
    if (name) data.name = name.slice(0, 100);
    const shortBenefit = col(row, 'short_benefit');
    if (shortBenefit) data.shortBenefit = shortBenefit.slice(0, 160);
    const price = col(row, 'base_price');
    if (price) {
      const v = Math.round(Number(price.replace(/[$,]/g, '')) * 100) / 100;
      if (!(v >= 15 && v <= 1000)) {
        errors.push(`row ${line}: base_price must be between 15 and 1000`);
        continue;
      }
      if (v !== data.basePrice) priceChanged.add(slug);
      data.basePrice = v;
    }
    const servings = col(row, 'servings');
    if (servings) {
      const v = Number(servings);
      if (!(Number.isInteger(v) && v >= 1 && v <= 1000)) {
        errors.push(`row ${line}: servings must be a whole number 1–1000`);
        continue;
      }
      data.servings = v;
    }
    const best = col(row, 'best_seller').toLowerCase();
    if (best) data.bestSeller = ['yes', 'true', '1', 'y'].includes(best);
    const status = col(row, 'status');
    if (status) {
      if (!STATUSES.includes(status as ProductStatus)) {
        errors.push(`row ${line}: status must be active, out_of_stock or hidden`);
        continue;
      }
      patch.status = status;
    }
    for (const [csvName, dbName, max] of [['supplier_sku', 'supplier_sku', 80], ['seo_title', 'seo_title', 120], ['seo_description', 'seo_description', 320]] as const) {
      const v = col(row, csvName);
      if (v) patch[dbName] = v.slice(0, max);
    }

    const { error } = await db().from('products').update({ ...patch, data }).eq('slug', slug);
    if (error) errors.push(`row ${line}: ${error.message}`);
    else updated++;
  }

  let stripeNote = '';
  if (priceChanged.size && stripeConfigured()) {
    try {
      const catalog = await loadCatalog();
      await syncProducts(stripe(), catalog.filter((p) => priceChanged.has(p.slug)));
      stripeNote = ` Prices synced to Stripe for ${priceChanged.size}.`;
    } catch (e) {
      stripeNote = ` Stripe sync failed (${e instanceof Error ? e.message : 'unknown'}) — use “Sync all to Stripe”.`;
    }
  }
  refresh();
  back(`Imported: ${updated} updated.${stripeNote}${errors.length ? ` ${errors.length} skipped — ${errors.slice(0, 5).join('; ')}${errors.length > 5 ? '…' : ''}` : ''}`);
}
