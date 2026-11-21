'use client';

import { useEffect, useRef, type ReactNode } from 'react';

// Minimal scroll reveal (21 Nov): content renders visible on the server (crawlers and no-JS readers see everything);
// after hydration, blocks still below the fold fade and rise 12px into place once, as they enter. No library; honours
// prefers-reduced-motion. Classes are toggled on the element directly (no state, so no extra renders).
const HIDDEN = ['translate-y-3', 'opacity-0'];
const MOTION = ['transition-[opacity,transform]', 'duration-700', 'ease-out'];

export function Reveal({ children, className = '', as: Tag = 'div', id }: { children: ReactNode; className?: string; as?: 'div' | 'section'; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    el.classList.add(...MOTION, ...HIDDEN);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.remove(...HIDDEN); io.disconnect(); } }, { rootMargin: '0px 0px -10% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref as never} id={id} className={className}>
      {children}
    </Tag>
  );
}
