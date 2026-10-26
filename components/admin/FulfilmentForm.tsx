import { updateFulfilment } from '@/app/admin/actions';
import { btnSm, inputCls } from './ui';

const STATUSES = ['queued', 'submitted', 'accepted', 'shipped', 'delivered', 'failed', 'cancelled'];

export interface FulfilmentRow {
  id: string;
  status: string;
  supplier: string;
  supplier_order_ref: string | null;
  carrier: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
}

export function FulfilmentForm({ f, returnTo }: { f: FulfilmentRow; returnTo: string }) {
  return (
    <form action={updateFulfilment} className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      <input type="hidden" name="id" value={f.id} />
      <input type="hidden" name="returnTo" value={returnTo} />
      <select name="status" defaultValue={f.status} className={inputCls} aria-label="Status">
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <input name="supplier_order_ref" defaultValue={f.supplier_order_ref ?? ''} placeholder="Supplier order ref" className={inputCls} />
      <input name="carrier" defaultValue={f.carrier ?? ''} placeholder="Carrier (e.g. USPS)" className={inputCls} />
      <input name="tracking_number" defaultValue={f.tracking_number ?? ''} placeholder="Tracking number" className={inputCls} />
      <input name="tracking_url" type="url" defaultValue={f.tracking_url ?? ''} placeholder="Tracking URL" className={inputCls} />
      <button className={btnSm}>Save (emails customer when marked shipped)</button>
    </form>
  );
}
