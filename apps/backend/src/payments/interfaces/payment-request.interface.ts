import { PaymentCreateRequest } from 'mercadopago/dist/clients/payment/create/types';

export interface PaymentRequestWithSplit extends PaymentCreateRequest {
  application_fee?: number;
  metadata?: {
    booking_id?: string;
    company_id?: number;
    commission_amount?: number;
    company_amount?: number;
  };
}
