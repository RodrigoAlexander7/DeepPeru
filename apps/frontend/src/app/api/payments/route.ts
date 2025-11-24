import { NextRequest, NextResponse } from 'next/server';
import { getAuthApi } from '@/lib/apiAuth';

export async function POST(req: NextRequest) {
  try {
    const paymentData = await req.json();

    const api = await getAuthApi();

    const response = await api.post('/payments', paymentData);

    return NextResponse.json({
      success: true,
      payment: response.data,
      status: response.data.status,
      paymentId: response.data.paymentId,
      message: 'Pago procesado exitosamente',
    });
  } catch (error: any) {
    console.error('Error processing payment:', error);

    return NextResponse.json(
      {
        message: error.response?.data?.message || 'Error al procesar el pago',
        error: error.message,
        status: 'error',
      },
      { status: error.response?.status || 500 },
    );
  }
}
