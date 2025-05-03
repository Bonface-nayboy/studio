// app/api/hold-order/route.ts
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import HeldOrderModel, { IHeldOrder } from '@/models/HeldOrder';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrls?: string[];
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();

        // Get user email and cart items from the request body
        const { email, items } = body;

        // Basic validation
        if (!email || !items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ message: 'Missing required data.' }, { status: 400 });
        }

        // Create a new held order document
        const heldOrder = new HeldOrderModel({
            userEmail: email, // Use email to associate the held order with a user
            items: items.map(item => ({
                product: item.id, // Assuming your product has an 'id'
                quantity: item.quantity,
                price: item.price,
            })),
            holdDate: new Date(),
        });

        // Save the held order to the database
        const savedHeldOrder = await heldOrder.save();

        return NextResponse.json({ message: 'Order held successfully!', heldOrderId: savedHeldOrder._id }, { status: 200 });

    } catch (error) {
        console.error('Error holding order:', error);
        return NextResponse.json({ message: 'Failed to hold order.' }, { status: 500 });
    }
}