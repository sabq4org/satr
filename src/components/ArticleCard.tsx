'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bookmark, Share2, Sparkles, Heart, ArrowLeft, Clock3 } from 'lucide-react';
import type { Article } from '@/lib/db/schema';
import {
  CATEGORY_LABELS,
  SOURCE_TRUST_LABELS,
  arabicTimeAgo,
  cn,
  readTime,
  toArabicNum,
} from '@/lib/utils';

interface Props {
  article: Article;
  variant?: 'default' | 'featured' | 'compact';
}

function isFresh(article: Article): boolean {
  const d = article.publishedAt || article.createdAt;
  if (!d) return false;
  const date = typeof d === 'string' ? new Date(d) : d;
  return Date.now() - date.getTime() < 2 * 60 * 60 * 1000;
}

export default function ArticleCard({ article, variant = 'default' }: Props) {
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showDeepen, setShowDeepen] = useState(false);
  const [deepening, setDeepening] = useState(false);
  const [deepenContent, setDeepenContent] = useState<string[] | null>(null);

  async function handleDeepen(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setShowDeepen(!showDeepen);
    if (deepenContent) return;
    setDeepening(true);
    try {
      const res = await fetch(`/api/articles/${article.id}/deepen`, { method: 'POST' });
      const data = await res.json();
      setDeepenContent(data.paragraphs || []);
    } finally {
      setDeepening(false);
    }
  }

  function stop(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
  }

  function shareArticle(e: React.MouseEvent) {
    stop(e);
    const url = `${window.location.origin}/article/${article.id}`;
    const text = `${article.line1}\n\n${article.line2}\n\n${article.line3}\n\n— من سطر`;
    if (navigator.share) {
      navigator.share({ title: article.line1, text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`);
    }
  }

  const trust = article.sourceTrust ? SOURCE_TRUST_LABELS[article.sourceTrust] : null;
  const articleUrl = `/article/${article.id}`;
  const seconds = readTime(article.line1, article.line2, article.line3);
  const fresh = isFresh(article);

  return (
    <article
      className={cn(
        'satr-card overflow-hidden group relative',
        fresh && 'satr-card-fresh',
        variant === 'featured' && 'lg:col-span-2',
      )}
    >
      {/* شريط لون القسم على اليمين — خط حريري رفيع */}
      <span
        aria-hidden
        className="absolute right-0 top-4 bottom-4 w-[2px] rounded-full opacity-50 group-hover:opacity-90 transition-opacity"
        style={{ background: `var(--${article.category})` }}
      />

      <Link
        href={articleUrl}
        className="absolute inset-0 z-10"
        aria-label={`اقرأ: ${article.line1}`}
      >
        <span className="sr-only">{article.line1}</span>
      </Link>

      {/* الصورة — أبرز ومع بادج قسم متراكب */}
      {article.imageUrl && variant !== 'compact' && (
        <div
          className={cn(
            'relative w-full overflow-hidden',
            variant === 'featured' ? 'h-64 md:h-80' : 'h-48',
          )}
          style={{ background: `linear-gradient(135deg, var(--${article.category}) 0%, var(--accent-deep) 100%)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.imageUrl}
            alt={article.imageAlt || article.line1}
            className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-[900ms] ease-out"
            loading="lazy"
          />
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

          {/* قسم على الصورة */}
          <span
            className="absolute top-3 right-3 inline-flex items-center px-2 py-1 rounded-full text-[10px] font-black tracking-[0.18em] uppercase text-white backdrop-blur-sm shadow-md"
            style={{ background: `color-mix(in oklab, var(--${article.category}) 88%, transparent)` }}
          >
            {CATEGORY_LABELS[article.category]}
          </span>

          {article.isBreaking && (
            <div className="absolute top-3 left-3">
              <span className="breaking-badge">عاجل</span>
            </div>
          )}

          {/* وقت القراءة على الصورة */}
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/45 backdrop-blur-sm text-white text-[10.5px] font-bold tnum">
            <Clock3 className="w-2.5 h-2.5" />
            {toArabicNum(seconds)} ث
          </span>
        </div>
      )}

      <div className="p-5 md:p-6 relative">
        {/* السطر العلوي: مبسّط لأن القسم/وقت القراءة على الصورة */}
        <div className="flex items-center justify-between mb-4 text-xs gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            {/* عرض القسم نصياً فقط إذا لا توجد صورة */}
            {!article.imageUrl && (
              <span className={`cat-badge cat-${article.category}`}>
                {CATEGORY_LABELS[article.category]}
              </span>
            )}
            {article.isBreaking && !article.imageUrl && (
              <span className="breaking-badge">عاجل</span>
            )}
            {fresh && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--breaking)]">
                <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
                جديد
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[var(--ink-faint)]">
            {!article.imageUrl && (
              <>
                <span className="read-time" title="وقت القراءة التقريبي">
                  <Clock3 className="w-3 h-3" />
                  {toArabicNum(seconds)}ث
                </span>
                <span aria-hidden className="w-px h-3 bg-[var(--border)]" />
              </>
            )}
            <span className="text-[11px] tnum font-semibold">
              {arabicTimeAgo(article.publishedAt || article.createdAt)}
            </span>
          </div>
        </div>

        {/* الأسطر الثلاثة بفواصل ناعمة (بدون نقاط) — أسلوب صحفي */}
        <div className="three-lines mb-5">
          <p className="line-1">{article.line1}</p>
          <p className="line-2">{article.line2}</p>
          <p className="line-3">{article.line3}</p>
        </div>

        {/* AI Deepen */}
        {showDeepen && (
          <div
            onClick={stop}
            className="relative z-20 mb-4 p-4 bg-[var(--accent-wash)] rounded-xl border border-[var(--accent-light)] fade-in-up"
          >
            {deepening ? (
              <div className="flex items-center gap-2 text-sm text-[var(--accent)]">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>جاري التوسعة...</span>
              </div>
            ) : (
              <div className="space-y-3 text-[13.5px] leading-relaxed text-[var(--ink)]">
                {deepenContent?.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {article.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/tag/${encodeURIComponent(tag)}`}
                onClick={(e) => e.stopPropagation()}
                className="tag relative z-20"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* أزرار الإجراءات */}
        <div className="relative z-20 flex items-center justify-between pt-4 border-t border-[var(--border-soft)]">
          <div className="flex items-center gap-1">
            <button
              onClick={handleDeepen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold text-[var(--accent)] bg-[var(--accent-wash)] hover:bg-[var(--accent)] hover:text-white transition-all"
            >
              <Sparkles className="w-3 h-3" />
              {showDeepen ? 'إخفاء' : 'وضّح أكثر'}
            </button>
            <Link
              href={articleUrl}
              onClick={stop}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold text-[var(--ink-soft)] hover:bg-[var(--accent-wash)] hover:text-[var(--accent)] transition-all"
            >
              <ArrowLeft className="w-3 h-3" />
              تابع القراءة
            </Link>
          </div>

          <div className="flex items-center gap-0.5 text-[var(--ink-soft)]">
            {trust && (
              <span className="text-[10px] ml-1 opacity-70" title={trust.label}>
                {trust.icon}
              </span>
            )}
            <button
              onClick={(e) => {
                stop(e);
                setLiked(!liked);
              }}
              className={cn(
                'p-1.5 rounded-full hover:bg-[var(--accent-wash)] transition-colors',
                liked && 'text-[var(--breaking)]',
              )}
              aria-label="إعجاب"
              aria-pressed={liked}
            >
              <Heart className={cn('w-3.5 h-3.5', liked && 'fill-current')} />
            </button>
            <button
              onClick={(e) => {
                stop(e);
                setSaved(!saved);
              }}
              className={cn(
                'p-1.5 rounded-full hover:bg-[var(--accent-wash)] transition-colors',
                saved && 'text-[var(--accent)]',
              )}
              aria-label="حفظ"
              aria-pressed={saved}
            >
              <Bookmark className={cn('w-3.5 h-3.5', saved && 'fill-current')} />
            </button>
            <button
              onClick={shareArticle}
              className="p-1.5 rounded-full hover:bg-[var(--accent-wash)] transition-colors"
              aria-label="مشاركة"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
