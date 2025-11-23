import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QueryBookingsDto } from './dto/query-bookings.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createBookingDto: CreateBookingDto) {
    const {
      packageId,
      pricingOptionId,
      travelDate,
      numberOfParticipants,
      currencyId,
    } = createBookingDto;

    const touristPackage = await this.prisma.touristPackage.findUnique({
      where: { id: packageId },
      include: { PricingOption: true },
    });

    if (!touristPackage) {
      throw new NotFoundException('Tourist package not found');
    }

    let pricePerPerson = new Decimal(0);
    let pricingOption: any = null;

    if (pricingOptionId) {
      pricingOption = touristPackage.PricingOption.find(
        (po) => po.id === pricingOptionId,
      );
      if (!pricingOption) {
        throw new NotFoundException('Pricing option not found');
      }
      pricePerPerson = pricingOption.amount;
    } else if (touristPackage.PricingOption.length > 0) {
      // Default to first option if not specified (simplified logic)
      pricingOption = touristPackage.PricingOption[0];
      pricePerPerson = pricingOption.amount;
    } else {
      throw new BadRequestException(
        'No pricing options available for this package',
      );
    }

    const totalAmount = pricePerPerson.mul(numberOfParticipants);
    const commissionPercentage = new Decimal(5.0);
    const commissionAmount = totalAmount.mul(commissionPercentage).div(100);
    const companyAmount = totalAmount.sub(commissionAmount);

    return this.prisma.booking.create({
      data: {
        userId,
        packageId,
        pricingOptionId: pricingOption?.id,
        travelDate: new Date(travelDate),
        numberOfParticipants,
        currencyId,
        totalAmount,
        commissionPercentage,
        commissionAmount,
        companyAmount,
        status: 'PENDING',
      },
    });
  }

  /**
   * Find all bookings for a specific user with filters and pagination
   * @param userId - User ID
   * @param queryDto - Query filters (status, upcoming, past, page, limit)
   * @returns Paginated bookings with related data
   */
  async findAllByUser(userId: string, queryDto: QueryBookingsDto) {
    const { status, upcoming, past, page = 1, limit = 10 } = queryDto;

    // Build where clause
    const where: any = { userId };

    // Filter by status if provided
    if (status) {
      where.status = status;
    }

    // Filter by date range
    const now = new Date();
    if (upcoming === true) {
      where.travelDate = { gte: now };
    } else if (past === true) {
      where.travelDate = { lt: now };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { travelDate: 'desc' },
        include: {
          TouristPackage: {
            include: {
              TourismCompany: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                  logoUrl: true,
                },
              },
              Media: {
                where: { type: 'IMAGE' },
                take: 1,
                orderBy: { order: 'asc' },
              },
            },
          },
          PricingOption: true,
          Currency: true,
        },
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data: bookings,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find a single booking by ID for a specific user
   * @param bookingId - Booking ID
   * @param userId - User ID
   * @returns Booking with complete related data
   * @throws NotFoundException if booking doesn't exist
   * @throws ForbiddenException if booking doesn't belong to user
   */
  async findOneByUser(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        TouristPackage: {
          include: {
            TourismCompany: {
              select: {
                id: true,
                name: true,
                legalName: true,
                email: true,
                phone: true,
                websiteUrl: true,
                logoUrl: true,
              },
            },
            Media: {
              orderBy: { order: 'asc' },
            },
            activities: {
              include: {
                Activity: {
                  include: {
                    Feature: true,
                    Schedule: true,
                  },
                },
              },
            },
            PricingOption: true,
            locations: {
              include: {
                City: {
                  include: {
                    region: {
                      include: {
                        country: true,
                      },
                    },
                  },
                },
              },
              orderBy: { order: 'asc' },
            },
          },
        },
        PricingOption: true,
        Currency: true,
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: {
              select: {
                number: true,
                country: {
                  select: {
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

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Validate ownership
    if (booking.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to view this booking',
      );
    }

    return booking;
  }
}
