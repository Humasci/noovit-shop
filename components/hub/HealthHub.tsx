import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getStoreProducts } from '@/lib/catalog/server';
import { getPublishedPosts } from '@/lib/blog';
import { pickVersioned } from '@/lib/men';
import type { WomenSection } from '@/lib/women';
import { ProductCard } from '@/components/product/ProductCard';
import type { Product } from '@/types';
import { TrustSection } from '@/components/sections/Sections';
import { MasonryGallery } from '@/components/hub/MasonryGallery';
import { JsonLd } from '@/components/seo/JsonLd';
import { pageLd } from '@/lib/structured-data';
import { productPath } from '@/lib/urls';

// Shared layout for the Women's Health and Men's Health hubs: a full-bleed hero photo fading into the page colour
// (like Pets), sections with products and guides, a responsive photo masonry, the quiz and the trust row.
export interface HubConfig {
  crumb: string;
  path: string;
  title: string;
  intro: string;
  hero: { src: string; alt: string; position?: string };
  sections: WomenSection[];
  gallery: { src: string; alt: string }[];
  galleryTitle: string;
  footnote?: string;
}

export async function HealthHub({ cfg }: { cfg: HubConfig }) {
  const [products, posts] = await Promise.all([getStoreProducts(), getPublishedPosts().catch(() => [])]);
  const live = new Set(posts.map((p) => p.slug));
  const sections = cfg.sections
    .map((s) => ({
      ...s,
      items: pickVersioned(products, s.products),
      // Journal links only once the post is published (scheduled posts would 404).
      guides: s.guides.filter((g) => !g.href.startsWith('/blog/') || live.has(g.href.slice(6))),
    }))
    .filter((s) => s.items.length > 0);

  const ld = pageLd({
    path: cfg.path,
    name: cfg.crumb,
    description: cfg.intro,
    crumbs: [[cfg.crumb, cfg.path]],
    items: [...new Map(sections.flatMap((s) => s.items).map((p) => [p.slug, { name: p.name, path: productPath(p.slug) }])).values()],
  });

  return (
    <>
      <JsonLd data={ld} />
      {/* Hero (owner, 20 Nov): the whole photo shows on the right, fading softly into the page colour under the text;
          on phones the photo sits on top and fades into the text below. */}
      <section className="relative overflow-hidden bg-[var(--studio)]">
        <img
          src={cfg.hero.src}
          alt={cfg.hero.alt}
          fetchPriority="high"
          className={`aspect-[3/2] w-full object-cover [mask-image:linear-gradient(to_bottom,#000_70%,transparent)] md:absolute md:inset-y-0 md:right-0 md:aspect-auto md:h-full md:w-[60%] md:[mask-image:linear-gradient(to_right,transparent,#000_30%)] ${cfg.hero.position ?? 'object-center'}`}
        />
        <div className="container relative px-6 pb-14 md:py-28 lg:py-32">
          <div className="max-w-md lg:max-w-xl">
            <nav className="mb-4 text-xs text-[var(--color-muted)]">
              <Link href="/">Home</Link> / <span className="text-[var(--color-ink)]">{cfg.crumb}</span>
            </nav>
            <h1 className="text-balance text-4xl text-[var(--color-navy)] md:text-5xl lg:text-[3.4rem] lg:leading-[1.05]">{cfg.title}</h1>
            <p className="mt-5 text-lg text-[var(--color-ink)]/80">{cfg.intro}</p>
            <nav aria-label="Sections" className="mt-7 flex flex-wrap gap-2">
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--color-navy)] hover:bg-white/70">{s.title}</a>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {sections.map((s, i) => (
        <section key={s.id} id={s.id} className={`section scroll-mt-24 ${i % 2 ? 'bg-[var(--color-soft)]' : ''}`}>
          <div className="container px-6">
            <div className="mb-8 max-w-2xl">
              <h2 className="text-3xl md:text-4xl">{s.title}</h2>
              <p className="mt-3 text-[var(--color-ink)]/80">{s.intro}</p>
            </div>
            {/* Asymmetric masonry per section (owner, 20 Nov) that still ends flush: on desktop every tile is placed on a
                4-column grid (225 px rows). The photo fills one half for the full height (alternating sides); in the
                other half product cards are 2 rows tall and fact tiles fill the leftover cells (two small stacked, or
                one wide), so the section always ends in a neat rectangle. Tablet: 2 columns; phone: 1. */}
            <BentoSection s={s} index={i} />
            {s.guides.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {s.guides.map((g) => (
                  <li key={g.href}>
                    <Link href={g.href} className="inline-flex items-center gap-1 font-semibold text-[var(--color-navy)] hover:underline">{g.label} <ArrowRight className="h-4 w-4" /></Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}

      <MasonryGallery images={cfg.gallery} title={cfg.galleryTitle} />

      <section className="section">
        <div className="container px-6">
          <div className="mx-auto max-w-xl rounded-3xl bg-[var(--color-soft)] p-8 text-center">
            <h2 className="text-2xl">Not sure where to start?</h2>
            <p className="mt-2 text-[var(--color-muted)]">The 2-minute quiz suggests products for your goals, diet and life stage.</p>
            <Link href="/quiz" className="btn btn-primary mt-5">Take the quiz</Link>
          </div>
        </div>
      </section>
      <TrustSection />
      <p className="container px-6 pb-10 text-center text-xs text-[var(--color-muted)]">
        {cfg.footnote ?? 'Taking medication or managing a health condition? Talk to your doctor before starting a supplement.'}{' '}
        *These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease.
      </p>
    </>
  );
}


type Fact = NonNullable<WomenSection['facts']>[number];
type Cell = { col: string; row: string };
const place = (c: Cell) => ({ ['--gc' as string]: c.col, ['--gr' as string]: c.row });
const PLACED = 'lg:[grid-column:var(--gc)] lg:[grid-row:var(--gr)]';

function FactTile({ f, cell }: { f: Fact; cell?: Cell }) {
  const dark = f.tone === 'dark';
  return (
    <div style={cell ? place(cell) : undefined} className={`${PLACED} flex min-h-[180px] flex-col justify-between rounded-[2rem] p-6 lg:min-h-0 ${dark ? 'bg-[var(--color-navy)] text-white' : f.tone === 'accent' ? 'bg-[var(--sage)]' : 'bg-[var(--studio)]'}`}>
      <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${dark ? 'text-white/60' : 'text-[var(--color-muted)]'}`}>{f.eyebrow}</p>
      <div>
        {f.big && <p className={`font-display text-4xl xl:text-5xl ${dark ? '' : 'text-[var(--color-navy)]'}`}>{f.big}</p>}
        <p className={f.big ? `mt-2 text-sm xl:text-base ${dark ? 'text-white/75' : 'text-[var(--color-ink)]/75'}` : 'font-display text-xl text-[var(--color-navy)] xl:text-2xl'}>{f.text}</p>
      </div>
    </div>
  );
}

function BentoSection({ s, index }: { s: WomenSection & { items: Product[] }; index: number }) {
  const n = s.items.length;
  const facts = s.facts ?? [];
  const tiles: React.ReactNode[] = [];
  if (s.image) {
    const left = index % 2 === 0;
    const [a, b] = left ? [3, 4] : [1, 2]; // the half that holds products and facts
    const rows = 2 * Math.ceil(n / 2) + (n % 2 === 0 ? 1 : 0);
    const c0 = left ? 1 : 3;
    const photo = (key: string, src: string, alt: string, pos: string, cell: Cell, wide: boolean) => (
      <div key={key} style={place(cell)} className={`${PLACED} relative min-h-[300px] overflow-hidden rounded-[2rem] ${wide ? 'sm:col-span-2' : ''} sm:min-h-[380px] lg:min-h-0`}>
        <img src={src} alt={alt} loading="lazy" className={`absolute inset-0 h-full w-full object-cover ${pos}`} />
      </div>
    );
    const pos1 = s.portrait ? 'object-[center_35%]' : 'object-center';
    if (!s.image2) {
      tiles.push(photo('img', s.image, s.imageAlt ?? '', pos1, { col: `${c0} / span 2`, row: `1 / span ${rows}` }, true));
    } else if (rows === 2) {
      // Two photos side by side, each one column wide and full height.
      tiles.push(photo('img', s.image, s.imageAlt ?? '', pos1, { col: `${c0}`, row: '1 / span 2' }, false));
      tiles.push(photo('img2', s.image2.src, s.image2.alt, s.image2.position ?? 'object-center', { col: `${c0 + 1}`, row: '1 / span 2' }, false));
    } else {
      // Stacked: the main photo on top, the second below, together filling the half.
      const top = rows - (rows >= 4 ? 2 : 1);
      tiles.push(photo('img', s.image, s.imageAlt ?? '', pos1, { col: `${c0} / span 2`, row: `1 / span ${top}` }, true));
      tiles.push(photo('img2', s.image2.src, s.image2.alt, s.image2.position ?? 'object-center', { col: `${c0} / span 2`, row: `${top + 1} / span ${rows - top}` }, true));
    }
    s.items.forEach((p, k) =>
      tiles.push(
        <div key={p.id} style={place({ col: `${k % 2 ? b : a}`, row: `${1 + 2 * Math.floor(k / 2)} / span 2` })} className={PLACED}>
          <ProductCard product={p} />
        </div>,
      ),
    );
    if (n % 2) {
      const r = 2 * Math.floor((n - 1) / 2) + 1; // two small facts stacked beside the last card
      facts.slice(0, 2).forEach((f, k) => tiles.push(<FactTile key={f.text} f={f} cell={{ col: `${b}`, row: `${r + k}` }} />));
    } else if (facts[0]) {
      tiles.push(<FactTile key={facts[0].text} f={facts[0]} cell={{ col: `${a} / span 2`, row: `${rows}` }} />); // one wide fact closes the half
    }
  } else {
    s.items.slice(0, 4).forEach((p, k) =>
      tiles.push(
        <div key={p.id} style={place({ col: `${k + 1}`, row: '1 / span 2' })} className={PLACED}>
          <ProductCard product={p} />
        </div>,
      ),
    );
    facts.slice(0, Math.max(0, 4 - n)).forEach((f, k) => tiles.push(<FactTile key={f.text} f={f} cell={{ col: `${n + k + 1}`, row: '1 / span 2' }} />));
  }
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:auto-rows-[225px]">{tiles}</div>;
}
