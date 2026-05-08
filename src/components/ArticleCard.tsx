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

// خبر "جديد" إذا < ساعتين
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

  // featured: بطاقة أفقية عريضة (صورة يمين + نص يسار)
  if (variant === 'featured') {
    return (
      <article className={cn('satr-card overflow-hidden group relative flex flex-col md:flex-row', fresh && 'satr-card-fresh')}>
        <span aria-hidden className="absolute right-0 top-0 bottom-0 w-[3px] opacity-70 group-hover:opacity-100 transition-opacity" style={{ background: `var(--${article.category})` }} />
        <Link href={articleUrl} className="absolute inset-0 z-10" aria-label={`اقرأ: ${article.line1}`}>
          <span className="sr-only">{article.line1}</span>
        </Link>
        {article.imageUrl && (
          <div className="relative w-full md:w-72 lg:w-80 flex-shrink-0 h-48 md:h-auto overflow-hidden bg-[var(--accent-light)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.imageUrl} alt={article.imageAlt || article.line1} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" loading="lazy" />
            <span aria-hidden className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/30 to-transparent" />
            {article.isBreaking && <div className="absolute top-3 right-3"><span className="breaking-badge">عاجل</span></div>}
          </div>
        )}
        <div className="p-5 flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs flex-wrap">
              <span className={`cat-badge cat-${article.category}`}>{CATEGORY_LABELS[article.category]}</span>
              <span className="read-time"><Clock3 className="w-3 h-3" />{toArabicNum(seconds)} ث</span>
              <span className="text-[var(--ink-faint)] mr-auto">{arabicTimeAgo(article.publishedAt || article.createdAt)}</span>
            </div>
            <div className="space-y-2 mb-4">
              <p className="satr-line satr-line-1 text-lg">{article.line1}</p>
              <p className="satr-line satr-line-2">{article.line2}</p>
              <p className="satr-line satr-line-3">{article.line3}</p>
            </div>
          </div>
          <div className="relative z-20 flex items-center gap-2 pt-3 border-t border-[var(--border)]">
            <button onClick={handleDeepen} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[var(--accent)] bg-[var(--accent-light)] hover:bg-[var(--accent)] hover:text-white transition-all">
              <Sparkles className="w-3.5 h-3.5" />{showDeepen ? 'إخفاء' : 'وضّح أكثر'}
            </button>
            <button onClick={(e) => { stop(e); setLiked(!liked); }} className={cn('p-1.5 rounded-full hover:bg-[var(--accent-light)] transition-colors mr-auto', liked && 'text-red-500')} aria-label="إعجاب">
              <Heart className={cn('w-4 h-4', liked && 'fill-current')} />
            </button>
            <button onClick={(e) => { stop(e); setSaved(!saved); }} className={cn('p-1.5 rounded-full hover:bg-[var(--accent-light)] transition-colors', saved && 'text-[var(--accent)]')} aria-label="حفظ">
              <Bookmark className={cn('w-4 h-4', saved && 'fill-current')} />
            </button>
            <button onClick={shareArticle} className="p-1.5 rounded-full hover:bg-[var(--accent-light)] transition-colors" aria-label="مشاركة">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
          {showDeepen && (
            <div onClick={stop} className="relative z-20 mt-3 p-3 bg-[var(--accent-light)]/40 rounded-xl border border-[var(--accent-light)] fade-in-up">
              {deepening ? <div className="flex items-center gap-2 text-sm text-[var(--accent)]"><Sparkles className="w-4 h-4 animate-pulse" /><span>جاري التوسعة...</span></div>
              : <div className="space-y-2 text-sm leading-relaxed text-[var(--ink)]">{deepenContent?.map((p, i) => <p key={i}>{p}</p>)}</div>}
            </div>
          )}
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        'satr-card overflow-hidden group relative',
        fresh && 'satr-card-fresh',
      )}
    >
      {/* شريط لون القسم على اليمين كتوقيع تحريري */}
      <span
        aria-hidden
        className="absolute right-0 top-0 bottom-0 w-[3px] opacity-70 group-hover:opacity-100 transition-opacity"
        style={{ background: `var(--${article.category})` }}
      />

      {/* الرابط الرئيسي يغطي البطاقة (إلا الأزرار) */}
      <Link
        href={articleUrl}
        className="absolute inset-0 z-10"
        aria-label={`اقرأ: ${article.line1}`}
      >
        <span className="sr-only">{article.line1}</span>
      </Link>

      {/* الصورة */}
      {article.imageUrl && variant !== 'compact' && (
        <div
          className={cn(
            'relative w-full overflow-hidden bg-[var(--accent-light)]',
            'h-36',
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.imageUrl}
            alt={article.imageAlt || article.line1}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          {/* تدرج خفيف يدعم القراءة */}
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/30 to-transparent" />

          {article.isBreaking && (
            <div className="absolute top-3 right-3">
              <span className="breaking-badge">عاجل</span>
            </div>
          )}
        </div>
      )}

      <div className={cn('relative', variant === 'compact' ? 'p-3' : 'p-4')}>
        {/* السطر العلوي: التصنيف + الوقت + وقت القراءة */}
        <div className="flex items-center justify-between mb-4 text-xs gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className={`cat-badge cat-${article.category}`}>
              {CATEGORY_LABELS[article.category]}
            </span>
            {article.isBreaking && !article.imageUrl && (
              <span className="breaking-badge">عاجل</span>
            )}
            <span className="read-time" title="وقت القراءة التقريبي">
              <Clock3 className="w-3 h-3" />
              {toArabicNum(seconds)} ث
            </span>
          </div>
          <span className="text-[var(--ink-faint)]">
            {arabicTimeAgo(article.publishedAt || article.createdAt)}
          </span>
        </div>

        {/* الأسطر الثلاثة - الجوهر */}
        <div className={cn('mb-3', variant === 'compact' ? 'space-y-1.5' : 'space-y-2')}>
          <p className={cn('satr-line satr-line-1', variant === 'compact' && 'text-sm')}>{article.line1}</p>
          <p className={cn('satr-line satr-line-2', variant === 'compact' && 'text-xs')}>{article.line2}</p>
          <p className={cn('satr-line satr-line-3', variant === 'compact' && 'text-xs')}>{article.line3}</p>
        </div>

        {/* AI Deepen */}
        {showDeepen && (
          <div
            onClick={stop}
            className="relative z-20 mb-4 p-4 bg-[var(--accent-light)]/40 rounded-xl border border-[var(--accent-light)] fade-in-up"
          >
            {deepening ? (
              <div className="flex items-center gap-2 text-sm text-[var(--accent)]">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>جاري التوسعة...</span>
              </div>
            ) : (
              <div className="space-y-3 text-sm leading-relaxed text-[var(--ink)]">
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
        <div className="relative z-20 flex items-center justify-between pt-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-1">
            <button
              onClick={handleDeepen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[var(--accent)] bg-[var(--accent-light)] hover:bg-[var(--accent)] hover:text-white transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {showDeepen ? 'إخفاء' : 'وضّح أكثر'}
            </button>
            <Link
              href={articleUrl}
              onClick={stop}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-[var(--ink-soft)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)] transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              تابع القراءة
            </Link>
          </div>

          <div className="flex items-center gap-1 text-[var(--ink-soft)]">
            {trust && (
              <span className="text-xs ml-2" title={trust.label}>
                {trust.icon}
              </span>
            )}
            <button
              onClick={(e) => {
                stop(e);
                setLiked(!liked);
              }}
              className={cn(
                'p-1.5 rounded-full hover:bg-[var(--accent-light)] transition-colors',
                liked && 'text-red-500',
              )}
              aria-label="إعجاب"
              aria-pressed={liked}
            >
              <Heart className={cn('w-4 h-4', liked && 'fill-current')} />
            </button>
            <button
              onClick={(e) => {
                stop(e);
                setSaved(!saved);
              }}
              className={cn(
                'p-1.5 rounded-full hover:bg-[var(--accent-light)] transition-colors',
                saved && 'text-[var(--accent)]',
              )}
              aria-label="حفظ"
              aria-pressed={saved}
            >
              <Bookmark className={cn('w-4 h-4', saved && 'fill-current')} />
            </button>
            <button
              onClick={shareArticle}
              className="p-1.5 rounded-full hover:bg-[var(--accent-light)] transition-colors"
              aria-label="مشاركة"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
