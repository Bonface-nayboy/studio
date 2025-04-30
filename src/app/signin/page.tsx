'use client';

import React, { useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
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
import { signInUser, type SignInFormState } from '@/actions/authActions'; // Import server action

// Submit Button component
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            {pending ? 'Signing In...' : 'Sign In'}
        </Button>
    );
}

const SignInPage = () => {
  const initialState: SignInFormState = { message: '', success: false };
  const [state, formAction] = useActionState(signInUser, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      toast({
        title: "Success",
        description: state.message,
      });
      formRef.current?.reset(); // Reset form fields on success
      // Optionally redirect to dashboard or home page
      // window.location.href = '/';
    } else if (state.message && !state.success) {
       // Display specific field errors or a general error toast
        if (state.errors?.length) {
             state.errors.forEach(err => {
                 toast({
                    // Use '_form' path for general errors, or specific path if available
                    title: `Error ${err.path && err.path[0] !== '_form' ? `in ${err.path?.join('.')}` : ''}`,
                    description: err.message,
                    variant: "destructive",
                });
             });
        } else {
             toast({
                title: "Sign In Error",
                description: state.message,
                variant: "destructive",
            });
        }
    }
  }, [state]);

  // Simulate Google Sign-In (placeholder)
   const handleGoogleSignIn = async () => {
    toast({ title: "Info", description: "Google Sign-In not yet implemented." });
    // In a real app, you'd initiate the Google OAuth flow here
  };


  return (
    <MainLayout> {/* Wrap content with MainLayout */}
      <main className="container mx-auto py-12 px-4 flex-grow flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your email and password to sign in.</CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} action={formAction} className="flex flex-col space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Your Email"
                  required
                />
                {state.errors?.find(e => e.path?.[0] === 'email') && (
                    <p className="text-sm font-medium text-destructive mt-1">
                        {state.errors.find(e => e.path?.[0] === 'email')?.message}
                    </p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Your Password"
                  required
                />
                 {state.errors?.find(e => e.path?.[0] === 'password') && (
                    <p className="text-sm font-medium text-destructive mt-1">
                        {state.errors.find(e => e.path?.[0] === 'password')?.message}
                    </p>
                )}
              </div>
               {/* Display general form errors (e.g., invalid credentials) */}
                {state.errors?.find(e => e.path?.[0] === '_form') && (
                    <p className="text-sm font-medium text-destructive">
                         {state.errors.find(e => e.path?.[0] === '_form')?.message}
                    </p>
                )}
              <SubmitButton />
            </form>
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={handleGoogleSignIn}>
                Sign In with Google (Coming Soon)
              </Button>
            </div>
            <div className="mt-4 text-center">
              Don't have an account? <Link href="/signup" className="text-primary">Sign Up</Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </MainLayout>
  );
};

export default SignInPage;
