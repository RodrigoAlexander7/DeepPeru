'use server';

import { api } from '@/lib/apis';
import { cookies } from 'next/headers';
import type {
  CreateCompanyDto,
  Company,
  Language,
  Country,
} from '@/types/company';

async function getAuthHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Crea una nueva empresa
 * La autenticación se maneja automáticamente mediante cookies HTTP-only
 * enviadas por axios con withCredentials: true
 */
export async function createCompany(data: CreateCompanyDto): Promise<Company> {
  const headers = await getAuthHeader();
  const response = await api.post<Company>('/companies', data, { headers });
  return response.data;
}

/**
 * Obtiene las empresas del usuario autenticado
 */
export async function getUserCompanies(): Promise<Company[]> {
  const headers = await getAuthHeader();
  const response = await api.get<Company[]>('/companies', { headers });
  return response.data;
}

/**
 * Obtiene una empresa por ID
 */
export async function getCompanyById(id: number): Promise<Company> {
  const headers = await getAuthHeader();
  const response = await api.get<Company>(`/companies/${id}`, { headers });
  return response.data;
}

/**
 * Obtiene todos los idiomas disponibles
 */
export async function getLanguages(): Promise<Language[]> {
  const headers = await getAuthHeader();
  // Este endpoint podría necesitar ajustarse según tu backend
  const response = await api.get<Language[]>('/languages', { headers });
  return response.data;
}

/**
 * Obtiene todos los países disponibles
 */
export async function getCountries(): Promise<Country[]> {
  const headers = await getAuthHeader();
  // Este endpoint podría necesitar ajustarse según tu backend
  const response = await api.get<Country[]>('/countries', { headers });
  return response.data;
}
