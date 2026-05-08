'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  LayoutGrid,
  Rows3,
  Sparkles,
  ArrowLeft,
  Heart,
  Bookmark,
} from 'lucide-react';
import type { Article } from '@/lib/db/schema';
import {
  CATEGORY_LABELS,
  SOURCE_TRUST_LABELS,
  arabicTimeAgo,
  cn,
  readTime,
  toArabicNum,
} from '@/lib/utils';
import ArticleCard from './ArticleCard';

interface Props {
  articles: Article[];
}

type Mode = 'cards' | 'stream';

const STORAGE_KEY = 'satr-reading-mode';

/**
 * عرض ذكي للأخبار مع زر تبديل بين:
 *  • cards   — البطاقات الكلاسيكية (افتراضي)
 *  • stream  — وضع "القراءة الموجزة" — قائمة عمودية صحفية
 *              يقرأ القارئ كل أخبار اليوم في الواجهة في ٢-٣ دقائق
 */
export default function NewsFeed({ articles }: Props) {
  const [mode, setMode] = useState<Mode>('cards');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Mode | null;
    if (saved === 'cards' || saved === 'stream') setMode(saved);
    setMounted(true);
  }, []);

  function changeMode(m: Mode) {
    setMode(m);
    try {
      localStorage.setItem(STORAGE_KEY, m);
    } catch {}
  }

  return (
    <div>
      {/* شريط التبديل */}
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <p className="text-[11.5px] text-[var(--ink-faint)] tracking-wide">
          {mode === 'stream'
            ? 'وضع القراءة الموجزة — تصفّح كل الأخبار سريعاً'
            : 'بطاقات تفصيلية — اضغط على البطاقة للمتابعة'}
        </p>

        <div
          role="tablist"
          aria-label="نمط العرض"
          className="inline-flex p-0.5 rounded-full bg-[var(--paper-tinted)] border border-[var(--border-soft)]"
        >
          <button
            role="tab"
            aria-selected={mode === 'cards'}
            onClick={() => changeMode('cards')}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-bold transition-all',
              mode === 'cards'
                ? 'bg-[var(--paper)] text-[var(--accent)] shadow-sm'
                : 'text-[var(--ink-soft)] hover:text-[var(--ink)]',
            )}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            بطاقات
          </button>
          <button
            role="tab"
            aria-selected={mode === 'stream'}
            onClick={() => changeMode('stream')}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-bold transition-all',
              mode === 'stream'
                ? 'bg-[var(--paper)] text-[var(--accent)] shadow-sm'
                : 'text-[var(--ink-soft)] hover:text-[var(--ink)]',
            )}
          >
            <Rows3 className="w-3.5 h-3.5" />
            موجز سريع
          </button>
        </div>
      </div>

      {/* المحتوى */}
      {!mounted || mode === 'cards' ? (
        <CardsLayout articles={articles} />
      ) : (
        <StreamLayout articles={articles} />
      )}
    </div>
  );
}

