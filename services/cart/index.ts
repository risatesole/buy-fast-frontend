import type { AddProductToCartResponse } from "@/types/cart/AddProductToCartResponse";
import type { GetCartResponse } from "@/types/cart/GetCartResponse";
import { addProductToCart } from "./helpers/AddProductToCart";
import { getCart } from "./helpers/GetProductsInCart";

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
}
