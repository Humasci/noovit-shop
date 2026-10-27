import { verifyToken } from '@/lib/sign';
import { Role } from './permissions';

export const ADMIN_COOKIE = 'noovit_admin';

export interface SessionPayload {
  sid: string; // staff id, or 'bootstrap' for the one-off ADMIN_PASSWORD login before any staff exist
  role: Role;
}

// A short secret would make every signed token throw, so it counts as not configured.
export const adminConfigured = () => (process.env.APP_SECRET?.length ?? 0) >= 32;

// Signature + expiry only; requireAdmin() re-checks the staff account on every request.
export const readSession = (token: string | undefined) => (adminConfigured() ? verifyToken<SessionPayload & Record<string, unknown>>(token) : null);

export const isAdminToken = (token: string | undefined) => Boolean(readSession(token)?.sid);
