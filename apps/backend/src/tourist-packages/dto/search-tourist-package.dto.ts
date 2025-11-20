import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsString,
  IsDate,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PackageType, DifficultyLevel } from './create-tourist-package.dto';

/**
 * DTO for flexible search of tourist packages
 * Supports multiple filters including destination, dates, travelers, and more
 * Designed to be expandable for future search parameters
 */
export class SearchTouristPackageDto {
  // Location/Destination filters
  @ApiPropertyOptional({
    description:
      'Destination search (matches City name, Region name, or State). Case-insensitive partial matching.',
    example: 'Cusco',
  })
  @IsOptional()
  @IsString()
  destination?: string;

  @ApiPropertyOptional({
    description: 'Filter by specific city ID (exact match)',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cityId?: number;

  @ApiPropertyOptional({
    description: 'Filter by specific region ID (exact match)',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  regionId?: number;

  // Date filters
  @ApiPropertyOptional({
    description:
      'Start date filter (ISO 8601). Finds packages available on or after this date.',
    example: '2025-06-01T00:00:00.000Z',
    type: String,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({
    description:
      'End date filter (ISO 8601). Finds packages available on or before this date.',
    example: '2025-06-15T23:59:59.000Z',
    type: String,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  // Travelers/Capacity filters
  @ApiPropertyOptional({
    description:
      'Number of travelers. Filters packages where minParticipants <= travelers <= maxParticipants',
    example: 4,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  travelers?: number;

  @ApiPropertyOptional({
    description: 'Minimum participants required for the package',
    example: 2,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  minParticipants?: number;

  @ApiPropertyOptional({
    description: 'Maximum participants allowed for the package',
    example: 10,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  maxParticipants?: number;

  // Package characteristics
  @ApiPropertyOptional({
    description: 'Filter by package type',
    enum: PackageType,
    example: PackageType.GROUP,
  })
  @IsOptional()
  @IsEnum(PackageType)
  type?: PackageType;

  @ApiPropertyOptional({
    description: 'Filter by difficulty level',
    enum: DifficultyLevel,
    example: DifficultyLevel.MODERATE,
  })
  @IsOptional()
  @IsEnum(DifficultyLevel)
  difficulty?: DifficultyLevel;

  @ApiPropertyOptional({
    description: 'Filter by company ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  companyId?: number;

  @ApiPropertyOptional({
    description: 'Filter by language ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  languageId?: number;

  // Price filters
  @ApiPropertyOptional({
    description: 'Minimum price filter (searches in active pricing options)',
    example: 50,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum price filter (searches in active pricing options)',
    example: 500,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Currency ID for price filters',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  currencyId?: number;

  // Age filters
  @ApiPropertyOptional({
    description: 'Filter by minimum age requirement',
    example: 18,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minAge?: number;

  @ApiPropertyOptional({
    description: 'Filter by maximum age allowed',
    example: 65,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxAge?: number;

  // Rating filter
  @ApiPropertyOptional({
    description: 'Minimum rating filter (0-5)',
    example: 4.0,
    minimum: 0,
    maximum: 5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  minRating?: number;

  // Duration filter
  @ApiPropertyOptional({
    description: 'Filter by duration (e.g., "3h", "2D1N", "5 days")',
    example: '2D1N',
  })
  @IsOptional()
  @IsString()
  duration?: string;

  // Accessibility filters
  @ApiPropertyOptional({
    description: 'Filter packages with hotel pickup available',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  hasHotelPickup?: boolean;

  // Active status
  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true,
    default: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  // Text search
  @ApiPropertyOptional({
    description:
      'Full-text search in package name, description, and included items',
    example: 'Machu Picchu tour',
  })
  @IsOptional()
  @IsString()
  search?: string;

  // Pagination
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  // Sorting
  @ApiPropertyOptional({
    description: 'Sort by field',
    example: 'createdAt',
    default: 'createdAt',
    enum: [
      'createdAt',
      'updatedAt',
      'name',
      'rating',
      'price',
      'duration',
      'difficulty',
    ],
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'desc',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: 'asc' | 'desc';
}
