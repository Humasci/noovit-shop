import { readFileSync, readdirSync } from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';
import { getStoreProduct } from '@/lib/catalog/server';
import { bottleSvg } from '@/lib/labels/svg';

const SIZE = 1000;
const FONT_DIR = path.join(process.cwd(), 'assets/fonts');
let fontFiles: string[] | null = null;

// PNG of the branded bottle for product feeds and link previews, drawn from the same label design as the site.
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const product = await getStoreProduct((await params).slug);
  if (!product) return new Response('Not found', { status: 404 });

  fontFiles ??= readdirSync(FONT_DIR).filter((f) => f.endsWith('.ttf')).map((f) => path.join(FONT_DIR, f));
  const png = new Resvg(bottleSvg(product, 'front', { mode: 'print' }), {
    fitTo: { mode: 'width', value: SIZE },
    font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Inter' },
  })
    .render()
    .asPng();

  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400, s-maxage=604800' },
  });
}
