//esta segun  la base de datos
// Parámetros de búsqueda
export interface SearchParams {
  destination?: string; // Location
  startDate?: string; // TouristPackage.StartDate
  endDate?: string; // TouristPackage.EndDate
  travelers?: number; // Número de personas
}

/* Paquete Turístico (TouristPackage)
export interface TouristPackage {
  TouristPackage_ID: string;
  Name: string;
  Description: string;
  Company_ID: string;
  Price: number;
  StartDate: string;
  EndDate: string;
  MinPeople: number;
  MaxPeople: number;
  YearMax: number;
  YearMin: number;

  // Relaciones
  Company?: Company;
  Location?: Location;
  Activities?: Activity[];
}*/

// Compañía (Company)
export interface Company {
  Company_ID: string;
  Company_name: string;
  RUC: string;
  Website_url?: string;
}

// Ubicación (Location)
export interface Location {
  Location_ID: string;
  Street: string;
  Postal_code: string;
  City: string;
  State: string;
  Country: string;
  Latitude?: number;
  Longitude?: number;
}

// Actividad (Activity)
export interface Activity {
  Activity_ID: string;
  Name: string;
  Description: string;
  Destination_ID: string;
  Duration: number;
  StartDate: string;
  EndDate: string;
}
//utilizando en paquetes populares(pag.tsx)
export interface PackageCard {
  id: number;
  title: string;
  company: string;
  price: number;
  perPerson?: boolean;
  location: string;
  description: string;
  startDate: string;
  endDate: string;
  image?: string;
  badge?: 'Premium' | 'New';
  rating: number;
}

export interface TouristPackage {
  id: number;
  companyId: number;
  name: string;
  description: string;
  duration: string;
  difficulty: 'EASY' | 'MODERATE' | 'CHALLENGING' | 'EXTREME';
  type: 'GROUP' | 'PRIVATE' | 'CUSTOM';
  rating: number;
  minAge: number | null;
  maxAge: number | null;
  minParticipants: number | null;
  maxParticipants: number | null;
  meetingPoint: string;
  meetingLatitude: number;
  meetingLongitude: number;
  includedItems: string[];
  excludedItems: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  // Relaciones
  TourismCompany: {
    id: number;
    name: string;
    logoUrl: string;
    rating: number;
  };
  representativeCity: {
    id: number;
    name: string;
    regionId: number;
    region: {
      id: number;
      name: string;
      stateId: number;
    };
  };
  PricingOption: Array<{
    id: number;
    packageId: number;
    name: string;
    description: string;
    basePrice: number;
    discountedPrice: number | null;
    currencyId: number;
    isActive: boolean;
  }>;
  Media: Array<{
    id: number;
    packageId: number;
    type: string;
    url: string;
    caption: string | null;
    displayOrder: number;
    isPrimary: boolean;
  }>;
  Schedule: Array<{
    id: number;
    packageId: number;
    startDate: string;
    endDate: string;
    availableSlots: number;
    isActive: boolean;
  }>;
}
