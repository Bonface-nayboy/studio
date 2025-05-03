// app/api/delete-held-order/[heldOrderId]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import HeldOrderModel from '@/models/HeldOrder';

interface Params {
    heldOrderId?: string;
}

export async function DELETE(request: Request, { params }: { params: Params }) {
    const { heldOrderId } = params;

    if (!heldOrderId) {
        return NextResponse.json({ message: 'Held order ID is required.' }, { status: 400 });
    }

    try {
        await dbConnect();
        const result = await HeldOrderModel.findByIdAndDelete(heldOrderId);

        if (!result) {
            return NextResponse.json({ message: 'Held order not found.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Held order deleted successfully.' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting held order:', error);
        return NextResponse.json({ message: 'Failed to delete held order.' }, { status: 500 });
    }
}