import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { CreateTouristPackageDto } from './create-tourist-package.dto';

/**
 * DTO for updating a tourist package
 * All fields are optional
 */
export class UpdateTouristPackageDto extends PartialType(
  CreateTouristPackageDto,
) {
  @ApiPropertyOptional({
    description: 'Whether the package is active',
    example: true,
  })
  isActive?: boolean;
}
