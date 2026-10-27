'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

// Read-only value with a copy button (share links, codes, dashboard links).
export function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">{label}</p>
      <div className="flex items-center gap-2">
        <input readOnly value={value} onFocus={(e) => e.target.select()} className="min-w-0 flex-1 rounded-lg border border-[var(--color-line)] bg-[var(--color-soft)] px-3 py-2 font-mono text-xs" />
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(value).catch(() => {});
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="flex shrink-0 items-center gap-1 rounded-lg border border-[var(--color-line)] bg-white px-3 py-2 text-xs font-bold text-[var(--color-navy)] hover:border-[var(--color-navy)]"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
