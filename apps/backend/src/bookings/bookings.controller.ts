import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Param,
  Patch,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QueryBookingsDto } from './dto/query-bookings.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/auth/interfaces/authenticated-user.interface';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all bookings for the authenticated user',
    description:
      'Retrieves a paginated list of bookings for the current user with optional filters for status, upcoming, and past bookings.',
  })
  @ApiResponse({
    status: 200,
    description: 'Bookings retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              userId: { type: 'string' },
              packageId: { type: 'number' },
              pricingOptionId: { type: 'number', nullable: true },
              paymentId: { type: 'string', nullable: true },
              paymentStatus: { type: 'string' },
              currencyId: { type: 'number' },
              totalAmount: { type: 'number' },
              commissionPercentage: { type: 'number' },
              commissionAmount: { type: 'number' },
              companyAmount: { type: 'number' },
              bookingDate: { type: 'string', format: 'date-time' },
              travelDate: { type: 'string', format: 'date-time' },
              numberOfParticipants: { type: 'number' },
              status: { type: 'string' },
              TouristPackage: { type: 'object' },
              PricingOption: { type: 'object', nullable: true },
              Currency: { type: 'object' },
            },
          },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  findMyBookings(
    @CurrentUser() user: AuthenticatedUser,
    @Query() queryDto: QueryBookingsDto,
  ) {
    return this.bookingsService.findAllByUser(user.userId, queryDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Booking ID',
    example: 'clxyz123abc',
  })
  @ApiOperation({
    summary: 'Get a single booking by ID',
    description:
      'Retrieves complete details of a specific booking including tourist package, company, activities, and user information. Only returns bookings that belong to the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        userId: { type: 'string' },
        packageId: { type: 'number' },
        pricingOptionId: { type: 'number', nullable: true },
        paymentId: { type: 'string', nullable: true },
        paymentStatus: {
          type: 'string',
          enum: [
            'PENDING',
            'APPROVED',
            'AUTHORIZED',
            'IN_PROCESS',
            'IN_MEDIATION',
            'REJECTED',
            'CANCELLED',
            'REFUNDED',
            'CHARGED_BACK',
          ],
        },
        currencyId: { type: 'number' },
        totalAmount: { type: 'number' },
        commissionPercentage: { type: 'number' },
        commissionAmount: { type: 'number' },
        companyAmount: { type: 'number' },
        bookingDate: { type: 'string', format: 'date-time' },
        travelDate: { type: 'string', format: 'date-time' },
        numberOfParticipants: { type: 'number' },
        status: {
          type: 'string',
          enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
        },
        TouristPackage: {
          type: 'object',
          description:
            'Complete tourist package details with company and activities',
        },
        PricingOption: {
          type: 'object',
          nullable: true,
          description: 'Selected pricing option',
        },
        Currency: {
          type: 'object',
          description: 'Currency information',
        },
        User: {
          type: 'object',
          description: 'User information',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Booking does not belong to user',
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.bookingsService.findOneByUser(id, user.userId);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Booking ID to cancel',
    example: 'clxyz123abc',
  })
  @ApiOperation({
    summary: 'Cancel a booking',
    description:
      'Cancels a booking based on the cancellation policy. Validates that the booking belongs to the authenticated user and that it can be cancelled according to the policy type and time remaining until travel date. Initiates refund process if payment was already processed.',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking cancelled successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        status: { type: 'string', example: 'CANCELLED' },
        TouristPackage: { type: 'object' },
        Currency: { type: 'object' },
        cancellationDetails: {
          type: 'object',
          properties: {
            cancelledAt: { type: 'string', format: 'date-time' },
            reason: { type: 'string', nullable: true },
            refundPercentage: { type: 'number', example: 100 },
            refundStatus: {
              type: 'string',
              enum: ['PENDING', 'N/A'],
              description: 'PENDING if payment was approved, N/A otherwise',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Booking does not belong to user',
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found',
  })
  @ApiResponse({
    status: 409,
    description:
      'Conflict - Booking is already cancelled, completed, or cannot be cancelled due to policy',
  })
  cancelBooking(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() cancelDto: CancelBookingDto,
  ) {
    return this.bookingsService.cancelBooking(id, user.userId, cancelDto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    return this.bookingsService.create(user.userId, createBookingDto);
  }
}
