import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { checkPassword, createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const password = String(body?.password || '');

  if (!password) {
    return NextResponse.json({ error: 'كلمة المرور مطلوبة' }, { status: 400 });
  }

  // تأخير صغير ضد brute-force
  await new Promise((r) => setTimeout(r, 200));

  if (!checkPassword(password)) {
    return NextResponse.json({ error: 'كلمة مرور خاطئة' }, { status: 401 });
  }

  const token = createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });

  return NextResponse.json({ ok: true });
}
