import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { dbConfigured } from '@/lib/config';
import { sendReviewRequests } from '@/lib/marketing/review-requests';

// Vercel Cron calls this daily (vercel.json) with "Authorization: Bearer <CRON_SECRET>".
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || !dbConfigured()) return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  const given = Buffer.from(req.headers.get('authorization') ?? '');
  const expected = Buffer.from(`Bearer ${secret}`);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const reviewRequests = await sendReviewRequests();
  return NextResponse.json({ ok: true, reviewRequests });
}
