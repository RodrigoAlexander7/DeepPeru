import { api } from '@/lib/apis';
import type {
  CreateCompanyDto,
  Company,
  Language,
  Country,
} from '@/types/company';

/**
 * Crea una nueva empresa
 * La autenticación se maneja automáticamente mediante cookies HTTP-only
 * enviadas por axios con withCredentials: true
 */
export async function createCompany(data: CreateCompanyDto): Promise<Company> {
  const response = await api.post<Company>('/companies', data);
  return response.data;
}

/**
 * Obtiene las empresas del usuario autenticado
 */
export async function getUserCompanies(): Promise<Company[]> {
  const response = await api.get<Company[]>('/companies');
  return response.data;
}

/**
 * Obtiene una empresa por ID
 */
export async function getCompanyById(id: number): Promise<Company> {
  const response = await api.get<Company>(`/companies/${id}`);
  return response.data;
}

/**
 * Obtiene todos los idiomas disponibles
 */
export async function getLanguages(): Promise<Language[]> {
  const response = await api.get<Language[]>('/languages');
  return response.data;
}

/**
 * Obtiene todos los países disponibles
 */
export async function getCountries(): Promise<Country[]> {
  const response = await api.get<Country[]>('/countries');
  return response.data;
}
