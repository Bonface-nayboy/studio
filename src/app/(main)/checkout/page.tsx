
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default function CheckoutPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
     updateQuantity(productId, Math.max(0, newQuantity)); // Prevent negative quantity
  };

  return (
    <main className="container mx-auto py-8 px-4 flex-grow">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      {cart.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <p className="mb-4">Your cart is empty.</p>
            <Button asChild>
              <Link href="/ecommerce">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.id} className="flex items-center p-4 gap-4 overflow-hidden">
                 <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                    {item.imageUrls && item.imageUrls.length > 0 && ( // Check if imageUrls exists and has items
                      <Image
                          src={item.imageUrls[0]} // Display the first image
                          alt={item.name}
                          layout="fill"
                          objectFit="cover"
                      />
                    )}
                 </div>
                <div className="flex-grow">
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                   <div className="flex items-center mt-2">
                     <Button
                       variant="outline"
                       size="icon"
                       className="h-8 w-8"
                       onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                     </Button>
                     <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                         onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10) || 1)}
                        className="h-8 w-14 text-center mx-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                     />
                     <Button
                       variant="outline"
                       size="icon"
                       className="h-8 w-8"
                       onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                     </Button>
                   </div>
                </div>
                 <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 className="h-5 w-5" />
                  <span className="sr-only">Remove item</span>
                 </Button>
              </Card>
            ))}
             <Button variant="outline" size="sm" onClick={clearCart} className="mt-4">
                Clear Cart
             </Button>
          </div>

          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                 <Separator className="my-2" />
                 <div className="flex justify-between font-semibold text-lg">
                   <span>Total</span>
                   <span>${totalPrice.toFixed(2)}</span>
                 </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Proceed to Checkout</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </main>
  );
}
