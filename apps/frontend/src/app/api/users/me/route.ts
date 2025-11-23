import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

/**
 * GET /api/users/me
 * Obtener el perfil del usuario autenticado
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token');

    if (!accessToken) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    const response = await fetch(`${BACKEND_URL}/users/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: 'Error desconocido' }));
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { message: 'Error al obtener el perfil' },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/users/me
 * Actualizar el perfil del usuario autenticado
 */
export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token');

    if (!accessToken) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/users/me`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: 'Error desconocido' }));
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { message: 'Error al actualizar el perfil' },
      { status: 500 },
    );
  }
}
