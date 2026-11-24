import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { sendCallReport } from '@/lib/email';
import { supportEmail } from '@/lib/settings';

// Vapi "Server URL" (docs/vapi/AGENT.md): Vapi posts events here; at the end of every call we email the summary and
// transcript to the support inbox, so supplier call-backs, messages and reaction reports are never missed.
// Auth: the shared secret VAPI_WEBHOOK_SECRET, sent by Vapi as the "x-vapi-secret" header (or as a Bearer token).
const same = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

export async function POST(req: NextRequest) {
  const secret = process.env.VAPI_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  const given = req.headers.get('x-vapi-secret') ?? req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
  if (!same(given, secret)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const m = body?.message;
  if (m?.type !== 'end-of-call-report') return NextResponse.json({ ok: true, ignored: m?.type ?? 'unknown' });

  const caller: string = m.call?.customer?.number || m.customer?.number || 'an unknown number';
  const summary: string = m.analysis?.summary || m.summary || '';
  const transcript: string = (m.artifact?.transcript || m.transcript || '').slice(0, 20_000);
  const seconds = Number(m.durationSeconds ?? (m.startedAt && m.endedAt ? (Date.parse(m.endedAt) - Date.parse(m.startedAt)) / 1000 : 0));
  const minutes = seconds ? `${Math.max(1, Math.round(seconds / 60))} min` : 'unknown';
  try {
    await sendCallReport(await supportEmail(), { caller, summary, transcript, endedReason: String(m.endedReason ?? 'unknown'), minutes });
  } catch (err) {
    console.error('Call report email failed', err);
  }
  return NextResponse.json({ ok: true });
}
