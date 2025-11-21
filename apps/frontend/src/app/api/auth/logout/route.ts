import { NextResponse } from 'next/server';
import { logout } from '@/features/auth/actions/auth';

export async function POST() {
  try {
    await logout();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging out:', error);
    return NextResponse.json({ message: 'Error logging out' }, { status: 500 });
  }
}
