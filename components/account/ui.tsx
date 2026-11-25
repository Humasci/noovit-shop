import type { LucideIcon } from 'lucide-react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { FLASH, type Tone } from '@/lib/account/format';

// Small building blocks shared by the account pages.
const TONES: Record<Tone, string> = {
  navy: 'bg-[var(--color-navy)] text-white',
  green: 'bg-[var(--color-green)] text-white',
  amber: 'bg-amber-100 text-amber-900',
  muted: 'bg-[var(--color-soft)] text-[var(--color-muted)]',
};
export const Badge = ({ tone, children }: { tone: Tone; children: React.ReactNode }) => (
  <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${TONES[tone]}`}>{children}</span>
);

export const Card = ({ children, className = '', ...rest }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`rounded-2xl border border-[var(--color-line)] bg-white p-5 sm:p-6 ${className}`} {...rest}>{children}</div>
);

export const Empty = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl bg-[var(--color-soft)] p-6 text-sm text-[var(--color-muted)]">{children}</div>
);

export function PageTitle({ icon: Icon, title, sub }: { icon: LucideIcon; title: string; sub?: string }) {
  return (
    <header className="mb-6">
      <h1 className="flex items-center gap-3 text-3xl"><Icon className="h-6 w-6 text-[var(--color-accent)]" aria-hidden /> {title}</h1>
      {sub && <p className="mt-2 text-sm text-[var(--color-muted)]">{sub}</p>}
    </header>
  );
}

// Result of the last action, from ?ok= / ?err= (fixed texts only).
export function Flash({ ok, err }: { ok?: string; err?: string }) {
  const good = ok ? FLASH[ok] : undefined;
  const bad = err ? FLASH[err] : undefined;
  if (!good && !bad) return null;
  return (
    <p role="status" data-testid="account-flash" className={`mb-6 flex items-start gap-2.5 rounded-xl p-4 text-sm ${good ? 'bg-emerald-50 text-emerald-900' : 'bg-red-50 text-red-800'}`}>
      {good ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />}
      {good ?? bad}
    </p>
  );
}

export const field = 'w-full rounded-xl border border-[var(--color-line)] bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]';
export const Label = ({ text, children, className = '' }: { text: string; children: React.ReactNode; className?: string }) => (
  <label className={`grid gap-1.5 text-xs font-semibold text-[var(--color-muted)] ${className}`}>{text}{children}</label>
);
