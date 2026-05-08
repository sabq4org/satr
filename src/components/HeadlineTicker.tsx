import Link from 'next/link';
import { ArrowLeft, Newspaper } from 'lucide-react';
import type { Article } from '@/lib/db/schema';
import { CATEGORY_LABELS, arabicTimeAgo, toArabicNum } from '@/lib/utils';

interface Props {
  articles: Article[];
}

/**
 * شريط سريع: قائمة رقيقة من أبرز الأخبار بالسطر الأول فقط.
 * فكرة الواجهة الأم: "اقرأ كل أخبار اليوم في ٣٠ ثانية".
 * يعطي القارئ نبضة خاطفة قبل الغوص في البطاقات.
 */
export default function HeadlineTicker({ articles }: Props) {
  const items = articles.slice(0, 6);
  if (items.length === 0) return null;

  return (
    <section
      aria-label="عناوين سريعة"
      className="paper-card mb-8 overflow-hidden relative section-fade"
    >
      {/* خط أكسسوار رفيع على الجنب */}
      <span aria-hidden className="absolute top-0 right-0 bottom-0 w-[3px] bg-gradient-to-b from-[var(--accent)] via-[var(--accent-soft)] to-transparent" />

      <header className="px-5 py-3 flex items-center justify-between border-b border-[var(--border-soft)] bg-[var(--paper-tinted)]">
        <div className="flex items-center gap-2">
          <Newspaper className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span className="text-[10.5px] font-bold tracking-[0.2em] uppercase text-[var(--accent)]">
            عناوين سريعة
          </span>
          <span aria-hidden className="text-[var(--ink-whisper)] mx-0.5">·</span>
          <span className="text-[11px] text-[var(--ink-faint)]">
            اقرأ نبضة اليوم في ٣٠ ثانية
          </span>
        </div>
      </header>

      <ol className="divide-y divide-[var(--border-soft)]">
        {items.map((a, i) => (
          <li key={a.id} className="ticker-item" style={{ animationDelay: `${i * 0.06}s` }}>
            <Link
              href={`/article/${a.id}`}
              className="group flex items-start gap-3 md:gap-4 px-5 py-3.5 hover:bg-[var(--paper-tinted)] transition-colors"
            >
              {/* رقم */}
              <span
                aria-hidden
                className="flex-shrink-0 w-6 h-6 mt-0.5 rounded-full bg-[var(--accent-wash)] text-[var(--accent)] text-[11px] font-black flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:text-white transition-colors tnum"
              >
                {toArabicNum(i + 1)}
              </span>

              {/* النص */}
              <div className="flex-1 min-w-0 flex items-baseline gap-3">
                <p className="flex-1 text-sm md:text-[15px] text-[var(--ink)] font-bold leading-relaxed line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
                  {a.line1}
                </p>
                <div className="hidden sm:flex flex-shrink-0 items-center gap-2 text-[11px] text-[var(--ink-faint)]">
                  {a.isBreaking && (
                    <span className="inline-flex items-center gap-1 text-[var(--breaking)] font-bold">
                      <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
                      عاجل
                    </span>
                  )}
                  <span className={`cat-badge cat-${a.category}`}>
                    {CATEGORY_LABELS[a.category]}
                  </span>
                  <span className="tnum opacity-70 whitespace-nowrap">
                    {arabicTimeAgo(a.publishedAt || a.createdAt)}
                  </span>
                </div>
              </div>

              {/* سهم */}
              <ArrowLeft className="w-4 h-4 mt-1 text-[var(--ink-whisper)] group-hover:text-[var(--accent)] group-hover:translate-x-[-2px] transition-all flex-shrink-0" />
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
