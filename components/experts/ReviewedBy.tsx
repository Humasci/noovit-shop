import Link from 'next/link';
import { fmtReviewDate, reviewFor } from '@/lib/experts';

// "Reviewed by <name>, <credentials> · <date>", linking to the reviewer's profile. Renders nothing unless the page is
// in REVIEW_LOG (data/content.ts).
export function ReviewedBy({ reviewKey, className = '' }: { reviewKey: string; className?: string }) {
  const r = reviewFor(reviewKey);
  if (!r) return null;
  return (
    <span className={className}>
      Reviewed by{' '}
      <Link href={`/experts/${r.expert.slug}`} className="font-semibold text-[var(--color-ink)] underline-offset-2 hover:underline">
        {r.expert.name}
      </Link>
      , {r.expert.credentials} · {fmtReviewDate(r.date)}
    </span>
  );
}
