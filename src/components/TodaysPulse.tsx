import { Zap, Hash } from 'lucide-react';
import Link from 'next/link';
import { CATEGORY_LABELS, toArabicNum, totalReadTime, arabicGreeting } from '@/lib/utils';
import type { Article, Category } from '@/lib/db/schema';
import StackButton from './StackButton';

interface Props {
  articles: Article[];
  breakingCount: number;
}

/**
 * شريط افتتاحي ناعم — يدمج كل سياق اليوم بأسلوب صحفي راقٍ.
 *
 * المكونات الإبداعية:
 *   • تحية حسب الوقت (تتجدد ديناميكياً)
 *   • تاريخ صحفي
 *   • العنوان الكبير
 *   • سطر ميتا inline (إجمالي · زمن · عاجل · القسم الأبرز)
 *   • "كلمة اليوم" — أكثر وسم تكراراً مع رابط مباشر
 *   • زر الكومة على الجنب
 */
export default function TodaysPulse({ articles, breakingCount }: Props) {
  const total = articles.length;
  if (total === 0) return null;

  // أكثر تصنيف
  const catCounts: Record<string, number> = {};
  articles.forEach((a) => {
    catCounts[a.category] = (catCounts[a.category] || 0) + 1;
  });
  const topCatEntry = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0];
  const topCategory = topCatEntry?.[0] as Category | undefined;

  // كلمة اليوم — أكثر وسم تكراراً
  const tagCounts: Record<string, number> = {};
  articles.forEach((a) => {
    (a.tags || []).forEach((t) => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
  });
  const topTagEntry = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0];
  const wordOfDay = topTagEntry?.[0];
  const wordOfDayCount = topTagEntry?.[1] || 0;

  const greeting = arabicGreeting();
  const totalTime = totalReadTime(total);
  const today = new Intl.DateTimeFormat('ar-SA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  return (
    <section
      aria-label="نبض اليوم"
      className="mb-7 pb-6 border-b border-[var(--border-soft)]"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div className="min-w-0 flex-1">
          {/* تحية + تاريخ */}
          <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-[var(--accent)] mb-2.5 flex items-center flex-wrap gap-x-2 gap-y-0.5">
            <span className="inline-flex items-center gap-1.5 opacity-90">
              <span aria-hidden>{greeting.emoji}</span>
              <span>{greeting.greeting}</span>
            </span>
            <span aria-hidden className="w-1 h-1 rounded-full bg-[var(--ink-faint)]" />
            <span className="text-[var(--ink-soft)] font-semibold tracking-widest">{today}</span>
          </p>

          {/* العنوان */}
          <h1 className="headline-display text-[2rem] md:text-[2.5rem] text-[var(--ink)] mb-3.5">
            الموجز اليومي
          </h1>

          {/* ميتا إحصائية - سطر واحد inline */}
          <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[13.5px] text-[var(--ink-soft)] leading-relaxed">
            <span className="text-[var(--ink)]">
              <strong className="font-black tnum">{toArabicNum(total)}</strong>{' '}
              {total === 1 ? 'خبر' : 'خبراً'}
            </span>
            <span aria-hidden className="text-[var(--ink-whisper)]">/</span>
            <span>
              تقرأها في{' '}
              <strong className="font-bold text-[var(--accent)] tnum">{totalTime}</strong>
            </span>
            {breakingCount > 0 && (
              <>
                <span aria-hidden className="text-[var(--ink-whisper)]">/</span>
                <span className="inline-flex items-center gap-1 text-[var(--breaking)]">
                  <Zap className="w-3 h-3 fill-current" />
                  <strong className="font-bold tnum">{toArabicNum(breakingCount)}</strong> عاجل
                </span>
              </>
            )}
            {topCategory && (
              <>
                <span aria-hidden className="text-[var(--ink-whisper)]">/</span>
                <span>
                  أبرز قسم{' '}
                  <Link
                    href={`/category/${topCategory}`}
                    className="font-bold text-[var(--ink)] hover:text-[var(--accent)] transition-colors"
                  >
                    {CATEGORY_LABELS[topCategory]}
                  </Link>
                </span>
              </>
            )}
          </p>

          {/* كلمة اليوم */}
          {wordOfDay && wordOfDayCount > 1 && (
            <Link
              href={`/tag/${encodeURIComponent(wordOfDay)}`}
              className="mt-3.5 inline-flex items-center gap-2 text-xs text-[var(--ink-faint)] hover:text-[var(--accent)] transition-colors group"
            >
              <span className="font-bold tracking-widest uppercase text-[10px]">كلمة اليوم</span>
              <span aria-hidden className="w-3 h-px bg-current opacity-50" />
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--accent-wash)] text-[var(--accent)] font-bold group-hover:bg-[var(--accent)] group-hover:text-white transition-all">
                <Hash className="w-3 h-3" />
                <span>{wordOfDay}</span>
                <span className="text-[10px] opacity-70 tnum">{toArabicNum(wordOfDayCount)}</span>
              </span>
            </Link>
          )}
        </div>

        {/* زر الكومة */}
        <div className="md:flex-shrink-0 self-start md:self-end">
          <StackButton />
        </div>
      </div>
    </section>
  );
}
