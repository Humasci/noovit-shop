import { ImageResponse } from 'next/og';
import { getStoreProduct } from '@/lib/catalog/server';

const SIZE = 1000;

// PNG version of the mockup bottle, built from boxes so it renders without SVG text or custom fonts.
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const product = await getStoreProduct((await params).slug);
  if (!product) return new Response('Not found', { status: 404 });

  const pets = product.productType === 'pets';
  const unit = { powder: 'SERVINGS', chews: 'SOFT CHEWS', capsules: 'CAPSULES', softgels: 'SOFTGELS' }[product.form];
  const count = product.form === 'powder' || product.form === 'chews' ? product.servings : product.servings * 2;
  const label = (pets ? product.name.replace(/ for (Dogs|Cats)$/, '') : product.name).toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `radial-gradient(circle at 50% 40%, #ffffff 0%, ${product.color}40 100%)`,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 260, height: 90, background: '#1a1f2b', borderRadius: 18 }} />
          <div
            style={{
              width: 420,
              height: 560,
              marginTop: -10,
              background: '#ffffff',
              borderRadius: 60,
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
            }}
          >
            <div
              style={{
                width: '100%',
                height: 380,
                background: product.color,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                padding: 30,
              }}
            >
              <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 8 }}>{pets ? 'NOOVIT PETS' : 'NOOVIT'}</div>
              <div style={{ fontSize: 46, fontWeight: 800, textAlign: 'center', marginTop: 24, lineHeight: 1.1 }}>{label}</div>
              <div style={{ fontSize: 22, letterSpacing: 4, marginTop: 28, opacity: 0.85 }}>{`${count} ${unit}`}</div>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: SIZE, height: SIZE, headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=604800' } }
  );
}
