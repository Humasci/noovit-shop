'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

// Evidence-file guide navigation (21 Nov): a sticky table of contents with scroll-spy and a reading-progress line.
// Desktop: a left column that follows you. Mobile: a slim sticky bar showing the current section; tap to open the list.
export function GuideToc({ items }: { items: [string, string][] }) {
  const [active, setActive] = useState(items[0]?.[0]);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const els = items.map(([id]) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: '-20% 0px -65% 0px' },
    );
    els.forEach((e) => io.observe(e));
    const onScroll = () => {
      const h = document.documentElement;
      setProgress(Math.min(1, h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll); };
  }, [items]);

  const current = items.find(([id]) => id === active)?.[1] ?? items[0]?.[1];
  const link = (id: string, label: string, i: number) => (
    <a
      href={`#${id}`}
      onClick={() => setOpen(false)}
      aria-current={active === id ? 'location' : undefined}
      className={`group flex items-baseline gap-3 rounded-lg px-3 py-1.5 text-sm transition-colors ${active === id ? 'bg-white font-semibold text-[var(--color-navy)] shadow-sm' : 'text-[var(--color-muted)] hover:text-[var(--color-navy)]'}`}
    >
      <span className="w-5 shrink-0 text-[11px] tabular-nums text-[var(--color-muted)]">{String(i + 1).padStart(2, '0')}</span>
      <span>{label}</span>
    </a>
  );

  return (
    <>
      {/* desktop */}
      <nav aria-label="On this page" className="sticky top-28 hidden max-h-[calc(100vh-8rem)] overflow-y-auto lg:block">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">On this page</p>
        <div className="mx-3 mt-2 h-0.5 overflow-hidden rounded bg-[var(--color-line)]">
          <div className="h-full bg-[var(--color-navy)] transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
        </div>
        <ol className="mt-3 space-y-0.5">{items.map(([id, label], i) => <li key={id}>{link(id, label, i)}</li>)}</ol>
      </nav>
      {/* mobile */}
      <div className="-mx-6 border-b border-[var(--color-line)] bg-white/95 backdrop-blur lg:hidden">
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center justify-between gap-3 px-6 py-3 text-left text-sm">
          <span className="truncate"><span className="text-[var(--color-muted)]">On this page: </span><b className="text-[var(--color-navy)]">{current}</b></span>
          <ChevronDown aria-hidden className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        <div className="h-0.5 bg-[var(--color-navy)] transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
        {open && <ol className="max-h-[60vh] overflow-y-auto bg-[var(--color-soft)] px-3 py-3">{items.map(([id, label], i) => <li key={id}>{link(id, label, i)}</li>)}</ol>}
      </div>
    </>
  );
}
