//esta segun  la base de datos
// Parámetros de búsqueda
export interface SearchParams {
  destination?: string; // Location
  startDate?: string; // TouristPackage.StartDate
  endDate?: string; // TouristPackage.EndDate
  travelers?: number; // Número de personas
}

// Paquete Turístico (TouristPackage)
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
}

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

export interface PackageCard {
  id: string;
  title: string;
  company: string;
  price: number;
  location: string;
  description: string;
  startDate: string;
  endDate: string;
  image?: string;
  badge?: 'Premium' | 'New';
}
