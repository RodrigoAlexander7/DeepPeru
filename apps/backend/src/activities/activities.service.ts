import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Ensure activity exists, throw if not
   */
  private async ensureActivity(activityId: number) {
    const exists = await this.prisma.activity.findUnique({
      where: { id: activityId },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException(`Activity with ID ${activityId} not found`);
    }
  }

  /**
   * List packages that include an activity
   */
  async findPackagesForActivity(activityId: number) {
    await this.ensureActivity(activityId);
    const links = await this.prisma.touristPackageActivity.findMany({
      where: { activityId },
      include: {
        TouristPackage: {
          include: {
            TourismCompany: {
              select: { id: true, name: true, logoUrl: true, rating: true },
            },
            PricingOption: {
              where: { isActive: true },
              orderBy: { amount: 'asc' },
              take: 1,
            },
            Media: { where: { isPrimary: true }, take: 1 },
            representativeCity: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
    return links.map((l) => ({
      ...l.TouristPackage,
      // contextual dates for this activity within the package
      activityStartDate: (l as any).startDate,
      activityEndDate: (l as any).endDate,
    }));
  }
}
