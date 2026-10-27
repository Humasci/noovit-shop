import { CROSS_GAP, MARK_CROSS, crossTile } from '@/lib/brand/cross';

// The noovit⁺ wordmark: the name in Funnel Display with the five-tile mosaic cross raised like an exponent.
// The cross is drawn (lib/brand/cross.ts) so it keeps its size and position in every font.
// Sizes are in em, so the logo scales with the surrounding font-size.
const T = crossTile(MARK_CROSS, 100);

export function Plus({ color = 'var(--color-logo-plus)' }: { color?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" width="0.44em" height="0.44em" className="ml-[0.04em] inline-block overflow-visible align-[0.32em]" fill={color}>
      {MARK_CROSS.tiles.map(({ c, r, o }) => (
        <rect key={`${c}${r}`} x={c * T * (1 + CROSS_GAP)} y={r * T * (1 + CROSS_GAP)} width={T} height={T} rx={T * 0.12} opacity={o} />
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
