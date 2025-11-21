import { IsInt, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;

  @IsInt()
  @IsNotEmpty()
  installments: number;

  @IsString()
  @IsNotEmpty()
  issuerId: string;

  @IsObject()
  @IsNotEmpty()
  payer: {
    email: string;
    identification: {
      type: string;
      number: string;
    };
  };
}
