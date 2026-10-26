import 'server-only';
import { unstable_cache } from 'next/cache';
import { db } from '@/lib/db/server';
import { dbConfigured } from '@/lib/config';

export const SETTINGS_TAG = 'settings';

export const SETTING_FIELDS = {
  ga4_id: { label: 'Google Analytics 4 measurement ID', placeholder: 'G-XXXXXXXXXX', pattern: /^G-[A-Z0-9]{4,16}$/, env: 'NEXT_PUBLIC_GA4_ID' },
  meta_pixel_id: { label: 'Meta (Facebook/Instagram) Pixel ID', placeholder: '123456789012345', pattern: /^\d{10,20}$/, env: 'NEXT_PUBLIC_META_PIXEL_ID' },
  tiktok_pixel_id: { label: 'TikTok Pixel ID', placeholder: 'C123ABC456DEF789GHI0', pattern: /^[A-Z0-9]{10,30}$/, env: 'NEXT_PUBLIC_TIKTOK_PIXEL_ID' },
  newsletter_code: { label: 'Newsletter welcome discount code', placeholder: 'WELCOME10', pattern: /^[A-Z0-9_-]{3,30}$/, env: 'NEWSLETTER_CODE' },
  business_address: { label: 'Business postal address (required in marketing emails)', placeholder: 'Noovit LLC, 123 Main St, Austin, TX 78701', pattern: /^.{10,200}$/, env: 'BUSINESS_ADDRESS' },
} as const;

export type SettingKey = keyof typeof SETTING_FIELDS;
export type Settings = Record<SettingKey, string>;

export const SETTING_KEYS = Object.keys(SETTING_FIELDS) as SettingKey[];

// Values saved in the admin win; environment variables are the fallback.
async function load(): Promise<Settings> {
  const settings = Object.fromEntries(SETTING_KEYS.map((k) => [k, process.env[SETTING_FIELDS[k].env] ?? ''])) as Settings;
  if (!dbConfigured()) return settings;
  const { data, error } = await db().from('settings').select('key, value');
  if (error) throw error;
  for (const row of data ?? []) if (row.key in settings && row.value) settings[row.key as SettingKey] = row.value;
  return settings;
}

export const getSettings = unstable_cache(load, ['settings-v1'], { tags: [SETTINGS_TAG] });

export const loadSettings = load;
