import { NextRequest, NextResponse } from 'next/server';
import { ACCOUNT_COOKIE, ACCOUNT_HINT } from '@/lib/account/session';

export function POST(req: NextRequest) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  const res = NextResponse.redirect(`${origin}/account`, 303);
  res.cookies.delete(ACCOUNT_COOKIE);
  res.cookies.delete(ACCOUNT_HINT);
  return res;
}
