import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Frequency, Product, PurchaseMode } from '@/types';

interface AddInput {
  product: Product;
  mode: PurchaseMode;
  bottles: number;
  pricePerBottle: number;
  frequency?: Frequency;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addItem: (input: AddInput) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  setFrequency: (frequency: Frequency) => void;
  clearCart: () => void;
}

const itemKey = (productId: string, mode: PurchaseMode, bottles: number) => `${productId}-${mode}-${bottles}`;

export const lineTotal = (item: CartItem) => item.pricePerBottle * item.bottles * item.quantity;

export const cartTotal = (items: CartItem[]) => items.reduce((sum, i) => sum + lineTotal(i), 0);

export const cartCount = (items: CartItem[]) => items.reduce((sum, i) => sum + i.quantity, 0);

export const cartFrequency = (items: CartItem[]) => items.find((i) => i.mode === 'subscribe')?.frequency;

// A Stripe subscription has one billing interval, so every subscription line in the cart shares one frequency.
const withFrequency = (items: CartItem[], frequency: Frequency) =>
  items.map((i) => (i.mode === 'subscribe' ? { ...i, frequency } : i));

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),

      addItem: ({ product, mode, bottles, pricePerBottle, frequency }) =>
        set((state) => {
          const key = itemKey(product.id, mode, bottles);
          const existing = state.items.find((i) => i.key === key);
          let items = existing
            ? state.items.map((i) => (i.key === key ? { ...i, quantity: i.quantity + 1 } : i))
            : [...state.items, { key, product, mode, bottles, pricePerBottle, frequency, quantity: 1 }];
          if (mode === 'subscribe' && frequency) items = withFrequency(items, frequency);
          return { items, isOpen: true };
        }),

      removeItem: (key) => set((state) => ({ items: state.items.filter((i) => i.key !== key) })),

      updateQuantity: (key, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.key !== key)
              : state.items.map((i) => (i.key === key ? { ...i, quantity: Math.min(quantity, 20) } : i)),
        })),

      setFrequency: (frequency) => set((state) => ({ items: withFrequency(state.items, frequency) })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'noovit-cart-v3',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
