// models/HeldOrder.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IHeldOrder extends Document {
    userEmail: string; // Associate with user email
    items: {
        product: string; // Or mongoose.Schema.Types.ObjectId if you have Product model
        quantity: number;
        price: number;
    }[];
    holdDate: Date;
}

const HeldOrderSchema: Schema = new Schema({
    userEmail: { type: String, required: true },
    items: [{
        product: { type: String, required: true }, // Or mongoose.Schema.Types.ObjectId, ref: 'Product'
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
    }],
    holdDate: { type: Date, default: Date.now },
});

const HeldOrderModel = mongoose.models.HeldOrder || mongoose.model<IHeldOrder>('HeldOrder', HeldOrderSchema);

export default HeldOrderModel;