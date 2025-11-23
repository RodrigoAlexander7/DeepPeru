import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  'http://127.0.0.1:3000';

export async function POST(req: NextRequest) {
  try {
    const bookingData = await req.json();

    // Obtener el token de autenticación
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    // Enviar la reserva al backend usando fetch
    const response = await fetch(`${BACKEND_URL}/bookings`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data.message || 'Error al crear la reserva',
          error: data.error,
        },
        { status: response.status },
      );
    }

    return NextResponse.json({
      success: true,
      bookingId: data.id,
      booking: data,
      message: 'Reserva creada exitosamente',
    });
  } catch (error: any) {
    console.error('Error creating booking:', error);

    return NextResponse.json(
      {
        message: 'Error al crear la reserva',
        error: error.message,
      },
      { status: 500 },
    );
  }
}
