import Link from 'next/link';
import Logo from '@/components/Logo';
import { Home, Layers } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[var(--bg)] via-[var(--accent-light)]/30 to-[var(--bg)]">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>
        <p className="text-[8rem] md:text-[10rem] font-black text-[var(--accent-light)] leading-none -mb-4">
          ٤٠٤
        </p>
        <h1 className="text-2xl font-black text-[var(--ink)] mb-3">
          الصفحة غير موجودة
        </h1>
        <p className="text-[var(--ink-soft)] mb-8 leading-relaxed">
          الخبر الذي تبحث عنه قد يكون أُرشف أو لم يُنشر بعد.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--accent)] text-white rounded-full font-bold text-sm hover:bg-[var(--accent-soft)] transition-colors"
          >
            <Home className="w-4 h-4" />
            للموجز
          </Link>
          <Link
            href="/stack"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-[var(--border)] rounded-full font-semibold text-sm hover:border-[var(--accent)] transition-colors"
          >
            <Layers className="w-4 h-4" />
            تصفّح الكومة
          </Link>
        </div>
      </div>
    </main>
  );
}
