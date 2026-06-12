export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  sizes: string[];
  stock: number;
};

export type User = {
  id: string;
  email: string;
  role: 'admin' | 'customer';
};

const fashionImages = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1529139574466-a303a44269d4?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1530396440263-ee70ed8982ae?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1434389673922-8356947ed02c?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550614000-4b95d41f71a4?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1588099768531-a7245a19f23e?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573215286576-f5ff17b966f3?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1495385794356-15371f348c31?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517423568366-8b83523034fd?q=80&w=800&auto=format&fit=crop',
];

const productNames = [
  'Oversized Washed T-Shirt', 'Distressed Wide Leg Jeans', 'Faux Leather Biker Jacket', 
  'Urban Cargo Pants', 'Ribbed Knit Sweater', 'Classic Trench Coat', 'Floral Midi Dress', 
  'Basic Cotton Hoodie', 'Slim Fit Chinos', 'Vintage Denim Jacket'
];

export const demoProducts: Product[] = [];

export const demoUsers = {
  admin: {
    email: 'admin@trivioz.com',
    password: 'password123' // Mock password for demo
  }
};