function CardsLayout({ articles }: { articles: Article[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 section-fade">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}

/**
 * وضع "موجز سريع" — قائمة عمودية ناعمة، الأسطر الثلاثة كاملة، صور صغيرة جانبية اختيارية.
 * يجمع كل أخبار اليوم في عمود واحد قابل للتمرير السريع.
 */
function StreamLayout({ articles }: { articles: Article[] }) {
  // تجميع حسب الساعة لإضافة "علامات وقت"
  const grouped = useMemo(() => groupByHour(articles), [articles]);

  return (
    <ol className="paper-card divide-y divide-[var(--border-soft)] overflow-hidden section-fade">
      {grouped.map((group, gi) => (
        <li key={gi}>
          {/* علامة وقت — رمز "ساعة الأخبار" */}
          {group.label && (
            <div className="px-5 py-2 flex items-center gap-3 bg-[var(--paper-tinted)] border-b border-[var(--border-soft)]">
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[var(--accent)] tnum">
                {group.label}
              </span>
              <span className="flex-1 h-px bg-[var(--border-soft)]" />
              <span className="text-[10px] text-[var(--ink-faint)] tnum">
                {toArabicNum(group.items.length)}{' '}
                {group.items.length === 1 ? 'خبر' : 'خبراً'}
              </span>
            </div>
          )}
          <ul className="divide-y divide-[var(--border-soft)]">
            {group.items.map((a, i) => (
              <StreamRow key={a.id} article={a} idx={i + 1} />
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

function StreamRow({ article, idx }: { article: Article; idx: number }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDeepen, setShowDeepen] = useState(false);
  const [deepenContent, setDeepenContent] = useState<string[] | null>(null);
  const [deepening, setDeepening] = useState(false);

  const trust = article.sourceTrust ? SOURCE_TRUST_LABELS[article.sourceTrust] : null;
  const seconds = readTime(article.line1, article.line2, article.line3);

  async function toggleDeepen(e: React.MouseEvent) {
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

  return (
    <li className="group relative">
      {/* خط لون القسم على اليمين */}
      <span
        aria-hidden
        className="absolute right-0 top-5 bottom-5 w-[2px] rounded-full opacity-40 group-hover:opacity-90 transition-opacity"
        style={{ background: `var(--${article.category})` }}
      />

      <Link
        href={`/article/${article.id}`}
        className="absolute inset-0 z-0"
        aria-label={`اقرأ: ${article.line1}`}
      />

      <div className="relative px-5 md:px-7 py-5 hover:bg-[var(--paper-tinted)] transition-colors">
        <div className="flex items-start gap-4">
          {/* رقم */}
          <span
            aria-hidden
            className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--accent-wash)] text-[var(--accent)] text-xs font-black flex items-center justify-center mt-1 tnum"
          >
            {toArabicNum(idx)}
          </span>

          <div className="flex-1 min-w-0">
            {/* meta */}
            <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 mb-2 text-[11px]">
              <span className={`cat-badge cat-${article.category}`}>
                {CATEGORY_LABELS[article.category]}
              </span>
              {article.isBreaking && <span className="breaking-badge">عاجل</span>}
              <span className="text-[var(--ink-faint)] tnum">
                {arabicTimeAgo(article.publishedAt || article.createdAt)}
              </span>
              <span aria-hidden className="text-[var(--ink-whisper)]">·</span>
              <span className="read-time">{toArabicNum(seconds)} ث قراءة</span>
              {trust && (
                <>
                  <span aria-hidden className="text-[var(--ink-whisper)]">·</span>
                  <span className="text-[10px] opacity-70" title={trust.label}>
                    {trust.icon}
                  </span>
                </>
              )}
            </div>

            {/* الأسطر الثلاثة */}
            <div className="three-lines mb-3">
              <p className="line-1">{article.line1}</p>
              <p className="line-2">{article.line2}</p>
              <p className="line-3">{article.line3}</p>
            </div>

            {/* AI deepen المدمج */}
            {showDeepen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 mt-3 mb-2 p-3.5 rounded-xl bg-[var(--accent-wash)] border border-[var(--accent-light)] fade-in-up"
              >
                {deepening ? (
                  <div className="flex items-center gap-2 text-[13px] text-[var(--accent)]">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span>جاري التوسعة...</span>
                  </div>
                ) : (
                  <div className="space-y-2.5 text-[13px] leading-relaxed text-[var(--ink)]">
                    {deepenContent?.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* أزرار التفاعل */}
            <div className="relative z-10 flex items-center gap-1 mt-2 -mr-1">
              <button
                onClick={toggleDeepen}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-semibold text-[var(--accent)] bg-[var(--accent-wash)] hover:bg-[var(--accent)] hover:text-white transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                {showDeepen ? 'إخفاء' : 'وضّح'}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setLiked(!liked);
                }}
                className={cn(
                  'p-1.5 rounded-full transition-colors',
                  liked
                    ? 'text-[var(--breaking)]'
                    : 'text-[var(--ink-faint)] hover:bg-[var(--accent-wash)] hover:text-[var(--breaking)]',
                )}
                aria-label="إعجاب"
              >
                <Heart className={cn('w-3.5 h-3.5', liked && 'fill-current')} />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSaved(!saved);
                }}
                className={cn(
                  'p-1.5 rounded-full transition-colors',
                  saved
                    ? 'text-[var(--accent)]'
                    : 'text-[var(--ink-faint)] hover:bg-[var(--accent-wash)] hover:text-[var(--accent)]',
                )}
                aria-label="حفظ"
              >
                <Bookmark className={cn('w-3.5 h-3.5', saved && 'fill-current')} />
              </button>
            </div>
          </div>

          {/* صورة صغيرة جانبية - اختياري */}
          {article.imageUrl && (
            <div className="hidden md:block flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-[var(--accent-wash)] mt-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.imageUrl}
                alt={article.imageAlt || article.line1}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
          )}
        </div>

        {/* سهم على الجنب */}
        <ArrowLeft className="hidden md:block absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-whisper)] group-hover:text-[var(--accent)] group-hover:translate-x-[-2px] transition-all pointer-events-none" />
      </div>
    </li>
  );
}

// تجميع الأخبار حسب الساعة (تايملاين اليوم)
function groupByHour(articles: Article[]): { label: string | null; items: Article[] }[] {
  if (articles.length === 0) return [];

  // تجميع حسب الساعة
  const buckets: Record<string, Article[]> = {};
  const order: string[] = [];

  articles.forEach((a) => {
    const d = a.publishedAt || a.createdAt;
    const date = d ? (typeof d === 'string' ? new Date(d) : d) : null;
    let key: string;
    if (date) {
      const now = new Date();
      const sameDay =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();
      if (sameDay) {
        const h = date.getHours();
        key = `${String(h).padStart(2, '0')}:00`;
      } else {
        key = 'سابقاً';
      }
    } else {
      key = 'سابقاً';
    }
    if (!buckets[key]) {
      buckets[key] = [];
      order.push(key);
    }
    buckets[key].push(a);
  });

  // إذا كل الأخبار في bucket واحدة (سابقاً)، نلغي العلامات
  if (order.length === 1 && order[0] === 'سابقاً') {
    return [{ label: null, items: articles }];
  }

  return order.map((key) => ({
    label: key === 'سابقاً' ? 'أخبار سابقة' : toArabicNum(key),
    items: buckets[key],
  }));
}
