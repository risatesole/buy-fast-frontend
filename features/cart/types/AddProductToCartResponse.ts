export type AddProductToCartResponse = {
  status: string;
  message: string;
  data: {
    item: {
      id: number;
      product_id: number;
      quantity: number;
    };
  };
};