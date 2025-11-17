import { Module } from '@nestjs/common';
import { TouristPackagesService } from './tourist-packages.service';
import { TouristPackagesController } from './tourist-packages.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { CompaniesModule } from '@/companies/companies.module';
import { CompanyOwnershipGuard } from './guards/company-ownership.guard';

/**
 * Module for managing tourist packages
 * Handles all tourist package operations with role-based access control
 */
@Module({
  imports: [PrismaModule, CompaniesModule],
  controllers: [TouristPackagesController],
  providers: [TouristPackagesService, CompanyOwnershipGuard],
  exports: [TouristPackagesService],
})
export class TouristPackagesModule {}
