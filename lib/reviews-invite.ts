import 'server-only';
import { signToken, verifyToken } from '@/lib/sign';
import { SITE_URL } from '@/lib/site';

// Reviewer invites (26 Nov): a signed link that lets one person review the products we sent them free.
// No table needed: the token carries the email, first name and product slugs, and lasts 120 days.
export type ReviewInvite = { e: string; n: string; s: string[] };
const TTL = 120 * 86_400;

export const reviewInviteToken = (i: ReviewInvite) => signToken({ ...i, p: 'rev-inv' }, TTL);
export const reviewInviteUrl = (i: ReviewInvite) => `${SITE_URL}/review?token=${encodeURIComponent(reviewInviteToken(i))}`;
export function readReviewInvite(token: string | null | undefined): ReviewInvite | null {
  const t = verifyToken<{ e?: string; n?: string; s?: string[]; p?: string }>(token);
  return t?.p === 'rev-inv' && t.e && Array.isArray(t.s) ? { e: t.e, n: t.n ?? '', s: t.s } : null;
}
