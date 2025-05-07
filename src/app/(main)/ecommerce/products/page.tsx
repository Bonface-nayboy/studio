
'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EditProductForm from '@/components/editpage';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      } else {
        toast({ title: 'Error', description: data.message, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch products.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: 'Success', description: 'Product deleted successfully.' });
        fetchProducts();
      } else {
        toast({ title: 'Error', description: data.message, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete product.', variant: 'destructive' });
    }
  };

  const toggleVisibility = async (id, visible) => {
    try {
      const response = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates: { visible: !visible } }),
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: 'Success', description: 'Product visibility updated.' });
        fetchProducts();
      } else {
        toast({ title: 'Error', description: data.message, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update visibility.', variant: 'destructive' });
    }
  };

  return (
    <main className="container mx-auto py-8 px-4 flex-grow">
      <h1 className="text-3xl font-bold mb-8">Manage Products</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product._id} className="border p-4 rounded">
              <div className="flex gap-2 overflow-x-auto">
                {product.imageUrls.map((url, index) => (
                  <img key={index} src={url} alt={`${product.name} image ${index + 1}`} className="w-32 h-32 object-cover rounded" />
                ))}
              </div>
              <h2 className="text-xl font-bold mt-4">{product.name}</h2>
              <p>{product.description}</p>
              <p>Price: Ksh {product.price}</p>
              <p>Category: {product.category}</p>
              <p>Status: {product.visible ? 'Visible' : 'Hidden'}</p>
              <div className="mt-4 flex gap-2">
                <Button onClick={() => setEditingProductId(product._id)}>Edit</Button>
                <Button variant="destructive" onClick={() => handleDelete(product._id)}>Delete</Button>
                <Button onClick={() => toggleVisibility(product._id, product.visible)}>
                  {product.visible ? 'Hide' : 'Show'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      <Dialog open={!!editingProductId} onOpenChange={() => setEditingProductId(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProductId && (
            <EditProductForm productId={editingProductId} onSuccess={() => {
              fetchProducts();
              setEditingProductId(null);
            }} />
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}

