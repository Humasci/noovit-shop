import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/sign';
import { unsubscribe } from '@/lib/marketing/subscribers';
import { SITE_URL } from '@/lib/site';

// One-click unsubscribe (RFC 8058): mail clients POST here from the List-Unsubscribe header.
export async function POST(req: NextRequest) {
  const payload = verifyToken<{ e: string; p: string }>(req.nextUrl.searchParams.get('token'));
  if (!payload || payload.p !== 'unsub') return NextResponse.json({ error: 'Invalid link' }, { status: 400 });
  await unsubscribe(payload.e);
  return NextResponse.json({ ok: true });
}

// A plain click lands on the confirmation page instead (link scanners pre-fetch GETs).
export function GET(req: NextRequest) {
  return NextResponse.redirect(`${SITE_URL}/unsubscribe?token=${encodeURIComponent(req.nextUrl.searchParams.get('token') ?? '')}`);
}
