import 'server-only';
import { unstable_cache } from 'next/cache';
import { db } from '@/lib/db/server';
import { dbConfigured } from '@/lib/config';
import { IMAGES, TRUST_BAR } from '@/data/content';
import { SETTINGS_TAG } from '@/lib/settings';

// Homepage copy editable in Admin → Homepage. Stored in the settings table as content.<key>.
export const CONTENT_FIELDS = {
  announcement_text: { label: 'Announcement bar text', hint: 'Optional strip above the header, e.g. a promotion. Leave empty to hide.', max: 140, rows: 1, default: '' },
  announcement_link: { label: 'Announcement link', hint: 'Optional, e.g. /collections/sleep or /shop', max: 200, rows: 1, default: '' },
  trust_bar: { label: 'Trust bar items', hint: 'Up to 5, one per line.', max: 300, rows: 5, default: TRUST_BAR.join('\n') },
  hero_badge: { label: 'Hero badge', hint: 'Small line above the headline.', max: 80, rows: 1, default: 'Skip, change or cancel anytime' },
  hero_headline: { label: 'Hero headline', hint: '', max: 120, rows: 2, default: 'Feel the difference of supplements done right.' },
  hero_subheadline: { label: 'Hero text', hint: '', max: 300, rows: 3, default: 'Clean, evidence-based supplements made in the USA and third-party tested — for gut health, sleep, joints, skin and energy.' },
  hero_cta_label: { label: 'Button label', hint: '', max: 30, rows: 1, default: 'Shop Now' },
  hero_cta_link: { label: 'Button link', hint: 'e.g. /shop or /collections/best-sellers', max: 200, rows: 1, default: '/shop' },
  hero_bullets: { label: 'Hero bullet points', hint: 'Up to 3, one per line.', max: 200, rows: 3, default: '90-day money-back guarantee\nFree delivery' },
  hero_image: { label: 'Hero image', hint: '', max: 500, rows: 0, default: IMAGES.hero },
  popup_headline: { label: 'Pop-up headline', hint: 'Leave empty to turn the newsletter pop-up off.', max: 80, rows: 1, default: '' },
  popup_text: { label: 'Pop-up text', hint: 'e.g. Join for 10% off your first order, plus nutrition tips.', max: 200, rows: 2, default: '' },
} as const;

export type ContentKey = keyof typeof CONTENT_FIELDS;
export type Content = Record<ContentKey, string>;
export const CONTENT_KEYS = Object.keys(CONTENT_FIELDS) as ContentKey[];

// Only same-site paths or http(s) URLs are allowed as link targets.
export const safeLink = (href: string) => (/^\/(?!\/)/.test(href) || /^https?:\/\//.test(href) ? href : '');

export async function loadContent(): Promise<Content> {
  const content = Object.fromEntries(CONTENT_KEYS.map((k) => [k, CONTENT_FIELDS[k].default])) as Content;
  if (!dbConfigured()) return content;
  const { data, error } = await db().from('settings').select('key, value').like('key', 'content.%');
  if (error) throw error;
  for (const row of data ?? []) {
    const key = row.key.slice('content.'.length) as ContentKey;
    if (key in content && row.value !== null) content[key] = row.value;
  }
  return content;
}

export const getContent = unstable_cache(loadContent, ['content-v1'], { tags: [SETTINGS_TAG] });

export const lines = (v: string, max: number) => v.split('\n').map((s) => s.trim()).filter(Boolean).slice(0, max);
