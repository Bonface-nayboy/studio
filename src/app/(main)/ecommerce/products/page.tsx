'use client';
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button as MUIButton,
  Box,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { toast } from '@/hooks/use-toast';
import EditProductForm from '@/components/editpage';
import { X } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Products
      </Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {paginatedProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <Card sx={{ height: 300, width: 350, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <Box sx={{ display: 'flex', overflowX: 'auto', gap: 1, padding: 1 }}>
                    {product.imageUrls.map((url, index) => (
                      <Box
                        component="img"
                        key={index}
                        src={url}
                        alt={`Image ${index + 1}`}
                        onClick={() => setSelectedProduct(product)}
                        sx={{
                          width: 64,
                          height: 64,
                          objectFit: 'cover',
                          borderRadius: 1,
                          cursor: 'pointer',
                          '&:hover': { opacity: 0.8 },
                        }}
                      />
                    ))}
                  </Box>
                  <CardContent sx={{ overflowY: 'auto', flex: 1, padding: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">{product.name}</Typography>
                    <Typography variant="body2" sx={{ maxHeight: 40, overflowY: 'auto' }}>
                      {product.description}
                    </Typography>
                    <Typography variant="body2">Price: Ksh {product.price}</Typography>
                    <Typography variant="body2">Category: {product.category}</Typography>
                    <Typography variant="body2">Status: {product.visible ? 'Visible' : 'Hidden'}</Typography>
                  </CardContent>
                  <CardActions sx={{ padding: 1, gap: 1 }}>
                    <MUIButton size="small" onClick={() => setEditingProductId(product._id)}>Edit</MUIButton>
                    <MUIButton size="small" color="error" onClick={() => handleDelete(product._id)}>Delete</MUIButton>
                    <MUIButton size="small" onClick={() => toggleVisibility(product._id, product.visible)}>
                      {product.visible ? 'Hide' : 'Show'}
                    </MUIButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination Controls */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 2 }}>
            <MUIButton
              variant="outlined"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Previous
            </MUIButton>
            <Typography variant="body2" sx={{ alignSelf: 'center' }}>
              Page {currentPage} of {totalPages}
            </Typography>
            <MUIButton
              variant="outlined"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </MUIButton>
          </Box>
        </>
      )}

      {/* Dialog for Editing Product */}
      <Dialog open={!!editingProductId} onClose={() => setEditingProductId(null)}>
        <MUIButton onClick={() => setEditingProductId(null)} sx={{ position: 'absolute', right: 8, top: 8, color: 'black' }}>
          <X />
        </MUIButton>
        <DialogContent className="max-w-2xl">
          <DialogTitle>Edit Product</DialogTitle>
          {editingProductId && (
            <EditProductForm
              productId={editingProductId}
              onSuccess={() => {
                fetchProducts();
                setEditingProductId(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog for Image Preview */}
      <Dialog open={!!selectedProduct} onClose={() => setSelectedProduct(null)} maxWidth="md" fullWidth>
        <MUIButton onClick={() => setSelectedProduct(null)} sx={{ position: 'absolute', right: 8, top: 8, color: 'black' }}>
          <X />
        </MUIButton>
        <DialogTitle>Product Details</DialogTitle>
        <DialogContent dividers>
          {selectedProduct && (
            <Box>
              <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2, mb: 2 }}>
                {selectedProduct.imageUrls.map((url, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={url}
                    alt={`Product image ${index + 1}`}
                    sx={{
                      height: 160,
                      width: 150,
                      borderRadius: 2,
                      objectFit: 'cover',
                    }}
                  />
                ))}
              </Box>
              <Typography variant="h6" gutterBottom>{selectedProduct.name}</Typography>
              <Typography variant="body2" gutterBottom>{selectedProduct.description}</Typography>
              <Typography variant="body2">Price: Ksh {selectedProduct.price}</Typography>
              <Typography variant="body2">Category: {selectedProduct.category}</Typography>
              <Typography variant="body2">Status: {selectedProduct.visible ? 'Visible' : 'Hidden'}</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
