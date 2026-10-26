import { createHmac, timingSafeEqual } from 'crypto';

function secret() {
  const s = process.env.APP_SECRET;
  if (!s || s.length < 32) throw new Error('APP_SECRET must be set to a random string of at least 32 characters');
  return s;
}

const b64 = (s: string) => Buffer.from(s).toString('base64url');
const mac = (data: string) => createHmac('sha256', secret()).update(data).digest('base64url');

// Compact signed token: base64url(JSON payload).hmac. Payload carries its own expiry.
export function signToken(payload: Record<string, unknown>, ttlSeconds: number) {
  const data = b64(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + ttlSeconds }));
  return `${data}.${mac(data)}`;
}

export function verifyToken<T extends Record<string, unknown>>(token: string | undefined | null): T | null {
  if (!token) return null;
  const [data, sig] = token.split('.');
  if (!data || !sig) return null;
  const expected = Buffer.from(mac(data));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString()) as T & { exp: number };
    return payload.exp > Date.now() / 1000 ? payload : null;
  } catch {
    return null;
  }
}
