// import { NextResponse } from 'next/server';
// import connectToDatabase from '@/lib/mongodb';
// import OrderModel from '@/models/Order';


// export async function POST(request: Request) {
//   try {
//     const { name, email, mobileNumber } = await request.json();

//     console.log('Request received with payload:', { name, email, mobileNumber });

//     if (!name || !email || !mobileNumber) {
//       console.error('Missing required fields:', { name, email, mobileNumber });
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     await connectToDatabase(); // Ensure the database connection is established

//     console.log('Database connection established successfully.');

//     const orders = await OrderModel.find({
//       customerName: name,
//       customerEmail: email,
//       customerMobileNumber: mobileNumber,
//     })
//       .sort({ orderDate: -1 })
//       .populate('items.product', 'name') // Populate product details with only the name field
//       .lean();

//     console.log('Order statuses:', orders.map(order => order.status));

//     const formattedOrders = orders.map(order => ({
//       orderId: order._id.toString(),
//       date: order.orderDate ? order.orderDate.toISOString() : 'N/A',
//       total: order.totalPrice || 0, // Ensure totalPrice is fetched correctly
//       payment: order.paymentMethod || 'N/A',
//       status: order.status || 'N/A',
//       items: order.items.map(item => ({
//         productName: item.product?.name || 'N/A', // Handle cases where product name is missing
//         quantity: item.quantity || 0,
//         price: item.price || 0, // Ensure price is fetched correctly
//         subtotal: (item.price * item.quantity) || 0, // Calculate subtotal if missing
//       })),
//     }));

//     console.log('Orders fetched successfully:', formattedOrders);

//     return NextResponse.json(formattedOrders);
//   } catch (error) {
//     console.error('Error fetching orders:', error);
//     console.error('Error details:', {
//       message: error.message,
//       stack: error.stack,
//       name: error.name,
//     });
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }






// import { NextResponse } from 'next/server';
// import mongoose from 'mongoose';
// import connectToDatabase from '@/lib/mongodb';
// import OrderModel from '@/models/Order';
// import Product from '@/models/Product'; // Import to register the model

// // ✅ Ensure Product model is registered in Vercel/serverless
// if (!mongoose.models.Product) {
//   mongoose.model('Product', Product.schema);
// }

// export async function POST(request: Request) {
//   try {
//     const { name, email, mobileNumber } = await request.json();

//     if (!name || !email || !mobileNumber) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     await connectToDatabase();

//     const orders = await OrderModel.find({
//       customerName: name,
//       customerEmail: email,
//       customerMobileNumber: mobileNumber,
//     })
//       .sort({ orderDate: -1 })
//       .populate('items.product', 'name') // Only populate product name
//       .lean();

//     const formattedOrders = orders.map(order => ({
//       orderId: order._id.toString(),
//       date: order.orderDate?.toISOString() || 'N/A',
//       total: order.totalPrice ?? 0,
//       payment: order.paymentMethod ?? 'N/A',
//       status: order.status ?? 'N/A',
//       items: order.items.map(item => ({
//         productName: (item.product as any)?.name || 'N/A',
//         quantity: item.quantity ?? 0,
//         price: item.price ?? 0,
//         subtotal: (item.price ?? 0) * (item.quantity ?? 0),
//       })),
//     }));

//     return NextResponse.json(formattedOrders);
//   } catch (error: any) {
//     console.error('Error fetching orders:', error);
//     return NextResponse.json(
//       { error: 'Internal Server Error', details: error.message },
//       { status: 500 }
//     );
//   }
// }






// app/api/order/get-orders/route.ts
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import OrderModel from '@/models/Order';
import Product from '@/models/Product'; // Make sure to import Product

// Ensure that Product model is registered in the serverless environment
if (!mongoose.models.Product) {
  mongoose.model('Product', Product.schema);
}

export async function POST(request: Request) {
  try {
    const { name, email, mobileNumber } = await request.json();

    if (!name || !email || !mobileNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    const orders = await OrderModel.find({
      customerName: name,
      customerEmail: email,
      customerMobileNumber: mobileNumber,
    })
      .sort({ orderDate: -1 })
      .populate('items.product', 'name') // Populate product name
      .lean();

    const formattedOrders = orders.map(order => ({
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
    }));

    return NextResponse.json(formattedOrders);
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
