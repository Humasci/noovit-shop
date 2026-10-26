'use server';

import { redirect } from 'next/navigation';
import { updateTag } from 'next/cache';
import { requireAdmin } from '@/lib/admin/auth';
import { db } from '@/lib/db/server';
import { SETTING_FIELDS, SETTING_KEYS, SETTINGS_TAG } from '@/lib/settings';

export async function saveSettings(f: FormData) {
  await requireAdmin();
  const rows = [];
  for (const key of SETTING_KEYS) {
    let value = String(f.get(key) ?? '').trim();
    if (key !== 'business_address') value = value.toUpperCase().replace(/\s+/g, '');
    if (value && !SETTING_FIELDS[key].pattern.test(value)) {
      redirect(`/admin/settings?msg=${encodeURIComponent(`${SETTING_FIELDS[key].label}: “${value}” doesn't look right.`)}`);
    }
    rows.push({ key, value: value || null });
  }
  const { error } = await db().from('settings').upsert(rows, { onConflict: 'key' });
  if (error) redirect(`/admin/settings?msg=${encodeURIComponent(`Save failed: ${error.message}`)}`);
  updateTag(SETTINGS_TAG);
  redirect('/admin/settings?msg=Settings%20saved.');
}
