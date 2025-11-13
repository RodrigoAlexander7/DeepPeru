import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePricingOptionDto } from './create-pricing-option.dto';
import { CreateItineraryDto } from './create-itinerary.dto';
import { CreateMediaDto } from './create-media.dto';

//Enums
/**
 * Package type enum
 */
export enum PackageType {
  GROUP = 'GROUP',
  PRIVATE = 'PRIVATE',
  SELF_GUIDED = 'SELF_GUIDED',
}

/**
 * Difficulty level enum
 */
export enum DifficultyLevel {
  EASY = 'EASY',
  MODERATE = 'MODERATE',
  CHALLENGING = 'CHALLENGING',
  HARD = 'HARD',
}

/**
 * Cancellation policy type enum
 */
export enum CancellationPolicyType {
  FLEXIBLE = 'FLEXIBLE',
  MODERATE = 'MODERATE',
  STRICT = 'STRICT',
  NON_REFUNDABLE = 'NON_REFUNDABLE',
}

/**
 * Accessibility features enum
 */
export enum AccessibilityFeature {
  WHEELCHAIR_ACCESSIBLE = 'WHEELCHAIR_ACCESSIBLE',
  STROLLER_ACCESSIBLE = 'STROLLER_ACCESSIBLE',
  SERVICE_ANIMALS_ALLOWED = 'SERVICE_ANIMALS_ALLOWED',
  AUDIO_GUIDE_AVAILABLE = 'AUDIO_GUIDE_AVAILABLE',
  SIGN_LANGUAGE_AVAILABLE = 'SIGN_LANGUAGE_AVAILABLE',
}

export enum DayOfWeek {
  SUN = 'SUN',
  MON = 'MON',
  TUE = 'TUE',
  WED = 'WED',
  THU = 'THU',
  FRI = 'FRI',
  SAT = 'SAT',
}

// Classes

/**
 * DTO for creating a benefit
 */
export class CreateBenefitDto {
  @ApiPropertyOptional({
    description: 'Icon URL for the benefit',
    example: 'https://example.com/icons/wifi.svg',
  })
  @IsOptional()
  @IsString()
  iconUrl?: string;

