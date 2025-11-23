import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  'http://127.0.0.1:3000';

export async function GET(req: NextRequest) {
  try {
    // Obtener el token de autenticación
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    console.log('GET /api/bookings/me - Token exists:', !!token);

    if (!token) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    // Obtener los query params
    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();

    // Construir la URL del backend
    const backendUrl = `${BACKEND_URL}/bookings/me${queryString ? `?${queryString}` : ''}`;

    console.log('Fetching bookings from:', backendUrl);
    console.log('Query params:', queryString || 'none');

    // Enviar la solicitud al backend
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    console.log('Backend response status:', response.status);
    console.log('Backend response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data.message || 'Error al obtener las reservas',
          error: data.error,
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching bookings:', error);

    return NextResponse.json(
      {
        message: 'Error al obtener las reservas',
        error: error.message,
      },
      { status: 500 },
    );
  }
}
