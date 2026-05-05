'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import {
  Heart,
  Bookmark,
  X,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Eye,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import type { Article } from '@/lib/db/schema';
import { CATEGORY_LABELS, SOURCE_TRUST_LABELS, arabicTimeAgo, cn } from '@/lib/utils';

interface Props {
  articles: Article[];
  initialIndex?: number;
  onClose?: () => void;
}

export default function StackView({ articles, initialIndex = 0, onClose }: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [actions, setActions] = useState<Record<string, 'liked' | 'saved' | 'skip' | undefined>>(
    {},
  );
  const total = articles.length;

  function next() {
    if (index < total - 1) setIndex(index + 1);
  }
  function prev() {
    if (index > 0) setIndex(index - 1);
  }

  function handleAction(action: 'liked' | 'saved' | 'skip') {
    const article = articles[index];
    if (article) {
      setActions((p) => ({ ...p, [article.id]: action }));
    }
    setTimeout(next, 200);
  }

  // اختصارات لوحة المفاتيح
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        prev();
      } else if (e.key === 'Escape') {
        onClose?.();
      } else if (e.key === 'h' || e.key === 'l') {
        handleAction('liked');
      } else if (e.key === 'b' || e.key === 's') {
        handleAction('saved');
      } else if (e.key === 'x') {
        handleAction('skip');
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index]);

  if (total === 0) return null;
  const current = articles[index];
  const visible = articles.slice(index, index + 3);

  // نهاية الكومة
  if (index >= total) {
    return <EndScreen onRestart={() => setIndex(0)} actions={actions} articles={articles} />;
  }

  return (
    <div className="fixed inset-0 z-[80] bg-gradient-to-br from-[var(--accent)] via-[#0d2440] to-[#1a3a5e] overflow-hidden">
      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 z-30 px-4 py-4 flex items-center justify-between">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          aria-label="إغلاق"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-1.5 text-white/70 text-xs font-bold">
          <Layers className="w-3.5 h-3.5" />
          <span>
            {index + 1} / {total}
          </span>
        </div>
      </div>

      {/* Progress bars */}
      <div className="absolute top-16 inset-x-0 px-4 z-20 flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="flex-1 h-0.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full bg-white transition-all',
                i < index ? 'w-full' : i === index ? 'w-full' : 'w-0',
              )}
            />
          </div>
        ))}
      </div>

      {/* Card stack */}
      <div className="relative h-full w-full flex items-center justify-center px-4 pt-20 pb-32">
        <div className="relative w-full max-w-md h-full max-h-[600px]">
          <AnimatePresence>
            {visible.map((article, idx) => {
              const isTop = idx === 0;
              return (
                <SwipeCard
                  key={article.id}
                  article={article}
                  isTop={isTop}
                  zIndex={visible.length - idx}
                  offset={idx}
                  onSwipeUp={next}
                  onSwipeDown={prev}
                  onLike={() => handleAction('liked')}
                  onSave={() => handleAction('saved')}
                  onSkip={() => handleAction('skip')}
                />
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-0 inset-x-0 z-30 pb-8 pt-4 px-6 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center justify-center gap-4 mb-3">
          <ActionButton
            onClick={() => handleAction('skip')}
            color="bg-white/15 hover:bg-white/25"
            icon={<X className="w-5 h-5" />}
            label="تخطي"
          />
          <ActionButton
            onClick={() => handleAction('liked')}
            color="bg-rose-500 hover:bg-rose-600"
            icon={<Heart className="w-6 h-6 fill-current" />}
            label="إعجاب"
            big
          />
          <ActionButton
            onClick={() => handleAction('saved')}
            color="bg-amber-400 hover:bg-amber-500 text-[#1a3a5e]"
            icon={<Bookmark className="w-5 h-5 fill-current" />}
            label="حفظ"
          />
        </div>
        <p className="text-center text-[10px] text-white/50">
          اسحب للأعلى للتالي • اسحب للأسفل للسابق • Esc للخروج
        </p>
      </div>
    </div>
  );
}

function ActionButton({
  onClick,
  color,
  icon,
  label,
  big,
}: {
  onClick: () => void;
  color: string;
  icon: React.ReactNode;
  label: string;
  big?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-1 rounded-full text-white shadow-lg transition-all hover:scale-110 active:scale-95',
        color,
        big ? 'w-16 h-16' : 'w-12 h-12',
      )}
      aria-label={label}
    >
      {icon}
    </button>
  );
}

