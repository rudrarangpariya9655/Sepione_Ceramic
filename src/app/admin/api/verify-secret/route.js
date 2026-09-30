import { NextResponse } from 'next/server';
import { authorizeAdmin } from '@/lib/admin-auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const denied = authorizeAdmin(body?.secret, { database: false });
    return denied || NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Bad request.' }, { status: 400 });
  }
}
