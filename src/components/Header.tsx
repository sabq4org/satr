import Link from 'next/link';
import Logo from './Logo';
import { Layers, User, LogOut, Search, Bookmark } from 'lucide-react';
import { CATEGORY_LABELS } from '@/lib/utils';
import { isAuthenticated } from '@/lib/auth';
import LogoutButton from './LogoutButton';

export default async function Header() {
  const authed = await isAuthenticated();

  return (
    <header className="sticky top-0 z-50 bg-[var(--paper)]/85 backdrop-blur-md border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          <Logo size="md" />

          <div className="flex items-center gap-1.5">
            <Link
              href="/stack"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 bg-[var(--accent-light)] text-[var(--accent)] rounded-full text-sm font-bold hover:bg-[var(--accent)] hover:text-white transition-all"
              title="عرض الكومة - مثالي للموبايل"
            >
              <Layers className="w-4 h-4" />
              كومة
            </Link>
            <Link
              href="/stack"
              className="sm:hidden p-2.5 bg-[var(--accent-light)] text-[var(--accent)] rounded-full hover:bg-[var(--accent)] hover:text-white transition-all"
              title="عرض الكومة"
              aria-label="عرض الكومة"
            >
              <Layers className="w-4 h-4" />
            </Link>

            <button
              className="p-2 hover:bg-[var(--accent-light)] rounded-full transition-colors text-[var(--ink-soft)] hidden sm:inline-flex"
              aria-label="بحث"
              title="بحث (قريباً)"
              disabled
            >
              <Search className="w-5 h-5" />
            </button>

            {authed ? (
              <div className="flex items-center gap-1">
                <Link
                  href="/admin"
                  className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-full text-sm font-semibold hover:bg-[var(--accent-soft)] transition-colors"
                >
                  <User className="w-4 h-4" />
                  لوحة التحرير
                </Link>
                <Link
                  href="/admin"
                  className="md:hidden p-2 bg-[var(--accent)] text-white rounded-full hover:bg-[var(--accent-soft)] transition-colors"
                  aria-label="لوحة التحرير"
                >
                  <User className="w-4 h-4" />
                </Link>
                <LogoutButton />
              </div>
            ) : (
              <Link
                href="/admin/login"
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-full text-sm font-semibold text-[var(--ink-soft)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                <User className="w-4 h-4" />
                دخول المحررين
              </Link>
            )}
          </div>
        </div>

        {/* شريط الأقسام */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-hide">
          <Link
            href="/"
            className="px-4 py-1.5 rounded-full text-sm font-semibold text-[var(--accent)] bg-[var(--accent-light)] whitespace-nowrap"
          >
            الموجز
          </Link>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <Link
              key={key}
              href={`/category/${key}`}
              className="px-4 py-1.5 rounded-full text-sm font-medium text-[var(--ink-soft)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)] whitespace-nowrap transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
