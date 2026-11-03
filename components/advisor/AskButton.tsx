'use client';

import { CrossIcon } from '@/components/layout/Logo';

// Opens the floating advisor (components/advisor/Advisor.tsx) from anywhere on the page.
export function AskButton({ label = 'Ask Noovit AI', className = '' }: { label?: string; className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event('noovit:advisor'))} className={`btn ${className}`}>
      <CrossIcon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}
