import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { ALL_PERMISSIONS } from './constants/permissions';

/**
 * Service for managing tourism companies and checking user permissions
 */
@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new company and assign the current user as admin
   * User must complete their legal data to become a company admin
   */
  async createCompany(createCompanyDto: CreateCompanyDto, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { adminData, ...companyData } = createCompanyDto;

    // Validate admin data against current user email
    if (adminData.email !== user.email) {
      throw new BadRequestException(
        'Admin email must match the authenticated user email',
      );
    }

    // Check if nationality exists
    const nationality = await this.prisma.country.findUnique({
      where: { id: adminData.nationalityId },
    });

    if (!nationality) {
      throw new BadRequestException('Invalid nationality ID');
    }

    // Update user with legal admin data (phone will be stored as plain string for now)
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        email: adminData.email,
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        dateOfBirth: new Date(adminData.dateOfBirth),
        nationalityId: adminData.nationalityId,
        documentNumber: adminData.documentNumber,
      },
    });

    // Check if user already has a company admin role
    const existingAdmin = await this.prisma.companyAdmin.findUnique({
      where: { userId },
    });

    let companyAdminId: number;

    // If user doesn't have a CompanyAdmin record, create one
    if (!existingAdmin) {
      const companyAdmin = await this.prisma.companyAdmin.create({
        data: {
          userId,
          tourismCompanyId: 0, // Temporary placeholder
        },
      });
      companyAdminId = companyAdmin.id;
    } else {
      companyAdminId = existingAdmin.id;
    }

    // Create the company with admin phone
    const company = await this.prisma.tourismCompany.create({
      data: {
        ...companyData,
        phone: adminData.phone, // Use admin phone as company contact phone
        registerDate: new Date(companyData.registerDate),
        adminId: companyAdminId,
      },
      include: {
        admin: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                firstName: true,
                lastName: true,
                dateOfBirth: true,
                documentNumber: true,
                nationality: {
                  select: {
                    id: true,
                    name: true,
                    code: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return company;
  }

  /**
   * Get all companies where the user is admin or worker
   */
  async getUserCompaniesDetails(userId: string) {
    const companyIds = await this.getUserCompanies(userId);

    const companies = await this.prisma.tourismCompany.findMany({
      where: {
        id: { in: companyIds },
        isActive: true,
      },
      include: {
        admin: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            CompanyWorker: true,
            TouristPackage: true,
          },
        },
      },
    });

    return companies;
  }

  /**
   * Get a company by ID with access check
   */
  async getCompanyById(companyId: number, userId: string) {
    const hasAccess = await this.verifyUserCompanyAccess(userId, companyId);
    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this company');
    }

    const company = await this.prisma.tourismCompany.findUnique({
      where: { id: companyId },
      include: {
        admin: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
        language: true,
        _count: {
          select: {
            CompanyWorker: true,
            TouristPackage: true,
            installations: true,
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  /**
   * Update a company (only admins)
   */
  async updateCompany(
    companyId: number,
    updateCompanyDto: UpdateCompanyDto,
    userId: string,
  ) {
    const isAdmin = await this.isUserCompanyAdmin(userId, companyId);
    if (!isAdmin) {
      throw new ForbiddenException(
        'Only company admins can update company details',
      );
    }

    const company = await this.prisma.tourismCompany.update({
      where: { id: companyId },
      data: {
        ...updateCompanyDto,
        registerDate: updateCompanyDto.registerDate
          ? new Date(updateCompanyDto.registerDate)
          : undefined,
      },
    });

    return company;
  }

  /**
   * Soft delete a company (only admins)
   */
  async deleteCompany(companyId: number, userId: string) {
    const isAdmin = await this.isUserCompanyAdmin(userId, companyId);
    if (!isAdmin) {
      throw new ForbiddenException('Only company admins can delete companies');
    }

    await this.prisma.tourismCompany.update({
      where: { id: companyId },
      data: { isActive: false },
    });
  }

  // ========== WORKER MANAGEMENT ==========

  /**
   * Add a worker to a company
   */
  async addWorker(
    companyId: number,
    createWorkerDto: CreateWorkerDto,
    adminUserId: string,
  ) {
    const isAdmin = await this.isUserCompanyAdmin(adminUserId, companyId);
    if (!isAdmin) {
      throw new ForbiddenException('Only company admins can add workers');
    }

    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: createWorkerDto.email },
    });

    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }

    // Check if already a worker
    const existingWorker = await this.prisma.companyWorker.findUnique({
      where: {
        userId_companyId: {
          userId: user.id,
          companyId,
        },
      },
    });

    if (existingWorker) {
      throw new BadRequestException('User is already a worker in this company');
    }

    // Get or create permissions
    const permissions = await this.ensurePermissionsExist(
      createWorkerDto.permissions,
    );

    // Create worker
    const worker = await this.prisma.companyWorker.create({
      data: {
        userId: user.id,
        companyId,
        role: createWorkerDto.role,
        Permission: {
          connect: permissions.map((p) => ({ id: p.id })),
        },
      },
      include: {
        User: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        Permission: true,
      },
    });

    return worker;
  }

  /**
   * Get all workers of a company
   */
  async getCompanyWorkers(companyId: number, userId: string) {
    const hasAccess = await this.verifyUserCompanyAccess(userId, companyId);
    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this company');
    }

    const workers = await this.prisma.companyWorker.findMany({
      where: { companyId },
      include: {
        User: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
        Permission: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return workers;
  }

  /**
   * Update a worker
   */
  async updateWorker(
    companyId: number,
    workerId: number,
    updateWorkerDto: UpdateWorkerDto,
    adminUserId: string,
  ) {
    const isAdmin = await this.isUserCompanyAdmin(adminUserId, companyId);
    if (!isAdmin) {
      throw new ForbiddenException('Only company admins can update workers');
    }

    const worker = await this.prisma.companyWorker.findUnique({
      where: { id: workerId },
    });

    if (!worker || worker.companyId !== companyId) {
      throw new NotFoundException('Worker not found');
    }

    interface UpdateData {
      role?: string | null;
      isActive?: boolean;
      Permission?: {
        connect: Array<{ id: number }>;
      };
    }

    const updateData: UpdateData = {};

    if (updateWorkerDto.role !== undefined) {
      updateData.role = updateWorkerDto.role;
    }

    if (updateWorkerDto.isActive !== undefined) {
      updateData.isActive = updateWorkerDto.isActive;
    }

    // Handle permissions update
    if (updateWorkerDto.permissions) {
      const permissions = await this.ensurePermissionsExist(
        updateWorkerDto.permissions,
      );

      // Disconnect all current permissions and connect new ones
      await this.prisma.companyWorker.update({
        where: { id: workerId },
        data: {
          Permission: {
            set: [],
          },
        },
      });

      updateData.Permission = {
        connect: permissions.map((p) => ({ id: p.id })),
      };
    }

    const updatedWorker = await this.prisma.companyWorker.update({
      where: { id: workerId },
      data: updateData,
      include: {
        User: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        Permission: true,
      },
    });

    return updatedWorker;
  }

  /**
   * Remove a worker from a company
   */
  async removeWorker(companyId: number, workerId: number, adminUserId: string) {
    const isAdmin = await this.isUserCompanyAdmin(adminUserId, companyId);
    if (!isAdmin) {
      throw new ForbiddenException('Only company admins can remove workers');
    }

    const worker = await this.prisma.companyWorker.findUnique({
      where: { id: workerId },
    });

    if (!worker || worker.companyId !== companyId) {
      throw new NotFoundException('Worker not found');
    }

    await this.prisma.companyWorker.delete({
      where: { id: workerId },
    });
  }

  // ========== PERMISSION MANAGEMENT ==========

  /**
   * Ensure permissions exist in the database
   */
  private async ensurePermissionsExist(permissionNames: string[]) {
    const permissions = await Promise.all(
      permissionNames.map(async (name) => {
        return this.prisma.permission.upsert({
          where: { name },
          update: {},
          create: { name },
        });
      }),
    );

    return permissions;
  }

  /**
   * Get all available permissions
   */
  async getAvailablePermissions() {
    return ALL_PERMISSIONS.map((permission) => ({
      name: permission,
      description: this.getPermissionDescription(permission),
    }));
  }

  /**
   * Get user's permissions for a specific company
   */
  async getUserPermissions(companyId: number, userId: string) {
    const hasAccess = await this.verifyUserCompanyAccess(userId, companyId);
    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this company');
    }

    const isAdmin = await this.isUserCompanyAdmin(userId, companyId);

    if (isAdmin) {
      return {
        isAdmin: true,
        permissions: ALL_PERMISSIONS,
      };
    }

    const permissions = await this.getUserCompanyPermissions(userId, companyId);

    return {
      isAdmin: false,
      permissions,
    };
  }

  /**
   * Get permission description
   */
  private getPermissionDescription(permission: string): string {
    const descriptions: Record<string, string> = {
      'package:create': 'Create new tourist packages',
      'package:edit': 'Edit existing tourist packages',
      'package:delete': 'Delete tourist packages',
      'package:view': 'View tourist packages',
      'worker:invite': 'Invite new workers to the company',
      'worker:edit': 'Edit worker permissions and roles',
      'worker:remove': 'Remove workers from the company',
      'worker:view': 'View company workers',
      'company:create': 'Create new companies',
      'company:edit': 'Edit company details',
      'company:delete': 'Delete companies',
      'company:view': 'View company information',
      'installation:create': 'Create company installations',
      'installation:edit': 'Edit company installations',
      'installation:delete': 'Delete company installations',
      'installation:view': 'View company installations',
      'booking:create': 'Create bookings',
      'booking:edit': 'Edit bookings',
      'booking:cancel': 'Cancel bookings',
      'booking:view': 'View bookings',
      'analytics:view': 'View analytics and reports',
    };

    return descriptions[permission] || permission;
  }

  // ========== EXISTING METHODS (for backward compatibility) ==========

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
