// "use client";

// import { useState } from 'react';
// import Image from 'next/image';
// import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogTitle } from '@/components/ui/dialog';
// import { X } from 'lucide-react';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
// import ProductAddToCart from './product-add-to-cart';
// import { Button } from '@/components/ui/button';
// import Link from 'next/link';
// import { PlusCircle } from 'lucide-react';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// export default function ProductListClient({ products }: { products: any[] }) {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
//   const [categoryOpen, setCategoryOpen] = useState(false);

//   const categories = Array.from(new Set(products.map((p) => p.category))).sort();

//   const filteredProducts = products.filter((product) => {
//     if (!product.visible) return false; 

//     const term = searchTerm.toLowerCase();
//     const matchesSearch =
//       product.name.toLowerCase().includes(term) ||
//       product.category.toLowerCase().includes(term) ||
//       product.description.toLowerCase().includes(term);

//     const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;

//     return matchesSearch && matchesCategory;
//   });

//   return (
//     <>
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Products</h1>
//         <input
//           type="text"
//           placeholder="Search products..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border border-gray-300 rounded-md px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />

//         <div className="relative">
//           <Button
//             onClick={() => setCategoryOpen((prev) => !prev)}
//             variant="secondary"
//             className="flex items-center gap-2"
//           >
//             <KeyboardArrowDownIcon />
//             {selectedCategory}
//           </Button>

//           {categoryOpen && (
//             <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded-md z-50">
//               <button
//                 onClick={() => {
//                   setSelectedCategory('All Categories');
//                   setCategoryOpen(false);
//                 }}
//                 className="w-full px-4 py-2 text-left hover:bg-gray-100"
//               >
//                 All Categories
//               </button>
//               {categories.map((category) => (
//                 <button
//                   key={category}
//                   onClick={() => {
//                     setSelectedCategory(category);
//                     setCategoryOpen(false);
//                   }}
//                   className="w-full px-4 py-2 text-left hover:bg-gray-100"
//                 >
//                   {category}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {filteredProducts.length === 0 ? (
//         <Card>
//           <CardContent className="p-6 text-center text-muted-foreground">
//             <p>No products found. Add some!</p>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {filteredProducts.map((product) => {
//             const firstImageUrl = product.imageUrls[0] || 'https://picsum.photos/seed/placeholder/400/300';

//             const productDataForClient = {
//               id: product._id.toString(),
//               name: product.name,
//               description: product.description,
//               price: product.price,
//               category: product.category,
//               imageUrls: product.imageUrls,
//             };

//             return (
//               <Dialog key={product._id}>
//                 <Card className="flex flex-col overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
//                   <CardHeader className="p-0">
//                     <DialogTrigger asChild>
//                       <div className="aspect-video relative w-full cursor-pointer group overflow-hidden">
//                         <Image
//                           src={firstImageUrl}
//                           alt={product.name}
//                           fill
//                           style={{ objectFit: "contain" }}
//                           className="transition-transform duration-300 group-hover:scale-105"
//                           sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
//                         />
//                       </div>
//                     </DialogTrigger>
//                     <div className="p-4">
//                       <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
//                       <CardDescription className="text-sm text-muted-foreground mt-1">{product.category}</CardDescription>
//                     </div>
//                   </CardHeader>
//                   <CardContent className="flex-grow p-4">
//                     <p className="text-sm mb-4 line-clamp-3">{product.description}</p>
//                     <p className="text-lg font-bold">Ksh {product.price.toFixed(2).replace(/\d(?=(\d{3})+(?!\d))/g, '$&,')}</p>
//                   </CardContent>
//                   <CardFooter className="p-4 bg-muted/50 mt-auto">
//                     <ProductAddToCart product={productDataForClient} />
//                   </CardFooter>
//                 </Card>

