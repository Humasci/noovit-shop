import Link from 'next/link';
import { formatPrice } from '@/lib/utils/format';

export const money = (cents: number | null | undefined) => formatPrice((cents ?? 0) / 100);

export const dateTime = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—';

export const date = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const TONES: Record<string, string> = {
  paid: 'bg-blue-50 text-blue-700',
  fulfilling: 'bg-amber-50 text-amber-700',
  queued: 'bg-amber-50 text-amber-700',
  submitted: 'bg-indigo-50 text-indigo-700',
  accepted: 'bg-indigo-50 text-indigo-700',
  shipped: 'bg-green-50 text-green-700',
  delivered: 'bg-green-50 text-green-700',
  active: 'bg-green-50 text-green-700',
  approved: 'bg-green-50 text-green-700',
  pending: 'bg-amber-50 text-amber-700',
  scheduled: 'bg-indigo-50 text-indigo-700',
  paused: 'bg-gray-100 text-gray-700',
  past_due: 'bg-red-50 text-red-700',
  failed: 'bg-red-50 text-red-700',
  refunded: 'bg-red-50 text-red-700',
  partially_refunded: 'bg-red-50 text-red-700',
  cancelled: 'bg-gray-100 text-gray-600',
  canceled: 'bg-gray-100 text-gray-600',
  rejected: 'bg-gray-100 text-gray-600',
};

export function Badge({ status }: { status: string }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONES[status] ?? 'bg-gray-100 text-gray-700'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export function PageTitle({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-2xl">{title}</h1>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-[var(--color-line)] bg-white p-5 ${className}`}>{children}</div>;
}

export function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-[var(--color-navy)]">{value}</p>
      {sub && <p className="mt-1 text-xs text-[var(--color-muted)]">{sub}</p>}
    </Card>
  );
}

export function Table({ head, children, empty }: { head: string[]; children: React.ReactNode; empty?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--color-line)] bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-[var(--color-line)] bg-[var(--color-soft)] text-xs uppercase tracking-wider text-[var(--color-muted)]">
          <tr>
            {head.map((h) => (
              <th key={h} className="whitespace-nowrap px-4 py-3 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-line)]">
          {empty ? (
            <tr>
              <td colSpan={head.length} className="px-4 py-10 text-center text-[var(--color-muted)]">Nothing here yet.</td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}

export const td = 'whitespace-nowrap px-4 py-3';

export function FilterLinks({ base, param, current, options }: { base: string; param: string; current?: string; options: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {['all', ...options].map((o) => {
        const active = (current ?? 'all') === o;
        return (
          <Link
            key={o}
            href={o === 'all' ? base : `${base}?${param}=${o}`}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${active ? 'bg-[var(--color-navy)] text-white' : 'bg-white text-[var(--color-navy)] border border-[var(--color-line)]'}`}
          >
            {o.replace(/_/g, ' ')}
          </Link>
        );
      })}
    </div>
  );
}

export function NotConfigured({ what }: { what: string }) {
  return (
    <Card className="border-amber-200 bg-amber-50">
      <p className="font-semibold text-amber-900">{what} is not connected yet.</p>
      <p className="mt-1 text-sm text-amber-800">Add the keys from <code>.env.example</code> to the environment and redeploy. This page will fill in automatically.</p>
    </Card>
  );
}

export function Flash({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mb-6 rounded-xl bg-[var(--color-navy)] px-4 py-3 text-sm font-semibold text-white">{msg}</p>;
}

export const inputCls = 'rounded-lg border border-[var(--color-line)] bg-white px-3 py-2 text-sm';
export const btnSm = 'rounded-lg bg-[var(--color-navy)] px-3 py-2 text-xs font-bold text-white hover:bg-[var(--color-blue)] disabled:opacity-50';
export const btnSmOutline = 'rounded-lg border border-[var(--color-line)] bg-white px-3 py-2 text-xs font-bold text-[var(--color-navy)] hover:border-[var(--color-navy)]';
