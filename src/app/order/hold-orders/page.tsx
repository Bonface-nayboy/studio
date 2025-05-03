'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/app/(main)/layout';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { SessionProvider } from 'next-auth/react';

interface HeldOrderItem {
    _id: string; // MongoDB's _id
    items: {
        product: string; // Product ID
        quantity: number;
        price: number;
    }[];
    holdDate: string; // Or Date object
}

interface ProductDetails {
    [key: string]: {
        name: string;
        imageUrls: string[];
    };
}

const HoldOrdersPageContent = () => {
    const [heldOrders, setHeldOrders] = useState<HeldOrderItem[]>([]);
    const [productDetails, setProductDetails] = useState<ProductDetails>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addToCart } = useCart();
    const [userEmail, setUserEmail] = useState<string | null>(null); // State for email

    useEffect(() => {
        // Get email from local storage
        const storedEmail = localStorage.getItem('email');
        setUserEmail(storedEmail);
    }, []); // Run only once on component mount

    useEffect(() => {
        console.log("User Email (from localStorage):", userEmail);

        const fetchHeldOrders = async () => {
            if (!userEmail) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/order/get-held-orders?email=${userEmail}`);
                console.log("API Response Status:", response.status);
                if (!response.ok) {
                    const message = await response.text();
                    console.error("API Error Message:", message);
                    throw new Error(`Failed to fetch held orders: ${response.status} - ${message}`);
                }
                const data = await response.json();
                console.log("Held Orders Data:", data);
                setHeldOrders(data.heldOrders);

                const productIds = Array.from(new Set(data.heldOrders.flatMap(order => order.items.map(item => item.product))));
                if (productIds.length > 0) {
                    const productsResponse = await fetch(`/api/order/get-product-details?ids=${productIds.join(',')}`);
                    console.log("Product Details Response Status:", productsResponse.status);
                    if (!productsResponse.ok) {
                        const message = await productsResponse.text();
                        console.error("Product Details Error Message:", message);
                    } else {
                        const productsData = await productsResponse.json();
                        console.log("Product Details Data:", productsData);
                        setProductDetails(productsData.products.reduce((acc, product) => {
                            acc[product._id] = { name: product.name, imageUrls: product.imageUrls };
                            return acc;
                        }, {}));
                    }
                }
            } catch (err: any) {
                console.error("Error fetching held orders:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHeldOrders();
    }, [userEmail]); // Re-run when userEmail from localStorage changes (though it's set only once here)

    const handleRestoreOrder = (heldOrder: HeldOrderItem) => {
        heldOrder.items.forEach(item => {
            const productInfo = productDetails[item.product];
            if (productInfo) {
                addToCart({
                    id: item.product,
                    name: productInfo.name,
                    price: item.price,
                    imageUrls: productInfo.imageUrls,
                }, item.quantity);
            } else {
                toast({
                    title: "Product Info Missing",
                    description: `Could not restore item with ID ${item.product} as product details are unavailable.`,
                    variant: "warning",
                });
            }
        });
        removeHeldOrder(heldOrder._id);
        toast({
            title: "Order Restored",
            description: `Items from the held order have been added back to your cart.`,
            variant: "success",
        });
    };

    const removeHeldOrder = async (heldOrderId: string) => {
        try {
            const response = await fetch(`/api/order/delete-held-order/${heldOrderId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const message = await response.text();
                throw new Error(`Failed to delete held order: ${response.status} - ${message}`);
            }
            setHeldOrders(prevOrders => prevOrders.filter(order => order._id !== heldOrderId));
            toast({
                title: "Hold Order Removed",
                description: "The selected held order has been removed.",
            });
        } catch (err: any) {
            console.error("Error deleting held order:", err);
            toast({
                title: "Error Removing Order",
                description: "Failed to remove the held order.",
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto py-8 px-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Hold Orders</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 text-center">
                        <p>Loading held orders...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-8 px-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Hold Orders</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 text-center text-destructive">
                        <p>Error loading held orders: {error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Hold Orders</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {heldOrders.length === 0 ? (
                        <p className="text-muted-foreground">You have no orders currently on hold.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {heldOrders.map((order) => (
                                <Card key={order._id} className="border">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold">
                                            Held on {new Date(order.holdDate).toLocaleDateString()}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <ul>
                                            {order.items.map((item) => (
                                                <li key={item.product} className="flex items-center space-x-2">
                                                    {productDetails[item.product]?.imageUrls && (
                                                        <div className="relative w-16 h-10 overflow-hidden rounded-md">
                                                            <Link href={`/product/${item.product}`}>
                                                                <img
                                                                    src={productDetails[item.product]?.imageUrls[0]}
                                                                    alt={productDetails[item.product]?.name}
                                                                    className="object-cover w-full h-full"
                                                                />
                                                            </Link>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-sm font-medium">{productDetails[item.product]?.name || 'Product Details Loading...'}</p>
                                                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                                        <p className="text-xs text-muted-foreground">Price: ${item.price.toFixed(2)}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                    <div className="p-2 flex justify-end gap-2">
                                        <Button size="sm" onClick={() => handleRestoreOrder(order)}>
                                            Restore All
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => removeHeldOrder(order._id)}>
                                            Remove
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

const HoldOrdersPage = () => {
    return (
        <MainLayout>
            <HoldOrdersPageContent />
        </MainLayout>
    );
};

export default HoldOrdersPage;