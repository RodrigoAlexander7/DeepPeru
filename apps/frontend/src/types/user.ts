// Interfaces de perfil de usuario basadas en la respuesta del backend GET /users/me

export interface UserProfile {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  phone?: {
    id: number;
    phoneNumber: string;
    countryCode: string;
  };
  nationality?: {
    id: number;
    name: string;
    code: string;
  };
  preferredLanguage?: {
    id: number;
    name: string;
    code: string;
  };
  preferredCurrency?: {
    id: number;
    code: string;
    symbol: string;
    name: string;
  };
  picture?: string;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  phoneNumber?: string;
  countryCode?: string;
  nationalityId?: number;
  preferredLanguageId?: number;
  preferredCurrencyId?: number;
  picture?: string;
}
