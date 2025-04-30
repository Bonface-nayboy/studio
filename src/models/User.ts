import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Password might not always be selected
  mobileNumber?: string; // Optional mobile number
  googleId?: string; // For Google OAuth
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    trim: true,
    unique: true, // Ensure email is unique
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
    index: true, // Add index for faster lookups
  },
  password: {
    type: String,
    required: function(this: IUser) { return !this.googleId; }, // Required only if not using Google Sign-In
    select: false, // Do not return password by default
  },
  mobileNumber: {
    type: String,
    trim: true,
    // Add validation if needed, e.g., regex for phone number format
  },
  googleId: { // Field to store Google User ID
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values but enforces uniqueness for non-null values
    index: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
});

// Prevent model overwrite in Next.js hot reloading
const User: Model<IUser> = models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
