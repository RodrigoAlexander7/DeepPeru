'use client';

import { PackageCard as PackageCardType } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface PackageCardProps {
  package: PackageCardType;
}

export default function PackageCard({ package: pkg }: PackageCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {pkg.image ? (
          <img
            src={pkg.image}
            alt={pkg.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300" />
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2">
          {pkg.title}
        </h3>

        {/* Company */}
        <p className="text-sm text-gray-600 mb-2">{pkg.company}</p>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="line-clamp-1">{pkg.location}</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-red-500">${pkg.price}</span>
        </div>

        {/* Button */}
        {/* Action Button */}
        <button
          onClick={() => {
            setLoading(true);
            router.push(`/package/${pkg.id}`);
          }}
          disabled={loading}
          className={`w-full font-medium py-3 rounded-full transition-colors flex items-center justify-center
            ${loading ? 'bg-gray-300 text-gray-600' : 'bg-red-500 hover:bg-red-600 text-white'}
          `}
        >
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            'Ver detalles'
          )}
        </button>
      </div>
    </div>
  );
}
