import type { Product } from "./products";
export type CartItem = Product & { qty: number };