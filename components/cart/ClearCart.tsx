'use client';

import { useEffect } from 'react';
import { useCart } from '@/lib/store/cart';

export function ClearCart() {
  const clearCart = useCart((s) => s.clearCart);
  useEffect(() => {
    clearCart();
    // Drop the Stripe session id from the address bar (21 Nov audit): it would otherwise reach analytics and browser
    // history, and anyone holding it can look up the buyer's name and email on this page.
    const u = new URL(window.location.href);
    if (u.searchParams.has('session_id')) { u.searchParams.delete('session_id'); window.history.replaceState(null, '', u.pathname + u.search); }
  }, [clearCart]);
  return null;
}
