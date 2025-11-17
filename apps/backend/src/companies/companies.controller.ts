import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { AuthenticatedUser } from './decorators/current-user.decorator';
import { Permissions } from './decorators/permissions.decorator';
import { PermissionsGuard } from './guards/permissions.guard';
import { CompanyAdminGuard } from './guards/company-admin.guard';
import { Permission } from './constants/permissions';

@ApiTags('Companies')
@Controller('companies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new company',
    description:
      'Creates a new tourism company and assigns the current user as company admin. ' +
      'User must provide their legal data (firstName, lastName, dateOfBirth, nationality, documentNumber) to become an admin.',
  })
  @ApiResponse({ status: 201, description: 'Company created successfully' })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request - Invalid data or admin email does not match authenticated user',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.companiesService.createCompany(createCompanyDto, user.userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all companies of the current user',
    description: 'Returns all companies where user is admin or worker',
  })
  @ApiResponse({ status: 200, description: 'Companies retrieved successfully' })
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.companiesService.getUserCompaniesDetails(user.userId);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.CompanyView)
  @ApiOperation({
    summary: 'Get a company by ID',
    description: 'Returns company details if user has access',
  })
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiResponse({ status: 200, description: 'Company retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.companiesService.getCompanyById(id, user.userId);
  }

  @Patch(':id')
  @UseGuards(CompanyAdminGuard)
  @ApiOperation({
    summary: 'Update a company',
    description: 'Updates company details. Only admins can update',
  })
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiResponse({ status: 200, description: 'Company updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not a company admin' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.companiesService.updateCompany(
      id,
      updateCompanyDto,
      user.userId,
    );
  }

  @Delete(':id')
  @UseGuards(CompanyAdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a company',
    description:
      'Soft deletes a company (sets isActive to false). Only admins can delete',
  })
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiResponse({ status: 204, description: 'Company deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not a company admin' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.companiesService.deleteCompany(id, user.userId);
  }

  // ========== WORKER MANAGEMENT ENDPOINTS ==========

  @Post(':id/workers')
  @UseGuards(CompanyAdminGuard)
  @ApiOperation({
    summary: 'Add a worker to the company',
    description:
      'Invites a user to work for the company with specific permissions. Only admins can add workers',
  })
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiResponse({ status: 201, description: 'Worker added successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - User not found or already a worker',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Not a company admin' })
  addWorker(
    @Param('id', ParseIntPipe) id: number,
    @Body() createWorkerDto: CreateWorkerDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.companiesService.addWorker(id, createWorkerDto, user.userId);
  }

  @Get(':id/workers')
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.WorkerView)
  @ApiOperation({
    summary: 'Get all workers of a company',
    description: 'Returns all workers with their permissions',
  })
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiResponse({ status: 200, description: 'Workers retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - No access to company' })
  getWorkers(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.companiesService.getCompanyWorkers(id, user.userId);
  }

  @Patch(':companyId/workers/:workerId')
  @UseGuards(CompanyAdminGuard)
  @ApiOperation({
    summary: 'Update a worker',
    description:
      'Updates worker role and permissions. Only admins can update workers',
  })
  @ApiParam({ name: 'companyId', description: 'Company ID' })
  @ApiParam({ name: 'workerId', description: 'Worker ID' })
  @ApiResponse({ status: 200, description: 'Worker updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not a company admin' })
  @ApiResponse({ status: 404, description: 'Worker not found' })
  updateWorker(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Param('workerId', ParseIntPipe) workerId: number,
    @Body() updateWorkerDto: UpdateWorkerDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.companiesService.updateWorker(
      companyId,
      workerId,
      updateWorkerDto,
      user.userId,
    );
  }

  @Delete(':companyId/workers/:workerId')
  @UseGuards(CompanyAdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove a worker from the company',
    description: 'Removes a worker. Only admins can remove workers',
  })
  @ApiParam({ name: 'companyId', description: 'Company ID' })
  @ApiParam({ name: 'workerId', description: 'Worker ID' })
  @ApiResponse({ status: 204, description: 'Worker removed successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not a company admin' })
  @ApiResponse({ status: 404, description: 'Worker not found' })
  removeWorker(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Param('workerId', ParseIntPipe) workerId: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.companiesService.removeWorker(companyId, workerId, user.userId);
  }

  // ========== PERMISSION ENDPOINTS ==========

  @Get('permissions/available')
  @ApiOperation({
    summary: 'Get all available permissions',
    description: 'Returns a list of all available permissions in the system',
  })
  @ApiResponse({
    status: 200,
    description: 'Permissions retrieved successfully',
  })
  getAvailablePermissions() {
    return this.companiesService.getAvailablePermissions();
  }

  @Get(':id/my-permissions')
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.CompanyView)
  @ApiOperation({
    summary: 'Get current user permissions for a company',
    description:
      'Returns the permissions the current user has for the specified company',
  })
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiResponse({
    status: 200,
    description: 'Permissions retrieved successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - No access to company' })
  getMyPermissions(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.companiesService.getUserPermissions(id, user.userId);
  }
}
