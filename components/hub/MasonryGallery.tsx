// Photo masonry that always ends flush (owner, 20 Nov). Desktop: 4 columns × 220 px rows, filled in blocks of six
// photos that tile a 4×3 rectangle exactly (one large, two small, one tall, one small, one wide), every other block
// mirrored for variety. A last partial block falls back to equal tiles. Tablet: 3 columns, phones: 2, square tiles.
const BLOCK: { col: [number, number]; row: [number, number] }[] = [
  { col: [1, 2], row: [1, 2] }, // large
  { col: [3, 1], row: [1, 1] }, // small
  { col: [4, 1], row: [1, 2] }, // tall
  { col: [3, 1], row: [2, 1] }, // small
  { col: [1, 1], row: [3, 1] }, // small
  { col: [2, 3], row: [3, 1] }, // wide
];

export function MasonryGallery({ images, title, eyebrow }: { images: { src: string; alt: string }[]; title?: string; eyebrow?: string }) {
  if (!images.length) return null;
  const full = Math.floor(images.length / 6) * 6;
  return (
    <section className="section">
      <div className="container px-6">
        {(title || eyebrow) && (
          <div className="mb-8 text-center">
            {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">{eyebrow}</p>}
            {title && <h2 className="text-3xl md:text-4xl">{title}</h2>}
          </div>
        )}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:auto-rows-[220px]">
          {images.map((im, i) => {
            let style: Record<string, string> | undefined;
            if (i < full) {
              const b = Math.floor(i / 6), t = BLOCK[i % 6], mirror = b % 2 === 1;
              const col = mirror ? 5 - (t.col[0] + t.col[1] - 1) : t.col[0];
              style = { ['--gc']: `${col} / span ${t.col[1]}`, ['--gr']: `${b * 3 + t.row[0]} / span ${t.row[1]}` };
            }
            return (
              <div key={im.src} style={style} className="relative aspect-square overflow-hidden rounded-2xl lg:aspect-auto lg:[grid-column:var(--gc)] lg:[grid-row:var(--gr)]">
                <img src={im.src} alt={im.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
