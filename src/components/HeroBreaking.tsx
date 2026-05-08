'use client';

import Link from 'next/link';
import { ArrowLeft, Clock3 } from 'lucide-react';
import type { Article } from '@/lib/db/schema';
import { CATEGORY_LABELS, arabicTimeAgo, readTime, toArabicNum } from '@/lib/utils';

/**
 * هيرو شريط أفقي مدمج — لا يستهلك الواجهة:
 *   • صورة مربعة 140×140 على الجنب
 *   • العنوان + السطر ٢ و٣ في عمود مضغوط
 *   • ارتفاع كامل ≤ 150px على الديسكتوب
 */
export default function HeroBreaking({ article }: { article: Article }) {
  const seconds = readTime(article.line1, article.line2, article.line3);

  return (
    <article className="relative mb-7 satr-card overflow-hidden md:max-h-[150px]">
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* الصورة - مربع صغير */}
        <div className="relative h-32 md:h-[150px] md:col-span-3 md:order-2 bg-[var(--accent-wash)] overflow-hidden">
          {article.imageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.imageUrl}
                alt={article.imageAlt || article.line1}
                className="w-full h-full object-cover"
              />
              <span aria-hidden className="md:hidden absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[var(--paper)] to-transparent" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[var(--paper-tinted)]">
              <div className="flex flex-col gap-1.5 px-6">
                <span className="h-1 w-16 rounded-full bg-[var(--accent)] opacity-80" />
                <span className="h-1 w-12 rounded-full bg-[var(--accent-soft)] opacity-60" />
                <span className="h-1 w-14 rounded-full bg-[var(--accent-light)]" />
              </div>
            </div>
          )}

          {article.isBreaking && (
            <div className="absolute bottom-2 right-2">
              <span className="breaking-badge">عاجل</span>
            </div>
          )}
        </div>

        {/* النص */}
        <div className="px-5 py-4 md:px-6 md:py-4 md:col-span-9 md:order-1 flex flex-col justify-center bg-[var(--paper)] min-w-0">
          {/* meta علوي + شارة خبر اليوم */}
          <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 mb-2">
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

          {/* العنوان (السطر الأول) */}
          <Link
            href={`/article/${article.id}`}
            className="block group"
          >
            <h2 className="text-[15px] md:text-[17px] font-black leading-snug text-[var(--ink)] mb-1.5 tracking-tight line-clamp-1 group-hover:text-[var(--accent)] transition-colors">
              {article.line1}
            </h2>
          </Link>

          {/* السطر ٢ و٣ — كل واحد سطر واحد فقط */}
          <div className="space-y-1 pr-2 border-r-2 border-[var(--accent-light)]">
            <p className="text-[12.5px] md:text-[13px] font-medium leading-snug text-[var(--ink-soft)] line-clamp-1">
              {article.line2}
            </p>
            <p className="text-[12.5px] md:text-[13px] font-bold italic leading-snug text-[var(--accent)] line-clamp-1">
              {article.line3}
            </p>
          </div>
        </div>
      </div>

      {/* CTA كزر مدمج في الزاوية - لا يأخذ ارتفاعاً */}
      <Link
        href={`/article/${article.id}`}
        aria-label={`اقرأ التفاصيل: ${article.line1}`}
        className="absolute bottom-2.5 left-3 hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--accent-wash)] text-[10px] font-bold tracking-wider uppercase text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all group"
      >
        <span>التفاصيل</span>
        <ArrowLeft className="w-3 h-3 group-hover:translate-x-[-2px] transition-transform" />
      </Link>
    </article>
  );
}
