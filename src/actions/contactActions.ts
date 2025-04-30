// src/actions/contactActions.ts
'use server';

import { z } from 'zod';
import dbConnect from '@/lib/mongodb';
import ContactMessage from '@/models/ContactMessage';

// Zod schema for validation
const contactSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }).trim(),
  email: z.string().email({ message: 'Invalid email address.' }).trim(),
  message: z.string().min(1, { message: 'Message is required.' }),
});

export type ContactFormState = {
    message: string;
    success: boolean;
    errors?: {
        name?: string[];
        email?: string[];
        message?: string[];
        _form?: string[]; // For general form errors
    };
};

export async function submitContactForm(
    prevState: ContactFormState,
    formData: FormData
): Promise<ContactFormState> {
    const rawData = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
    };

    // Validate data using Zod schema
    const validatedFields = contactSchema.safeParse(rawData);

    // If validation fails, return errors
    if (!validatedFields.success) {
        console.error('Validation Errors:', validatedFields.error.flatten().fieldErrors);
        return {
            message: 'Validation failed. Please check the fields.',
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    // Data is valid, proceed to database operation
    const data = validatedFields.data;

    try {
        await dbConnect();

        const newMessage = new ContactMessage({
            name: data.name,
            email: data.email,
            message: data.message,
        });

        await newMessage.save();

        console.log('Contact message saved:', newMessage);

        return {
            message: 'Your message has been sent successfully!',
            success: true,
        };
    } catch (error: any) {
        console.error('Error saving contact message:', error);
        return {
            message: `Failed to send message: ${error.message || 'Unknown error'}`,
            success: false,
            errors: { _form: [`Failed to send message: ${error.message || 'Unknown error'}`] }
        };
    }
}
