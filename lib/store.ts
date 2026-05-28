import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, CartOptionItem } from './types';

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'cartItemId' | 'subtotal'>) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
  totalCount: () => number;
}

function calcSubtotal(price: number, options: CartOptionItem[], quantity: number) {
  const optionsTotal = options.reduce((sum, o) => sum + o.extraPrice, 0);
  return (price + optionsTotal) * quantity;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const cartItemId = `${item.menuId}-${Date.now()}`;
        const subtotal = calcSubtotal(item.price, item.selectedOptions, item.quantity);
        set((state) => ({
          items: [...state.items, { ...item, cartItemId, subtotal }],
        }));
      },

      removeItem: (cartItemId) =>
        set((state) => ({ items: state.items.filter((i) => i.cartItemId !== cartItemId) })),

      updateQuantity: (cartItemId, quantity) => {
        if (quantity < 1) {
          get().removeItem(cartItemId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.cartItemId === cartItemId
              ? { ...i, quantity, subtotal: calcSubtotal(i.price, i.selectedOptions, quantity) }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalPrice: () => get().items.reduce((sum, i) => sum + i.subtotal, 0),

      totalCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'modurang-cart',
      skipHydration: true,
    }
  )
);
