import 'server-only';
import { readdirSync } from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';
import { Product } from '@/types';
import { bottleSvg, BottleVariant } from './svg';
import { photoBottleSvg, usesPhoto } from './photo';

const SIZE = 1000;
const FONT_DIR = path.join(process.cwd(), 'assets/fonts');
let fontFiles: string[] | null = null;

// PNG of a bottle mockup, drawn from the same label design as everything else, with the bundled TTFs.
export function renderBottlePng(product: Product, variant: BottleVariant = 'front', backdrop: 'scene' | 'white' = 'scene') {
  fontFiles ??= readdirSync(FONT_DIR).filter((f) => f.endsWith('.ttf')).map((f) => path.join(FONT_DIR, f));
  // Single capsule/softgel products use the real bottle photo; bundles, tubs and the facts panel stay drawn.
  const svg =
    usesPhoto(product) && variant !== 'facts' ? photoBottleSvg(product, backdrop, variant === 'duo') : bottleSvg(product, variant, { mode: 'print', backdrop });
  return new Resvg(svg, {
    fitTo: { mode: 'width', value: SIZE },
    font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Inter' },
  })
    .render()
    .asPng();
}
