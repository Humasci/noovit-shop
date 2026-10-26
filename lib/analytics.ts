// Client-side event tracking. Calls are no-ops until the visitor has accepted cookies and the pixels have loaded.

type Fn = (...args: unknown[]) => void;
declare global {
  interface Window {
    gtag?: Fn;
    fbq?: Fn;
    ttq?: { track: Fn; page: Fn };
  }
}

export interface TrackItem {
  id: string;
  name: string;
  price: number;
  quantity?: number;
}

export type TrackEvent =
  | { name: 'view_item'; item: TrackItem }
  | { name: 'add_to_cart'; item: TrackItem }
  | { name: 'begin_checkout'; value: number; items: TrackItem[] }
  | { name: 'purchase'; transactionId: string; value: number; items: TrackItem[] };

export const CONSENT_KEY = 'noovit-consent';
export const hasConsent = () => typeof window !== 'undefined' && localStorage.getItem(CONSENT_KEY) === 'granted';

const gaItems = (items: TrackItem[]) => items.map((i) => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.quantity ?? 1 }));

export function track(e: TrackEvent) {
  if (!hasConsent()) return;
  const items = e.name === 'view_item' || e.name === 'add_to_cart' ? [e.item] : e.items;
  const value = e.name === 'view_item' || e.name === 'add_to_cart' ? e.item.price * (e.item.quantity ?? 1) : e.value;
  const ids = items.map((i) => i.id);

  window.gtag?.('event', e.name, {
    currency: 'USD',
    value,
    items: gaItems(items),
    ...(e.name === 'purchase' ? { transaction_id: e.transactionId } : {}),
  });

  const meta = { view_item: 'ViewContent', add_to_cart: 'AddToCart', begin_checkout: 'InitiateCheckout', purchase: 'Purchase' }[e.name];
  window.fbq?.('track', meta, { currency: 'USD', value, content_ids: ids, content_type: 'product' }, e.name === 'purchase' ? { eventID: e.transactionId } : undefined);

  const tiktok = { view_item: 'ViewContent', add_to_cart: 'AddToCart', begin_checkout: 'InitiateCheckout', purchase: 'CompletePayment' }[e.name];
  window.ttq?.track(tiktok, {
    currency: 'USD',
    value,
    contents: items.map((i) => ({ content_id: i.id, content_name: i.name, price: i.price, quantity: i.quantity ?? 1 })),
    content_type: 'product',
  });
}
