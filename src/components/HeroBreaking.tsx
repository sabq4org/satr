'use client';

import Link from 'next/link';
import { ArrowLeft, Sparkles, Clock3 } from 'lucide-react';
import type { Article } from '@/lib/db/schema';
import { CATEGORY_LABELS, arabicTimeAgo, readTime, toArabicNum } from '@/lib/utils';

export default function HeroBreaking({ article }: { article: Article }) {
  const seconds = readTime(article.line1, article.line2, article.line3);

  return (
    <article className="relative mb-10 overflow-hidden satr-card">
      <div className="grid grid-cols-1 md:grid-cols-5">
        {/* الصورة */}
        <div className="relative h-48 md:h-auto md:col-span-2 bg-gradient-to-br from-[var(--accent)] via-[var(--accent-deep)] to-[#0d2440] overflow-hidden order-1 md:order-2 min-h-[260px]">
          {article.imageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.imageUrl}
                alt={article.imageAlt || article.line1}
                className="w-full h-full object-cover"
              />
              {/* تدرج درامي */}
              <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <span aria-hidden className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[var(--paper)]/30 md:to-[var(--paper)]/0" />
            </>
          ) : (
            // عرض رمزي حين لا توجد صورة - "سطر" الكبير + خطوط
            <div className="w-full h-full flex items-center justify-center relative">
              <span aria-hidden className="text-white/8 text-[10rem] font-black absolute select-none">سطر</span>
              <div className="relative z-10 flex flex-col gap-2 px-8">
                <span className="h-1 bg-white/40 rounded w-32" />
                <span className="h-1 bg-white/30 rounded w-24" />
                <span className="h-1 bg-white/20 rounded w-28" />
              </div>
            </div>
          )}

          <div className="absolute top-3 right-3 flex gap-2">
            {article.isBreaking && <span className="breaking-badge text-xs">عاجل</span>}
            <span className={`cat-badge cat-${article.category} backdrop-blur-md text-xs bg-white/90`}>
              {CATEGORY_LABELS[article.category]}
            </span>
          </div>
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/90 text-[10px] font-bold tracking-wider">
            <Sparkles className="w-2.5 h-2.5" />
            <span>الموجز المميز</span>
          </div>
        </div>

        {/* النص */}
        <div className="p-6 md:p-8 md:col-span-3 flex flex-col justify-center order-2 md:order-1 relative">
          {/* علامة اقتباس عربية ضخمة كزخرفة */}
          <span
            aria-hidden
            className="absolute top-2 left-4 text-[6rem] leading-none font-black text-[var(--accent-light)] opacity-50 select-none pointer-events-none"
            style={{ fontFamily: 'Tajawal, sans-serif' }}
          >
            ”
          </span>

          <div className="relative">
            {/* meta علوي */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-[10px] font-bold tracking-widest text-[var(--accent)] uppercase">
                {arabicTimeAgo(article.publishedAt || article.createdAt)}
              </span>
              <span className="dot-divider" aria-hidden><span /></span>
              <span className="read-time">
                <Clock3 className="w-3 h-3" />
                {toArabicNum(seconds)} ث قراءة
              </span>
            </div>

            {/* الأسطر الثلاثة */}
            <div className="space-y-3 mb-5">
              <p className="text-xl md:text-2xl font-black leading-snug text-[var(--ink)] line-clamp-3 tracking-tight">
                {article.line1}
              </p>
              <p className="text-sm md:text-base font-medium leading-relaxed text-[var(--ink-soft)] line-clamp-2">
                {article.line2}
              </p>
              <div className="relative pr-3 border-r-[3px] border-[var(--accent)]">
                <p className="text-sm md:text-base font-bold italic leading-relaxed text-[var(--accent)] line-clamp-2">
                  {article.line3}
                </p>
              </div>
            </div>

            <Link
              href={`/article/${article.id}`}
              className="inline-flex items-center gap-2 text-xs font-bold text-[var(--accent)] hover:gap-3 transition-all group"
            >
              <span>اقرأ التفاصيل</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:translate-x-[-2px] transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
