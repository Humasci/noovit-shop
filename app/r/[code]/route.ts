import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/server';
import { dbConfigured } from '@/lib/config';
import { CODE_PATTERN, REF_COOKIE, REF_DAYS, normalizeCode } from '@/lib/affiliates';

// Partner share link: noovit.com/r/CODE[?to=/products/slug]. Remembers the partner (last click wins)
// so checkout pre-applies their code and credits them, then sends the visitor on.
export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const code = normalizeCode((await params).code);
  const to = req.nextUrl.searchParams.get('to') ?? '/';
  let dest = new URL(to.startsWith('/') ? to : '/', req.url);
  if (dest.origin !== req.nextUrl.origin) dest = new URL('/', req.url); // only same-site destinations
  const res = NextResponse.redirect(dest);
  if (!CODE_PATTERN.test(code) || !dbConfigured()) return res;

  const { data: affiliate } = await db().from('affiliates').select('id').eq('code', code).eq('status', 'active').maybeSingle();
  if (!affiliate) return res;
  await db().rpc('track_affiliate_click', { p_code: code });
  res.cookies.set(REF_COOKIE, code, {
    httpOnly: true,
    secure: req.nextUrl.protocol === 'https:',
    sameSite: 'lax',
    path: '/',
    maxAge: REF_DAYS * 86_400,
  });
  return res;
}
