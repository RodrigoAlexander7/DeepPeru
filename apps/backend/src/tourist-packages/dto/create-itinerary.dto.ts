import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

/**
 * DTO for creating an itinerary item (day activity)
 */
export class CreateItineraryItemDto {
  @ApiProperty({
    description: 'Day number in the itinerary',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  dayNumber: number;

  @ApiProperty({
    description: 'Title of the activity',
    example: 'Arrival and City Tour',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the activity',
    example: 'Arrive in Cusco, hotel check-in, and guided city tour',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Start time of the activity',
    example: '09:00',
  })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({
    description: 'End time of the activity',
    example: '17:00',
  })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiPropertyOptional({
    description: 'Location name',
    example: 'Cusco Main Square',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: 'Latitude coordinate',
    example: -13.5319,
  })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({
    description: 'Longitude coordinate',
    example: -71.9675,
  })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({
    description: 'Display order',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  order?: number;
}

/**
 * DTO for creating an itinerary
 */
export class CreateItineraryDto {
  @ApiPropertyOptional({
    description: 'Itinerary title',
    example: '3 Day Machu Picchu Adventure',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Number of days',
    example: 3,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  days?: number;

  @ApiProperty({
    description: 'List of itinerary items (daily activities)',
    type: [CreateItineraryItemDto],
  })
  @IsNotEmpty()
  items: CreateItineraryItemDto[];
}
