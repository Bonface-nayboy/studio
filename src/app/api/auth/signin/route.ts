// app/api/auth/signin/route.ts
import { signInUser } from '@/actions/authActions';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsedBody = requestSchema.safeParse(body);

        if (!parsedBody.success) {
            return NextResponse.json({ message: "Validation error", errors: parsedBody.error.issues, success: false }, { status: 400 });
        }

        const result = await signInUser(undefined, parsedBody.data as any);
        console.log("Backend Sign-in Result:", result); // ADD THIS LINE
        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error('API Signin Error:', error);
        return NextResponse.json({ message: error.message || 'Internal Server Error', success: false }, { status: 500 });
    }
}