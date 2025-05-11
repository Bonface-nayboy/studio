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
import { Avatar, Typography } from '@mui/material';
import { Person2 } from '@mui/icons-material';

const RegisterAdminPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [companyName, setCompanyName] = useState(''); // New state for company name
    const [location, setLocation] = useState(''); // New state for location
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setErrors({});



        const response = await fetch('/api/auth/admin/adminregister', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, mobileNumber, password, confirmPassword, companyName, location }),
        });

        const data = await response.json();

        if (response.ok && data.message === 'Admin registered successfully') {
            toast.success('Account created successfully.');
            // Store user details in local storage
            localStorage.setItem('username', name);
            localStorage.setItem('email', email);
            localStorage.setItem('mobileNumber', mobileNumber);
            localStorage.setItem('reimid', data.user.reamId); // ✅ correct


            window.location.href = '/admin/adminpanel';
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
        <MainLayout>
            <main className="container mx-auto py-12 px-4 flex-grow flex items-center justify-center">
                <Card className="max-w-md w-full">
                    <div className="flex justify-center">
                        <Avatar
                            src='https://gimgs2.nohat.cc/thumb/f/640/male-avatar-admin-profile--m2H7G6H7H7Z5G6m2.jpg'
                            sx={{ fontSize: 60, color: 'white', backgroundColor: 'black', borderRadius: 20 }}
                        />
                    </div>
                    <Typography color='primary' sx={{ p: 2, fontWeight: 'bold', textAlign: 'center' }}>Admin Page</Typography>
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
                                    <label htmlFor="mobileNumber">Mobile Number</label>
                                    <Input id="mobileNumber" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
                                    {errors.mobileNumber && <p className="text-sm text-destructive">{errors.mobileNumber}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="companyName">Company Name</label>
                                    <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                                    {errors.companyName && <p className="text-sm text-destructive">{errors.companyName}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="location">Location</label>
                                    <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
                                    {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
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
                                Already have an account? <Link href="/admin/adminpanel/login">Sign In</Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </MainLayout>
    );
};

export default RegisterAdminPage;
