// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(request: Request) {
  try {
    await dbConnect();

    const products = await Product.find({}).sort({ createdAt: -1 }); // Fetch sorted products

    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (error: any) {
    console.error("API Error fetching products:", error);
    return NextResponse.json({ success: false, message: `Failed to fetch products: ${error.message || 'Unknown error'}` }, { status: 500 });
  }
}

// Optional: Add POST handler here if you prefer API routes over Server Actions for creation
// export async function POST(request: Request) { ... }
