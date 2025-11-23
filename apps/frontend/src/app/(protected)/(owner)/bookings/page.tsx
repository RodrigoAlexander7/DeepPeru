'use client';

import { BookingsList } from '@/components/dashboard';

export default function BookingsPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Reservas</h1>
        <p className="text-gray-600">
          Administra y revisa todas tus reservas de paquetes turísticos
        </p>
      </div>

      {/* Lista de Reservas */}
      <BookingsList />
    </div>
  );
}
