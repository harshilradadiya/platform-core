import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get('secret');
  const path = searchParams.get('path');

  const REVALIDATE_SECRET = process.env.REVALIDATION_TOKEN || 'mediaflow-secure-token-2026';

  if (secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid revalidation token' }, { status: 401 });
  }

  if (!path) {
    return NextResponse.json({ message: 'Missing path query parameter' }, { status: 400 });
  }

  try {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, path, timestamp: new Date().toISOString() });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ message: 'Revalidation failed', error: errorMsg }, { status: 500 });
  }
}
