import { NextResponse, NextRequest } from 'next/server';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import dbConnect from '@/lib/mongodb'; // Adjust the path if needed
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;
const collectionName = 'holdorders';

export async function DELETE(req: NextRequest) {
    if (!uri || !dbName) {
        return new NextResponse(JSON.stringify({ message: 'MongoDB URI or database name not configured.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const { orderId } = await req.json();

        if (!orderId) {
            return new NextResponse(JSON.stringify({ message: 'Order ID is required.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        await dbConnect(); // Use your existing dbConnect function
        const db = mongoose.connection.db; // Access the database from the mongoose connection
        const holdOrdersCollection = db.collection(collectionName);

        const result = await holdOrdersCollection.deleteOne({ _id: new ObjectId(orderId) });

        if (result.deletedCount === 1) {
            return new NextResponse(JSON.stringify({ message: 'Hold order removed successfully.' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            return new NextResponse(JSON.stringify({ message: 'Hold order not found.' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        console.error('Error removing hold order:', error);
        return new NextResponse(JSON.stringify({ message: 'Failed to remove hold order.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}