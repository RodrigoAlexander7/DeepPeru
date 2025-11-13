import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
} from 'class-validator';

/**
 * Media types enum
 */
export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
}

/**
 * DTO for creating media (images, videos) for a tourist package
 */
export class CreateMediaDto {
  @ApiProperty({
    description: 'Type of media',
    enum: MediaType,
    example: MediaType.IMAGE,
  })
  @IsNotEmpty()
  @IsEnum(MediaType)
  type: MediaType;

  @ApiProperty({
    description: 'URL to the media file',
    example: 'https://example.com/images/machu-picchu.jpg',
  })
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiPropertyOptional({
    description: 'Caption or description for the media',
    example: 'Machu Picchu at sunrise',
  })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiPropertyOptional({
    description: 'Display order',
    example: 1,
  })
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({
    description: 'Whether this is the primary/featured media',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
