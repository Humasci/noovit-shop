import { NextRequest, NextResponse } from 'next/server';
import { sendContactMessage } from '@/lib/email';
import { supportEmail } from '@/lib/settings';

const TOPICS = ['Product question', 'Order status', 'Shipping & delivery', 'Subscription', 'Returns & refunds', 'Wholesale', 'Other'];
const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (body.website) return NextResponse.json({ ok: true }); // honeypot: bots fill hidden fields

  const name = clean(body.name, 80);
  const email = clean(body.email, 200);
  const topic = TOPICS.includes(body.topic) ? body.topic : 'Other';
  const message = clean(body.message, 5000);
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please fill in your name, a valid email and a message.' }, { status: 400 });
  }
  const sent = await sendContactMessage(await supportEmail(), { name, email, topic, message }).catch((err) => {
    console.error('Contact message failed', err);
    return false;
  });
  if (!sent) {
    return NextResponse.json({ error: 'Sorry, your message could not be sent. Please email us instead.' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
