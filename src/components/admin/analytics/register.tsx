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
import { toast } from 'react-toastify';
import Link from 'next/link';
import MainLayout from '@/app/(main)/layout';
import { Eye, EyeOff } from 'lucide-react';
import { Typography } from '@mui/material';

const RegisterAdminPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setErrors({});

        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, mobileNumber, password, confirmPassword }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
            toast.success('Account created successfully.');
            // Store user details in local storage
            localStorage.setItem('username', name);
            localStorage.setItem('email', email);
            localStorage.setItem('mobileNumber', mobileNumber);
            window.location.href = '/ecommerce';
        } else {
            toast.error(data.message || 'An error occurred during sign up.');
            if (data.errors) {
                const errorMap: Record<string, string> = {};
                data.errors.forEach((err: { path?: string[]; message: string }) => {
                    if (err.path?.[0]) {
                        errorMap[err.path[0]] = err.message;
                    } else {
                        errorMap['_form'] = err.message; // General form error
                    }
                });
                setErrors(errorMap);
            }
        }

        setLoading(false);
    };

    const handleGoogleSignIn = async () => {
        toast.info('Google Sign-In not yet implemented.');
    };

    return (
        <MainLayout> {/* Wrap content with MainLayout */}
            <main className="container mx-auto py-12 px-4 flex-grow flex items-center justify-center">
            <Typography color='primary' sx={{ p: 2 }}>Rees Admin Page</Typography>
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <CardTitle>Sign Up</CardTitle>
                        <CardDescription>Create an account to get started.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="name">Name</label>
                                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email">Email</label>
                                    <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="mobileNumber">Mobile Number </label>
                                    <Input id="mobileNumber" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
                                    {errors.mobileNumber && <p className="text-sm text-destructive">{errors.mobileNumber}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="password">Password</label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 px-3 text-sm text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <div className="relative">
                                        <Input
                                            type={showConfirmPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 px-3 text-sm text-gray-600"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                                </div>
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Signing Up...' : 'Sign Up'}
                                </Button>
                            </div>
                        </form>
                        <div className="mt-4 space-y-2">
                            <Button variant="outline" onClick={handleGoogleSignIn} className="w-full">
                                Sign Up with Google (Coming Soon)
                            </Button>
                            <p className="text-sm text-muted-foreground">
                                Already have an account? <Link href="/signin">Sign In</Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </MainLayout>
    );
};

export default RegisterAdminPage;