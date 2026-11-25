// The one corner shape for at-home test kits (owner, 25 Nov): four tiles along the top fading to the left, two under
// them, then two more down the right edge, strongest in the corner. Same shape everywhere; only the colour changes
// (the service line's colour, lib/tests.ts). Also the reference for kit packaging (design/brand/mosaic-corner/).
export const CORNER_TILES: { c: number; r: number; o: number }[] = [
  { c: 0, r: 0, o: 0.25 }, { c: 1, r: 0, o: 0.45 }, { c: 2, r: 0, o: 0.7 }, { c: 3, r: 0, o: 1 },
  { c: 2, r: 1, o: 0.6 }, { c: 3, r: 1, o: 0.85 },
  { c: 3, r: 2, o: 0.5 },
  { c: 3, r: 3, o: 0.28 },
];

export function MosaicCorner({ color, tile = 11, gap = 3, inset = 10, className = '' }: { color: string; tile?: number; gap?: number; inset?: number; className?: string }) {
  const step = tile + gap, size = 4 * step - gap;
  return (
    <span aria-hidden className={`pointer-events-none absolute block ${className}`} style={{ top: inset, right: inset, width: size, height: size }}>
      {CORNER_TILES.map((t) => (
        <span key={`${t.c}${t.r}`} className="absolute" style={{ left: t.c * step, top: t.r * step, width: tile, height: tile, borderRadius: tile * 0.16, background: color, opacity: t.o }} />
      ))}
    </span>
  );
}
