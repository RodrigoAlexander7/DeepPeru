'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { api } from '@/lib/apis';

async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('access_token')?.value;
}

/**
 * Method to get the current user from the backend using the stored auth token.
 * El backend expone un endpoint protegido (GET /users/me) que
 * devuelve los datos del usuario basándose en el token JWT
 */
export async function getCurrentUser() {
  const token = await getAuthToken();
  if (!token) {
    return null;
  }

  try {
    const response = await api.get('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('access_token');
  redirect('/');
}
