// app/api/auth/signup/route.ts
import { signUpUser } from '@/actions/authActions';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod'; // Import Zod if you're using it for validation here

const requestSchema = z.object({ // Define a schema for the expected JSON body
  name: z.string(),
  email: z.string().email(),
  mobileNumber: z.string().optional(),
  password: z.string(),
  confirmPassword: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedBody = requestSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json({ message: "Validation error", errors: parsedBody.error.issues, success: false }, { status: 400 });
    }

    const result = await signUpUser(undefined, parsedBody.data as any); // Type assertion
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('API Signup Error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error', success: false }, { status: 500 });
  }
}