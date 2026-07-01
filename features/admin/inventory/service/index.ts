import { StockMomentResponse } from "../types/stockMovement";

class InventoryService {
  async getStockMovement(pagenumber: number): Promise<StockMomentResponse> {
    const response = await fetch(
      `/api/v1/inventory/stockmovement?page=${pagenumber}`,
    );

    const data: StockMomentResponse = await response.json();
    return data;
  }
}

export default new InventoryService();
