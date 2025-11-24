import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { PaymentRequestWithSplit } from './interfaces/payment-request.interface';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

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

    const touristPackage = await this.prisma.touristPackage.findUnique({
      where: { id: booking.packageId },
      include: { TourismCompany: true },
    });

    if (!touristPackage || !touristPackage.TourismCompany) {
      throw new NotFoundException('Company not found for this booking');
    }

    const company = touristPackage.TourismCompany;

    if (!company.mercadoPagoAccessToken) {
      throw new BadRequestException(
        'Company has not connected their MercadoPago account',
      );
    }

    const accessToken = await this.authService.refreshMercadoPagoToken(
      company.id,
    );

    const client = new MercadoPagoConfig({
      accessToken: accessToken,
    });

    const commissionAmount = Number(booking.commissionAmount);
    const companyAmount = Number(booking.companyAmount);
    const payment = new Payment(client);

    try {
      const paymentBody: PaymentRequestWithSplit = {
        transaction_amount: Number(booking.totalAmount),
        token: token,
        description: `Booking #${booking.id} - ${touristPackage.name}`,
        installments: installments,
        payment_method_id: paymentMethodId,
        payer: {
          email: payer.email,
          identification: {
            type: payer.identification.type,
            number: payer.identification.number,
          },
        },
        metadata: {
          booking_id: booking.id,
          company_id: company.id,
          commission_amount: commissionAmount,
          company_amount: companyAmount,
        },
      };

      if (issuerId && issuerId !== '') {
        const issuerNumber = Number(issuerId);
        if (!isNaN(issuerNumber) && issuerNumber > 0) {
          paymentBody.issuer_id = issuerNumber;
        }
      }

      console.log('Payment body:', JSON.stringify(paymentBody, null, 2));

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
      console.error('Payment error:', error);
      throw new BadRequestException(
        'Payment failed: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }
}
