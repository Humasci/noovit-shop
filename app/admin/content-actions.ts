'use server';

import { redirect } from 'next/navigation';
import { updateTag } from 'next/cache';
import { requireAdmin } from '@/lib/admin/auth';
import { db } from '@/lib/db/server';
import { CONTENT_FIELDS, CONTENT_KEYS, safeLink } from '@/lib/content';
import { SETTINGS_TAG } from '@/lib/settings';
import { uploadImage } from '@/lib/storage';

const back = (msg: string): never => redirect(`/admin/content?msg=${encodeURIComponent(msg)}`);

export async function saveContent(f: FormData) {
  await requireAdmin('content');
  const rows: { key: string; value: string }[] = [];
  for (const key of CONTENT_KEYS) {
    if (key === 'hero_image') continue;
    const value = String(f.get(key) ?? '').replace(/\r/g, '').trim().slice(0, CONTENT_FIELDS[key].max);
    if ((key === 'announcement_link' || key === 'hero_cta_link') && value && !safeLink(value)) back(`${CONTENT_FIELDS[key].label} must start with / or https://`);
    rows.push({ key: `content.${key}`, value });
  }

  const file = f.get('hero_image_file');
  if (file instanceof File && file.size > 0) {
    const { url, error } = await uploadImage('content', file);
    if (error) back(error);
    rows.push({ key: 'content.hero_image', value: url! });
  }

  const { error } = await db().from('settings').upsert(rows, { onConflict: 'key' });
  if (error) back(`Save failed: ${error.message}`);
  updateTag(SETTINGS_TAG);
  back('Homepage updated.');
}

export async function resetContent() {
  await requireAdmin('content');
  await db().from('settings').delete().like('key', 'content.%');
  updateTag(SETTINGS_TAG);
  back('Homepage reset to the default text.');
}
