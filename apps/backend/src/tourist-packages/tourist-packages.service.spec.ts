import { Test, TestingModule } from '@nestjs/testing';
import { TouristPackagesService } from './tourist-packages.service';
import { PrismaService } from '@/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('TouristPackagesService', () => {
  let service: TouristPackagesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    touristPackage: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TouristPackagesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TouristPackagesService>(TouristPackagesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a tourist package with basic info', async () => {
      const createDto = {
        companyId: 1,
        name: 'Machu Picchu Adventure',
        description: 'Amazing tour',
        type: 'GROUP' as const,
        difficulty: 'MODERATE' as const,
      };

      const expectedResult = {
        id: 1,
        ...createDto,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.touristPackage.create.mockResolvedValue(expectedResult);

      const result = await service.create(createDto);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(mockPrismaService.touristPackage.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: createDto.name,
            companyId: createDto.companyId,
          }),
        }),
      );
    });

    it('should create a package with pricing options', async () => {
      const createDto = {
        companyId: 1,
        name: 'Test Package',
        pricingOptions: [
          {
            name: 'Standard',
            amount: 150.0,
            currencyId: 1,
            perPerson: true,
          },
        ],
      };

      const expectedResult = {
        id: 1,
        name: createDto.name,
        PricingOption: createDto.pricingOptions,
      };

      mockPrismaService.touristPackage.create.mockResolvedValue(expectedResult);

      const result = await service.create(createDto);

      expect(result).toBeDefined();
      expect(mockPrismaService.touristPackage.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            PricingOption: {
              create: createDto.pricingOptions,
            },
          }),
        }),
      );
    });

    it('should create a package with itinerary', async () => {
      const createDto = {
        companyId: 1,
        name: 'Test Package',
        itinerary: {
          title: '3 Day Tour',
          days: 3,
          items: [
            {
              dayNumber: 1,
              title: 'Day 1',
              description: 'Arrival',
            },
          ],
        },
      };

      mockPrismaService.touristPackage.create.mockResolvedValue({
        id: 1,
        name: createDto.name,
        Itinerary: [createDto.itinerary],
      });

      await service.create(createDto);

      expect(mockPrismaService.touristPackage.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            Itinerary: {
              create: expect.objectContaining({
                title: '3 Day Tour',
                days: 3,
                ItineraryItem: {
                  create: createDto.itinerary.items,
                },
              }),
            },
          }),
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated tourist packages', async () => {
      const mockPackages = [
        { id: 1, name: 'Package 1', isActive: true },
        { id: 2, name: 'Package 2', isActive: true },
      ];

      mockPrismaService.touristPackage.findMany.mockResolvedValue(mockPackages);
      mockPrismaService.touristPackage.count.mockResolvedValue(2);

      const result = await service.findAll({
        page: 1,
        limit: 10,
      });

      expect(result.data).toEqual(mockPackages);
      expect(result.meta).toEqual({
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should filter packages by companyId', async () => {
      const companyId = 1;
      mockPrismaService.touristPackage.findMany.mockResolvedValue([]);
      mockPrismaService.touristPackage.count.mockResolvedValue(0);

      await service.findAll({ companyId });

      expect(mockPrismaService.touristPackage.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ companyId }),
        }),
      );
    });

    it('should filter packages by type', async () => {
      const type = 'GROUP';
      mockPrismaService.touristPackage.findMany.mockResolvedValue([]);
      mockPrismaService.touristPackage.count.mockResolvedValue(0);

      await service.findAll({ type: type as any });

      expect(mockPrismaService.touristPackage.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ type }),
        }),
      );
    });

    it('should filter packages by difficulty', async () => {
      const difficulty = 'MODERATE';
      mockPrismaService.touristPackage.findMany.mockResolvedValue([]);
      mockPrismaService.touristPackage.count.mockResolvedValue(0);

      await service.findAll({ difficulty: difficulty as any });

      expect(mockPrismaService.touristPackage.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ difficulty }),
        }),
      );
    });

    it('should apply pagination correctly', async () => {
      mockPrismaService.touristPackage.findMany.mockResolvedValue([]);
      mockPrismaService.touristPackage.count.mockResolvedValue(0);

      await service.findAll({ page: 2, limit: 5 });

      expect(mockPrismaService.touristPackage.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 5, // (page - 1) * limit = (2-1) * 5
          take: 5,
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a single tourist package with all relations', async () => {
      const mockPackage = {
        id: 1,
        name: 'Test Package',
        TourismCompany: { id: 1, name: 'Test Company' },
        PricingOption: [],
        Media: [],
        Benefit: [],
        Feature: [],
        Itinerary: [],
      };

      mockPrismaService.touristPackage.findUnique.mockResolvedValue(
        mockPackage,
      );

      const result = await service.findOne(1);

      expect(result).toEqual(mockPackage);
      expect(mockPrismaService.touristPackage.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
          include: expect.any(Object),
        }),
      );
    });

    it('should throw NotFoundException when package does not exist', async () => {
      mockPrismaService.touristPackage.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Tourist package with ID 999 not found',
      );
    });
  });

  describe('update', () => {
    it('should update a tourist package', async () => {
      const existingPackage = {
        id: 1,
        name: 'Old Name',
        isActive: true,
      };

      const updateDto = {
        name: 'New Name',
        description: 'Updated description',
      };

      mockPrismaService.touristPackage.findUnique.mockResolvedValue(
        existingPackage,
      );
      mockPrismaService.touristPackage.update.mockResolvedValue({
        ...existingPackage,
        ...updateDto,
      });

      const result = await service.update(1, updateDto);

      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(mockPrismaService.touristPackage.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
          data: expect.objectContaining({
            name: 'New Name',
            description: 'Updated description',
          }),
        }),
      );
    });

    it('should throw NotFoundException when updating non-existent package', async () => {
      mockPrismaService.touristPackage.findUnique.mockResolvedValue(null);

      await expect(service.update(999, { name: 'Test' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should soft delete a package by setting isActive to false', async () => {
      const mockPackage = {
        id: 1,
        name: 'Test Package',
        isActive: true,
      };

      mockPrismaService.touristPackage.findUnique.mockResolvedValue(
        mockPackage,
      );
      mockPrismaService.touristPackage.update.mockResolvedValue({
        ...mockPackage,
        isActive: false,
      });

      const result = await service.remove(1);

      expect(result.isActive).toBe(false);
      expect(mockPrismaService.touristPackage.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
          data: expect.objectContaining({
            isActive: false,
          }),
        }),
      );
    });

    it('should throw NotFoundException when deleting non-existent package', async () => {
      mockPrismaService.touristPackage.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPackageCompanyId', () => {
    it('should return the company ID of a package', async () => {
      mockPrismaService.touristPackage.findUnique.mockResolvedValue({
        companyId: 5,
      });

      const result = await service.getPackageCompanyId(1);

      expect(result).toBe(5);
      expect(mockPrismaService.touristPackage.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
          select: { companyId: true },
        }),
      );
    });

    it('should throw NotFoundException when package does not exist', async () => {
      mockPrismaService.touristPackage.findUnique.mockResolvedValue(null);

      await expect(service.getPackageCompanyId(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
