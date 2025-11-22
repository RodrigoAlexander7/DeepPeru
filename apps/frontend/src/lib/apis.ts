import axios from 'axios';

// Use environment variable or fallback to 127.0.0.1 to avoid IPv6 resolution issues
const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  'http://127.0.0.1:3000';

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
