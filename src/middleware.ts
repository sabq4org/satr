import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'satr_session';

// نتحقق فقط من وجود cookie موقّع — التحقق الكامل في الصفحات
function quickVerify(token: string | undefined): boolean {
  if (!token) return false;
  const [issued, sig] = token.split('.');
  return Boolean(issued && sig && /^\d+$/.test(issued) && /^[a-f0-9]{64}$/.test(sig));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // تخطّي صفحة تسجيل الدخول و API الـ login
  if (pathname.startsWith('/admin/login') || pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!quickVerify(token)) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // حماية API: كل POST/PUT/DELETE على /api/articles يحتاج جلسة
  if (pathname.startsWith('/api/articles') && req.method !== 'GET') {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!quickVerify(token)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/articles/:path*'],
};
