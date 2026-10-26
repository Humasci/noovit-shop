import { requireAdmin } from '@/lib/admin/auth';
import Link from 'next/link';
import { Download } from 'lucide-react';
import { db } from '@/lib/db/server';
import { dbConfigured, fulfilmentSupplier } from '@/lib/config';
import { loadCatalog } from '@/lib/catalog/server';
import { shipLines } from '@/lib/orders/fulfilment';
import { markQueuedSubmitted } from '@/app/admin/actions';
import { FulfilmentForm, FulfilmentRow } from '@/components/admin/FulfilmentForm';
import { Badge, Card, FilterLinks, Flash, NotConfigured, PageTitle, btnSm, btnSmOutline, dateTime } from '@/components/admin/ui';

const OPEN = ['queued', 'submitted', 'accepted', 'failed'];

export default async function FulfilmentPage({ searchParams }: { searchParams: Promise<{ status?: string; msg?: string }> }) {
  await requireAdmin('fulfilment');
  const { status, msg } = await searchParams;
  if (!dbConfigured()) return (<><PageTitle title="Fulfilment" /><NotConfigured what="The database" /></>);

  const statuses = status && OPEN.includes(status) ? [status] : OPEN;
  const { data } = await db()
    .from('fulfilments')
    .select('*, orders(order_number, email, shipping_name, shipping_address, created_at, order_items(product_slug, product_name, bottles, quantity, supplier_sku))')
    .in('status', statuses)
    .order('created_at', { ascending: true })
    .limit(200);

  const queued = (data ?? []).filter((f) => f.status === 'queued').length;
  const { data: settings } = await db().from('products').select('slug, supplier_sku');
  const currentSku = new Map((settings ?? []).map((r) => [r.slug as string, r.supplier_sku as string | null]));
  const catalog = await loadCatalog();

  return (
    <>
      <PageTitle title="Fulfilment">
        <a href="/admin/fulfilment/export" className={`${btnSmOutline} inline-flex items-center gap-1`}>
          <Download className="h-3.5 w-3.5" /> Export queued (CSV)
        </a>
        {queued > 0 && (
          <form action={markQueuedSubmitted}>
            <button className={btnSm}>Mark {queued} queued as submitted</button>
          </form>
        )}
      </PageTitle>
      <Flash msg={msg} />
      <p className="mb-4 text-sm text-[var(--color-muted)]">
        Supplier: <b>{fulfilmentSupplier()}</b>. Export the queued orders, upload them to your supplier, then mark them as submitted. Add tracking when the
        supplier ships — the customer is emailed automatically.
      </p>
      <div className="mb-4">
        <FilterLinks base="/admin/fulfilment" param="status" current={status} options={OPEN} />
      </div>

      {!data?.length ? (
        <Card><p className="text-center text-sm text-[var(--color-muted)]">Nothing waiting — all caught up.</p></Card>
      ) : (
        <div className="space-y-4">
          {data.map((f) => {
            const o = f.orders as {
              order_number: number;
              email: string;
              shipping_name: string | null;
              shipping_address: { city?: string; state?: string } | null;
              created_at: string;
              order_items: { product_slug: string; product_name: string; bottles: number; quantity: number; supplier_sku: string | null }[];
            };
            return (
              <Card key={f.id}>
                <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
                  <Link href={`/admin/orders/${o.order_number}`} className="font-bold text-[var(--color-blue)]">#{o.order_number}</Link>
                  <Badge status={f.status} />
                  <span>{o.shipping_name}</span>
                  <span className="text-[var(--color-muted)]">{o.shipping_address?.city}, {o.shipping_address?.state}</span>
                  <span className="text-[var(--color-muted)]">· ordered {dateTime(o.created_at)}</span>
                </div>
                <ul className="mb-3 text-sm">
                  {shipLines(o.order_items, catalog, currentSku).map((line, idx) => (
                    <li key={idx}>
                      {line.units} × {line.name}
                      <span className={line.sku ? 'text-[var(--color-muted)]' : 'text-red-600'}> ({line.sku ?? 'no SKU'})</span>
                      {line.bundle && <span className="text-xs text-[var(--color-muted)]"> · from {line.bundle}</span>}
                    </li>
                  ))}
                </ul>
                {f.error && <p className="mb-2 text-sm text-red-600">{f.error}</p>}
                <FulfilmentForm f={f as FulfilmentRow} returnTo="/admin/fulfilment" />
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
