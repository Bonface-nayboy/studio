import mongoose, { Schema, Document, Model, models } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  mobileNumber?: string;
  googleId?: string;
  reamId: string;
  group: 'Admin' | 'User';
  companyName: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: [true, 'Please provide a name'], trim: true },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      trim: true,
      unique: true,
      match: [/.+@.+\..+/, 'Please enter a valid email address'],
      index: true,
    },
    password: {
      type: String,
      required: function (this: IUser) { return !this.googleId; }, // Password is required if no Google ID
      select: false, // Don't return the password by default
    },
    mobileNumber: { type: String, trim: true },
    googleId: { type: String, unique: true, sparse: true, index: true },
    reamId: { type: String, required: true, unique: true, index: true },
    group: { type: String, enum: ['Admin', 'User'], default: 'User', required: true },
    companyName: { type: String, required: [true, 'Please provide a company name'], trim: true },
    location: { type: String, required: [true, 'Please provide a location'], trim: true },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Prevent model overwrite in Next.js hot reloading
const User: Model<IUser> = models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
