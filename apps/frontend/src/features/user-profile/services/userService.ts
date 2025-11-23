import { UserProfile, UpdateProfileDto } from '@/types/user';

export const userService = {
  /**
   * Obtener el perfil completo del usuario actual
   * GET /api/users/me (Next.js API route que maneja las cookies)
   */
  async getProfile(): Promise<UserProfile> {
    const response = await fetch('/api/users/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: 'Error desconocido' }));
      throw new Error(error.message || 'Error al obtener el perfil');
    }

    return response.json();
  },

  /**
   * Actualizar el perfil del usuario
   * PATCH /api/users/me (Next.js API route que maneja las cookies)
   */
  async updateProfile(updates: UpdateProfileDto): Promise<UserProfile> {
    const response = await fetch('/api/users/me', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: 'Error desconocido' }));
      throw new Error(error.message || 'Error al actualizar el perfil');
    }

    return response.json();
  },
};
