'use client';

import Link from 'next/link';
import { ArrowLeft, Clock3 } from 'lucide-react';
import type { Article } from '@/lib/db/schema';
import { CATEGORY_LABELS, arabicTimeAgo, readTime, toArabicNum } from '@/lib/utils';

/**
 * هيرو ورقي مدمج — أسلوب صحفي راقٍ بمساحة معقولة:
 *   • صورة مربّعة جانبية (مش عملاقة)
 *   • شارة "خبر اليوم" ذهبية صغيرة
 *   • العنوان متوسط
 *   • السطر ٢ و٣ inline
 */
export default function HeroBreaking({ article }: { article: Article }) {
  const seconds = readTime(article.line1, article.line2, article.line3);

  return (
    <article className="relative mb-7 satr-card overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* الصورة - أصغر بكثير */}
        <div className="relative h-40 md:h-auto md:col-span-4 md:order-2 bg-[var(--accent-wash)] overflow-hidden md:min-h-[200px]">
          {article.imageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.imageUrl}
                alt={article.imageAlt || article.line1}
                className="w-full h-full object-cover"
              />
              <span aria-hidden className="md:hidden absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[var(--paper)] to-transparent" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[var(--paper-tinted)]">
              <div className="flex flex-col gap-2 px-8">
                <span className="h-1 w-24 rounded-full bg-[var(--accent)] opacity-80" />
                <span className="h-1 w-20 rounded-full bg-[var(--accent-soft)] opacity-60" />
                <span className="h-1 w-22 rounded-full bg-[var(--accent-light)]" />
              </div>
            </div>
          )}

          {article.isBreaking && (
            <div className="absolute bottom-2.5 right-2.5">
              <span className="breaking-badge">عاجل</span>
            </div>
          )}
        </div>

        {/* النص */}
        <div className="p-5 md:p-6 md:col-span-8 md:order-1 flex flex-col justify-center bg-[var(--paper)]">
          {/* meta علوي + شارة خبر اليوم */}
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-3">
            <span className="inline-flex items-center gap-1 text-[9.5px] font-bold tracking-[0.18em] uppercase text-[var(--gold)]">
              <span className="w-1 h-1 rounded-full bg-[var(--gold)]" />
              خبر اليوم
            </span>
            <span aria-hidden className="text-[var(--ink-whisper)]">·</span>
            <span className={`cat-badge cat-${article.category}`}>
              {CATEGORY_LABELS[article.category]}
            </span>
            <span aria-hidden className="text-[var(--ink-whisper)]">·</span>
            <span className="text-[10.5px] font-semibold text-[var(--ink-soft)] tnum">
              {arabicTimeAgo(article.publishedAt || article.createdAt)}
            </span>
            <span aria-hidden className="text-[var(--ink-whisper)]">·</span>
            <span className="read-time">
              <Clock3 className="w-3 h-3" />
              {toArabicNum(seconds)} ث
            </span>
          </div>

          {/* العنوان (السطر الأول) - متوسط */}
          <h2 className="text-[1.125rem] md:text-[1.375rem] font-black leading-[1.25] text-[var(--ink)] mb-3 tracking-tight">
            {article.line1}
          </h2>

          {/* السطر ٢ و٣ */}
          <div className="space-y-1.5 mb-4 pr-2.5 border-r-2 border-[var(--accent-light)]">
            <p className="text-[13px] md:text-[13.5px] font-medium leading-relaxed text-[var(--ink-soft)] line-clamp-2">
              {article.line2}
            </p>
            <p className="text-[13px] md:text-[13.5px] font-bold italic leading-relaxed text-[var(--accent)] line-clamp-2">
              {article.line3}
            </p>
          </div>

          {/* CTA */}
          <Link
            href={`/article/${article.id}`}
            className="self-start inline-flex items-center gap-1.5 text-[10.5px] font-bold tracking-[0.15em] uppercase text-[var(--accent)] hover:gap-2 transition-all group"
          >
            <span>اقرأ التفاصيل</span>
            <ArrowLeft className="w-3 h-3 group-hover:translate-x-[-2px] transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
