'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Clock, Menu as MenuIcon, X } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Logo } from '@/components/logo';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { cart, clearCart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const router = useRouter();

  const [username, setUsername] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setUsername(localStorage.getItem('username'));
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('mobileNumber');
    setUsername(null);
    clearCart(true);
    router.push('/');
  };

  return (
    <SessionProvider>
      <div className="flex flex-col min-h-screen">
        <header className="bg-black text-white p-4 sticky top-0 z-50 shadow-md">
          <div className="flex items-center justify-between">
            {/* Left section with logo */}
            <div className="flex items-center gap-4">
              <Logo className="h-8 w-auto" />
            </div>

            {/* Icons that always show (cart and hold) */}
            <div className="flex items-center gap-3 sm:hidden">
              <Link href="/order/hold-orders">
                <Clock className="h-6 w-6 text-white" />
              </Link>
              <Link href="/checkout" className="relative">
                <ShoppingCart className="h-6 w-6 text-white" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
              </button>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden sm:flex items-center gap-3">
              <Link href="/ecommerce"><Button variant="secondary">E-commerce</Button></Link>
              <Link href="/order/hold-orders">
                <Button variant="ghost" className="relative">
                  <Clock className="h-6 w-6 text-white" />
                </Button>
              </Link>
              <Link href="/checkout" className="relative">
                <Button variant="ghost">
                  <ShoppingCart className="h-6 w-6 text-white" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-destructive text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>

              {!username ? (
                <>
                  <Link href="/signin"><Button variant="secondary" size="sm">Sign In</Button></Link>
                  <Link href="/signup"><Button size="sm">Sign Up</Button></Link>
                </>
              ) : (
                <>
                  <Link href="/account" className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9.969 9.969 0 0112 15c2.21 0 4.21.714 5.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-md font-medium text-white">{username}</span>
                  </Link>
                  <button onClick={handleSignOut} className="bg-white px-3 py-1 rounded text-black text-sm">Sign Out</button>
                </>
              )}
            </nav>
          </div>

          {/* Mobile Dropdown */}
          {menuOpen && (
            <div className="sm:hidden mt-3 flex flex-col gap-2">
              <Link href="/ecommerce"><Button variant="secondary" className="w-full">E-commerce</Button></Link>
              {!username ? (
                <>
                  <Link href="/signin"><Button variant="secondary" className="w-full">Sign In</Button></Link>
                  <Link href="/signup"><Button className="w-full">Sign Up</Button></Link>
                </>
              ) : (
                <>
                  <Link href="/account" className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9.969 9.969 0 0112 15c2.21 0 4.21.714 5.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{username}</span>
                  </Link>
                  <button onClick={handleSignOut} className="bg-white px-3 py-1 rounded text-black">Sign Out</button>
                </>
              )}
            </div>
          )}
        </header>

        {children}
      </div>
    </SessionProvider>
  );
}
