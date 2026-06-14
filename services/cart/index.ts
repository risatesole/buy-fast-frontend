// warning temporary tape code
// types
import type { Product } from "@/types/products";
import type { AddProductToCartResponse } from "@/types/cart/AddProductToCartResponse";

export default class CartService {
  async addProduct(
    productId: number,
    quantity: number = 1,
  ): Promise<AddProductToCartResponse> {
    const response = await fetch(`http://localhost:8000/api/v1/cart/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
        quantity,
      }),
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return response.json() as Promise<AddProductToCartResponse>;
  }
}
