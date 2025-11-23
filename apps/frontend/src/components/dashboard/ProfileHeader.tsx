'use client';

import { UserProfile } from '@/types/user';

interface ProfileHeaderProps {
  profile: UserProfile;
  onEditClick?: () => void;
}

export default function ProfileHeader({
  profile,
  onEditClick,
}: ProfileHeaderProps) {
  const getInitials = () => {
    if (profile.firstName && profile.lastName) {
      return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
    }
    return profile.email[0].toUpperCase();
  };

  const getFullName = () => {
    if (profile.firstName && profile.lastName) {
      return `${profile.firstName} ${profile.lastName}`;
    }
    return 'Usuario';
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md p-8 mb-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Avatar */}
        <div className="relative">
          {profile.picture ? (
            <img
              src={profile.picture}
              alt={getFullName()}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-700">
                {getInitials()}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-white mb-2">
            {getFullName()}
          </h1>
          <p className="text-blue-100 mb-1">{profile.email}</p>
          {profile.phone && (
            <p className="text-blue-100">
              {profile.phone.countryCode} {profile.phone.phoneNumber}
            </p>
          )}
          {profile.nationality && (
            <p className="text-blue-100 mt-2">📍 {profile.nationality.name}</p>
          )}
        </div>

        {/* Edit Button */}
        {onEditClick && (
          <button
            onClick={onEditClick}
            className="px-6 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors shadow-md"
          >
            Editar Perfil
          </button>
        )}
      </div>

      {/* Additional Info */}
      {(profile.preferredLanguage || profile.preferredCurrency) && (
        <div className="mt-6 pt-6 border-t border-blue-400 flex flex-wrap gap-4 text-white">
          {profile.preferredLanguage && (
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                />
              </svg>
              <span className="text-sm">
                Idioma: {profile.preferredLanguage.name}
              </span>
            </div>
          )}
          {profile.preferredCurrency && (
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm">
                Moneda: {profile.preferredCurrency.code}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
