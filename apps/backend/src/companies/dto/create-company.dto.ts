import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsUrl,
  IsDateString,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CompanyAdminDataDto } from './company-admin-data.dto';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'Commercial name of the company',
    example: 'Andean Adventures',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Legal or registered business name',
    example: 'Andean Adventures S.A.C.',
  })
  @IsString()
  @IsOptional()
  legalName?: string;

  @ApiPropertyOptional({
    description: 'Business registration number (RUC, VAT, RFC, etc.)',
    example: '20123456789',
  })
  @IsString()
  @IsOptional()
  registrationNumber?: string;

  @ApiProperty({
    description: 'Main contact email',
    example: 'contact@andeanadventures.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Main contact phone',
    example: '+51987654321',
  })
  @IsString()
  phone: string;

  @ApiPropertyOptional({
    description: 'Official website URL',
    example: 'https://andeanadventures.com',
  })
  @IsUrl()
  @IsOptional()
  websiteUrl?: string;

  @ApiPropertyOptional({
    description: 'Logo URL',
    example: 'https://cdn.example.com/logos/andean.png',
  })
  @IsUrl()
  @IsOptional()
  logoUrl?: string;

  @ApiProperty({
    description: 'Official registration date',
    example: '2020-01-15T00:00:00.000Z',
  })
  @IsDateString()
  registerDate: string;

  @ApiPropertyOptional({
    description: 'Default language ID for the company',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  languageId?: number;

  @ApiProperty({
    description: 'Company administrator legal data',
    type: CompanyAdminDataDto,
  })
  @ValidateNested()
  @Type(() => CompanyAdminDataDto)
  adminData: CompanyAdminDataDto;
}
