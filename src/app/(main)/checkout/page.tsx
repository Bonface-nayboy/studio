
'use client'; // Keep as client component for cart interaction

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2, CreditCard, Smartphone } from 'lucide-react'; // Removed Paypal
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
  DialogClose,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

// Inline SVG for PayPal icon (keep as is, since lucide doesn't have it)
const PaypalIcon = (props: React.SVGProps<SVGSVGElement>) => (
 <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);


export default function CheckoutPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart(); // Cart logic remains client-side
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
     updateQuantity(productId, Math.max(0, newQuantity));
  };

  const handleProceedToCheckout = () => {
    setSelectedPaymentMethod(null);
    setIsModalOpen(true);
  };

  const handleConfirmPayment = () => {
     if (!selectedPaymentMethod) {
        toast({
            title: "Payment Method Required",
            description: "Please select a payment method.",
            variant: "destructive",
        });
        return false;
     }

    console.log("Selected Payment Method:", selectedPaymentMethod);

    if (selectedPaymentMethod === 'mpesa') {
        // Placeholder for M-Pesa integration
        toast({
            title: "M-Pesa Payment",
            description: "Initiating M-Pesa payment... (Simulation)",
        });
        // Simulate API call or further steps
        // On successful real integration, you would:
         clearCart(); // Clear cart after successful (simulated) payment
        // setIsModalOpen(false); // DialogClose handles this
        return true;
    } else {
        toast({
            title: "Payment Method Not Implemented",
            description: `Payment via ${selectedPaymentMethod} is not yet implemented.`,
            variant: "default",
        });
        return true; // Allow closing dialog
    }
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
                     {item.imageUrls && item.imageUrls.length > 0 ? (
                       <Image
                           src={item.imageUrls[0]} // Display first image
                           alt={item.name}
                           fill={true}
                           style={{ objectFit: "cover" }}
                           sizes="80px" // Specify size for optimization
                       />
                     ) : (
                       <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground text-xs">No Image</div>
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
                       aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <Minus className="h-4 w-4" />
                     </Button>
                     <Input
                        type="number"
                        min="1" // Should be handled by updateQuantity logic now
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10) || 0)} // Allow 0 temporarily, updateQuantity handles removal
                        className="h-8 w-14 text-center mx-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        aria-label={`Quantity for ${item.name}`}
                     />
                     <Button
                       variant="outline"
                       size="icon"
                       className="h-8 w-8"
                       onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                       aria-label={`Increase quantity of ${item.name}`}
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
                  aria-label={`Remove ${item.name} from cart`}
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
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                   <DialogTrigger asChild>
                    <Button className="w-full" onClick={handleProceedToCheckout} disabled={cart.length === 0}>
                      Proceed to Checkout
                    </Button>
                   </DialogTrigger>
                   <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Select Payment Method</DialogTitle>
                      <DialogDescription>
                        Choose how you would like to pay for your order. Total: ${totalPrice.toFixed(2)}
                      </DialogDescription>
                    </DialogHeader>
                    <RadioGroup
                      value={selectedPaymentMethod ?? undefined}
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
                        <RadioGroupItem value="card" id="card" disabled />
                        <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-grow text-muted-foreground">
                           <CreditCard className="h-5 w-5" /> Credit/Debit Card (Coming Soon)
                         </Label>
                      </div>
                       <div className="flex items-center space-x-2 p-3 rounded-md border hover:border-primary transition-colors cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-muted">
                        <RadioGroupItem value="paypal" id="paypal" disabled />
                         <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer flex-grow text-muted-foreground">
                           <PaypalIcon className="h-5 w-5" /> PayPal (Coming Soon)
                        </Label>
                      </div>
                    </RadioGroup>
                    <DialogFooter>
                       <DialogClose asChild>
                         <Button variant="outline">Cancel</Button>
                       </DialogClose>
                         {/* Use DialogClose and conditional logic within handleConfirmPayment */}
                         <DialogClose asChild={handleConfirmPayment()}>
                            {/* Button itself doesn't need conditional closing */}
                           <Button onClick={handleConfirmPayment} disabled={!selectedPaymentMethod}>
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
