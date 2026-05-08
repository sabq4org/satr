import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';

interface Props {
  title?: string;
  description?: string;
  ctaHref?: string;
  ctaLabel?: string;
  variant?: 'default' | 'minimal';
}

export default function EmptyState({
  title = 'لا توجد أخبار منشورة بعد',
  description = 'الصمت أحياناً أبلغ من كثير الكلام. عُد قريباً، فلدينا ٣ سطور تنتظر القارئ المهتم.',
  ctaHref = '/manifesto',
  ctaLabel = 'اقرأ قاعدة الـ٣',
  variant = 'default',
}: Props) {
  if (variant === 'minimal') {
    return (
      <div className="text-center py-12 text-sm text-[var(--ink-soft)]">
        <p>{title}</p>
        {description && <p className="text-xs text-[var(--ink-faint)] mt-1">{description}</p>}
      </div>
    );
  }

  return (
    <div className="text-center py-20 px-4">
      {/* رسم الأسطر الثلاثة */}
      <div
        aria-hidden
        className="inline-flex flex-col gap-3 mb-8 opacity-50"
      >
        <span className="h-2 w-40 rounded-full bg-[var(--accent)]" />
        <span className="h-2 w-32 rounded-full bg-[var(--accent-soft)]" />
        <span className="h-2 w-36 rounded-full bg-[var(--accent-light)]" />
      </div>

      <h2 className="text-2xl md:text-3xl font-black text-[var(--ink)] mb-3 tracking-tight">
        {title}
      </h2>
      <p className="text-[var(--ink-soft)] max-w-md mx-auto leading-relaxed mb-8">
        {description}
      </p>

      {ctaHref && (
        <Link
          href={ctaHref}
          className="btn-pill btn-primary"
        >
          <Sparkles className="w-4 h-4" />
          {ctaLabel}
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
}
