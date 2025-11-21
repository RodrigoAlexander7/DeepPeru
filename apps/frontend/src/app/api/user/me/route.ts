import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/features/auth/actions/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 },
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in /api/user/me:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
