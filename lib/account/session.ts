import 'server-only';
import { cookies } from 'next/headers';
import { signToken, verifyToken } from '@/lib/sign';

// Customer account session (25 Nov): passwordless. The customer asks for a link by email; opening it sets a signed,
// httpOnly cookie holding their email for 30 days. No passwords are stored. Admin sessions are separate (lib/admin).
export const ACCOUNT_COOKIE = 'noovit_account';
export const ACCOUNT_TTL = 30 * 86_400;
const LINK_TTL = 30 * 60;

export const accountLinkToken = (email: string) => signToken({ e: email.trim().toLowerCase(), p: 'acct-link' }, LINK_TTL);
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
