import { PaymentCreateRequest } from 'mercadopago/dist/clients/payment/create/types';

export interface PaymentRequestWithSplit extends PaymentCreateRequest {
  // Split payment for Checkout API
  application_fee?: number;
}
