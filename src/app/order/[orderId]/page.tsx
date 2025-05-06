// app/order/[orderId]/page.tsx

import dbConnect from '@/lib/mongodb';
import OrderModel, { IOrder } from '@/models/Order';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/app/(main)/layout';
import BackButton from '@/components/ui/BackButton';
import { getStatusStyle } from '@/lib/utils';

interface OrderStatusPageProps {
    params: { orderId?: string };
}

export default async function OrderStatusPage({ params }: OrderStatusPageProps) {
    const { orderId } = params;
    let order: IOrder | null = null;

    if (orderId) {
        try {
            await dbConnect();

            // Populate product info for each item
            const fetchedOrder = await OrderModel.findById(orderId)
                .populate('items.product')
                .lean();

            if (fetchedOrder) {
                order = {
                    ...fetchedOrder,
                    _id: fetchedOrder._id.toString(),
                    orderDate: fetchedOrder.orderDate.toISOString(),
                    items: fetchedOrder.items.map(item => ({
                        ...item,
                        product: {
                            _id: item.product._id.toString(),
                            name: item.product.name,
                        },
                    })),
                } as IOrder;
            }
        } catch (error) {
            console.error('Error fetching order:', error);
        }
    }

    if (!order) {
        return (
            <MainLayout>
                <div className="container mx-auto py-8 px-4">
                    <Card>
                        <CardContent className="p-6 text-center">
                            <CardTitle className="text-xl font-semibold">Order Not Found</CardTitle>
                            <p>The order you requested could not be found.</p>
                        </CardContent>
                    </Card>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="container mx-auto py-8 px-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Order Details</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300 text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border px-4 py-2">Order Info</th>
                                    <th className="border px-4 py-2">Customer Info</th>
                                    <th className="border px-4 py-2">Product Name</th>
                                    <th className="border px-4 py-2">Quantity</th>
                                    <th className="border px-4 py-2">Price</th>
                                    <th className="border px-4 py-2">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item, index) => (
                                    <tr key={item.product._id}>
                                        {index === 0 && (
                                            <>
                                                <td className="border px-4 py-2 align-top" rowSpan={order.items.length}>
                                                    <p><strong>Order ID:</strong> {order._id}</p>
                                                    <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                                                    <p><strong>Total:</strong>Ksh {order.totalPrice.toLocaleString('en-KE', { minimumFractionDigits: 2 })} </p>
                                                    <p><strong>Payment:</strong> {order.paymentMethod}</p>
                                                    <p className="flex items-center"><strong className="mr-1">Status:</strong> <span className={`flex items-center ${getStatusStyle(order.status).color}`}>{getStatusStyle(order.status).icon} {order.status}</span></p>
                                                    <p><strong>Shipping Address:</strong></p>
                                                    <p>{order.shippingAddress.street}, {order.shippingAddress.county}</p>
                                                </td>
                                                <td className="border px-4 py-2 align-top" rowSpan={order.items.length}>
                                                    <p><strong>Name:</strong> {order.customerName}</p>
                                                    <p><strong>Email:</strong> {order.customerEmail}</p>
                                                    <p><strong>Mobile:</strong> {order.customerMobileNumber}</p>
                                                </td>
                                            </>
                                        )}
                                        <td className="border px-4 py-2">{item.product.name}</td>
                                        <td className="border px-4 py-2">{item.quantity}</td>
                                        <td className="border px-4 py-2">Ksh {item.price.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</td>
                                        <td className="border px-4 py-2">Ksh {(item.price * item.quantity).toLocaleString('en-KE', { minimumFractionDigits: 2 })}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </CardContent>
                    <div className="flex justify-end p-4">
                        <BackButton />
                    </div>

                </Card>

            </div>
        </MainLayout>
    );
}
