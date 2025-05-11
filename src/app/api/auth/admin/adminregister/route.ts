import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid"; // For generating reamId
import dbConnect from "@/lib/mongodb"; // Ensure this is your MongoDB connection
import User from "@/models/adminuser"; // Correct path to the User model

export async function POST(req: Request) {
  await dbConnect(); // Establish database connection

  try {
    // Extract data from the incoming request body
    const {
      name,
      email,
      password,
      mobileNumber,
      companyName,
      location,
    } = await req.json();

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Admin already exists' },
        { status: 400 }
      );
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin user with the provided data
    const user = new User({
      name,
      email,
      password: hashedPassword,
      mobileNumber,
      reamId: uuidv4(), // Generate a unique reamId
      group: 'Admin', // Ensure this user is an Admin
      companyName,
      location,
    });

    // Save the new user to the database
    await user.save();

    // Return a successful response with the new user's data (excluding the password)
    return NextResponse.json(
      {
        message: 'Admin registered successfully',
        user: {
          name: user.name,
          email: user.email,
          mobileNumber: user.mobileNumber,
          reamId: user.reamId,
          group: user.group,
          companyName: user.companyName,
          location: user.location,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err); // Log the error for debugging
    return NextResponse.json(
      { error: 'Failed to register admin' },
      { status: 500 }
    );
  }
}
