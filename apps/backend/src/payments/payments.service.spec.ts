import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PrismaService } from '@/prisma/prisma.service';
import { AuthService } from '@/auth/auth.service';

describe('PaymentsService', () => {
  let service: PaymentsService;

  const mockPrismaService = {
    booking: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    payment: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    tourismCompany: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockAuthService = {
    getMercadoPagoTokens: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
