
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Minus, Plus } from 'lucide-react';
import { sampleProducts } from '@/data/products';
import { useCart } from '@/context/cart-context';
import { useState } from 'react';

export default function EcommercePage() {
  const { addToCart, updateQuantity, cart } = useCart();
   // Local state to manage quantity input for each product
  const [productQuantities, setProductQuantities] = useState<{ [key: string]: number }>({});

  const handleQuantityChange = (productId: string, change: number) => {
    setProductQuantities(prev => {
      const currentQuantity = prev[productId] || 0;
      const newQuantity = Math.max(1, currentQuantity + change); // Ensure quantity is at least 1
      return { ...prev, [productId]: newQuantity };
    });
  };

  const handleAddToCart = (product: typeof sampleProducts[0]) => {
    const quantityToAdd = productQuantities[product.id] || 1;
    addToCart(product, quantityToAdd);
     setProductQuantities(prev => ({ ...prev, [product.id]: 1 })); // Reset quantity after adding
  };


  return (
    <main className="container mx-auto py-8 px-4 flex-grow">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sampleProducts.map((product) => {
          const cartItem = cart.find(item => item.id === product.id);
          const quantityInCart = cartItem?.quantity || 0;
          const currentInputQuantity = productQuantities[product.id] || 1;

          return (
            <Card key={product.id} className="flex flex-col overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0">
                <div className="aspect-video relative w-full">
                 <Image
                    src={product.imageUrl}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                 <div className="p-4">
                    <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground mt-1">{product.category}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-4">
                <p className="text-sm mb-4">{product.description}</p>
                <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
              </CardContent>
              <CardFooter className="p-4 bg-muted/50 mt-auto">
                <div className="flex items-center justify-between w-full gap-2">
                   <div className="flex items-center border rounded-md">
                     <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(product.id, -1)}
                      disabled={currentInputQuantity <= 1}
                     >
                       <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-10 text-center text-sm font-medium">{currentInputQuantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                       className="h-8 w-8"
                      onClick={() => handleQuantityChange(product.id, 1)}
                      >
                       <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button onClick={() => handleAddToCart(product)} size="sm">
                    Add to Cart
                  </Button>
                </div>
                 {quantityInCart > 0 && (
                    <p className="text-xs text-muted-foreground mt-2 w-full text-right">In Cart: {quantityInCart}</p>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
