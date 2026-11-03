import { NextRequest, NextResponse } from 'next/server';
import { ApiError, GoogleGenAI, ThinkingLevel, type Content } from '@google/genai';
import { getStoreProducts } from '@/lib/catalog/server';
import { getPublishedPosts } from '@/lib/blog';
import { ADVISOR_MODEL, advisorApiKey, advisorEnabled, advisorSearch, advisorSystemPrompt } from '@/lib/advisor';
import { retrieve, sourcesBlock } from '@/lib/advisor-rag';

// Streams the advisor's reply as plain text. After the text, one line starting with "\u0000" carries JSON
// metadata: the web pages Google Search used (citations) and Google's Search Suggestions chip (renderedContent),
// which Google's terms require us to show, unmodified, under every search-grounded answer.
// History lives in the browser; each request carries the (trimmed) conversation. Best-effort per-instance rate limit.

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

let client: GoogleGenAI | null = null;
const ai = () =>
  (client ??= new GoogleGenAI({ apiKey: advisorApiKey(), ...(process.env.GEMINI_BASE_URL ? { httpOptions: { baseUrl: process.env.GEMINI_BASE_URL } } : {}) }));

export async function POST(req: NextRequest) {
  if (!advisorEnabled()) return NextResponse.json({ error: 'The advisor is not available yet.' }, { status: 503 });
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (limited(ip)) return NextResponse.json({ error: "You've sent a lot of messages. Please try again in a few minutes." }, { status: 429 });

  const body = await req.json().catch(() => ({}));
  const raw: unknown[] = Array.isArray(body.messages) ? body.messages.slice(-16) : [];
  const turns: { role: 'user' | 'assistant'; content: string }[] = [];
  for (const m of raw) {
    const role = (m as { role?: string }).role;
    const content = (m as { content?: unknown }).content;
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string' || !content.trim()) continue;
    turns.push({ role, content: content.slice(0, 1500) });
  }
  while (turns.length && turns[0].role !== 'user') turns.shift();
  if (!turns.length || turns[turns.length - 1].role !== 'user') return NextResponse.json({ error: 'Please type a question.' }, { status: 400 });

  const [products, posts] = await Promise.all([getStoreProducts(), getPublishedPosts().catch(() => [])]);
  // Retrieve with the latest question plus the one before it (follow-ups like "and at night?" need context).
  const userTurns = turns.filter((t) => t.role === 'user');
  const query = userTurns.slice(-2).map((t) => t.content).join(' ');
  const passages = retrieve(products, posts, query, 6);
  const contents: Content[] = turns.map((t, i) => ({
    role: t.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: i === turns.length - 1 ? `${sourcesBlock(passages)}\n\nShopper's question: ${t.content}` : t.content }],
  }));

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const citations = new Map<string, string>();
      let suggestions = '';
      try {
        const res = await ai().models.generateContentStream({
          model: ADVISOR_MODEL,
          contents,
          config: {
            systemInstruction: advisorSystemPrompt(products),
            maxOutputTokens: 1200,
            thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL }, // short chat answers; keeps cost down
            ...(advisorSearch() ? { tools: [{ googleSearch: {} }] } : {}),
          },
        });
        let any = false;
        for await (const chunk of res) {
          const text = chunk.text;
          if (text) { any = true; controller.enqueue(encoder.encode(text)); }
          const gm = chunk.candidates?.[0]?.groundingMetadata;
          for (const c of gm?.groundingChunks ?? []) if (c.web?.uri) citations.set(c.web.uri, c.web.title ?? c.web.uri);
          if (gm?.searchEntryPoint?.renderedContent) suggestions = gm.searchEntryPoint.renderedContent;
        }
        if (!any) controller.enqueue(encoder.encode("Sorry, I can't help with that one. For anything medical, please check with your doctor or pharmacist."));
      } catch (err) {
        if (err instanceof ApiError && err.status === 429) controller.enqueue(encoder.encode('The advisor is busy right now. Please try again in a minute.'));
        else {
          console.error('Advisor error', err);
          controller.enqueue(encoder.encode('Sorry, something went wrong. Please try again, or email hello@noovit.com.'));
        }
      } finally {
        if (citations.size || suggestions)
          controller.enqueue(encoder.encode(`\n\u0000${JSON.stringify({ citations: [...citations].slice(0, 5).map(([url, title]) => ({ url, title })), suggestions })}`));
        controller.close();
      }
    },
  });
  return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } });
}
