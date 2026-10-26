import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/admin/auth';
import { dbConfigured } from '@/lib/config';
import { loadCatalog, loadCollections } from '@/lib/catalog/server';
import { CollectionEditor } from '@/components/admin/CollectionEditor';
import { NotConfigured, PageTitle } from '@/components/admin/ui';

export default async function EditCollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin('products');
  const { slug } = await params;
  const isNew = slug === 'new';
  if (!dbConfigured()) return (<><PageTitle title="Collection" /><NotConfigured what="The database" /></>);

  const existing = isNew ? null : (await loadCollections()).find((c) => c.slug === slug);
  if (!isNew && !existing) notFound();
  const products = (await loadCatalog()).map((p) => ({ slug: p.slug, name: p.name, status: p.status }));

  return (
    <>
      <Link href="/admin/collections" className="mb-2 inline-block text-sm text-[var(--color-blue)]">← All collections</Link>
      <PageTitle title={existing?.title ?? 'New collection'} />
      <CollectionEditor
        key={slug}
        isNew={isNew}
        image={existing?.image ?? null}
        products={products}
        initial={{
          slug: existing?.slug ?? '',
          title: existing?.title ?? '',
          description: existing?.description ?? '',
          status: existing?.status ?? 'hidden',
          productSlugs: existing?.productSlugs ?? [],
          seoTitle: existing?.seoTitle ?? '',
          seoDescription: existing?.seoDescription ?? '',
        }}
      />
    </>
  );
}
