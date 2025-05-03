// app/api/get-held-orders/route.ts
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import HeldOrderModel from '@/models/HeldOrder';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]'; // Adjust path as needed

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json({ message: 'Email parameter is required.' }, { status: 400 });
    }

    try {
        await dbConnect();
        const heldOrders = await HeldOrderModel.find({ userEmail: email }).sort({ holdDate: -1 }).lean();
        return NextResponse.json({ heldOrders }, { status: 200 });
    } catch (error) {
        console.error('Error fetching held orders:', error);
        return NextResponse.json({ message: 'Failed to fetch held orders.' }, { status: 500 });
    }
}