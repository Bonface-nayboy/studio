import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a product price'],
    min: [0, 'Price cannot be negative'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a product category'],
    trim: true,
  },
  imageUrls: {
    type: [String],
    required: [true, 'Please provide at least one image URL'],
    validate: [(v: string[]) => v.length > 0, 'At least one image URL is required'],
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
});

// Debug log to verify Product model initialization
console.log('Initializing Product model:', models.Product ? 'Reusing existing model' : 'Creating new model');

// Prevent model overwrite in Next.js hot reloading
const Product: Model<IProduct> = models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
