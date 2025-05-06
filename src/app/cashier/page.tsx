'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/app/(main)/layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

interface OrderItem {
  product: string;
  quantity: number;
  price: number;
}

interface IOrder {
  _id: string;
  orderDate: string;
  customerName: string;
  totalPrice: number;
  paymentMethod: string;
  status: string;
  items: OrderItem[];
}

export default function CashierPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);
  const [statusUpdates, setStatusUpdates] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [searchOrderId, setSearchOrderId] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/order');
        const data = await response.json();
        setOrders(data);
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'Unknown error');
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    let result = orders;

    if (selectedDate) {
      result = result.filter(order =>
        new Date(order.orderDate).toLocaleDateString() === new Date(selectedDate).toLocaleDateString()
      );
    }

    if (searchOrderId && selectedDate) {
      result = result.filter(order => order._id.includes(searchOrderId));
    }

    if (statusFilter) {
      result = result.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(result);
  }, [orders, selectedDate, searchOrderId, statusFilter]);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setStatusUpdates(prev => ({ ...prev, [orderId]: newStatus }));
  };

  const updateOrderStatus = async (orderId: string) => {
    const newStatus = statusUpdates[orderId];
    if (!newStatus) return;

    try {
      const response = await fetch('/api/order/update-order-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Failed to update status: ${errorText}`);
        return;
      }

      const updatedData = await response.json();
      alert('Order status updated');
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setStatusUpdates(prev => {
        const updated = { ...prev };
        delete updated[orderId];
        return updated;
      });
    } catch (err) {
      console.error('Fetch error:', err);
      alert('An error occurred while updating the order.');
    }
  };

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <Button asChild>
          <Link href="/ecommerce/create">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">All Orders</CardTitle>
            <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
              {/* Left: Date + Search */}
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border rounded px-3 py-1"
                />
                <input
                  type="text"
                  placeholder="Search by Order Number"
                  value={searchOrderId}
                  onChange={(e) => setSearchOrderId(e.target.value)}
                  className="border rounded px-20 py-1"
                  disabled={!selectedDate}
                />
              </div>

              {/* Right: Status Filter */}
              <div className="flex items-center">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded px-3 py-1"
                >
                  <option value="">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="overflow-x-auto">
            {error ? (
              <div className="text-red-500 text-center py-4">Error: {error}</div>
            ) : filteredOrders.length === 0 ? (
              <p className="text-center py-4">No orders found.</p>
            ) : (
              <>
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2">Order ID</th>
                      <th className="border px-4 py-2">Date</th>
                      <th className="border px-4 py-2">Customer Name</th>
                      <th className="border px-4 py-2">Total Price</th>
                      <th className="border px-4 py-2">Payment Method</th>
                      <th className="border px-4 py-2">Status</th>
                      <th className="border px-4 py-2">Update</th>
                      <th className="border px-4 py-2">View Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.map((order) => (
                      <tr key={order._id} className="border border-t-0 border-gray-300">
                        <td className="border px-4 py-2">{order._id}</td>
                        <td className="border px-4 py-2">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </td>
                        <td className="border px-4 py-2">{order.customerName}</td>
                        <td className="border px-4 py-2">Ksh {order.totalPrice.toFixed(2)}</td>
                        <td className="border px-4 py-2">{order.paymentMethod}</td>
                        <td className="border px-4 py-2">
                          <select
                            className="border rounded px-2 py-1"
                            value={statusUpdates[order._id] || order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          >
                            <option value="Active">Active</option>
                            <option value="Processing">Processing</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="border px-4 py-2 text-center">
                          <button
                            onClick={() => updateOrderStatus(order._id)}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                          >
                            Update
                          </button>
                        </td>
                        <td className="border px-4 py-2 text-center">
                          <Link
                            href={`/order/${order._id}`}
                            className="text-blue-500 hover:underline"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="flex justify-center items-center mt-4 gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

