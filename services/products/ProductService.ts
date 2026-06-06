import type { Product } from "@/types/products";

export type ProductQueryParameters = {
    sort?: string;
    status?: string;
    limit?: number;
    offset?: number;
    tags?: string[];
    category?: number|null;
}

const DEFAULT_QUERY_PARAMS: Omit<ProductQueryParameters, "tags"> = {
    sort: "id",
    status: "true",
    limit: 20,
    offset: 0,
    category: null
};

export default class ProductService {
    private backendURL: string = process.env.BACKEND_URL || '';

    async getProducts(params: ProductQueryParameters = {}): Promise<Product[]> {
        if (!this.backendURL) return [];

        const queryParams = this.buildQueryParams(params);
        const url = `${this.backendURL}/api/v1/products?${queryParams}`;

        try {
            const res = await fetch(url, { cache: "no-store" });
            if (!res.ok) return [];

            const json = await res.json();
            return json.data ?? [];
        } catch {
            return [];
        }
    }

    private buildQueryParams(overrides: ProductQueryParameters): string {
        const { tags, ...rest } = overrides;
        const params = { ...DEFAULT_QUERY_PARAMS, ...rest };

        const entries = Object.entries(params).filter(([, value]) => value !== undefined);
        const stringEntries = entries.map(([key, value]) => [key, String(value)]);

        const searchParams = new URLSearchParams(stringEntries);

        if (tags && tags.length > 0) {
            searchParams.set("tags", tags.join(","));
        }

        return searchParams.toString();
    }
}