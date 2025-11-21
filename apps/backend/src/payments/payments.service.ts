import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { PaymentRequestWithSplit } from './interfaces/payment-request.interface';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  private client: MercadoPagoConfig;

  constructor(private prisma: PrismaService) {
    this.client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
    });
  }

  async processPayment(createPaymentDto: CreatePaymentDto) {
    const { bookingId, token, paymentMethodId, installments, issuerId, payer } =
      createPaymentDto;

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status === 'CONFIRMED' || booking.status === 'COMPLETED') {
      throw new BadRequestException('Booking already paid');
    }

    // Fetch company details to get Mercado Pago Account ID
    const touristPackage = await this.prisma.touristPackage.findUnique({
      where: { id: booking.packageId },
      include: { TourismCompany: true },
    });

    if (!touristPackage || !touristPackage.TourismCompany) {
      throw new NotFoundException('Company not found for this booking');
    }

    const sellerAccountId = touristPackage.TourismCompany.mercadoPagoAccountId;
    const commissionAmount = Number(booking.commissionAmount);

    const payment = new Payment(this.client);

    try {
      const paymentBody: PaymentRequestWithSplit = {
        transaction_amount: Number(booking.totalAmount),
        token: token,
        description: `Booking #${booking.id}`,
        installments: installments,
        payment_method_id: paymentMethodId,
        issuer_id: Number(issuerId),
        payer: {
          email: payer.email,
          identification: {
            type: payer.identification.type,
            number: payer.identification.number,
          },
        },
      };

      // If seller has a connected account, configure split payment
      if (sellerAccountId) {
        paymentBody.application_fee = commissionAmount;
        paymentBody.transfer_data = {
          destination_account_id: sellerAccountId,
        };
      }

      const result = await payment.create({ body: paymentBody });

      if (result && result.status === 'approved') {
        await this.prisma.booking.update({
          where: { id: bookingId },
          data: {
            status: 'COMPLETED',
            paymentId: result.id?.toString(),
            paymentStatus: 'APPROVED',
          },
        });
        return { status: 'success', paymentId: result.id };
      } else {
        let statusEnum: PaymentStatus = PaymentStatus.PENDING;

        if (result && result.status) {
          const statusKey =
            result.status.toUpperCase() as keyof typeof PaymentStatus;
          if (
            Object.values(PaymentStatus).includes(statusKey as PaymentStatus)
          ) {
            statusEnum = PaymentStatus[statusKey];
          }
        }

        await this.prisma.booking.update({
          where: { id: bookingId },
          data: {
            paymentStatus: statusEnum,
          },
        });
        return { status: result?.status, detail: result?.status_detail };
      }
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Payment failed: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }
}