function SwipeCard({
  article,
  isTop,
  zIndex,
  offset,
  onSwipeUp,
  onSwipeDown,
  onLike,
  onSave,
  onSkip,
}: {
  article: Article;
  isTop: boolean;
  zIndex: number;
  offset: number;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
  onLike: () => void;
  onSave: () => void;
  onSkip: () => void;
}) {
  const [showDeepen, setShowDeepen] = useState(false);
  const [deepenContent, setDeepenContent] = useState<string[] | null>(null);
  const [deepening, setDeepening] = useState(false);
  const trust = article.sourceTrust ? SOURCE_TRUST_LABELS[article.sourceTrust] : null;

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

  function onDragEnd(_: unknown, info: PanInfo) {
    const threshold = 120;
    if (info.offset.y < -threshold || info.velocity.y < -500) {
      onSwipeUp();
    } else if (info.offset.y > threshold || info.velocity.y > 500) {
      onSwipeDown();
    } else if (info.offset.x < -threshold) {
      onSkip();
    } else if (info.offset.x > threshold) {
      onLike();
    }
  }

  return (
    <motion.div
      drag={isTop ? true : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.4}
      onDragEnd={onDragEnd}
      initial={{ opacity: 0, y: 100, scale: 0.92 }}
      animate={{
        opacity: 1,
        y: offset * 8,
        scale: 1 - offset * 0.04,
      }}
      exit={{ opacity: 0, y: -200, scale: 0.9, transition: { duration: 0.25 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute inset-0 satr-card overflow-hidden flex flex-col cursor-grab active:cursor-grabbing"
      style={{ zIndex }}
    >
      {/* Image */}
      {article.imageUrl ? (
        <div className="relative h-1/2 bg-[var(--accent-light)] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.imageUrl}
            alt={article.imageAlt || article.line1}
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute top-3 right-3 flex gap-2">
            <span className={`cat-badge cat-${article.category} backdrop-blur-md`}>
              {CATEGORY_LABELS[article.category]}
            </span>
            {article.isBreaking && <span className="breaking-badge">عاجل</span>}
          </div>
        </div>
      ) : (
        <div className="h-32 bg-gradient-to-br from-[var(--accent-light)] to-[var(--bg)] flex items-end px-5 pb-4">
          <div className="flex items-center gap-2">
            <span className={`cat-badge cat-${article.category}`}>
              {CATEGORY_LABELS[article.category]}
            </span>
            {article.isBreaking && <span className="breaking-badge">عاجل</span>}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-4 mb-5">
          <div className="relative pr-10">
            <span className="absolute right-0 top-0 w-7 h-7 rounded-full bg-[var(--accent-light)] text-[var(--accent)] text-xs font-black flex items-center justify-center">
              ١
            </span>
            <p className="text-lg font-black leading-relaxed text-[var(--ink)]">{article.line1}</p>
          </div>
          <div className="relative pr-10">
            <span className="absolute right-0 top-0 w-7 h-7 rounded-full bg-[var(--accent-light)] text-[var(--accent)] text-xs font-black flex items-center justify-center">
              ٢
            </span>
            <p className="text-base font-medium leading-relaxed text-[var(--ink-soft)]">
              {article.line2}
            </p>
          </div>
          <div className="relative pr-10">
            <span className="absolute right-0 top-0 w-7 h-7 rounded-full bg-[var(--accent-light)] text-[var(--accent)] text-xs font-black flex items-center justify-center">
              ٣
            </span>
            <p className="text-base font-bold italic leading-relaxed text-[var(--accent)]">
              {article.line3}
            </p>
          </div>
        </div>

        {/* Deepen */}
        {showDeepen && (
          <div className="mb-4 p-4 rounded-xl bg-[var(--accent-light)]/40 border border-[var(--accent-light)]">
            {deepening ? (
              <div className="flex items-center gap-2 text-sm text-[var(--accent)]">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>جاري التوسعة...</span>
              </div>
            ) : (
              <div className="space-y-2 text-sm leading-relaxed text-[var(--ink)]">
                {deepenContent?.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-[var(--ink-faint)] pt-3 border-t border-[var(--border)]">
          <div className="flex items-center gap-3">
            {trust && <span title={trust.label}>{trust.icon}</span>}
            <span>{arabicTimeAgo(article.publishedAt || article.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            {!showDeepen && (
              <button
                onClick={handleDeepen}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-[var(--accent)] bg-[var(--accent-light)] hover:bg-[var(--accent)] hover:text-white transition-all"
              >
                <Sparkles className="w-3 h-3" />
                وضّح
              </button>
            )}
            <Link
              href={`/article/${article.id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-[var(--ink-soft)] hover:bg-[var(--bg)] transition-all"
            >
              <Eye className="w-3 h-3" />
              تابع
            </Link>
          </div>
        </div>
      </div>

      {/* Swipe hints (only on top card) */}
      {isTop && offset === 0 && (
        <>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/40 text-xs flex items-center gap-1 pointer-events-none">
            <ChevronUp className="w-3 h-3" />
            <span>اسحب</span>
          </div>
        </>
      )}
    </motion.div>
  );
}

function EndScreen({
  onRestart,
  actions,
  articles,
}: {
  onRestart: () => void;
  actions: Record<string, string | undefined>;
  articles: Article[];
}) {
  const liked = articles.filter((a) => actions[a.id] === 'liked');
  const saved = articles.filter((a) => actions[a.id] === 'saved');

  return (
    <div className="fixed inset-0 z-[80] bg-gradient-to-br from-[var(--accent)] via-[#0d2440] to-[#1a3a5e] flex items-center justify-center p-6">
      <div className="text-center text-white max-w-sm">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
          <Layers className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black mb-3">تمت قراءة الموجز ✨</h2>
        <p className="text-white/70 mb-6 leading-relaxed">
          خلصت الـ {articles.length} خبر اللي عندنا اليوم. <br />
          {liked.length > 0 && `أعجبك ${liked.length}، `}
          {saved.length > 0 && `وحفظت ${saved.length}.`}
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="px-6 py-3 bg-white text-[var(--accent)] rounded-full font-bold hover:bg-white/90 transition-all"
          >
            أعد المراجعة
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-full font-semibold hover:bg-white/20 transition-all"
          >
            رجوع للموجز
          </Link>
        </div>
      </div>
    </div>
  );
}
