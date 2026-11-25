import 'server-only';
import { cookies } from 'next/headers';
import { signToken, verifyToken } from '@/lib/sign';

// Customer account session (25 Nov): passwordless. The customer asks for a link by email; opening it sets a signed,
// httpOnly cookie holding their email for 30 days. No passwords are stored. Admin sessions are separate (lib/admin).
export const ACCOUNT_COOKIE = 'noovit_account';
export const ACCOUNT_TTL = 30 * 86_400;
// Readable by the page (not httpOnly, holds nothing): lets the header say "Account" instead of "Sign in".
export const ACCOUNT_HINT = 'noovit_acct';
const LINK_TTL = 30 * 60;

export const accountLinkToken = (email: string, ttl = LINK_TTL) => signToken({ e: email.trim().toLowerCase(), p: 'acct-link' }, ttl);
// Order emails carry a sign-in link that lasts longer, so "View your order" still works a few days later.
export const ORDER_LINK_TTL = 7 * 86_400;
// Where a sign-in link may land: only account pages (never an outside address).
export const safeAccountPath = (next: string | null | undefined) => (next && /^\/account(\/[a-z0-9/-]*)?$/.test(next) ? next : '/account');
// Checkout started in this browser (the Stripe session id), so the success page can sign the buyer in here only.
export const CHECKOUT_COOKIE = 'noovit_checkout';
export const emailFromLinkToken = (token: string | null | undefined) => {
  const t = verifyToken<{ e?: string; p?: string }>(token);
  return t?.p === 'acct-link' && t.e ? t.e : null;
};
export const accountSessionToken = (email: string) => signToken({ e: email, p: 'acct' }, ACCOUNT_TTL);
export const emailFromSession = (token: string | null | undefined) => {
  const t = verifyToken<{ e?: string; p?: string }>(token);
  return t?.p === 'acct' && t.e ? t.e : null;
};

// The signed-in customer's email, or null.
export async function accountEmail() {
  return emailFromSession((await cookies()).get(ACCOUNT_COOKIE)?.value);
}
