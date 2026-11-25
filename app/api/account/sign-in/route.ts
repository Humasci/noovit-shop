import { NextRequest, NextResponse } from 'next/server';
import { formLimited } from '@/lib/rate-limit';
import { dbConfigured } from '@/lib/config';
import { knownEmail } from '@/lib/account/data';
import { accountLinkToken } from '@/lib/account/session';
import { sendAccountLink } from '@/lib/email';

// Passwordless sign-in: emails a 30-minute link. Same reply whether or not we know the email, so addresses can't be probed.
const GENERIC = { message: "If we have that email on file, a sign-in link is on its way. It works for 30 minutes." };

export async function POST(req: NextRequest) {
  if (!dbConfigured()) return NextResponse.json({ error: 'Accounts are not set up yet.' }, { status: 503 });
  const { email } = await req.json().catch(() => ({}));
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }
  if (formLimited(req, 'account', email)) return NextResponse.json({ error: 'Too many requests. Please try again in a few minutes.' }, { status: 429 });

  const normalized = email.trim().toLowerCase();
  if (await knownEmail(normalized)) {
    const origin = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
    await sendAccountLink(normalized, `${origin}/api/account/session?token=${encodeURIComponent(accountLinkToken(normalized))}`).catch((err) =>
      console.error('Account link email failed', err)
    );
  }
  return NextResponse.json(GENERIC);
}
