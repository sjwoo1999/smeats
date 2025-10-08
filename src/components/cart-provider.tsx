"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/types";

type CartContextType = {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  addMany: (items: Omit<CartItem, "quantity"> & { quantity?: number }[]) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  totalAmount: number;
  totalItems: number;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "smeats_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load cart from storage:", error);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save cart to storage:", error);
    }
  }, [items, isHydrated]);

  const api = useMemo<CartContextType>(() => {
    return {
      items,

      add: (item) => {
        setItems((prev) => {
          const existing = prev.find((p) => p.product_id === item.product_id);
          if (existing) {
            return prev.map((p) =>
              p.product_id === item.product_id
                ? { ...p, quantity: p.quantity + (item.quantity || 1) }
                : p
            );
          }
          return [...prev, { ...item, quantity: item.quantity || 1 }];
        });
      },

      addMany: (newItems) => {
        setItems((prev) => {
          const map = new Map<string, CartItem>(
            prev.map((p) => [p.product_id, { ...p }])
          );

          for (const item of newItems) {
            const current = map.get(item.product_id);
            if (current) {
              map.set(item.product_id, {
                ...current,
                quantity: current.quantity + (item.quantity || 1),
              });
            } else {
              map.set(item.product_id, {
                ...item,
                quantity: item.quantity || 1,
              } as CartItem);
            }
          }

          return Array.from(map.values());
        });
      },

      setQuantity: (productId, quantity) => {
        setItems((prev) =>
          prev.map((p) =>
            p.product_id === productId
              ? { ...p, quantity: Math.max(1, quantity) }
              : p
          )
        );
      },

      remove: (productId) => {
        setItems((prev) => prev.filter((p) => p.product_id !== productId));
      },

      clear: () => {
        setItems([]);
      },

      totalAmount: items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),

      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    };
  }, [items]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
