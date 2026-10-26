import 'server-only';
import { randomUUID } from 'crypto';
import { db } from '@/lib/db/server';

const BUCKET = 'product-images';
const MAX_BYTES = 4 * 1024 * 1024;
const TYPES: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

export async function uploadImage(prefix: string, file: unknown): Promise<{ url?: string; error?: string }> {
  if (!(file instanceof File)) return { error: 'No file received.' };
  const ext = TYPES[file.type];
  if (!ext) return { error: `${file.name}: use JPG, PNG or WebP.` };
  if (file.size > MAX_BYTES) return { error: `${file.name} is over 4 MB.` };
  const path = `${prefix}/${randomUUID()}.${ext}`;
  const { error } = await db().storage.from(BUCKET).upload(path, file, { contentType: file.type, cacheControl: '31536000' });
  if (error) return { error: `Upload failed: ${error.message}` };
  return { url: db().storage.from(BUCKET).getPublicUrl(path).data.publicUrl };
}

export async function deleteImage(url: string) {
  const marker = `/${BUCKET}/`;
  if (url.includes(marker)) await db().storage.from(BUCKET).remove([url.slice(url.indexOf(marker) + marker.length)]);
}
