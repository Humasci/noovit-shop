import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db/server';
import { dbConfigured } from '@/lib/config';
import { ProductEditor, EMPTY_PRODUCT } from '@/components/admin/ProductEditor';
import { ProductImages } from '@/components/admin/ProductImages';
import { NotConfigured, PageTitle } from '@/components/admin/ui';
import { ProductData, ProductStatus } from '@/types';

export default async function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const isNew = slug === 'new';
  if (!dbConfigured()) return (<><PageTitle title={isNew ? 'New product' : 'Edit product'} /><NotConfigured what="The database" /></>);

  let initial = { slug: '', status: 'hidden' as ProductStatus, seoTitle: '', seoDescription: '', supplierSku: '', data: EMPTY_PRODUCT };
  let images: string[] = [];
  if (!isNew) {
    const { data: row } = await db().from('products').select('*').eq('slug', slug).maybeSingle();
    if (!row) notFound();
    initial = {
      slug: row.slug,
      status: row.status,
      seoTitle: row.seo_title ?? '',
      seoDescription: row.seo_description ?? '',
      supplierSku: row.supplier_sku ?? '',
      data: { ...EMPTY_PRODUCT, ...(row.data as ProductData) },
    };
    images = row.images ?? [];
  }

  return (
    <>
      <Link href="/admin/products" className="mb-2 inline-block text-sm text-[var(--color-blue)]">← All products</Link>
      <PageTitle title={isNew ? 'New product' : initial.data.name} />
      {isNew ? (
        <p className="mb-4 text-sm text-[var(--color-muted)]">New products start as <b>hidden</b>. Add photos after the first save, then set the status to Active.</p>
      ) : (
        <div className="mb-6">
          <ProductImages slug={slug} initial={images} />
        </div>
      )}
      <ProductEditor key={slug} initial={initial} isNew={isNew} images={images} />
    </>
  );
}
