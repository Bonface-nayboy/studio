'use client';

import type React from 'react';
import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { Product } from '@/data/products';
import { toast } from 'react-toastify';

export interface CartItem extends Omit<Product, 'imageUrl'> {
  quantity: number;
  imageUrls: string[];
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: (suppressToast?: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    let action: 'added' | 'updated' | 'removed' | null = null;
    let updatedCart: CartItem[] = [];

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingItemIndex > -1) {
        updatedCart = [...prevCart];
        const newQuantity = updatedCart[existingItemIndex].quantity + quantity;
        if (newQuantity <= 0) {
          updatedCart = updatedCart.filter(item => item.id !== product.id);
          action = 'removed';
        } else {
          updatedCart[existingItemIndex].quantity = newQuantity;
          action = 'updated';
        }
      } else {
        if (quantity <= 0) {
          updatedCart = prevCart;
        } else {
          updatedCart = [...prevCart, { ...product, quantity }];
          action = 'added';
        }
      }
      return updatedCart;
    });

    // Toast outside setCart
    if (action === 'added') {
      toast.success(`${product.name} added to cart.`);
    } else if (action === 'updated') {
      toast.success(`${product.name} quantity updated.`);
    } else if (action === 'removed') {
      toast.error(`${product.name} removed from cart.`);
    }
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    let removedItem: CartItem | undefined;
    setCart((prevCart) => {
      removedItem = prevCart.find(item => item.id === productId);
      return prevCart.filter(item => item.id !== productId);
    });

    if (removedItem) {
      toast.error(`${removedItem.name} removed from cart.`);
    }
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    let updatedItem: CartItem | undefined;
    let action: 'updated' | 'removed' | null = null;

    setCart((prevCart) => {
      if (quantity <= 0) {
        updatedItem = prevCart.find(item => item.id === productId);
        action = 'removed';
        return prevCart.filter((item) => item.id !== productId);
      }

      updatedItem = prevCart.find(item => item.id === productId);
      action = 'updated';

      return prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
    });

    if (updatedItem && action === 'updated') {
      toast.success(`${updatedItem.name} quantity set to ${quantity}.`);
    } else if (updatedItem && action === 'removed') {
      toast.error(`${updatedItem.name} removed from cart.`);
    }
  }, []);

  const clearCart = useCallback((suppressToast = false) => {
    setCart([]);
    if (!suppressToast) {
      toast.info('Your shopping cart is now empty.');
    }
  }, []);

  const contextValue = useMemo(
    () => ({ cart, addToCart, removeFromCart, updateQuantity, clearCart }),
    [cart, addToCart, removeFromCart, updateQuantity, clearCart]
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
