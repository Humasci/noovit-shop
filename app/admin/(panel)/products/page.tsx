import Link from 'next/link';
import { Download, Plus, Upload } from 'lucide-react';
import { requireAdmin } from '@/lib/admin/auth';
import { db } from '@/lib/db/server';
import { dbConfigured } from '@/lib/config';
import { loadCatalog, loadCollections } from '@/lib/catalog/server';
import { asLowAs, PRODUCT_TYPES } from '@/data/products';
import { ProductImage } from '@/components/product/ProductImage';
import { ProductListActions } from '@/components/admin/ProductListActions';
import { bulkUpdateProducts, importProductsCsv } from '@/app/admin/product-bulk-actions';
import { Badge, Card, FilterLinks, Flash, NotConfigured, PageTitle, Table, btnSm, btnSmOutline, inputCls, money, td } from '@/components/admin/ui';

const STATUS_LABEL: Record<string, string> = { active: 'active', out_of_stock: 'out of stock', hidden: 'hidden' };

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ type?: string; msg?: string }> }) {
  await requireAdmin('products');
  const { type, msg } = await searchParams;
  if (!dbConfigured()) return (<><PageTitle title="Products" /><NotConfigured what="The database" /></>);

  const { count } = await db().from('products').select('slug', { count: 'exact', head: true });
  const [catalog, collections] = await Promise.all([loadCatalog(), loadCollections()]);
  const rows = type ? catalog.filter((p) => p.productType === type) : catalog;
  const missingSku = catalog.filter((p) => !p.supplierSku).length;

  return (
    <>
      <PageTitle title="Products">
        <ProductListActions empty={!count} />
        {count ? (
          // eslint-disable-next-line @next/next/no-html-link-for-pages -- CSV download, not a page
          <a href="/admin/products/export" className={`${btnSmOutline} inline-flex items-center gap-1`}>
            <Download className="h-3.5 w-3.5" /> Export CSV
          </a>
        ) : null}
        <Link href="/admin/products/new" className={`${btnSm} inline-flex items-center gap-1`}>
          <Plus className="h-3.5 w-3.5" /> New product
        </Link>
      </PageTitle>
      <Flash msg={msg} />

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

      <form action={bulkUpdateProducts}>
        {count ? (
          <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl bg-white p-3 text-sm">
            <span className="font-semibold">With selected:</span>
            <select name="action" defaultValue="" className={inputCls} aria-label="Bulk action">
              <option value="" disabled>Choose an action…</option>
              <optgroup label="Status">
                <option value="status:active">Set active</option>
                <option value="status:out_of_stock">Set out of stock</option>
                <option value="status:hidden">Hide</option>
              </optgroup>
              <optgroup label="Best seller">
                <option value="bestseller:on">Mark as best seller</option>
                <option value="bestseller:off">Remove best seller</option>
              </optgroup>
              {collections.length > 0 && (
                <optgroup label="Collections">
                  {collections.map((c) => (
                    <option key={`add-${c.slug}`} value={`collection-add:${c.slug}`}>Add to “{c.title}”</option>
                  ))}
                  {collections.map((c) => (
                    <option key={`rm-${c.slug}`} value={`collection-remove:${c.slug}`}>Remove from “{c.title}”</option>
                  ))}
                </optgroup>
              )}
            </select>
            <button className={btnSm}>Apply</button>
          </div>
        ) : null}

        <Table head={['', '', 'Product', 'Type', 'Status', '1 bottle', 'As low as', 'Supplier SKU', '']} empty={!rows.length}>
          {rows.map((p) => (
            <tr key={p.slug}>
              <td className={`${td} w-8`}>
                {count ? <input type="checkbox" name="slugs" value={p.slug} aria-label={`Select ${p.name}`} /> : null}
              </td>
              <td className={`${td} w-16`}>
                <ProductImage product={p} className="h-12 w-12 rounded-lg" />
              </td>
              <td className={td}>
                <Link href={`/admin/products/${p.slug}`} className="font-semibold hover:text-[var(--color-accent)]">{p.name}</Link>
                <div className="text-xs text-[var(--color-muted)]">
                  /{p.slug}
                  {p.bundleItems?.length ? ' · bundle' : ''}
                  {p.bestSeller ? ' · best seller' : ''}
                </div>
              </td>
              <td className={td}>{PRODUCT_TYPES.find((t) => t.value === p.productType)?.label}</td>
              <td className={td}><Badge status={STATUS_LABEL[p.status]} /></td>
              <td className={td}>{money(p.basePrice * 100)}</td>
              <td className={td}>{money(asLowAs(p) * 100)}</td>
              <td className={td}>{p.supplierSku ?? <span className="text-red-600">—</span>}</td>
              <td className={td}>
                {count ? <Link href={`/admin/products/${p.slug}`} className="text-sm font-bold text-[var(--color-accent)]">Edit</Link> : null}
              </td>
            </tr>
          ))}
        </Table>
      </form>

      {count ? (
        <Card className="mt-6">
          <h2 className="text-lg">Import from spreadsheet</h2>
          <p className="mb-3 mt-1 text-sm text-[var(--color-muted)]">
            Export the CSV, edit it in Excel or Google Sheets, then upload it here. Products are matched by <b>slug</b>; you can change name, status
            (active / out_of_stock / hidden), base price, servings, supplier SKU, best seller (yes/no), short benefit and SEO fields. Blank cells are left unchanged. New
            products must be created in the editor. Price changes are synced to Stripe automatically.
          </p>
          <form action={importProductsCsv} className="flex flex-wrap items-center gap-2">
            <input type="file" name="file" accept=".csv,text/csv" required className="text-sm" />
            <button className={`${btnSm} inline-flex items-center gap-1`}>
              <Upload className="h-3.5 w-3.5" /> Import CSV
            </button>
          </form>
        </Card>
      ) : null}
    </>
  );
}
