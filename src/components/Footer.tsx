import Link from 'next/link';
import { Sparkles, Layers, Hash, Rss } from 'lucide-react';
import { CATEGORY_LABELS, CATEGORY_EMOJI } from '@/lib/utils';
import type { Category } from '@/lib/db/schema';

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .3a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2c-3.34.72-4-1.61-4-1.61a3.18 3.18 0 0 0-1.33-1.76c-1.09-.74.08-.72.08-.72a2.52 2.52 0 0 1 1.84 1.24 2.55 2.55 0 0 0 3.49 1 2.55 2.55 0 0 1 .76-1.6c-2.66-.3-5.46-1.33-5.46-5.92a4.63 4.63 0 0 1 1.23-3.21 4.3 4.3 0 0 1 .12-3.17s1-.32 3.3 1.23a11.38 11.38 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23a4.3 4.3 0 0 1 .12 3.17 4.62 4.62 0 0 1 1.23 3.21c0 4.6-2.81 5.62-5.48 5.92a2.86 2.86 0 0 1 .81 2.22v3.29c0 .32.21.7.83.58A12 12 0 0 0 12 .3" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-[var(--border)] bg-gradient-to-b from-transparent to-[var(--bg-tinted)]">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        {/* بانر "قاعدة الـ٣" تذكير ختامي */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.3em] text-[var(--accent)] uppercase mb-3">
            قاعدتنا الذهبية
          </p>
          <p className="text-2xl md:text-3xl font-black text-[var(--ink)] mb-1 tracking-tight">
            كل خبر في{' '}
            <span className="relative inline-block">
              <span className="relative z-10">٣ سطور</span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-1 h-3 bg-[var(--accent-light)] -z-0 rounded"
              />
            </span>
            . لا أكثر.
          </p>
          <p className="text-sm text-[var(--ink-soft)] max-w-md mx-auto leading-relaxed">
            الحدث، السياق، المعنى — الزائد عبء، والناقص خداع.
          </p>
        </div>

        {/* الأعمدة */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <p className="font-black text-[var(--accent)] text-2xl mb-2 flex items-baseline gap-1.5">
              سطر
              <span aria-hidden className="flex items-baseline gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]/60" />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]/30" />
              </span>
            </p>
            <p className="text-sm text-[var(--ink-soft)] leading-relaxed mb-4">
              صحيفة ذكية مختصرة. الذكاء يقترح، البشري يحرر، والقارئ يقرأ في ثوانٍ لا في دقائق.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="/feed.xml"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[var(--border)] text-[var(--ink-soft)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                aria-label="RSS"
                title="RSS"
              >
                <Rss className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/sabq4org/satr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[var(--border)] text-[var(--ink-soft)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                aria-label="GitHub"
                title="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          <FooterCol title="القراءة">
            <FooterLink href="/" icon={null}>الموجز اليومي</FooterLink>
            <FooterLink href="/stack" icon={<Layers className="w-3.5 h-3.5" />}>
              عرض الكومة
            </FooterLink>
            <FooterLink href="/tags" icon={<Hash className="w-3.5 h-3.5" />}>
              كل الوسوم
            </FooterLink>
            <FooterLink href="/feed.xml" icon={<Rss className="w-3.5 h-3.5" />}>
              تغذية RSS
            </FooterLink>
          </FooterCol>

          <FooterCol title="الأقسام">
            {(Object.entries(CATEGORY_LABELS) as [Category, string][]).map(([key, label]) => (
              <FooterLink key={key} href={`/category/${key}`}>
                <span aria-hidden>{CATEGORY_EMOJI[key]}</span> {label}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="المنهج">
            <FooterLink href="/about">من نحن</FooterLink>
            <FooterLink href="/manifesto" icon={<Sparkles className="w-3.5 h-3.5" />}>
              قاعدة الـ٣
            </FooterLink>
            <FooterLink href="/admin/login">دخول المحررين</FooterLink>
          </FooterCol>
        </div>

        {/* الفاصل */}
        <div className="flex items-center justify-center gap-2 mb-6 text-[var(--accent)]/30">
          <span className="w-2 h-2 rounded-full bg-current" />
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
          <span className="w-1 h-1 rounded-full bg-current opacity-40" />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--ink-faint)]">
          <p>© {year} سطر — كل خبر في ٣ سطور.</p>
          <p className="flex items-center gap-1.5">
            صنع بـ{' '}
            <span aria-label="حب" className="text-[var(--breaking)]">♥</span>{' '}
            في الرياض
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-bold text-xs mb-3 text-[var(--ink)] uppercase tracking-wider">
        {title}
      </h3>
      <ul className="space-y-2 text-sm text-[var(--ink-soft)]">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="hover:text-[var(--accent)] transition-colors inline-flex items-center gap-1.5"
      >
        {icon}
        <span>{children}</span>
      </Link>
    </li>
  );
}
