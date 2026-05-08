'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bookmark, Share2, Sparkles, Heart, Clock3 } from 'lucide-react';
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
}

function isFresh(article: Article): boolean {
  const d = article.publishedAt || article.createdAt;
  if (!d) return false;
  const date = typeof d === 'string' ? new Date(d) : d;
  return Date.now() - date.getTime() < 2 * 60 * 60 * 1000;
}

export default function ArticleCard({ article }: Props) {
  const [saved, setSaved]       = useState(false);
  const [liked, setLiked]       = useState(false);
  const [showDeepen, setShowDeepen]   = useState(false);
  const [deepening, setDeepening]     = useState(false);
  const [deepenContent, setDeepenContent] = useState<string[] | null>(null);

  async function handleDeepen(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setShowDeepen(!showDeepen);
    if (deepenContent) return;
    setDeepening(true);
    try {
      const res  = await fetch(`/api/articles/${article.id}/deepen`, { method: 'POST' });
      const data = await res.json();
      setDeepenContent(data.paragraphs || []);
    } finally {
      setDeepening(false);
    }
  }

  function stop(e: React.MouseEvent) { e.stopPropagation(); e.preventDefault(); }

  function shareArticle(e: React.MouseEvent) {
    stop(e);
    const url  = `${window.location.origin}/article/${article.id}`;
    const text = `${article.line1}\n\n${article.line2}\n\n${article.line3}\n\n— من سطر`;
    if (navigator.share) {
      navigator.share({ title: article.line1, text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`);
    }
  }

  const trust      = article.sourceTrust ? SOURCE_TRUST_LABELS[article.sourceTrust] : null;
  const articleUrl = `/article/${article.id}`;
  const seconds    = readTime(article.line1, article.line2, article.line3);
  const fresh      = isFresh(article);

  return (
    <article className={cn('satr-card overflow-hidden group relative flex flex-col', fresh && 'satr-card-fresh')}>

      {/* شريط لون القسم */}
      <span
        aria-hidden
        className="absolute right-0 top-0 bottom-0 w-[3px] opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ background: `var(--${article.category})` }}
      />

      {/* رابط يغطي البطاقة كاملاً */}
      <Link href={articleUrl} className="absolute inset-0 z-10" aria-label={`اقرأ: ${article.line1}`}>
        <span className="sr-only">{article.line1}</span>
      </Link>

      {/* الصورة */}
      {article.imageUrl && (
        <div className="relative w-full h-44 overflow-hidden bg-[var(--accent-light)] flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.imageUrl}
            alt={article.imageAlt || article.line1}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/25 to-transparent" />
          {article.isBreaking && (
            <div className="absolute top-3 right-3">
              <span className="breaking-badge">عاجل</span>
            </div>
          )}
        </div>
      )}

      {/* المحتوى */}
      <div className="p-4 flex flex-col flex-1">

        {/* الميتا: قسم + وقت + توقيت */}
        <div className="flex items-center gap-2 mb-3 text-xs flex-wrap">
          <span className={`cat-badge cat-${article.category}`}>{CATEGORY_LABELS[article.category]}</span>
          {article.isBreaking && !article.imageUrl && <span className="breaking-badge">عاجل</span>}
          <span className="read-time"><Clock3 className="w-3 h-3" />{toArabicNum(seconds)} ث</span>
          <span className="text-[var(--ink-faint)] mr-auto">{arabicTimeAgo(article.publishedAt || article.createdAt)}</span>
        </div>

        {/* الأسطر الثلاثة */}
        <div className="space-y-2 flex-1">
          <p className="satr-line satr-line-1">{article.line1}</p>
          <p className="satr-line satr-line-2">{article.line2}</p>
          <p className="satr-line satr-line-3">{article.line3}</p>
        </div>

        {/* AI Deepen */}
        {showDeepen && (
          <div onClick={stop} className="relative z-20 mt-3 p-3 bg-[var(--accent-light)]/50 rounded-xl border border-[var(--accent-light)] fade-in-up">
            {deepening
              ? <div className="flex items-center gap-2 text-sm text-[var(--accent)]"><Sparkles className="w-4 h-4 animate-pulse" /><span>جاري التوسعة…</span></div>
              : <div className="space-y-2 text-sm leading-relaxed text-[var(--ink)]">{deepenContent?.map((p, i) => <p key={i}>{p}</p>)}</div>
            }
          </div>
        )}

        {/* الوسوم */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {article.tags.slice(0, 3).map((tag) => (
              <Link key={tag} href={`/tag/${encodeURIComponent(tag)}`} onClick={(e) => e.stopPropagation()} className="tag relative z-20">
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* أزرار */}
        <div className="relative z-20 flex items-center justify-between pt-3 mt-3 border-t border-[var(--border)]">
          <button
            onClick={handleDeepen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[var(--accent)] bg-[var(--accent-light)] hover:bg-[var(--accent)] hover:text-white transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {showDeepen ? 'إخفاء' : 'وضّح أكثر'}
          </button>

          <div className="flex items-center gap-0.5 text-[var(--ink-soft)]">
            {trust && <span className="text-xs ml-1" title={trust.label}>{trust.icon}</span>}
            <button
              onClick={(e) => { stop(e); setLiked(!liked); }}
              className={cn('p-1.5 rounded-full hover:bg-[var(--accent-light)] transition-colors', liked && 'text-red-500')}
              aria-label="إعجاب"
            >
              <Heart className={cn('w-4 h-4', liked && 'fill-current')} />
            </button>
            <button
              onClick={(e) => { stop(e); setSaved(!saved); }}
              className={cn('p-1.5 rounded-full hover:bg-[var(--accent-light)] transition-colors', saved && 'text-[var(--accent)]')}
              aria-label="حفظ"
            >
              <Bookmark className={cn('w-4 h-4', saved && 'fill-current')} />
            </button>
            <button onClick={shareArticle} className="p-1.5 rounded-full hover:bg-[var(--accent-light)] transition-colors" aria-label="مشاركة">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
