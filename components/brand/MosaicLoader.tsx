import { CROSS_GAP, CROSS_TILES, crossTile } from '@/lib/brand/cross';

// The mosaic cross "breathing": the arms light up in turn, clockwise (top → right → bottom → left), each from
// the centre outwards, while the centre tile breathes slowly. Pure CSS (keyframes in globals.css); static for
// reduced-motion users.
const ARM_DELAY = { core: 0, top: 0, right: 0.45, bottom: 0.9, left: 1.35 } as const;

export function MosaicLoader({ size = 40, color = 'var(--color-orange)', label = 'Loading' }: { size?: number; color?: string; label?: string }) {
  const t = crossTile(size);
  const step = t * (1 + CROSS_GAP);
  return (
    <span role="status" aria-label={label} className="relative inline-block shrink-0" style={{ width: size, height: size }}>
      {CROSS_TILES.map(({ c, r, arm, ring }) => (
        <span
          key={`${c}${r}`}
          className={`absolute ${arm === 'core' ? 'mosaic-core' : 'mosaic-breathe'}`}
          style={{ left: c * step, top: r * step, width: t, height: t, borderRadius: t * 0.14, background: color, animationDelay: `${ARM_DELAY[arm] + (ring === 2 ? 0.14 : 0)}s` }}
        />
      ))}
    </span>
  );
}

// Full-area loading state for route transitions and long waits.
export function LoadingScreen({ message }: { message?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <MosaicLoader size={52} />
      {message && <p className="text-sm text-[var(--color-muted)]">{message}</p>}
    </div>
  );
}
