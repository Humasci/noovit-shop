'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

// Multi-line text (e.g. a shipping address) with a copy button, for pasting into a supplier's order form.
export function CopyBlock({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-start gap-3 rounded-xl bg-[var(--color-soft)] p-3">
      <pre className="min-w-0 flex-1 whitespace-pre-wrap font-sans text-sm">{text}</pre>
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(text).catch(() => {});
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="flex shrink-0 items-center gap-1 rounded-lg border border-[var(--color-line)] bg-white px-3 py-2 text-xs font-bold text-[var(--color-navy)] hover:border-[var(--color-navy)]"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied ? 'Copied' : label}
      </button>
    </div>
  );
}
