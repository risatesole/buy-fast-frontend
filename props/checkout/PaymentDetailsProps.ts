import { CheckoutFormData } from "@/app/checkout/types/CheckoutFormData";

export type PaymentDetailsProps = {
  formData: CheckoutFormData;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