  @ApiProperty({
    description: 'Benefit title',
    example: 'Free WiFi',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Benefit description',
    example: 'High-speed internet available throughout the tour',
  })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiPropertyOptional({
    description: 'Display order',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  order?: number;
}

/**
 * DTO for creating a feature
 */
export class CreateFeatureDto {
  @ApiPropertyOptional({
    description: 'Feature category',
    example: 'Transportation',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Icon URL for the feature',
    example: 'https://example.com/icons/bus.svg',
  })
  @IsOptional()
  @IsString()
  iconUrl?: string;

  @ApiProperty({
    description: 'Feature name',
    example: 'Air-conditioned bus',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Feature description',
    example: 'Modern bus with comfortable seating',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Display order',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  order?: number;
}

/**
 * DTO for creating a pickup detail
 */
export class CreatePickupDetailDto {
  @ApiPropertyOptional({
    description: 'Whether hotel pickup is available',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isHotelPickupAvailable?: boolean;

  @ApiPropertyOptional({
    description: 'Pickup radius in kilometers',
    example: 5.0,
  })
  @IsOptional()
  @IsNumber()
  pickupRadiusKm?: number;

  @ApiPropertyOptional({
    description: 'Description of pickup area',
    example: 'Hotels in downtown Cusco',
  })
  @IsOptional()
  @IsString()
  pickupAreaDescription?: string;

  @ApiPropertyOptional({
    description: 'Pickup start time',
    example: '07:00',
  })
  @IsOptional()
  @IsString()
  pickupStartTime?: string;

  @ApiPropertyOptional({
    description: 'Pickup end time',
    example: '08:00',
  })
  @IsOptional()
  @IsString()
  pickupEndTime?: string;

  @ApiPropertyOptional({
    description: 'Special instructions for pickup',
    example: 'Please wait in the hotel lobby',
  })
  @IsOptional()
  @IsString()
  instructions?: string;
}

/**
 * DTO for creating a schedule
 */
export class CreateScheduleDto {
  @ApiProperty({
    description: 'Timezone',
    example: 'America/Lima',
  })
  @IsNotEmpty()
  @IsString()
  timezone: string;

  @ApiProperty({
    description: 'Days of week when tour operates',
    example: ['MON', 'WED', 'FRI'],
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  daysOfWeek: DayOfWeek[];

  @ApiProperty({
    description: 'Start time',
    example: '09:00',
  })
  @IsNotEmpty()
  @IsString()
  startTime: string;

  @ApiPropertyOptional({
    description: 'End time',
    example: '17:00',
  })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiPropertyOptional({
    description: 'Additional notes',
    example: 'Subject to weather conditions',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

/**
 * DTO for creating a tourist package
 */
export class CreateTouristPackageDto {
  @ApiProperty({
    description: 'ID of the tourism company that owns this package',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  companyId: number;

  @ApiProperty({
    description: 'Package name',
    example: 'Machu Picchu Full Day Tour',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Package description',
    example: 'Experience the wonder of Machu Picchu with expert guides',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Duration (e.g., "3 days", "5 hours")',
    example: '1 day',
  })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({
    description: 'Package type',
    enum: PackageType,
    example: PackageType.GROUP,
    default: PackageType.GROUP,
  })
  @IsOptional()
  @IsEnum(PackageType)
  type?: PackageType;

  @ApiPropertyOptional({
    description: 'Difficulty level',
    enum: DifficultyLevel,
    example: DifficultyLevel.MODERATE,
  })
  @IsOptional()
  @IsEnum(DifficultyLevel)
  difficulty?: DifficultyLevel;

  @ApiPropertyOptional({
    description: 'Default language ID',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  languageId?: number;

  @ApiPropertyOptional({
    description: 'Minimum age requirement',
    example: 12,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minAge?: number;

  @ApiPropertyOptional({
    description: 'Maximum age requirement',
    example: 65,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxAge?: number;

  @ApiPropertyOptional({
    description: 'Minimum participants',
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  minParticipants?: number;

  @ApiPropertyOptional({
    description: 'Maximum participants',
    example: 15,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxParticipants?: number;

  @ApiPropertyOptional({
    description: 'Meeting point location',
    example: 'Plaza de Armas, Cusco',
  })
  @IsOptional()
  @IsString()
  meetingPoint?: string;

  @ApiPropertyOptional({
    description: 'Meeting point latitude',
    example: -13.5184,
  })
  @IsOptional()
  @IsNumber()
  meetingLatitude?: number;

  @ApiPropertyOptional({
    description: 'Meeting point longitude',
    example: -71.9785,
  })
  @IsOptional()
  @IsNumber()
  meetingLongitude?: number;

  @ApiPropertyOptional({
    description: 'End point location',
    example: 'Machu Picchu',
  })
  @IsOptional()
  @IsString()
  endPoint?: string;

  @ApiPropertyOptional({
    description: 'End point latitude',
    example: -13.1631,
  })
  @IsOptional()
  @IsNumber()
  endLatitude?: number;

  @ApiPropertyOptional({
    description: 'End point longitude',
    example: -72.545,
  })
  @IsOptional()
  @IsNumber()
  endLongitude?: number;

  @ApiPropertyOptional({
    description: 'Timezone',
    example: 'America/Lima',
  })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({
    description: 'Booking cutoff time',
    example: '24 hours',
  })
  @IsOptional()
  @IsString()
  bookingCutoff?: string;

  @ApiPropertyOptional({
    description: 'List of requirements',
    example: ['Valid passport', 'Good physical condition'],
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  requirements?: string[];

  @ApiPropertyOptional({
    description: 'Safety information',
    example: 'Wear comfortable shoes and bring sun protection',
  })
  @IsOptional()
  @IsString()
  safetyInfo?: string;

  @ApiPropertyOptional({
    description: 'Additional information',
    example: 'Vegetarian meal options available',
  })
  @IsOptional()
  @IsString()
  additionalInfo?: string;

  @ApiPropertyOptional({
    description: 'Cancellation policy description',
    example: 'Free cancellation up to 48 hours before',
  })
  @IsOptional()
  @IsString()
  cancellationPolicy?: string;

  @ApiPropertyOptional({
    description: 'Cancellation policy type',
    enum: CancellationPolicyType,
    example: CancellationPolicyType.MODERATE,
  })
  @IsOptional()
  @IsEnum(CancellationPolicyType)
  cancellationType?: CancellationPolicyType;

  @ApiPropertyOptional({
    description: 'Items included in the package',
    example: ['Transportation', 'Guide', 'Lunch'],
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  includedItems?: string[];

  @ApiPropertyOptional({
    description: 'Items excluded from the package',
    example: ['Entrance fees', 'Personal expenses'],
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  excludedItems?: string[];

  @ApiPropertyOptional({
    description: 'Accessibility features',
    enum: AccessibilityFeature,
    isArray: true,
    example: [AccessibilityFeature.WHEELCHAIR_ACCESSIBLE],
  })
  @IsOptional()
  @IsArray()
  accessibilityOptions?: AccessibilityFeature[];

  @ApiPropertyOptional({
    description: 'Pricing options for this package',
    type: [CreatePricingOptionDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePricingOptionDto)
  pricingOptions?: CreatePricingOptionDto[];

  @ApiPropertyOptional({
    description: 'Itinerary for this package',
    type: CreateItineraryDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateItineraryDto)
  itinerary?: CreateItineraryDto;

  @ApiPropertyOptional({
    description: 'Media (images, videos) for this package',
    type: [CreateMediaDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMediaDto)
  media?: CreateMediaDto[];

  @ApiPropertyOptional({
    description: 'Benefits of this package',
    type: [CreateBenefitDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBenefitDto)
  benefits?: CreateBenefitDto[];

  @ApiPropertyOptional({
    description: 'Features of this package',
    type: [CreateFeatureDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFeatureDto)
  features?: CreateFeatureDto[];

  @ApiPropertyOptional({
    description: 'Pickup details',
    type: CreatePickupDetailDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePickupDetailDto)
  pickupDetail?: CreatePickupDetailDto;

  @ApiPropertyOptional({
    description: 'Schedule information',
    type: [CreateScheduleDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateScheduleDto)
  schedules?: CreateScheduleDto[];
}
