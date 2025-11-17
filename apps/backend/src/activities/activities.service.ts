import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateActivityDto } from '@/activities/dto/create-activity.dto';
import { QueryActivityDto } from '@/activities/dto/query-activity.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new activity with optional schedules and features
   */
  async create(dto: CreateActivityDto) {
    const { schedules = [], features = [], ...data } = dto;

    return this.prisma.$transaction(async (tx) => {
      const activity = await tx.activity.create({ data });

      if (schedules.length) {
        await tx.schedule.createMany({
          data: schedules.map((s) => ({ ...s, activityId: activity.id })),
        });
      }

      if (features.length) {
        await tx.feature.createMany({
          data: features.map((f) => ({ ...f, activityId: activity.id })),
        });
      }

      return tx.activity.findUnique({
        where: { id: activity.id },
        include: { Feature: true, Schedule: true, destinationCity: true },
      });
    });
  }

  /**
   * List activities with optional filters and pagination
   */
  async findAll(query: QueryActivityDto) {
    const { destinationCityId, q, page = 1, limit = 10 } = query;
    const where: Prisma.ActivityWhereInput = {};
    if (destinationCityId) where.destinationCityId = destinationCityId;
    if (q) where.name = { contains: q, mode: 'insensitive' };

    const [items, total] = await Promise.all([
      this.prisma.activity.findMany({
        where,
        include: { destinationCity: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.activity.count({ where }),
    ]);

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /** Get a single activity by ID */
  async findOne(id: number) {
    const activity = await this.prisma.activity.findUnique({
      where: { id },
      include: { Feature: true, Schedule: true, destinationCity: true },
    });
    if (!activity)
      throw new NotFoundException(`Activity with ID ${id} not found`);
    return activity;
  }

  /** Delete an activity after unlinking relations */
  async remove(id: number) {
    // ensure exists
    await this.ensureActivity(id);
    await this.prisma.$transaction(async (tx) => {
      await tx.touristPackageActivity.deleteMany({ where: { activityId: id } });
      await tx.schedule.deleteMany({ where: { activityId: id } });
      await tx.feature.deleteMany({ where: { activityId: id } });
      await tx.activity.delete({ where: { id } });
    });
    return { id, deleted: true };
  }
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
