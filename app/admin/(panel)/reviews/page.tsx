import { db } from '@/lib/db/server';
import { dbConfigured } from '@/lib/config';
import { findProduct } from '@/data/products';
import { loadCatalog } from '@/lib/catalog/server';
import { moderateReview } from '@/app/admin/actions';
import { Stars } from '@/components/ui/Stars';
import { Badge, Card, FilterLinks, Flash, NotConfigured, PageTitle, btnSm, btnSmOutline, dateTime } from '@/components/admin/ui';

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
        Approved reviews replace the placeholder reviews on that product&apos;s page. &quot;Verified buyer&quot; is set automatically when the email matches an order for that product.
      </p>
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
