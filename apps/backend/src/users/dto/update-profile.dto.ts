import {
  IsOptional,
  IsString,
  IsDateString,
  IsEnum,
  IsInt,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  UNKN = 'UNKN',
}

export class UpdateProfileDto {
  @ApiProperty({
    description: 'First name',
    required: false,
    maxLength: 100,
    example: 'John',
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  firstName?: string;

  @ApiProperty({
    description: 'Last name',
    required: false,
    maxLength: 100,
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  lastName?: string;

  @ApiProperty({
    description: 'Date of birth',
    required: false,
    example: '1990-05-20',
  })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiProperty({
    description: 'Gender',
    required: false,
    enum: Gender,
    example: 'MALE',
  })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiProperty({
    description: 'Document number (DNI, ID, etc.)',
    required: false,
    maxLength: 50,
    example: '12345678',
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  documentNumber?: string;

  @ApiProperty({
    description: 'Passport number',
    required: false,
    maxLength: 50,
    example: 'AB123456',
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  passportNumber?: string;

  @ApiProperty({
    description: 'Nationality country ID',
    required: false,
    example: 1,
  })
  @IsInt()
  @IsOptional()
  nationalityId?: number;

  @ApiProperty({
    description: 'Passport country ID',
    required: false,
    example: 1,
  })
  @IsInt()
  @IsOptional()
  passportCountryId?: number;

  @ApiProperty({
    description: 'Preferred language ID',
    required: false,
    example: 1,
  })
  @IsInt()
  @IsOptional()
  languageId?: number;

  @ApiProperty({
    description: 'Preferred currency ID',
    required: false,
    example: 1,
  })
  @IsInt()
  @IsOptional()
  currencyId?: number;
}
