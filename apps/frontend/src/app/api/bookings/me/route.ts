import { NextRequest, NextResponse } from 'next/server';
import { getAuthApi } from '@/lib/apiAuth';

export async function GET(req: NextRequest) {
  try {
    const api = await getAuthApi();

    // Obtener los query params
    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();

    console.log('GET /api/bookings/me');
    console.log('Query params:', queryString || 'none');

    // Enviar la solicitud al backend
    const response = await api.get(
      `/bookings/me${queryString ? `?${queryString}` : ''}`,
    );

    console.log('Backend response status:', response.status);
    console.log(
      'Backend response data:',
      JSON.stringify(response.data, null, 2),
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching bookings:', error);

    return NextResponse.json(
      {
        message:
          error.response?.data?.message || 'Error al obtener las reservas',
        error: error.message,
      },
      { status: error.response?.status || 500 },
    );
  }
}
