import { verifyToken } from '@/lib/sign';

export const ADMIN_COOKIE = 'noovit_admin';

export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD && process.env.APP_SECRET);

export const isAdminToken = (token: string | undefined) =>
  adminConfigured() && verifyToken<{ role: string }>(token)?.role === 'admin';
