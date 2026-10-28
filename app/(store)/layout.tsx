import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { getStoreProducts } from '@/lib/catalog/server';
import { bestSellers } from '@/data/products';
import { getSettings, placeholdersOn } from '@/lib/settings';
import { Analytics } from '@/components/analytics/Analytics';
import { getContent, lines, safeLink } from '@/lib/content';
import { autoDiscountFrom } from '@/lib/marketing/auto-discount';
import { StoreConfigProvider } from '@/components/store/StoreConfig';
import { NewsletterPopup } from '@/components/marketing/NewsletterPopup';

export default async function StoreLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const suggestions = bestSellers(await getStoreProducts()).filter((p) => p.status === 'active').slice(0, 6);
  const settings = await getSettings();
  const content = await getContent();
  const config = {
    autoDiscount: autoDiscountFrom(settings),
    popup: content.popup_headline ? { headline: content.popup_headline, text: content.popup_text } : null,
    placeholders: placeholdersOn(settings),
  };
  return (
    <StoreConfigProvider value={config}>
      {settings.gtm_id && (
        <noscript>
          <iframe src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(settings.gtm_id)}`} height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} title="Google Tag Manager" />
        </noscript>
      )}
      <a href="#main" className="sr-only-focusable fixed left-4 top-4 z-[70] rounded bg-[var(--color-navy)] px-5 py-3 font-semibold text-white">
        Skip to content
      </a>
      <Header
        trustBar={lines(content.trust_bar, 5)}
        announcement={{ text: content.announcement_text, href: safeLink(content.announcement_link) }}
      />
      <main id="main" tabIndex={-1} className="min-h-screen outline-none">{children}</main>
      <Footer />
      <CartDrawer suggestions={suggestions} />
      <Analytics ids={{ gtm: settings.gtm_id, ga4: settings.ga4_id, meta: settings.meta_pixel_id, tiktok: settings.tiktok_pixel_id }} />
      <NewsletterPopup />
    </StoreConfigProvider>
  );
}
