import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/lib/apis';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const bookingData = await req.json();

    // Obtener el token de autenticación
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    // Enviar la reserva al backend
    const response = await api.post('/bookings', bookingData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

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
