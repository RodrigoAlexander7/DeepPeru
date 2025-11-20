import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class UpdateWorkerDto {
  @ApiPropertyOptional({
    description: 'Role of the worker in the company',
    example: 'Senior Tour Guide',
  })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({
    description: 'Array of permission names to assign to the worker',
    example: ['PACKAGE_CREATE', 'PACKAGE_EDIT', 'PACKAGE_DELETE'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissions?: string[];

  @ApiPropertyOptional({
    description: 'Whether the worker is active',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
