import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { PrismaModule } from '@/prisma/prisma.module';

/**
 * Module for managing tourism companies
 */
@Module({
  imports: [PrismaModule],
  providers: [CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
