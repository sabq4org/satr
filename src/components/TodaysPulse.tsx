import { Zap, Layers, Clock3, TrendingUp } from 'lucide-react';
import { CATEGORY_LABELS, toArabicNum, totalReadTime, arabicGreeting } from '@/lib/utils';
import type { Article, Category } from '@/lib/db/schema';

interface Props {
  articles: Article[];
  breakingCount: number;
}

export default function TodaysPulse({ articles, breakingCount }: Props) {
  const total = articles.length;

  // التصنيف الأكثر حضوراً
  const counts: Record<string, number> = {};
  articles.forEach((a) => {
    counts[a.category] = (counts[a.category] || 0) + 1;
  });
  const topCategoryEntry = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const topCategory = topCategoryEntry?.[0] as Category | undefined;
  const topCategoryCount = topCategoryEntry?.[1] || 0;

  const greeting = arabicGreeting();
  const totalTime = totalReadTime(total);

  if (total === 0) return null;

  return (
    <section
      aria-label="نبض اليوم"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-[var(--accent-deep)] via-[var(--accent)] to-[var(--accent-soft)] text-white p-6 md:p-8 mb-8 shadow-lg"
    >
      {/* خلفية بنقاط */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      {/* لمعة */}
      <div
        aria-hidden
        className="absolute -top-1/2 -left-1/4 w-1/2 h-full bg-white/5 blur-3xl rounded-full pointer-events-none"
      />

      <div className="relative">
        {/* تحية */}
        <div className="flex items-center gap-2 mb-4">
          <span aria-hidden className="text-lg">{greeting.emoji}</span>
          <p className="text-xs font-bold tracking-widest uppercase text-white/70">
            {greeting.greeting} — نبض اليوم
          </p>
        </div>

        <h2 className="headline-display text-3xl md:text-4xl mb-3 max-w-2xl">
          إليك خلاصة اليوم في{' '}
          <span className="relative inline-block">
            <span className="relative z-10 px-2 bg-white/15 rounded-lg">{totalTime}</span>
            <span aria-hidden className="absolute inset-x-0 bottom-1 h-2 bg-white/10 rounded-full blur-sm" />
          </span>
        </h2>

        <p className="text-sm md:text-base text-white/80 max-w-xl mb-6 leading-relaxed">
          {breakingCount > 0 && (
            <>
              <span className="font-bold text-white">
                {toArabicNum(breakingCount)} {breakingCount === 1 ? 'خبر عاجل' : 'أخبار عاجلة'}
              </span>{' '}
              في آخر ٢٤ ساعة،{' '}
            </>
          )}
          <span>
            و{toArabicNum(total)} {total === 1 ? 'خبر' : 'خبراً'} مكثّفاً —
          </span>{' '}
          كل واحد يلتزم بـ <strong className="font-bold text-white">قاعدة الـ٣</strong>: الحدث، السياق،
          المعنى.
        </p>

        {/* بطاقات النبض */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <PulseCard
            icon={<Layers className="w-4 h-4" />}
            label="إجمالي"
            value={toArabicNum(total)}
            sub={total === 1 ? 'خبر' : 'خبر'}
          />
          <PulseCard
            icon={<Zap className="w-4 h-4" />}
            label="عاجل"
            value={toArabicNum(breakingCount)}
            sub="آخر ٢٤ ساعة"
            accent={breakingCount > 0}
          />
          <PulseCard
            icon={<Clock3 className="w-4 h-4" />}
            label="زمن القراءة"
            value={totalTime}
            sub="للجميع"
          />
          <PulseCard
            icon={<TrendingUp className="w-4 h-4" />}
            label="القسم الأبرز"
            value={topCategory ? CATEGORY_LABELS[topCategory] : '—'}
            sub={topCategory ? `${toArabicNum(topCategoryCount)} ${topCategoryCount === 1 ? 'خبر' : 'خبر'}` : ''}
          />
        </div>
      </div>
    </section>
  );
}

function PulseCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={
        accent
          ? 'bg-[var(--breaking)]/15 ring-1 ring-[var(--breaking)]/40 backdrop-blur rounded-2xl px-4 py-3'
          : 'bg-white/10 backdrop-blur rounded-2xl px-4 py-3 ring-1 ring-white/15'
      }
    >
      <div className="flex items-center gap-1.5 text-white/70 text-[11px] font-bold uppercase tracking-wider mb-1">
        <span aria-hidden>{icon}</span>
        {label}
      </div>
      <div className="text-2xl md:text-[1.625rem] font-black tnum leading-tight text-white">
        {value}
      </div>
      {sub && <div className="text-[11px] text-white/60 mt-0.5">{sub}</div>}
    </div>
  );
}
