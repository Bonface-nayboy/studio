// // src/actions/productActions.ts
// 'use server';

// import { z } from 'zod';
// import dbConnect from '@/lib/mongodb';
// import Product, { IProduct } from '@/models/Product';
// import { revalidatePath } from 'next/cache';

// // Zod schema for validation, matching the frontend schema but adding server-side checks
// const productSchema = z.object({
//   name: z.string().min(3, { message: 'Product name must be at least 3 characters long.' }),
//   description: z.string().min(10, { message: 'Description must be at least 10 characters long.' }),
//   price: z.preprocess(
//     (val) => (val === '' ? undefined : Number(val)),
//     z.number({ invalid_type_error: 'Price must be a number.' }).positive({ message: 'Price must be positive.' })
//   ),
//   category: z.string().min(2, { message: 'Category is required.' }),
//   imageUrls: z.string()
//       .min(1, { message: 'At least one image URL is required.' })
//       .transform(val => val.split(',').map(url => url.trim()).filter(url => url)), // Split comma-separated URLs and trim whitespace
// });

// export type ProductFormState = {
//     message: string;
//     success: boolean;
//     errors?: z.ZodIssue[];
//     product?: Omit<IProduct, 'createdAt' | 'updatedAt' | '_id' | '__v'> & { id: string };
// };


// export async function createProduct(
//     prevState: ProductFormState,
//     formData: FormData
// ): Promise<ProductFormState> {

//     const rawData = Object.fromEntries(formData.entries());

//     // Validate data using Zod schema
//     const validatedFields = productSchema.safeParse({
//         name: rawData.name,
//         description: rawData.description,
//         price: rawData.price,
//         category: rawData.category,
//         imageUrls: rawData.imageUrls,
//     });

//     // If validation fails, return errors
//     if (!validatedFields.success) {
//         console.error('Validation Errors:', validatedFields.error.flatten().fieldErrors);
//         return {
//             message: 'Validation failed. Please check the fields.',
//             success: false,
//             errors: validatedFields.error.errors,
//         };
//     }

//     // Data is valid, proceed to database operation
//     const data = validatedFields.data;

//     try {
//         await dbConnect();

//         const newProduct = new Product({
//             name: data.name,
//             description: data.description,
//             price: data.price,
//             category: data.category,
//             imageUrls: data.imageUrls,
//         });

//         const savedProduct = await newProduct.save();

//         // Revalidate the ecommerce page cache after adding a product
//         revalidatePath('/ecommerce');

//         console.log('Product created:', savedProduct);

//         return {
//             message: `Product "${savedProduct.name}" created successfully!`,
//             success: true,
//              product: { // Return plain object, not Mongoose doc
//                  id: savedProduct._id.toString(),
//                  name: savedProduct.name,
//                  description: savedProduct.description,
//                  price: savedProduct.price,
//                  category: savedProduct.category,
//                  imageUrls: savedProduct.imageUrls,
//              },
//         };
//     } catch (error: any) {
//         console.error('Error creating product:', error);
//         // Handle potential Mongoose validation errors or other DB errors
//         if (error.name === 'ValidationError') {
//              const validationErrors = Object.values(error.errors).map((err: any) => ({
//                 path: [err.path],
//                 message: err.message,
//              } as z.ZodIssue)); // Map to ZodIssue format if possible

//             return {
//                 message: 'Database validation failed.',
//                 success: false,
//                 errors: validationErrors, // Provide detailed validation errors
//             };
//         }
//         return {
//             message: `Failed to create product: ${error.message || 'Unknown error'}`,
//             success: false,
//         };
//     }
// }



// // src/actions/productActions.ts
// 'use server';

// import { z } from 'zod';
// import { revalidatePath } from 'next/cache';

// // Define your product schema here, ensuring imageUrls is handled correctly
// const productSchema = z.object({
//   name: z.string().min(3, { message: 'Product name must be at least 3 characters long.' }),
//   description: z.string().min(10, { message: 'Description must be at least 10 characters long.' }),
//   price: z.preprocess(
//     (val) => (val === '' ? undefined : Number(val)),
//     z.number({ invalid_type_error: 'Price must be a number.' }).positive({ message: 'Price must be positive.' })
//   ),
//   category: z.string().min(2, { message: 'Category is required.' }),
//   imageUrls: z.string()
//     .transform(val => {
//       if (!val) return [];
//       return val.split(',').map(url => url.trim()).filter(url => url);
//     })
//     .refine(arr => arr.length > 0, {
//       message: 'At least one image URL is required.',
//     }),
// });

// export type ProductFormState = {
//   message: string;
//   success: boolean;
//   errors?: z.ZodIssue[];
// };

// export async function createProduct(
//   prevState: ProductFormState,
//   formData: FormData
// ): Promise<ProductFormState> {
//   const rawData = Object.fromEntries(formData.entries());
//   const validatedFields = productSchema.safeParse(rawData);

//   if (!validatedFields.success) {
//     console.error('Validation Errors:', validatedFields.error.flatten().fieldErrors);
//     return { message: 'Validation failed. Please check the fields.', success: false, errors: validatedFields.error.errors };
//   }

//   try {
//     const response = await fetch('/api/products/create', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(validatedFields.data), // Send the validated data directly
//     });

//     const result = await response.json();

//     if (result.success) {
//       revalidatePath('/ecommerce');
//       return { message: `Product "${result.data.name}" created successfully!`, success: true };
//     } else {
//       console.error("API Error creating product:", result);
//       return { message: result.message || 'Failed to create product.', success: false, errors: result.errors };
//     }
//   } catch (error: any) {
//     console.error("Error calling product creation API:", error);
//     return { message: `Failed to create product: ${error.message || 'Unknown error'}`, success: false };
//   }
// }








// src/actions/productActions.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

const productSchema = z.object({
  name: z.string().min(3, { message: 'Product name must be at least 3 characters long.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long.' }),
  price: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({ invalid_type_error: 'Price must be a number.' }).positive({ message: 'Price must be positive.' })
  ),
  category: z.string().min(2, { message: 'Category is required.' }),
  imageUrls: z.string()
    .transform(val => {
      if (!val) return [];
      return val.split(',').map(url => url.trim()).filter(url => url);
    })
    .refine(arr => arr.length > 0, {
      message: 'At least one image URL is required.',
    }),
});

export type ProductFormState = {
  message: string;
  success: boolean;
  errors?: z.ZodIssue[];
};

export async function createProduct(
  prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = productSchema.safeParse(rawData);

  if (!validatedFields.success) {
    console.error('Client-side Validation Errors:', validatedFields.error.flatten().fieldErrors);
    return { message: 'Validation failed on the client. Please check the fields.', success: false, errors: validatedFields.error.errors };
  }

  try {
    const origin = headers().get('origin');
    const apiUrl = `${origin}/api/products/create`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedFields.data),
    });

    const result = await response.json();

    if (result.success) {
      revalidatePath('/ecommerce');
      return { message: `Product "${result.data.name}" created successfully!`, success: true };
    } else {
      console.error("API Error creating product:", result);
      return { message: result.message || 'Failed to create product.', success: false, errors: result.errors };
    }
  } catch (error: any) {
    console.error("Error calling product creation API:", error);
    return { message: `Failed to create product: ${error.message || 'Unknown error'}`, success: false };
  }
}
