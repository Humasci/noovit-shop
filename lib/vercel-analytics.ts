import type { BeforeSendEvent } from '@vercel/analytics/next';
import { CONSENT_KEY } from './analytics';
import { isSensitivePath } from './tests';

// The script can survive client-side navigation, so check privacy rules for every event.
export function beforeSendAnalytics(event: BeforeSendEvent): BeforeSendEvent | null {
  if (
    (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl ||
    localStorage.getItem(CONSENT_KEY) === 'denied'
  ) return null;

  const url = new URL(event.url);
  if (isSensitivePath(url.pathname)) return null;

  // Checkout session IDs and other query values must not be reported.
  url.search = '';
  url.hash = '';
  return { ...event, url: url.toString() };
}
