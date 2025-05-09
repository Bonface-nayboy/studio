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
import { Eye, EyeOff } from 'lucide-react';
import { Avatar, Box, Typography } from '@mui/material';
import MainLayout from '@/app/(main)/layout';
import { Person2 } from '@mui/icons-material';

const LoginAdminPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setErrors({});

        const response = await fetch('/api/auth/admin/adminlogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
            toast.success(data.message);

            console.log("Sign-in successful, data received:", data); // Log the entire data object

            if (data && data.user) {
                if (data.user.name) {
                    console.log("Username found in data:", data.user.name);
                    localStorage.setItem('username', data.user.name);
                } else {
                    console.warn("Username not found in data:", data.user);
                    toast.warning('Username not received from the server.');
                }
                if (data.user.email) {
                    console.log("Email found in data:", data.user.email);
                    localStorage.setItem('email', data.user.email);
                } else {
                    console.warn("Email not found in data:", data.user);
                    toast.warning('Email not received from the server.');
                }
                if (data.user.mobileNumber) {
                    console.log("Mobile number found in data:", data.user.mobileNumber);
                    localStorage.setItem('mobileNumber', data.user.mobileNumber);
                } else {
                    console.warn("Mobile number not found in data:", data.user);
                    toast.warning('Mobile number not received from the server.');
                }
            } else {
                console.warn("User data not found in the sign-in response:", data);
                toast.warning('User information not fully received from the server.');
            }

            window.location.href = '/admin/adminpanel';

        } else {
            toast.error(data.message || 'Invalid email or password.');
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
        toast.info("Google Sign-In not yet implemented.");
    };

    return (
        <MainLayout>
            <main className="container mx-auto py-12 px-4 flex-grow flex items-center justify-center">

                <Card className="max-w-md w-full">
                    <div className="flex justify-center">
                        <Avatar
                            src='https://gimgs2.nohat.cc/thumb/f/640/male-avatar-admin-profile--m2H7G6H7H7Z5G6m2.jpg'
                            sx={{ fontSize: 60, color: 'white', backgroundColor: 'black', borderRadius: 20 }}
                        />
                    </div>
                    <Typography color='primary' sx={{ p: 2, fontWeight: 'bold ', textAlign: 'center' }}>Admin Page</Typography>
                    <CardHeader>
                        <CardTitle>Sign In</CardTitle>
                        <CardDescription>Enter your email and password to sign in.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="email">Email</label>
                                    <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
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
                                {errors._form && <p className="text-sm text-destructive">{errors._form}</p>}
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Signing In...' : 'Sign In'}
                                </Button>
                            </div>
                        </form>
                        <div className="mt-4 space-y-2">
                            <Button variant="outline" onClick={handleGoogleSignIn} className="w-full">
                                Sign In with Google (Coming Soon)
                            </Button>
                            <p className="text-sm text-muted-foreground">
                                Don't have an account? <Link href="/admin/adminpanel/register">Sign Up</Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </MainLayout>
    );
};

export default LoginAdminPage;