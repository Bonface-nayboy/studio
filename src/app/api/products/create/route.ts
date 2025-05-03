// src/app/api/products/create/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  price: z.number().positive(),
  category: z.string().min(2),
  imageUrls: z.array(z.string().url()).min(1), // Expect an array of URLs
});

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const validatedData = productSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json({ success: false, errors: validatedData.error.issues }, { status: 400 });
    }

    const newProduct = new Product(validatedData.data);
    const savedProduct = await newProduct.save();

    return NextResponse.json({ success: true, data: savedProduct }, { status: 201 });
  } catch (error: any) {
    console.error("API Error creating product:", error);
    return NextResponse.json({ success: false, message: `Failed to create product: ${error.message || 'Unknown error'}` }, { status: 500 });
  }
}