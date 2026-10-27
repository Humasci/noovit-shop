import { NextRequest, NextResponse } from 'next/server';
import { dbConfigured } from '@/lib/config';
import { subscribe, welcome } from '@/lib/marketing/subscribers';

export async function POST(req: NextRequest) {
  if (!dbConfigured()) return NextResponse.json({ error: 'Sign-up is not available yet.' }, { status: 503 });
  const body = await req.json().catch(() => ({}));
  if (body.company) return NextResponse.json({ ok: true }); // honeypot

  const email = typeof body.email === 'string' ? body.email.trim().slice(0, 200) : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });

  const waitlist = body.source === 'pets';
  if (await subscribe(email, waitlist ? 'pets-waitlist' : 'newsletter')) {
    await welcome(email).catch((err) => console.error('Welcome email failed', err));
  }
  return NextResponse.json({ ok: true, message: waitlist ? "You're on the list — we'll email you when Noovit Pets launches." : "You're in! Check your inbox for your welcome code." });
}
