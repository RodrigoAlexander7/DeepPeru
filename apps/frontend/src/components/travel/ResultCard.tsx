'use client';


interface ResultCardProps {
  package: TravelPackage;
}
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

export default function ResultCard({ package: pkg }: ResultCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* Image */}
      <div className="relative h-56">
        {/* Placeholder gradient - reemplazar con imagen real cuando conectes backend */}
        <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400" />
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-xl mb-2 line-clamp-2">
          {pkg.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4">
          {pkg.company}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-red-500">
            ${pkg.price}
          </span>
          
          <div className="flex items-center gap-1">
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold text-gray-700">{pkg.rating}</span>
          </div>
        </div>

        <button
          onClick={() => console.log('Reservar:', pkg.id)}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-full transition-colors"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}