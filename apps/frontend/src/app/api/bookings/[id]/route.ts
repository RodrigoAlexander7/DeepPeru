import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  'http://127.0.0.1:3000';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Obtener el token de autenticación
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    // Enviar la solicitud al backend
    const response = await fetch(`${BACKEND_URL}/bookings/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data.message || 'Error al obtener la reserva',
          error: data.error,
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching booking details:', error);

    return NextResponse.json(
      {
        message: 'Error al obtener los detalles de la reserva',
        error: error.message,
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Obtener el token de autenticación
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    // Enviar la solicitud al backend para cancelar
    const response = await fetch(`${BACKEND_URL}/bookings/${id}/cancel`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data.message || 'Error al cancelar la reserva',
          error: data.error,
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error canceling booking:', error);

    return NextResponse.json(
      {
        message: 'Error al cancelar la reserva',
        error: error.message,
      },
      { status: 500 },
    );
  }
}
