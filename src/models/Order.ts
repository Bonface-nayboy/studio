// // models/Order.ts
// import mongoose, { Schema, Document } from 'mongoose';
// import Product from './Product'; // 👈 Add this line to fix the error


// export interface IOrder extends Document {
//   items: {
//     product: mongoose.Schema.Types.ObjectId;
//     quantity: number;
//     price: number;
//   }[];
//   totalPrice: number;
//   paymentMethod: string;
//   customerName: string; // Add customer's name
//   customerEmail: string; // Add customer's email
//   customerMobileNumber: string; // Add customer's mobile number
//   shippingAddress: { // Add shipping address
//     street: string;
//     county: string;
//   };
//   user?: mongoose.Schema.Types.ObjectId;
//   orderDate: Date;
//   status: string;
// }

// const OrderSchema: Schema = new Schema({
//   items: [{
//     product: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Product',
//       required: true,
//     },
//     quantity: { type: Number, required: true, min: 1 },
//     price: { type: Number, required: true, min: 0 },
//   }],
//   totalPrice: { type: Number, required: true, min: 0 },
//   paymentMethod: { type: String, required: true },
//   customerName: { type: String, required: true }, // Add customer's name
//   customerEmail: { type: String, required: true }, // Add customer's email
//   customerMobileNumber: { type: String, required: true }, // Add customer's mobile number
//   shippingAddress: { // Add shipping address
//     street: { type: String, required: true },
//     county: { type: String, required: true },
//   },
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//   },
//   orderDate: { type: Date, default: Date.now },
//   status: { type: String, required: true, default: 'pending' },
// });

// const OrderModel = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

// export default OrderModel;





// models/Order.ts
import mongoose, { Schema, Document } from 'mongoose';
import Product from './Product'; // 👈 Ensure Product is properly imported to avoid schema registration issues

export interface IOrder extends Document {
  items: {
    product: mongoose.Schema.Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  customerMobileNumber: string;
  shippingAddress: {
    street: string;
    county: string;
  };
  user?: mongoose.Schema.Types.ObjectId;
  orderDate: Date;
  status: string;
}

const OrderSchema: Schema = new Schema({
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // Ensure the reference is correct
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  }],
  totalPrice: { type: Number, required: true, min: 0 },
  paymentMethod: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerMobileNumber: { type: String, required: true },
  shippingAddress: {
    street: { type: String, required: true },
    county: { type: String, required: true },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  orderDate: { type: Date, default: Date.now },
  status: { type: String, required: true, default: 'pending' },
});

// Registering Order schema and checking for existing model to avoid hot reload issues
const OrderModel = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default OrderModel;
