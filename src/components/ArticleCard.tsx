'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Bookmark, Share2, Sparkles, Eye, Heart } from 'lucide-react';
import type { Article } from '@/lib/db/schema';
import { CATEGORY_LABELS, SOURCE_TRUST_LABELS, arabicTimeAgo, cn } from '@/lib/utils';

interface Props {
  article: Article;
  variant?: 'default' | 'featured' | 'compact';
}

export default function ArticleCard({ article, variant = 'default' }: Props) {
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showDeepen, setShowDeepen] = useState(false);
  const [deepening, setDeepening] = useState(false);
  const [deepenContent, setDeepenContent] = useState<string[] | null>(null);

  async function handleDeepen() {
    setShowDeepen(true);
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

  const trust = article.sourceTrust ? SOURCE_TRUST_LABELS[article.sourceTrust] : null;

  return (
    <article
      className={cn(
        'satr-card overflow-hidden group',
        variant === 'featured' && 'lg:col-span-2'
      )}
    >
      {/* الصورة */}
      {article.imageUrl && variant !== 'compact' && (
        <div className={cn('relative w-full overflow-hidden bg-[var(--accent-light)]',
          variant === 'featured' ? 'h-64 md:h-80' : 'h-48'
        )}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.imageUrl}
            alt={article.imageAlt || article.line1}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {article.isBreaking && (
            <div className="absolute top-3 right-3">
              <span className="breaking-badge">عاجل</span>
            </div>
          )}
        </div>
      )}

      <div className="p-5">
        {/* السطر العلوي: التصنيف + الوقت */}
        <div className="flex items-center justify-between mb-4 text-xs">
          <div className="flex items-center gap-2">
            <span className={`cat-badge cat-${article.category}`}>
              {CATEGORY_LABELS[article.category]}
            </span>
            {article.isBreaking && !article.imageUrl && (
              <span className="breaking-badge">عاجل</span>
            )}
          </div>
          <span className="text-[var(--ink-faint)]">
            {arabicTimeAgo(article.publishedAt || article.createdAt)}
          </span>
        </div>

        {/* الأسطر الثلاثة - الجوهر */}
        <div className="space-y-3 mb-5">
          <p className="satr-line satr-line-1">{article.line1}</p>
          <p className="satr-line satr-line-2">{article.line2}</p>
          <p className="satr-line satr-line-3">{article.line3}</p>
        </div>

        {/* AI Deepen */}
        {showDeepen && (
          <div className="mb-4 p-4 bg-[var(--accent-light)]/50 rounded-xl border border-[var(--accent-light)] animate-in fade-in slide-in-from-top-2">
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
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        )}

        {/* أزرار الإجراءات */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-1">
            <button
              onClick={handleDeepen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[var(--accent)] bg-[var(--accent-light)] hover:bg-[var(--accent)] hover:text-white transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {showDeepen ? 'إخفاء' : 'وضّح أكثر'}
            </button>
          </div>

          <div className="flex items-center gap-1 text-[var(--ink-soft)]">
            {trust && (
              <span className="text-xs ml-2" title={trust.label}>
                {trust.icon}
              </span>
            )}
            <button
              onClick={() => setLiked(!liked)}
              className={cn(
                'p-1.5 rounded-full hover:bg-[var(--accent-light)] transition-colors',
                liked && 'text-red-500'
              )}
            >
              <Heart className={cn('w-4 h-4', liked && 'fill-current')} />
            </button>
            <button
              onClick={() => setSaved(!saved)}
              className={cn(
                'p-1.5 rounded-full hover:bg-[var(--accent-light)] transition-colors',
                saved && 'text-[var(--accent)]'
              )}
            >
              <Bookmark className={cn('w-4 h-4', saved && 'fill-current')} />
            </button>
            <button className="p-1.5 rounded-full hover:bg-[var(--accent-light)] transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
