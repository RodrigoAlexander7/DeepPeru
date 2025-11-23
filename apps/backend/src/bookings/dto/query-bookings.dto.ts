import { IsEnum, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export class QueryBookingsDto {
  @ApiProperty({
    description: 'Filter by booking status',
    enum: BookingStatus,
    required: false,
    example: 'CONFIRMED',
  })
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @ApiProperty({
    description: 'Filter upcoming bookings (travel date >= today)',
    required: false,
    example: true,
  })
  @Type(() => Boolean)
  @IsOptional()
  upcoming?: boolean;

  @ApiProperty({
    description: 'Filter past bookings (travel date < today)',
    required: false,
    example: false,
  })
  @Type(() => Boolean)
  @IsOptional()
  past?: boolean;

  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    default: 1,
    minimum: 1,
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    default: 10,
    minimum: 1,
    example: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}
