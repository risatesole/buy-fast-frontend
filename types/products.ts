type Category = {
  id: number;
  name: string;
  slug: string;
  image: string;
  status: boolean;
};

type ProductImage = {
  url: string;
  type: "HERO" | "FLATLAY";
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
