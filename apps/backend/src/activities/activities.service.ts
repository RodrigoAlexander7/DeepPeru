import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
      // Validate destination city existence to avoid FK violation (P2003)
      const city = await tx.city.findUnique({
        where: { id: data.destinationCityId },
        select: { id: true },
      });
      if (!city) {
        throw new NotFoundException(
          `Destination city with id ${data.destinationCityId} not found`,
        );
      }
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

  /** Update an activity (replace schedules/features if arrays provided) */
  async update(
    id: number,
    dto: Partial<{
      name: string;
      description?: string;
      destinationCityId?: number;
      schedules?: CreateActivityDto['schedules'];
      features?: CreateActivityDto['features'];
    }>,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.activity.findUnique({
        where: { id },
        select: { id: true },
      });
      if (!existing) {
        throw new NotFoundException(`Activity with ID ${id} not found`);
      }

      // If changing destination city, validate
      if (dto.destinationCityId) {
        const city = await tx.city.findUnique({
          where: { id: dto.destinationCityId },
          select: { id: true },
        });
        if (!city) {
          throw new NotFoundException(
            `Destination city with id ${dto.destinationCityId} not found`,
          );
        }
      }

      // Basic field updates
      await tx.activity.update({
        where: { id },
        data: {
          name: dto.name,
          description: dto.description,
          destinationCityId: dto.destinationCityId,
        },
      });

      // Replace schedules if provided
      if (dto.schedules) {
        await tx.schedule.deleteMany({ where: { activityId: id } });
        if (dto.schedules.length) {
          await tx.schedule.createMany({
            data: dto.schedules.map((s) => ({ ...s, activityId: id })),
          });
        }
      }

      // Replace features if provided
      if (dto.features) {
        await tx.feature.deleteMany({ where: { activityId: id } });
        if (dto.features.length) {
          await tx.feature.createMany({
            data: dto.features.map((f) => ({ ...f, activityId: id })),
          });
        }
      }

      return tx.activity.findUnique({
        where: { id },
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
