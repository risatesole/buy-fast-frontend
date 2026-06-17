import type {ProductItemProps} from "@/props/checkout/ProductItemProps"
import Image from "next/image";

export function CheckoutProductItem({ item }: ProductItemProps) {
  const imageUrl = item.image || "https://placehold.co/100x100";

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        border: "1px solid black",
        padding: "10px",
        marginBottom: "10px",
      }}
    >
      <Image
        src={imageUrl}
        alt={item.name}
        width={80}
        height={80}
        style={{ objectFit: "cover" }}
      />
      <div>
        <strong>{item.name}</strong>
        <br />
        Quantity: {item.quantity}
        <br />${(item.price * item.quantity).toFixed(2)}
      </div>
    </div>
  );
}
