import { CheckoutPaymentDetailsForm } from "../components/CheckoutPaymentDetailsForm";
import { CustomerInformation } from "../components/CustomerInformation";
import type { CheckoutFormProps } from "@/props/checkout/CheckoutFormProps";

export function CheckoutForm({
  formData,
  handleChange,
  handleSubmit,
}: CheckoutFormProps) {
  return (
    <form
      onSubmit={handleSubmit}
      style={{
        flex: 1,
        border: "1px solid black",
        padding: "20px",
        overflowY: "auto",
      }}
    >
      <h2>Checkout</h2>

      <CustomerInformation formData={formData} handleChange={handleChange} />

      <CheckoutPaymentDetailsForm
        formData={formData}
        handleChange={handleChange}
      />

      <br />

      <button
        type="submit"
        style={{
          width: "100%",
          border: "1px solid black",
          padding: "12px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Complete Checkout
      </button>
    </form>
  );
}
