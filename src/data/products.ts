
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrls: string[]; // Changed from imageUrl to imageUrls array
}

export const sampleProducts: Product[] = [
  {
    id: 'prod_001',
    name: 'Wireless Headphones',
    description: 'High-fidelity sound with noise cancellation.',
    price: 149.99,
    category: 'Electronics',
    imageUrls: [
      'https://picsum.photos/seed/headphones1/400/300',
      'https://picsum.photos/seed/headphones2/400/300',
      'https://picsum.photos/seed/headphones3/400/300',
    ],
  },
  {
    id: 'prod_002',
    name: 'Organic Cotton T-Shirt',
    description: 'Soft and breathable, ethically sourced.',
    price: 24.99,
    category: 'Apparel',
    imageUrls: [
      'https://picsum.photos/seed/tshirt1/400/300',
      'https://picsum.photos/seed/tshirt2/400/300',
      'https://picsum.photos/seed/tshirt3/400/300',
      'https://picsum.photos/seed/tshirt4/400/300',
    ],
  },
  {
    id: 'prod_003',
    name: 'Stainless Steel Water Bottle',
    description: 'Keeps drinks cold for 24 hours or hot for 12.',
    price: 19.99,
    category: 'Home Goods',
     imageUrls: [
        'https://picsum.photos/seed/bottle1/400/300',
        'https://picsum.photos/seed/bottle2/400/300',
      ],
  },
   {
    id: 'prod_004',
    name: 'Running Shoes',
    description: 'Lightweight and comfortable for daily runs.',
    price: 89.99,
    category: 'Footwear',
     imageUrls: [
        'https://picsum.photos/seed/shoes1/400/300',
        'https://picsum.photos/seed/shoes2/400/300',
        'https://picsum.photos/seed/shoes3/400/300',
      ],
  },
  {
    id: 'prod_005',
    name: 'Laptop Backpack',
    description: 'Durable and spacious with multiple compartments.',
    price: 59.99,
    category: 'Accessories',
    imageUrls: [
      'https://picsum.photos/seed/backpack1/400/300',
      'https://picsum.photos/seed/backpack2/400/300',
      'https://picsum.photos/seed/backpack3/400/300',
      'https://picsum.photos/seed/backpack4/400/300',
      'https://picsum.photos/seed/backpack5/400/300',
    ],
  },
  {
    id: 'prod_006',
    name: 'Smartwatch',
    description: 'Track your fitness and stay connected.',
    price: 199.99,
    category: 'Electronics',
    imageUrls: [
      'https://picsum.photos/seed/smartwatch1/400/300',
      'https://picsum.photos/seed/smartwatch2/400/300',
      'https://picsum.photos/seed/smartwatch3/400/300',
     ],
  },
];

