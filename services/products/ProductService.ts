import type { Product } from "@/types/products";

export type ProductQueryParameters = {
  sort?: string;
  status?: string;
  limit?: number;
  offset?: number;
  tags?: string[];
  category?: number | null;
  search?: string;
};

const DEFAULT_QUERY_PARAMS: Omit<ProductQueryParameters, "tags"> = {
  sort: "id",
  status: "true",
  limit: 20,
  offset: 0,
  category: null,
};

export default class ProductService {
  private backendURL: string | undefined = process.env.NEXT_PUBLIC_API_URL;

  async getProducts(params: ProductQueryParameters = {}): Promise<Product[]> {
    if (!this.backendURL) {
      console.error("BACKEND_URL is not set");
      return [];
    }

    const queryParams = this.buildQueryParams(params);
    const url = `${this.backendURL}/api/v1/products?${queryParams}`;

    console.log("Fetching URL:", url);

    try {
      const res = await fetch(url, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.error("Response not OK:", res.status, res.statusText);
        return [];
      }

      const json = await res.json();
      console.log("Response data:", json);
      return json.data ?? [];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  async getProductDetails(id: string): Promise<Product> {
    const res = await fetch(`${this.backendURL}/api/v1/products/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Product not found");
    const json = await res.json();
    return json.data;
  }

  private buildQueryParams(overrides: ProductQueryParameters): string {
    const { tags, ...rest } = overrides;
    const params = { ...DEFAULT_QUERY_PARAMS, ...rest };

    const entries = Object.entries(params).filter(
      ([, value]) => value !== undefined,
    );
    const stringEntries = entries.map(([key, value]) => [key, String(value)]);

    const searchParams = new URLSearchParams(stringEntries);

    if (tags && tags.length > 0) {
      searchParams.set("tags", tags.join(","));
    }

    return searchParams.toString();
  }
}
