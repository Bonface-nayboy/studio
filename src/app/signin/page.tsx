'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from "@/hooks/use-toast";
import Link from 'next/link';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulate sign-in process
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Success",
      description: "Signed in successfully!",
    });

    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    // Simulate Google sign-in process
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Success",
      description: "Signed in with Google successfully!",
    });

    setIsLoading(false);
  };

  return (
    <main className="container mx-auto py-12 px-4 flex-grow flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Enter your email and password to sign in.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input
                type="email"
                id="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <Input
                type="password"
                id="password"
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="bg-accent-teal hover:bg-accent-teal/90 text-white">
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button variant="outline" disabled={isLoading} onClick={handleGoogleSignIn}>
              Sign In with Google
            </Button>
          </div>
          <div className="mt-4 text-center">
            Don't have an account? <Link href="/signup" className="text-primary">Sign Up</Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default SignInPage;
