import { Zap } from 'lucide-react';
import { CATEGORY_LABELS, toArabicNum, totalReadTime, arabicGreeting } from '@/lib/utils';
import type { Article, Category } from '@/lib/db/schema';
import StackButton from './StackButton';

interface Props {
  articles: Article[];
  breakingCount: number;
}

/**
 * شريط افتتاحي تحريري — خفيف، أفقي، يدمج كل المعلومات في وحدة واحدة:
 *   تحية + تاريخ → عنوان رئيسي → ميتا إحصائية inline → زر الكومة
 *
 * بديل أكثر هدوءاً عن البلوك الداكن — يحاكي الـ "dateline" في الصحف الكلاسيكية.
 */
export default function TodaysPulse({ articles, breakingCount }: Props) {
  const total = articles.length;
  if (total === 0) return null;

  const counts: Record<string, number> = {};
  articles.forEach((a) => {
    counts[a.category] = (counts[a.category] || 0) + 1;
  });
  const topEntry = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const topCategory = topEntry?.[0] as Category | undefined;

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
      className="mb-8 pb-6 border-b border-[var(--border)]"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div className="min-w-0 flex-1">
          {/* تحية + تاريخ */}
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--accent)] mb-3 flex items-center flex-wrap gap-x-2 gap-y-1">
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden>{greeting.emoji}</span>
              <span>{greeting.greeting}</span>
            </span>
            <span className="text-[var(--ink-faint)] font-normal" aria-hidden>·</span>
            <span className="text-[var(--ink-soft)] font-semibold">{today}</span>
          </p>

          {/* العنوان */}
          <h1 className="headline-display text-3xl md:text-4xl text-[var(--ink)] mb-3">
            الموجز اليومي
          </h1>

          {/* ميتا إحصائية - سطر واحد inline */}
          <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-sm text-[var(--ink-soft)] leading-relaxed">
            <span className="text-[var(--ink)]">
              <strong className="font-black tnum">{toArabicNum(total)}</strong>{' '}
              {total === 1 ? 'خبر' : 'خبراً'}
            </span>
            <span aria-hidden className="text-[var(--ink-faint)]">·</span>
            <span>
              تقرأها في{' '}
              <strong className="font-bold text-[var(--accent)] tnum">{totalTime}</strong>
            </span>
            {breakingCount > 0 && (
              <>
                <span aria-hidden className="text-[var(--ink-faint)]">·</span>
                <span className="inline-flex items-center gap-1 text-[var(--breaking)]">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <strong className="font-bold tnum">{toArabicNum(breakingCount)}</strong> عاجل
                </span>
              </>
            )}
            {topCategory && (
              <>
                <span aria-hidden className="text-[var(--ink-faint)]">·</span>
                <span>
                  أبرز قسم:{' '}
                  <strong className="font-bold text-[var(--ink)]">
                    {CATEGORY_LABELS[topCategory]}
                  </strong>
                </span>
              </>
            )}
          </p>
        </div>

        {/* زر الكومة */}
        <div className="md:flex-shrink-0">
          <StackButton />
        </div>
      </div>
    </section>
  );
}
