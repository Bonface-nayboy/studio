
'use client';

import type React from 'react';
import { useFormStatus } from 'react-dom'; // Keep useFormStatus from react-dom
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
import { createProduct, type ProductFormState } from '@/actions/productActions'; // Import the server action
import { useEffect, useActionState } from 'react'; // Import useActionState from react

// Define the schema for product creation using Zod (matches server action schema)
const productSchema = z.object({
  name: z.string().min(3, { message: 'Product name must be at least 3 characters long.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long.' }),
  price: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)), // Convert empty string to undefined before parsing
    z.number({ invalid_type_error: 'Price must be a number.' }).positive({ message: 'Price must be positive.' })
  ),
  category: z.string().min(2, { message: 'Category is required.' }),
  imageUrls: z.string().min(1, {message: 'At least one image URL is required.'}), // Keep as string for form input
});

type ProductFormValues = z.infer<typeof productSchema>;

// SubmitButton component to show loading state
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? 'Creating...' : 'Create Product'}
        </Button>
    );
}


export default function CreateProductPage() {
  // Initial state for the form action
  const initialState: ProductFormState = { message: '', success: false };
  // Use useActionState instead of useFormState
  const [state, formAction] = useActionState(createProduct, initialState);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: undefined,
      category: '',
      imageUrls: '',
    },
  });

   // Effect to show toast message on success/error and reset form
   useEffect(() => {
    if (state.success) {
      toast({
        title: 'Success',
        description: state.message,
      });
      form.reset(); // Reset form fields
       // Optionally redirect or perform other actions
    } else if (state.message && !state.success) {
        // Show general error message if present
        if (state.errors && state.errors.length > 0) {
             // Optionally, map specific errors to form fields if needed,
             // though react-hook-form + zodResolver usually handles this
             console.error("Server validation errors:", state.errors);
             // Example: Manually setting an error for a field
             // state.errors.forEach(err => {
             //   if (err.path && err.path.length > 0) {
             //     form.setError(err.path[0] as keyof ProductFormValues, { message: err.message });
             //   }
             // });
        } else {
            // Show a general form error toast if no specific field errors are returned
             toast({
                title: 'Error Creating Product',
                description: state.message,
                variant: 'destructive',
             });
        }

    }
   }, [state, form]);


  // Update the onSubmit handler to use the server action
  // The actual submission is now handled by the <form action={formAction}> attribute
   const onSubmit = (data: ProductFormValues) => {
       // This function might still be useful for client-side validation logic *before* submitting
       // but the primary submission logic is now handled by the `formAction`.
       // We pass the form data wrapped in `FormData`.
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
             if (value !== undefined && value !== null) {
                 formData.append(key, String(value));
             }
        });
        formAction(formData); // Trigger the server action
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
           {/* Use formAction for server action submission */}
           {/* We still use form.handleSubmit for client-side validation */}
          <Form {...form}>
            <form action={formAction} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                     {/* Display server-side error for this field */}
                     {state.errors?.find(e => e.path?.[0] === 'name') && (
                        <p className="text-sm font-medium text-destructive">
                            {state.errors.find(e => e.path?.[0] === 'name')?.message}
                        </p>
                    )}
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
                    {state.errors?.find(e => e.path?.[0] === 'description') && (
                        <p className="text-sm font-medium text-destructive">
                            {state.errors.find(e => e.path?.[0] === 'description')?.message}
                        </p>
                    )}
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
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="e.g., 149.99"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const value = e.target.value;
                           if (value === '' || !isNaN(Number(value))) {
                            field.onChange(value === '' ? undefined : Number(value));
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                     {state.errors?.find(e => e.path?.[0] === 'price') && (
                        <p className="text-sm font-medium text-destructive">
                            {state.errors.find(e => e.path?.[0] === 'price')?.message}
                        </p>
                    )}
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
                    {state.errors?.find(e => e.path?.[0] === 'category') && (
                        <p className="text-sm font-medium text-destructive">
                            {state.errors.find(e => e.path?.[0] === 'category')?.message}
                        </p>
                    )}
                  </FormItem>
                )}
              />

               <FormField
                control={form.control}
                name="imageUrls"
                 render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URLs</FormLabel>
                    <FormControl>
                       <Textarea
                        placeholder="Enter image URLs separated by commas"
                         {...field} // Pass field props directly
                      />
                    </FormControl>
                     <p className="text-xs text-muted-foreground">Separate multiple URLs with a comma (,).</p>
                    <FormMessage />
                    {state.errors?.find(e => e.path?.[0] === 'imageUrls') && (
                        <p className="text-sm font-medium text-destructive">
                            {state.errors.find(e => e.path?.[0] === 'imageUrls')?.message}
                        </p>
                    )}
                  </FormItem>
                )}
              />

              {/* Display general form errors */}
                {state.errors?.find(e => !e.path || e.path.length === 0) && (
                    <p className="text-sm font-medium text-destructive">
                         {state.errors.find(e => !e.path || e.path.length === 0)?.message}
                    </p>
                )}
                {/* Use SubmitButton component */}
               <SubmitButton />
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
