'use client';

export interface TravelPackage {
  id: string;
  title: string;
  company: string;
  price: number;
  rating: number;
  image: string;
  location: string;
  description: string;
  badge?: 'Premium' | 'New';
}

interface PackageCardProps {
  package: TravelPackage;
}

export default function PackageCard({ package: pkg }: PackageCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {pkg.badge && (
          <span className={`
            absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white z-10
            ${pkg.badge === 'Premium' ? 'bg-red-500' : 'bg-green-500'}
          `}>
            {pkg.badge}
          </span>
        )}
        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2">
          {pkg.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3">
          {pkg.company}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">{pkg.rating}</span>
          </div>
          
          <span className="text-xl font-bold text-red-500">
            ${pkg.price}
          </span>
        </div>

        <button
          onClick={() => console.log('Ver detalles:', pkg.id)}
          className="w-full bg-pink-100 hover:bg-pink-200 text-pink-600 font-medium py-2.5 rounded-full transition-colors"
        >
          View Detail
        </button>
      </div>
    </div>
  );
}