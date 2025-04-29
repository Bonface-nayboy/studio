
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Minus, Plus, X } from 'lucide-react';
import { sampleProducts } from '@/data/products';
import { useCart } from '@/context/cart-context';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/dialog'; // Import Dialog components

export default function EcommercePage() {
  const { addToCart, updateQuantity, cart } = useCart();
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

          return (
             <Dialog key={product.id}> {/* Wrap Card with Dialog */}
              <Card className="flex flex-col overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="p-0">
                   <DialogTrigger asChild>
                     <div className="aspect-video relative w-full cursor-pointer group overflow-hidden">
                       <Image
                         src={product.imageUrl}
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

              {/* Modal Content */}
              <DialogContent className="max-w-3xl p-0 bg-transparent border-0 shadow-none">
                 <DialogClose className="absolute right-2 top-2 z-10 rounded-full p-1.5 bg-background/60 text-foreground/80 backdrop-blur-sm transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </DialogClose>
                <div className="relative aspect-video w-full">
                  <Image
                    src={product.imageUrl} // Display the selected product image
                    alt={product.name}
                    layout="fill"
                    objectFit="contain" // Use contain to show the whole image without cropping
                  />
                  {/* Placeholder for future image scrolling controls */}
                  {/* <div className="absolute inset-0 flex items-center justify-between p-4">
                    <Button variant="ghost" size="icon" className="text-white bg-black/30 hover:bg-black/50"> L </Button>
                    <Button variant="ghost" size="icon" className="text-white bg-black/30 hover:bg-black/50"> R </Button>
                  </div> */}
                </div>
                  <p className="text-center text-sm text-muted-foreground p-2 bg-background/80 backdrop-blur-sm">{product.name}</p> {/* Optional caption */}
              </DialogContent>
            </Dialog>
          );
        })}
      </div>
    </main>
  );
}
