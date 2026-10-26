// The noovit⁺ wordmark: the name in the logo font with a raised "+" like an exponent.
// The plus is drawn (not typed) so it keeps the same size and position in every font.
// Sizes are in em, so the logo scales with the surrounding font-size.
export function Plus({ color = 'var(--color-logo-plus)' }: { color?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 400"
      width="0.4em"
      height="0.4em"
      className="ml-[0.04em] inline-block overflow-visible align-[0.33em]"
      fill={color}
    >
      <rect x="157" y="0" width="86" height="400" rx="17" />
      <rect x="0" y="157" width="400" height="86" rx="17" />
    </svg>
  );
}

export function Logo({ plusColor }: { plusColor?: string }) {
  return (
    <span className="whitespace-nowrap font-logo font-medium tracking-tight">
      noovit
      <Plus color={plusColor} />
    </span>
  );
}
