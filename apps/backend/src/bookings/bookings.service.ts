import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
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
}
