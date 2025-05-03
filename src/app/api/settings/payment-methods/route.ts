import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import UserModel from '@/models/User';

export async function POST(request: Request) {
  try {
    const { email, paymentMethod } = await request.json();

    if (!email || !paymentMethod) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    await connectToDatabase();

    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { $push: { paymentMethods: paymentMethod } },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error managing payment methods:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}