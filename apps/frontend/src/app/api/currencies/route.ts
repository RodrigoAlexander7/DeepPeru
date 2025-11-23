import { NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  'http://127.0.0.1:3000';

export async function GET() {
  try {
    // Consultar el backend para obtener el mapa de currencies
    const response = await fetch(`${BACKEND_URL}/currencies/map`);

    if (!response.ok) {
      throw new Error('Failed to fetch currency map from backend');
    }

    const currencyMap = await response.json();

    return NextResponse.json(currencyMap);
  } catch (error: any) {
    console.error('Error getting currencies:', error);

    // Fallback: retornar valores por defecto si el backend falla
    return NextResponse.json({
      USD: 6,
      PEN: 7,
      BRL: 8,
      ARS: 9,
      CLP: 10,
    });
  }
}
