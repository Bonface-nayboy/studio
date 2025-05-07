'use client'; // Keep as client component for cart interaction
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2, CreditCard, Smartphone, Clock } from 'lucide-react'; // Added Clock icon
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
import { useState, useEffect } from 'react';
// import { toast } from '@/hooks/use-toast';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation'; // Import useRouter
import HeldOrderModel from '@/models/HeldOrder';
import AddressModal from '@/components/ui/address-modal'; // Import AddressModal component
import { ToastContainer } from 'react-toastify';
import { Box, Typography } from '@mui/material';

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
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
        <path d="M12 12v4M12 8h.01" />
    </svg>
);

interface CheckoutFormData {
    name: string;
    email: string;
    mobileNumber: string;
    address?: string;
    fullname?: string;
    street?: string;
    city?: string;
    country?: string;
}

export default function CheckoutPage() {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checkoutData, setCheckoutData] = useState<CheckoutFormData>({
        name: '',
        email: '',
        mobileNumber: '',
        address: '',
        fullname: '',
        street: '',
        city: '',
        country: '',
    });
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [shippingAddress, setShippingAddress] = useState(null);

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleQuantityChange = (productId: string, newQuantity: number) => {
        updateQuantity(productId, Math.max(0, newQuantity));
    };

    const handleProceedToCheckout = () => {
        const storedUsername = localStorage.getItem('username');
        const storedEmail = localStorage.getItem('email');

        if (!storedUsername || !storedEmail) {
            toast({
                title: "Sign In Required",
                description: "Please sign in or sign up to proceed to payment.",
                variant: "destructive",
            });
            return;
        }

        setSelectedPaymentMethod(null);
        setIsModalOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCheckoutData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveAddress = (county: string, street: string) => {
        setShippingAddress({ county, street });
        setIsAddressModalOpen(false);
    };

    const handleConfirmPayment = async () => {
        if (!selectedPaymentMethod) {
            toast({
                title: "Payment Method Required",
                description: "Please select a payment method.",
                variant: "destructive",
            });
            return;
        }

        if (!shippingAddress || !shippingAddress.county || !shippingAddress.street) {
            toast({
                title: "Shipping Address Required",
                description: "Please provide a valid shipping address.",
                variant: "destructive",
            });
            setIsAddressModalOpen(true);
            return;
        }

        setLoading(true);

        try {
            const orderResponse = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cart: cart,
                    totalPrice: totalPrice,
                    paymentMethod: selectedPaymentMethod,
                    name: checkoutData.name,
                    email: checkoutData.email,
                    mobileNumber: checkoutData.mobileNumber,
                    shippingAddress: shippingAddress,
                }),
            });

            if (!orderResponse.ok) {
                const errorData = await orderResponse.json();
                throw new Error(errorData?.message || `HTTP error! Status: ${orderResponse.status}`);
            }

            const data = await orderResponse.json();
            console.log('Order created:', data);

          
            setIsPaymentConfirmed(true);
            // toast({
            //     title: "Order Placed",
            //     description: "Your order has been placed successfully!",
            //     variant: "success",
            // });
            toast.success("Your order has been placed successfully!", {
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            clearCart();

            router.push(`/order/${data.orderId}`);
        } catch (error: any) {
            console.error('Error placing order:', error);
            toast({
                title: "Order Error",
                description: error.message || "There was an error placing your order. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleHoldCart = () => {
        if (cart.length > 0) {
            // Save the cart items to local storage for hold orders
            localStorage.setItem('holdOrders', JSON.stringify(cart));
            clearCart();
            toast({
                title: "Cart Held",
                description: "Your current cart has been saved for later.",
            });
        } else {
            toast({
                title: "Empty Cart",
                description: "Your cart is empty. Nothing to hold.",
                variant: "warning",
            });
        }
    };

    const handleHoldOrder = async () => {
        const storedEmail = localStorage.getItem('email');
        console.log('Stored Email:', storedEmail);

        if (!storedEmail) {
            console.log('Triggering toast: Sign In Required');
            toast({
                title: 'Sign In Required',
                description: 'Please sign in or sign up to hold the order.',
                variant: 'destructive',
            });
            return;
        }

        if (cart.length === 0) {
            toast({
                title: 'Empty Cart',
                description: 'Your cart is empty. Add items to hold an order.',
                variant: 'destructive',
            });
            return;
        }

        try {
            const response = await fetch('/api/hold-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: storedEmail, // Use email from local storage
                    items: cart.map(item => ({
                        id: item.id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || `HTTP error! Status: ${response.status}`);
            }

            toast({
                title: 'Order Held',
                description: 'Your order has been saved successfully.',
            });

            clearCart();
        } catch (error: any) {
            console.error('Error holding order:', error);
            toast({
                title: 'Error Holding Order',
                description: error.message || 'Failed to save your order.',
                variant: 'destructive',
            });
        }
    };

    useEffect(() => {
        if (isPaymentConfirmed) {
            setIsModalOpen(false);
        }
    }, [isPaymentConfirmed]);

    useEffect(() => {
        // Retrieve username, email, and mobile number from local storage on component mount
        const storedUsername = localStorage.getItem('username');
        const storedEmail = localStorage.getItem('email');
        const storedMobileNumber = localStorage.getItem('mobileNumber');

        if (storedUsername) {
            setUsername(storedUsername);
            setCheckoutData(prev => ({
                ...prev,
                name: storedUsername,
            }));
        }

        if (storedEmail) {
            setCheckoutData(prev => ({
                ...prev,
                email: storedEmail,
            }));
        }

        if (storedMobileNumber) {
            setCheckoutData(prev => ({
                ...prev,
                mobileNumber: storedMobileNumber,
            }));
        }
    }, []);

//     return (
//         <>
//             <AddressModal
//                 isOpen={isAddressModalOpen}
//                 onClose={() => setIsAddressModalOpen(false)}
//                 onSave={({ county, street }) => handleSaveAddress(county, street)}
//             />
//             <main className="container mx-auto py-8 px-4 flex-grow">
//                 <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: '16px' }}>
//                     <Typography className="text-3xl font-bold mb-8">Shopping Cart</Typography>

//                     {cart.length > 0 && (
//                         <Button asChild>
//                             <Link href="/">Continue Shopping</Link>
//                         </Button>
//                     )}


//                 </Box>
//                 {cart.length === 0 ? (
//                     <Card>
//                         <CardContent className="p-6 text-center text-muted-foreground">
//                             <p className="mb-4">Your cart is empty.</p>
//                             <Button asChild>
//                                 <Link href="/">Start Shopping</Link>
//                             </Button>
//                         </CardContent>
//                     </Card>
//                 ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                         {/* Cart Items */}
//                         <div className="md:col-span-2 space-y-4">
//                             {cart.map((item) => (
//                                 <Card key={item.id} className="flex items-center p-4 gap-4 overflow-hidden">
//                                     <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
//                                         {item.imageUrls && item.imageUrls.length > 0 ? (
//                                             <Image
//                                                 src={item.imageUrls[0]} // Display first image
//                                                 alt={item.name}
//                                                 fill={true}
//                                                 style={{ objectFit: "cover" }}
//                                                 sizes="80px" // Specify size for optimization
//                                             />
//                                         ) : (
//                                             <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground text-xs">No Image</div>
//                                         )}
//                                     </div>
//                                     <div className="flex-grow">
//                                         <h2 className="font-semibold">{item.name}</h2>
//                                         {/* <p className="text-sm text-muted-foreground">Ksh{item.price.toFixed(2)}</p> */}

//                                         <p className="text-sm text-muted-foreground">Ksh{item.price.toFixed(2).replace(/\d(?=(\d{3})+(?!\d))/g, '$&,')}</p>

//                                         <div className="flex items-center mt-2">
//                                             <Button
//                                                 variant="outline"
//                                                 size="icon"
//                                                 className="h-8 w-8"
//                                                 onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
//                                                 aria-label={`Decrease quantity of ${item.name}`}
//                                             >
//                                                 <Minus className="h-4 w-4" />
//                                             </Button>
//                                             <Input
//                                                 type="number"
//                                                 min="1"
//                                                 value={item.quantity}
//                                                 onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10) || 0)}
//                                                 className="h-8 w-14 text-center mx-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//                                                 aria-label={`Quantity for ${item.name}`}
//                                             />
//                                             <Button
//                                                 variant="outline"
//                                                 size="icon"
//                                                 className="h-8 w-8"
//                                                 onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
//                                                 aria-label={`Increase quantity of ${item.name}`}
//                                             >
//                                                 <Plus className="h-4 w-4" />
//                                             </Button>
//                                         </div>
//                                     </div>
//                                     <Button
//                                         variant="ghost"
//                                         size="icon"
//                                         className="text-muted-foreground hover:text-destructive"
//                                         onClick={() => removeFromCart(item.id)}
//                                         aria-label={`Remove ${item.name} from cart`}
//                                     >
//                                         <Trash2 className="h-5 w-5" />
//                                         <span className="sr-only">Remove item</span>
//                                     </Button>
//                                 </Card>
//                             ))}

//                             <div className="mt-4 flex justify-between">
//                                 <Button variant="outline" size="sm" onClick={clearCart}>
//                                     Clear Cart
//                                 </Button>
//                                 <Button
//                                     className="w-24"
//                                     onClick={handleHoldOrder}
//                                 >
//                                     Hold Order
//                                 </Button>
//                             </div>

//                         </div>

//                         {/* Order Summary */}
//                         <div className="md:col-span-1">
//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle>Order Summary</CardTitle>
//                                 </CardHeader>
//                                 <CardContent className="space-y-0">
//                                     <div className="flex justify-between">
//                                         <span>Subtotal</span>
//                                         <span>Ksh{totalPrice.toFixed(2).replace(/\d(?=(\d{3})+(?!\d))/g, '$&,')}</span>
//                                     </div>
//                                     <div className="flex justify-between">
//                                         <span>Shipping</span>
//                                         <span>Free</span>
//                                     </div>
//                                     <Separator className="my-0" />
//                                     <div className="flex justify-between font-semibold text-lg">
//                                         <span>Total</span>
//                                         <span>Ksh{totalPrice.toFixed(2).replace(/\d(?=(\d{3})+(?!\d))/g, '$&,')}</span>
//                                     </div>
//                                 </CardContent>
//                                 <CardFooter>
//                                     <div className="space-y-4">
//                                         <h2 className="text-lg font-semibold">Shipping Address</h2>
//                                         <div className="space-y-4">
//                                             {shippingAddress ? (
//                                                 <div className="p-4 border rounded-md">

//                                                     <p><strong>County:</strong> {shippingAddress.county}</p>
//                                                     <p><strong>Street:</strong> {shippingAddress.street}</p>
//                                                     <Button
//                                                         variant="outline"
//                                                         size="sm"
//                                                         onClick={() => setIsAddressModalOpen(true)}
//                                                     >
//                                                         Edit Address
//                                                     </Button>
//                                                 </div>
//                                             ) : (
//                                                 <Button
//                                                     variant="outline"
//                                                     size="sm"
//                                                     onClick={() => setIsAddressModalOpen(true)}
//                                                 >
//                                                     Add Shipping Address
//                                                 </Button>
//                                             )}

//                                         </div>
//                                         <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//                                             <DialogTrigger asChild>
//                                                 <Button className="w-[430px] h-full" onClick={handleProceedToCheckout} disabled={cart.length === 0}>
//                                                     Proceed to Checkout
//                                                 </Button>
//                                             </DialogTrigger>
//                                             <DialogContent className="sm:max-w-[425px]">
//                                                 <DialogHeader>
//                                                     <DialogTitle>Checkout Details</DialogTitle>
//                                                     <DialogDescription>
//                                                         Please confirm your details for the order.
//                                                     </DialogDescription>
//                                                 </DialogHeader>
//                                                 <div className="grid gap-4 py-4">
//                                                     <div className="space-y-2">
//                                                         <Label htmlFor="name">Name</Label>
//                                                         <Input
//                                                             id="name"
//                                                             name="name"
//                                                             value={checkoutData.name}
//                                                             onChange={handleInputChange}
//                                                             required
//                                                             readOnly // Make the field non-editable
//                                                         />
//                                                     </div>
//                                                     <div className="space-y-2">
//                                                         <Label htmlFor="email">Email</Label>
//                                                         <Input
//                                                             type="email"
//                                                             id="email"
//                                                             name="email"
//                                                             value={checkoutData.email}
//                                                             onChange={handleInputChange}
//                                                             required
//                                                             readOnly // Make the field non-editable
//                                                         />
//                                                     </div>
//                                                     <div className="space-y-2">
//                                                         <Label htmlFor="mobileNumber">Mobile Number</Label>
//                                                         <Input
//                                                             id="mobileNumber"
//                                                             name="mobileNumber"
//                                                             value={checkoutData.mobileNumber}
//                                                             onChange={handleInputChange}
//                                                             required
//                                                             readOnly // Make the field non-editable
//                                                         />
//                                                     </div>
//                                                     <DialogTitle className="mt-4">Select Payment Method</DialogTitle>
//                                                     <RadioGroup
//                                                         value={selectedPaymentMethod ?? undefined}
//                                                         onValueChange={setSelectedPaymentMethod}
//                                                         className="grid gap-4 py-2"
//                                                     >
//                                                         <div className="flex items-center space-x-2">
//                                                             <RadioGroupItem value="paypal" id="paypal" />
//                                                             <Label htmlFor="paypal" className="flex items-center space-x-2">
//                                                                 <PaypalIcon className="h-5 w-5" />
//                                                                 <span>PayPal</span>
//                                                             </Label>
//                                                         </div>
//                                                         <div className="flex items-center space-x-2">
//                                                             <RadioGroupItem value="mpesa" id="mpesa" />
//                                                             <Label htmlFor="mpesa" className="flex items-center space-x-2">
//                                                                 <Smartphone className="h-5 w-5" />
//                                                                 <span>M-Pesa</span>
//                                                             </Label>
//                                                         </div>
//                                                     </RadioGroup>
//                                                 </div>
//                                                 <DialogFooter>
//                                                     <Button
//                                                         className="w-full"
//                                                         onClick={handleConfirmPayment}
//                                                         disabled={selectedPaymentMethod === null || loading || !checkoutData.name || !checkoutData.email || !checkoutData.mobileNumber}
//                                                     >
//                                                         {loading ? "Placing Order..." : "Place Order"}
//                                                     </Button>
//                                                 </DialogFooter>
//                                             </DialogContent>
//                                         </Dialog>
//                                     </div>
//                                 </CardFooter>
//                             </Card>
//                         </div>
//                     </div>
//                 )}
//             </main>
//             <ToastContainer />
//         </>
//     );
// }





return (
    <>
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSave={({ county, street }) => handleSaveAddress(county, street)}
      />
      <main className="container mx-auto py-8 px-4 flex-grow">
        <Box className="flex flex-wrap gap-4 items-center mb-4">
          <Typography className="text-3xl font-bold mb-4">Shopping Cart</Typography>
          {cart.length > 0 && (
            <Button asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          )}
        </Box>
  
        {cart.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              <p className="mb-4">Your cart is empty.</p>
              <Button asChild>
                <Link href="/">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center p-4 gap-4 overflow-hidden">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                    {item.imageUrls?.[0] ? (
                      <Image
                        src={item.imageUrls[0]}
                        alt={item.name}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="80px"
                      />
                    ) : (
                      <div className="h-full w-full bg-muted flex items-center justify-center text-xs text-muted-foreground">No Image</div>
                    )}
                  </div>
                  <div className="flex-grow w-full">
                    <h2 className="font-semibold">{item.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      Ksh{item.price.toFixed(2).replace(/\d(?=(\d{3})+(?!\d))/g, "$&,")}
                    </p>
                    <div className="flex items-center mt-2">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                        className="h-8 w-14 text-center mx-2"
                      />
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive self-start sm:self-center"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                    <span className="sr-only">Remove item</span>
                  </Button>
                </Card>
              ))}
  
              <div className="mt-4 flex flex-wrap justify-between gap-2">
                <Button variant="outline" size="sm" onClick={clearCart}>
                  Clear Cart
                </Button>
                <Button size="sm" className="w-full sm:w-32" onClick={handleHoldOrder}>
                  Hold Order
                </Button>
              </div>
            </div>
  
            {/* Order Summary */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Ksh{totalPrice.toFixed(2).replace(/\d(?=(\d{3})+(?!\d))/g, "$&,")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>Ksh{totalPrice.toFixed(2).replace(/\d(?=(\d{3})+(?!\d))/g, "$&,")}</span>
                  </div>
                </CardContent>
  
                <CardFooter>
                  <div className="w-full space-y-4">
                    <h2 className="text-lg font-semibold">Shipping Address</h2>
                    {shippingAddress ? (
                      <div className="p-4 border rounded-md space-y-1">
                        <p><strong>County:</strong> {shippingAddress.county}</p>
                        <p><strong>Street:</strong> {shippingAddress.street}</p>
                        <Button variant="outline" size="sm" onClick={() => setIsAddressModalOpen(true)}>
                          Edit Address
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => setIsAddressModalOpen(true)}>
                        Add Shipping Address
                      </Button>
                    )}
  
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                      <DialogTrigger asChild>
                        <Button
                          className="w-full"
                          onClick={handleProceedToCheckout}
                          disabled={cart.length === 0}
                        >
                          Proceed to Checkout
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-full sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Checkout Details</DialogTitle>
                          <DialogDescription>Please confirm your details for the order.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" value={checkoutData.name} readOnly />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" value={checkoutData.email} readOnly />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="mobileNumber">Mobile Number</Label>
                            <Input id="mobileNumber" name="mobileNumber" value={checkoutData.mobileNumber} readOnly />
                          </div>
  
                          <DialogTitle className="mt-4">Select Payment Method</DialogTitle>
                          <RadioGroup
                            value={selectedPaymentMethod ?? undefined}
                            onValueChange={setSelectedPaymentMethod}
                            className="grid gap-4 py-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="paypal" id="paypal" />
                              <Label htmlFor="paypal" className="flex items-center space-x-2">
                                <PaypalIcon className="h-5 w-5" />
                                <span>PayPal</span>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="mpesa" id="mpesa" />
                              <Label htmlFor="mpesa" className="flex items-center space-x-2">
                                <Smartphone className="h-5 w-5" />
                                <span>M-Pesa</span>
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <DialogFooter>
                          <Button
                            className="w-full"
                            onClick={handleConfirmPayment}
                            disabled={
                              !selectedPaymentMethod || loading ||
                              !checkoutData.name || !checkoutData.email || !checkoutData.mobileNumber
                            }
                          >
                            {loading ? "Placing Order..." : "Place Order"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </main>
      <ToastContainer />
    </>
  );
}  