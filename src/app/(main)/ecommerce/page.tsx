
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Minus, Plus, X } from 'lucide-react';
import { sampleProducts } from '@/data/products';
import { useCart } from '@/context/cart-context';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/dialog'; // Import Dialog components
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'; // Import ScrollArea for modal

export default function EcommercePage() {
  const { addToCart, cart } = useCart();
   // Local state to manage quantity input for each product
  const [productQuantities, setProductQuantities] = useState<{ [key: string]: number }>({});

  const handleQuantityChange = (productId: string, change: number) => {
    setProductQuantities(prev => {
      const currentQuantity = prev[productId] || 1; // Start from 1 if not set
      const newQuantity = Math.max(1, currentQuantity + change); // Ensure quantity is at least 1
      return { ...prev, [productId]: newQuantity };
    });
  };

  const handleAddToCart = (product: typeof sampleProducts[0]) => {
    const quantityToAdd = productQuantities[product.id] || 1;
    addToCart(product, quantityToAdd);
     setProductQuantities(prev => ({ ...prev, [product.id]: 1 })); // Reset quantity input to 1 after adding
  };


  return (
    <main className="container mx-auto py-8 px-4 flex-grow">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sampleProducts.map((product) => {
          const cartItem = cart.find(item => item.id === product.id);
          const quantityInCart = cartItem?.quantity || 0;
          const currentInputQuantity = productQuantities[product.id] || 1;
          const firstImageUrl = product.imageUrls[0]; // Get the first image for the card

          return (
             <Dialog key={product.id}> {/* Wrap Card with Dialog */}
              <Card className="flex flex-col overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="p-0">
                   <DialogTrigger asChild>
                     <div className="aspect-video relative w-full cursor-pointer group overflow-hidden">
                       <Image
                         src={firstImageUrl} // Display the first image on the card
                         alt={product.name}
                         layout="fill"
                         objectFit="cover"
                         className="transition-transform duration-300 group-hover:scale-105"
                       />
                     </div>
                    </DialogTrigger>
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

              {/* Modal Content - Updated for scrollable images */}
              <DialogContent className="max-w-4xl p-4 sm:p-6 bg-background border rounded-lg shadow-xl">
                 <DialogClose className="absolute right-3 top-3 z-10 rounded-full p-1.5 bg-background/60 text-foreground/80 backdrop-blur-sm transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </DialogClose>

                 <h2 className="text-xl font-semibold mb-4">{product.name}</h2>

                <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                  <div className="flex space-x-4 p-4">
                    {product.imageUrls.map((url, index) => (
                      <div key={index} className="relative aspect-square h-64 md:h-80 lg:h-96 flex-shrink-0 overflow-hidden rounded-md">
                         <Image
                           src={url}
                           alt={`${product.name} - Image ${index + 1}`}
                           layout="fill"
                           objectFit="contain"
                           className="bg-muted" // Add a background for letterboxing if needed
                         />
                       </div>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                 </ScrollArea>

                 <p className="text-sm text-muted-foreground mt-4">{product.description}</p>
                  <p className="text-lg font-bold mt-2">${product.price.toFixed(2)}</p>

                   {/* Keep add to cart functionality in modal too if desired */}
                   {/*
                   <div className="mt-6 flex items-center justify-end gap-2">
                     <div className="flex items-center border rounded-md">
                       <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(product.id, -1)} disabled={currentInputQuantity <= 1}>
                         <Minus className="h-4 w-4" />
                       </Button>
                       <span className="w-10 text-center text-sm font-medium">{currentInputQuantity}</span>
                       <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(product.id, 1)}>
                         <Plus className="h-4 w-4" />
                       </Button>
                     </div>
                     <Button onClick={() => handleAddToCart(product)} size="sm">
                       Add to Cart
                     </Button>
                   </div>
                   */}
              </DialogContent>
            </Dialog>
          );
        })}
      </div>
    </main>
  );
}

