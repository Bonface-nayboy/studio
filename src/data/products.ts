
export interface Product {
  id: string; // Keep the interface for type consistency
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrls: string[];
  createdAt?: Date; // Optional timestamps if needed on client
  updatedAt?: Date;
}

// Remove sampleProducts array as data will come from the database
// export const sampleProducts: Product[] = [ ... ];
