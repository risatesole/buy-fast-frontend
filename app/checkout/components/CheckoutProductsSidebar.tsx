import type { ProductsSidebarProps } from "@/props/checkout/ProductsSidebarProps";
import { CheckoutProductItem } from "./CheckoutProductItem";

export function CheckoutProductsSidebar({ items, total }: ProductsSidebarProps) {
  if (items.length === 0) {
    return (
      <aside
        style={{
          width: "350px",
          border: "1px solid black",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>Your cart is empty</p>
      </aside>
    );
  }

  return (
    <aside
      style={{
        width: "350px",
        border: "1px solid black",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2>Products ({items.length})</h2>
      <div style={{ flex: 1, overflowY: "auto", paddingRight: "5px" }}>
        {items.map((item) => (
          <CheckoutProductItem key={item.id} item={item} />
        ))}
      </div>
      <hr />
      <p>
        <strong>Total:</strong> ${total.toFixed(2)}
      </p>
    </aside>
  );
}
