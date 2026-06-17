import type { AddProductToCartResponse } from "@/types/cart/AddProductToCartResponse";
import type { GetCartResponse } from "@/types/cart/GetCartResponse";
import { addProductToCart } from "./helpers/AddProductToCart";

export default class CartService {
  async getCart(): Promise<GetCartResponse> {
    const response = await fetch("/api/v1/cart", {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return response.json() as Promise<GetCartResponse>;
  }

  async addProduct(
    productId: number,
    quantity: number = 1,
  ): Promise<AddProductToCartResponse> {
    return addProductToCart(productId, quantity);
  }
}
