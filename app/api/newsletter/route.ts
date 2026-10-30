import { NextRequest, NextResponse } from 'next/server';
import { dbConfigured } from '@/lib/config';
import { subscribe, welcome } from '@/lib/marketing/subscribers';
import { GOALS } from '@/lib/quiz';

export async function POST(req: NextRequest) {
  if (!dbConfigured()) return NextResponse.json({ error: 'Sign-up is not available yet.' }, { status: 503 });
  const body = await req.json().catch(() => ({}));
  if (body.company) return NextResponse.json({ ok: true }); // honeypot

  const email = typeof body.email === 'string' ? body.email.trim().slice(0, 200) : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });

  const waitlist = body.source === 'pets';
  const launch = body.source === 'launch'; // pre-launch "coming soon" page
  const source = launch ? 'launch-waitlist' : waitlist ? 'pets-waitlist' : body.source === 'quiz' ? 'quiz' : 'newsletter';
  // No welcome code before launch: there's no shop to use it in yet.
  const goal = GOALS.some((g) => g.id === body.goal) ? (body.goal as string) : undefined;
  if ((await subscribe(email, source, goal)) && !launch) {
    await welcome(email).catch((err) => console.error('Welcome email failed', err));
  }
  if (launch) return NextResponse.json({ ok: true, message: "You're on the list. We'll email you the day Noovit opens." });
  return NextResponse.json({ ok: true, message: waitlist ? "You're on the list — we'll email you when Noovit Pets launches." : "You're in! Check your inbox for your welcome code." });
}
