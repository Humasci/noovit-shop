import { CROSS_GAP, CROSS_TILES, CROSS_GRID } from '@/lib/brand/cross';

// The noovit⁺ wordmark: the name in Funnel Display with the mosaic cross raised like an exponent.
// The cross is drawn (lib/brand/cross.ts) so it keeps its size and position in every font.
// Sizes are in em, so the logo scales with the surrounding font-size.
const STEP = 100 / (CROSS_GRID + (CROSS_GRID - 1) * CROSS_GAP);

export function Plus({ color = 'var(--color-logo-plus)' }: { color?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" width="0.44em" height="0.44em" className="ml-[0.04em] inline-block overflow-visible align-[0.32em]" fill={color}>
      {CROSS_TILES.map(({ c, r, o }) => (
        <rect key={`${c}${r}`} x={c * STEP * (1 + CROSS_GAP)} y={r * STEP * (1 + CROSS_GAP)} width={STEP} height={STEP} rx={STEP * 0.12} opacity={o} />
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
