// // app/api/order/[id]/route.ts

// import { NextResponse } from 'next/server';
// import { Types } from 'mongoose';
// import connectToDatabase from '@/lib/mongodb';
// import OrderModel from '@/models/Order';
// import Product from '@/models/Product'; // Ensure Product is imported

// export async function GET(
//     req: Request,
//     { params }: { params: { id: string } }
// ) {
//     try {
//         const { id } = params;

//         // Validate ObjectId format
//         if (!Types.ObjectId.isValid(id)) {
//             return NextResponse.json({ error: 'Invalid Order ID' }, { status: 400 });
//         }

//         await connectToDatabase();

//         const order = await OrderModel.findById(id)
//             .populate('items.product', 'name') // Populate only the product name
//             .lean();

//         if (!order) {
//             return NextResponse.json({ error: 'Order not found' }, { status: 404 });
//         }

//         const formattedOrder = {
//             orderId: order._id.toString(),
//             date: order.orderDate?.toISOString() || 'N/A',
//             total: order.totalPrice ?? 0,
//             payment: order.paymentMethod ?? 'N/A',
//             status: order.status ?? 'N/A',
//             items: order.items.map(item => ({
//                 productName: (item.product as any)?.name || 'N/A',
//                 quantity: item.quantity ?? 0,
//                 price: item.price ?? 0,
//                 subtotal: (item.price ?? 0) * (item.quantity ?? 0),
//             })),
//         };

//         return NextResponse.json(formattedOrder);
        

//     } catch (error: any) {
//         console.error('Error fetching order by ID:', error);
//         return NextResponse.json(
//             { error: 'Internal Server Error', details: error.message },
//             { status: 500 }
//         );
//     }
// }





// app/api/order/[id]/route.ts

import { NextResponse } from 'next/server';
import mongoose, { Types } from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import OrderModel from '@/models/Order';
import Product from '@/models/Product'; // Ensure Product is imported

// Register the Product schema if not already registered
if (!mongoose.models.Product) {
  mongoose.model('Product', Product.schema);
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate ObjectId format
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid Order ID' }, { status: 400 });
    }

    await connectToDatabase();

    const order = await OrderModel.findById(id)
      .populate('items.product', 'name') // Populate only the product name
      .lean();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const formattedOrder = {
      orderId: order._id.toString(),
      date: order.orderDate?.toISOString() || 'N/A',
      total: order.totalPrice ?? 0,
      payment: order.paymentMethod ?? 'N/A',
      status: order.status ?? 'N/A',
      items: order.items.map(item => ({
        productName: (item.product as any)?.name || 'N/A',
        quantity: item.quantity ?? 0,
        price: item.price ?? 0,
        subtotal: (item.price ?? 0) * (item.quantity ?? 0),
      })),
    };

    return NextResponse.json(formattedOrder);
  } catch (error: any) {
    console.error('Error fetching order by ID:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
