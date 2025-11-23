import { NextRequest, NextResponse } from 'next/server';
import { getAuthApi } from '@/lib/apiAuth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const api = await getAuthApi();

    // Enviar la solicitud al backend
    const response = await api.get(`/bookings/${id}`);

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching booking details:', error);

    return NextResponse.json(
      {
        message:
          error.response?.data?.message ||
          'Error al obtener los detalles de la reserva',
        error: error.message,
      },
      { status: error.response?.status || 500 },
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
    const api = await getAuthApi();

    // Enviar la solicitud al backend para cancelar
    const response = await api.patch(`/bookings/${id}/cancel`, body);

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error canceling booking:', error);

    return NextResponse.json(
      {
        message:
          error.response?.data?.message || 'Error al cancelar la reserva',
        error: error.message,
      },
      { status: error.response?.status || 500 },
    );
  }
}
