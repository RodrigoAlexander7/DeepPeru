import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CompaniesService } from '../companies.service';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { Permission } from '../constants/permissions';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private companiesService: CompaniesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user.sub;
    const companyId = this.extractCompanyId(request);

    if (!companyId) {
      return false;
    }

    // Check if user is admin (admins have all permissions)
    const isAdmin = await this.companiesService.isUserCompanyAdmin(
      userId,
      companyId,
    );

    if (isAdmin) {
      return true;
    }

    // Check if user has required permissions
    const userPermissions =
      await this.companiesService.getUserCompanyPermissions(userId, companyId);

    return requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );
  }

  private extractCompanyId(request: any): number | null {
    // Try to get from params
    if (request.params.id) {
      return parseInt(request.params.id, 10);
    }

    if (request.params.companyId) {
      return parseInt(request.params.companyId, 10);
    }

    // Try to get from body
    if (request.body && request.body.companyId) {
      return parseInt(request.body.companyId, 10);
    }

    return null;
  }
}
