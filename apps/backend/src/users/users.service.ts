import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        image: createUserDto.image || null,
        updatedAt: new Date(),
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        gender: true,
        documentNumber: true,
        passportNumber: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        phoneId: true,
        nationalityId: true,
        passportCountryId: true,
        languageId: true,
        currencyId: true,
        emergencyPhoneId: true,
        phone: {
          select: {
            id: true,
            number: true,
            countryId: true,
            country: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
        nationality: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        passportCountry: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        language: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        currency: {
          select: {
            id: true,
            code: true,
            symbol: true,
            name: true,
          },
        },
        emergencyPhone: {
          select: {
            id: true,
            number: true,
            country: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user as any;
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    // Build update data object with only provided fields
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (updateProfileDto.firstName !== undefined) {
      updateData.firstName = updateProfileDto.firstName;
    }
    if (updateProfileDto.lastName !== undefined) {
      updateData.lastName = updateProfileDto.lastName;
    }
    if (updateProfileDto.dateOfBirth !== undefined) {
      updateData.dateOfBirth = updateProfileDto.dateOfBirth
        ? new Date(updateProfileDto.dateOfBirth)
        : null;
    }
    if (updateProfileDto.gender !== undefined) {
      updateData.gender = updateProfileDto.gender;
    }
    if (updateProfileDto.documentNumber !== undefined) {
      updateData.documentNumber = updateProfileDto.documentNumber;
    }
    if (updateProfileDto.passportNumber !== undefined) {
      updateData.passportNumber = updateProfileDto.passportNumber;
    }
    if (updateProfileDto.nationalityId !== undefined) {
      updateData.nationalityId = updateProfileDto.nationalityId;
    }
    if (updateProfileDto.passportCountryId !== undefined) {
      updateData.passportCountryId = updateProfileDto.passportCountryId;
    }
    if (updateProfileDto.languageId !== undefined) {
      updateData.languageId = updateProfileDto.languageId;
    }
    if (updateProfileDto.currencyId !== undefined) {
      updateData.currencyId = updateProfileDto.currencyId;
    }

    // Update user
    await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // Return updated user with all relations
    return this.findOne(userId);
  }
}
