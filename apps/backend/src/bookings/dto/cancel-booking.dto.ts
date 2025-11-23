import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CancelBookingDto {
  @ApiProperty({
    description: 'Optional reason for cancelling the booking',
    required: false,
    maxLength: 500,
    example: 'Change of plans',
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  reason?: string;
}
