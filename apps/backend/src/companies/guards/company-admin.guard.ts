import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { CompaniesService } from '../companies.service';

@Injectable()
export class CompanyAdminGuard implements CanActivate {
  constructor(private companiesService: CompaniesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.sub;
    const companyId = this.extractCompanyId(request);

    if (!companyId) {
      throw new ForbiddenException('Company ID is required');
    }

    const isAdmin = await this.companiesService.isUserCompanyAdmin(
      userId,
      companyId,
    );

    if (!isAdmin) {
      throw new ForbiddenException(
        'Only company admins can perform this action',
      );
    }

    return true;
  }

  private extractCompanyId(request: any): number | null {
    if (request.params.id) {
      return parseInt(request.params.id, 10);
    }

    if (request.params.companyId) {
      return parseInt(request.params.companyId, 10);
    }

    if (request.body && request.body.companyId) {
      return parseInt(request.body.companyId, 10);
    }

    return null;
  }
}
