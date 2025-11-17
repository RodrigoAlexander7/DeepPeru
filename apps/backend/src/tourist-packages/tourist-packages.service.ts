import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateTouristPackageDto } from './dto/create-tourist-package.dto';
import { UpdateTouristPackageDto } from './dto/update-tourist-package.dto';
import { QueryTouristPackageDto } from './dto/query-tourist-package.dto';
import { QueryTouristPackageByCityDto } from './dto/query-by-city.dto';
import { QueryTouristPackageNearbyDto } from './dto/query-nearby.dto';
import { SearchTouristPackageDto } from './dto/search-tourist-package.dto';
import { Prisma } from '@prisma/client';

/**
 * Service for managing tourist packages
 * Handles business logic for CRUD operations on packages
 */
@Injectable()
export class TouristPackagesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new tourist package with all nested relations
   * @param createDto - Data for creating the package
   * @returns Created package with all relations
   */
  async create(createDto: CreateTouristPackageDto) {
    const { pricingOptions, media, benefits, pickupDetail, ...packageData } =
      createDto;

    return this.prisma.$transaction(async (tx) => {
      const touristPackage = await tx.touristPackage.create({
        data: {
          ...packageData,
          updatedAt: new Date(),
          // Create pricing options
          PricingOption: pricingOptions
            ? {
                create: pricingOptions,
              }
            : undefined,
          // Create media
          Media: media
            ? {
                create: media,
              }
            : undefined,
          // Create benefits
          Benefit: benefits
            ? {
                create: benefits,
              }
            : undefined,
          // Create pickup detail
          PickupDetail: pickupDetail
            ? {
                create: pickupDetail,
              }
            : undefined,
        },
        include: {
          TourismCompany: true,
          PricingOption: true,
          Media: true,
          Benefit: true,
          PickupDetail: true,
          activities: {
            include: {
              Activity: {
                include: {
                  Feature: true,
                  Schedule: true,
                  destinationCity: true,
                },
              },
            },
          },
          Language: true,
        },
      });

      return touristPackage;
    });
  }

  /**
   * Find all tourist packages with filters and pagination
   * @param query - Query filters and pagination
   * @returns Array of packages and total count
   */
  async findAll(query: QueryTouristPackageDto) {
    const {
      companyId,
      type,
      difficulty,
      isActive = true,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
    } = query;

    const where: Prisma.TouristPackageWhereInput = {};

    if (companyId) where.companyId = companyId;
    if (type) where.type = type;
    if (difficulty) where.difficulty = difficulty;
    if (isActive !== undefined) where.isActive = isActive;

    const [packages, total] = await Promise.all([
      this.prisma.touristPackage.findMany({
        where,
        include: {
          TourismCompany: {
            select: {
              id: true,
              name: true,
              logoUrl: true,
              rating: true,
            },
          },
          PricingOption: {
            where: { isActive: true },
            orderBy: { amount: 'asc' },
            take: 1,
          },
          Media: {
            where: { isPrimary: true },
            take: 1,
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
      }),
      this.prisma.touristPackage.count({ where }),
    ]);

    return {
      data: packages,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find a single tourist package by ID with all relations
   * @param id - Package ID
   * @returns Package with all details
   */
  async findOne(id: number) {
    const touristPackage = await this.prisma.touristPackage.findUnique({
      where: { id },
      include: {
        TourismCompany: true,
        PricingOption: {
          where: { isActive: true },
          orderBy: { amount: 'asc' },
        },
        Media: {
          orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }],
        },
        Benefit: {
          orderBy: { order: 'asc' },
        },
        PickupDetail: true,
        activities: {
          include: {
            Activity: {
              include: { Feature: true, Schedule: true, destinationCity: true },
            },
          },
        },
        Language: true,
      },
    });

    if (!touristPackage) {
      throw new NotFoundException(`Tourist package with ID ${id} not found`);
    }

    // Transform activities to expose contextual start/end dates at top level if desired
    const transformed = {
      ...touristPackage,
      activities: touristPackage.activities.map((link) => ({
        // preserve original link identifiers if consumers rely on them
        activityId: link.activityId,
        packageId: link.packageId,
        // Association contextual dates (cast to any until Prisma client regenerated)
        startDate: (link as any).startDate,
        endDate: (link as any).endDate,
        createdAt: link.createdAt,
        Activity: link.Activity,
      })),
    };

    return transformed;
  }

  /**
   * Update a tourist package
   * @param id - Package ID
   * @param updateDto - Data to update
   * @returns Updated package
   */
  async update(id: number, updateDto: UpdateTouristPackageDto) {
    //validate existence
    await this.findOne(id);

    const { pricingOptions, media, benefits, pickupDetail, ...packageData } =
      updateDto;

    return this.prisma.$transaction(async (tx) => {
      // Update basic package data
      await tx.touristPackage.update({
        where: { id },
        data: {
          ...packageData,
          updatedAt: new Date(),
        },
      });

      // Update pricing options if provided
      if (pricingOptions) {
        await tx.pricingOption.deleteMany({ where: { packageId: id } });
        await tx.pricingOption.createMany({
          data: pricingOptions.map((po) => ({ ...po, packageId: id })),
        });
      }

      // Update media if provided
      if (media) {
        await tx.media.deleteMany({ where: { packageId: id } });
        await tx.media.createMany({
          data: media.map((m) => ({ ...m, packageId: id })),
        });
      }

      // Update benefits if provided
      if (benefits) {
        await tx.benefit.deleteMany({ where: { packageId: id } });
        await tx.benefit.createMany({
          data: benefits.map((b) => ({ ...b, packageId: id })),
        });
      }

      // Update features if provided
      // (Feature creation removed; features now belong to activities)

      // Update pickup detail if provided
      if (pickupDetail) {
        await tx.pickupDetail.deleteMany({ where: { packageId: id } });
        await tx.pickupDetail.create({
          data: { ...pickupDetail, packageId: id },
        });
      }

      // (Package-level schedules removed; schedules now belong to activities)

      // (Itinerary removed from schema)

      return this.findOne(id);
    });
  }

  /**
   * List activities for a given tourist package
   * @param packageId - Package ID
   */
  async findActivitiesForPackage(packageId: number) {
    // ensure package exists
    await this.getPackageCompanyId(packageId);
    const links = await this.prisma.touristPackageActivity.findMany({
      where: { packageId },
      include: {
        Activity: {
          include: { Feature: true, Schedule: true, destinationCity: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
    return links.map((l) => ({
      ...l.Activity,
      startDate: (l as any).startDate,
      endDate: (l as any).endDate,
    }));
  }

  /**
   * Soft delete a tourist package (set isActive to false)
   * @param id - Package ID
   * @returns Updated package
   */
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.touristPackage.update({
      where: { id },
      data: { isActive: false, updatedAt: new Date() },
    });
  }

  /**
   * Get package's company ID (used by guard)
   * @param id - Package ID
   * @returns Company ID
   */
  async getPackageCompanyId(id: number): Promise<number> {
    const pkg = await this.prisma.touristPackage.findUnique({
      where: { id },
      select: { companyId: true },
    });

    if (!pkg) {
      throw new NotFoundException(`Tourist package with ID ${id} not found`);
    }

    return pkg.companyId;
  }

  /**
   * Find packages by city using representative city or itinerary locations
   * @param query - City-based filter with pagination
   */
  async findByCity(query: QueryTouristPackageByCityDto) {
    const {
      cityId,
      type,
      difficulty,
      isActive = true,
      page = 1,
      limit = 10,
    } = query;

    // Build SQL WHERE with safe parameterization to support fields not exposed by Prisma client yet
    const conditions = [
      Prisma.sql`t."isActive" = ${isActive}`,
      Prisma.sql`(
        t."representativeCityId" = ${cityId}
        OR EXISTS(
          SELECT 1 FROM "PackageLocation" pl
          WHERE pl."packageId" = t."id" AND pl."cityId" = ${cityId}
        )
      )`,
    ];
    if (type)
      conditions.push(Prisma.sql`t."type" = CAST(${type} AS "PackageType")`);
    if (difficulty)
      conditions.push(
        Prisma.sql`t."difficulty" = CAST(${difficulty} AS "DifficultyLevel")`,
      );
    const whereSql = conditions.reduce(
      (acc, curr, idx) => {
        return idx === 0 ? Prisma.sql`${curr}` : Prisma.sql`${acc} AND ${curr}`;
      },
      Prisma.sql``,
    );

    // Count packages
    const countRows = await this.prisma.$queryRaw<Array<{ count: bigint }>>(
      Prisma.sql`SELECT COUNT(*)::bigint AS count FROM "TouristPackage" t WHERE ${whereSql}`,
    );
    const total = Number(countRows[0]?.count ?? 0);

    // Fetch page of ids
    const idsRows = await this.prisma.$queryRaw<Array<{ id: number }>>(
      Prisma.sql`SELECT t."id" FROM "TouristPackage" t WHERE ${whereSql} ORDER BY t."createdAt" DESC LIMIT ${limit} OFFSET ${(page - 1) * limit}`,
    );
    const ids = idsRows.map((r) => r.id);

    if (ids.length === 0) {
      return {
        data: [],
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
    }

    const packages = await this.prisma.touristPackage.findMany({
      where: { id: { in: ids } },
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
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: packages,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Find nearby packages by coordinates within a radius (km), ordered by distance
   * Uses meeting point coordinates when available
   * @param query - lat, lng, radius and optional filters
   */
  async findNearby(query: QueryTouristPackageNearbyDto) {
    const {
      lat,
      lng,
      radiusKm = 10,
      type,
      difficulty,
      isActive = true,
      page = 1,
      limit = 10,
    } = query;

    // Approximate bounding box for quick pre-filter
    const latDelta = radiusKm / 111; // ~111 km per degree latitude
    const lngDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180) || 1);

    const where: any = {
      meetingLatitude: {
        gte: lat - latDelta,
        lte: lat + latDelta,
      },
      meetingLongitude: {
        gte: lng - lngDelta,
        lte: lng + lngDelta,
      },
    } as Prisma.TouristPackageWhereInput;

    if (type) where.type = type;
    if (difficulty) where.difficulty = difficulty;
    if (isActive !== undefined) where.isActive = isActive;

    // Fetch candidates within bounding box
    const candidates = await this.prisma.touristPackage.findMany({
      where,
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
      },
    });

    // Compute haversine distance and sort
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const withDistance = candidates
      .filter((p) => p.meetingLatitude != null && p.meetingLongitude != null)
      .map((p) => {
        const dLat = toRad((p.meetingLatitude as number) - lat);
        const dLng = toRad((p.meetingLongitude as number) - lng);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat)) *
            Math.cos(toRad(p.meetingLatitude as number)) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceKm = R * c;
        return { ...p, distanceKm } as typeof p & { distanceKm: number };
      })
      .filter((p) => p.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    const total = withDistance.length;
    const start = (page - 1) * limit;
    const data = withDistance.slice(start, start + limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        center: { lat, lng },
        radiusKm,
      },
    };
  }

  /**
   * Flexible search for tourist packages with multiple filters
   * Supports destination search, date ranges, traveler count, price range, and more
   * Designed to be expandable for future search parameters
   * @param searchDto - Search parameters
   * @returns Paginated search results with metadata
   */
  async search(searchDto: SearchTouristPackageDto) {
    const {
      destination,
      cityId,
      regionId,
      startDate,
      endDate,
      travelers,
      minParticipants,
      maxParticipants,
      type,
      difficulty,
      companyId,
      languageId,
      minPrice,
      maxPrice,
      currencyId,
      minAge,
      maxAge,
      minRating,
      duration,
      hasHotelPickup,
      isActive = true,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
    } = searchDto;

    // Build WHERE clause dynamically
    const where: Prisma.TouristPackageWhereInput = {
      isActive,
    };

    // Company filter
    if (companyId) {
      where.companyId = companyId;
    }

    // Package type and difficulty
    if (type) {
      where.type = type;
    }
    if (difficulty) {
      where.difficulty = difficulty;
    }

    // Language filter
    if (languageId) {
      where.languageId = languageId;
    }

    // Duration filter (exact match)
    if (duration) {
      where.duration = duration;
    }

    // Rating filter
    if (minRating !== undefined) {
      where.rating = { gte: minRating };
    }

    // Age filters
    if (minAge !== undefined || maxAge !== undefined) {
      where.AND = where.AND || [];
      if (minAge !== undefined) {
        (where.AND as any[]).push({
          OR: [{ minAge: { lte: minAge } }, { minAge: null }],
        });
      }
      if (maxAge !== undefined) {
        (where.AND as any[]).push({
          OR: [{ maxAge: { gte: maxAge } }, { maxAge: null }],
        });
      }
    }

    // Travelers filter: package must accommodate the number of travelers
    if (travelers) {
      where.AND = where.AND || [];
      (where.AND as any[]).push({
        OR: [
          { minParticipants: { lte: travelers } },
          { minParticipants: null },
        ],
      });
      (where.AND as any[]).push({
        OR: [
          { maxParticipants: { gte: travelers } },
          { maxParticipants: null },
        ],
      });
    }

    // Min/Max participants filters
    if (minParticipants !== undefined) {
      where.minParticipants = { gte: minParticipants };
    }
    if (maxParticipants !== undefined) {
      where.maxParticipants = { lte: maxParticipants };
    }

    // Destination search: search in City name, Region name via relations
    if (destination) {
      where.OR = [
        // Search in representative city
        {
          representativeCity: {
            name: { contains: destination, mode: 'insensitive' },
          },
        },
        // Search in representative city's region
        {
          representativeCity: {
            region: {
              name: { contains: destination, mode: 'insensitive' },
            },
          },
        },
        // Search in package locations (itinerary cities)
        {
          locations: {
            some: {
              City: {
                name: { contains: destination, mode: 'insensitive' },
              },
            },
          },
        },
        // Search in package locations' regions
        {
          locations: {
            some: {
              City: {
                region: {
                  name: { contains: destination, mode: 'insensitive' },
                },
              },
            },
          },
        },
      ] as any;
    }

    // City ID filter (exact match)
    if (cityId) {
      const cityOrConditions = [
        { representativeCityId: cityId },
        {
          locations: {
            some: { cityId },
          },
        },
      ] as any;

      if (where.OR) {
        where.AND = where.AND || [];
        (where.AND as any[]).push({ OR: cityOrConditions });
      } else {
        where.OR = cityOrConditions;
      }
    }

    // Region ID filter
    if (regionId) {
      const regionOrConditions = [
        {
          representativeCity: {
            regionId,
          },
        },
        {
          locations: {
            some: {
              City: {
                regionId,
              },
            },
          },
        },
      ] as any;

      if (where.OR) {
        where.AND = where.AND || [];
        (where.AND as any[]).push({ OR: regionOrConditions });
      } else {
        where.OR = regionOrConditions;
      }
    }

    // Text search in name, description, included items
    if (search) {
      const searchOrConditions = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { includedItems: { has: search } },
      ] as any;

      if (where.OR) {
        where.AND = where.AND || [];
        (where.AND as any[]).push({ OR: searchOrConditions });
      } else {
        where.OR = searchOrConditions;
      }
    }

    // Hotel pickup filter
    if (hasHotelPickup !== undefined) {
      where.PickupDetail = {
        some: {
          isHotelPickupAvailable: hasHotelPickup,
        },
      };
    }

    // Include relations for additional filtering and display
    const include = {
      TourismCompany: {
        select: {
          id: true,
          name: true,
          logoUrl: true,
          rating: true,
        },
      },
      PricingOption: {
        where: { isActive: true },
        orderBy: { amount: 'asc' as const },
      },
      Media: {
        where: { isPrimary: true },
        take: 1,
      },
      representativeCity: {
        include: {
          region: true,
        },
      },
      Schedule: true,
    } as const;

    // Fetch packages
    const [packages, total] = await Promise.all([
      this.prisma.touristPackage.findMany({
        where,
        include,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: this.buildOrderBy(sortBy, order),
      }),
      this.prisma.touristPackage.count({ where }),
    ]);

    // Post-filtering for price range (needs to be done after fetch due to relation)
    let filteredPackages = packages;

    if (
      minPrice !== undefined ||
      maxPrice !== undefined ||
      startDate ||
      endDate
    ) {
      filteredPackages = packages.filter((pkg) => {
        // Price filtering
        if (minPrice !== undefined || maxPrice !== undefined) {
          const pricingOptions = pkg.PricingOption.filter((po) => {
            if (currencyId && po.currencyId !== currencyId) return false;

            const amount = Number(po.amount);
            if (minPrice !== undefined && amount < minPrice) return false;
            if (maxPrice !== undefined && amount > maxPrice) return false;

            return true;
          });

          if (pricingOptions.length === 0) return false;
        }

        // Date filtering via schedules and pricing options validity
        if (startDate || endDate) {
          const start = startDate ? new Date(startDate) : null;
          const end = endDate ? new Date(endDate) : null;

          // Check if any pricing option is valid for the date range
          const hasValidPricing = pkg.PricingOption.some((po) => {
            if (!po.validFrom && !po.validTo) return true; // No date restrictions

            if (start && po.validTo && new Date(po.validTo) < start)
              return false;
            if (end && po.validFrom && new Date(po.validFrom) > end)
              return false;

            return true;
          });

          if (!hasValidPricing) return false;
        }

        return true;
      });
    }

    return {
      data: filteredPackages,
      meta: {
        total: filteredPackages.length,
        totalResults: total,
        page,
        limit,
        totalPages: Math.ceil(filteredPackages.length / limit),
        filters: {
          destination,
          cityId,
          regionId,
          startDate,
          endDate,
          travelers,
          type,
          difficulty,
          minPrice,
          maxPrice,
          currencyId,
        },
      },
    };
  }

  /**
   * Build orderBy clause for sorting
   * @param sortBy - Field to sort by
   * @param order - Sort direction
   */
  private buildOrderBy(
    sortBy: string,
    order: 'asc' | 'desc',
  ): Prisma.TouristPackageOrderByWithRelationInput {
    // Special handling for price sorting (requires relation)
    if (sortBy === 'price') {
      return {
        PricingOption: {
          _count: order,
        },
      };
    }

    // Default sorting by field
    return { [sortBy]: order };
  }
}
