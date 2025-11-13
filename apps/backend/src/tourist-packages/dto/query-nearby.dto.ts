import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsEnum, IsBoolean, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PackageType, DifficultyLevel } from './create-tourist-package.dto';

/**
 * DTO for querying nearby tourist packages by coordinates
 */
export class QueryTouristPackageNearbyDto {
  @ApiProperty({
    description: 'Latitude for the search center (WGS84)',
    example: -13.5167,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  lat!: number;

  @ApiProperty({
    description: 'Longitude for the search center (WGS84)',
    example: -71.978,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  lng!: number;

  @ApiPropertyOptional({
    description: 'Search radius in kilometers',
    example: 25,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.1)
  radiusKm?: number;

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
    description: 'Filter by active status',
    example: true,
    default: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
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
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;
}
