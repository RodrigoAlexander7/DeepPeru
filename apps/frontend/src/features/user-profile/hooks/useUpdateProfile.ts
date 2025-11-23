import { useState } from 'react';
import { userService } from '../services/userService';
import { UpdateProfileDto, UserProfile } from '@/types/user';

export function useUpdateProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (
    updates: UpdateProfileDto,
  ): Promise<UserProfile> => {
    try {
      setLoading(true);
      setError(null);
      const result = await userService.updateProfile(updates);
      return result;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Error al actualizar el perfil';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProfile,
    loading,
    error,
    clearError: () => setError(null),
  };
}
