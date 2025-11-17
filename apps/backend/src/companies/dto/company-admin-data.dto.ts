import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsDateString,
  IsInt,
  Min,
  MinLength,
} from 'class-validator';

export class CompanyAdminDataDto {
  @ApiProperty({
    description: 'Admin email address',
    example: 'admin@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Admin phone number',
    example: '+51987654321',
  })
  @IsString()
  @MinLength(9)
  phone: string;

  @ApiProperty({
    description: 'Admin first name (as in legal document)',
    example: 'Juan Carlos',
  })
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({
    description: 'Admin last name (as in legal document)',
    example: 'García López',
  })
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty({
    description: 'Admin date of birth',
    example: '1985-03-15T00:00:00.000Z',
  })
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({
    description: 'Nationality country ID',
    example: 1,
  })
  @IsInt()
  @Min(1)
  nationalityId: number;

  @ApiProperty({
    description: 'Document number (DNI, passport, etc.)',
    example: '12345678',
  })
  @IsString()
  @MinLength(6)
  documentNumber: string;
}
