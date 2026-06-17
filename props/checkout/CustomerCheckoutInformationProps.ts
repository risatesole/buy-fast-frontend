import { CheckoutFormData } from "@/app/checkout/types/CheckoutFormData"

export type CustomerCheckoutInformationProps = {
  formData: CheckoutFormData;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};