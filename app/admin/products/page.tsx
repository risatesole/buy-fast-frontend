import ProductsList from "@/components/products-list";
import { Product } from "@/types/products";

type ProductsResponse = {
  next: string | null;
  previous: string | null;
  results: Product[];
};

async function getProducts(): Promise<ProductsResponse> {
  const response = await fetch(
    "http://localhost:8000/api/v1/products/?paginate=cursor&limit=2",
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
}

export default async function ProductsAdminPage() {
  const initialData = await getProducts();

  return <ProductsList initialData={initialData} />;
}
