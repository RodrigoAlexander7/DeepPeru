import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { TouristPackagesService } from './tourist-packages.service';
import { CreateTouristPackageDto } from './dto/create-tourist-package.dto';
import { UpdateTouristPackageDto } from './dto/update-tourist-package.dto';
import { QueryTouristPackageDto } from './dto/query-tourist-package.dto';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { CompanyOwnershipGuard } from './guards/company-ownership.guard';
import { CurrentUser } from './decorators/current-user.decorator';

/**
 * Controller for managing tourist packages
 * Provides endpoints for CRUD operations on tourist packages
 */
@ApiTags('Tourist Packages')
@Controller('tourist-packages')
export class TouristPackagesController {
  constructor(
    private readonly touristPackagesService: TouristPackagesService,
  ) {}

  /**
   * Create a new tourist package
   * Requires authentication and company ownership/permissions
   */
  @Post()
  @UseGuards(JwtAuthGuard, CompanyOwnershipGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new tourist package',
    description:
      'Creates a new tourist package. User must be a company admin or have CREATE_PACKAGE permission.',
  })
  @ApiResponse({
    status: 201,
    description: 'Tourist package created successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have permission for this company',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data',
  })
  create(
    @Body() createTouristPackageDto: CreateTouristPackageDto,
    @CurrentUser() user: any,
  ) {
    return this.touristPackagesService.create(createTouristPackageDto);
  }

  /**
   * Get all tourist packages with filters
   * Public endpoint - no authentication required
   */
  @Get()
  @ApiOperation({
    summary: 'Get all tourist packages',
    description:
      'Retrieves a paginated list of tourist packages with optional filters.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of tourist packages retrieved successfully',
  })
  findAll(@Query() query: QueryTouristPackageDto) {
    return this.touristPackagesService.findAll(query);
  }

  /**
   * Get a single tourist package by ID
   * Public endpoint - no authentication required
   */
  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'Tourist package ID',
    example: 1,
  })
  @ApiOperation({
    summary: 'Get a tourist package by ID',
    description:
      'Retrieves detailed information about a specific tourist package.',
  })
  @ApiResponse({
    status: 200,
    description: 'Tourist package retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Tourist package not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.touristPackagesService.findOne(id);
  }

  /**
   * Update a tourist package
   * Requires authentication and ownership verification
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, CompanyOwnershipGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Tourist package ID',
    example: 1,
  })
  @ApiOperation({
    summary: 'Update a tourist package',
    description:
      'Updates an existing tourist package. User must own the company that owns this package.',
  })
  @ApiResponse({
    status: 200,
    description: 'Tourist package updated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not own this package',
  })
  @ApiResponse({
    status: 404,
    description: 'Tourist package not found',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTouristPackageDto: UpdateTouristPackageDto,
    @Req() req: any,
    @CurrentUser() user: any,
  ) {
    // Get package company ID and attach to request for guard
    const companyId = await this.touristPackagesService.getPackageCompanyId(id);
    req.packageCompanyId = companyId;

    return this.touristPackagesService.update(id, updateTouristPackageDto);
  }

  /**
   * Delete (soft delete) a tourist package
   * Requires authentication and ownership verification
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, CompanyOwnershipGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Tourist package ID',
    example: 1,
  })
  @ApiOperation({
    summary: 'Delete a tourist package',
    description:
      'Soft deletes a tourist package by setting isActive to false. User must own the company that owns this package.',
  })
  @ApiResponse({
    status: 200,
    description: 'Tourist package deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not own this package',
  })
  @ApiResponse({
    status: 404,
    description: 'Tourist package not found',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
    @CurrentUser() user: any,
  ) {
    // Get package company ID and attach to request for guard
    const companyId = await this.touristPackagesService.getPackageCompanyId(id);
    req.packageCompanyId = companyId;

    return this.touristPackagesService.remove(id);
  }
}
