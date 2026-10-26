import { requireAdmin } from '@/lib/admin/auth';
import { dbConfigured } from '@/lib/config';
import { loadSettings, SETTING_FIELDS } from '@/lib/settings';
import { saveSettings } from '@/app/admin/settings-actions';
import { SITE_URL } from '@/lib/site';
import { Card, Flash, NotConfigured, PageTitle, btnSm, inputCls } from '@/components/admin/ui';

const FEEDS = [
  { name: 'Google Merchant Center (Google Shopping)', path: '/feeds/google.xml', how: 'Merchant Center → Products → Add feed → Scheduled fetch → paste the URL.' },
  { name: 'Meta Commerce Manager (Facebook & Instagram Shops, catalog ads)', path: '/feeds/meta.csv', how: 'Commerce Manager → Catalog → Data sources → Data feed → Scheduled feed → paste the URL.' },
  { name: 'TikTok Shop / TikTok Ads catalog', path: '/feeds/tiktok.csv', how: 'TikTok Ads Manager → Assets → Catalogs → Add products → Data feed → paste the URL.' },
];

const GROUPS: { title: string; note: string; keys: (keyof typeof SETTING_FIELDS)[] }[] = [
  {
    title: 'Analytics & ad tracking',
    note: 'Paste the IDs from each platform. Tracking only starts after a visitor accepts cookies. Tracked events: page views, product views, add to cart, checkout started and purchases.',
    keys: ['ga4_id', 'meta_pixel_id', 'tiktok_pixel_id'],
  },
  {
    title: 'Marketing emails',
    note: 'The welcome code is emailed to new newsletter subscribers and offered in abandoned-checkout emails — create it first in Discounts. US law (CAN-SPAM) requires a postal address in marketing emails.',
    keys: ['newsletter_code', 'business_address', 'review_request_days'],
  },
  {
    title: 'Automatic discount',
    note: 'Applies a % discount automatically when the cart reaches the minimum — great for raising order value. While it applies, customers can’t also enter a code (Stripe allows one discount per checkout). Leave blank to switch off.',
    keys: ['auto_discount_threshold', 'auto_discount_percent'],
  },
  {
    title: 'Klaviyo',
    note: 'Optional. With a Klaviyo private API key set as KLAVIYO_PRIVATE_KEY in the hosting environment, new subscribers are added to this list and orders are sent as “Placed Order” and “Fulfilled Order” events for your Klaviyo flows. Unsubscribes sync too.',
    keys: ['klaviyo_list_id'],
  },
];

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  await requireAdmin('settings');
  const { msg } = await searchParams;
  if (!dbConfigured()) return (<><PageTitle title="Settings" /><NotConfigured what="The database" /></>);
  const settings = await loadSettings();

  return (
    <>
      <PageTitle title="Settings" />
      <Flash msg={msg} />
      <form action={saveSettings} className="space-y-6">
        {GROUPS.map((g) => (
          <Card key={g.title}>
            <h2 className="text-lg">{g.title}</h2>
            <p className="mb-4 mt-1 text-sm text-[var(--color-muted)]">{g.note}</p>
            <div className="grid gap-4 md:grid-cols-2">
              {g.keys.map((key) => (
                <label key={key} className={key === 'business_address' ? 'md:col-span-2' : ''}>
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">{SETTING_FIELDS[key].label}</span>
                  <input name={key} defaultValue={settings[key]} placeholder={SETTING_FIELDS[key].placeholder} className={`${inputCls} w-full`} />
                </label>
              ))}
            </div>
          </Card>
        ))}
        <button className={btnSm}>Save settings</button>
      </form>

      <Card className="mt-8">
        <h2 className="text-lg">Sales channels — product feeds</h2>
        <p className="mb-4 mt-1 text-sm text-[var(--color-muted)]">
          These links always list your current products, prices, photos and stock status. Add them once in each platform and set it to refresh daily. Hidden products are left out.
        </p>
        <ul className="space-y-4">
          {FEEDS.map((f) => (
            <li key={f.path}>
              <p className="font-semibold">{f.name}</p>
              <code className="mt-1 block break-all rounded-lg bg-[var(--color-soft)] px-3 py-2 text-sm">{SITE_URL}{f.path}</code>
              <p className="mt-1 text-xs text-[var(--color-muted)]">{f.how}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-[var(--color-muted)]">Sitemap for Google Search Console: <code>{SITE_URL}/sitemap.xml</code></p>
      </Card>
    </>
  );
}
