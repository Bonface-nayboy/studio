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
import MainLayout from '@/app/(main)/layout'; // Import MainLayout

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState(''); // Add mobile number state
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name || !email || !password || !confirmPassword || !mobileNumber) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulate sign-up process
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Success",
      description: "Signed up successfully!",
    });

    setIsLoading(false);
  };

  return (
    <MainLayout> {/* Wrap content with MainLayout */}
      <main className="container mx-auto py-12 px-4 flex-grow flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Create an account to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
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
                <label htmlFor="mobileNumber" className="block text-sm font-medium mb-1">
                  Mobile Number
                </label>
                <Input
                  type="tel"
                  id="mobileNumber"
                  placeholder="Your Mobile Number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
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
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm Your Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="bg-accent-teal hover:bg-accent-teal/90 text-white">
                {isLoading ? 'Signing Up...' : 'Sign Up'}
              </Button>
            </form>
            <div className="mt-4 text-center">
              Already have an account? <Link href="/signin" className="text-primary">Sign In</Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </MainLayout>
  );
};

export default SignUpPage;
