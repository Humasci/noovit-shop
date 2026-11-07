import { findGuide } from '@/lib/guides';
import { shareCardPng } from '@/lib/share-card';

// 1200 × 630 social image for a guide (Open Graph / X cards).
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const g = findGuide((await params).slug);
  if (!g) return new Response('Not found', { status: 404 });
  const title = g.h1 ?? `${g.ingredient}: benefits, uses, dosage & side effects`;
  const png = shareCardPng('SUPPLEMENT GUIDE · EVIDENCE-GRADED', title, `${g.sources.length} sources · noovit.com/guides`);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400, s-maxage=604800' } });
}
