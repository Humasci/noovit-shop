// A field of small square tiles that thins out away from one corner or edge, like light breaking into pixels.
// Tiles are placed with a seeded random so server and client render the same field. With `animate`, each tile
// slowly fades down and back up on its own rhythm (CSS only; static for reduced-motion users).
type Anchor = 'top-right' | 'right' | 'bottom' | 'top';

function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
}

export function MosaicField({
  cols,
  rows,
  tile = 12,
  gap = 3,
  color = 'var(--color-orange)',
  anchor = 'top-right',
  density = 0.9,
  maxOpacity = 0.85,
  animate = true,
  seed = 7,
  className = '',
}: {
  cols: number;
  rows: number;
  tile?: number;
  gap?: number;
  color?: string;
  anchor?: Anchor;
  density?: number;
  maxOpacity?: number;
  animate?: boolean;
  seed?: number;
  className?: string;
}) {
  const rnd = seeded(seed);
  const step = tile + gap;
  const tiles: { x: number; y: number; o: number; d: number; delay: number }[] = [];
  for (let c = 0; c < cols; c++)
    for (let r = 0; r < rows; r++) {
      const fx = c / Math.max(1, cols - 1);
      const fy = r / Math.max(1, rows - 1);
      const w =
        anchor === 'right' ? fx : anchor === 'bottom' ? fy : anchor === 'top' ? 1 - fy : Math.max(0, 1 - Math.hypot(1 - fx, fy) / 1.15);
      if (rnd() < density * w * w) tiles.push({ x: c * step, y: r * step, o: Math.min(maxOpacity, (0.12 + 0.75 * rnd()) * w), d: 4 + rnd() * 6, delay: -rnd() * 10 });
    }
  return (
    <div aria-hidden className={`pointer-events-none absolute ${className}`} style={{ width: cols * step - gap, height: rows * step - gap }}>
      {tiles.map((t, i) => (
        <span
          key={i}
          className={`absolute ${animate ? 'mosaic-twinkle' : ''}`}
          style={{ left: t.x, top: t.y, width: tile, height: tile, borderRadius: tile * 0.14, background: color, opacity: t.o, ['--o' as string]: t.o, animationDuration: `${t.d}s`, animationDelay: `${t.delay}s` }}
        />
      ))}
    </div>
  );
}
