import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { getStoreProducts } from '@/lib/catalog/server';
import { bestSellers } from '@/data/products';
import { getSettings } from '@/lib/settings';
import { Analytics } from '@/components/analytics/Analytics';

export default async function StoreLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const suggestions = bestSellers(await getStoreProducts()).slice(0, 4);
  const settings = await getSettings();
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CartDrawer suggestions={suggestions} />
      <Analytics ids={{ ga4: settings.ga4_id, meta: settings.meta_pixel_id, tiktok: settings.tiktok_pixel_id }} />
    </>
  );
}
