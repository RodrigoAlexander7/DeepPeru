'use client';

import { useState } from 'react';
import { useProfile } from '@/features/user-profile/hooks/useProfile';
import { useUpdateProfile } from '@/features/user-profile/hooks/useUpdateProfile';
import { ProfileHeader, ProfileForm } from '@/components/dashboard';
import { UpdateProfileDto } from '@/types/user';

export default function ProfilePage() {
  const { profile, loading: loadingProfile, refresh } = useProfile();
  const { updateProfile, loading: updating } = useUpdateProfile();
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: UpdateProfileDto) => {
    try {
      setError(null);
      await updateProfile(data);
      await refresh();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el perfil');
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600">No se pudo cargar el perfil</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
        <p className="text-gray-600">
          Administra tu información personal y preferencias
        </p>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <svg
            className="w-5 h-5 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-green-800 font-medium">
            Perfil actualizado correctamente
          </p>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <svg
            className="w-5 h-5 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Profile Header */}
      <ProfileHeader profile={profile} />

      {/* Profile Form */}
      <ProfileForm
        initialData={profile}
        onSubmit={handleSubmit}
        loading={updating}
      />
    </div>
  );
}
