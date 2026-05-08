'use client';

import Link from 'next/link';
import { ArrowLeft, Clock3, Sparkles } from 'lucide-react';
import type { Article } from '@/lib/db/schema';
import { CATEGORY_LABELS, arabicTimeAgo, readTime, toArabicNum } from '@/lib/utils';

/**
 * هيرو سينمائي مدمج:
 *  • موبايل: صورة "غلاف" مع طبقة مظلّلة وعنوان متوهج (~210px)
 *  • ديسكتوب: لوحة جانبية أنيقة (~170px) — صورة + نص + لمسات
 *  • شارة "خبر اليوم" ذهبية + إيقاع ٣-أسطر مكثّف
 */
export default function HeroBreaking({ article }: { article: Article }) {
  const seconds = readTime(article.line1, article.line2, article.line3);
  const articleUrl = `/article/${article.id}`;
  const accent = `var(--${article.category})`;

  return (
    <article className="relative mb-7 overflow-hidden rounded-2xl border border-[var(--border)] shadow-[var(--shadow-paper)] group section-fade">
      {/* لمعة لون القسم في الجنب الأيمن */}
      <span aria-hidden className="absolute top-0 right-0 bottom-0 w-[3px] z-30" style={{ background: accent }} />

      <Link href={articleUrl} aria-label={`اقرأ التفاصيل: ${article.line1}`} className="absolute inset-0 z-20" />

      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* === الصورة === */}
        <div className="relative aspect-[16/9] md:aspect-auto md:h-[170px] md:col-span-5 md:order-2 bg-[var(--accent-deep)] overflow-hidden">
          {article.imageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.imageUrl}
                alt={article.imageAlt || article.line1}
                className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                loading="eager"
              />
              {/* تدرّج للنص على الموبايل */}
              <span aria-hidden className="md:hidden absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              {/* تدرّج جانبي للديسكتوب — يوحّد مع النص */}
              <span aria-hidden className="hidden md:block absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[var(--paper)] to-transparent" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${accent} 0%, var(--accent-deep) 100%)` }}>
              <div className="flex flex-col gap-2 px-8 opacity-60">
                <span className="h-1.5 w-20 rounded-full bg-white/80" />
                <span className="h-1.5 w-14 rounded-full bg-white/60" />
                <span className="h-1.5 w-16 rounded-full bg-white/40" />
              </div>
            </div>
          )}

          {/* شارة "خبر اليوم" ذهبية على الصورة */}
          <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--gold)] text-white text-[10.5px] font-black tracking-wider uppercase shadow-lg">
            <Sparkles className="w-3 h-3 fill-current" />
            خبر اليوم
          </span>

          {article.isBreaking && (
            <span className="absolute top-3 left-3 breaking-badge">عاجل</span>
          )}

          {/* العنوان كغلاف مجلة على الموبايل فقط */}
          <div className="md:hidden absolute inset-x-0 bottom-0 p-4 z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="cat-badge" style={{ background: 'rgba(255,255,255,0.95)', color: accent }}>
                {CATEGORY_LABELS[article.category]}
              </span>
              <span className="text-[10.5px] font-semibold tracking-widest uppercase text-white/85 tnum">
                {arabicTimeAgo(article.publishedAt || article.createdAt)}
              </span>
            </div>
            <h2 className="text-[19px] font-black leading-[1.25] text-white tracking-tight line-clamp-2 drop-shadow-sm">
              {article.line1}
            </h2>
          </div>
        </div>

        {/* === النص === */}
        <div className="hidden md:flex px-6 py-4 md:col-span-7 md:order-1 flex-col justify-center bg-[var(--paper)] min-w-0">
          {/* meta علوي */}
          <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 mb-2.5">
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

          <h2 className="text-[18px] font-black leading-[1.3] text-[var(--ink)] tracking-tight line-clamp-1 mb-1.5 group-hover:text-[var(--accent)] transition-colors">
            {article.line1}
          </h2>

          <div className="space-y-1 pr-3 border-r-2" style={{ borderColor: accent }}>
            <p className="text-[13px] font-medium leading-snug text-[var(--ink-soft)] line-clamp-1">
              {article.line2}
            </p>
            <p className="text-[13px] font-bold italic leading-snug text-[var(--accent)] line-clamp-1">
              {article.line3}
            </p>
          </div>
        </div>

        {/* === النص — الموبايل: مكمّل أسطر ٢ و٣ === */}
        <div className="md:hidden px-4 py-3.5 bg-[var(--paper)]">
          <div className="flex items-center gap-2 mb-2 text-[var(--ink-faint)]">
            <span className="read-time">
              <Clock3 className="w-3 h-3" />
              {toArabicNum(seconds)} ث
            </span>
            <span aria-hidden>·</span>
            <span className="text-[10.5px] font-semibold tracking-wider uppercase">السياق + المعنى</span>
          </div>
          <p className="text-[13px] leading-relaxed text-[var(--ink-soft)] line-clamp-1 mb-1">
            {article.line2}
          </p>
          <p className="text-[13px] font-bold italic leading-relaxed text-[var(--accent)] line-clamp-1">
            {article.line3}
          </p>
        </div>
      </div>

      {/* CTA دائرة في الزاوية */}
      <span
        aria-hidden
        className="absolute bottom-3 left-3 z-20 hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--accent)] text-white text-[10.5px] font-bold tracking-wider uppercase shadow-md group-hover:bg-[var(--accent-deep)] group-hover:translate-x-[-2px] transition-all"
      >
        التفاصيل
        <ArrowLeft className="w-3 h-3" />
      </span>
    </article>
  );
}
