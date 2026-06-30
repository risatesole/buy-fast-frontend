import type { AddProductToCartResponse } from "@/types/cart/AddProductToCartResponse";
import type { GetCartResponse } from "@/types/cart/GetCartResponse";
import { addProductToCart } from "./helpers/AddProductToCart";
import { getCart } from "./helpers/GetProductsInCart";
import { RemoveProductFromCart } from "./helpers/RemoveProductFromCart";
export default class CartService {
  async getCart(cookieHeader?: string): Promise<GetCartResponse> {
    return getCart(cookieHeader);
  }

  async addProduct(
    productId: number,
    quantity: number = 1,
  ): Promise<AddProductToCartResponse> {
    return addProductToCart(productId, quantity);
  }

  async removeProduct(productId: number | string) {
    RemoveProductFromCart(productId);
  }

  async editProductQuantity(productId: number | string, quantity: number) {
    const response = await fetch("/api/v1/cart", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
        quantity: quantity,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      alert(`Something wrong happened while editing product cart quantity`);
      throw new Error(`Request failed: ${response.status} - ${body}`);
    }

    return response.json();
    alert("updatingCartItem");
  }
}
