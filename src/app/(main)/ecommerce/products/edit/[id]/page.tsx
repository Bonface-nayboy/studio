// app/ecommerce/products/edit/[id]/page.tsx
import EditProductForm from '@/components/editpage';
import React from 'react';


interface Props {
  params: { id: string };
}

export default function EditProductPage({ params }: Props) {
  const { id } = params;

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <EditProductForm productId={id} />
    </main>
  );
}
