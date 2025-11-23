import { api } from '@/lib/apis';
import { UserProfile, UpdateProfileDto } from '@/types/user';

export const userService = {
  /**
   * Obtener el perfil completo del usuario actual
   * GET /users/me
   */
  async getProfile(): Promise<UserProfile> {
    const { data } = await api.get('/users/me');
    return data;
  },

  /**
   * Actualizar el perfil del usuario
   * PATCH /users/me
   */
  async updateProfile(updates: UpdateProfileDto): Promise<UserProfile> {
    const { data } = await api.patch('/users/me', updates);
    return data;
  },
};
