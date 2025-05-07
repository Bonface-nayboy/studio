// app/api/order/get-orders/route.ts
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import OrderModel from '@/models/Order';
import Product from '@/models/Product'; // Make sure to import Product

// Ensure that Product model is registered in the serverless environment
if (!mongoose.models.Product) {
  mongoose.model('Product', Product.schema);
}

export async function POST(request: Request) {
  try {
    const { name, email, mobileNumber } = await request.json();

    if (!name || !email || !mobileNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    const orders = await OrderModel.find({
      customerName: name,
      customerEmail: email,
      customerMobileNumber: mobileNumber,
    })
      .sort({ orderDate: -1 })
      .populate('items.product', 'name') // Populate product name
      .lean();

    const formattedOrders = orders.map(order => ({
      orderId: order._id.toString(),
      date: order.orderDate?.toISOString() || 'N/A',
      total: order.totalPrice ?? 0,
      payment: order.paymentMethod ?? 'N/A',
      status: order.status ?? 'N/A',
      items: order.items.map(item => ({
        productName: (item.product as any)?.name || 'N/A',
        quantity: item.quantity ?? 0,
        price: item.price ?? 0,
        subtotal: (item.price ?? 0) * (item.quantity ?? 0),
      })),
    }));

    return NextResponse.json(formattedOrders);
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
