import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { verifyToken } from '@/lib/sign';

export async function GET(req: NextRequest) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  const payload = verifyToken<{ cid: string }>(req.nextUrl.searchParams.get('token'));
  if (!payload) return NextResponse.redirect(`${origin}/account?expired=1`);

  const session = await stripe().billingPortal.sessions.create({ customer: payload.cid, return_url: `${origin}/account` });
  return NextResponse.redirect(session.url);
}
