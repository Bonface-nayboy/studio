// src/app/api/products/[id]/route.ts
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await dbConnect(); // connect to DB via Mongoose

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid product ID.' }, { status: 400 });
    }

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('GET /api/products/[id] error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch product.' }, { status: 500 });
  }
}
