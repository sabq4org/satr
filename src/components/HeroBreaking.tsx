'use client';

import Link from 'next/link';
import { ArrowLeft, Clock3 } from 'lucide-react';
import type { Article } from '@/lib/db/schema';
import { CATEGORY_LABELS, arabicTimeAgo, readTime, toArabicNum } from '@/lib/utils';

/**
 * هيرو ورقي حريري — إيقاع مجلة كلاسيكية:
 *   • صورة كبيرة بدون غرادينت قاسي
 *   • شارة "خبر اليوم" ذهبية ناعمة
 *   • عنوان كبير
 *   • ٣ أسطر بفواصل ناعمة
 *   • تنويه ذهبي خفيف يُلفت بدون صراخ
 */
export default function HeroBreaking({ article }: { article: Article }) {
  const seconds = readTime(article.line1, article.line2, article.line3);

  return (
    <article className="relative mb-10 satr-card overflow-hidden">
      {/* شارة "خبر اليوم" ذهبية بسيطة في الأعلى */}
      <div className="absolute top-4 right-4 md:top-5 md:right-5 z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm shadow-sm text-[10px] font-bold tracking-[0.18em] uppercase text-[var(--gold)] border border-[var(--gold-soft)]">
          <span className="w-1 h-1 rounded-full bg-[var(--gold)]" />
          خبر اليوم
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* الصورة */}
        <div className="relative h-52 md:h-auto md:col-span-5 md:order-2 bg-[var(--accent-wash)] overflow-hidden min-h-[320px]">
          {article.imageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.imageUrl}
                alt={article.imageAlt || article.line1}
                className="w-full h-full object-cover"
              />
              {/* تدرج خفيف لتنعيم الانتقال للنص فقط على الموبايل */}
              <span aria-hidden className="md:hidden absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--paper)] to-transparent" />
            </>
          ) : (
            // عرض رمزي بدون صورة - 3 خطوط على خلفية كريمية
            <div className="w-full h-full flex items-center justify-center bg-[var(--paper-tinted)]">
              <div className="flex flex-col gap-2.5 px-10">
                <span className="h-1.5 w-32 rounded-full bg-[var(--accent)] opacity-80" />
                <span className="h-1.5 w-24 rounded-full bg-[var(--accent-soft)] opacity-60" />
                <span className="h-1.5 w-28 rounded-full bg-[var(--accent-light)]" />
              </div>
            </div>
          )}

          {article.isBreaking && (
            <div className="absolute bottom-3 right-3">
              <span className="breaking-badge">عاجل</span>
            </div>
          )}
        </div>

        {/* النص */}
        <div className="p-6 md:p-9 md:col-span-7 md:order-1 flex flex-col justify-center bg-[var(--paper)]">
          {/* meta علوي */}
          <div className="flex items-center flex-wrap gap-x-2.5 gap-y-1 mb-5">
            <span className={`cat-badge cat-${article.category}`}>
              {CATEGORY_LABELS[article.category]}
            </span>
            <span aria-hidden className="text-[var(--ink-whisper)]">/</span>
            <span className="text-[11px] font-semibold tracking-wider text-[var(--ink-soft)] tnum">
              {arabicTimeAgo(article.publishedAt || article.createdAt)}
            </span>
            <span aria-hidden className="text-[var(--ink-whisper)]">/</span>
            <span className="read-time">
              <Clock3 className="w-3 h-3" />
              {toArabicNum(seconds)} ث
            </span>
          </div>

          {/* العنوان (السطر الأول) */}
          <h2 className="text-[1.5rem] md:text-[2rem] font-black leading-[1.15] text-[var(--ink)] mb-5 tracking-tight">
            {article.line1}
          </h2>

          {/* السطر ٢ والـ ٣ */}
          <div className="space-y-3 mb-6 pr-3 border-r-[2px] border-[var(--accent-light)]">
            <p className="text-[14px] md:text-[15px] font-medium leading-relaxed text-[var(--ink-soft)]">
              {article.line2}
            </p>
            <p className="text-[14px] md:text-[15px] font-bold italic leading-relaxed text-[var(--accent)]">
              {article.line3}
            </p>
          </div>

          {/* CTA */}
          <Link
            href={`/article/${article.id}`}
            className="self-start inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.15em] uppercase text-[var(--accent)] hover:gap-3 transition-all group"
          >
            <span>اقرأ التفاصيل</span>
            <ArrowLeft className="w-3 h-3 group-hover:translate-x-[-2px] transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
