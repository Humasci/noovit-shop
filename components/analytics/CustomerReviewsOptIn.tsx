'use client';

import { useEffect } from 'react';
import { hasConsent } from '@/lib/analytics';

declare global {
  interface Window {
    renderOptIn?: () => void;
    gapi?: { load: (name: string, cb: () => void) => void; surveyoptin: { render: (opts: Record<string, unknown>) => void } };
  }
}

// Google Customer Reviews: after checkout Google offers a short survey; ratings feed seller ratings in Shopping and Ads.
// Skipped when the visitor declined cookies. Delivery estimate: 7 days (ships in 1–2 business days, 2–5 days transit).
export function CustomerReviewsOptIn({ merchantId, orderId, email }: { merchantId: string; orderId: string; email: string }) {
  useEffect(() => {
    if (!merchantId || !email || !hasConsent()) return;
    const delivery = new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10);
    window.renderOptIn = () =>
      window.gapi?.load('surveyoptin', () =>
        window.gapi?.surveyoptin.render({ merchant_id: Number(merchantId), order_id: orderId, email, delivery_country: 'US', estimated_delivery_date: delivery }),
      );
    const s = document.createElement('script');
    s.src = 'https://apis.google.com/js/platform.js?onload=renderOptIn';
    s.async = true;
    document.body.appendChild(s);
    return () => s.remove();
  }, [merchantId, orderId, email]);
  return null;
}
