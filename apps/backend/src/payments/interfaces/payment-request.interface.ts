import { PaymentCreateRequest } from 'mercadopago/dist/clients/payment/create/types';

export interface PaymentRequestWithSplit extends PaymentCreateRequest {
  transfer_data?: {
    destination_account_id: string;
  };
}
