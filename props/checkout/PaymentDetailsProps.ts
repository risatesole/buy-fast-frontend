import { CheckoutFormData } from "@/types/checkout/CheckoutFormData";

export type PaymentDetailsProps = {
  formData: CheckoutFormData;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
