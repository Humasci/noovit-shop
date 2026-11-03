import { Fragment, type ReactNode } from 'react';

// The brand name in running text: "noovit" + the small raised five-tile cross, in the surrounding font.
// The cross is drawn with CSS (.brand-word::after in globals.css), so search engines and screen readers read plain "noovit".
// Always lowercase; inside uppercase, letter-spaced eyebrows it switches to the logo font with normal spacing (globals.css).
export function Brand() {
  return (
    <span className="brand-word whitespace-nowrap normal-case">
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
