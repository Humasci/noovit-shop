'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

// Minimal scroll reveal (21 Nov): content renders visible on the server (crawlers and no-JS readers see everything);
// after hydration, blocks still below the fold fade and rise 12px into place once, as they enter. No library; honours
// prefers-reduced-motion.
export function Reveal({ children, className = '', as: Tag = 'div', id }: { children: ReactNode; className?: string; as?: 'div' | 'section'; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<'static' | 'hidden' | 'shown'>('static');
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    setState('hidden');
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setState('shown'); io.disconnect(); } }, { rootMargin: '0px 0px -10% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const motion = state === 'hidden' ? 'translate-y-3 opacity-0' : state === 'shown' ? 'translate-y-0 opacity-100' : '';
  return (
    <Tag ref={ref as never} id={id} className={`${className} ${state !== 'static' ? 'transition-[opacity,transform] duration-700 ease-out' : ''} ${motion}`}>
      {children}
    </Tag>
  );
}
