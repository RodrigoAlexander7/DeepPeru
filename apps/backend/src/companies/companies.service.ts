import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

/**
 * Service for managing tourism companies and checking user permissions
 */
@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all companies that a user owns or works for
   * @param userId - User ID
   * @returns Array of company IDs
   */
  async getUserCompanies(userId: string): Promise<number[]> {
    const companyIds: number[] = [];

    // Get companies where user is admin
    const adminCompanies = await this.prisma.companyAdmin.findMany({
      where: { userId },
      include: { company: true },
    });
    companyIds.push(
      ...adminCompanies.map((ac) => ac.company.map((c) => c.id)).flat(),
    );

    // Get companies where user is worker
    const workerCompanies = await this.prisma.companyWorker.findMany({
      where: { userId, isActive: true },
      select: { companyId: true },
    });
    companyIds.push(...workerCompanies.map((wc) => wc.companyId));

    return [...new Set(companyIds)];
  }

  /**
   * Check if user is admin of a specific company
   * @param userId - User ID
   * @param companyId - Company ID
   * @returns True if user is company admin
   */
  async isUserCompanyAdmin(
    userId: string,
    companyId: number,
  ): Promise<boolean> {
    const companyAdmin = await this.prisma.companyAdmin.findFirst({
      where: {
        userId,
        company: {
          some: {
            id: companyId,
          },
        },
      },
    });

    return !!companyAdmin;
  }

  /**
   * Get user's permissions for a specific company
   * @param userId - User ID
   * @param companyId - Company ID
   * @returns Array of permission names
   */
  async getUserCompanyPermissions(
    userId: string,
    companyId: number,
  ): Promise<string[]> {
    const worker = await this.prisma.companyWorker.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
        isActive: true,
      },
      include: {
        Permission: {
          select: { name: true },
        },
      },
    });

    return worker?.Permission.map((p) => p.name) || [];
  }

  /**
   * Verify if user has access to a company (as admin or worker)
   * @param userId - User ID
   * @param companyId - Company ID
   * @returns True if user has access
   */
  async verifyUserCompanyAccess(
    userId: string,
    companyId: number,
  ): Promise<boolean> {
    const userCompanies = await this.getUserCompanies(userId);
    return userCompanies.includes(companyId);
  }

  /**
   * Check if user has a specific permission in a company
   * @param userId - User ID
   * @param companyId - Company ID
   * @param permissionName - Permission name to check
   * @returns True if user has permission
   */
  async hasPermission(
    userId: string,
    companyId: number,
    permissionName: string,
  ): Promise<boolean> {
    // Company admins have all permissions
    if (await this.isUserCompanyAdmin(userId, companyId)) {
      return true;
    }

    // Check worker permissions
    const permissions = await this.getUserCompanyPermissions(userId, companyId);
    return permissions.includes(permissionName);
  }
}
