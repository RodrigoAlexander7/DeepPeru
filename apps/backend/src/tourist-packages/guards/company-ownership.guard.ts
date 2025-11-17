import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { CompaniesService } from '@/companies/companies.service';
import { PrismaService } from '@/prisma/prisma.service';

/**
 * Guard to verify user has ownership or permission to manage a company's tourist packages
 * Checks if user is:
 * 1. Company Admin (owner of the company)
 * 2. Company Worker with CREATE_PACKAGE permission
 */
@Injectable()
export class CompanyOwnershipGuard implements CanActivate {
  constructor(
    private companiesService: CompaniesService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id) {
      throw new UnauthorizedException('User not authenticated');
    }

    const companyId = this.extractCompanyId(request);

    if (!companyId) {
      throw new ForbiddenException('Company ID is required');
    }

    // Check if user is company admin
    const isAdmin = await this.companiesService.isUserCompanyAdmin(
      user.id,
      companyId,
    );

    if (isAdmin) {
      return true;
    }

    // Check if user has CREATE_PACKAGE permission as worker
    const hasPermission = await this.companiesService.hasPermission(
      user.id,
      companyId,
      'CREATE_PACKAGE',
    );

    if (hasPermission) {
      return true;
    }

    throw new ForbiddenException(
      'You do not have permission to manage packages for this company',
    );
  }

  /**
   * Extract company ID from request body or params
   * For POST/PATCH: check body.companyId
   * For PUT/DELETE: check if package belongs to user's company
   */
  private extractCompanyId(request: any): number | null {
    // For create operations, get from body
    if (request.body?.companyId) {
      return parseInt(request.body.companyId, 10);
    }

    // For update/delete, we need to check the package ownership
    // This will be set by the controller after fetching the package
    if (request.packageCompanyId) {
      return request.packageCompanyId;
    }

    return null;
  }
}
