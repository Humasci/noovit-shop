import { NextRequest, NextResponse } from 'next/server';
import { formLimited } from '@/lib/rate-limit';
import { dbConfigured } from '@/lib/config';
import { subscribe, welcome, waitlistConfirm, programWelcome } from '@/lib/marketing/subscribers';
import { enroll } from '@/lib/marketing/programs';
import { findKit } from '@/lib/tests';
import { KIT_RENAMES } from '@/lib/urls';
import { GOALS } from '@/lib/quiz';
import { addNotify } from '@/lib/marketing/notify';
import { getCatalog } from '@/lib/catalog/server';

export async function POST(req: NextRequest) {
  if (!dbConfigured()) return NextResponse.json({ error: 'Sign-up is not available yet.' }, { status: 503 });
  const body = await req.json().catch(() => ({}));
  if (body.company) return NextResponse.json({ ok: true }); // honeypot

  const email = typeof body.email === 'string' ? body.email.trim().slice(0, 200) : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  if (formLimited(req, 'newsletter', email)) return NextResponse.json({ error: 'Too many requests. Please try again in a few minutes.' }, { status: 429 });

  const waitlist = body.source === 'pets';
  const launch = body.source === 'launch'; // pre-launch "coming soon" page
  const tests = body.source === 'tests'; // at-home Nutrient Check waitlist
  const program = body.source === 'program' && body.program === 'perimenopause' ? 'perimenopause' : null; // free email programs
  const source = program ? (`program-${program}` as const) : launch ? 'launch-waitlist' : waitlist ? 'pets-waitlist' : tests ? 'tests-waitlist' : body.source === 'quiz' ? 'quiz' : 'newsletter';
  // No welcome code before launch: there's no shop to use it in yet.
  // goal: the quiz goal from the pop-up, or for the tests waitlist the kit slug (shown in Admin → Subscribers).
  const kit = tests && typeof body.kit === 'string' ? findKit(KIT_RENAMES[body.kit] ?? body.kit) : undefined;
  // Coming-soon "Notify me" on a product page: keep which product they asked about (Admin → Subscribers).
  const product = launch && typeof body.product === 'string' && /^[a-z0-9-]{2,60}$/.test(body.product) ? body.product : undefined;
  const goal = kit ? kit.slug : product ? product : GOALS.some((g) => g.id === body.goal) ? (body.goal as string) : undefined;
  // The "Notify me" list keeps every product or kit asked about (account page, launch emails).
  if (kit) await addNotify(email, 'kit', kit.slug);
  else if (product && (await getCatalog()).some((p) => p.slug === product)) await addNotify(email, 'product', product);
  // Programs: anyone can join, even an existing subscriber; the welcome goes out once per enrollment.
  if (program) {
    await subscribe(email, source, goal);
    if (await enroll(email, program)) await programWelcome(email, program).catch((err) => console.error('Welcome email failed', err));
    return NextResponse.json({ ok: true, message: "You're in. Check your inbox: your welcome email is on its way." });
  }
  if (await subscribe(email, source, goal)) {
    // Waitlists get a short "you're on the list" note (no shop code: nothing to buy yet); the launch waitlist gets
    // nothing until the shop opens; everyone else gets the welcome email with the first-order code.
    const sendIt = program ? programWelcome(email, program) : tests ? waitlistConfirm(email, 'tests', kit?.name) : waitlist ? waitlistConfirm(email, 'pets') : launch ? null : welcome(email);
    await sendIt?.catch((err) => console.error('Welcome email failed', err));
  }
  if (program) return NextResponse.json({ ok: true, message: "You're in. Check your inbox: your welcome email is on its way." });
  if (launch) return NextResponse.json({ ok: true, message: "You're on the list. We'll email you the day Noovit opens." });
  return NextResponse.json({ ok: true, message: waitlist ? "You're on the list — we'll email you when Noovit Pets launches." : tests ? "You're on the list — we'll email you when it launches." : "You're in! Check your inbox for your welcome code." });
}
