import { api } from '@/lib/apis';
import {
  CreateTouristPackageDto,
  TouristPackage,
  City,
  Activity,
  Currency,
} from '@/types/package';

/**
 * Crea un nuevo paquete turístico
 */
export const createTouristPackage = async (
  data: CreateTouristPackageDto,
): Promise<TouristPackage> => {
  const response = await api.post('/tourist-packages', data);
  return response.data;
};

/**
 * Obtiene todos los paquetes turísticos de la empresa del usuario
 */
export const getTouristPackages = async (): Promise<TouristPackage[]> => {
  const response = await api.get('/tourist-packages');
  return response.data;
};

/**
 * Obtiene un paquete turístico por ID
 */
export const getTouristPackageById = async (
  id: number,
): Promise<TouristPackage> => {
  const response = await api.get(`/tourist-packages/${id}`);
  return response.data;
};

/**
 * Actualiza un paquete turístico
 */
export const updateTouristPackage = async (
  id: number,
  data: Partial<CreateTouristPackageDto>,
): Promise<TouristPackage> => {
  const response = await api.patch(`/tourist-packages/${id}`, data);
  return response.data;
};

/**
 * Obtiene todas las ciudades disponibles para selección
 */
export const getCities = async (): Promise<City[]> => {
  const response = await api.get('/cities');
  return response.data;
};

/**
 * Obtiene todas las actividades disponibles
 */
export const getActivities = async (): Promise<Activity[]> => {
  const response = await api.get('/activities');
  return response.data;
};

/**
 * Obtiene todas las monedas disponibles
 */
export const getCurrencies = async (): Promise<Currency[]> => {
  const response = await api.get('/currencies');
  return response.data;
};
