import { Fragment, type ReactNode } from 'react';

// The brand name in running text: "noovit" + a small raised opal "+", in the surrounding font.
// The plus is drawn with CSS (::after), so search engines and screen readers read plain "noovit".
// Always lowercase, even inside uppercase eyebrows.
export function Brand() {
  return (
    <span className="whitespace-nowrap normal-case after:relative after:-top-[0.5em] after:ml-[0.04em] after:text-[0.62em] after:font-bold after:text-[var(--color-logo-plus)] after:content-['+']">
      noovit
    </span>
  );
}

// Swaps every "Noovit" in a string for <Brand />. Social handles like "@noovit" and web addresses stay as typed.
export function brandify(text: string): ReactNode {
  const parts = text.split(/(?<![@./\w-])noovit(?![\w.@-]*\.com)\b/gi);
  if (parts.length === 1) return text;
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 && <Brand />}
    </Fragment>
  ));
}
