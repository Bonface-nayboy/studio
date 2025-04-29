
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

export const sampleProducts: Product[] = [
  {
    id: 'prod_001',
    name: 'Wireless Headphones',
    description: 'High-fidelity sound with noise cancellation.',
    price: 149.99,
    category: 'Electronics',
    imageUrl: 'https://picsum.photos/seed/headphones/400/300',
  },
  {
    id: 'prod_002',
    name: 'Organic Cotton T-Shirt',
    description: 'Soft and breathable, ethically sourced.',
    price: 24.99,
    category: 'Apparel',
    imageUrl: 'https://picsum.photos/seed/tshirt/400/300',
  },
  {
    id: 'prod_003',
    name: 'Stainless Steel Water Bottle',
    description: 'Keeps drinks cold for 24 hours or hot for 12.',
    price: 19.99,
    category: 'Home Goods',
    imageUrl: 'https://picsum.photos/seed/bottle/400/300',
  },
   {
    id: 'prod_004',
    name: 'Running Shoes',
    description: 'Lightweight and comfortable for daily runs.',
    price: 89.99,
    category: 'Footwear',
    imageUrl: 'https://picsum.photos/seed/shoes/400/300',
  },
  {
    id: 'prod_005',
    name: 'Laptop Backpack',
    description: 'Durable and spacious with multiple compartments.',
    price: 59.99,
    category: 'Accessories',
    imageUrl: 'https://picsum.photos/seed/backpack/400/300',
  },
  {
    id: 'prod_006',
    name: 'Smartwatch',
    description: 'Track your fitness and stay connected.',
    price: 199.99,
    category: 'Electronics',
    imageUrl: 'https://picsum.photos/seed/smartwatch/400/300',
  },
];
