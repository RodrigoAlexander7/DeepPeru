import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
} from 'class-validator';

/**
 * DTO for creating a pricing option for a tourist package
 */
export class CreatePricingOptionDto {
  @ApiProperty({
    description: 'Name of the pricing option',
    example: 'Standard Group Tour',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Description of what this pricing includes',
    example: 'Includes guide and transportation',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Currency ID for this pricing',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  currencyId: number;

  @ApiProperty({
    description: 'Price amount',
    example: 150.0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiPropertyOptional({
    description: 'Whether price is per person',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  perPerson?: boolean;

  @ApiPropertyOptional({
    description: 'Minimum number of participants',
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  minParticipants?: number;

  @ApiPropertyOptional({
    description: 'Maximum number of participants',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxParticipants?: number;

  @ApiPropertyOptional({
    description: 'Valid from date (ISO 8601)',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsOptional()
  validFrom?: Date;

  @ApiPropertyOptional({
    description: 'Valid to date (ISO 8601)',
    example: '2025-12-31T23:59:59.000Z',
  })
  @IsOptional()
  validTo?: Date;
}
