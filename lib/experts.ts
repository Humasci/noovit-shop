import { ADVISORS, REVIEW_LOG } from '@/data/content';
import type { Expert } from '@/types';

// The lead reviewer is the first advisor with a profile page. Pages say "Reviewed by" only when REVIEW_LOG lists them.
export const leadReviewer = (): (Expert & { slug: string }) | null => {
  const e = ADVISORS.find((a) => a.slug);
  return e ? (e as Expert & { slug: string }) : null;
};
export const expertBySlug = (slug: string) => ADVISORS.find((a) => a.slug === slug) ?? null;
export function reviewFor(key: string): { expert: Expert & { slug: string }; date: string } | null {
  const expert = leadReviewer();
  const date = REVIEW_LOG[key];
  return expert && date ? { expert, date } : null;
}
export const reviewedKeys = () => Object.keys(REVIEW_LOG);
export const fmtReviewDate = (iso: string) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
