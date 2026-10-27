// Pre-launch guide: marks example content that must be replaced with real content before launch.
// Shown only while Settings → "Show placeholder trust content" is on, and only where real content is missing.
export function PlaceholderNote({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`inline-flex items-start gap-2 rounded-xl border border-dashed border-[var(--color-orange)] bg-[var(--color-pets-soft)] px-3 py-2 text-xs font-semibold text-[var(--color-navy)] ${className}`}>
      <span className="shrink-0 rounded bg-[var(--color-orange)] px-1.5 py-0.5 text-[10px] uppercase tracking-wider">Placeholder</span>
      <span>{children}</span>
    </p>
  );
}

export function PlaceholderBox({ note, children, className = '' }: { note: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl outline-2 outline-offset-4 outline-dashed outline-[var(--color-orange)] ${className}`}>
      <PlaceholderNote className="mb-4">{note}</PlaceholderNote>
      {children}
    </div>
  );
}
