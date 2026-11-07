'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { X, ArrowUp } from 'lucide-react';
import { CrossIcon } from '@/components/layout/Logo';

// "Ask Noovit AI" chat panel: the AI wellness advisor (app/api/advisor), opened from the header buttons. History stays in
// this tab only.
type Msg = { role: 'user' | 'assistant'; content: string };
const STARTERS = ['What helps me sleep better?', 'Which product is right for focus?', 'Can I take magnesium and ashwagandha together?', 'What does "1,000 mg" lion\'s mane mean?'];

// The server appends "\u0000" + JSON after the answer: web citations and Google's Search Suggestions chip.
type Meta = { citations?: { url: string; title: string }[]; suggestions?: string };
function splitMeta(content: string): { text: string; meta: Meta | null } {
  const i = content.indexOf('\u0000');
  if (i < 0) return { text: content, meta: null };
  try { return { text: content.slice(0, i).trimEnd(), meta: JSON.parse(content.slice(i + 1)) as Meta }; } catch { return { text: content.slice(0, i), meta: null }; }
}

// Google's Search Suggestions, shown exactly as returned (Google's terms), in a sandboxed frame; links open Google.
function SearchSuggestions({ html }: { html: string }) {
  return <iframe title="Google Search suggestions" srcDoc={html} sandbox="allow-popups allow-popups-to-escape-sandbox" className="mt-2 h-[52px] w-full border-0" />;
}

// Minimal, safe rendering: paragraphs, bullets, **bold**, internal links (/products, /guides, /quiz…) and https links
// to outside sources (new tab, nofollow).
function Rich({ text }: { text: string }) {
  const inline = (s: string, key: string) =>
    s.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g).map((part, i) => {
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const href = link[2].trim();
        return /^\/(products|guides|quiz|shop|goals)(\/[\w-]*)?$/.test(href)
          ? <Link key={`${key}-${i}`} href={href} className="font-semibold text-[var(--color-accent)] underline underline-offset-2">{link[1]}</Link>
          : /^https:\/\/[^\s]+$/.test(href)
            ? <a key={`${key}-${i}`} href={href} target="_blank" rel="noopener noreferrer nofollow" className="font-semibold text-[var(--color-accent)] underline underline-offset-2">{link[1]}</a>
            : <span key={`${key}-${i}`}>{link[1]}</span>;
      }
      const bold = part.match(/^\*\*([^*]+)\*\*$/);
      return bold ? <strong key={`${key}-${i}`}>{bold[1]}</strong> : <span key={`${key}-${i}`}>{part}</span>;
    });
  const blocks = text.split(/\n{2,}/);
  return (
    <>
      {blocks.map((b, bi) => {
        const lines = b.split('\n').filter((l) => l.trim());
        if (lines.length && lines.every((l) => /^\s*[-*•]\s+/.test(l)))
          return <ul key={bi} className="my-1.5 list-disc space-y-1 pl-5">{lines.map((l, li) => <li key={li}>{inline(l.replace(/^\s*[-*•]\s+/, ''), `${bi}-${li}`)}</li>)}</ul>;
        return <p key={bi} className="my-1.5">{lines.map((l, li) => <span key={li}>{li > 0 && <br />}{inline(l, `${bi}-${li}`)}</span>)}</p>;
      })}
    </>
  );
}

export function Advisor() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }); }, [msgs, open]);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const onOpen = () => setOpen(true); // the header's "Ask Noovit AI" / "Ask AI" buttons and the menu item
    window.addEventListener('keydown', onKey);
    window.addEventListener('noovit:advisor', onOpen);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('noovit:advisor', onOpen); };
  }, []);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    const next: Msg[] = [...msgs, { role: 'user', content: q }];
    setMsgs([...next, { role: 'assistant', content: '' }]);
    setInput('');
    setBusy(true);
    (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: 'advisor_message' });
    try {
      const history = next.map((m) => ({ role: m.role, content: splitMeta(m.content).text }));
      const res = await fetch('/api/advisor', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history }) });
      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({}));
        setMsgs([...next, { role: 'assistant', content: err.error ?? 'Sorry, something went wrong. Please try again.' }]);
        return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMsgs([...next, { role: 'assistant', content: acc }]);
      }
    } catch {
      setMsgs([...next, { role: 'assistant', content: 'Sorry, the connection dropped. Please try again.' }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {open && (
        <section
          role="dialog"
          aria-label="Noovit wellness advisor"
          className="fixed inset-x-2 bottom-2 z-[60] flex max-h-[80vh] flex-col overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white shadow-2xl sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[400px]"
        >
          <header className="flex items-center justify-between bg-[var(--color-navy)] px-5 py-3.5 text-white">
            <div className="flex items-center gap-2 text-sm font-semibold tracking-wide">
              <CrossIcon className="h-3.5 w-3.5" /> Noovit AI Wellness Advisor
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close advisor" className="rounded p-1 hover:bg-white/10">
              <X className="h-5 w-5" />
            </button>
          </header>
          <div className="flex-1 overflow-y-auto px-5 py-4 text-[15px] leading-relaxed text-[var(--color-ink)]" aria-live="polite">
            {msgs.length === 0 && (
              <div>
                <p className="text-lg font-semibold text-[var(--color-navy)]">Hi, I&apos;m your Noovit advisor.</p>
                <p className="mt-2 text-[var(--color-muted)]">Ask me about sleep, stress, focus or energy, our ingredients, or which formula might suit you.</p>
                <div className="mt-4 flex flex-col items-start gap-2">
                  {STARTERS.map((s) => (
                    <button key={s} type="button" onClick={() => send(s)} className="rounded-full border border-[var(--color-line)] px-4 py-2 text-left text-sm font-medium text-[var(--color-navy)] hover:border-[var(--color-navy)]">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'my-3 flex justify-end' : 'my-3'}>
                {m.role === 'user' ? (
                  <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-[var(--color-soft)] px-4 py-2.5">{m.content}</p>
                ) : m.content ? (
                  (() => {
                    const { text, meta } = splitMeta(m.content);
                    return (
                      <div>
                        <Rich text={text} />
                        {!!meta?.citations?.length && (
                          <div className="mt-2 text-xs text-[var(--color-muted)]">
                            <p className="font-semibold">Web sources</p>
                            <ul className="mt-1 space-y-0.5">
                              {meta.citations.map((c) => (
                                <li key={c.url}><a href={c.url} target="_blank" rel="noopener noreferrer nofollow" className="underline underline-offset-2">{c.title}</a></li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {meta?.suggestions && <SearchSuggestions html={meta.suggestions} />}
                      </div>
                    );
                  })()
                ) : (
                  <p className="text-[var(--color-muted)]">Thinking…</p>
                )}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="border-t border-[var(--color-line)] p-3"
          >
            <div className="flex items-end gap-2 rounded-2xl border border-[var(--color-line)] px-3 py-2 focus-within:border-[var(--color-navy)]">
              <label htmlFor="advisor-input" className="sr-only">Your question</label>
              <textarea
                id="advisor-input"
                ref={inputRef}
                rows={1}
                maxLength={1500}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
                placeholder="Ask about sleep, stress, focus…"
                className="max-h-28 flex-1 resize-none bg-transparent py-1 text-[15px] outline-none"
              />
              <button type="submit" disabled={busy || !input.trim()} aria-label="Send" className="rounded-full bg-[var(--color-navy)] p-2 text-white disabled:opacity-40">
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[11px] text-[var(--color-muted)]">AI answers can be wrong. Not medical advice; talk to your doctor about supplements.</p>
          </form>
        </section>
      )}
    </>
  );
}
