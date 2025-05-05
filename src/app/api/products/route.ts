// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

// Fetch all products
export async function GET() {
  try {
    await dbConnect();

    const products = await Product.find({}, '-__v').sort({ createdAt: -1 }); // Fetch sorted products excluding `__v` field

    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (error: any) {
    console.error("API Error fetching products:", error);
    return NextResponse.json({ success: false, message: `Failed to fetch products: ${error.message || 'Unknown error'}` }, { status: 500 });
  }
}

// Update a product
export async function PUT(req: Request) {
  try {
    await dbConnect();

    const { id, updates } = await req.json();
    console.log('Received updates:', updates);

    // Ensure `visible` is explicitly handled
    if (typeof updates.visible === 'undefined') {
      const existingProduct = await Product.findById(id);
      if (existingProduct) {
        updates.visible = existingProduct.visible;
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
    console.log('Updated product:', updatedProduct);
    if (!updatedProduct) {
      return NextResponse.json({ success: false, message: 'Product not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error("API Error updating product:", error);
    return NextResponse.json({ success: false, message: `Failed to update product: ${error.message || 'Unknown error'}` }, { status: 500 });
  }
}

// Delete a product
export async function DELETE(req: Request) {
  try {
    await dbConnect();

    const { id } = await req.json();
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json({ success: false, message: 'Product not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    console.error("API Error deleting product:", error);
    return NextResponse.json({ success: false, message: `Failed to delete product: ${error.message || 'Unknown error'}` }, { status: 500 });
  }
}
