import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import { PrismaService } from '@/prisma/prisma.service';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    companyAdmin: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    companyWorker: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserCompanies', () => {
    it('should return all companies where user is admin', async () => {
      const userId = 'user-123';
      const mockAdminCompanies = [
        {
          userId,
          company: [{ id: 1 }, { id: 2 }],
        },
      ];

      mockPrismaService.companyAdmin.findMany.mockResolvedValue(
        mockAdminCompanies,
      );
      mockPrismaService.companyWorker.findMany.mockResolvedValue([]);

      const result = await service.getUserCompanies(userId);

      expect(result).toEqual([1, 2]);
      expect(mockPrismaService.companyAdmin.findMany).toHaveBeenCalledWith({
        where: { userId },
        include: { company: true },
      });
    });

    it('should return all companies where user is worker', async () => {
      const userId = 'user-123';
      const mockWorkerCompanies = [{ companyId: 3 }, { companyId: 4 }];

      mockPrismaService.companyAdmin.findMany.mockResolvedValue([]);
      mockPrismaService.companyWorker.findMany.mockResolvedValue(
        mockWorkerCompanies,
      );

      const result = await service.getUserCompanies(userId);

      expect(result).toEqual([3, 4]);
      expect(mockPrismaService.companyWorker.findMany).toHaveBeenCalledWith({
        where: { userId, isActive: true },
        select: { companyId: true },
      });
    });

    it('should return unique company IDs when user is both admin and worker', async () => {
      const userId = 'user-123';

      mockPrismaService.companyAdmin.findMany.mockResolvedValue([
        { company: [{ id: 1 }, { id: 2 }] },
      ]);
      mockPrismaService.companyWorker.findMany.mockResolvedValue([
        { companyId: 2 }, // Duplicate
        { companyId: 3 },
      ]);

      const result = await service.getUserCompanies(userId);

      expect(result).toEqual([1, 2, 3]);
      expect(result.length).toBe(3); // Should have unique values
    });

    it('should return empty array when user has no companies', async () => {
      mockPrismaService.companyAdmin.findMany.mockResolvedValue([]);
      mockPrismaService.companyWorker.findMany.mockResolvedValue([]);

      const result = await service.getUserCompanies('user-without-companies');

      expect(result).toEqual([]);
    });
  });

  describe('isUserCompanyAdmin', () => {
    it('should return true when user is admin of the company', async () => {
      mockPrismaService.companyAdmin.findFirst.mockResolvedValue({
        id: 1,
        userId: 'user-123',
      });

      const result = await service.isUserCompanyAdmin('user-123', 1);

      expect(result).toBe(true);
      expect(mockPrismaService.companyAdmin.findFirst).toHaveBeenCalledWith({
        where: {
          userId: 'user-123',
          company: {
            some: {
              id: 1,
            },
          },
        },
      });
    });

    it('should return false when user is not admin of the company', async () => {
      mockPrismaService.companyAdmin.findFirst.mockResolvedValue(null);

      const result = await service.isUserCompanyAdmin('user-123', 1);

      expect(result).toBe(false);
    });
  });

  describe('getUserCompanyPermissions', () => {
    it('should return permissions for active worker', async () => {
      const mockWorker = {
        Permission: [
          { name: 'CREATE_PACKAGE' },
          { name: 'UPDATE_PACKAGE' },
          { name: 'DELETE_PACKAGE' },
        ],
      };

      mockPrismaService.companyWorker.findUnique.mockResolvedValue(mockWorker);

      const result = await service.getUserCompanyPermissions('user-123', 1);

      expect(result).toEqual([
        'CREATE_PACKAGE',
        'UPDATE_PACKAGE',
        'DELETE_PACKAGE',
      ]);
    });

    it('should return empty array when worker not found', async () => {
      mockPrismaService.companyWorker.findUnique.mockResolvedValue(null);

      const result = await service.getUserCompanyPermissions('user-123', 1);

      expect(result).toEqual([]);
    });

    it('should only query active workers', async () => {
      await service.getUserCompanyPermissions('user-123', 1);

      expect(mockPrismaService.companyWorker.findUnique).toHaveBeenCalledWith({
        where: {
          userId_companyId: {
            userId: 'user-123',
            companyId: 1,
          },
          isActive: true,
        },
        include: {
          Permission: {
            select: { name: true },
          },
        },
      });
    });
  });

  describe('verifyUserCompanyAccess', () => {
    it('should return true when user has access to company', async () => {
      mockPrismaService.companyAdmin.findMany.mockResolvedValue([
        { company: [{ id: 1 }] },
      ]);
      mockPrismaService.companyWorker.findMany.mockResolvedValue([]);

      const result = await service.verifyUserCompanyAccess('user-123', 1);

      expect(result).toBe(true);
    });

    it('should return false when user has no access to company', async () => {
      mockPrismaService.companyAdmin.findMany.mockResolvedValue([]);
      mockPrismaService.companyWorker.findMany.mockResolvedValue([]);

      const result = await service.verifyUserCompanyAccess('user-123', 999);

      expect(result).toBe(false);
    });
  });

  describe('hasPermission', () => {
    it('should return true for company admin regardless of permission', async () => {
      mockPrismaService.companyAdmin.findFirst.mockResolvedValue({
        id: 1,
        userId: 'user-123',
      });

      const result = await service.hasPermission(
        'user-123',
        1,
        'ANY_PERMISSION',
      );

      expect(result).toBe(true);
      // Should not check worker permissions for admins
      expect(mockPrismaService.companyWorker.findUnique).not.toHaveBeenCalled();
    });

    it('should return true when worker has the specific permission', async () => {
      mockPrismaService.companyAdmin.findFirst.mockResolvedValue(null);
      mockPrismaService.companyWorker.findUnique.mockResolvedValue({
        Permission: [{ name: 'CREATE_PACKAGE' }, { name: 'UPDATE_PACKAGE' }],
      });

      const result = await service.hasPermission(
        'user-123',
        1,
        'CREATE_PACKAGE',
      );

      expect(result).toBe(true);
    });

    it('should return false when worker does not have the permission', async () => {
      mockPrismaService.companyAdmin.findFirst.mockResolvedValue(null);
      mockPrismaService.companyWorker.findUnique.mockResolvedValue({
        Permission: [{ name: 'VIEW_PACKAGE' }],
      });

      const result = await service.hasPermission(
        'user-123',
        1,
        'DELETE_PACKAGE',
      );

      expect(result).toBe(false);
    });

    it('should return false when user is neither admin nor worker', async () => {
      mockPrismaService.companyAdmin.findFirst.mockResolvedValue(null);
      mockPrismaService.companyWorker.findUnique.mockResolvedValue(null);

      const result = await service.hasPermission(
        'user-123',
        1,
        'CREATE_PACKAGE',
      );

      expect(result).toBe(false);
    });
  });
});
