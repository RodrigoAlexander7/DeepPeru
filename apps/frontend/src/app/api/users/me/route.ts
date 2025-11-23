import { NextRequest, NextResponse } from 'next/server';
import { getAuthApi } from '@/lib/apiAuth';

/**
 * GET /api/users/me
 * Obtener el perfil del usuario autenticado
 */
export async function GET(request: NextRequest) {
  try {
    const api = await getAuthApi();

    const response = await api.get('/users/me');

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      {
        message: error.response?.data?.message || 'Error al obtener el perfil',
        error: error.message,
      },
      { status: error.response?.status || 500 },
    );
  }
}

/**
 * PATCH /api/users/me
 * Actualizar el perfil del usuario autenticado
 */
export async function PATCH(request: NextRequest) {
  try {
    const api = await getAuthApi();
    const body = await request.json();

    const response = await api.patch('/users/me', body);

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      {
        message:
          error.response?.data?.message || 'Error al actualizar el perfil',
        error: error.message,
      },
      { status: error.response?.status || 500 },
    );
  }
}
