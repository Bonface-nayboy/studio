import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import UserModel from '@/models/User';

export async function POST(request: Request) {
  try {
    const { email, fullname, street, city, country, type, isDefault } = await request.json();

    if (!email || !fullname || !city || !country || !type) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const address = { fullname, street, city, country };

    await connectToDatabase();

    const update = type === 'shipping' ? { $push: { shippingAddresses: address } } : { $push: { billingAddresses: address } };

    if (isDefault) {
      update.$set = type === 'shipping' ? { defaultShippingAddress: address } : { defaultBillingAddress: address };
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      update,
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error managing addresses:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}