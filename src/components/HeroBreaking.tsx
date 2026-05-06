'use client';

import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { Article } from '@/lib/db/schema';
import { CATEGORY_LABELS, arabicTimeAgo } from '@/lib/utils';

export default function HeroBreaking({ article }: { article: Article }) {
  return (
    <article className="relative mb-10 overflow-hidden satr-card">
      <div className="grid grid-cols-1 md:grid-cols-5 min-h-[280px] md:min-h-[320px]">
        {/* الصورة */}
        <div className="relative h-48 md:h-auto md:col-span-2 bg-gradient-to-br from-[var(--accent)] to-[#0d2440] overflow-hidden order-1 md:order-2">
          {article.imageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.imageUrl}
                alt={article.imageAlt || article.line1}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[var(--paper)]/20 md:to-[var(--paper)]/0" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white/10 text-[10rem] font-black">سطر</span>
            </div>
          )}
          <div className="absolute top-4 right-4 flex gap-2">
            {article.isBreaking && <span className="breaking-badge text-sm">عاجل</span>}
            <span className={`cat-badge cat-${article.category} backdrop-blur-md`}>
              {CATEGORY_LABELS[article.category]}
            </span>
          </div>
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white/90 text-xs font-semibold">
            <Sparkles className="w-3 h-3" />
            <span>الموجز المميز</span>
          </div>
        </div>

        {/* النص */}
        <div className="p-5 md:p-7 md:col-span-3 flex flex-col justify-center order-2 md:order-1">
          <p className="text-[11px] font-bold tracking-widest text-[var(--accent)] mb-3">
            {arabicTimeAgo(article.publishedAt || article.createdAt)} •{' '}
            {CATEGORY_LABELS[article.category]}
          </p>

          <div className="space-y-2.5 mb-4">
            <p className="text-lg md:text-xl font-black leading-snug text-[var(--ink)]">
              {article.line1}
            </p>
            <p className="text-sm md:text-base font-medium leading-relaxed text-[var(--ink-soft)]">
              {article.line2}
            </p>
            <div className="relative pr-3 border-r-[3px] border-[var(--accent)]">
              <p className="text-sm md:text-base font-bold italic leading-relaxed text-[var(--accent)]">
                {article.line3}
              </p>
            </div>
          </div>

          <Link
            href={`/article/${article.id}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--accent)] hover:gap-3 transition-all group"
          >
            <span>اقرأ التفاصيل</span>
            <ArrowLeft className="w-4 h-4 group-hover:translate-x-[-2px] transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
