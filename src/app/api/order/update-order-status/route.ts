import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import OrderModel from '@/models/Order';

export async function PUT(req: Request) {
  try {
    const { orderId, status } = await req.json();
    await dbConnect();

    const result = await OrderModel.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!result) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Status updated' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
