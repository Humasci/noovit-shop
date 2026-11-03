import { NextRequest } from 'next/server';
import { getCatalog } from '@/lib/catalog/server';
import { findProduct } from '@/data/products';
import { cellsSvg, driftSvg, moleculeSvg } from '@/lib/labels/web-art';

// Website graphics (V2 style):
//   /art/molecule-<slug>.svg[?style=family]  the product's key molecule in glossy beads, dissolving
//   /art/drift-<slug>.svg[?from=left|right|bottom]  a particle field in the product's colour + brand spectrum
//   /art/cells-dark[-seed].svg, /art/cells-light[-seed].svg  microscopy-style cell field in the science palette
// Deterministic per product, so they cache forever (bump ?v= when the art changes).
export async function GET(req: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const cells = name.match(/^cells-(dark|light)(?:-([a-z0-9-]+))?\.svg$/);
  if (cells) return new Response(cellsSvg(cells[2] ?? 'noovit', cells[1] === 'dark'), { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=31536000, immutable' } });
  const m = name.match(/^(molecule|drift)-([a-z0-9-]+)\.svg$/);
  if (!m) return new Response('Not found', { status: 404 });
  const product = findProduct(await getCatalog(), m[2]);
  const sp = req.nextUrl.searchParams;
  let svg: string;
  if (m[1] === 'molecule') {
    if (!product) return new Response('Not found', { status: 404 });
    svg = moleculeSvg(product, 800, 800, sp.get('style') === 'family' ? 'family' : 'spectrum');
  } else {
    const from = sp.get('from');
    svg = driftSvg(m[2], product?.color ?? '#4A6B94', 1600, 500, from === 'left' || from === 'bottom' ? from : 'right');
  }
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=31536000, immutable' } });
}
