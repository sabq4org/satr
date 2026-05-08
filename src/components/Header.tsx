import Link from 'next/link';
import Logo from './Logo';
import { Layers, User } from 'lucide-react';
import { CATEGORY_LABELS, CATEGORY_EMOJI } from '@/lib/utils';
import { isAuthenticated } from '@/lib/auth';
import LogoutButton from './LogoutButton';
import HeaderSearch from './HeaderSearch';
import type { Category } from '@/lib/db/schema';

interface Props {
  active?: 'home' | Category;
}

export default async function Header({ active = 'home' }: Props) {
  const authed = await isAuthenticated();

  return (
    <header className="sticky top-0 z-50 glass border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          <Logo size="md" />

          <div className="flex items-center gap-1.5">
            <HeaderSearch />

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

            {authed ? (
              <div className="flex items-center gap-1">
                <Link
                  href="/admin"
                  className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-full text-sm font-semibold hover:bg-[var(--accent-deep)] transition-colors"
                >
                  <User className="w-4 h-4" />
                  لوحة التحرير
                </Link>
                <Link
                  href="/admin"
                  className="md:hidden p-2 bg-[var(--accent)] text-white rounded-full hover:bg-[var(--accent-deep)] transition-colors"
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
        <nav
          className="flex items-center gap-1 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-hide"
          aria-label="الأقسام"
        >
          <Link
            href="/"
            aria-current={active === 'home' ? 'page' : undefined}
            className={
              active === 'home'
                ? 'px-4 py-1.5 rounded-full text-sm font-semibold text-[var(--accent)] bg-[var(--accent-light)] whitespace-nowrap'
                : 'px-4 py-1.5 rounded-full text-sm font-medium text-[var(--ink-soft)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)] whitespace-nowrap transition-colors'
            }
          >
            الموجز
          </Link>
          {(Object.entries(CATEGORY_LABELS) as [Category, string][]).map(([key, label]) => (
            <Link
              key={key}
              href={`/category/${key}`}
              aria-current={active === key ? 'page' : undefined}
              className={
                active === key
                  ? 'px-4 py-1.5 rounded-full text-sm font-semibold text-[var(--accent)] bg-[var(--accent-light)] whitespace-nowrap inline-flex items-center gap-1.5'
                  : 'px-4 py-1.5 rounded-full text-sm font-medium text-[var(--ink-soft)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)] whitespace-nowrap transition-colors inline-flex items-center gap-1.5'
              }
            >
              <span aria-hidden className="text-[11px]">{CATEGORY_EMOJI[key]}</span>
              {label}
            </Link>
          ))}
          <Link
            href="/tags"
            className="px-4 py-1.5 rounded-full text-sm font-medium text-[var(--ink-soft)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)] whitespace-nowrap transition-colors"
          >
            #الوسوم
          </Link>
        </nav>
      </div>
    </header>
  );
}
