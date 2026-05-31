import type { Product } from "@/types/products";

export class ShoppingCartService {
  constructor() {}
  addProductToCart(product: Product, quantity: Text, refreshtoken: Text) {
    throw new Error("Unimplemented method.");
  }

  removeProductFromCart(product: Product, quantity: Text, refreshtoken: Text) {
    throw new Error("Unimplemented method.");
  }

  getProductFromCart(refreshtoken: Text) {
    throw new Error("Unimplemented method.");
  }
}
