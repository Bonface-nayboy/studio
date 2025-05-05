import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product'; // Use your defined Product model


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query')?.trim() || '';

    console.log('Search Query:', query); // Log the incoming query

    if (!query) {
        return NextResponse.json({ results: [] });
    }

    try {
        await dbConnect();
        console.log('Database connected'); // Log if connection is successful

        const results = await Product.find({
            visible: true,
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } },
            ],
        }).limit(20);

        console.log('Search Results:', results); // Log the results from the database query
        return NextResponse.json({ results });
    } catch (error) {
        console.error('[Search API Error]:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}