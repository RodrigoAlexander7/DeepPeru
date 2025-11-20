import { PartialType } from '@nestjs/swagger';
import { CreateActivityDto } from '@/activities/dto/create-activity.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateActivityDto extends PartialType(CreateActivityDto) {
  @ApiPropertyOptional({ description: 'Activity name' })
  name?: string;

  @ApiPropertyOptional({ description: 'Description' })
  description?: string;

  @ApiPropertyOptional({ description: 'Destination city ID' })
  destinationCityId?: number;

  // schedules/features are already optional via PartialType
}
