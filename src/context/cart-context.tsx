
'use client';

import type React from 'react';
import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { Product } from '@/data/products';
import { toast } from '@/hooks/use-toast';

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        const newQuantity = updatedCart[existingItemIndex].quantity + quantity;
         if (newQuantity <= 0) {
           // Remove item if quantity becomes 0 or less
           return updatedCart.filter(item => item.id !== product.id);
         }
        updatedCart[existingItemIndex].quantity = newQuantity;
         toast({ title: "Cart Updated", description: `${product.name} quantity updated.` });
        return updatedCart;
      } else {
          if (quantity <= 0) return prevCart; // Don't add if initial quantity is invalid
        toast({ title: "Item Added", description: `${product.name} added to cart.` });
        return [...prevCart, { ...product, quantity }];
      }
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => {
        const itemToRemove = prevCart.find(item => item.id === productId);
        if (itemToRemove) {
             toast({ title: "Item Removed", description: `${itemToRemove.name} removed from cart.`, variant: "destructive" });
        }
        return prevCart.filter((item) => item.id !== productId)
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCart((prevCart) => {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        const itemToRemove = prevCart.find(item => item.id === productId);
        if (itemToRemove) {
             toast({ title: "Item Removed", description: `${itemToRemove.name} removed from cart.`, variant: "destructive" });
        }
        return prevCart.filter((item) => item.id !== productId);
      }
      const itemToUpdate = prevCart.find(item => item.id === productId);
       if (itemToUpdate) {
            toast({ title: "Quantity Updated", description: `${itemToUpdate.name} quantity set to ${quantity}.` });
       }
      return prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
    });
  }, []);

   const clearCart = useCallback(() => {
    setCart([]);
     toast({ title: "Cart Cleared", description: "Your shopping cart is now empty." });
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
