import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class QueryActivityDto {
  @ApiPropertyOptional({
    description: 'Filter by destination city ID',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  destinationCityId?: number;

  @ApiPropertyOptional({ description: 'Search term for name', example: 'City' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ description: 'Page number', example: 1, default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Page size', example: 10, default: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;
}
