import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IContactMessage extends Document {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

const ContactMessageSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    trim: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },
  message: {
    type: String,
    required: [true, 'Please provide a message'],
  },
}, {
  timestamps: { createdAt: true, updatedAt: false }, // Only add createdAt
});

// Prevent model overwrite in Next.js hot reloading
const ContactMessage: Model<IContactMessage> = models.ContactMessage || mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);

export default ContactMessage;
