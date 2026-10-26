import { useSyncExternalStore } from 'react';

const noop = () => () => {};

// False during SSR and the hydration pass, true afterwards — for values that only exist in the browser
// (persisted cart, today's date on statically generated pages).
export const useHydrated = () => useSyncExternalStore(noop, () => true, () => false);
