import type { Product } from "@/types/products";
export default class ProductService {
    private backendURL: string = process.env.BACKEND_URL || '';
    
    async getProducts(): Promise<Product[]> {
        try {
            if (!this.backendURL) return [];
            
            const res = await fetch(
                `${this.backendURL}/api/v1/products?sort=id&status=true&limit=20&offset=0`,
                { cache: "no-store" }
            );
            
            if (!res.ok) return [];
            
            const json = await res.json();
            return json.data ?? [];
        } catch {
            return [];
        }
    }
}