import Link from 'next/link';
import { Check, AlertTriangle } from 'lucide-react';
import { db } from '@/lib/db/server';
import { ordersOpen, siteLive, stripeLive, previewToken } from '@/lib/launch';
import { loadCatalog } from '@/lib/catalog/server';
import { advisorEnabled } from '@/lib/advisor';
import { SITE_URL } from '@/lib/site';

// "Store status" on the admin overview (25 Nov): what stands between the store and taking orders, plus the lists that
// are filling up while products are in coming-soon mode. Each line is a plain yes/no with the next step.
async function count(source: string) {
  const { count: n } = await db().from('subscribers').select('email', { count: 'exact', head: true }).eq('source', source).eq('status', 'subscribed');
  return n ?? 0;
}

export async function StoreStatus() {
  const [catalog, launchList, testsList, program] = await Promise.all([
    loadCatalog().catch(() => []),
    count('launch-waitlist').catch(() => 0),
    count('tests-waitlist').catch(() => 0),
    count('program-perimenopause').catch(() => 0),
  ]);
  const active = catalog.filter((p) => p.status === 'active' && p.productType !== 'pets' && !p.bundleItems?.length);
  const noSku = active.filter((p) => !p.supplierSku);
  const key = process.env.STRIPE_SECRET_KEY ?? '';
  const rows: { ok: boolean; label: string; note: string; href?: string }[] = [
    { ok: siteLive(), label: 'Site is public', note: siteLive() ? 'Visitors and Google see the full store.' : 'Visitors see the coming-soon page. Set SITE_LIVE=true in Vercel and redeploy.' },
    { ok: stripeLive(), label: 'Stripe is in live mode', note: stripeLive() ? 'Real payments can be taken.' : key.startsWith('sk_test_') ? 'Test keys are in use: only test orders work. Add the live secret key in Vercel when the account is activated.' : 'No Stripe key found. Add STRIPE_SECRET_KEY in Vercel.' },
    { ok: ordersOpen(), label: 'Orders are open', note: ordersOpen() ? 'Shoppers can add to cart and check out.' : 'Coming-soon mode: product pages show "Notify me". Set ORDERS_OPEN=true in Vercel (with live Stripe keys) and redeploy.' },
    { ok: noSku.length === 0, label: 'Supplier SKUs set', note: noSku.length ? `${noSku.length} active ${noSku.length === 1 ? 'product has' : 'products have'} no supplier SKU: ${noSku.slice(0, 4).map((p) => p.name).join(', ')}${noSku.length > 4 ? '…' : ''}` : 'Every active product maps to a supplier product.', href: '/admin/products' },
    { ok: advisorEnabled(), label: 'AI advisor is on', note: advisorEnabled() ? 'The chat button shows on every page.' : 'Add the advisor API key in Vercel to switch it on.' },
  ];
  const preview = `${SITE_URL}/preview?token=${previewToken()}`;
  return (
    <div className="mb-6 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
      <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-muted)]">Store status</p>
        <ul className="mt-3 space-y-2.5 text-sm">
          {rows.map((r) => (
            <li key={r.label} className="flex items-start gap-3">
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${r.ok ? 'bg-[var(--color-accent)] text-white' : 'bg-amber-100 text-amber-700'}`}>
                {r.ok ? <Check className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
              </span>
              <span>
                <span className="font-semibold text-[var(--color-navy)]">{r.label}</span>
                <span className="block text-[var(--color-muted)]">{r.note} {r.href && !r.ok && <Link href={r.href} className="font-semibold text-[var(--color-navy)] underline">Fix</Link>}</span>
              </span>
            </li>
          ))}
        </ul>
        {!ordersOpen() && (
          <div className="mt-4 border-t border-[var(--color-line)] pt-3">
            <p className="text-xs font-semibold text-[var(--color-navy)]">Preview link with working checkout (30 days), for test orders</p>
            <input readOnly value={preview} aria-label="Preview link" className="mt-1 w-full rounded border border-[var(--color-line)] bg-[var(--color-soft)] px-3 py-2 font-mono text-xs" />
          </div>
        )}
      </div>
      <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-muted)]">People waiting</p>
        <dl className="mt-3 space-y-3">
          {[['Launch list (Notify me)', launchList], ['At-home tests waitlist', testsList], ['Perimenopause program', program]].map(([label, n]) => (
            <div key={label as string} className="flex items-baseline justify-between gap-3">
              <dt className="text-sm text-[var(--color-ink)]">{label}</dt>
              <dd className="text-2xl font-semibold tabular-nums text-[var(--color-navy)]">{n}</dd>
            </div>
          ))}
        </dl>
        <Link href="/admin/subscribers" className="mt-4 inline-block text-sm font-semibold text-[var(--color-navy)] underline">See subscribers</Link>
      </div>
    </div>
  );
}
