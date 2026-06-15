type Category = {
  id: number;
  name: string;
  slug: string;
  image: string;
  status: boolean;
};

export type ProductImageType =
  | "HERO"
  | "SCALE"
  | "PACKING"
  | "FLATLAY"
  | "FREEZE_FRAME";

export type ProductImage = {
  url: string;
  type: ProductImageType;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  category: Category;
  images: ProductImage[];
  brand: string;
  selling_price: number;
  status: boolean;
  tags: string[];
};
