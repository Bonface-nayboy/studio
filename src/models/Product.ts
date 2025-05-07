import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrls: string[];
  image: string; // New field for product image
  visible: boolean; // New field for product visibility
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
  visible: {
    type: Boolean,
    default: true,
    required: [true, 'Please specify if the product is visible'],
  },
}, {
  timestamps: true,
});

const Product: Model<IProduct> = models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;

