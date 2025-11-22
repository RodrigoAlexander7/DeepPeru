// Enums
export enum PackageType {
  GROUP = 'GROUP',
  PRIVATE = 'PRIVATE',
  SELF_GUIDED = 'SELF_GUIDED',
}

export enum DifficultyLevel {
  EASY = 'EASY',
  MODERATE = 'MODERATE',
  CHALLENGING = 'CHALLENGING',
  HARD = 'HARD',
}

export enum CancellationPolicyType {
  FLEXIBLE = 'FLEXIBLE',
  MODERATE = 'MODERATE',
  STRICT = 'STRICT',
  NON_REFUNDABLE = 'NON_REFUNDABLE',
}

export enum AccessibilityFeature {
  WHEELCHAIR_ACCESSIBLE = 'WHEELCHAIR_ACCESSIBLE',
  STROLLER_ACCESSIBLE = 'STROLLER_ACCESSIBLE',
  SERVICE_ANIMALS_ALLOWED = 'SERVICE_ANIMALS_ALLOWED',
  AUDIO_GUIDE_AVAILABLE = 'AUDIO_GUIDE_AVAILABLE',
  SIGN_LANGUAGE_AVAILABLE = 'SIGN_LANGUAGE_AVAILABLE',
  LARGE_PRINT_MATERIAL = 'LARGE_PRINT_MATERIAL',
  ASSISTIVE_LISTENING_SYSTEM = 'ASSISTIVE_LISTENING_SYSTEM',
  BRAILLE_MATERIAL = 'BRAILLE_MATERIAL',
  STEP_FREE_ACCESS = 'STEP_FREE_ACCESS',
  ELEVATOR_AVAILABLE = 'ELEVATOR_AVAILABLE',
  ACCESSIBLE_TOILET = 'ACCESSIBLE_TOILET',
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

// DTOs
export interface CreatePricingOptionDto {
  name: string;
  description?: string;
  currencyId: number;
  amount: number;
  perPerson: boolean;
  minParticipants?: number;
  maxParticipants?: number;
  validFrom?: string;
  validTo?: string;
}

export interface CreateBenefitDto {
  iconUrl?: string;
  title: string;
  text?: string;
  order?: number;
}

export interface CreatePickupDetailDto {
  isHotelPickupAvailable: boolean;
  pickupRadiusKm?: number;
  pickupStartTime?: string;
  pickupEndTime?: string;
  instructions?: string;
}

export interface CreateFeatureDto {
  category?: string;
  iconUrl?: string;
  name: string;
  description?: string;
  order?: number;
}

export interface CreateScheduleDto {
  timezone: string;
  daysOfWeek: DayOfWeek[];
  startTime: string;
  endTime?: string;
  notes?: string;
}

export interface CreateActivityDto {
  activityId?: number; // Si existe, usar actividad existente
  name?: string; // Si es nueva actividad
  description?: string;
  destinationCityId?: number;
  startDate: string;
  endDate: string;
  schedules?: CreateScheduleDto[];
  features?: CreateFeatureDto[];
}

export interface CreateItineraryItemDto {
  dayNumber: number;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  order: number;
}

export interface CreateItineraryDto {
  title: string;
  days: number;
  items: CreateItineraryItemDto[];
}

export interface CreateTouristPackageDto {
  companyId: number;
  name: string;
  description?: string;
  duration?: string;
  type: PackageType;
  difficulty?: DifficultyLevel;
  languageId?: number;
  minAge?: number;
  maxAge?: number;
  minParticipants?: number;
  maxParticipants?: number;
  meetingPoint?: string;
  meetingLatitude?: number;
  meetingLongitude?: number;
  endPoint?: string;
  endLatitude?: number;
  endLongitude?: number;
  timezone?: string;
  bookingCutoff?: string;
  requirements?: string[];
  safetyInfo?: string;
  additionalInfo?: string;
  cancellationPolicy?: string;
  includedItems?: string[];
  excludedItems?: string[];
  accessibilityOptions?: AccessibilityFeature[];
  representativeCityId?: number;
  pricingOptions?: CreatePricingOptionDto[];
  itinerary?: CreateItineraryDto;
  benefits?: CreateBenefitDto[];
  pickupDetail?: CreatePickupDetailDto;
  activities?: CreateActivityDto[];
}

// Response types
export interface TouristPackage {
  id: number;
  companyId: number;
  name: string;
  description?: string;
  duration?: string;
  type: PackageType;
  difficulty?: DifficultyLevel;
  languageId?: number;
  rating?: number;
  isActive: boolean;
  minAge?: number;
  maxAge?: number;
  minParticipants?: number;
  maxParticipants?: number;
  meetingPoint?: string;
  meetingLatitude?: number;
  meetingLongitude?: number;
  endPoint?: string;
  endLatitude?: number;
  endLongitude?: number;
  timezone?: string;
  bookingCutoff?: string;
  requirements?: string[];
  safetyInfo?: string;
  additionalInfo?: string;
  cancellationPolicy?: string;
  includedItems?: string[];
  excludedItems?: string[];
  accessibilityOptions?: AccessibilityFeature[];
  createdAt: string;
  updatedAt: string;
}

export interface City {
  id: number;
  name: string;
  regionId: number;
}

export interface Activity {
  id: number;
  name: string;
  description?: string;
  destinationCityId: number;
}

export interface Currency {
  id: number;
  name: string;
  code: string;
  symbol?: string;
}
