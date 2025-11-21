import { IsDateString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  @IsNotEmpty()
  packageId: number;

  @IsInt()
  @IsOptional()
  pricingOptionId?: number;

  @IsDateString()
  @IsNotEmpty()
  travelDate: string;

  @IsInt()
  @IsNotEmpty()
  numberOfParticipants: number;

  @IsInt()
  @IsNotEmpty()
  currencyId: number;
}
