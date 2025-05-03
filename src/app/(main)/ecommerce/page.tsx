import Image from 'next/image';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogTitle } from '@/components/ui/dialog'; // Import DialogTitle
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import ProductAddToCart from '@/components/product-add-to-cart'; // Import the client component
import dbConnect from '@/lib/mongodb';
import ProductModel, { IProduct } from '@/models/Product';
import { X } from 'lucide-react';

// Helper function to fetch products from the database
async function getProducts(): Promise<IProduct[]> {
  try {
    await dbConnect();
    // Fetch products and sort by creation date descending
    const products = await ProductModel.find({}).sort({ createdAt: -1 }).lean(); // Use lean() for plain JS objects
    console.log('ProductModel:', ProductModel); // Debug log to verify ProductModel
    console.log('Fetched products:', products); // Debug log to verify fetched products
    // Convert ObjectId to string for serialization
    return products.map(product => ({
      ...product,
      _id: product._id.toString(), // Convert ObjectId to string
      id: product._id.toString(), // Add 'id' field for consistency if needed elsewhere
    }));
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return []; // Return empty array on error
  }
}

// Convert the page to an async Server Component
export default async function EcommercePage() {
  const products = await getProducts();

  return (
    <main className="container mx-auto py-8 px-4 flex-grow">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/ecommerce/create">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <p>No products found. Add some!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const firstImageUrl = product.imageUrls[0] || 'https://picsum.photos/seed/placeholder/400/300'; // Fallback image

            // Serialize the product to pass to the client component
            const productDataForClient = {
              id: product._id.toString(),
              name: product.name,
              description: product.description,
              price: product.price,
              category: product.category,
              imageUrls: product.imageUrls,
            };

            return (
              <Dialog key={product._id.toString()}> {/* Use unique _id from DB */}
                <Card className="flex flex-col overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="p-0">
                    <DialogTrigger asChild>
                      <div className="aspect-video relative w-full cursor-pointer group overflow-hidden">
                        <Image
                          src={firstImageUrl}
                          alt={product.name}
                          fill // Use fill instead of layout="fill"
                          style={{ objectFit: "cover" }} // Use style prop for objectFit
                          className="transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" // Add sizes for better optimization
                          priority={false} // Consider setting priority={true} for above-the-fold images
                        />
                      </div>
                    </DialogTrigger>
                    <div className="p-4">
                      <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground mt-1">{product.category}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow p-4">
                    <p className="text-sm mb-4 line-clamp-3">{product.description}</p>
                    <p className="text-lg font-bold">Ksh {product.price.toFixed(2).replace(/\d(?=(\d{3})+(?!\d))/g, '$&,')}</p>
                  </CardContent>
                  {/* Use the client component for Add to Cart interaction */}
                  <CardFooter className="p-4 bg-muted/50 mt-auto">
                    <ProductAddToCart product={productDataForClient} />
                  </CardFooter>
                </Card>

                {/* Modal Content - Updated for scrollable images */}
                <DialogContent className="max-w-4xl p-4 sm:p-6 bg-background border rounded-lg shadow-xl">
                  <DialogClose className="absolute right-3 top-3 z-10 rounded-full p-1.5 bg-background/60 text-foreground/80 backdrop-blur-sm transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </DialogClose>

                  {/* Dialog Title Added for Accessibility */}
                  <DialogTitle className="text-xl font-semibold mb-4">{product.name}</DialogTitle>

                  <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                    <div className="flex space-x-4 p-4">
                      {product.imageUrls.map((url, index) => (
                        <div key={index} className="relative aspect-square h-64 md:h-80 lg:h-96 flex-shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={url || 'https://picsum.photos/seed/placeholder/400/300'} // Fallback for each image
                            alt={`${product.name} - Image ${index + 1}`}
                            fill
                            style={{ objectFit: "contain" }}
                            className="bg-muted"
                            sizes="(max-width: 768px) 80vw, 50vw" // Adjust sizes for modal images
                            priority={false}
                          />
                        </div>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>

                  <p className="text-sm text-muted-foreground mt-4">{product.description}</p>
                  {/* <p className="text-lg font-bold mt-2">${product.price.toFixed(2)}</p> */}
                  <p className="text-lg font-bold">Ksh {product.price.toFixed(2).replace(/\d(?=(\d{3})+(?!\d))/g, '$&,')}</p>
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      )}
    </main>
  );
}
