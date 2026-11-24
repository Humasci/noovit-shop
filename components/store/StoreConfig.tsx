'use client';

import { createContext, useContext, useSyncExternalStore } from 'react';
import { SHOP_PREVIEW_HINT } from '@/lib/shop-preview';

export interface StoreConfig {
  autoDiscount: { thresholdCents: number; percent: number } | null;
  popup: { headline: string; text: string } | null;
  placeholders: boolean; // show labelled placeholder trust content (pre-launch guide)
  ordersOpen: boolean; // false = "coming soon" mode: no add-to-cart, "Notify me" instead
}

const Ctx = createContext<StoreConfig>({ autoDiscount: null, popup: null, placeholders: false, ordersOpen: true });

export const StoreConfigProvider = ({ value, children }: { value: StoreConfig; children: React.ReactNode }) => <Ctx.Provider value={value}>{children}</Ctx.Provider>;

// Staff and preview-link holders see the buy buttons even in coming-soon mode (hint cookie; checkout re-checks on the server).
const noop = () => () => {};
const hasPreviewHint = () => document.cookie.split('; ').some((c) => c === `${SHOP_PREVIEW_HINT}=1`);

export const useStoreConfig = () => {
  const config = useContext(Ctx);
  const preview = useSyncExternalStore(noop, hasPreviewHint, () => false);
  return preview && !config.ordersOpen ? { ...config, ordersOpen: true } : config;
};
