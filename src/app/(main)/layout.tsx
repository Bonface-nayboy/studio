
'use client';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/cart-context';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const { cart } = useCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-appbar-background text-appbar-foreground p-4 md:p-6 flex items-center justify-between rounded-b-md shadow-md sticky top-0 z-50">
        <Link href="/" className="text-xl md:text-2xl font-bold">
          Product Showcase
        </Link>
        <nav className="flex items-center space-x-2 md:space-x-4">
           <Link href="/ecommerce" passHref>
             <Button variant="secondary">E-commerce</Button>
            </Link>
          <Link href="/checkout" passHref>
            <Button variant="ghost" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>
          <Button variant="secondary" size="sm">Sign In</Button>
          <Button size="sm">Sign Up</Button>
        </nav>
      </header>
        {children}
      {/* Consider adding a footer here if needed */}
    </div>
  );
}
