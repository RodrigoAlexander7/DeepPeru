import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';

@ApiTags('Activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get(':id/packages')
  @ApiParam({ name: 'id', description: 'Activity ID', example: 1 })
  @ApiOperation({
    summary: 'List packages for an activity',
    description:
      'Returns tourist packages that include the specified activity.',
  })
  @ApiResponse({ status: 200, description: 'Packages retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Activity not found' })
  getPackages(@Param('id', ParseIntPipe) id: number) {
    return this.activitiesService.findPackagesForActivity(id);
  }
}
