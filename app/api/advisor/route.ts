import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getStoreProducts } from '@/lib/catalog/server';
import { ADVISOR_MODEL, advisorEnabled, advisorSystemPrompt } from '@/lib/advisor';

// Streams the advisor's reply as plain text. Conversation state lives in the browser; each request carries the
// (trimmed) history. Best-effort per-instance rate limit; Vercel's firewall can add a global one.

export const runtime = 'nodejs';
export const maxDuration = 60;

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 20;
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_REQUESTS;
}

const client = new Anthropic();

export async function POST(req: NextRequest) {
  if (!advisorEnabled()) return NextResponse.json({ error: 'The advisor is not available yet.' }, { status: 503 });
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (limited(ip)) return NextResponse.json({ error: "You've sent a lot of messages. Please try again in a few minutes." }, { status: 429 });

  const body = await req.json().catch(() => ({}));
  const raw: unknown[] = Array.isArray(body.messages) ? body.messages.slice(-16) : [];
  const messages: Anthropic.Beta.BetaMessageParam[] = [];
  for (const m of raw) {
    const role = (m as { role?: string }).role;
    const content = (m as { content?: unknown }).content;
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string' || !content.trim()) continue;
    messages.push({ role, content: content.slice(0, 1500) });
  }
  while (messages.length && messages[0].role !== 'user') messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== 'user')
    return NextResponse.json({ error: 'Please type a question.' }, { status: 400 });

  const system = advisorSystemPrompt(await getStoreProducts());
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const s = client.beta.messages.stream({
          model: ADVISOR_MODEL,
          max_tokens: 2000,
          output_config: { effort: 'low' }, // short chat answers
          // Server-side refusal fallback: a declined turn is retried on a suitable model inside the same call.
          betas: ['server-side-fallback-2026-07-01'],
          fallbacks: 'default',
          system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
          messages,
        });
        for await (const event of s) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') controller.enqueue(encoder.encode(event.delta.text));
        }
        const final = await s.finalMessage();
        if (final.stop_reason === 'refusal') controller.enqueue(encoder.encode("Sorry, I can't help with that one. For anything medical, please check with your doctor or pharmacist."));
      } catch (err) {
        if (err instanceof Anthropic.RateLimitError) controller.enqueue(encoder.encode('The advisor is busy right now. Please try again in a minute.'));
        else {
          console.error('Advisor error', err);
          controller.enqueue(encoder.encode('Sorry, something went wrong. Please try again, or email hello@noovit.com.'));
        }
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } });
}
