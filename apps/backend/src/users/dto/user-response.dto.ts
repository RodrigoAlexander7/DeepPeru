import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: 'clxxx123456789',
  })
  id: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'juan.perez@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'Juan Pérez',
  })
  name: string;

  @ApiProperty({
    description: 'Profile image URL',
    example: 'https://example.com/avatar.jpg',
    nullable: true,
  })
  image: string | null;

  @ApiProperty({
    description: 'Date when the user was created',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the user was last updated',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
