import Link from 'next/link';
import Logo from './Logo';
import { Search, Bookmark, User } from 'lucide-react';
import { CATEGORY_LABELS } from '@/lib/utils';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--paper)]/85 backdrop-blur-md border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* الشعار */}
          <Logo size="md" />

          {/* أيقونات الجانب */}
          <div className="flex items-center gap-2">
            <button
              className="p-2 hover:bg-[var(--accent-light)] rounded-full transition-colors"
              aria-label="بحث"
            >
              <Search className="w-5 h-5 text-[var(--ink-soft)]" />
            </button>
            <button
              className="p-2 hover:bg-[var(--accent-light)] rounded-full transition-colors"
              aria-label="المحفوظات"
            >
              <Bookmark className="w-5 h-5 text-[var(--ink-soft)]" />
            </button>
            <Link
              href="/admin"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-full text-sm font-semibold hover:bg-[var(--accent-soft)] transition-colors"
            >
              <User className="w-4 h-4" />
              لوحة التحرير
            </Link>
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
