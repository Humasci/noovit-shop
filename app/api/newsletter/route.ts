import { NextRequest, NextResponse } from 'next/server';
import { dbConfigured } from '@/lib/config';
import { subscribe, welcome, waitlistConfirm } from '@/lib/marketing/subscribers';
import { findKit } from '@/lib/tests';
import { KIT_RENAMES } from '@/lib/urls';
import { GOALS } from '@/lib/quiz';

export async function POST(req: NextRequest) {
  if (!dbConfigured()) return NextResponse.json({ error: 'Sign-up is not available yet.' }, { status: 503 });
  const body = await req.json().catch(() => ({}));
  if (body.company) return NextResponse.json({ ok: true }); // honeypot

  const email = typeof body.email === 'string' ? body.email.trim().slice(0, 200) : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });

  const waitlist = body.source === 'pets';
  const launch = body.source === 'launch'; // pre-launch "coming soon" page
  const tests = body.source === 'tests'; // at-home Nutrient Check waitlist
  const source = launch ? 'launch-waitlist' : waitlist ? 'pets-waitlist' : tests ? 'tests-waitlist' : body.source === 'quiz' ? 'quiz' : 'newsletter';
  // No welcome code before launch: there's no shop to use it in yet.
  // goal: the quiz goal from the pop-up, or for the tests waitlist the kit slug (shown in Admin → Subscribers).
  const kit = tests && typeof body.kit === 'string' ? findKit(KIT_RENAMES[body.kit] ?? body.kit) : undefined;
  const goal = kit ? kit.slug : GOALS.some((g) => g.id === body.goal) ? (body.goal as string) : undefined;
  if (await subscribe(email, source, goal)) {
    // Waitlists get a short "you're on the list" note (no shop code: nothing to buy yet); the launch waitlist gets
    // nothing until the shop opens; everyone else gets the welcome email with the first-order code.
    const sendIt = tests ? waitlistConfirm(email, 'tests', kit?.name) : waitlist ? waitlistConfirm(email, 'pets') : launch ? null : welcome(email);
    await sendIt?.catch((err) => console.error('Welcome email failed', err));
  }
  if (launch) return NextResponse.json({ ok: true, message: "You're on the list. We'll email you the day Noovit opens." });
  return NextResponse.json({ ok: true, message: waitlist ? "You're on the list — we'll email you when Noovit Pets launches." : tests ? "You're on the list — we'll email you when it launches." : "You're in! Check your inbox for your welcome code." });
}
