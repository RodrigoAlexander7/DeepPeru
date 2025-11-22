import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'Juan Pérez',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'juan.perez@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Profile image URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  image?: string;
}
