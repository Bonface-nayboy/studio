// /app/api/orders/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import OrderModel from '@/models/Order';

export async function GET() {
  try {
    await dbConnect();
    const orders = await OrderModel.find({}).sort({ orderDate: -1 }).lean();

    const formattedOrders = orders.map(order => ({
      ...order,
      _id: order._id.toString(),
      orderDate: order.orderDate.toISOString(),
      items: order.items.map(item => ({
        ...item,
        product: item.product.toString(),
      })),
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to fetch orders' }, { status: 500 });
  }
}
