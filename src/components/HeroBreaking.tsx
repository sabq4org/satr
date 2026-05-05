'use client';

import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { Article } from '@/lib/db/schema';
import { CATEGORY_LABELS, arabicTimeAgo } from '@/lib/utils';

export default function HeroBreaking({ article }: { article: Article }) {
  return (
    <article className="relative mb-12 overflow-hidden satr-card">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[420px]">
        {/* الصورة */}
        <div className="relative h-64 md:h-auto bg-gradient-to-br from-[var(--accent)] to-[#0d2440] overflow-hidden order-1 md:order-2">
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
        <div className="p-6 md:p-10 flex flex-col justify-center order-2 md:order-1">
          <p className="text-xs font-bold tracking-widest text-[var(--accent)] mb-4">
            {arabicTimeAgo(article.publishedAt || article.createdAt)} •{' '}
            {CATEGORY_LABELS[article.category]}
          </p>

          <div className="space-y-4 mb-6">
            <p className="text-xl md:text-2xl font-black leading-relaxed text-[var(--ink)]">
              {article.line1}
            </p>
            <p className="text-base md:text-lg font-medium leading-relaxed text-[var(--ink-soft)]">
              {article.line2}
            </p>
            <div className="relative pr-4 border-r-4 border-[var(--accent)]">
              <p className="text-base md:text-lg font-bold italic leading-relaxed text-[var(--accent)]">
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
