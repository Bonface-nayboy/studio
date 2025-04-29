
'use client';

import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';

// Define the schema for product creation using Zod
const productSchema = z.object({
  name: z.string().min(3, { message: 'Product name must be at least 3 characters long.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long.' }),
  price: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)), // Convert empty string to undefined before parsing
    z.number({ invalid_type_error: 'Price must be a number.' }).positive({ message: 'Price must be positive.' })
  ),
  category: z.string().min(2, { message: 'Category is required.' }),
  imageUrls: z.string().min(1, {message: 'At least one image URL is required.'}).transform(val => val.split(',').map(url => url.trim()).filter(url => url)), // Split comma-separated URLs
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function CreateProductPage() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: undefined, // Use undefined for numeric inputs that might be empty initially
      category: '',
      imageUrls: '',
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    setIsLoading(true);
    console.log('Product Data:', data);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real application, you would send this data to your backend/API
    // e.g., await fetch('/api/products', { method: 'POST', body: JSON.stringify(data) });

    toast({
      title: 'Product Created',
      description: `Product "${data.name}" has been successfully created (simulated).`,
    });
    form.reset(); // Reset form after successful submission
    setIsLoading(false);
  };

  return (
    <main className="container mx-auto py-8 px-4 flex-grow">
       <div className="flex justify-between items-center mb-8">
         <h1 className="text-3xl font-bold">Create New Product</h1>
          <Button asChild variant="outline">
            <Link href="/ecommerce">Back to Products</Link>
          </Button>
        </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>Fill in the details below to add a new product.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Wireless Headphones" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the product..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                       {/* Render Input as type text initially to handle empty state and formatting */}
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="e.g., 149.99"
                        {...field}
                        value={field.value ?? ''} // Use empty string if value is undefined
                        onChange={(e) => {
                          const value = e.target.value;
                           // Allow empty string or valid number input
                           if (value === '' || !isNaN(Number(value))) {
                            field.onChange(value === '' ? undefined : Number(value)); // Pass undefined if empty, otherwise number
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Electronics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <FormField
                control={form.control}
                name="imageUrls"
                 render={({ field: { onChange, value, ...rest } }) => ( // Extract onChange and value
                  <FormItem>
                    <FormLabel>Image URLs</FormLabel>
                    <FormControl>
                       <Textarea
                        placeholder="Enter image URLs separated by commas"
                         // Handle the value transformation for display
                         value={Array.isArray(value) ? value.join(', ') : value}
                         onChange={(e) => onChange(e.target.value)} // Pass the raw string value up
                        {...rest}
                      />
                    </FormControl>
                     <p className="text-xs text-muted-foreground">Separate multiple URLs with a comma (,).</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Creating...' : 'Create Product'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
