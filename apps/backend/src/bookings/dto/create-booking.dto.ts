import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsObject,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class TravelerDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
}

class ContactInfoDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  countryCode?: string;
}

class ActivityDetailsDto {
  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsOptional()
  time?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TravelerDto)
  travelers: TravelerDto[];

  @IsString()
  @IsOptional()
  pickupLocation?: string;

  @IsString()
  @IsOptional()
  tourLanguage?: string;
}

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

  @IsObject()
  @ValidateNested()
  @Type(() => ContactInfoDto)
  @IsOptional()
  contactInfo?: ContactInfoDto;

  @IsObject()
  @ValidateNested()
  @Type(() => ActivityDetailsDto)
  @IsOptional()
  activityDetails?: ActivityDetailsDto;
}
