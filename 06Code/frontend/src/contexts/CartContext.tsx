'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CartItem, Product } from '@/types';

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  addItem: (product: Product, quantity: number, customizationDetails?: string) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = 'artisan_cart';

function loadStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]): void {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(loadStoredCart());
  }, []);

  function addItem(product: Product, quantity: number, customizationDetails?: string): void {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      const updated = existing
        ? prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity, customizationDetails }
              : item
          )
        : [...prev, { product, quantity, customizationDetails }];
      saveCart(updated);
      return updated;
    });
  }

  function removeItem(productId: number): void {
    setItems((prev) => {
      const updated = prev.filter((item) => item.product.id !== productId);
      saveCart(updated);
      return updated;
    });
  }

  function updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) => {
      const updated = prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      saveCart(updated);
      return updated;
    });
  }

  function clearCart(): void {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, totalItems, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
