import dbConnect from '@/lib/mongodb';
import ProductModel from '@/models/Product';
import ProductListClient from '@/components/ProductListClient'; // 👈 Import new client component

async function getProducts() {
  await dbConnect();
  const products = await ProductModel.find({}).sort({ createdAt: -1 }).lean();
  return products.map((product) => ({
    ...product,
    _id: product._id.toString(),
    id: product._id.toString(),
  }));
}

export default async function EcommercePage() {
  const products = await getProducts();

  return (
    <main className="container mx-auto py-8 px-4 flex-grow">
      <ProductListClient products={products} />
    </main>
  );
}
