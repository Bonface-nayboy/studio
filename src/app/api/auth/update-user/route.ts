import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import UserModel from '@/models/User';

export async function POST(request: Request) {
  try {
    const { username, email, mobileNumber } = await request.json();

    if (!username || !email || !mobileNumber) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    await connectToDatabase();

    const updatedUser = await UserModel.findOneAndUpdate(
      { email }, // Find the user by email
      { username, mobileNumber }, // Update username and mobile number
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}