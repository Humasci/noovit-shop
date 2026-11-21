// Simple per-instance rate limiter (21 Nov audit). Serverless instances don't share memory, so this is a first line
// of defence against scripted abuse of email-sending routes; add a Vercel WAF rate-limit rule for /api/* on top.
const buckets = new Map<string, number[]>();

export function rateLimited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > 20000) buckets.clear();
  return recent.length > max;
}

export const clientIp = (req: Request) => req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'local';

// Email-sending forms: 5 per IP per 10 minutes, and 3 per email address per hour.
export function formLimited(req: Request, route: string, email?: string) {
  if (process.env.RATE_LIMIT_OFF === '1') return false; // local end-to-end tests only (tests/e2e/test.env)
  if (rateLimited(`${route}:ip:${clientIp(req)}`, 5, 10 * 60_000)) return true;
  return !!email && rateLimited(`${route}:email:${email.trim().toLowerCase()}`, 3, 60 * 60_000);
}
