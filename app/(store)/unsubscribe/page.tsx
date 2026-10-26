import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/sign';
import { unsubscribe } from '@/lib/marketing/subscribers';

export const metadata: Metadata = { title: 'Unsubscribe — Noovit', robots: { index: false } };

async function confirm(formData: FormData) {
  'use server';
  const token = String(formData.get('token') ?? '');
  const payload = verifyToken<{ e: string; p: string }>(token);
  if (!payload || payload.p !== 'unsub') redirect('/unsubscribe?invalid=1');
  await unsubscribe(payload.e);
  redirect('/unsubscribe?done=1');
}

export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ token?: string; done?: string; invalid?: string }> }) {
  const { token, done, invalid } = await searchParams;
  const payload = token ? verifyToken<{ e: string; p: string }>(token) : null;

  return (
    <div className="container max-w-lg px-6 py-24 text-center">
      {done ? (
        <>
          <h1 className="text-3xl">You&apos;re unsubscribed</h1>
          <p className="mt-3 text-[var(--color-muted)]">You won&apos;t receive marketing emails from us anymore. Order and shipping emails will still arrive.</p>
        </>
      ) : invalid || !payload || payload.p !== 'unsub' ? (
        <>
          <h1 className="text-3xl">This link isn&apos;t valid</h1>
          <p className="mt-3 text-[var(--color-muted)]">Use the unsubscribe link from your most recent Noovit email, or reply to any email and we&apos;ll remove you.</p>
        </>
      ) : (
        <form action={confirm}>
          <h1 className="text-3xl">Unsubscribe?</h1>
          <p className="mt-3 text-[var(--color-muted)]">
            Stop marketing emails to <b>{payload.e}</b>. Order and shipping emails will still arrive.
          </p>
          <input type="hidden" name="token" value={token} />
          <button className="btn btn-primary mt-8">Unsubscribe</button>
        </form>
      )}
    </div>
  );
}
