import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { QueryActivityDto } from '@/activities/dto/query-activity.dto';

@ApiTags('Activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  // List activities
  @Get()
  @ApiOperation({
    summary: 'List activities',
    description:
      'Returns a paginated list of activities with optional filters.',
  })
  @ApiQuery({ name: 'destinationCityId', required: false, type: Number })
  @ApiQuery({
    name: 'q',
    required: false,
    type: String,
    description: 'Search by name',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  getActivities(@Query() query: QueryActivityDto) {
    return this.activitiesService.findAll(query);
  }

  // Create activity
  @Post()
  @ApiOperation({
    summary: 'Create activity',
    description:
      'Creates a new activity; supports nested schedules and features.',
  })
  @ApiBody({ type: CreateActivityDto })
  create(@Body() dto: CreateActivityDto) {
    return this.activitiesService.create(dto);
  }

  // Update activity
  @Patch(':id')
  @ApiParam({ name: 'id', description: 'Activity ID', example: 1 })
  @ApiOperation({
    summary: 'Update activity',
    description:
      'Updates basic fields; if schedules/features arrays are provided, replaces them entirely.',
  })
  @ApiBody({ type: UpdateActivityDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateActivityDto,
  ) {
    return this.activitiesService.update(id, dto);
  }

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

  // Get single activity
  @Get(':id')
  @ApiParam({ name: 'id', description: 'Activity ID', example: 1 })
  @ApiOperation({
    summary: 'Get activity by ID',
    description:
      'Returns the activity with its schedules, features and destination city.',
  })
  @ApiResponse({ status: 200, description: 'Activity retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Activity not found' })
  getActivity(@Param('id', ParseIntPipe) id: number) {
    return this.activitiesService.findOne(id);
  }

  // Delete activity
  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Activity ID', example: 1 })
  @ApiOperation({
    summary: 'Delete activity',
    description:
      'Deletes the activity after unlinking it from packages and removing schedules/features.',
  })
  @ApiResponse({ status: 200, description: 'Activity deleted successfully' })
  @ApiResponse({ status: 404, description: 'Activity not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.activitiesService.remove(id);
  }
}
