import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

export class CreateWorkerDto {
  @ApiProperty({
    description: 'Email of the user to add as worker',
    example: 'worker@example.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Role of the worker in the company',
    example: 'Tour Guide',
  })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiProperty({
    description: 'Array of permission names to assign to the worker',
    example: ['PACKAGE_CREATE', 'PACKAGE_EDIT'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  permissions: string[];
}
