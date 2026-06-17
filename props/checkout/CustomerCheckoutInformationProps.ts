import { CheckoutFormData } from "@/types/checkout/CheckoutFormData"

export type CustomerCheckoutInformationProps = {
  formData: CheckoutFormData;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};