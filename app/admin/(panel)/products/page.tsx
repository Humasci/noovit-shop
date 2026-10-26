import Link from 'next/link';
import { Plus } from 'lucide-react';
import { db } from '@/lib/db/server';
import { dbConfigured } from '@/lib/config';
import { loadCatalog } from '@/lib/catalog/server';
import { asLowAs, PRODUCT_TYPES } from '@/data/products';
import { ProductImage } from '@/components/product/ProductImage';
import { ProductListActions } from '@/components/admin/ProductListActions';
import { Badge, FilterLinks, NotConfigured, PageTitle, Table, btnSm, money, td } from '@/components/admin/ui';

const STATUS_LABEL: Record<string, string> = { active: 'active', out_of_stock: 'out of stock', hidden: 'hidden' };

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  if (!dbConfigured()) return (<><PageTitle title="Products" /><NotConfigured what="The database" /></>);

  const { count } = await db().from('products').select('slug', { count: 'exact', head: true });
  const catalog = await loadCatalog();
  const rows = type ? catalog.filter((p) => p.productType === type) : catalog;
  const missingSku = catalog.filter((p) => !p.supplierSku).length;

  return (
    <>
      <PageTitle title="Products">
        <ProductListActions empty={!count} />
        <Link href="/admin/products/new" className={`${btnSm} inline-flex items-center gap-1`}>
          <Plus className="h-3.5 w-3.5" /> New product
        </Link>
      </PageTitle>

      {!count && (
        <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          The product database is empty, so the store is showing the built-in launch catalog. Click <b>Import launch catalog</b> to copy it in and start editing.
        </p>
      )}
      {count && missingSku > 0 ? (
        <p className="mb-4 text-sm text-red-600">{missingSku} products have no supplier SKU yet — orders for them will export without a supplier code.</p>
      ) : null}

      <div className="mb-4">
        <FilterLinks base="/admin/products" param="type" current={type} options={PRODUCT_TYPES.map((t) => t.value)} />
      </div>

      <Table head={['', 'Product', 'Type', 'Status', '1 bottle', 'As low as', 'Supplier SKU', '']} empty={!rows.length}>
        {rows.map((p) => (
          <tr key={p.slug}>
            <td className={`${td} w-16`}>
              <ProductImage product={p} className="h-12 w-12 rounded-lg" />
            </td>
            <td className={td}>
              <Link href={`/admin/products/${p.slug}`} className="font-semibold hover:text-[var(--color-blue)]">{p.name}</Link>
              <div className="text-xs text-[var(--color-muted)]">/{p.slug}</div>
            </td>
            <td className={td}>{PRODUCT_TYPES.find((t) => t.value === p.productType)?.label}</td>
            <td className={td}><Badge status={STATUS_LABEL[p.status]} /></td>
            <td className={td}>{money(p.basePrice * 100)}</td>
            <td className={td}>{money(asLowAs(p) * 100)}</td>
            <td className={td}>{p.supplierSku ?? <span className="text-red-600">—</span>}</td>
            <td className={td}>
              {count ? <Link href={`/admin/products/${p.slug}`} className="text-sm font-bold text-[var(--color-blue)]">Edit</Link> : null}
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
