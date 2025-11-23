import axios from 'axios';
import { cookies } from 'next/headers';

const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  'http://127.0.0.1:3000';

// Cliente por request con token
export async function getAuthApi() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  return axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
}
