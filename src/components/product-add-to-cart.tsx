
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import type { Product } from '@/data/products'; // Use the shared Product interface

interface ProductAddToCartProps {
  product: Product; // Receive the fully serialized product data
}

export default function ProductAddToCart({ product }: ProductAddToCartProps) {
  const { addToCart, cart } = useCart();
  const [quantity, setQuantity] = useState(1); // Local state for quantity input

  const cartItem = cart.find(item => item.id === product.id);
  const quantityInCart = cartItem?.quantity || 0;

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change)); // Ensure quantity is at least 1
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1); // Reset quantity input to 1 after adding
  };

  return (
    <div className="flex flex-col items-end w-full gap-2">
      <div className="flex items-center justify-between w-full gap-2">
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-10 text-center text-sm font-medium" aria-live="polite">
            {quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleQuantityChange(1)}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={handleAddToCart} size="sm">
          Add to Cart
        </Button>
      </div>
      {quantityInCart > 0 && (
        <p className="text-xs text-muted-foreground w-full text-right">In Cart: {quantityInCart}</p>
      )}
    </div>
  );
}
