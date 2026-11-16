import 'server-only';
import { readdirSync } from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';
import { Product } from '@/types';
import { bottleSvg, BottleVariant } from './svg';
import { usesPhoto } from './photo';
import { studioPhotoPng } from './studio';
import { gallerySvg } from './gallery';
import { GalleryVariant } from './gallery-data';

const SIZE = 1000;
const FONT_DIR = path.join(process.cwd(), 'assets/fonts');
let fontFiles: string[] | null = null;

// PNG of a product image. Single capsule/softgel products use the photoreal studio shot (lib/labels/studio.ts) for
// the front and the label close-up, and inside the gallery images; bundles, tubs and the facts panel stay drawn.
export async function renderBottlePng(product: Product, variant: BottleVariant | GalleryVariant = 'front', backdrop: 'scene' | 'white' = 'scene'): Promise<Buffer> {
  fontFiles ??= readdirSync(FONT_DIR).filter((f) => f.endsWith('.ttf')).map((f) => path.join(FONT_DIR, f));
  const photo = usesPhoto(product);
  if (photo && (variant === 'front' || variant === 'duo')) return studioPhotoPng(product, SIZE, variant === 'duo' ? 'closeup' : 'front');
  const svg =
    variant === 'highlights' || variant === 'compare'
      ? gallerySvg(product, variant, photo ? `data:image/png;base64,${(await studioPhotoPng(product, 800)).toString('base64')}` : undefined)
      : bottleSvg(product, variant, { mode: 'print', backdrop });
  return Buffer.from(
    new Resvg(svg, {
      fitTo: { mode: 'width', value: SIZE },
      font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Inter' },
    })
      .render()
      .asPng()
  );
}
