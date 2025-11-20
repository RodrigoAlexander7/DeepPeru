import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateScheduleDto {
  @ApiProperty({ description: 'IANA timezone', example: 'America/Lima' })
  @IsNotEmpty()
  @IsString()
  timezone: string;

  @ApiProperty({
    description: 'Days of week',
    isArray: true,
    example: ['MON', 'WED', 'FRI'],
  })
  @IsArray()
  @IsEnum(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'], { each: true })
  daysOfWeek: Array<'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN'>;

  @ApiProperty({ description: 'Start time (HH:mm)', example: '09:00' })
  @IsNotEmpty()
  @IsString()
  startTime: string;

  @ApiPropertyOptional({ description: 'End time (HH:mm)', example: '17:00' })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateFeatureDto {
  @ApiPropertyOptional({ description: 'Category', example: 'Comfort' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Icon URL' })
  @IsOptional()
  @IsString()
  iconUrl?: string;

  @ApiProperty({ description: 'Feature name', example: 'Bilingual guide' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Order', example: 1 })
  @IsOptional()
  @IsNumber()
  order?: number;
}

export class CreateActivityDto {
  @ApiProperty({ description: 'Activity name', example: 'City Walking Tour' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Destination city ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  destinationCityId: number;

  @ApiPropertyOptional({ type: [CreateScheduleDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateScheduleDto)
  schedules?: CreateScheduleDto[];

  @ApiPropertyOptional({ type: [CreateFeatureDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFeatureDto)
  features?: CreateFeatureDto[];
}
