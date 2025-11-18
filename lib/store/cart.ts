import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem, Cart } from '@/types';

interface CartStore extends Cart {
  addItem: (product: Product, quantity?: number, isSubscription?: boolean) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleSubscription: (productId: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
}

const calculateTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => {
    const price = item.isSubscription && item.product.subscriptionDiscount
      ? item.product.price * (1 - item.product.subscriptionDiscount / 100)
      : item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  const discount = items.reduce((sum, item) => {
    if (item.isSubscription && item.product.subscriptionDiscount) {
      const discountAmount = item.product.price * (item.product.subscriptionDiscount / 100);
      return sum + (discountAmount * item.quantity);
    }
    return sum;
  }, 0);

  return {
    subtotal: subtotal + discount,
    discount,
    total: subtotal,
  };
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      subtotal: 0,
      discount: 0,

      addItem: (product, quantity = 1, isSubscription = false) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id && item.isSubscription === isSubscription
          );

          let newItems: CartItem[];

          if (existingItem) {
            newItems = state.items.map((item) =>
              item.product.id === product.id && item.isSubscription === isSubscription
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            newItems = [...state.items, { product, quantity, isSubscription }];
          }

          const totals = calculateTotals(newItems);

          return {
            items: newItems,
            ...totals,
          };
        });
      },

      removeItem: (productId) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.product.id !== productId);
          const totals = calculateTotals(newItems);

          return {
            items: newItems,
            ...totals,
          };
        });
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return get().removeItem(productId) as any;
          }

          const newItems = state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          );

          const totals = calculateTotals(newItems);

          return {
            items: newItems,
            ...totals,
          };
        });
      },

      toggleSubscription: (productId) => {
        set((state) => {
          const newItems = state.items.map((item) =>
            item.product.id === productId
              ? { ...item, isSubscription: !item.isSubscription }
              : item
          );

          const totals = calculateTotals(newItems);

          return {
            items: newItems,
            ...totals,
          };
        });
      },

      clearCart: () => {
        set({
          items: [],
          total: 0,
          subtotal: 0,
          discount: 0,
        });
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'noovit-cart',
    }
  )
);
