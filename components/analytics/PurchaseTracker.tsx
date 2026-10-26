'use client';

import { useEffect } from 'react';
import { track, TrackItem } from '@/lib/analytics';

// Fires once per order, even if the confirmation page is reloaded.
export function PurchaseTracker({ transactionId, value, items }: { transactionId: string; value: number; items: TrackItem[] }) {
  useEffect(() => {
    const key = `noovit-tracked-${transactionId}`;
    if (localStorage.getItem(key)) return;
    const fire = () => {
      track({ name: 'purchase', transactionId, value, items });
      localStorage.setItem(key, '1');
    };
    // Pixels load asynchronously after consent; give them a moment.
    const timer = setTimeout(fire, 1500);
    return () => clearTimeout(timer);
  }, [transactionId, value, items]);
  return null;
}
