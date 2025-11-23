'use client';

import { useParams, useRouter } from 'next/navigation';
import { BookingDetails } from '@/components/dashboard';

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string; // Es un CUID string, no un número

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-600">
        <button
          onClick={() => router.push('/dashboard')}
          className="hover:text-[var(--primary)] transition-colors"
        >
          Dashboard
        </button>
        <span>{'>'}</span>
        <button
          onClick={() => router.push('/bookings')}
          className="hover:text-[var(--primary)] transition-colors"
        >
          Mis Reservas
        </button>
        <span>{'>'}</span>
        <span className="text-gray-900 font-medium">Detalles de Reserva</span>
      </nav>

      {/* Detalles */}
      <BookingDetails bookingId={bookingId} />
    </div>
  );
}
