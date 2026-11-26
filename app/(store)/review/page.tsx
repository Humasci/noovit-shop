import type { Metadata } from 'next';
import { readReviewInvite } from '@/lib/reviews-invite';
import { getStoreProducts } from '@/lib/catalog/server';
import { InviteReviewForm } from '@/components/reviews/InviteReviewForm';

export const metadata: Metadata = { title: 'Write your review | Noovit', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

// Reviewer programme (26 Nov): the personal link from the invite email. One form per product we sent free.
export default async function ReviewInvitePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const token = (await searchParams).token ?? '';
  const invite = readReviewInvite(token);
  if (!invite) {
    return (
      <div className="container max-w-xl px-6 py-24 text-center">
        <h1 className="text-3xl">This review link has expired</h1>
        <p className="mt-3 text-[var(--color-muted)]">Email <a href="mailto:hello@noovit.com" className="font-semibold underline">hello@noovit.com</a> and we&apos;ll send a new one.</p>
      </div>
    );
  }
  const products = (await getStoreProducts()).filter((p) => invite.s.includes(p.slug)).map((p) => ({ slug: p.slug, name: p.name }));
  return (
    <div className="container max-w-2xl px-6 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">Your review</p>
      <h1 className="mt-2 text-4xl">Thanks for trying Noovit{invite.n ? `, ${invite.n}` : ''}</h1>
      <p className="mt-3 text-[var(--color-muted)]">
        Tell other people how it went, honestly. We publish every rating, good or bad. Your review will be marked as written from a free sample, as US law requires.
      </p>
      <p className="mt-2 text-sm text-[var(--color-muted)]">Please describe your own experience only, and don&apos;t mention medical conditions or medicines: we can&apos;t publish health claims.</p>
      <div className="mt-10 grid gap-8">
        {products.map((p) => <InviteReviewForm key={p.slug} token={token} slug={p.slug} productName={p.name} firstName={invite.n} />)}
      </div>
    </div>
  );
}
