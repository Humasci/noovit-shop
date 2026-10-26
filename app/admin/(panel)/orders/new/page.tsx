import Link from 'next/link';
import { requireAdmin } from '@/lib/admin/auth';
import { dbConfigured } from '@/lib/config';
import { loadCatalog } from '@/lib/catalog/server';
import { packOptions } from '@/data/products';
import { createManualOrder } from '@/app/admin/order-actions';
import { Card, Flash, NotConfigured, PageTitle, btnSm, inputCls } from '@/components/admin/ui';
import { formatPrice } from '@/lib/utils/format';

const ROWS = 5;
const label = 'mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]';

export default async function NewOrderPage({ searchParams }: { searchParams: Promise<{ msg?: string; link?: string; emailed?: string }> }) {
  await requireAdmin('orders.money');
  const { msg, link, emailed } = await searchParams;
  if (!dbConfigured()) return (<><PageTitle title="New order" /><NotConfigured what="The database" /></>);
  const products = (await loadCatalog()).filter((p) => p.status !== 'hidden');

  return (
    <>
      <Link href="/admin/orders" className="mb-2 inline-block text-sm text-[var(--color-accent)]">← Orders</Link>
      <PageTitle title="New manual order" />
      <Flash msg={msg} />

      {link && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <p className="font-semibold text-green-900">Payment link created{emailed === '1' ? ' and emailed to the customer' : ''}.</p>
          <p className="mt-1 text-sm text-green-900">Send this link to the customer (valid 24 hours). The order appears in Orders automatically once they pay.</p>
          <code className="mt-3 block break-all rounded-lg bg-white px-3 py-2 text-sm">{link}</code>
        </Card>
      )}

      <form action={createManualOrder} className="space-y-6">
        <Card>
          <h2 className="mb-3 text-lg">Type</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex gap-3 rounded-xl border border-[var(--color-line)] p-4">
              <input type="radio" name="type" value="replacement" defaultChecked />
              <span>
                <b>Free replacement</b>
                <span className="block text-sm text-[var(--color-muted)]">For lost, damaged or goodwill orders. No payment; goes straight to the fulfilment queue.</span>
              </span>
            </label>
            <label className="flex gap-3 rounded-xl border border-[var(--color-line)] p-4">
              <input type="radio" name="type" value="payment_link" />
              <span>
                <b>Payment link</b>
                <span className="block text-sm text-[var(--color-muted)]">For phone or email orders. Creates a secure Stripe checkout link for the customer to pay; they enter their own address.</span>
              </span>
            </label>
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 text-lg">Customer</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label><span className={label}>Email</span><input name="email" type="email" required className={`${inputCls} w-full`} /></label>
            <label><span className={label}>Full name</span><input name="name" className={`${inputCls} w-full`} /></label>
          </div>
          <p className="mb-2 mt-4 text-xs text-[var(--color-muted)]">Shipping address — required for replacements.</p>
          <div className="grid gap-3 sm:grid-cols-6">
            <input name="line1" placeholder="Address line 1" className={`${inputCls} sm:col-span-4`} />
            <input name="line2" placeholder="Apt / suite" className={`${inputCls} sm:col-span-2`} />
            <input name="city" placeholder="City" className={`${inputCls} sm:col-span-3`} />
            <input name="state" placeholder="State (e.g. TX)" maxLength={2} className={`${inputCls} uppercase sm:col-span-1`} />
            <input name="postal_code" placeholder="ZIP" className={`${inputCls} sm:col-span-2`} />
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 text-lg">Products</h2>
          <div className="space-y-2">
            {Array.from({ length: ROWS }, (_, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-[3fr_2fr_1fr]">
                <select name={`slug_${i}`} defaultValue="" className={inputCls} aria-label={`Product ${i + 1}`}>
                  <option value="">{i === 0 ? 'Choose a product…' : '—'}</option>
                  {products.map((p) => (
                    <option key={p.slug} value={p.slug}>{p.name}</option>
                  ))}
                </select>
                <select name={`bottles_${i}`} defaultValue="1" className={inputCls} aria-label="Pack">
                  <option value="1">1 bottle</option>
                  <option value="3">3 bottles</option>
                  <option value="6">6 bottles</option>
                </select>
                <input name={`qty_${i}`} type="number" min={1} max={20} defaultValue={1} className={inputCls} aria-label="Quantity" />
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-[var(--color-muted)]">
            One-time prices, e.g. {products[0] ? `${products[0].name}: ${packOptions(products[0], 'one-time').map((o) => `${o.bottles} for ${formatPrice(o.pricePerBottle * o.bottles)}`).join(', ')}` : ''}.
          </p>
        </Card>

        <Card>
          <label><span className={label}>Internal note</span><input name="note" placeholder="e.g. Replacement for #1042 — arrived damaged" className={`${inputCls} w-full`} /></label>
          <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" name="send_email" defaultChecked /> Email the payment link to the customer (payment links only)</label>
        </Card>

        <button className={btnSm}>Create order</button>
      </form>
    </>
  );
}
