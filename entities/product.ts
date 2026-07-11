type NormalProductVariant = {
  id: number;
  name: string;
  description: string;
  sku: string;
  slug: string;
  selling_price: string;
  tax_rate: number;
  created_at: Date;
  updated_at: Date;
};

type Product = {
  id: number;
  name: string;
  category: 'electronics' | 'clothing' | 'books' | 'home' | 'toys' | 'food' | 'other';
  thumbnail: 'electronics' | 'clothing' | 'books' | 'home' | 'toys' | 'food' | 'other';
  slug: string;
  tags: string[];
  variants: NormalProductVariant[];
};
