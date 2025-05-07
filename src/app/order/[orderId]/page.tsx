import { headers } from 'next/headers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/app/(main)/layout';
import BackButton from '@/components/ui/BackButton';
import { getStatusStyle } from '@/lib/utils';

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface OrderData {
  orderId: string;
  date: string;
  total: number;
  payment: string;
  status: string;
  items: OrderItem[];
}

interface OrderStatusPageProps {
  params: { orderId?: string };
}

// Dynamically determine the base URL depending on environment
const getBaseUrl = () => {
  const host = headers().get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  return `${protocol}://${host}`;
};

export default async function OrderStatusPage({ params }: OrderStatusPageProps) {
  const { orderId } = params;
  let order: OrderData | null = null;

  if (orderId) {
    try {
      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}/api/order/${orderId}`, {
        cache: 'no-store',
      });

      if (res.ok) {
        order = await res.json();
      }
    } catch (error) {
      console.error('Error fetching order from API:', error);
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
                  <th className="border px-4 py-2">Product Name</th>
                  <th className="border px-4 py-2">Quantity</th>
                  <th className="border px-4 py-2">Price</th>
                  <th className="border px-4 py-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index}>
                    {index === 0 && (
                      <td className="border px-4 py-2 align-top" rowSpan={order.items.length}>
                        <p><strong>Order ID:</strong> {order.orderId}</p>
                        <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                        <p><strong>Total:</strong> Ksh {order.total.toLocaleString('en-KE')}</p>
                        <p><strong>Payment:</strong> {order.payment}</p>
                        <p className="flex items-center">
                          <strong className="mr-1">Status:</strong>
                          <span className={`flex items-center ${getStatusStyle(order.status).color}`}>
                            {getStatusStyle(order.status).icon} {order.status}
                          </span>
                        </p>
                      </td>
                    )}
                    <td className="border px-4 py-2">{item.productName}</td>
                    <td className="border px-4 py-2">{item.quantity}</td>
                    <td className="border px-4 py-2">Ksh {item.price.toLocaleString('en-KE')}</td>
                    <td className="border px-4 py-2">Ksh {item.subtotal.toLocaleString('en-KE')}</td>
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
