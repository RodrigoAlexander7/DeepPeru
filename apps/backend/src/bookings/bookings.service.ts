import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QueryBookingsDto } from './dto/query-bookings.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
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

  /**
   * Cancel a booking
   * @param bookingId - Booking ID
   * @param userId - User ID
   * @param cancelDto - Cancellation details
   * @returns Updated booking
   * @throws NotFoundException if booking doesn't exist
   * @throws ForbiddenException if booking doesn't belong to user
   * @throws ConflictException if booking cannot be cancelled
   */
  async cancelBooking(
    bookingId: string,
    userId: string,
    cancelDto: CancelBookingDto,
  ) {
    // Find booking with package details for policy validation
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        TouristPackage: {
          select: {
            id: true,
            name: true,
            cancellationPolicy: true,
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
        'You do not have permission to cancel this booking',
      );
    }

    // Validate booking status - can only cancel PENDING or CONFIRMED bookings
    if (booking.status === 'CANCELLED') {
      throw new ConflictException('Booking is already cancelled');
    }

    if (booking.status === 'COMPLETED') {
      throw new ConflictException('Cannot cancel a completed booking');
    }

    // Validate cancellation policy based on travel date
    const now = new Date();
    const travelDate = new Date(booking.travelDate);
    const hoursUntilTravel =
      (travelDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Check if cancellation is allowed based on policy
    // Parse cancellation policy from string (since it's stored as String in DB)
    const policyText = booking.TouristPackage?.cancellationPolicy || '';
    let canCancel = true;
    let refundPercentage = 0;
    let policyType = 'FLEXIBLE'; // default

    // Determine policy type from text (simplified logic)
    if (
      policyText.toLowerCase().includes('non-refundable') ||
      policyText.toLowerCase().includes('no refund')
    ) {
      policyType = 'NON_REFUNDABLE';
    } else if (
      policyText.toLowerCase().includes('strict') ||
      policyText.toLowerCase().includes('7 days')
    ) {
      policyType = 'STRICT';
    } else if (
      policyText.toLowerCase().includes('moderate') ||
      policyText.toLowerCase().includes('5 days')
    ) {
      policyType = 'MODERATE';
    } else if (
      policyText.toLowerCase().includes('flexible') ||
      policyText.toLowerCase().includes('24')
    ) {
      policyType = 'FLEXIBLE';
    }

    switch (policyType) {
      case 'FLEXIBLE':
        // Can cancel up to 24 hours before
        if (hoursUntilTravel < 24) {
          canCancel = false;
        } else {
          refundPercentage = 100;
        }
        break;

      case 'MODERATE':
        // Can cancel up to 5 days before
        if (hoursUntilTravel < 120) {
          // 5 days = 120 hours
          canCancel = false;
        } else if (hoursUntilTravel >= 120) {
          refundPercentage = 100;
        }
        break;

      case 'STRICT':
        // Can cancel up to 7 days before with 50% refund
        if (hoursUntilTravel < 168) {
          // 7 days = 168 hours
          canCancel = false;
        } else {
          refundPercentage = 50;
        }
        break;

      case 'NON_REFUNDABLE':
        canCancel = false;
        refundPercentage = 0;
        break;

      default:
        // Default to flexible
        canCancel = hoursUntilTravel >= 24;
        refundPercentage = canCancel ? 100 : 0;
    }

    if (!canCancel) {
      throw new ConflictException(
        `Cannot cancel booking. Cancellation policy (${policyType}) does not allow cancellation at this time.`,
      );
    }

    // Update booking status to CANCELLED
    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELLED',
      },
      include: {
        TouristPackage: {
          select: {
            id: true,
            name: true,
            TourismCompany: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        Currency: true,
      },
    });

    // TODO: If payment was approved, initiate refund process
    // This would involve calling Mercado Pago API to process refund
    if (booking.paymentStatus === 'APPROVED' && booking.paymentId) {
      // Log for now - implement actual refund later
      console.log(
        `Refund needed for booking ${bookingId}: ${refundPercentage}% of ${booking.totalAmount}`,
      );
      // TODO: Call Mercado Pago refund API
      // const refundAmount = booking.totalAmount * (refundPercentage / 100);
      // await this.processRefund(booking.paymentId, refundAmount);
    }

    return {
      ...updatedBooking,
      cancellationDetails: {
        cancelledAt: new Date(),
        reason: cancelDto.reason,
        refundPercentage,
        refundStatus: booking.paymentStatus === 'APPROVED' ? 'PENDING' : 'N/A',
      },
    };
  }
}
