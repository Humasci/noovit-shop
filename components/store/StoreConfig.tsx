'use client';

import { createContext, useContext } from 'react';

export interface StoreConfig {
  autoDiscount: { thresholdCents: number; percent: number } | null;
  popup: { headline: string; text: string } | null;
}

const Ctx = createContext<StoreConfig>({ autoDiscount: null, popup: null });

export const StoreConfigProvider = ({ value, children }: { value: StoreConfig; children: React.ReactNode }) => <Ctx.Provider value={value}>{children}</Ctx.Provider>;

export const useStoreConfig = () => useContext(Ctx);
