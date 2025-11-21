import { api } from '@/lib/apis';
import type {
  CreateCompanyDto,
  Company,
  Language,
  Country,
} from '@/types/company';

/**
 * Obtiene el token de autenticación desde las cookies
 */
async function getAuthHeaders() {
  // En el cliente, necesitamos obtener el token de las cookies
  // Como estamos en el cliente, usamos document.cookie
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('access_token='))
    ?.split('=')[1];

  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Crea una nueva empresa
 */
export async function createCompany(data: CreateCompanyDto): Promise<Company> {
  const headers = await getAuthHeaders();
  const response = await api.post<Company>('/companies', data, { headers });
  return response.data;
}

/**
 * Obtiene las empresas del usuario autenticado
 */
export async function getUserCompanies(): Promise<Company[]> {
  const headers = await getAuthHeaders();
  const response = await api.get<Company[]>('/companies', { headers });
  return response.data;
}

/**
 * Obtiene una empresa por ID
 */
export async function getCompanyById(id: number): Promise<Company> {
  const headers = await getAuthHeaders();
  const response = await api.get<Company>(`/companies/${id}`, { headers });
  return response.data;
}

/**
 * Obtiene todos los idiomas disponibles
 */
export async function getLanguages(): Promise<Language[]> {
  // Este endpoint podría necesitar ajustarse según tu backend
  const response = await api.get<Language[]>('/languages');
  return response.data;
}

/**
 * Obtiene todos los países disponibles
 */
export async function getCountries(): Promise<Country[]> {
  // Este endpoint podría necesitar ajustarse según tu backend
  const response = await api.get<Country[]>('/countries');
  return response.data;
}
