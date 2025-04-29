
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2, CreditCard, Smartphone, Paypal } from 'lucide-react'; // Added icons
import { useCart } from '@/context/cart-context';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose, // Import DialogClose
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export default function CheckoutPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
     updateQuantity(productId, Math.max(0, newQuantity)); // Prevent negative quantity
  };

  const handleProceedToCheckout = () => {
    // This function is now handled by DialogTrigger opening the modal
    // We keep the state update in case we need it for other logic
    setIsModalOpen(true);
  };

  const handleConfirmPayment = () => {
     if (!selectedPaymentMethod) {
        toast({
            title: "Payment Method Required",
            description: "Please select a payment method.",
            variant: "destructive",
        });
        return;
     }

    console.log("Selected Payment Method:", selectedPaymentMethod);

    if (selectedPaymentMethod === 'mpesa') {
        // Placeholder for M-Pesa integration
        toast({
            title: "M-Pesa Payment",
            description: "Initiating M-Pesa payment... (Simulation)",
        });
        // Simulate API call or further steps
        // On success: clearCart(); setIsModalOpen(false);
    } else {
        toast({
            title: "Payment Method Not Available",
            description: `Payment via ${selectedPaymentMethod} is not yet implemented.`,
            variant: "destructive", // Use destructive variant for unimplemented methods
        });
    }
     // Close the modal after attempting payment (or showing message)
     // setIsModalOpen(false); // DialogClose handles this
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
                    {item.imageUrls && item.imageUrls.length > 0 && (
                      <Image
                          src={item.imageUrls[0]}
                          alt={item.name}
                          fill={true} // Use fill for responsive images within container
                          style={{ objectFit: "cover" }} // Ensure image covers the area
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
                {/* Wrap the button in DialogTrigger */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                   <DialogTrigger asChild>
                    <Button className="w-full" onClick={handleProceedToCheckout}>
                      Proceed to Checkout
                    </Button>
                   </DialogTrigger>
                   <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Select Payment Method</DialogTitle>
                      <DialogDescription>
                        Choose how you would like to pay for your order.
                      </DialogDescription>
                    </DialogHeader>
                    <RadioGroup
                      value={selectedPaymentMethod ?? undefined} // Handle null state for RadioGroup
                       onValueChange={setSelectedPaymentMethod}
                      className="grid gap-4 py-4"
                    >
                      <div className="flex items-center space-x-2 p-3 rounded-md border hover:border-primary transition-colors cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-muted">
                        <RadioGroupItem value="mpesa" id="mpesa" />
                        <Label htmlFor="mpesa" className="flex items-center gap-2 cursor-pointer flex-grow">
                          <Smartphone className="h-5 w-5" /> M-Pesa
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-md border hover:border-primary transition-colors cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-muted">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-grow">
                           <CreditCard className="h-5 w-5" /> Credit/Debit Card
                         </Label>
                      </div>
                       <div className="flex items-center space-x-2 p-3 rounded-md border hover:border-primary transition-colors cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-muted">
                        <RadioGroupItem value="paypal" id="paypal" />
                         <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer flex-grow">
                           <Paypal className="h-5 w-5" /> PayPal
                        </Label>
                      </div>
                    </RadioGroup>
                    <DialogFooter>
                       <DialogClose asChild>
                         <Button variant="outline">Cancel</Button>
                       </DialogClose>
                       {/* Keep DialogClose wrapping the Confirm button if you want it to close regardless of success/failure */}
                       <DialogClose asChild={selectedPaymentMethod !== null}>
                           <Button onClick={handleConfirmPayment}>
                               Confirm Payment
                           </Button>
                        </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </main>
  );
}
