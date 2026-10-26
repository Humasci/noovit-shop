import 'server-only';
import { createHash, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { signToken } from '@/lib/sign';
import { ADMIN_COOKIE, isAdminToken } from './session';

const SESSION_TTL = 7 * 24 * 60 * 60;

export function checkPassword(given: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = createHash('sha256').update(given).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function startSession() {
  (await cookies()).set(ADMIN_COOKIE, signToken({ role: 'admin' }, SESSION_TTL), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL,
  });
}

export async function endSession() {
  (await cookies()).delete(ADMIN_COOKIE);
}

// Every admin page and server action calls this; the proxy is only a first line of defence.
export async function requireAdmin() {
  if (!isAdminToken((await cookies()).get(ADMIN_COOKIE)?.value)) redirect('/admin/login');
}
