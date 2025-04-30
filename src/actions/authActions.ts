// src/actions/authActions.ts
'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// --- Sign Up ---

const signUpSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long.' }).trim(),
  email: z.string().email({ message: 'Invalid email address.' }).trim(),
  mobileNumber: z.string().min(10, { message: 'Mobile number must be at least 10 digits.' }).trim() // Basic length check
        .optional(), // Make it optional if not strictly required
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
});

export type SignUpFormState = {
    message: string;
    success: boolean;
    errors?: z.ZodIssue[];
};

export async function signUpUser(
    prevState: SignUpFormState,
    formData: FormData
): Promise<SignUpFormState> {
    const rawData = Object.fromEntries(formData.entries());

    // Validate data using Zod schema
    const validatedFields = signUpSchema.safeParse(rawData);

    if (!validatedFields.success) {
        console.error('Sign Up Validation Errors:', validatedFields.error.flatten().fieldErrors);
        return {
            message: 'Validation failed. Please check the fields.',
            success: false,
            errors: validatedFields.error.errors,
        };
    }

    const { name, email, mobileNumber, password } = validatedFields.data;

    try {
        await dbConnect();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return {
                message: 'An account with this email already exists.',
                success: false,
                 errors: [{ path: ['email'], message: 'An account with this email already exists.' }] as z.ZodIssue[],
            };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds: 10

        // Create new user
        const newUser = new User({
            name,
            email,
            mobileNumber,
            password: hashedPassword,
        });

        await newUser.save();

        console.log('User signed up successfully:', newUser.email);

        // In a real app, you might automatically sign the user in here or send a verification email.
        return {
            message: 'Sign up successful! You can now sign in.',
            success: true,
        };
    } catch (error: any) {
        console.error('Error signing up user:', error);
         if (error.code === 11000) { // Handle duplicate key error (likely email)
            return {
                message: 'An account with this email already exists.',
                success: false,
                 errors: [{ path: ['email'], message: 'An account with this email already exists.' }] as z.ZodIssue[],
            };
        }
        return {
            message: `Sign up failed: ${error.message || 'Unknown error'}`,
            success: false,
        };
    }
}

// --- Sign In ---

const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }).trim(),
  password: z.string().min(1, { message: 'Password is required.' }), // Basic check
});

export type SignInFormState = {
    message: string;
    success: boolean;
    errors?: z.ZodIssue[];
    // Optionally return user data on success (omit sensitive fields)
    // user?: { id: string; name: string; email: string };
};

export async function signInUser(
    prevState: SignInFormState,
    formData: FormData
): Promise<SignInFormState> {
    const rawData = Object.fromEntries(formData.entries());

    // Validate data using Zod schema
    const validatedFields = signInSchema.safeParse(rawData);

    if (!validatedFields.success) {
        console.error('Sign In Validation Errors:', validatedFields.error.flatten().fieldErrors);
        return {
            message: 'Validation failed. Please check the fields.',
            success: false,
            errors: validatedFields.error.errors,
        };
    }

    const { email, password } = validatedFields.data;

    try {
        await dbConnect();

        // Find user by email, explicitly select password
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return {
                message: 'Invalid email or password.', // Generic message for security
                success: false,
                 errors: [{ path: ['_form'], message: 'Invalid email or password.' }] as z.ZodIssue[],
            };
        }

        // If user found, compare password
        if (!user.password) {
            // This case might happen if the user signed up via Google OAuth later
             return {
                message: 'Password sign-in not set up for this account. Try Google Sign-In.',
                success: false,
                errors: [{ path: ['_form'], message: 'Password sign-in not set up for this account.' }] as z.ZodIssue[],
            };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return {
                message: 'Invalid email or password.', // Generic message
                success: false,
                 errors: [{ path: ['_form'], message: 'Invalid email or password.' }] as z.ZodIssue[],
            };
        }

        // Password is valid, sign-in successful
        console.log('User signed in successfully:', user.email);

        // In a real app, you would create a session/token here.
        return {
            message: 'Sign in successful!',
            success: true,
            // Optionally return non-sensitive user data
            // user: { id: user._id.toString(), name: user.name, email: user.email }
        };
    } catch (error: any) {
        console.error('Error signing in user:', error);
        return {
            message: `Sign in failed: ${error.message || 'Unknown error'}`,
            success: false,
        };
    }
}
