import 'server-only';
import { readdirSync } from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';
import { Product } from '@/types';
import { bottleSvg, BottleVariant } from './svg';

const SIZE = 1000;
const FONT_DIR = path.join(process.cwd(), 'assets/fonts');
let fontFiles: string[] | null = null;

// PNG of a bottle mockup, drawn from the same label design as everything else, with the bundled TTFs.
export function renderBottlePng(product: Product, variant: BottleVariant = 'front', backdrop: 'scene' | 'white' = 'scene') {
  fontFiles ??= readdirSync(FONT_DIR).filter((f) => f.endsWith('.ttf')).map((f) => path.join(FONT_DIR, f));
  return new Resvg(bottleSvg(product, variant, { mode: 'print', backdrop }), {
    fitTo: { mode: 'width', value: SIZE },
    font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Inter' },
  })
    .render()
    .asPng();
}