//                 <DialogContent className="max-w-4xl p-4 sm:p-6 bg-background border rounded-lg shadow-xl">
//                   <DialogClose className="absolute right-3 top-3 z-10 rounded-full p-1.5 bg-background/60 text-foreground/80 backdrop-blur-sm transition-opacity hover:opacity-100">
//                     <X className="h-5 w-5" />
//                     <span className="sr-only">Close</span>
//                   </DialogClose>
//                   <DialogTitle className="text-xl font-semibold mb-4">{product.name}</DialogTitle>
//                   <ScrollArea className="w-full whitespace-nowrap rounded-md border">
//                     <div className="flex space-x-4 p-4">
//                       {product.imageUrls.map((url, index) => (
//                         <div key={index} className="relative aspect-square h-64 md:h-80 lg:h-96 flex-shrink-0 overflow-hidden rounded-md">
//                           <Image
//                             src={url}
//                             alt={`${product.name} - Image ${index + 1}`}
//                             fill
//                             style={{ objectFit: "contain" }}
//                             className="bg-muted"
//                             sizes="(max-width: 768px) 80vw, 50vw"
//                           />
//                         </div>
//                       ))}
//                     </div>
//                     <ScrollBar orientation="horizontal" />
//                   </ScrollArea>
//                   <p className="text-sm text-muted-foreground mt-4">{product.description}</p>
//                   <p className="text-lg font-bold">Ksh {product.price.toFixed(2).replace(/\d(?=(\d{3})+(?!\d))/g, '$&,')}</p>
//                 </DialogContent>
//               </Dialog>
//             );
//           })}
//         </div>
//       )}
//     </>
//   );
// }









"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import ProductAddToCart from './product-add-to-cart';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function ProductListClient({ products }: { products: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [categoryOpen, setCategoryOpen] = useState(false);

  const categories = Array.from(new Set(products.map((p) => p.category))).sort();

  const filteredProducts = products.filter((product) => {
    if (!product.visible) return false;

    const term = searchTerm.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term);

    const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Products</h1>

        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="relative">
          <Button
            onClick={() => setCategoryOpen((prev) => !prev)}
            variant="secondary"
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <KeyboardArrowDownIcon />
            {selectedCategory}
          </Button>

          {categoryOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded-md z-50">
              <button
                onClick={() => {
                  setSelectedCategory('All Categories');
                  setCategoryOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCategoryOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product listing */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <p>No products found. Add some!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => {
            const firstImageUrl = product.imageUrls[0] || 'https://picsum.photos/seed/placeholder/400/300';

            const productDataForClient = {
              id: product._id.toString(),
              name: product.name,
              description: product.description,
              price: product.price,
              category: product.category,
              imageUrls: product.imageUrls,
            };

            return (
              <Dialog key={product._id}>
                <Card className="flex flex-col overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="p-0">
                    <DialogTrigger asChild>
                      <div className="aspect-video relative w-full cursor-pointer group overflow-hidden">
                        <Image
                          src={firstImageUrl}
                          alt={product.name}
                          fill
                          style={{ objectFit: "contain" }}
                          className="transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                  <CardFooter className="p-4 bg-muted/50 mt-auto">
                    <ProductAddToCart product={productDataForClient} />
                  </CardFooter>
                </Card>

                {/* Dialog for product details */}
                <DialogContent className="w-full max-w-[95vw] sm:max-w-4xl p-4 sm:p-6 bg-background border rounded-lg shadow-xl overflow-y-auto max-h-[90vh]">
                  <DialogClose className="absolute right-3 top-3 z-10 rounded-full p-1.5 bg-background/60 text-foreground/80 backdrop-blur-sm transition-opacity hover:opacity-100">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </DialogClose>
                  <DialogTitle className="text-xl font-semibold mb-4">{product.name}</DialogTitle>
                  <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                    <div className="flex space-x-4 p-4">
                      {product.imageUrls.map((url, index) => (
                        <div key={index} className="relative aspect-square h-48 sm:h-64 md:h-80 lg:h-96 flex-shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={url}
                            alt={`${product.name} - Image ${index + 1}`}
                            fill
                            style={{ objectFit: "contain" }}
                            className="bg-muted"
                            sizes="(max-width: 768px) 80vw, 50vw"
                          />
                        </div>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                  <p className="text-sm text-muted-foreground mt-4">{product.description}</p>
                  <p className="text-lg font-bold">Ksh {product.price.toFixed(2).replace(/\d(?=(\d{3})+(?!\d))/g, '$&,')}</p>
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      )}
    </>
  );
}
