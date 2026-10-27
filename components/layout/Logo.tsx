// The noovit⁺ wordmark: the name in Funnel Display with the mosaic cross raised like an exponent.
// The cross is drawn (five tiles, centre strongest) so it keeps its size and position in every font.
// Sizes are in em, so the logo scales with the surrounding font-size.
const TILES: [number, number, number][] = [[1, 0, 0.6], [0, 1, 0.4], [1, 1, 1], [2, 1, 0.8], [1, 2, 0.5]];

export function Plus({ color = 'var(--color-logo-plus)' }: { color?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" width="0.42em" height="0.42em" className="ml-[0.04em] inline-block overflow-visible align-[0.33em]" fill={color}>
      {TILES.map(([c, r, o]) => (
        <rect key={`${c}${r}`} x={c * 34.95} y={r * 34.95} width="30.1" height="30.1" rx="3.6" opacity={o} />
      ))}
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
