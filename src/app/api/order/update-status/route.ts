// app/api/order/update-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import OrderModel from '@/models/Order';

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { orderId, newStatus } = body;

        if (!orderId || !newStatus) {
            return NextResponse.json({ message: 'Missing orderId or newStatus' }, { status: 400 });
        }

        await dbConnect();
        const updatedOrder = await OrderModel.findByIdAndUpdate(
            orderId,
            { status: newStatus },
            { new: true } // Return the updated document
        );

        if (!updatedOrder) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Order status updated successfully', order: updatedOrder }, { status: 200 });
    } catch (error: any) {
        console.error('Error updating order status:', error);
        return NextResponse.json({ message: 'Error updating order status', error: error.message }, { status: 500 });
    }
}