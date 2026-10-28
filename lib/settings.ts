import 'server-only';
import { unstable_cache } from 'next/cache';
import { db } from '@/lib/db/server';
import { dbConfigured } from '@/lib/config';

export const SETTINGS_TAG = 'settings';

// upper: normalise to uppercase before validating (IDs and codes); others are stored as typed.
export const SETTING_FIELDS = {
  gtm_id: { label: 'Google Tag Manager container ID', placeholder: 'GTM-XXXXXXX', pattern: /^GTM-[A-Z0-9]{4,12}$/, env: 'NEXT_PUBLIC_GTM_ID', upper: true, fallback: 'GTM-5LKW5HGS' },
  ga4_id: { label: 'Google Analytics 4 measurement ID (leave empty if GA4 is set up inside Tag Manager, or visits count twice)', placeholder: 'G-XXXXXXXXXX', pattern: /^G-[A-Z0-9]{4,16}$/, env: 'NEXT_PUBLIC_GA4_ID', upper: true },
  meta_pixel_id: { label: 'Meta (Facebook/Instagram) Pixel ID', placeholder: '123456789012345', pattern: /^\d{10,20}$/, env: 'NEXT_PUBLIC_META_PIXEL_ID', upper: true },
  tiktok_pixel_id: { label: 'TikTok Pixel ID', placeholder: 'C123ABC456DEF789GHI0', pattern: /^[A-Z0-9]{10,30}$/, env: 'NEXT_PUBLIC_TIKTOK_PIXEL_ID', upper: true },
  newsletter_code: { label: 'Newsletter welcome discount code', placeholder: 'WELCOME10', pattern: /^[A-Z0-9_-]{3,30}$/, env: 'NEWSLETTER_CODE', upper: true },
  show_placeholders: { label: 'Show placeholder trust content (on / off)', placeholder: 'on', pattern: /^(on|off)$/, env: 'SHOW_PLACEHOLDERS', upper: false },
  support_email: { label: 'Customer support email (shown on the site; contact form messages go here)', placeholder: 'hello@noovit.com', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, env: 'SUPPORT_EMAIL', upper: false },
  business_address: { label: 'Business postal address (required in marketing emails)', placeholder: 'Noovit LLC, 123 Main St, Austin, TX 78701', pattern: /^.{10,200}$/, env: 'BUSINESS_ADDRESS', upper: false },
  review_request_days: { label: 'Days after shipping to ask for a review (0 = off)', placeholder: '14', pattern: /^\d{1,2}$/, env: 'REVIEW_REQUEST_DAYS', upper: false },
  auto_discount_threshold: { label: 'Automatic discount: minimum order ($)', placeholder: '100', pattern: /^\d{1,4}$/, env: 'AUTO_DISCOUNT_THRESHOLD', upper: false },
  auto_discount_percent: { label: 'Automatic discount: % off', placeholder: '10', pattern: /^([1-9]|[1-4]\d|50)$/, env: 'AUTO_DISCOUNT_PERCENT', upper: false },
  affiliate_hold_days: { label: 'Affiliates: days before a commission is approved for payout', placeholder: '30', pattern: /^\d{1,3}$/, env: 'AFFILIATE_HOLD_DAYS', upper: false },
  klaviyo_list_id: { label: 'Klaviyo list ID', placeholder: 'Y6nRLr', pattern: /^[A-Za-z0-9]{4,12}$/, env: 'KLAVIYO_LIST_ID', upper: false },
} as const;

export type SettingKey = keyof typeof SETTING_FIELDS;
export type Settings = Record<SettingKey, string>;

export const SETTING_KEYS = Object.keys(SETTING_FIELDS) as SettingKey[];

// Values saved in the admin win; environment variables are the fallback, then the field's built-in default.
async function load(): Promise<Settings> {
  const fallback = (k: SettingKey) => { const f = SETTING_FIELDS[k]; return 'fallback' in f ? f.fallback : ''; };
  const settings = Object.fromEntries(SETTING_KEYS.map((k) => [k, process.env[SETTING_FIELDS[k].env] || fallback(k)])) as Settings;
  if (!dbConfigured()) return settings;
  const { data, error } = await db().from('settings').select('key, value');
  if (error) throw error;
  for (const row of data ?? []) if (row.key in settings && row.value) settings[row.key as SettingKey] = row.value;
  return settings;
}

export const getSettings = unstable_cache(load, ['settings-v3'], { tags: [SETTINGS_TAG] });

export const loadSettings = load;

// Where customers write to: the admin setting, else hello@noovit.com.
export async function supportEmail() {
  return (await getSettings()).support_email || 'hello@noovit.com';
}

// Pre-launch guide: labelled placeholder reviews/ratings/advisors show until this is switched "off".
export const placeholdersOn = (settings: Settings) => (settings.show_placeholders ?? '').trim().toLowerCase() !== 'off';
