import { requireAdmin } from '@/lib/admin/auth';
import { db } from '@/lib/db/server';
import { dbConfigured } from '@/lib/config';
import { findProduct } from '@/data/products';
import { loadCatalog } from '@/lib/catalog/server';
import { moderateReview } from '@/app/admin/actions';
import { inviteReviewer } from '@/app/admin/review-actions';
import { Stars } from '@/components/ui/Stars';
import { Badge, Card, FilterLinks, Flash, NotConfigured, PageTitle, btnSm, btnSmOutline, dateTime, inputCls } from '@/components/admin/ui';

const TABS = ['pending', 'approved', 'rejected'];

function Moderate({ id, status, label, tab, primary }: { id: string; status: string; label: string; tab: string; primary?: boolean }) {
  return (
    <form action={moderateReview}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="tab" value={tab} />
      <button className={primary ? btnSm : btnSmOutline}>{label}</button>
    </form>
  );
}

export default async function ReviewsAdmin({ searchParams }: { searchParams: Promise<{ status?: string; msg?: string }> }) {
  await requireAdmin('reviews');
  const sp = await searchParams;
  const tab = TABS.includes(sp.status ?? '') ? sp.status! : 'pending';
  if (!dbConfigured()) return (<><PageTitle title="Reviews" /><NotConfigured what="The database" /></>);

  const catalog = await loadCatalog();
  const { data } = await db().from('reviews').select('*').eq('status', tab).order('created_at', { ascending: false }).limit(100);

  return (
    <>
      <PageTitle title="Reviews" />
      <Flash msg={sp.msg} />
      <div className="mb-4">
        <FilterLinks base="/admin/reviews" param="status" current={tab} options={TABS.slice(1)} />
      </div>
      <p className="mb-4 text-sm text-[var(--color-muted)]">
        &quot;Verified buyer&quot; is set automatically when the email matches an order for that product. <b>Approve every honest review, whatever the rating</b>: holding back negative ones is illegal (FTC rule on consumer reviews, 16 CFR 465). Reject only health or medicine claims, personal data, abuse or off-topic text.
      </p>
      <Card className="mb-6">
        <details>
          <summary className="cursor-pointer text-sm font-bold text-[var(--color-navy)]">Send free samples for review</summary>
          <p className="mt-2 text-xs text-[var(--color-muted)]">
            Order the samples in Supliful to their US address, then send them their personal review link here. Their reviews are marked &quot;Free sample&quot; (required by the FTC when product is given free). Ask for an honest review, never a good one.
          </p>
          <form action={inviteReviewer} className="mt-3 grid gap-3" data-testid="invite-reviewer">
            <div className="flex flex-wrap gap-3">
              <input name="name" required placeholder="Their name" className={inputCls} />
              <input name="email" type="email" required placeholder="Their email" className={inputCls} />
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {catalog.filter((p) => p.status === 'active' && !p.bundleItems?.length && p.productType !== 'pets').map((p) => (
                <label key={p.slug} className="flex items-center gap-1.5"><input type="checkbox" name="products" value={p.slug} /> {p.name}</label>
              ))}
            </div>
            <div><button className={btnSm}>Email their review link</button></div>
          </form>
        </details>
      </Card>
      {!data?.length ? (
        <Card><p className="text-center text-sm text-[var(--color-muted)]">No {tab} reviews.</p></Card>
      ) : (
        <div className="space-y-4">
          {data.map((r) => (
            <Card key={r.id}>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <Stars rating={r.rating} size={14} />
                <span className="font-semibold">{findProduct(catalog, r.product_slug)?.name ?? r.product_slug}</span>
                <Badge status={r.status} />
                {r.verified_buyer ? <Badge status="verified buyer" /> : <span className="text-xs text-[var(--color-muted)]">not a verified buyer</span>}
                {r.free_product && <Badge status="free sample" />}
                <span className="text-xs text-[var(--color-muted)]">{dateTime(r.created_at)}</span>
              </div>
              <h3 className="mt-3 text-base">{r.title}</h3>
              <p className="mt-1 whitespace-pre-line text-sm text-[var(--color-muted)]">{r.body}</p>
              <p className="mt-2 text-xs">
                <b>{r.name}</b> · {r.email}
              </p>
              <div className="mt-4 flex gap-2">
                {r.status !== 'approved' && <Moderate id={r.id} status="approved" label="Approve" tab={tab} primary />}
                {r.status !== 'rejected' && <Moderate id={r.id} status="rejected" label="Reject" tab={tab} />}
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
