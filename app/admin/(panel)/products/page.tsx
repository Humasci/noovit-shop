import Link from 'next/link';
import { db } from '@/lib/db/server';
import { dbConfigured } from '@/lib/config';
import { products, asLowAs } from '@/data/products';
import { setSupplierSku } from '@/app/admin/actions';
import { Flash, PageTitle, Table, btnSm, inputCls, money, td } from '@/components/admin/ui';

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  const { msg } = await searchParams;
  const skus = new Map<string, string | null>();
  if (dbConfigured()) {
    const { data } = await db().from('product_settings').select('slug, supplier_sku');
    for (const r of data ?? []) skus.set(r.slug, r.supplier_sku);
  }
  const missing = products.filter((p) => !skus.get(p.slug)).length;

  return (
    <>
      <PageTitle title="Products" />
      <Flash msg={msg} />
      <p className="mb-4 text-sm text-[var(--color-muted)]">
        Product details and prices live in <code>data/products.ts</code> and are pushed to Stripe with <code>npm run stripe:sync</code>. Map each product to
        your supplier&apos;s SKU here — it&apos;s included on every new order and in the fulfilment CSV.
        {missing > 0 && <b className="text-red-600"> {missing} products have no supplier SKU yet.</b>}
      </p>
      <Table head={['Product', 'Type', 'One-time (1 bottle)', 'As low as', 'Supplier SKU']}>
        {products.map((p) => (
          <tr key={p.slug}>
            <td className={td}>
              <Link href={`/products/${p.slug}`} target="_blank" className="font-semibold hover:text-[var(--color-blue)]">{p.name}</Link>
              <div className="text-xs text-[var(--color-muted)]">{p.slug}</div>
            </td>
            <td className={td}>{p.productType}</td>
            <td className={td}>{money(p.basePrice * 100)}</td>
            <td className={td}>{money(asLowAs(p) * 100)}</td>
            <td className={td}>
              {dbConfigured() ? (
                <form action={setSupplierSku} className="flex gap-2">
                  <input type="hidden" name="slug" value={p.slug} />
                  <input name="supplier_sku" defaultValue={skus.get(p.slug) ?? ''} placeholder="e.g. SUP-MAG-60" className={inputCls} />
                  <button className={btnSm}>Save</button>
                </form>
              ) : (
                <span className="text-xs text-[var(--color-muted)]">Connect database</span>
              )}
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
