// components/EditProductForm.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrls: string[];
    visible: boolean;
}

export default function EditProductForm({ productId }: { productId: string }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${productId}`);
                const data = await res.json();
                if (data.success) {
                    setProduct(data.data);
                } else {
                    toast({ title: 'Error', description: data.message, variant: 'destructive' });
                }
            } catch (error) {
                toast({ title: 'Error', description: 'Failed to fetch product.', variant: 'destructive' });
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;

        try {
            const res = await fetch('/api/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: product._id, updates: product }),
            });

            const data = await res.json();
            if (data.success) {
                toast({ title: 'Success', description: 'Product updated successfully.' });
                router.push('/ecommerce/products');
            } else {
                toast({ title: 'Error', description: data.message, variant: 'destructive' });
            }
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to update product.', variant: 'destructive' });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!product) return;
        const { name, value } = e.target;
        setProduct({ ...product, [name]: name === 'price' ? parseFloat(value) : value });
    };

    if (loading) return <p>Loading...</p>;
    if (!product) return <p>Product not found.</p>;

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
            <Input
                name="name"
                value={product.name}
                onChange={handleChange}
                placeholder="Product Name"
            />
            <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full border p-2 rounded"
            />
            <Input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                placeholder="Price"
            />
            <Input
                name="category"
                value={product.category}
                onChange={handleChange}
                placeholder="Category"
            />
            <label className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={product.visible}
                    onChange={() => setProduct({ ...product, visible: !product.visible })}
                />
                <span>Visible</span>
            </label>

            <h3 className="font-semibold">Image URLs</h3>
            {product.imageUrls.map((url, index) => (
                <Input
                    key={index}
                    type="url"
                    name={`imageUrl-${index}`}
                    value={url}
                    onChange={(e) => {
                        const updatedUrls = [...product.imageUrls];
                        updatedUrls[index] = e.target.value;
                        setProduct({ ...product, imageUrls: updatedUrls });
                    }}
                    className="mb-2"
                    placeholder={`Image URL ${index + 1}`}
                />
            ))}
            <Button
                type="button"
                onClick={() =>
                    setProduct({ ...product, imageUrls: [...product.imageUrls, ''] })
                }
                variant="outline"
            >
                Add Image URL
            </Button>

            <Button type="submit">Save Changes</Button>
        </form>
    );
}
