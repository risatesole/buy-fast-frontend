// temporaryProductService.ts

export type Product = {
  id: number;
  name: string;
  description: string;
  category: string;
  image: string | null;
  brand: string;
  selling_price: number;
  status: boolean;
};

export type ProductsResponse = {
  status: "ok" | "error";
  data: Product[];
};

// TEMPORARY: quick implementation (technical debt)
// TODO: replace with official API client later
export async function temporaryGetProducts(): Promise<Product[]> {
  const res = await fetch("/api/v1/products");

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`);
  }

  const json: ProductsResponse = await res.json();

  if (json.status !== "ok") {
    throw new Error("API returned non-ok status");
  }

  return json.data;
}
