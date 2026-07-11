export type NormalProductVariant = {
  id: number;
  name: string;
  description: string;
  thumbnail: string;
  variantnumber: number;
  sku: string;
  slug: string;
  selling_price: number;
  tax_rate: number;
  created_at: Date;
  updated_at: Date;
};

export type Product = {
  id: number;
  name: string;
  category: 'electronics' | 'clothing' | 'books' | 'home' | 'toys' | 'food' | 'other';
  thumbnail: string;
  slug: string;
  tags: string[];
  variants: NormalProductVariant[];
  product_type: 'normal';
};
