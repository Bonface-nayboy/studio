// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/mongodb';
import ContactMessage from '@/models/ContactMessage';

// Zod schema for validation (matches server action)
const contactSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }).trim(),
  email: z.string().email({ message: 'Invalid email address.' }).trim(),
  message: z.string().min(1, { message: 'Message is required.' }),
});

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    // Validate data using Zod schema
    const validatedFields = contactSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed.',
        errors: validatedFields.error.flatten().fieldErrors,
      }, { status: 400 });
    }

    const { name, email, message } = validatedFields.data;

    const newMessage = new ContactMessage({ name, email, message });
    await newMessage.save();

    console.log('Contact message saved via API:', newMessage);

    return NextResponse.json({ success: true, message: 'Message sent successfully!' }, { status: 201 });

  } catch (error: any) {
    console.error('API Error saving contact message:', error);
    return NextResponse.json({ success: false, message: `Failed to send message: ${error.message || 'Unknown error'}` }, { status: 500 });
  }
}
