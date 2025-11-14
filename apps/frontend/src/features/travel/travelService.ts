import { api } from '@/lib/apis';
import { SearchParams } from '@/types/index';

export const travelService = {
  async getAllPackages(params?: {
    page?: number;
    limit?: number;
    type?: string;
  }) {
    const { data } = await api.get('/tourist-packages', { params });
    return data;
  },

  async getPackageById(id: number) {
    const { data } = await api.get(`/tourist-packages/${id}`);
    return data;
  },

  async createPackage(payload: any) {
    const { data } = await api.post('/tourist-packages', payload);
    return data;
  },

  async updatePackage(id: number, payload: any) {
    const { data } = await api.patch(`/tourist-packages/${id}`, payload);
    return data;
  },

  async deletePackage(id: number) {
    const { data } = await api.delete(`/tourist-packages/${id}`);
    return data;
  },

  async searchPackages(filters: SearchParams) {
    const { data } = await api.get('/tourist-packages/search', {
      params: filters,
    });
    return data;
  },
};
