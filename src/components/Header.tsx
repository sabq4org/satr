import Link from 'next/link';
import Logo from './Logo';
import { User } from 'lucide-react';
import { CATEGORY_LABELS } from '@/lib/utils';
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
    <header className="sticky top-0 z-50 glass border-b border-[var(--border-soft)]">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-[60px]">
          <Logo size="md" />

          <div className="flex items-center gap-1">
            <HeaderSearch />

            {authed ? (
              <div className="flex items-center gap-1">
                <Link
                  href="/admin"
                  className="hidden md:inline-flex items-center gap-2 px-3.5 py-1.5 bg-[var(--accent)] text-white rounded-full text-[12.5px] font-semibold hover:bg-[var(--accent-deep)] transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  لوحة التحرير
                </Link>
                <Link
                  href="/admin"
                  className="md:hidden p-2 bg-[var(--accent)] text-white rounded-full hover:bg-[var(--accent-deep)] transition-colors"
                  aria-label="لوحة التحرير"
                >
                  <User className="w-3.5 h-3.5" />
                </Link>
                <LogoutButton />
              </div>
            ) : (
              <Link
                href="/admin/login"
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-[var(--border)] rounded-full text-[12.5px] font-semibold text-[var(--ink-soft)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                دخول المحررين
              </Link>
            )}
          </div>
        </div>

        {/* شريط الأقسام - أنعم */}
        <nav
          className="flex items-center gap-0.5 overflow-x-auto pb-2.5 -mx-1 px-1 scrollbar-hide"
          aria-label="الأقسام"
        >
          <NavLink href="/" active={active === 'home'}>
            الموجز
          </NavLink>
          {(Object.entries(CATEGORY_LABELS) as [Category, string][]).map(([key, label]) => (
            <NavLink key={key} href={`/category/${key}`} active={active === key}>
              {label}
            </NavLink>
          ))}
          <NavLink href="/tags">
            <span aria-hidden className="opacity-70">#</span>الوسوم
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={
        active
          ? 'px-3.5 py-1.5 rounded-full text-[13px] font-bold text-[var(--accent)] bg-[var(--accent-wash)] whitespace-nowrap'
          : 'px-3.5 py-1.5 rounded-full text-[13px] font-medium text-[var(--ink-soft)] hover:bg-[var(--accent-wash)] hover:text-[var(--accent)] whitespace-nowrap transition-colors'
      }
    >
      {children}
    </Link>
  );
}
