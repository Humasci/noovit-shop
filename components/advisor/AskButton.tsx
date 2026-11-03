'use client';

import { Sparkles } from 'lucide-react';

// Opens the floating advisor (components/advisor/Advisor.tsx) from anywhere on the page.
export function AskButton({ label = 'Ask Noovit', className = '' }: { label?: string; className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event('noovit:advisor'))} className={`btn ${className}`}>
      <Sparkles className="h-4 w-4 text-[var(--color-orange)]" aria-hidden /> {label}
    </button>
  );
}
