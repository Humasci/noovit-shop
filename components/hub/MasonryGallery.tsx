// Responsive masonry grid (CSS columns): 2 columns on phones, 3 on tablets, 4 on desktops. Images keep their own
// shape, so portrait and landscape photos sit together without cropping.
export function MasonryGallery({ images, title, eyebrow }: { images: { src: string; alt: string }[]; title?: string; eyebrow?: string }) {
  if (!images.length) return null;
  return (
    <section className="section">
      <div className="container px-6">
        {(title || eyebrow) && (
          <div className="mb-8 text-center">
            {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">{eyebrow}</p>}
            {title && <h2 className="text-3xl md:text-4xl">{title}</h2>}
          </div>
        )}
        <div className="columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
          {images.map((im) => (
            <img key={im.src} src={im.src} alt={im.alt} loading="lazy" className="mb-3 block w-full break-inside-avoid rounded-2xl sm:mb-4" />
          ))}
        </div>
      </div>
    </section>
  );
}
