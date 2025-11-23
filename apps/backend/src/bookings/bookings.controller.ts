import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QueryBookingsDto } from './dto/query-bookings.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/auth/interfaces/authenticated-user.interface';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
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
