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
import { signUpUser, type SignUpFormState } from '@/actions/authActions'; // Import server action

// Submit Button component
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            {pending ? 'Signing Up...' : 'Sign Up'}
        </Button>
    );
}

const SignUpPage = () => {
  const initialState: SignUpFormState = { message: '', success: false };
  const [state, formAction] = useActionState(signUpUser, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      toast({
        title: "Success",
        description: state.message,
      });
      formRef.current?.reset(); // Reset form fields on success
      // Optionally redirect to sign-in page after a short delay
      // setTimeout(() => { window.location.href = '/signin'; }, 1500);
    } else if (state.message && !state.success) {
        // Display specific field errors or a general error toast
        if (state.errors?.length) {
             state.errors.forEach(err => {
                 toast({
                    title: `Error in ${err.path?.join('.') || 'form'}`,
                    description: err.message,
                    variant: "destructive",
                });
             });
        } else {
            toast({
                title: "Sign Up Error",
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
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Create an account to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} action={formAction} className="flex flex-col space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your Name"
                  required
                />
                 {/* Display server-side error for name */}
                 {state.errors?.find(e => e.path?.[0] === 'name') && (
                    <p className="text-sm font-medium text-destructive mt-1">
                        {state.errors.find(e => e.path?.[0] === 'name')?.message}
                    </p>
                )}
              </div>
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
                <label htmlFor="mobileNumber" className="block text-sm font-medium mb-1">
                  Mobile Number (Optional)
                </label>
                <Input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  placeholder="Your Mobile Number"
                />
                 {state.errors?.find(e => e.path?.[0] === 'mobileNumber') && (
                    <p className="text-sm font-medium text-destructive mt-1">
                        {state.errors.find(e => e.path?.[0] === 'mobileNumber')?.message}
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
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Your Password"
                  required
                />
                 {state.errors?.find(e => e.path?.[0] === 'confirmPassword') && (
                    <p className="text-sm font-medium text-destructive mt-1">
                        {state.errors.find(e => e.path?.[0] === 'confirmPassword')?.message}
                    </p>
                )}
              </div>
              <SubmitButton />
            </form>
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={handleGoogleSignIn}>
                Sign Up with Google (Coming Soon)
              </Button>
            </div>
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
