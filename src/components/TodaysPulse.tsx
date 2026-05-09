import { Zap, Hash, Newspaper, Clock3 } from 'lucide-react';
import Link from 'next/link';
import { CATEGORY_LABELS, CATEGORY_EMOJI, toArabicNum, totalReadTime, arabicGreeting } from '@/lib/utils';
import type { Article, Category } from '@/lib/db/schema';
import StackButton from './StackButton';

interface Props {
  articles: Article[];
  breakingCount: number;
}

/**
 * شريط افتتاحي حيوي بإيقاع مجلة:
 *  • خلفية بنفحة لونية + زخرفة هندسية
 *  • أرقام ضخمة ملوّنة
 *  • مواضيع رائجة كشيبس ملوّنة
 *  • كلمة اليوم
 *  • زر الكومة
 */
export default function TodaysPulse({ articles, breakingCount }: Props) {
  const total = articles.length;
  if (total === 0) return null;

  // حساب التوزيع حسب الأقسام
  const catCounts: Record<string, number> = {};
  articles.forEach((a) => {
    catCounts[a.category] = (catCounts[a.category] || 0) + 1;
  });
  const sortedCats = Object.entries(catCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5) as [Category, number][];

  // كلمة اليوم
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
      className="relative mb-7 overflow-hidden rounded-2xl border border-[var(--accent-light)]"
      style={{ background: 'rgba(139,26,43,0.06)' }}
    >

      <div className="relative p-5 md:p-7">
        {/* تحية + تاريخ */}
        <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--paper)] border border-[var(--border-soft)] text-[10.5px] font-bold tracking-[0.18em] uppercase text-[var(--accent)]">
            <span aria-hidden>{greeting.emoji}</span>
            <span>{greeting.greeting}</span>
          </span>
          <span className="text-[11px] font-semibold tracking-widest text-[var(--ink-soft)] tnum">
            {today}
          </span>
        </div>

        {/* العنوان مع لمعة */}
        <h1 className="headline-display text-[2rem] md:text-[2.5rem] text-[var(--ink)] mb-4 leading-[1.05]">
          الموجز اليومي
        </h1>

        {/* أرقام ضخمة في صف */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <StatBadge
            icon={<Newspaper className="w-3.5 h-3.5" />}
            value={toArabicNum(total)}
            label={total === 1 ? 'خبر' : 'خبراً'}
            tone="accent"
          />
          <StatBadge
            icon={<Clock3 className="w-3.5 h-3.5" />}
            value={totalTime}
            label="زمن القراءة"
            tone="ink"
          />
          <StatBadge
            icon={<Zap className="w-3.5 h-3.5 fill-current" />}
            value={toArabicNum(breakingCount)}
            label={breakingCount === 1 ? 'عاجل' : 'عاجل'}
            tone="breaking"
            href={breakingCount > 0 ? '#latest' : undefined}
          />
          <StatBadge
            icon={<Hash className="w-3.5 h-3.5" />}
            value={wordOfDay ? `#${wordOfDay}` : '—'}
            label={wordOfDay ? `${toArabicNum(wordOfDayCount)} ربط` : 'كلمة اليوم'}
            tone="gold"
            href={wordOfDay ? `/tag/${encodeURIComponent(wordOfDay)}` : undefined}
            small
          />
        </div>

        {/* شريط مواضيع رائجة + زر الكومة */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[var(--ink-faint)]">
              رائج
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {sortedCats.map(([cat, count]) => (
                <Link
                  key={cat}
                  href={`/category/${cat}`}
                  className="group inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-bold bg-[var(--paper)] border border-[var(--border-soft)] text-[var(--ink-soft)] hover:border-[var(--accent-light)] hover:text-[var(--accent)] hover:bg-[var(--accent-wash)] transition-all"
                >
                  <span aria-hidden className="text-[10px] opacity-80">{CATEGORY_EMOJI[cat]}</span>
                  <span>{CATEGORY_LABELS[cat]}</span>
                  <span className="opacity-60 tnum text-[10px]">{toArabicNum(count)}</span>
                </Link>
              ))}
            </div>
          </div>
          <StackButton />
        </div>
      </div>
    </section>
  );
}

function StatBadge({
  icon,
  value,
  label,
  tone,
  href,
  small,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  tone: 'accent' | 'ink' | 'breaking' | 'gold';
  href?: string;
  small?: boolean;
}) {
  const toneClasses: Record<string, string> = {
    accent: 'text-[var(--accent)]',
    ink: 'text-[var(--ink)]',
    breaking: 'text-[var(--breaking)]',
    gold: 'text-[var(--gold)]',
  };

  const content = (
    <div className="paper-card px-3.5 py-2.5 flex items-center gap-2.5 group hover:border-[var(--accent-light)] transition-colors">
      <span className={`flex-shrink-0 ${toneClasses[tone]} opacity-70 group-hover:opacity-100 transition-opacity`}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div
          className={`font-black ${toneClasses[tone]} tnum leading-tight tracking-tight truncate ${small ? 'text-[15px]' : 'text-xl md:text-[1.5rem]'}`}
        >
          {value}
        </div>
        <div className="text-[10px] font-bold tracking-wider uppercase text-[var(--ink-faint)] truncate">
          {label}
        </div>
      </div>
    </div>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return content;
}
