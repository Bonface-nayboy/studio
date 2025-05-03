// app/api/get-product-details/route.ts
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProductModel from '@/models/Product';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const idsString = searchParams.get('ids');

    if (!idsString) {
        return NextResponse.json({ message: 'ids parameter is required.' }, { status: 400 });
    }

    const ids = idsString.split(',');

    try {
        await dbConnect();
        const products = await ProductModel.find({ _id: { $in: ids } }).select('name imageUrls').lean();
        return NextResponse.json({ products }, { status: 200 });
    } catch (error) {
        console.error('Error fetching product details:', error);
        return NextResponse.json({ message: 'Failed to fetch product details.' }, { status: 500 });
    }
}