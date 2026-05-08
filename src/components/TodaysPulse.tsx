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
      className="mb-8 pb-5 border-b border-[var(--border)]"
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* يسار: تحية + تاريخ */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-lg" aria-hidden>{greeting.emoji}</span>
          <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-[var(--ink-soft)]">
            {today}
          </span>
          <span aria-hidden className="text-[var(--border)] text-base">|</span>
          <span className="text-sm text-[var(--ink-soft)]">
            <strong className="font-black text-[var(--ink)] tnum">{toArabicNum(total)}</strong>
            {' '}{total === 1 ? 'خبر' : 'خبراً'}
            {' '}·{' '}
            <span className="text-[var(--accent)] font-semibold tnum">{totalTime}</span>
            {' '}قراءة
          </span>
          {breakingCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--breaking)]">
              <Zap className="w-3 h-3 fill-current" />
              {toArabicNum(breakingCount)} عاجل
            </span>
          )}
        </div>

        {/* يمين: زر الكومة */}
        <StackButton />
      </div>
    </section>
  );
}
