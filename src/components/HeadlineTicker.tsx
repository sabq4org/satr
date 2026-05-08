import Link from 'next/link';
import { ArrowLeft, Newspaper } from 'lucide-react';
import type { Article } from '@/lib/db/schema';
import { CATEGORY_LABELS, arabicTimeAgo, toArabicNum } from '@/lib/utils';

interface Props {
  articles: Article[];
}

/**
 * شريط عناوين سريعة:
 *  • صورة مصغّرة ٤٤×٤٤ (إن وجدت) أو شريط لون قسم متدرّج
 *  • رقم متسلسل + سطر ١
 *  • قسم + توقيت
 *  • فكرة: "اقرأ كل الأخبار في ٣٠ ثانية"
 */
export default function HeadlineTicker({ articles }: Props) {
  const items = articles.slice(0, 6);
  if (items.length === 0) return null;

  return (
    <section
      aria-label="عناوين سريعة"
      className="paper-card mb-8 overflow-hidden relative section-fade"
    >
      <header className="px-5 py-3 flex items-center justify-between border-b border-[var(--border-soft)] bg-gradient-to-l from-[var(--accent-tint)] to-[var(--paper-tinted)]">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--accent)] text-white">
            <Newspaper className="w-3 h-3" />
          </span>
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--accent)]">
            عناوين سريعة
          </span>
          <span aria-hidden className="text-[var(--ink-whisper)] mx-0.5">·</span>
          <span className="text-[11px] text-[var(--ink-soft)]">
            نبضة اليوم في ٣٠ ثانية
          </span>
        </div>
        <span className="text-[10.5px] font-bold tracking-wider uppercase text-[var(--ink-faint)] tnum">
          {toArabicNum(items.length)} عناوين
        </span>
      </header>

      <ol className="divide-y divide-[var(--border-soft)]">
        {items.map((a, i) => {
          const accent = `var(--${a.category})`;
          return (
            <li key={a.id} className="ticker-item" style={{ animationDelay: `${i * 0.06}s` }}>
              <Link
                href={`/article/${a.id}`}
                className="group flex items-stretch gap-3 md:gap-4 px-4 md:px-5 py-3 hover:bg-[var(--paper-tinted)] transition-colors"
              >
                {/* رقم */}
                <span
                  aria-hidden
                  className="flex-shrink-0 self-center w-7 h-7 rounded-full bg-[var(--accent-wash)] text-[var(--accent)] text-[12.5px] font-black flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:text-white transition-colors tnum"
                >
                  {toArabicNum(i + 1)}
                </span>

                {/* صورة مصغّرة أو نمط لوني */}
                <span
                  aria-hidden
                  className="flex-shrink-0 self-center w-11 h-11 md:w-12 md:h-12 rounded-lg overflow-hidden border border-[var(--border-soft)] relative"
                  style={!a.imageUrl ? { background: `linear-gradient(135deg, ${accent}, var(--accent-deep))` } : undefined}
                >
                  {a.imageUrl ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={a.imageUrl}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </>
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-white/90 text-[18px] font-black">
                      ـ
                    </span>
                  )}
                  {a.isBreaking && (
                    <span aria-hidden className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[var(--breaking)] border border-white" />
                  )}
                </span>

                {/* نص + meta */}
                <div className="flex-1 min-w-0 self-center">
                  <p className="text-[14px] md:text-[15px] text-[var(--ink)] font-bold leading-snug line-clamp-2 group-hover:text-[var(--accent)] transition-colors mb-1">
                    {a.line1}
                  </p>
                  <div className="flex items-center gap-2 text-[10.5px] text-[var(--ink-faint)]">
                    {a.isBreaking && (
                      <span className="inline-flex items-center gap-1 text-[var(--breaking)] font-bold uppercase tracking-wider">
                        <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
                        عاجل
                      </span>
                    )}
                    <span
                      className="inline-block px-1.5 py-0.5 rounded text-[9.5px] font-bold tracking-wider uppercase"
                      style={{ background: `color-mix(in oklab, ${accent} 12%, transparent)`, color: accent }}
                    >
                      {CATEGORY_LABELS[a.category]}
                    </span>
                    <span className="tnum opacity-80 whitespace-nowrap">
                      {arabicTimeAgo(a.publishedAt || a.createdAt)}
                    </span>
                  </div>
                </div>

                <ArrowLeft className="self-center w-4 h-4 text-[var(--ink-whisper)] group-hover:text-[var(--accent)] group-hover:translate-x-[-3px] transition-all flex-shrink-0" />
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
