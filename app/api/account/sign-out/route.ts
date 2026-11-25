import { NextRequest, NextResponse } from 'next/server';
import { ACCOUNT_COOKIE } from '@/lib/account/session';

export function POST(req: NextRequest) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  const res = NextResponse.redirect(`${origin}/account`, 303);
  res.cookies.delete(ACCOUNT_COOKIE);
  return res;
}
