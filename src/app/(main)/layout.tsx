'use client';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Clock } from 'lucide-react'; // Import Clock icon for hold orders
import { useCart } from '@/context/cart-context';
import { Logo } from '@/components/logo'; // Import the Logo component
import { useEffect, useState } from 'react'; // Import useState and useEffect
import { useRouter } from 'next/navigation';
import { SessionProvider } from 'next-auth/react'; // Import SessionProvider

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const { cart, clearCart } = useCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const router = useRouter();

    const [username, setUsername] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [mobileNumber, setMobileNumber] = useState<string | null>(null);

    useEffect(() => {
        // Check if the user is signed in by reading from local storage
        const storedUsername = localStorage.getItem('username');
        const storedEmail = localStorage.getItem('email');
        const storedMobileNumber = localStorage.getItem('mobileNumber');

        if (storedUsername) {
            setUsername(storedUsername);
        }
        if (storedEmail) {
            setEmail(storedEmail);
        }
        if (storedMobileNumber) {
            setMobileNumber(storedMobileNumber);
        }
    }, []);

    const handleSignOut = () => {
        // Handle sign-out by clearing the local storage and the cart
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('mobileNumber');
        setUsername(null);
        clearCart(true); // Suppress toast notification when clearing the cart on sign out
        router.push('/'); // Redirect to home or sign-in page after sign out
    };

    return (
        <SessionProvider>
            <div className="flex flex-col min-h-screen">
                   
                <header className="bg-black text-appbar-foreground p-2 md:p-3 flex flex-col md:flex-row md:items-center justify-between rounded-b-md shadow-md sticky top-0 z-50">


                        <Logo className="h-8 md:h-10 w-auto" />
                   
                        <nav className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 mt-4 md:mt-0">
                        

                        <Link href="/ecommerce" passHref>
                            <Button variant="secondary">E-commerce</Button>
                        </Link>
                        <Link href="/order/hold-orders" passHref>
                            <Button variant="ghost" className="relative">
                                <Clock className="h-8 w-8 text-white" />
                                <span className="sr-only">Hold Orders</span>
                            </Button>
                        </Link>
                        <Link href="/checkout" passHref>
                            <Button variant="ghost" className="relative ">
                                <ShoppingCart className="h-7 w-7 text-white" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {totalItems}
                                    </span>
                                )}
                                <span className="sr-only">Cart</span>
                            </Button>
                        </Link>
                        {!username ? (
                            <>
                                <Link href="/signin" passHref>
                                    <Button variant="secondary" size="sm">Sign In</Button>
                                </Link>
                                <Link href="/signup" passHref>
                                    <Button size="sm">Sign Up</Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/account" passHref>
                                    <button className="flex items-center space-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9.969 9.969 0 0112 15c2.21 0 4.21.714 5.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="text-lg font-semibold text-white">{username}</span>
                                    </button>
                                </Link>
                                <button onClick={handleSignOut} className="text-sm bg-white align-center text-black">Sign Out</button>
                            </>
                        )}
                    </nav>
                </header>
                {children}
            </div>
        </SessionProvider>
    );
}