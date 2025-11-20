'use client';

interface BookingSummaryProps {
  packageData: {
    name: string;
    image: string;
    rating?: number;
    reviewCount?: number;
    provider?: string;
    description: string;
    date?: string;
    time?: string;
    travelers: number;
    cancellationPolicy?: string;
    price: number;
    currency: string;
  };
}

export default function BookingSummary({ packageData }: BookingSummaryProps) {
  const {
    name,
    image,
    rating = 4.9,
    reviewCount = 438,
    provider = 'Cusipota Viajes y Turismo',
    description,
    date,
    time,
    travelers,
    cancellationPolicy,
    price,
    currency,
  } = packageData;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
      {/* Header con imagen */}
      <div className="flex gap-4 mb-4">
        <img
          src={image || '/placeholder.jpg'}
          alt={name}
          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-1">
          <h2 className="font-bold text-gray-900 text-lg leading-tight mb-1">
            {name}
          </h2>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-gray-900">{rating}</span>
            <div className="flex text-[var(--primary)]">
              {'●●●●●'.split('').map((dot, i) => (
                <span key={i} className="text-xs">
                  {dot}
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-600">({reviewCount})</span>
          </div>

          {/* Provider */}
          <p className="text-sm text-gray-600">
            de <span className="underline cursor-pointer">{provider}</span>
          </p>
        </div>
      </div>

      {/* Descripción corta */}
      <p className="text-sm text-gray-700 mb-4 line-clamp-2">{description}</p>

      <hr className="my-4 border-gray-200" />

      {/* Detalles de la reserva */}
      <div className="space-y-3">
        {date && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Fecha</span>
            <span className="font-medium text-gray-900">{date}</span>
          </div>
        )}

        {time && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Hora</span>
            <span className="font-medium text-gray-900">{time}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Viajeros</span>
          <span className="font-medium text-gray-900">
            {travelers} {travelers === 1 ? 'adulto' : 'adultos'}
          </span>
        </div>
      </div>

      {/* Política de cancelación */}
      {cancellationPolicy && (
        <div className="mt-4 p-3  rounded-lg flex items-start gap-2">
          <svg
            className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm text-[var(--primary)]">{cancellationPolicy}</p>
        </div>
      )}

      <hr className="my-4 border-gray-200" />

      {/* Total */}
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-900">Total</span>
        <span className="text-2xl font-bold text-gray-900">
          {currency === 'PEN' ? 'S/' : '$'}
          {price.toLocaleString('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
    </div>
  );
}
