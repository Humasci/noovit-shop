import type { NextRequest } from 'next/server';
import { siteLive, ordersOpen, PREVIEW_COOKIE, isPreviewToken } from '@/lib/launch';
import { ADMIN_COOKIE, adminConfigured, isAdminToken } from '@/lib/admin/session';

// True when this request may use the shop (21 Nov audit): the site is live, or the visitor is signed-in staff or holds a
// preview link. Pre-launch, checkout must not take real orders from anyone who finds the API.
export const shopOpenFor = (req: NextRequest) =>
  (siteLive() && ordersOpen()) || isAdminToken(req.cookies.get(ADMIN_COOKIE)?.value) || (adminConfigured() && isPreviewToken(req.cookies.get(PREVIEW_COOKIE)?.value));
