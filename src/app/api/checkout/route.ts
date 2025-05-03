// pages/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import OrderModel from '@/models/Order';
import { isValidObjectId, Types } from 'mongoose';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const { cart, totalPrice, paymentMethod, name, email, mobileNumber, shippingAddress } = body;

        const order = new OrderModel({
            items: cart.map((item: { id: string; quantity: number; price: number }) => {
                if (!isValidObjectId(item.id)) {
                    throw new Error(`Invalid product ID: ${item.id}`);
                }
                return {
                    product: new Types.ObjectId(item.id), // Convert product ID to ObjectId
                    quantity: item.quantity,
                    price: item.price,
                };
            }),
            totalPrice: totalPrice,
            paymentMethod: paymentMethod,
            customerName: name,
            customerEmail: email,
            customerMobileNumber: mobileNumber,
            shippingAddress: shippingAddress, // Ensure shipping address is saved
            orderDate: new Date(),
            status: 'pending',
        });

        await order.save();

        return NextResponse.json({ message: 'Order created successfully', orderId: order._id }, { status: 200 });
    } catch (error: any) {
        console.error('Error creating order:', error);
        return NextResponse.json({ message: 'Error creating order', error: error.message }, { status: 500 });
    }
}