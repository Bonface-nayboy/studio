'use client';

import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Typography, Box, CircularProgress, Alert, IconButton, Menu, MenuItem
} from '@mui/material';
import { useForm } from 'react-hook-form';
import ProductsPage from '../products/page';
import BackButton from '@/components/ui/BackButton';
import FilterListIcon from '@mui/icons-material/FilterList';

export default function ProductPopupForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState<boolean | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filters, setFilters] = useState({ category: '', name: '', status: '' });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      category: '',
      imageUrls: '',
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setMessage('');
    setSuccess(null);

    try {
      const reimid = localStorage.getItem('reimid');
      if (!reimid) {
        setMessage('User ID not found.');
        setSuccess(false);
        return;
      }

      const response = await fetch('/api/products/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          reimid,
          imageUrls: data.imageUrls.split(',').map((url: string) => url.trim()).filter(Boolean),
          price: parseFloat(data.price),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage(`Product "${result.data.name}" created successfully!`);
        setSuccess(true);
        reset();
        setTimeout(() => {
          setOpen(false);
          setMessage('');
          setSuccess(null);
        }, 1500);
      } else {
        setMessage(result.message || 'Failed to create product.');
        setSuccess(false);
      }
    } catch (err: any) {
      setMessage('An unexpected error occurred.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Box textAlign="center" mt={0}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ ml: 2 }} gutterBottom>
          Products Filter
          <IconButton onClick={handleMenuOpen} sx={{ mr: 2 }}>
            <FilterListIcon />
          </IconButton>
        </Typography>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem>
            <TextField
              label="Category"
              size="small"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            />
          </MenuItem>
          <MenuItem>
            <TextField
              label="Name"
              size="small"
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
            />
          </MenuItem>
          <MenuItem>
            <TextField
              label="Status"
              size="small"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            />
          </MenuItem>
        </Menu>

        <Button
          variant="contained"
          sx={{
            backgroundColor: 'white',
            color: 'black',
            '&:hover': { backgroundColor: 'black', color: 'white' },
          }}
          onClick={() => setOpen(true)}
        >
          Add New Product
        </Button>

        <BackButton variant="outlined" color="secondary" sx={{ mr: 10 }} />
      </Box>

      {/* Dialog for adding product */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Product Details</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Fill in the fields below to add a new product.
          </Typography>

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
          >
            <TextField label="Product Name" {...register('name', { required: 'Product name is required' })}
              error={!!errors.name} helperText={errors.name?.message} fullWidth />

            <TextField label="Description" {...register('description', { required: 'Description is required' })}
              multiline minRows={3} error={!!errors.description} helperText={errors.description?.message} fullWidth />

            <TextField label="Price (Ksh)" type="number" inputProps={{ step: '0.01', min: '0' }}
              {...register('price', { required: 'Price is required' })}
              error={!!errors.price} helperText={errors.price?.message} fullWidth />

            <TextField label="Category" {...register('category', { required: 'Category is required' })}
              error={!!errors.category} helperText={errors.category?.message} fullWidth />

            <TextField label="Image URLs" {...register('imageUrls')}
              helperText="Separate multiple URLs with a comma." fullWidth multiline minRows={2} />

            {message && (
              <Alert severity={success ? 'success' : 'error'}>{message}</Alert>
            )}

            <DialogActions sx={{ justifyContent: 'flex-end', mt: 1 }}>
              <Button onClick={() => setOpen(false)} color="secondary" disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Creating...
                  </>
                ) : (
                  'Create Product'
                )}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Filtered Products Page */}
      <ProductsPage filters={filters} />
    </Box>
  );
}
