'use client';

import { createContext, useContext } from 'react';

export interface StoreConfig {
  autoDiscount: { thresholdCents: number; percent: number } | null;
  popup: { headline: string; text: string } | null;
  placeholders: boolean; // show labelled placeholder trust content (pre-launch guide)
}

const Ctx = createContext<StoreConfig>({ autoDiscount: null, popup: null, placeholders: false });

export const StoreConfigProvider = ({ value, children }: { value: StoreConfig; children: React.ReactNode }) => <Ctx.Provider value={value}>{children}</Ctx.Provider>;

export const useStoreConfig = () => useContext(Ctx);
