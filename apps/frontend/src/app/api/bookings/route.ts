import { NextRequest, NextResponse } from 'next/server';
import { getAuthApi } from '@/lib/apiAuth';

export async function POST(req: NextRequest) {
  try {
    const bookingData = await req.json();

    const api = await getAuthApi();

    // Enviar la reserva al backend
    const response = await api.post('/bookings', bookingData);

    return NextResponse.json({
      success: true,
      bookingId: response.data.id,
      booking: response.data,
      message: 'Reserva creada exitosamente',
    });
  } catch (error: any) {
    console.error('Error creating booking:', error);

    return NextResponse.json(
      {
        message: error.response?.data?.message || 'Error al crear la reserva',
        error: error.message,
      },
      { status: error.response?.status || 500 },
    );
  }
}
